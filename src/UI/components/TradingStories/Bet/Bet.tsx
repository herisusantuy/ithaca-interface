// Packages
import React, { useEffect, useState } from 'react';
import { OrderDetails, TradingStoriesProps } from '..';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';

// Components
import Slider from '@/UI/components/Slider/Slider';
import Input from '@/UI/components/Input/Input';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
import StorySummary from '@/UI/components/TradingStories/StorySummary/StorySummary';
import BetInstructions from '@/UI/components/Instructions/BetInstructions';
import RadioButton from '@/UI/components/RadioButton/RadioButton';
import LabeledInput from '@/UI/components/LabeledInput/LabeledInput';

// Utils
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import { getNumber, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';

// Constants
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';
import { BET_OPTIONS } from '@/UI/constants/options';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';
import {
  ClientConditionalOrder,
  Leg,
  calculateAPY,
  calculateNetPrice,
  createClientOrderId,
  toPrecision,
} from '@ithaca-finance/sdk';

const Bet = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const { currentSpotPrice, currencyPrecision, currentExpiryDate, ithacaSDK, getContractsByPayoff } = useAppStore();

  const binaryPutContracts = getContractsByPayoff('BinaryPut');
  const binaryCallContracts = getContractsByPayoff('BinaryCall');
  const strikes = Object.keys(binaryPutContracts).map(strike => parseFloat(strike));

  const [insideOrOutside, setInsideOrOutside] = useState<'INSIDE' | 'OUTSIDE'>('OUTSIDE');
  const [strike, setStrike] = useState({ min: strikes[0], max: strikes[5] });
  const [capitalAtRisk, setCapitalAtRisk] = useState('');
  const [targetEarn, setTargetEarn] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();

  const handleCapitalAtRiskChange = async (amount: string) => {
    const capitalAtRisk = getNumberValue(amount);
    setCapitalAtRisk(capitalAtRisk);
    await handleStrikeChange(strike, insideOrOutside === 'INSIDE', getNumber(capitalAtRisk));
  };

  const handleBetTypeChange = async (betType: 'INSIDE' | 'OUTSIDE') => {
    setInsideOrOutside(betType);
    await handleStrikeChange(strike, betType === 'INSIDE', getNumber(capitalAtRisk));
  };

  // Needs to be updated
  const handleTargetEarnChange = async (amount: string) => {
    const targetEarn = getNumberValue(amount);
    setTargetEarn(targetEarn);
    if (isInvalidNumber(getNumber(targetEarn))) {
      setCapitalAtRisk('');
      setOrderDetails(undefined);
      setPayoffMap(undefined);
      return;
    }

    const inRange = insideOrOutside === 'INSIDE';
    const isBelowSpot = strike.min < currentSpotPrice && strike.max < currentSpotPrice;

    const minContract = !inRange
      ? binaryPutContracts[strike.min]
      : isBelowSpot
      ? binaryPutContracts[strike.max]
      : binaryCallContracts[strike.min];
    const maxContract = !inRange
      ? binaryCallContracts[strike.max]
      : isBelowSpot
      ? binaryPutContracts[strike.min]
      : binaryCallContracts[strike.max];

    const legMin: Leg = {
      contractId: minContract.contractId,
      quantity: targetEarn as `${number}`,
      side: 'BUY',
    };
    const legMax: Leg = {
      contractId: maxContract.contractId,
      quantity: targetEarn as `${number}`,
      side: !inRange ? 'BUY' : 'SELL',
    };

    const totalNetPrice = calculateNetPrice(
      [legMin, legMax],
      [minContract.referencePrice, maxContract.referencePrice],
      currencyPrecision.strike
    );
    const size = toPrecision(getNumber(targetEarn) * getNumber(totalNetPrice), currencyPrecision.strike);

    const order = {
      clientOrderId: createClientOrderId(),
      totalNetPrice,
      legs: [legMin, legMax],
    } as ClientConditionalOrder;

    const payoffMap = estimateOrderPayoff([
      { ...minContract, ...legMin, premium: minContract.referencePrice },
      { ...maxContract, ...legMax, premium: maxContract.referencePrice },
    ]);
    setPayoffMap(payoffMap);
    setCapitalAtRisk(`${size}`);

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
      console.error('Order estimation for bet failed', error);
    }
  };

  const handleStrikeChange = async (strike: { min: number; max: number }, inRange: boolean, capitalAtRisk: number) => {
    if (isInvalidNumber(capitalAtRisk)) {
      setTargetEarn('');
      setOrderDetails(undefined);
      setPayoffMap(undefined);
      return;
    }

    const isBelowSpot = strike.min < currentSpotPrice && strike.max < currentSpotPrice;

    const minContract = !inRange
      ? binaryPutContracts[strike.min]
      : isBelowSpot
      ? binaryPutContracts[strike.max]
      : binaryCallContracts[strike.min];
    const maxContract = !inRange
      ? binaryCallContracts[strike.max]
      : isBelowSpot
      ? binaryPutContracts[strike.min]
      : binaryCallContracts[strike.max];

    let quantity = (isInvalidNumber(getNumber(targetEarn)) ? '1' : targetEarn) as `${number}`;
    let legMin: Leg = {
      contractId: minContract.contractId,
      quantity,
      side: 'BUY',
    };
    let legMax: Leg = {
      contractId: maxContract.contractId,
      quantity,
      side: !inRange ? 'BUY' : 'SELL',
    };

    const spread = calculateNetPrice(
      [legMin, legMax],
      [minContract.referencePrice, maxContract.referencePrice],
      currencyPrecision.strike,
      getNumber(quantity)
    );
    quantity = (capitalAtRisk / getNumber(spread)).toFixed(currencyPrecision.strike) as `${number}`;

    legMin = { ...legMin, quantity };
    legMax = { ...legMax, quantity };

    const order = {
      clientOrderId: createClientOrderId(),
      totalNetPrice: capitalAtRisk.toFixed(currencyPrecision.strike),
      legs: [legMin, legMax],
    } as ClientConditionalOrder;

    const payoffMap = estimateOrderPayoff([
      { ...minContract, ...legMin, premium: minContract.referencePrice },
      { ...maxContract, ...legMax, premium: maxContract.referencePrice },
    ]);
    setPayoffMap(payoffMap);
    setTargetEarn(quantity);

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
      console.error('Order estimation for bet failed', error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    try {
      await ithacaSDK.orders.newOrder(orderDetails.order, 'Bet');
    } catch (error) {
      // Add toast
      console.error('Failed to submit order', error);
    }
  };

  const getAPY = () => {
    if (isInvalidNumber(getNumber(capitalAtRisk)) || isInvalidNumber(getNumber(targetEarn))) {
      return <span>-%</span>;
    }
    const apy = calculateAPY(`${currentExpiryDate}`, 'Bet', getNumber(capitalAtRisk), getNumber(targetEarn));
    return <span>{`${apy}%`}</span>;
  };

  useEffect(() => {
    handleCapitalAtRiskChange('100');
  }, []);

  return (
    <>
      {!compact && showInstructions && <BetInstructions />}

      {compact && (
        <Flex margin='display-inline-flex mb-7'>
          <Slider
            value={strike}
            min={strikes[0]}
            max={strikes[strikes.length - 1]}
            label={strikes.length}
            step={100}
            showLabel={false}
            onChange={strike => {
              setStrike(strike);
              handleStrikeChange(strike, insideOrOutside === 'INSIDE', getNumber(capitalAtRisk));
            }}
            range
          />
        </Flex>
      )}

      <Flex margin={`${compact ? 'mt-7 mb-4' : 'mt-10 mb-24'}`}>
        <RadioButton
          size={compact ? 'compact' : 'regular'}
          width={compact ? 140 : 221}
          options={BET_OPTIONS}
          selectedOption={insideOrOutside}
          name={compact ? 'insideOrOutsideCompact' : 'insideOrOutside'}
          onChange={betType => handleBetTypeChange(betType as 'INSIDE' | 'OUTSIDE')}
        />
      </Flex>

      {!compact && (
        <Slider
          value={strike}
          min={strikes[0]}
          max={strikes[strikes.length - 1]}
          label={strikes.length}
          step={100}
          onChange={strike => {
            setStrike(strike);
            handleStrikeChange(strike, insideOrOutside === 'INSIDE', getNumber(capitalAtRisk));
          }}
          range
        />
      )}

      {!compact && (
        <Flex gap='gap-36' margin='mt-13 mb-17'>
          <LabeledInput label='Bet' lowerLabel='Capital At Risk' labelClassName='justify-end'>
            <Input
              type='number'
              value={capitalAtRisk}
              onChange={({ target }) => handleCapitalAtRiskChange(target.value)}
              icon={<LogoUsdc />}
            />
          </LabeledInput>
          <LabeledInput label='Target Earn' lowerLabel={<span>Expected Return {getAPY()}</span>}>
            <Input
              type='number'
              value={capitalAtRisk}
              onChange={({ target }) => handleCapitalAtRiskChange(target.value)}
              icon={<LogoUsdc />}
            />
          </LabeledInput>
        </Flex>
      )}

      <ChartPayoff
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

export default Bet;
