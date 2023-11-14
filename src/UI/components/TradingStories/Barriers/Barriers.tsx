import React, { useState } from 'react';

import styles from './Barriers.module.scss';
import LogoUsdc from '../../Icons/LogoUsdc';
import ChartPayoff from '../../ChartPayoff/ChartPayoff';
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';
import { OrderDetails, TradingStoriesProps } from '..';
import LogoEth from '../../Icons/LogoEth';
import Button from '../../Button/Button';
import Flex from '@/UI/layouts/Flex/Flex';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';
import Input from '../../Input/Input';
import RadioButton from '../../RadioButton/RadioButton';
import { getNumber, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';
import { OptionLeg, PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import { useAppStore } from '@/UI/lib/zustand/store';
import { ClientConditionalOrder, Leg, calculateNetPrice, createClientOrderId } from '@ithaca-finance/sdk';

const Barriers = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const { ithacaSDK, currencyPrecision, getContractsByPayoff } = useAppStore();
  const callContracts = getContractsByPayoff('Call');
  const putContracts = getContractsByPayoff('Put');
  const binaryCallContracts = getContractsByPayoff('BinaryCall');
  const binaryPutContracts = getContractsByPayoff('BinaryPut');

  const [buyOrSell, setBuyOrSell] = useState<'buy' | 'sell'>('buy');
  const [upOrDown, setUpOrDown] = useState<'up' | 'down'>('up');
  const [inOrOut, setInOrOut] = useState<'in' | 'out'>('in');
  const [strike, setStrike] = useState<string>();
  const [barrier, setBarrier] = useState<string>();
  const [size, setSize] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();

  const strikes = Object.keys(callContracts).reduce<string[]>((strikeArr, currStrike) => {
    const isValidStrike = barrier
      ? upOrDown === 'up'
        ? parseFloat(currStrike) < parseFloat(barrier)
        : parseFloat(currStrike) > parseFloat(barrier)
      : true;
    if (isValidStrike) strikeArr.push(currStrike);
    return strikeArr;
  }, []);
  const barrierStrikes = Object.keys(callContracts).reduce<string[]>((strikeArr, currStrike) => {
    const isValidStrike = strike
      ? upOrDown === 'up'
        ? parseFloat(currStrike) > parseFloat(strike)
        : parseFloat(currStrike) < parseFloat(strike)
      : true;
    if (isValidStrike) strikeArr.push(currStrike);
    return strikeArr;
  }, []);

  const handleBuyOrSellChange = async (buyOrSell: 'buy' | 'sell') => {
    setBuyOrSell(buyOrSell);
    if (!strike || !barrier) return;
    prepareOrderLegs(buyOrSell, upOrDown, strike, inOrOut, barrier, getNumber(size));
  };

  const handleUpOrDownChange = async (upOrDown: 'up' | 'down') => {
    setUpOrDown(upOrDown);
    setBarrier(undefined);
    setOrderDetails(undefined);
    setPayoffMap(undefined);
  };

  const handleInOrOutChange = async (inOrOut: 'in' | 'out') => {
    setInOrOut(inOrOut);
    if (!strike || !barrier) return;
    prepareOrderLegs(buyOrSell, upOrDown, strike, inOrOut, barrier, getNumber(size));
  };

  const handleStrikeChange = async (strike: string) => {
    setStrike(strike);
    if (!strike || !barrier) return;
    prepareOrderLegs(buyOrSell, upOrDown, strike, inOrOut, barrier, getNumber(size));
  };

  const handleBarrierChange = async (barrier: string) => {
    setBarrier(barrier);
    if (!strike || !barrier) return;
    prepareOrderLegs(buyOrSell, upOrDown, strike, inOrOut, barrier, getNumber(size));
  };

  const handleSizeChange = async (amount: string) => {
    const size = getNumberValue(amount);
    setSize(size);
    if (!strike || !barrier) return;
    prepareOrderLegs(buyOrSell, upOrDown, strike, inOrOut, barrier, getNumber(size));
  };

  const prepareOrderLegs = async (
    buyOrSell: 'buy' | 'sell',
    upOrDown: 'up' | 'down',
    strike: string,
    inOrOut: 'in' | 'out',
    barrier: string,
    size: number
  ) => {
    if (isInvalidNumber(size)) {
      setOrderDetails(undefined);
      setPayoffMap(undefined);
      return;
    }

    let legs: Leg[];
    let referencePrices: number[];
    let estimatePayoffData: OptionLeg[];
    if (upOrDown === 'up') {
      if (inOrOut === 'in') {
        const buyCallContract = callContracts[barrier];
        const buyBinaryCallContract = binaryCallContracts[barrier];
        const buyCallLeg: Leg = {
          contractId: buyCallContract.contractId,
          quantity: `${size}`,
          side: buyOrSell === 'buy' ? 'BUY' : 'SELL',
        };
        const buyBinaryCallLeg: Leg = {
          contractId: buyBinaryCallContract.contractId,
          quantity: `${size * (getNumber(barrier) - getNumber(strike))}`,
          side: buyOrSell === 'buy' ? 'BUY' : 'SELL',
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
          side: buyOrSell === 'buy' ? 'BUY' : 'SELL',
        };
        const sellCallLeg: Leg = {
          contractId: sellCallContract.contractId,
          quantity: `${size}`,
          side: buyOrSell === 'buy' ? 'SELL' : 'BUY',
        };
        const sellBinaryCallLeg: Leg = {
          contractId: sellBinaryCallContract.contractId,
          quantity: `${size * (getNumber(barrier) - getNumber(strike))}`,
          side: buyOrSell === 'buy' ? 'SELL' : 'BUY',
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
      if (inOrOut == 'in') {
        const buyPutContract = putContracts[barrier];
        const buyBinaryPutContract = binaryPutContracts[barrier];
        const buyPutLeg: Leg = {
          contractId: buyPutContract.contractId,
          quantity: `${size}`,
          side: buyOrSell === 'buy' ? 'BUY' : 'SELL',
        };
        const buyBinaryPutLeg: Leg = {
          contractId: buyBinaryPutContract.contractId,
          quantity: `${size * (getNumber(strike) - getNumber(barrier))}`,
          side: buyOrSell === 'buy' ? 'BUY' : 'SELL',
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
          side: buyOrSell === 'buy' ? 'BUY' : 'SELL',
        };
        const sellPutLeg: Leg = {
          contractId: sellPutContract.contractId,
          quantity: `${size}`,
          side: buyOrSell === 'buy' ? 'SELL' : 'BUY',
        };
        const sellBinaryPutLeg: Leg = {
          contractId: sellBinaryPutContract.contractId,
          quantity: `${size * (getNumber(strike) - getNumber(barrier))}`,
          side: buyOrSell === 'buy' ? 'SELL' : 'BUY',
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
      console.error('Order estimation for earn failed', error);
    }
  };

  return (
    <div>
      {!compact && showInstructions && (
        <div className={styles.instructions}>
          <div>i. Select Desired Direction</div>
          <div>
            ii. Will <LogoEth /> move ‘a lot’? ( ‘Knock IN’ )
          </div>
          <div className='ml-14'>
            Will <LogoEth /> move ‘not too much’? ( ‘Knock OUT’ )
          </div>
          <div>iii. Call | Put</div>
        </div>
      )}
      {compact ? (
        <Flex gap='gap-3'>
          <RadioButton
            options={[
              { option: '+', value: 'buy' },
              { option: '-', value: 'sell' },
            ]}
            selectedOption={buyOrSell}
            name='buyOrSellCompact'
            orientation='vertical'
            onChange={value => handleBuyOrSellChange(value as 'buy' | 'sell')}
          />
          <RadioButton
            options={[
              { option: 'UP', value: 'up' },
              { option: 'DOWN', value: 'down' },
            ]}
            selectedOption={upOrDown}
            name='upOrDownCompact'
            orientation='vertical'
            onChange={value => handleUpOrDownChange(value as 'up' | 'down')}
          />
          <RadioButton
            options={[
              { option: 'IN', value: 'in' },
              { option: 'OUT', value: 'out' },
            ]}
            selectedOption={inOrOut}
            name='inOrOutCompact'
            orientation='vertical'
            onChange={value => handleInOrOutChange(value as 'in' | 'out')}
          />
        </Flex>
      ) : (
        <Flex direction='column' margin='mt-20 mb-14' gap='gap-16'>
          <Flex gap='gap-10'>
            <div>
              <label className={styles.label}>Side</label>
              <Flex gap='gap-10'>
                <RadioButton
                  options={[
                    { option: '+', value: 'buy' },
                    { option: '-', value: 'sell' },
                  ]}
                  selectedOption={buyOrSell}
                  name='buyOrSell'
                  orientation='vertical'
                  onChange={value => handleBuyOrSellChange(value as 'buy' | 'sell')}
                />
                <RadioButton
                  options={[
                    { option: 'UP', value: 'up' },
                    { option: 'DOWN', value: 'down' },
                  ]}
                  selectedOption={upOrDown}
                  name='upOrDown'
                  orientation='vertical'
                  onChange={value => handleUpOrDownChange(value as 'up' | 'down')}
                />
              </Flex>
            </div>
            <div>
              <label className={styles.label}>Strike</label>
              <DropdownMenu
                options={strikes.map(strike => ({ name: strike, value: strike }))}
                value={strike ? { name: strike, value: strike } : undefined}
                onChange={handleStrikeChange}
              />
            </div>
            <div className={styles.collateralWrapper}>Knock</div>
            <div className={styles.collateralWrapper}>
              <RadioButton
                options={[
                  { option: 'IN', value: 'in' },
                  { option: 'OUT', value: 'out' },
                ]}
                selectedOption={inOrOut}
                name='inOrOut'
                orientation='vertical'
                onChange={value => handleInOrOutChange(value as 'in' | 'out')}
              />
            </div>
            <div className={styles.collateralWrapper}>@</div>
            <div>
              <label className={styles.label}>Barrier</label>
              <DropdownMenu
                options={barrierStrikes.map(strike => ({ name: strike, value: strike }))}
                value={barrier ? { name: barrier, value: barrier } : undefined}
                onChange={handleBarrierChange}
              />
            </div>
            <div className={styles.inputWrapper}>
              <Input
                label='Size'
                type='number'
                value={size}
                onChange={({ target }) => handleSizeChange(target.value)}
              />
            </div>
          </Flex>
          <div className={styles.calculationWrapper}>
            <div className={styles.calculation}>
              Total Premium
              <div className={styles.amountWrapper}>
                <span className={styles.amount}>{orderDetails?.order.totalNetPrice}</span>
                <LogoUsdc />
                <span className={styles.currency}>USDC</span>
              </div>
            </div>
            <div className={styles.calculation}>
              Total Price
              <div className={styles.amountWrapper}>
                <span className={styles.amount}>17.4K</span>
                <LogoUsdc />
                <span className={styles.currency}>USDC</span>
              </div>
            </div>
          </div>
        </Flex>
      )}
      {!compact && showInstructions && (
        <div className={`${styles.additionalInstructions} mb-16`}>
          <div>
            BUY UP and IN Call if <LogoEth /> will end up at expiry UP from the strike price and NOT INside {'<'} the
            barrier, if not, premium lost.
          </div>
          <div>
            ( Sell and earn premium if <LogoEth /> at expiry ends up below that strike or above the strike but still
            below the barrier )
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
            <h5>Collateral Requirement</h5>
            <Flex gap='gap-10'>
              <div className={styles.summaryInfoWrapper}>
                <h3>120.2K</h3>
                <LogoEth />
                <p>WETH</p>
              </div>
              <div className={styles.summaryInfoWrapper}>
                <h3>200.1K</h3>
                <LogoUsdc />
                <p>USDC</p>
              </div>
            </Flex>
          </div>
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
          <Button size='sm' title='Click to submit to auction'>
            Submit to Auction
          </Button>
        </div>
      )}
    </div>
  );
};

export default Barriers;
