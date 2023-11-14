import React, { useState } from 'react';

import styles from './Earn.module.scss';
import Flex from '@/UI/layouts/Flex/Flex';
import Slider from '../../Slider/Slider';
import LogoUsdc from '../../Icons/LogoUsdc';
import ChartPayoff from '../../ChartPayoff/ChartPayoff';
import { OrderDetails, TradingStoriesProps } from '..';
import LogoEth from '../../Icons/LogoEth';
import Button from '../../Button/Button';
import { useAppStore } from '@/UI/lib/zustand/store';
import Input from '../../Input/Input';
import { getNumber, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';
import { ClientConditionalOrder, Leg, calculateNetPrice, createClientOrderId, toPrecision } from '@ithaca-finance/sdk';
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import { ContractDetails } from '@/UI/lib/zustand/slices/ithacaSDKSlice';
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';

const Earn = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const { currentSpotPrice, currencyPrecision, ithacaSDK, getContractsByPayoff } = useAppStore();
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

  const handleCapitalAtRiskChange = async (amount: string) => {
    const capitalAtRisk = getNumberValue(amount);
    setCapitalAtRisk(capitalAtRisk);
    await handleStrikeChange(strike, currency, getNumber(capitalAtRisk));
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
      currency === 'WETH' ? `${capitalAtRisk}` : `${toPrecision(capitalAtRisk / strike.min, currencyPrecision.strike)}`;

    const leg = {
      contractId: filteredContracts[strike.min].contractId,
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
      { ...filteredContracts[strike.min], ...leg, premium: filteredContracts[strike.min].referencePrice },
    ]);
    setPayoffMap(payoffMap);
    setTargetEarn(calculateNetPrice([leg], [filteredContracts[strike.min].referencePrice], currencyPrecision.strike));

    try {
      const orderLock = await ithacaSDK.calculation.estimateOrderLock(order);
      const orderPayoff = await ithacaSDK.calculation.estimateOrderPayoff(order);
      setOrderDetails({
        order,
        orderLock,
        orderPayoff,
      });
    } catch (error) {
      console.error('Order estimation for earn failed', error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    try {
      await ithacaSDK.orders.newOrder(orderDetails.order, 'Earn');
    } catch (error) {
      console.error('Failed to submit order', error);
    }
  };

  return (
    <div>
      {!compact && showInstructions && (
        <div className={styles.instructions}>
          <div>
            i. Select <LogoEth /> Target Price.
          </div>
          <div>
            ii. Risk Earn <LogoUsdc /> Return.
          </div>
          <div>iii.</div>
          <div>
            - If at Expiry <LogoEth /> {'<'} Target Price, receive Risk equivalent worth of <LogoEth /> + Return in{' '}
            <LogoUsdc />.
          </div>
          <div>
            - If at Expiry <LogoEth /> {'>'} Target Price, receive Risk equivalent worth of <LogoUsdc /> + Return in{' '}
            <LogoUsdc />.
          </div>
        </div>
      )}
      <div className={styles.sliderWrapper}>
        {!compact && (
          <div className={styles.sliderTitle}>
            Select Target Price <LogoEth />
          </div>
        )}
        <Flex>
          <Slider
            value={strike}
            min={strikes[0]}
            max={strikes[strikes.length - 1]}
            label={strikes.length}
            step={100}
            onChange={strike => {
              setStrike(strike);
              handleStrikeChange(strike, currency, getNumber(capitalAtRisk));
            }}
          />
        </Flex>
      </div>
      {!compact && (
        <div className={styles.earnInputs}>
          <div className={styles.gridWrapper}>
            <Flex direction='row-center'>
              <span className={styles.label}>Risk</span>
            </Flex>
            <Input
              type='number'
              value={capitalAtRisk}
              onChange={({ target }) => handleCapitalAtRiskChange(target.value)}
              icon={<LogoEth />}
            />
            <span />
            <span className={`${styles.label} ${styles.inputHint}`}>Capital At Risk</span>
          </div>
          <div>
            <div className={styles.returnsWrapper}>
              <div className={styles.earnWrapper}>
                <span className={styles.label}>Earn</span>
                <span className={styles.earn}>{targetEarn}</span>
                <LogoUsdc />
              </div>
            </div>
            <div className={styles.aprWrapper}>
              <span className={`${styles.label} ${styles.inputHint}`}>Expected Return</span>
              <span className={styles.apr}>5.0%</span>
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

export default Earn;
