import React, { useEffect, useState } from 'react';

import styles from './Barriers.module.scss';
import LogoUsdc from '../../Icons/LogoUsdc';
import ChartPayoff from '../../ChartPayoff/ChartPayoff';
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';
import { OrderDetails, TradingStoriesProps } from '..';
import LogoEth from '../../Icons/LogoEth';
import Flex from '@/UI/layouts/Flex/Flex';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';
import Input from '../../Input/Input';
import RadioButton from '../../RadioButton/RadioButton';
import { getNumber, getNumberFormat, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';
import { OptionLeg, PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import { useAppStore } from '@/UI/lib/zustand/store';
import { ClientConditionalOrder, Leg, calculateNetPrice, createClientOrderId } from '@ithaca-finance/sdk';
import StorySummary from '../StorySummary/StorySummary';

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
      console.error('Order estimation for barriers failed', error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    try {
      await ithacaSDK.orders.newOrder(orderDetails.order, 'Barriers');
    } catch (error) {
      console.error('Failed to submit order', error);
    }
  };

  useEffect(() => {
    handleSizeChange('100');
  }, []);

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
        <Flex gap='gap-3' margin='mb-10'>
          <RadioButton
            size={compact ? 'compact' : 'regular'}
            options={[
              { option: '+', value: 'BUY' },
              { option: '-', value: 'SELL' },
            ]}
            selectedOption={buyOrSell}
            name='buyOrSellCompact'
            orientation='vertical'
            onChange={value => handleBuyOrSellChange(value as 'BUY' | 'SELL')}
          />
          <RadioButton
            size={compact ? 'compact' : 'regular'}
            options={[
              { option: 'UP', value: 'UP' },
              { option: 'DOWN', value: 'DOWN' },
            ]}
            selectedOption={upOrDown}
            name='upOrDownCompact'
            orientation='vertical'
            onChange={value => handleUpOrDownChange(value as 'UP' | 'DOWN')}
          />
          <RadioButton
            size={compact ? 'compact' : 'regular'}
            options={[
              { option: 'IN', value: 'IN' },
              { option: 'OUT', value: 'OUT' },
            ]}
            selectedOption={inOrOut}
            name='inOrOutCompact'
            orientation='vertical'
            onChange={value => handleInOrOutChange(value as 'IN' | 'OUT')}
          />
        </Flex>
      ) : (
        <Flex direction='column' margin='mt-20 mb-14' gap='gap-16'>
          <Flex gap='gap-10'>
            <div>
              <label className={styles.label}>Side</label>
              <Flex gap='gap-10'>
                <RadioButton
                  width={42}
                  options={[
                    { option: '+', value: 'BUY' },
                    { option: '-', value: 'SELL' },
                  ]}
                  selectedOption={buyOrSell}
                  name='buyOrSell'
                  orientation='vertical'
                  onChange={value => handleBuyOrSellChange(value as 'BUY' | 'SELL')}
                />
                <RadioButton
                  width={50}
                  options={[
                    { option: 'UP', value: 'UP' },
                    { option: 'DOWN', value: 'DOWN' },
                  ]}
                  selectedOption={upOrDown}
                  name='upOrDown'
                  orientation='vertical'
                  onChange={value => handleUpOrDownChange(value as 'UP' | 'DOWN')}
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
                width={50}
                options={[
                  { option: 'IN', value: 'IN' },
                  { option: 'OUT', value: 'OUT' },
                ]}
                selectedOption={inOrOut}
                name='inOrOut'
                orientation='vertical'
                onChange={value => handleInOrOutChange(value as 'IN' | 'OUT')}
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
            <div>
              <label className={styles.label}>Size</label>
              <Input type='number' value={size} onChange={({ target }) => handleSizeChange(target.value)} />
            </div>
          </Flex>
          <div className={styles.calculationWrapper}>
            <div className={styles.calculation}>
              Total Premium
              <div className={styles.amountWrapper}>
                <span className={styles.amount}>
                  {orderDetails ? getNumberFormat(orderDetails.order.totalNetPrice) : '-'}
                </span>
                <LogoUsdc />
                <span className={styles.currency}>USDC</span>
              </div>
            </div>
            <div className={styles.calculation}>
              <span className={styles.italic}>Unit Price</span>
              <div className={styles.amountWrapper}>
                <span className={styles.amount}>{unitPrice}</span>
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
      <div className={!compact && !showInstructions ? 'mt-40' : ''}>
        <ChartPayoff
          compact={compact}
          chartData={payoffMap ?? CHART_FAKE_DATA}
          height={chartHeight}
          showKeys={false}
          showPortial={!compact}
        />
      </div>
      {!compact && <StorySummary showCollateral summary={orderDetails} onSubmit={handleSubmit} />}
    </div>
  );
};

export default Barriers;
