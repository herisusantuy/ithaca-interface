import React, { useEffect, useState } from 'react';
import { OrderDetails, TradingStoriesProps } from '../../TradingStories';
import Flex from '@/UI/layouts/Flex/Flex';
import RadioButton from '../../RadioButton/RadioButton';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';
import LogoUsdc from '../../Icons/LogoUsdc';
import Input from '../../Input/Input';

import styles from './Forwards.module.scss';
import LogoEth from '../../Icons/LogoEth';
import PriceLabel from '../../PriceLabel/PriceLabel';
import Button from '../../Button/Button';
import ChartPayoff from '../../ChartPayoff/ChartPayoff';
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';
import { useAppStore } from '@/UI/lib/zustand/store';
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import { getNumber, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';
import {
  Leg,
  ClientConditionalOrder,
  createClientOrderId,
  calculateNetPrice,
  calcCollateralRequirement,
} from '@ithaca-finance/sdk';
import dayjs from 'dayjs';

const Forwards = ({ compact, chartHeight }: TradingStoriesProps) => {
  const { ithacaSDK, currencyPrecision, currentExpiryDate, expiryList, getContractsByPayoff, getContractsByExpiry } =
    useAppStore();
  const currentForwardContract = getContractsByPayoff('Forward')['-'];
  const nextAuctionForwardContract = getContractsByExpiry(
    `${expiryList[expiryList.indexOf(currentExpiryDate) + 1]}`,
    'Forward'
  )['-'];

  const [currentOrNextAuction, setCurrentOrNextAuction] = useState<'CURRENT' | 'NEXT'>('CURRENT');
  const [buyOrSell, setBuyOrSell] = useState<'BUY' | 'SELL'>('BUY');
  const [size, setSize] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();

  const handleCurrentOrNextAuctionChange = async (currentOrNextAuction: 'CURRENT' | 'NEXT') => {
    setCurrentOrNextAuction(currentOrNextAuction);
    await handleStrikeChange(currentOrNextAuction, buyOrSell, getNumber(size));
  };

  const handleBuyOrSellChange = async (buyOrSell: 'BUY' | 'SELL') => {
    setBuyOrSell(buyOrSell);
    await handleStrikeChange(currentOrNextAuction, buyOrSell, getNumber(size), unitPrice);
  };

  const handleSizeChange = async (amount: string) => {
    const size = getNumberValue(amount);
    setSize(size);
    await handleStrikeChange(currentOrNextAuction, buyOrSell, getNumber(size), unitPrice);
  };

  const handleUnitPriceChange = async (amount: string) => {
    const unitPrice = getNumberValue(amount);
    setUnitPrice(unitPrice);
    await handleStrikeChange(currentOrNextAuction, buyOrSell, getNumber(size), unitPrice);
  };

  const handleStrikeChange = async (
    currentOrNextAuction: 'CURRENT' | 'NEXT',
    buyOrSell: 'BUY' | 'SELL',
    size: number,
    unitPrice?: string
  ) => {
    if (isInvalidNumber(size)) {
      setOrderDetails(undefined);
      setPayoffMap(undefined);
      return;
    }

    const contract = currentOrNextAuction === 'CURRENT' ? currentForwardContract : nextAuctionForwardContract;
    const leg: Leg = {
      contractId: contract.contractId,
      quantity: `${size}`,
      side: buyOrSell,
    };
    const referencePrice = unitPrice ? getNumber(unitPrice) : contract.referencePrice;
    const order: ClientConditionalOrder = {
      clientOrderId: createClientOrderId(),
      totalNetPrice: calculateNetPrice([leg], [referencePrice], currencyPrecision.strike),
      legs: [leg],
    };

    const payoffMap = estimateOrderPayoff([{ ...contract, ...leg, premium: referencePrice }]);
    setPayoffMap(payoffMap);
    if (!unitPrice) setUnitPrice(`${referencePrice}`);

    try {
      const orderLock = await ithacaSDK.calculation.estimateOrderLock(order);
      const orderPayoff = await ithacaSDK.calculation.estimateOrderPayoff(order);
      setOrderDetails({
        order,
        orderLock,
        orderPayoff,
      });
    } catch (error) {
      console.error(`Order estimation for forward failed`, error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    try {
      await ithacaSDK.orders.newOrder(orderDetails.order, 'Forward');
    } catch (error) {
      console.error('Failed to submit order', error);
    }
  };

  const calcCollateral = () => {
    if (isInvalidNumber(getNumber(size))) return '-';
    const contract = currentOrNextAuction === 'CURRENT' ? currentForwardContract : nextAuctionForwardContract;
    const leg = {
      contractId: contract.contractId,
      quantity: size,
      side: buyOrSell,
    };
    return calcCollateralRequirement(leg, 'Forward', 0, currencyPrecision.strike);
  };

  useEffect(() => {
    handleSizeChange('100');
  }, []);

  return (
    <div>
      {!compact && (
        <Flex margin={`${compact ? 'mb-12' : 'mb-34'}`} gap='gap-6'>
          <div>
            {!compact && <label className={styles.label}>Type</label>}
            <RadioButton
              width={200}
              options={[
                { option: dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('DDMMMYY'), value: 'CURRENT' },
                { option: 'Next Auction', value: 'NEXT' },
              ]}
              name={compact ? 'currentOrNextAuctionCompact' : 'currentOrNextAuction'}
              selectedOption={currentOrNextAuction}
              onChange={value => handleCurrentOrNextAuctionChange(value as 'CURRENT' | 'NEXT')}
            />
          </div>
          <div>
            <label className={styles.label}>Side</label>
            <RadioButton
              options={[
                { option: '+', value: 'BUY' },
                { option: '-', value: 'SELL' },
              ]}
              name='buyOrSell'
              orientation='vertical'
              selectedOption={buyOrSell}
              onChange={value => handleBuyOrSellChange(value as 'BUY' | 'SELL')}
            />
          </div>
          <div>
            <label className={styles.label}>Size</label>
            <Input
              type='number'
              icon={<LogoEth />}
              value={size}
              onChange={({ target }) => handleSizeChange(target.value)}
            />
          </div>
          <div>
            <label className={styles.label}>Strike</label>
            <DropdownMenu disabled options={[]} iconEnd={<LogoUsdc />} />
          </div>
          <div>
            <label className={styles.label}>Unit Price</label>
            <Input
              type='number'
              icon={<LogoUsdc />}
              value={unitPrice}
              onChange={({ target }) => handleUnitPriceChange(target.value)}
            />
          </div>
          <div>
            <label className={styles.label}>Collateral</label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '60%',
              }}
            >
              <PriceLabel icon={<LogoEth />} label={calcCollateral()} />
            </div>
          </div>
          <div>
            <label className={styles.label}>Premium</label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '60%',
              }}
            >
              <PriceLabel icon={<LogoUsdc />} label={orderDetails ? orderDetails.order.totalNetPrice : '-'} />
            </div>
          </div>
          <div style={{ alignSelf: 'flex-end' }} onClick={handleSubmit}>
            <Button size='sm' title='Click to submit to auction'>
              Submit to Auction
            </Button>
          </div>
        </Flex>
      )}
      <ChartPayoff
        compact={compact}
        chartData={payoffMap ?? CHART_FAKE_DATA}
        height={chartHeight}
        showKeys={false}
        showPortial={!compact}
      />
      {!compact && (
        <Flex direction='row-space-between' gap='gap-4' padding='p-10'>
          <h5 className={styles.greeks}>Greeks</h5>
          <div>
            <label className={styles.greeksLabel}>
              <span>&Delta;</span>Delta
            </label>
            <div className={styles.greeksAmount}>38 {`<unit>`}</div>
          </div>
          <div>
            <label className={styles.greeksLabel}>
              <span>&nu;</span>Vega
            </label>
            <div className={styles.greeksAmount}>38 {`<unit>`}</div>
          </div>
          <div>
            <label className={styles.greeksLabel}>
              <span>&Gamma;</span>Gamma
            </label>
            <div className={styles.greeksAmount}>38 {`<unit>`}</div>
          </div>
          <div>
            <label className={styles.greeksLabel}>
              <span>&theta;</span>Theta
            </label>
            <div className={styles.greeksAmount}>38 {`<unit>`}</div>
          </div>
          <div>
            <label className={styles.greeksLabel}>
              <span>&Rho;</span>Rho
            </label>
            <div className={styles.greeksAmount}>38 {`<unit>`}</div>
          </div>
        </Flex>
      )}
    </div>
  );
};

export default Forwards;
