/* eslint-disable react-hooks/exhaustive-deps */
// Packages
import React, { useEffect, useState } from 'react';
import { OrderDetails, TradingStoriesProps } from '..';

// Components
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
import DropdownMenu from '@/UI/components/DropdownMenu/DropdownMenu';
import Input from '@/UI/components/Input/Input';
import RadioButton from '@/UI/components/RadioButton/RadioButton';
import BarrierInstructions from '@/UI/components/Instructions/BarrierInstructions';
import LabeledControl from '@/UI/components/LabeledControl/LabeledControl';
import BarrierDescription from '@/UI/components/Instructions/BarrierDescription';
import StorySummary from '@/UI/components/TradingStories/StorySummary/StorySummary';
import Toast from '@/UI/components/Toast/Toast';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';

// Constants
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';
import { IN_OUT_OPTIONS, SIDE_OPTIONS, TYPE_OPTIONS, UP_DOWN_OPTIONS } from '@/UI/constants/options';

// Utils
import { getNumber, getNumberFormat, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';
import { OptionLeg, PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';
import { ClientConditionalOrder, Leg, calculateNetPrice, createClientOrderId } from '@ithaca-finance/sdk';
import useToast from '@/UI/hooks/useToast';

const Barriers = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const { ithacaSDK, currencyPrecision, getContractsByPayoff } = useAppStore();
  const callContracts = getContractsByPayoff('Call');
  const putContracts = getContractsByPayoff('Put');
  const binaryCallContracts = getContractsByPayoff('BinaryCall');
  const binaryPutContracts = getContractsByPayoff('BinaryPut');

  const [buyOrSell, setBuyOrSell] = useState<'BUY' | 'SELL'>('BUY');
  const [upOrDown, setUpOrDown] = useState<'UP' | 'DOWN'>('UP');
  const [inOrOut, setInOrOut] = useState<'IN' | 'OUT'>('IN');
  const [strike, setStrike] = useState<string>('1900');
  const [barrier, setBarrier] = useState<string | undefined>('2300');
  const [size, setSize] = useState('');
  const [unitPrice, setUnitPrice] = useState('-');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();

  const { toastList, position, showToast } = useToast();

  const strikes = Object.keys(callContracts).reduce<string[]>((strikeArr, currStrike) => {
    const isValidStrike = barrier
      ? upOrDown === 'UP'
        ? parseFloat(currStrike) < parseFloat(barrier)
        : parseFloat(currStrike) > parseFloat(barrier)
      : true;
    if (isValidStrike) strikeArr.push(currStrike);
    return strikeArr;
  }, []);

  const barrierStrikes = Object.keys(callContracts).reduce<string[]>((strikeArr, currStrike) => {
    const isValidStrike = strike
      ? upOrDown === 'UP'
        ? parseFloat(currStrike) > parseFloat(strike)
        : parseFloat(currStrike) < parseFloat(strike)
      : true;
    if (isValidStrike) strikeArr.push(currStrike);
    return strikeArr;
  }, []);

  const handleBuyOrSellChange = async (buyOrSell: 'BUY' | 'SELL') => {
    setBuyOrSell(buyOrSell);
    if (!strike || !barrier) return;
    prepareOrderLegs(buyOrSell, upOrDown, strike, inOrOut, barrier, getNumber(size));
  };

  const handleUpOrDownChange = async (upOrDown: 'UP' | 'DOWN') => {
    setUpOrDown(upOrDown);
    setBarrier(undefined);
    setUnitPrice('-');
    setOrderDetails(undefined);
    setPayoffMap(undefined);
  };

  const handleInOrOutChange = async (inOrOut: 'IN' | 'OUT') => {
    setInOrOut(inOrOut);
    if (!strike || !barrier) return;
    await prepareOrderLegs(buyOrSell, upOrDown, strike, inOrOut, barrier, getNumber(size));
  };

  const handleStrikeChange = async (strike: string) => {
    setStrike(strike);
    if (!strike || !barrier) return;
    await prepareOrderLegs(buyOrSell, upOrDown, strike, inOrOut, barrier, getNumber(size));
  };

  const handleBarrierChange = async (barrier: string) => {
    setBarrier(barrier);
    if (!strike || !barrier) return;
    await prepareOrderLegs(buyOrSell, upOrDown, strike, inOrOut, barrier, getNumber(size));
  };

  const handleSizeChange = async (amount: string) => {
    const size = getNumberValue(amount);
    setSize(size);
    if (!strike || !barrier) return;
    await prepareOrderLegs(buyOrSell, upOrDown, strike, inOrOut, barrier, getNumber(size));
  };

  const prepareOrderLegs = async (
    buyOrSell: 'BUY' | 'SELL',
    upOrDown: 'UP' | 'DOWN',
    strike: string,
    inOrOut: 'IN' | 'OUT',
    barrier: string,
    size: number
  ) => {
    if (isInvalidNumber(size)) {
      setUnitPrice('-');
      setOrderDetails(undefined);
      setPayoffMap(undefined);
      return;
    }

    let legs: Leg[];
    let referencePrices: number[];
    let estimatePayoffData: OptionLeg[];
    if (upOrDown === 'UP') {
      if (inOrOut === 'IN') {
        const buyCallContract = callContracts[barrier];
        const buyBinaryCallContract = binaryCallContracts[barrier];
        const buyCallLeg: Leg = {
          contractId: buyCallContract.contractId,
          quantity: `${size}`,
          side: buyOrSell,
        };
        const buyBinaryCallLeg: Leg = {
          contractId: buyBinaryCallContract.contractId,
          quantity: `${size * (getNumber(barrier) - getNumber(strike))}`,
          side: buyOrSell,
        };
        legs = [buyCallLeg, buyBinaryCallLeg];
        referencePrices = [buyCallContract.referencePrice, buyBinaryCallContract.referencePrice];
        estimatePayoffData = [
          {
            ...buyCallContract,
            ...buyCallLeg,
            premium: buyCallContract.referencePrice,
          },
          {
            ...buyBinaryCallContract,
            ...buyBinaryCallLeg,
            premium: buyBinaryCallContract.referencePrice,
          },
        ];
      } else {
        const buyCallContract = callContracts[strike];
        const sellCallContract = callContracts[barrier];
        const sellBinaryCallContract = binaryCallContracts[barrier];

        const buyCallLeg: Leg = {
          contractId: buyCallContract.contractId,
          quantity: `${size}`,
          side: buyOrSell,
        };

        const sellCallLeg: Leg = {
          contractId: sellCallContract.contractId,
          quantity: `${size}`,
          side: buyOrSell === 'BUY' ? 'SELL' : 'BUY',
        };

        const sellBinaryCallLeg: Leg = {
          contractId: sellBinaryCallContract.contractId,
          quantity: `${size * (getNumber(barrier) - getNumber(strike))}`,
          side: buyOrSell === 'BUY' ? 'SELL' : 'BUY',
        };

        legs = [buyCallLeg, sellCallLeg, sellBinaryCallLeg];
        referencePrices = [
          buyCallContract.referencePrice,
          sellCallContract.referencePrice,
          sellBinaryCallContract.referencePrice,
        ];

        estimatePayoffData = [
          {
            ...buyCallContract,
            ...buyCallLeg,
            premium: buyCallContract.referencePrice,
          },
          {
            ...sellCallContract,
            ...sellCallLeg,
            premium: sellCallContract.referencePrice,
          },
          {
            ...sellBinaryCallContract,
            ...sellBinaryCallLeg,
            premium: sellBinaryCallContract.referencePrice,
          },
        ];
      }
    } else {
      if (inOrOut == 'IN') {
        const buyPutContract = putContracts[barrier];
        const buyBinaryPutContract = binaryPutContracts[barrier];
        const buyPutLeg: Leg = {
          contractId: buyPutContract.contractId,
          quantity: `${size}`,
          side: buyOrSell,
        };

        const buyBinaryPutLeg: Leg = {
          contractId: buyBinaryPutContract.contractId,
          quantity: `${size * (getNumber(strike) - getNumber(barrier))}`,
          side: buyOrSell,
        };

        legs = [buyPutLeg, buyBinaryPutLeg];
        referencePrices = [buyPutContract.referencePrice, buyBinaryPutContract.referencePrice];
        estimatePayoffData = [
          {
            ...buyPutContract,
            ...buyPutLeg,
            premium: buyPutContract.referencePrice,
          },
          {
            ...buyBinaryPutContract,
            ...buyBinaryPutLeg,
            premium: buyBinaryPutContract.referencePrice,
          },
        ];
      } else {
        const buyPutContract = putContracts[strike];
        const sellPutContract = putContracts[barrier];
        const sellBinaryPutContract = binaryPutContracts[barrier];

        const buyPutLeg: Leg = {
          contractId: buyPutContract.contractId,
          quantity: `${size}`,
          side: buyOrSell,
        };

        const sellPutLeg: Leg = {
          contractId: sellPutContract.contractId,
          quantity: `${size}`,
          side: buyOrSell === 'BUY' ? 'SELL' : 'BUY',
        };

        const sellBinaryPutLeg: Leg = {
          contractId: sellBinaryPutContract.contractId,
          quantity: `${size * (getNumber(strike) - getNumber(barrier))}`,
          side: buyOrSell === 'BUY' ? 'SELL' : 'BUY',
        };

        legs = [buyPutLeg, sellPutLeg, sellBinaryPutLeg];
        referencePrices = [
          buyPutContract.referencePrice,
          sellPutContract.referencePrice,
          sellBinaryPutContract.referencePrice,
        ];
        estimatePayoffData = [
          {
            ...buyPutContract,
            ...buyPutLeg,
            premium: buyPutContract.referencePrice,
          },
          {
            ...sellPutContract,
            ...sellPutLeg,
            premium: sellPutContract.referencePrice,
          },
          {
            ...sellBinaryPutContract,
            ...sellBinaryPutLeg,
            premium: sellBinaryPutContract.referencePrice,
          },
        ];
      }
    }

    const unitPrice = calculateNetPrice(legs, referencePrices, currencyPrecision.strike, size);
    setUnitPrice(getNumberFormat(unitPrice));

    const order: ClientConditionalOrder = {
      clientOrderId: createClientOrderId(),
      totalNetPrice: calculateNetPrice(legs, referencePrices, currencyPrecision.strike),
      legs,
    };

    const payoffMap = estimateOrderPayoff(estimatePayoffData);
    setPayoffMap(payoffMap);

    try {
      const orderLock = await ithacaSDK.calculation.estimateOrderLock(order);
      const orderPayoff = await ithacaSDK.calculation.estimateOrderPayoff(order);
      setOrderDetails({
        order,
        orderLock,
        orderPayoff,
      });
    } catch (error) {
      // Add toast
      console.error('Order estimation for barriers failed', error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    try {
      await ithacaSDK.orders.newOrder(orderDetails.order, 'Barriers');
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
      console.error('Failed to submit order', error);
    }
  };

  useEffect(() => {
    handleSizeChange('100');
  }, []);

  return (
    <>
      {!compact && showInstructions && <BarrierInstructions />}
      {compact ? (
        <Flex gap='gap-3' margin='mb-10'>
          <RadioButton
            size={compact ? 'compact' : 'regular'}
            options={SIDE_OPTIONS}
            selectedOption={buyOrSell}
            name='buyOrSellCompact'
            orientation='vertical'
            onChange={value => handleBuyOrSellChange(value as 'BUY' | 'SELL')}
          />

          <RadioButton
            size={compact ? 'compact' : 'regular'}
            options={UP_DOWN_OPTIONS}
            selectedOption={upOrDown}
            name='upOrDownCompact'
            orientation='vertical'
            onChange={value => handleUpOrDownChange(value as 'UP' | 'DOWN')}
          />

          <RadioButton
            size={compact ? 'compact' : 'regular'}
            options={IN_OUT_OPTIONS}
            selectedOption={inOrOut}
            name='inOrOutCompact'
            orientation='vertical'
            onChange={value => handleInOrOutChange(value as 'IN' | 'OUT')}
          />
        </Flex>
      ) : (
        <Flex direction='column' margin='mt-20 mb-14' gap='gap-16'>
          <Flex direction='row-center' gap='gap-10'>
            {/** Needs hooking up */}
            <LabeledControl label='Type'>
              <RadioButton
                size={compact ? 'compact' : 'regular'}
                width={compact ? 140 : 186}
                options={TYPE_OPTIONS}
                selectedOption={undefined}
                name='type'
                onChange={() => {}}
              />
            </LabeledControl>

            <LabeledControl label='Side'>
              <Flex gap='gap-10'>
                <RadioButton
                  width={42}
                  options={SIDE_OPTIONS}
                  selectedOption={buyOrSell}
                  name='buyOrSell'
                  orientation='vertical'
                  onChange={value => handleBuyOrSellChange(value as 'BUY' | 'SELL')}
                />
                <RadioButton
                  width={50}
                  options={UP_DOWN_OPTIONS}
                  selectedOption={upOrDown}
                  name='upOrDown'
                  orientation='vertical'
                  onChange={value => handleUpOrDownChange(value as 'UP' | 'DOWN')}
                />
              </Flex>
            </LabeledControl>

            <LabeledControl label='Strike'>
              <DropdownMenu
                options={strikes.map(strike => ({ name: strike, value: strike }))}
                value={strike ? { name: strike, value: strike } : undefined}
                onChange={handleStrikeChange}
              />
            </LabeledControl>

            <p className='mt-22'>Knock</p>

            <div className='mt-22'>
              <RadioButton
                width={50}
                options={IN_OUT_OPTIONS}
                selectedOption={inOrOut}
                name='inOrOut'
                orientation='vertical'
                onChange={value => handleInOrOutChange(value as 'IN' | 'OUT')}
              />
            </div>

            <p className='mt-22'>@</p>

            <LabeledControl label='Barrier'>
              <DropdownMenu
                options={barrierStrikes.map(strike => ({ name: strike, value: strike }))}
                value={barrier ? { name: barrier, value: barrier } : undefined}
                onChange={handleBarrierChange}
              />
            </LabeledControl>

            <LabeledControl label='Size'>
              <Input type='number' value={size} onChange={({ target }) => handleSizeChange(target.value)} />
            </LabeledControl>
          </Flex>

          <Flex direction='row-center'>
            <p className='fs-lato-sm mr-14'>Total Premium</p>
            <p className='fs-md-bold mr-4'>{orderDetails ? getNumberFormat(orderDetails.order.totalNetPrice) : '-'}</p>
            <LogoUsdc />
            <p className='ml-32 fs-lato-sm-italic mr-12'>Unit Price</p>
            <p className='mr-4 fs-roboto-md-italic'>{unitPrice}</p>
            <LogoUsdc />
          </Flex>
        </Flex>
      )}

      {!compact && showInstructions && <BarrierDescription />}

      <Toast toastList={toastList} position={position} />

      <ChartPayoff
        // id='barriers-chart'
        id={`barriers-chart${compact ? '-compact' : ''}`}
        compact={compact}
        chartData={payoffMap ?? CHART_FAKE_DATA}
        height={chartHeight}
        showKeys={false}
        showPortial={!compact}
      />

      {!compact && <StorySummary showCollateral summary={orderDetails} onSubmit={handleSubmit} />}
    </>
  );
};

export default Barriers;
