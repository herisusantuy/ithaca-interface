/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// Packages
import React, { useEffect, useState } from 'react';
import { OrderDetails, TradingStoriesProps } from '..';
import { PositionBuilderStrategy, AuctionSubmission, OrderSummary } from '@/pages/trading/position-builder';

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
import SubmitModal from '@/UI/components/SubmitModal/SubmitModal';
import OrderSummaryMarkets from '@/UI/components/OrderSummary/OrderSummary';

// Utils
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import { formatNumber, getNumber, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';

// Constants
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';
import { BET_OPTIONS } from '@/UI/constants/options';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';
import {
  ClientConditionalOrder,
  Leg,
  // calculateAPY,
  calculateNetPrice,
  createClientOrderId,
  toPrecision,
} from '@ithaca-finance/sdk';
import useToast from '@/UI/hooks/useToast';
import { calculateAPY } from '@/UI/utils/APYCalc';

//Styles
import radioButtonStyles from '@/UI/components/RadioButton/RadioButton.module.scss';

const Bet = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const {
    currentSpotPrice,
    currencyPrecision,
    currentExpiryDate,
    ithacaSDK,
    getContractsByPayoff,
    unFilteredContractList,
  } = useAppStore();

  const binaryPutContracts = getContractsByPayoff('BinaryPut');
  const binaryCallContracts = getContractsByPayoff('BinaryCall');
  const strikes = binaryPutContracts ? Object.keys(binaryPutContracts).map(strike => parseFloat(strike)) : [];

  const [insideOrOutside, setInsideOrOutside] = useState<'INSIDE' | 'OUTSIDE'>('INSIDE');
  const [strike, setStrike] = useState({
    min: strikes[Math.ceil(strikes.length / 2) - 1],
    max: strikes[strikes.length > 1 ? Math.ceil(strikes.length / 2) : 0],
  });
  const [capitalAtRisk, setCapitalAtRisk] = useState('');
  const [targetEarn, setTargetEarn] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();
  const [submitModal, setSubmitModal] = useState<boolean>(false);
  const { toastList, position, showToast } = useToast();
  const [auctionSubmission, setAuctionSubmission] = useState<AuctionSubmission | undefined>();
  const [positionBuilderStrategies, setPositionBuilderStrategies] = useState<PositionBuilderStrategy[]>([]);

  const handleBetTypeChange = (betType: 'INSIDE' | 'OUTSIDE') => {
    setInsideOrOutside(betType);
  };

  const handleCapitalAtRiskChange = (amount: string) => {
    const capitalAtRisk = getNumberValue(amount);
    setCapitalAtRisk(capitalAtRisk);
  };

  useEffect(() => {
    handleStrikeChange(strike, insideOrOutside === 'INSIDE', getNumber(capitalAtRisk), getNumber(targetEarn));
  }, [capitalAtRisk, strike, insideOrOutside, targetEarn]);

  const handleTargetEarnChange = async (amount: string) => {
    const targetEarn = getNumberValue(amount);
    setTargetEarn(targetEarn);
    await handleStrikeChange(strike, insideOrOutside === 'INSIDE', getNumber(capitalAtRisk), getNumber(targetEarn));
  };

  const handleStrikeChange = async (
    strike: { min: number; max: number },
    inRange: boolean,
    capitalAtRisk: number,
    targetEarn: number
  ) => {
    if (isInvalidNumber(capitalAtRisk) || isInvalidNumber(targetEarn)) {
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

    const quantity = `${targetEarn}` as `${number}`;
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

    legMin = { ...legMin, quantity };
    legMax = { ...legMax, quantity };

    const order = {
      clientOrderId: createClientOrderId(),
      totalNetPrice: capitalAtRisk.toFixed(currencyPrecision.strike),
      legs: [legMin, legMax],
    } as ClientConditionalOrder;

    const strikeDiff = (strikes[strikes.length - 1] - strikes[0]) / 7 / 4;
    const payoffMap = estimateOrderPayoff(
      [
        { ...minContract, ...legMin, premium: capitalAtRisk / targetEarn },
        { ...maxContract, ...legMax, premium: 0 },
      ],
      {
        min: strikes[0] - strikeDiff,
        max: strikes[strikes.length - 1] + strikeDiff,
      }
    );

    setPayoffMap(payoffMap);

    try {
      const orderLock = await ithacaSDK.calculation.estimateOrderLock(order);
      const orderFees = await ithacaSDK.calculation.estimateOrderFees(order);
      setOrderDetails({
        order,
        orderLock,
        orderFees
      });
    } catch (error) {
      // Add toast
      console.error('Order estimation for bet failed', error);
    }
  };
  const handleSubmit = async () => {
    if (!orderDetails) return;
    const newPositionBuilderStrategies = orderDetails.order.legs.map(leg => {
      const contract = unFilteredContractList.find(contract => contract.contractId == leg.contractId);
      if (!contract) throw new Error(`Contract not found for leg with contractId ${leg.contractId}`);

      return {
        leg: leg,
        strike: contract.economics.strike,
        payoff: contract.payoff,
        // referencePrice: contract.economics.strike,
      } as unknown as PositionBuilderStrategy;
    });

    setPositionBuilderStrategies(newPositionBuilderStrategies);
    setAuctionSubmission({
      order: orderDetails?.order,
      type: 'Bet',
    });
    setSubmitModal(true);
  };
  const submitToAuction = async (order: ClientConditionalOrder, orderDescr: string) => {
    try {
      await ithacaSDK.orders.newOrder(order, orderDescr);
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
    if (
      isInvalidNumber(getNumber(capitalAtRisk)) ||
      isInvalidNumber(getNumber(targetEarn)) ||
      !strike.max ||
      !strike.min
    ) {
      return <span>-%</span>;
    }
    const apy = calculateAPY(
      `${binaryCallContracts[strike.max].economics.expiry}`,
      getNumber(capitalAtRisk),
      getNumber(targetEarn)
    );
    return <span>{`${apy}%`}</span>;
  };

  useEffect(() => {
    handleCapitalAtRiskChange('100');
    handleTargetEarnChange('300');
  }, []);

  useEffect(() => {
    renderInstruction();
  }, [insideOrOutside]);

  const renderInstruction = () => {
    return (
      <>
        {!compact && showInstructions && (
          <BetInstructions type={insideOrOutside} currentExpiryDate={currentExpiryDate.toString()} />
        )}
      </>
    );
  };

  return (
    <>
      {renderInstruction()}

      {compact && (
        <Flex margin='mb-7'>
          <Slider
            value={strike}
            min={strikes[0]}
            max={strikes[strikes.length - 1]}
            label={strikes.length}
            step={100}
            showLabel={false}
            onChange={strike => {
              setStrike(strike);
              // handleStrikeChange(strike, insideOrOutside === 'INSIDE', getNumber(capitalAtRisk));
            }}
            range
          />
        </Flex>
      )}

      <Flex margin={`${compact ? 'mt-7 mb-4' : 'mt-10 mb-24'}`}>
        <RadioButton
          labelClassName={radioButtonStyles.microLabels}
          size={compact ? 'compact' : 'regular'}
          width={compact ? 186 : 221}
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
            // handleStrikeChange(strike, insideOrOutside === 'INSIDE', getNumber(capitalAtRisk));
          }}
          range
        />
      )}

      {!compact && (
        <Flex gap='gap-36' margin='mt-13 mb-17'>
          <LabeledInput label='Bet' lowerLabel='Capital At Risk'>
            <Input
              type='number'
              value={capitalAtRisk}
              width={110}
              onChange={({ target }) => handleCapitalAtRiskChange(target.value)}
              icon={<LogoUsdc />}
            />
          </LabeledInput>
          <LabeledInput
            label='Target Earn'
            lowerLabel={null}
          >
            <Input
              type='number'
              value={targetEarn}
              width={110}
              onChange={({ target }) => handleTargetEarnChange(target.value)}
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

      {orderDetails && (
        <SubmitModal
          isOpen={submitModal}
          closeModal={val => setSubmitModal(val)}
          submitOrder={() => {
            if (!auctionSubmission) return;
            submitToAuction(auctionSubmission.order, auctionSubmission.type);
            setAuctionSubmission(undefined);
            setSubmitModal(false);
          }}
          auctionSubmission={auctionSubmission}
          positionBuilderStrategies={positionBuilderStrategies}
          orderSummary={orderDetails as unknown as OrderSummary}
        />
      )}

      {/* {!compact && <StorySummary summary={orderDetails} onSubmit={handleSubmit} />} */}
      {!compact && <OrderSummaryMarkets
        asContainer={false}
        limit={formatNumber(Number(orderDetails?.order.totalNetPrice), 'string') || '-'}
        collatarelETH={orderDetails ? formatNumber(orderDetails.orderLock.underlierAmount, 'string') : '-'}
        collatarelUSDC={
          orderDetails
            ? formatNumber(
              toPrecision(
                orderDetails.orderLock.numeraireAmount,
                currencyPrecision.strike
              ),
              'string'
            )
            : '-'
        }
        fee={orderDetails ? orderDetails.orderFees.numeraireAmount : '-'}
        premium={orderDetails?.order.totalNetPrice}
        submitAuction={handleSubmit} />}


      <Toast toastList={toastList} position={position} />
    </>
  );
};

export default Bet;
