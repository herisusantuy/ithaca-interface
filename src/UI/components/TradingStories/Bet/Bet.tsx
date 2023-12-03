/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
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
import Toast from '@/UI/components/Toast/Toast';

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
import useToast from '@/UI/hooks/useToast';

const Bet = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const { currentSpotPrice, currencyPrecision, currentExpiryDate, ithacaSDK, getContractsByPayoff } = useAppStore();

  const binaryPutContracts = getContractsByPayoff('BinaryPut');
  const binaryCallContracts = getContractsByPayoff('BinaryCall');
  const strikes = binaryPutContracts ? Object.keys(binaryPutContracts).map(strike => parseFloat(strike)) : [];

  const [insideOrOutside, setInsideOrOutside] = useState<'INSIDE' | 'OUTSIDE'>('INSIDE');
  const [strike, setStrike] = useState({ min: strikes[strikes.length > 4 ? 2 : 0], max: strikes[strikes.length > 2 ? strikes.length -3 : 0] });
  const [capitalAtRisk, setCapitalAtRisk] = useState('');
  const [targetEarn, setTargetEarn] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();
  const { toastList, position, showToast } = useToast();

  const handleCapitalAtRiskChange = async (amount: string) => {
    const capitalAtRisk = getNumberValue(amount);
    setCapitalAtRisk(capitalAtRisk);
    await handleStrikeChange(strike, insideOrOutside === 'INSIDE', getNumber(capitalAtRisk));
  };

  const handleBetTypeChange = async (betType: 'INSIDE' | 'OUTSIDE') => {
    setInsideOrOutside(betType);
    await handleStrikeChange(strike, betType === 'INSIDE', getNumber(capitalAtRisk));
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
    const strikeDiff = (strikes[strikes.length - 1] - strikes[0])/7/4;
    const payoffMap = estimateOrderPayoff([
      { ...minContract, ...legMin, premium: minContract.referencePrice },
      { ...maxContract, ...legMax, premium: maxContract.referencePrice },
    ], {
      min: strikes[0] - strikeDiff,
      max: strikes[strikes.length -1] +strikeDiff
    });
    setPayoffMap(payoffMap);
    setTargetEarn(quantity);

    try {
      const orderLock = await ithacaSDK.calculation.estimateOrderLock(order);
      setOrderDetails({
        order,
        orderLock,
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

  useEffect(() => {
    renderInstruction();
  }, [insideOrOutside]);

  const renderInstruction = () => {
    return <>{!compact && showInstructions && <BetInstructions type={insideOrOutside} />}</>;
  };

  return (
    <>
      {renderInstruction()}

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
          extended={true}
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
        // id='bet-chart'
        id={`bet-chart${compact ? '-compact' : ''}`}
        compact={compact}
        chartData={payoffMap ?? CHART_FAKE_DATA}
        height={chartHeight}
        showKeys={false}
        showPortial={!compact}
      />

      {!compact && <StorySummary summary={orderDetails} onSubmit={handleSubmit} />}

      <Toast toastList={toastList} position={position} />
    </>
  );
};

export default Bet;
