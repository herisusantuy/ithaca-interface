import React, { useState } from 'react';
import { OrderDetails, TradingStoriesProps } from '../../TradingStories';
import Flex from '@/UI/layouts/Flex/Flex';
import RadioButton from '../../RadioButton/RadioButton';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';
import LogoUsdc from '../../Icons/LogoUsdc';
import Input from '../../Input/Input';

import styles from './DigitalOptions.module.scss';
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

const DigitalOptions = ({ compact, chartHeight }: TradingStoriesProps) => {
  const { ithacaSDK, currencyPrecision, getContractsByPayoff } = useAppStore();
  const binaryCallContracts = getContractsByPayoff('BinaryCall');
  const binaryPutContracts = getContractsByPayoff('BinaryPut');
  const strikes = Object.keys(binaryCallContracts).map(strike => ({ name: strike, value: strike }));

  const [binaryCallOrPut, setBinaryCallOrPut] = useState<'BinaryCall' | 'BinaryPut'>('BinaryCall');
  const [buyOrSell, setBuyOrSell] = useState<'BUY' | 'SELL'>('BUY');
  const [size, setSize] = useState('');
  const [strike, setStrike] = useState<string>();
  const [unitPrice, setUnitPrice] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();

  const handleBinaryCallOrPutChange = async (binaryCallOrPut: 'BinaryCall' | 'BinaryPut') => {
    setBinaryCallOrPut(binaryCallOrPut);
    if (!strike) return;
    await handleStrikeChange(binaryCallOrPut, buyOrSell, getNumber(size), strike);
  };

  const handleBuyOrSellChange = async (buyOrSell: 'BUY' | 'SELL') => {
    setBuyOrSell(buyOrSell);
    if (!strike) return;
    await handleStrikeChange(binaryCallOrPut, buyOrSell, getNumber(size), strike, unitPrice);
  };

  const handleSizeChange = async (amount: string) => {
    const size = getNumberValue(amount);
    setSize(size);
    if (!strike) return;
    await handleStrikeChange(binaryCallOrPut, buyOrSell, getNumber(size), strike, unitPrice);
  };

  const handleUnitPriceChange = async (amount: string) => {
    const unitPrice = getNumberValue(amount);
    setUnitPrice(unitPrice);
    if (!strike) return;
    await handleStrikeChange(binaryCallOrPut, buyOrSell, getNumber(size), strike, unitPrice);
  };

  const handleStrikeChange = async (
    binaryCallOrPut: 'BinaryCall' | 'BinaryPut',
    buyOrSell: 'BUY' | 'SELL',
    size: number,
    strike: string,
    unitPrice?: string
  ) => {
    if (isInvalidNumber(size)) {
      setOrderDetails(undefined);
      setPayoffMap(undefined);
      return;
    }

    const contract = binaryCallOrPut === 'BinaryCall' ? binaryCallContracts[strike] : binaryPutContracts[strike];
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
      console.error(`Order estimation for ${binaryCallOrPut} failed`, error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    try {
      await ithacaSDK.orders.newOrder(orderDetails.order, binaryCallOrPut);
    } catch (error) {
      console.error('Failed to submit order', error);
    }
  };

  const calcCollateral = () => {
    if (!strike || isInvalidNumber(getNumber(size))) return '-';
    const contract = binaryCallOrPut === 'BinaryCall' ? binaryCallContracts[strike] : binaryPutContracts[strike];
    const leg = {
      contractId: contract.contractId,
      quantity: size,
      side: buyOrSell,
    };
    return calcCollateralRequirement(leg, binaryCallOrPut, getNumber(strike), currencyPrecision.strike);
  };

  return (
    <div>
      <Flex margin={`${compact ? 'mb-12' : 'mb-34'}`} gap='gap-10'>
        <div>
          {!compact && <label className={styles.label}>Type</label>}
          <RadioButton
            options={[
              { option: 'Call', value: 'BinaryCall' },
              { option: 'Put', value: 'BinaryPut' },
            ]}
            name={compact ? 'binaryCallOrPutCompact' : 'binaryCallOrPut'}
            selectedOption={binaryCallOrPut}
            onChange={value => handleBinaryCallOrPutChange(value as 'BinaryCall' | 'BinaryPut')}
          />
        </div>
        {!compact && (
          <>
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
              <DropdownMenu
                options={strikes}
                iconEnd={<LogoUsdc />}
                value={strike ? { name: strike, value: strike } : undefined}
                onChange={value => {
                  setStrike(value);
                  handleStrikeChange(binaryCallOrPut, buyOrSell, getNumber(size), value);
                }}
              />
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
          </>
        )}
      </Flex>
      <div className={styles.payoff}>
        {!compact && <h4>Payoff Diagram</h4>}
        <ChartPayoff
          chartData={payoffMap ?? CHART_FAKE_DATA}
          height={chartHeight}
          showKeys={false}
          showPortial={!compact}
        />
      </div>
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

export default DigitalOptions;
