import React, { useState } from 'react';

import styles from './Bet.module.scss';
import Flex from '@/UI/layouts/Flex/Flex';
import Slider from '../../Slider/Slider';
import Input from '../../Input/Input';
import LogoUsdc from '../../Icons/LogoUsdc';
import ChartPayoff from '../../ChartPayoff/ChartPayoff';
import { OrderDetails, TradingStoriesProps } from '..';
import LogoEth from '../../Icons/LogoEth';
import Button from '../../Button/Button';
import { useAppStore } from '@/UI/lib/zustand/store';
import { getNumber, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';
import { ClientConditionalOrder, Leg, Payoff, calculateNetPrice, createClientOrderId } from '@ithaca-finance/sdk';
import RadioButton from '../../RadioButton/RadioButton';
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';

const Bet = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const { currentSpotPrice, currencyPrecision, ithacaSDK, getContractsByPayoff } = useAppStore();

  const binaryPutContracts = getContractsByPayoff(Payoff.BINARY_PUT);
  const binaryCallContracts = getContractsByPayoff(Payoff.BINARY_CALL);
  const strikes = Object.keys(binaryPutContracts).map(strike => parseFloat(strike));

  const [insideOrOutside, setInsideOrOutside] = useState<'inside' | 'outside'>('outside');
  const [strike, setStrike] = useState({ min: strikes[0], max: strikes[5] });
  const [capitalAtRisk, setCapitalAtRisk] = useState('');
  const [targetEarn, setTargetEarn] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();

  const handleCapitalAtRiskChange = async (amount: string) => {
    const capitalAtRisk = getNumberValue(amount);
    setCapitalAtRisk(capitalAtRisk);
    await handleStrikeChange(strike, insideOrOutside === 'inside', getNumber(capitalAtRisk));
  };

  const handleBetTypeChange = async (betType: 'inside' | 'outside') => {
    setInsideOrOutside(betType);
    await handleStrikeChange(strike, betType === 'inside', getNumber(capitalAtRisk));
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
      console.error('Order estimation for bet failed', error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    try {
      await ithacaSDK.orders.newOrder(orderDetails.order, 'Bet');
    } catch (error) {
      console.error('Failed to submit order', error);
    }
  };

  return (
    <div>
      {!compact && showInstructions && (
        <div className={styles.instructions}>
          <div>
            Bet & Earn Return if <LogoEth /> at Expiry Range.
          </div>
          <div>i. Bet on Range; Capital at Risk.</div>
          <div>ii. Select Range.</div>
          <div>iii. Enter Target Earn.</div>
          <div>iv. Expected Return reflects the probability of at Expiry Range.</div>
        </div>
      )}
      {compact && (
        <Flex>
          <Slider
            value={strike}
            min={strikes[0]}
            max={strikes[strikes.length - 1]}
            label={strikes.length}
            step={100}
            onChange={strike => {
              setStrike(strike);
              handleStrikeChange(strike, insideOrOutside === 'inside', getNumber(capitalAtRisk));
            }}
            range
          />
        </Flex>
      )}
      <Flex margin='mt-10 mb-24'>
        <RadioButton
          options={[
            { option: 'Inside Range', value: 'inside' },
            { option: 'Outside Range', value: 'outside' },
          ]}
          selectedOption={insideOrOutside}
          name={compact ? 'insideOrOutsideCompact' : 'insideOrOutside'}
          onChange={betType => handleBetTypeChange(betType as 'inside' | 'outside')}
        />
      </Flex>
      {!compact && (
        <Flex margin='mb-10'>
          <Slider
            value={strike}
            min={strikes[0]}
            max={strikes[strikes.length - 1]}
            label={strikes.length}
            step={100}
            onChange={strike => {
              setStrike(strike);
              handleStrikeChange(strike, insideOrOutside === 'inside', getNumber(capitalAtRisk));
            }}
            range
          />
        </Flex>
      )}
      {!compact && (
        <div className={styles.betInputs}>
          <div className={styles.gridWrapper}>
            <Flex direction='row-center'>
              <span className={styles.label}>Bet</span>
            </Flex>
            <div className={styles.inputWrapper}>
              <Input
                type='number'
                value={capitalAtRisk}
                onChange={({ target }) => handleCapitalAtRiskChange(target.value)}
                icon={<LogoUsdc />}
              />
            </div>
            <span />
            <span className={`${styles.label} ${styles.inputHint}`}>Capital At Risk</span>
          </div>
          <div>
            <div className={styles.returnsWrapper}>
              <div className={styles.earnWrapper}>
                <span className={styles.label}>Target Earn</span>
                <span className={styles.earn}>{targetEarn}</span>
                <LogoUsdc />
              </div>
            </div>
            <div className={styles.aprWrapper}>
              <span className={`${styles.label} ${styles.inputHint}`}>Expected Return</span>
              <span className={styles.apr}>46.6%</span>
            </div>
          </div>
        </div>
      )}
      <div className={styles.payoff}>
        {!compact && <h4>Payoff Diagram</h4>}
        <ChartPayoff chartData={payoffMap ?? CHART_FAKE_DATA} height={chartHeight} showKeys={false} />
      </div>
      {!compact && (
        <div className={styles.orderSummary}>
          <div className={styles.summary}>
            <h5>Total Premium</h5>
            <div className={styles.summaryInfoWrapper}>
              <h3>{1500}</h3>
              <LogoUsdc />
              <p>USDC</p>
            </div>
          </div>
          <div className={styles.summary}>
            <h6>Platform Fee</h6>
            <div className={styles.summaryInfoWrapper}>
              <small>{1.5}</small>
              <LogoUsdc />
              <small>USDC</small>
            </div>
          </div>
          <Button size='sm' title='Click to submit to auction' onClick={handleSubmit}>
            Submit to Auction
          </Button>
        </div>
      )}
    </div>
  );
};

export default Bet;
