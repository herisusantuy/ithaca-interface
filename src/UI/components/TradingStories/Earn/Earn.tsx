/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

// Packages
import React, { useEffect, useState } from 'react';
import { OrderDetails, TradingStoriesProps } from '..';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';

// Components
import Slider from '@/UI/components/Slider/Slider';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
import LogoEth from '@/UI/components/Icons/LogoEth';
import Input from '@/UI/components/Input/Input';
import StorySummary from '@/UI/components/TradingStories/StorySummary/StorySummary';
import LabeledInput from '@/UI/components/LabeledInput/LabeledInput';
import Toast from '@/UI/components/Toast/Toast';

// Utils
import { getNumber, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';

// Constants
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';
import { ContractDetails } from '@/UI/lib/zustand/slices/ithacaSDKSlice';
import {
  ClientConditionalOrder,
  Leg,
  calculateAPY,
  calculateNetPrice,
  createClientOrderId,
  toPrecision,
} from '@ithaca-finance/sdk';
import useToast from '@/UI/hooks/useToast';
import RiskyEarnInstructions from '../../Instructions/RiskyEarnInstructions';
import RisklessEarnInstructions from '../../Instructions/RisklessEarnInstructions';
import RadioButton from '../../RadioButton/RadioButton';
import { RISKY_RISKLESS_EARN_OPTIONS } from '@/UI/constants/options';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration)

