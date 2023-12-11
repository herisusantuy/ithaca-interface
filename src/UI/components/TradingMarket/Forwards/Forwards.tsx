/* eslint-disable react-hooks/exhaustive-deps */
// Packages
import React, { useEffect, useState } from 'react';
import { OrderDetails, TradingStoriesProps } from '../../TradingStories';
import dayjs from 'dayjs';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';

// Components
import RadioButton from '@/UI/components/RadioButton/RadioButton';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Input from '@/UI/components/Input/Input';
import LogoEth from '@/UI/components/Icons/LogoEth';
import PriceLabel from '@/UI/components/PriceLabel/PriceLabel';
import Button from '@/UI/components/Button/Button';
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
import Toast from '@/UI/components/Toast/Toast';

// Constants
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';

// Utils
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import { getNumber, getNumberFormat, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';
import {
  Leg,
  ClientConditionalOrder,
  createClientOrderId,
  calculateNetPrice,
  calcCollateralRequirement,
} from '@ithaca-finance/sdk';
import LabeledControl from '../../LabeledControl/LabeledControl';
import { SIDE_OPTIONS } from '@/UI/constants/options';
import useToast from '@/UI/hooks/useToast';
import ForwardInstructions from '../../Instructions/ForwardInstructions';

const Forwards = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const { ithacaSDK, currencyPrecision, currentExpiryDate, getContractsByPayoff, spotContract } =
    useAppStore();
  const currentForwardContract = getContractsByPayoff('Forward')['-'];
  const nextAuctionForwardContract = spotContract;

  const [currentOrNextAuction, setCurrentOrNextAuction] = useState<'CURRENT' | 'NEXT'>('NEXT');
  const [buyOrSell, setBuyOrSell] = useState<'BUY' | 'SELL'>('BUY');
  const [size, setSize] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();

  const { toastList, position, showToast } = useToast();

  const handleCurrentOrNextAuctionChange = async (currentOrNextAuction: 'CURRENT' | 'NEXT') => {
    setCurrentOrNextAuction(currentOrNextAuction);
    const contract = currentOrNextAuction === 'CURRENT' ? currentForwardContract : nextAuctionForwardContract;
    setUnitPrice(`${contract.referencePrice}`);
    await handleStrikeChange(currentOrNextAuction, buyOrSell, getNumber(size), `${contract.referencePrice}`);
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
    if (isInvalidNumber(size) || isInvalidNumber(Number(unitPrice))) {
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
    // if (!unitPrice) setUnitPrice(`${referencePrice}`);

    try {
      const orderLock = await ithacaSDK.calculation.estimateOrderLock(order);
      setOrderDetails({
        order,
        orderLock,
      });
    } catch (error) {
      console.error(`Order estimation for forward failed`, error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    try {
      await ithacaSDK.orders.newOrder(orderDetails.order, 'Forward');
      showToast(
        {
          id: Math.floor(Math.random() * 1000),
          title: 'Transaction Sent',
          message: 'We have received your request',
          type: 'info',
        },
        'top-right'
      );
    } catch (error) {
      showToast(
        {
          id: Math.floor(Math.random() * 1000),
          title: 'Transaction Failed',
          message: 'Transaction Failed, please try again.',
          type: 'error',
        },
        'top-right'
      );
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
    const collateral = calcCollateralRequirement(leg, 'Forward', 0, currencyPrecision.strike);
    return getNumberFormat(collateral, 'double');
  };

  useEffect(() => {
    handleSizeChange('1');
    const contract = currentOrNextAuction === 'CURRENT' ? currentForwardContract : nextAuctionForwardContract;
    setUnitPrice(`${contract.referencePrice}`);
  }, []);


  const renderInstruction = () => {
    return (
      <>
        {!compact && showInstructions && <ForwardInstructions/>}
      </>
    )
  }

  return (
    <>
    {renderInstruction()}
      {!compact && (
        <Flex margin={`${compact ? 'mb-12' : 'mb-34'}`} gap='gap-6'>
          <LabeledControl label='Type'>
            <RadioButton
              width={160}
              options={[
                { option: 'Next Auction', value: 'NEXT' },
                { option: dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('DDMMMYY'), value: 'CURRENT' }
              ]}
              name={compact ? 'currentOrNextAuctionCompact' : 'currentOrNextAuction'}
              selectedOption={currentOrNextAuction}
              onChange={value => handleCurrentOrNextAuctionChange(value as 'CURRENT' | 'NEXT')}
            />
          </LabeledControl>

          <LabeledControl label='Side'>
            <RadioButton
              options={SIDE_OPTIONS}
              name='buyOrSell'
              orientation='vertical'
              selectedOption={buyOrSell}
              onChange={value => handleBuyOrSellChange(value as 'BUY' | 'SELL')}
            />
          </LabeledControl>

          {/** Mising validation */}
          <LabeledControl label='Size'>
            <Input
              type='number'
              icon={<LogoEth />}
              value={size}
              onChange={({ target }) => handleSizeChange(target.value)}
            />
          </LabeledControl>

          <LabeledControl label='Unit Price'>
            <Input
              type='number'
              icon={<LogoUsdc />}
              value={unitPrice}
              onChange={({ target }) => handleUnitPriceChange(target.value)}
            />
          </LabeledControl>

          <LabeledControl label='Collateral' labelClassName='justify-end'>
            <PriceLabel className='height-34 min-width-71' icon={<LogoEth />} label={calcCollateral()} />
          </LabeledControl>

          <LabeledControl label='Premium' labelClassName='justify-end'>
            <PriceLabel
              className='height-34 min-width-71'
              icon={<LogoUsdc />}
              label={orderDetails ? getNumberFormat(orderDetails.order.totalNetPrice) : '-'}
            />
          </LabeledControl>

          {/** Add disabled logic, add wrong network and not connected logic */}
          <Button size='sm' title='Click to submit to auction' onClick={handleSubmit} className='align-self-end'>
            Submit to Auction
          </Button>
        </Flex>
      )}

      <Toast toastList={toastList} position={position} />

      <ChartPayoff
        // id='forwards-chart'
        id={`forwards-chart${compact ? '-compact' : ''}`}
        compact={compact}
        chartData={payoffMap ?? CHART_FAKE_DATA}
        height={chartHeight}
        showKeys={false}
        showPortial={!compact}
      />
    </>
  );
};

export default Forwards;
