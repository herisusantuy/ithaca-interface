/* eslint-disable react-hooks/exhaustive-deps */
// Packages
import React, { ReactElement, useEffect, useState } from 'react';
import { OrderDetails, TradingStoriesProps } from '..';

// Components
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
import { IN_OUT_OPTIONS, SIDE_OPTIONS, UP_DOWN_OPTIONS } from '@/UI/constants/options';

// Utils
import { formatNumberByCurrency, getNumber, getNumberFormat, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';
import { OptionLeg, PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';
import { ClientConditionalOrder, Leg, createClientOrderId } from '@ithaca-finance/sdk';
import useToast from '@/UI/hooks/useToast';
import LogoEth from '../../Icons/LogoEth';
import PriceLabel from '../../PriceLabel/PriceLabel';
import LogoUsdc from '../../Icons/LogoUsdc';

// Styles
import styles from './Barriers.module.scss';
import { DESCRIPTION_OPTIONS } from '@/UI/constants/tabCard';
import radioButtonStyles from '@/UI/components/RadioButton/RadioButton.module.scss';
import OrderSummary from '../../OrderSummary/OrderSummary';

const Barriers = ({ showInstructions, compact, chartHeight, onRadioChange }: TradingStoriesProps) => {
  const { ithacaSDK, getContractsByPayoff, currentExpiryDate } = useAppStore();
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

  let strikes: string[];
  if (callContracts) {
    const strikeInitialData = Object.keys(callContracts);
    strikeInitialData.pop();
    strikeInitialData.shift();
    strikes = strikeInitialData.reduce<string[]>((strikeArr, currStrike) => {
      const isValidStrike = barrier
        ? upOrDown === 'UP'
          ? parseFloat(currStrike) < parseFloat(barrier)
          : parseFloat(currStrike) > parseFloat(barrier)
        : true;
      if (isValidStrike) strikeArr.push(currStrike);
      return strikeArr;
    }, []);
  } else {
    strikes = [];
  }

  const barrierStrikes = callContracts
    ? Object.keys(callContracts).reduce<string[]>((strikeArr, currStrike) => {
        const isValidStrike = strike
          ? upOrDown === 'UP'
            ? parseFloat(currStrike) > parseFloat(strike)
            : parseFloat(currStrike) < parseFloat(strike)
          : true;
        if (isValidStrike) strikeArr.push(currStrike);
        return strikeArr;
      }, [])
    : [];

  const handleBuyOrSellChange = async (buyOrSell: 'BUY' | 'SELL') => {
    setBuyOrSell(buyOrSell);
    if (!strike || !barrier) return;
    prepareOrderLegs(buyOrSell, upOrDown, strike, inOrOut, barrier, getNumber(size), getNumber(unitPrice));
  };

  const handleUpOrDownChange = async (upOrDown: 'UP' | 'DOWN') => {
    setUpOrDown(upOrDown);
    if (onRadioChange) onRadioChange(DESCRIPTION_OPTIONS[`${upOrDown}_${inOrOut}`]);
    if (!strike || !barrier) return;
    await prepareOrderLegs(buyOrSell, upOrDown, strike, inOrOut, barrier, getNumber(size), getNumber(unitPrice));
  };

  const handleInOrOutChange = async (inOrOut: 'IN' | 'OUT') => {
    setInOrOut(inOrOut);
    if (onRadioChange) onRadioChange(DESCRIPTION_OPTIONS[`${upOrDown}_${inOrOut}`]);
    if (!strike || !barrier) return;
    await prepareOrderLegs(buyOrSell, upOrDown, strike, inOrOut, barrier, getNumber(size), getNumber(unitPrice));
  };

  const handleStrikeChange = async (strike: string) => {
    setStrike(strike);
    if (!strike || !barrier) return;
    await prepareOrderLegs(buyOrSell, upOrDown, strike, inOrOut, barrier, getNumber(size), getNumber(unitPrice));
  };

  const handleBarrierChange = async (barrier: string) => {
    setBarrier(barrier);
    if (!strike || !barrier) return;
    await prepareOrderLegs(buyOrSell, upOrDown, strike, inOrOut, barrier, getNumber(size), getNumber(unitPrice));
  };

  const handleSizeChange = async (amount: string) => {
    const size = getNumberValue(amount);
    setSize(size);
    if (!strike || !barrier) return;
    await prepareOrderLegs(buyOrSell, upOrDown, strike, inOrOut, barrier, getNumber(size), getNumber(unitPrice));
  };

  const handlePriceChange = async (price: string) => {
    setUnitPrice(price);
    if (!strike || !barrier) return;
    await prepareOrderLegs(buyOrSell, upOrDown, strike, inOrOut, barrier, getNumber(size), getNumber(price));
  };

  const prepareOrderLegs = async (
    buyOrSell: 'BUY' | 'SELL',
    upOrDown: 'UP' | 'DOWN',
    strike: string,
    inOrOut: 'IN' | 'OUT',
    barrier: string,
    size: number,
    price: number
  ) => {
    if (isInvalidNumber(size) || isInvalidNumber(price)) {
      setOrderDetails(undefined);
      setPayoffMap(undefined);
      return;
    }

    let legs: Leg[];
    // let referencePrices: number[];
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
        // referencePrices = [buyCallContract.referencePrice, buyBinaryCallContract.referencePrice];
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
        // referencePrices = [
        //   buyCallContract.referencePrice,
        //   sellCallContract.referencePrice,
        //   sellBinaryCallContract.referencePrice,
        // ];

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
        // referencePrices = [buyPutContract.referencePrice, buyBinaryPutContract.referencePrice];
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
        // referencePrices = [
        //   buyPutContract.referencePrice,
        //   sellPutContract.referencePrice,
        //   sellBinaryPutContract.referencePrice,
        // ];
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

    // const unitPrice = calculateNetPrice(legs, referencePrices, currencyPrecision.strike, size);
    // setUnitPrice(getNumberFormat(unitPrice));

    const totalPrice = legs.reduce((acc, leg) => {
      acc = (getNumber(leg.quantity) * price) + acc;
      return acc;
    }, 0)
    const order: ClientConditionalOrder = {
      clientOrderId: createClientOrderId(),
      totalNetPrice: `${totalPrice}`,
      legs,
    };

    const payoffMap = estimateOrderPayoff(estimatePayoffData);
    setPayoffMap(payoffMap);

    try {
      const orderLock = await ithacaSDK.calculation.estimateOrderLock(order);
      setOrderDetails({
        order,
        orderLock,
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

  useEffect(() => {
    renderInstruction();
  }, [buyOrSell]);

  const renderInstruction = () => {
    return (
      <>
        {!compact && showInstructions && (
          <BarrierInstructions upOrDown={upOrDown} inOrOut={inOrOut} currentExpiry={currentExpiryDate.toString()} />
        )}
      </>
    );
  };

  return (
    <>
      {renderInstruction()}
      {compact ? (
        <Flex gap='gap-3' margin='mb-10'>
          <RadioButton
            size={compact ? 'compact' : 'regular'}
            options={SIDE_OPTIONS}
            selectedOption={buyOrSell}
            name='buyOrSellCompact'
            orientation='vertical'
            onChange={value => handleBuyOrSellChange(value as 'BUY' | 'SELL')}
            radioButtonClassName={styles.sideRadioButtonClassName}
            labelClassName={radioButtonStyles.microLabels}
          />

          <RadioButton
            size={compact ? 'compact' : 'regular'}
            options={UP_DOWN_OPTIONS}
            selectedOption={upOrDown}
            name='upOrDownCompact'
            orientation='vertical'
            onChange={value => handleUpOrDownChange(value as 'UP' | 'DOWN')}
            labelClassName={radioButtonStyles.microLabels}
          />

          <RadioButton
            size={compact ? 'compact' : 'regular'}
            options={IN_OUT_OPTIONS}
            selectedOption={inOrOut}
            name='inOrOutCompact'
            orientation='vertical'
            onChange={value => handleInOrOutChange(value as 'IN' | 'OUT')}
            labelClassName={radioButtonStyles.microLabels}
          />
        </Flex>
      ) : (
        <Flex direction='column' margin='mt-20 mb-20' gap='gap-16'>
          <Flex direction='row-center' gap='gap-10'>
            {/** Needs hooking up */}

            <LabeledControl label='Side'>
              <RadioButton
                labelClassName={radioButtonStyles.microLabels}
                width={42}
                options={SIDE_OPTIONS}
                selectedOption={buyOrSell}
                name='buyOrSell'
                orientation='vertical'
                onChange={value => handleBuyOrSellChange(value as 'BUY' | 'SELL')}
              />
            </LabeledControl>
            <LabeledControl label=''>
              <RadioButton
                width={50}
                options={UP_DOWN_OPTIONS}
                selectedOption={upOrDown}
                name='upOrDown'
                orientation='vertical'
                onChange={value => handleUpOrDownChange(value as 'UP' | 'DOWN')}
                radioButtonClassName={styles.radioButtonClassName}
                optionClassName={styles.optionClassName}
                labelClassName={`${styles.labelClassName} ${radioButtonStyles.microLabels}`}
              />
            </LabeledControl>

            <LabeledControl label='Strike'>
              <DropdownMenu
                width={80}
                options={strikes.map(strike => ({ name: strike, value: strike }))}
                value={strike ? { name: strike, value: strike } : undefined}
                onChange={handleStrikeChange}
              />
            </LabeledControl>

            <h5 className='mt-22 color-white'>Knock</h5>

            <LabeledControl label=''>
              <RadioButton
                width={50}
                options={IN_OUT_OPTIONS}
                selectedOption={inOrOut}
                name='inOrOut'
                orientation='vertical'
                onChange={value => handleInOrOutChange(value as 'IN' | 'OUT')}
                radioButtonClassName={styles.radioButtonClassName}
                optionClassName={styles.optionClassName}
                labelClassName={`${styles.labelClassName} ${radioButtonStyles.microLabels}`}
              />
            </LabeledControl>

            <p className='mt-22'>@</p>

            <LabeledControl label='Barrier'>
              <DropdownMenu
                width={80}
                options={barrierStrikes.map(strike => ({ name: strike, value: strike }))}
                value={barrier ? { name: barrier, value: barrier } : undefined}
                onChange={handleBarrierChange}
              />
            </LabeledControl>

            <LabeledControl label='Size'>
              <Input type='number' value={size} onChange={({ target }) => handleSizeChange(target.value)} width={80} />
            </LabeledControl>

            <LabeledControl label='Unit Price'>
              <Input
                type='number'
                value={unitPrice}
                onChange={({ target }) => handlePriceChange(target.value)}
                width={80}
              />
            </LabeledControl>
            <LabeledControl label='Collateral' labelClassName='justify-end'>
              <PriceLabel className='height-34 min-width-71 color-white-60' icon={<LogoEth />} 
                label={orderDetails ? formatNumberByCurrency(orderDetails.orderLock.numeraireAmount, 'string', 'WETH') : '-'}/>
            </LabeledControl>

            <LabeledControl label='Premium' labelClassName='justify-end'>
              <PriceLabel
                className='height-34 min-width-71 color-white-60'
                icon={<LogoUsdc />}
                label={orderDetails ? formatNumberByCurrency(orderDetails.orderLock.underlierAmount, 'string', 'USDC') : '-'}
              />
            </LabeledControl>
          </Flex>
        </Flex>
      )}

      {!compact && showInstructions && (
        <BarrierDescription
          upOrDown={upOrDown}
          buyOrSell={buyOrSell}
          inOrOut={inOrOut}
          currentExpiryDate={currentExpiryDate.toString()}
          strikeAmount={strike}
          barrierAmount={barrier}
        />
      )}

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

      {!compact && <StorySummary summary={orderDetails} onSubmit={handleSubmit} />}
    </>
  );
};

export default Barriers;
