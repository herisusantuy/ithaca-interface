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
import EarnInstructions from '@/UI/components/Instructions/EarnInstructions';
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

const Earn = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const { currentSpotPrice, currencyPrecision, currentExpiryDate, ithacaSDK, getContractsByPayoff } = useAppStore();
  const callContracts = getContractsByPayoff('Call');
  const putContracts = getContractsByPayoff('Put');

  const [currency, setCurrency] = useState('WETH');

  const strikes = Object.keys(callContracts).reduce<number[]>((strikeArr, currStrike) => {
    const isValidStrike =
      currency === 'WETH' ? parseFloat(currStrike) > currentSpotPrice : parseFloat(currStrike) < currentSpotPrice;
    if (isValidStrike) strikeArr.push(parseFloat(currStrike));
    return strikeArr;
  }, []);

  const [strike, setStrike] = useState({ min: strikes[0], max: strikes[0] });
  const [capitalAtRisk, setCapitalAtRisk] = useState('');
  const [targetEarn, setTargetEarn] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();
  const { toastList, position, showToast } = useToast();

  const handleCapitalAtRiskChange = async (amount: string) => {
    const capitalAtRisk = getNumberValue(amount);
    setCapitalAtRisk(capitalAtRisk);
    await handleStrikeChange(strike, currency, getNumber(capitalAtRisk));
  };

  const handleTargetEarnChange = async (amount: string) => {
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
      const orderPayoff = await ithacaSDK.calculation.estimateOrderPayoff(order);
      setOrderDetails({
        order,
        orderLock,
        orderPayoff,
      });
    } catch (error) {
      // Add toast
      console.error('Order estimation for earn failed', error);
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
      const orderPayoff = await ithacaSDK.calculation.estimateOrderPayoff(order);
      setOrderDetails({
        order,
        orderLock,
        orderPayoff,
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
      {!compact && showInstructions && <EarnInstructions />}

      {!compact && (
        <h3 className='flex-row gap-4 fs-lato-md mb-12'>
          Select Target Price <LogoEth />
        </h3>
      )}
      <Flex margin='display-inline-flex mb-7'>
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
      </Flex>

      {!compact && (
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
        height={chartHeight}
        showKeys={false}
        showPortial={!compact}
      />

      {!compact && <StorySummary summary={orderDetails} onSubmit={handleSubmit} />}

      <Toast toastList={toastList} position={position} />
    </>
  );
};

export default Earn;