const Earn = ({ showInstructions, compact, chartHeight, radioChosen }: TradingStoriesProps) => {
  const { currentSpotPrice, currencyPrecision, currentExpiryDate, ithacaSDK, getContractsByPayoff,  } = useAppStore();
  const callContracts = getContractsByPayoff('Call');
  const putContracts = getContractsByPayoff('Put');

  const [currency, setCurrency] = useState('WETH');

  const strikes = callContracts ? Object.keys(callContracts).reduce<number[]>((strikeArr, currStrike) => {
    const isValidStrike =
      currency === 'WETH' ? parseFloat(currStrike) > currentSpotPrice : parseFloat(currStrike) < currentSpotPrice;
    if (isValidStrike) strikeArr.push(parseFloat(currStrike));
    return strikeArr;
  }, []): [];

  const [riskyOrRiskless, setRiskyOrRiskless] = useState<'Risky Earn' | 'Riskless Earn'>('Risky Earn');
  const [strike, setStrike] = useState({ min: strikes[Math.ceil(strikes.length/2)-1], max: strikes[Math.ceil(strikes.length/2)-1] });
  const [capitalAtRisk, setCapitalAtRisk] = useState('');
  const [targetEarn, setTargetEarn] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();
  const { toastList, position, showToast } = useToast();

  const handleRiskyRisklessChange = (option: 'Risky Earn' | 'Riskless Earn') => {
    setRiskyOrRiskless(option)
  }

  const handleCapitalAtRiskChange = async (amount: string) => {
    if (radioChosen === 'Risky Earn') {
      const capitalAtRisk = getNumberValue(amount);
      setCapitalAtRisk(capitalAtRisk);
      await handleStrikeChange(strike, currency, getNumber(capitalAtRisk));
    }
    else {
      const capitalAtRisk = getNumberValue(amount);
      setCapitalAtRisk(capitalAtRisk);
      handleRisklessChange(capitalAtRisk, targetEarn);
    }
  };
  
  const handleRisklessChange = async (risk:string, earn: string) => {
    const current = dayjs();
    const expiry = dayjs(currentExpiryDate.toString(), 'YYYYMMDD')
    const yearDiff = dayjs.duration(expiry.diff(current)).asYears();
    const APY = (Number(earn)/Number(risk) -1)/yearDiff;
    if (isInvalidNumber(getNumber(earn)) || isInvalidNumber(getNumber(risk))) return;
    const contracts = currency === 'WETH' ? callContracts : putContracts;
    const filteredContracts = Object.keys(contracts).reduce<ContractDetails>((contractDetails, strike) => {
      const isValidStrike =
        currency === 'WETH' ? parseFloat(strike) > currentSpotPrice : parseFloat(strike) < currentSpotPrice;
      if (isValidStrike) contractDetails[strike] = contracts[strike];
      return contractDetails;
    }, {});

    const closest = Object.keys(callContracts).reduce((prev, curr) => {
      return (Math.abs(Number(curr) - currentSpotPrice) < Math.abs(prev - currentSpotPrice) ? Number(curr) : prev);
    }, 0);

    const leg = {
      contractId: filteredContracts[strike.max].contractId,
      // quantity: (Number(earn)/strike.max).toString(),
      quantity: earn,
      side: 'SELL',
    } as Leg;

    const order = {
      clientOrderId: createClientOrderId(),
      totalNetPrice: getNumber((Number(earn)-Number(risk)).toString()).toFixed(currencyPrecision.strike),
      legs: [leg],
      addCollateral: currency === 'WETH',
    } as ClientConditionalOrder;

    const payoffMap = estimateOrderPayoff([
      { ...filteredContracts[strike.max], ...leg, premium: filteredContracts[strike.max].referencePrice },
    ]);
    setPayoffMap(payoffMap);

    try {
      const orderLock = await ithacaSDK.calculation.estimateOrderLock(order);
      setOrderDetails({
        order,
        orderLock,
      });
    } catch (error) {
      // Add toast
      console.error('Order estimation for earn failed', error);
    }
  };

  const handleTargetEarnChange = async (amount: string) => {
    if (radioChosen === 'Risky Earn') {
      const targetEarn = getNumberValue(amount);
      setTargetEarn(targetEarn);
      if (isInvalidNumber(getNumber(targetEarn))) {
        setCapitalAtRisk('');
        setOrderDetails(undefined);
        setPayoffMap(undefined);
        return;
      }

      const contracts = currency === 'WETH' ? callContracts : putContracts;
      const filteredContracts = Object.keys(contracts).reduce<ContractDetails>((contractDetails, strike) => {
        const isValidStrike =
          currency === 'WETH' ? parseFloat(strike) > currentSpotPrice : parseFloat(strike) < currentSpotPrice;
        if (isValidStrike) contractDetails[strike] = contracts[strike];
        return contractDetails;
      }, {});
      const quantity =
        currency === 'WETH'
          ? `${toPrecision(
              getNumber(targetEarn) / filteredContracts[strike.max].referencePrice,
              currencyPrecision.strike
            )}`
          : `${toPrecision(getNumber(capitalAtRisk) / strike.max, currencyPrecision.strike)}`;

      const leg = {
        contractId: filteredContracts[strike.max].contractId,
        quantity,
        side: 'SELL',
      } as Leg;

      const order = {
        clientOrderId: createClientOrderId(),
        totalNetPrice: getNumber(targetEarn).toFixed(currencyPrecision.strike),
        legs: [leg],
        addCollateral: currency === 'WETH',
      } as ClientConditionalOrder;

      const payoffMap = estimateOrderPayoff([
        { ...filteredContracts[strike.max], ...leg, premium: filteredContracts[strike.max].referencePrice },
      ]);
      setPayoffMap(payoffMap);
      setCapitalAtRisk(quantity);

      try {
        const orderLock = await ithacaSDK.calculation.estimateOrderLock(order);
        setOrderDetails({
          order,
          orderLock,
        });
      } catch (error) {
        // Add toast
        console.error('Order estimation for earn failed', error);
      }
    }
    else {
      const targetEarn = getNumberValue(amount);
      setTargetEarn(targetEarn);
      handleRisklessChange(capitalAtRisk, targetEarn);
    }
  };

  const handleStrikeChange = async (strike: { min: number; max: number }, currency: string, capitalAtRisk: number) => {
    if (isInvalidNumber(capitalAtRisk)) {
      setTargetEarn('');
      setOrderDetails(undefined);
      setPayoffMap(undefined);
      return;
    }

    const contracts = currency === 'WETH' ? callContracts : putContracts;
    const filteredContracts = Object.keys(contracts).reduce<ContractDetails>((contractDetails, strike) => {
      const isValidStrike =
        currency === 'WETH' ? parseFloat(strike) > currentSpotPrice : parseFloat(strike) < currentSpotPrice;
      if (isValidStrike) contractDetails[strike] = contracts[strike];
      return contractDetails;
    }, {});
    const quantity =
      currency === 'WETH' ? `${capitalAtRisk}` : `${toPrecision(capitalAtRisk / strike.max, currencyPrecision.strike)}`;

    const leg = {
      contractId: filteredContracts[strike.max].contractId,
      quantity,
      side: 'SELL',
    } as Leg;

    const order = {
      clientOrderId: createClientOrderId(),
      totalNetPrice: capitalAtRisk.toFixed(currencyPrecision.strike),
      legs: [leg],
      addCollateral: currency === 'WETH',
    } as ClientConditionalOrder;

    const payoffMap = estimateOrderPayoff([
      { ...filteredContracts[strike.max], ...leg, premium: filteredContracts[strike.max].referencePrice },
    ]);
    setPayoffMap(payoffMap);
    setTargetEarn(calculateNetPrice([leg], [filteredContracts[strike.max].referencePrice], currencyPrecision.strike));

    try {
      const orderLock = await ithacaSDK.calculation.estimateOrderLock(order);
      setOrderDetails({
        order,
        orderLock,
      });
    } catch (error) {
      // Add toast
      console.error('Order estimation for earn failed', error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    try {
      await ithacaSDK.orders.newOrder(orderDetails.order, 'Earn');
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

    const risk = currency === 'WETH' ? getNumber(capitalAtRisk) * strike.max : getNumber(capitalAtRisk);
    const apy = calculateAPY(`${currentExpiryDate}`, 'Earn', risk, getNumber(targetEarn));
    return <span>{`${apy}%`}</span>;
  };

  useEffect(() => {
    handleCapitalAtRiskChange('100');
  }, []);

  return (
    <>
      {!compact && showInstructions && (radioChosen ==='Risky Earn' ? <RiskyEarnInstructions /> : <RisklessEarnInstructions currentExpiry={currentExpiryDate.toString()}/>)}

      {compact && <Flex margin={compact ? 'mb-10' : 'mb-12'}>
      <RadioButton
        size={compact ? 'compact' : 'regular'}
        width={compact ? 140 : 186}
        options={RISKY_RISKLESS_EARN_OPTIONS}
        selectedOption={riskyOrRiskless}
        name={compact ? 'riskyOrRisklessCompact' : 'riskyOrRiskless'}
        onChange={value => handleRiskyRisklessChange(value as 'Risky Earn' | 'Riskless Earn')}
      />
    </Flex>}

      {!compact && (
        <h3 className='flex-row gap-4 fs-lato-md mb-12'>
          Select Target Price <LogoEth />
        </h3>
      )}
      {(riskyOrRiskless === 'Risky Earn' && compact) || radioChosen === 'Risky Earn' ? <Flex margin='display-inline-flex mb-7'>
        <Slider
          value={strike}
          min={strikes[0]}
          max={strikes[strikes.length - 1]}
          label={strikes.length}
          step={100}
          showLabel={!compact}
          onChange={strike => {
            setStrike(strike);
            handleStrikeChange(strike, currency, getNumber(capitalAtRisk));
          }}
        />
      </Flex> : '' }

      {!compact && riskyOrRiskless === 'Risky Earn' && (
        <Flex gap='gap-36' margin='mt-13 mb-17'>
          <LabeledInput label='Risk' lowerLabel='Capital At Risk' labelClassName='justify-end'>
            <Input
              type='number'
              value={capitalAtRisk}
              onChange={({ target }) => handleCapitalAtRiskChange(target.value)}
              icon={<LogoEth />}
            />
          </LabeledInput>
          <LabeledInput label='Earn' lowerLabel={<span>Expected Return {getAPY()}</span>}>
            <Input
              type='number'
              value={targetEarn}
              onChange={({ target }) => handleTargetEarnChange(target.value)}
              icon={<LogoUsdc />}
            />
          </LabeledInput>
        </Flex>
      )}

      {!compact && riskyOrRiskless === 'Riskless Earn' && (
        <Flex gap='gap-36' margin='mt-13 mb-17'>
          <LabeledInput label='Risk' lowerLabel='Capital At Risk' labelClassName='justify-end'>
            <Input
              type='number'
              value={capitalAtRisk}
              onChange={({ target }) => handleCapitalAtRiskChange(target.value)}
              icon={<LogoEth />}
            />
          </LabeledInput>
          <LabeledInput label='Earn' lowerLabel={<span>Expected Return {getAPY()}</span>}>
            <Input
              type='number'
              value={targetEarn}
              onChange={({ target }) => handleTargetEarnChange(target.value)}
              icon={<LogoUsdc />}
            />
          </LabeledInput>
        </Flex>
      )}

      <ChartPayoff
        // id='earn-chart'
        id={`earn-chart${compact ? '-compact' : ''}`}
        compact={compact}
        chartData={payoffMap ?? CHART_FAKE_DATA}
        height={!compact && showInstructions && radioChosen === 'Riskless Earn' ? 112: chartHeight}
        showKeys={false}
        showPortial={!compact}
      />

      {!compact && <StorySummary summary={orderDetails} onSubmit={handleSubmit} />}

      <Toast toastList={toastList} position={position} />
    </>
  );
};

export default Earn;
