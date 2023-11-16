import React, { useEffect, useState } from 'react';

import styles from './BonusTwinWin.module.scss';
import LogoUsdc from '../../Icons/LogoUsdc';
import ChartPayoff from '../../ChartPayoff/ChartPayoff';
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';
import { OrderDetails, TradingStoriesProps } from '..';
import LogoEth from '../../Icons/LogoEth';
import Flex from '@/UI/layouts/Flex/Flex';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';
import Input from '../../Input/Input';
import RadioButton from '../../RadioButton/RadioButton';
import { getNumber, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import { useAppStore } from '@/UI/lib/zustand/store';
import { ClientConditionalOrder, Leg, calculateNetPrice, createClientOrderId } from '@ithaca-finance/sdk';
import StorySummary from '../StorySummary/StorySummary';

const BonusTwinWin = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const { ithacaSDK, currencyPrecision, currentSpotPrice, getContractsByPayoff } = useAppStore();
  const forwardContracts = getContractsByPayoff('Forward');
  const putContracts = getContractsByPayoff('Put');
  const binaryPutContracts = getContractsByPayoff('BinaryPut');
  const barrierStrikes = Object.keys(putContracts).reduce<string[]>((strikes, currStrike) => {
    if (parseFloat(currStrike) < currentSpotPrice) strikes.push(currStrike);
    return strikes;
  }, []);
  const priceReference = barrierStrikes[barrierStrikes.length - 1];

  const [bonusOrTwinWin, setBonusOrTwinWin] = useState<'Bonus' | 'Twin Win'>('Bonus');
  const [koBarrier, setKoBarrier] = useState<string>(barrierStrikes[3]);
  const [multiplier, setMultiplier] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();

  const handleBonusOrTwinWinChange = async (bonusOrTwinWin: 'Bonus' | 'Twin Win') => {
    setBonusOrTwinWin(bonusOrTwinWin);
    if (!koBarrier) return;
    await handlePriceReferenceChange(bonusOrTwinWin, priceReference, koBarrier, getNumber(multiplier));
  };

  const handleMultiplierChange = async (amount: string) => {
    const multiplier = getNumberValue(amount);
    setMultiplier(multiplier);
    if (!koBarrier) return;
    await handlePriceReferenceChange(bonusOrTwinWin, priceReference, koBarrier, getNumber(multiplier));
  };

  const handleKOBarrierChange = async (koBarrier: string) => {
    setKoBarrier(koBarrier);
    await handlePriceReferenceChange(bonusOrTwinWin, priceReference, koBarrier, getNumber(multiplier));
  };

  const handlePriceReferenceChange = async (
    bonusOrTwinWin: 'Bonus' | 'Twin Win',
    priceReference: string,
    koBarrier: string,
    multiplier: number
  ) => {
    if (isInvalidNumber(multiplier)) {
      setOrderDetails(undefined);
      setPayoffMap(undefined);
      return;
    }

    const isTwinWin = bonusOrTwinWin === 'Twin Win';
    const priceBarrierDiff = getNumber(priceReference) - getNumber(koBarrier);
    const buyForwardContract = forwardContracts['-'];
    const buyPutContract = putContracts[priceReference];
    const sellPutContract = putContracts[koBarrier];
    const sellBinaryPutContract = binaryPutContracts[koBarrier];
    const buyForwardLeg: Leg = {
      contractId: buyForwardContract.contractId,
      quantity: `${multiplier}`,
      side: 'BUY',
    };
    const buyPutLeg: Leg = {
      contractId: buyPutContract.contractId,
      quantity: `${isTwinWin ? 2 * multiplier : multiplier}`,
      side: 'BUY',
    };
    const sellPutLeg: Leg = {
      contractId: sellPutContract.contractId,
      quantity: `${isTwinWin ? 2 * multiplier : multiplier}`,
      side: 'SELL',
    };
    const sellBinaryPutLeg: Leg = {
      contractId: sellBinaryPutContract.contractId,
      quantity: `${isTwinWin ? 2 * multiplier * priceBarrierDiff : multiplier * priceBarrierDiff}`,
      side: 'SELL',
    };

    const legs = [buyForwardLeg, buyPutLeg, sellPutLeg, sellBinaryPutLeg];
    const order: ClientConditionalOrder = {
      clientOrderId: createClientOrderId(),
      totalNetPrice: calculateNetPrice(
        legs,
        [
          buyForwardContract.referencePrice,
          buyPutContract.referencePrice,
          sellPutContract.referencePrice,
          sellBinaryPutContract.referencePrice,
        ],
        currencyPrecision.strike
      ),
      legs,
    };

    const payoffMap = estimateOrderPayoff([
      {
        ...buyForwardContract,
        ...buyForwardLeg,
        premium: buyForwardContract.referencePrice,
      },
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
    ]);
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
      console.error(`Order estimation for ${bonusOrTwinWin} failed`, error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    try {
      await ithacaSDK.orders.newOrder(orderDetails.order, bonusOrTwinWin);
    } catch (error) {
      console.error('Failed to submit order', error);
    }
  };

  useEffect(() => {
    handleMultiplierChange('100');
  }, []);

  return (
    <div>
      <Flex margin={compact ? 'mb-10' : 'mb-12'}>
        <RadioButton
          size={compact ? 'compact' : 'regular'}
          width={compact ? 140 : 225}
          options={[
            { option: 'Bonus', value: 'Bonus' },
            { option: 'Twin-Win', value: 'Twin Win' },
          ]}
          selectedOption={bonusOrTwinWin}
          name={compact ? 'bonusOrTwinWinCompact' : 'bonusOrTwinWin'}
          onChange={value => handleBonusOrTwinWinChange(value as 'Bonus' | 'Twin Win')}
        />
      </Flex>
      {!compact && showInstructions && (
        <div className={styles.instructions}>
          <div>
            i. Select <LogoEth /> Price Reference.
          </div>
          <div>
            ii. Select desired <LogoEth /> Downside Protection Level.
          </div>
          <div>iii. Protection extinguished at Knock Out Barrier.</div>
        </div>
      )}
      {!compact && (
        <Flex direction='column' margin='mt-20 mb-14' gap='gap-12'>
          <Flex gap='gap-15'>
            <div>
              <label className={styles.label}>Price Reference</label>
              <DropdownMenu disabled options={[]} value={{ name: priceReference, value: priceReference }} />
            </div>
            <div>
              <label className={styles.label}>KO Barrier</label>
              <DropdownMenu
                options={barrierStrikes.slice(0, -1).map(strike => ({ name: strike, value: strike }))}
                value={koBarrier ? { name: koBarrier, value: koBarrier } : undefined}
                onChange={handleKOBarrierChange}
              />
            </div>
            <div className={styles.collateralWrapper}>
              <div className={styles.amountWrapper}>
                <LogoEth />
                Protection Cost Inclusive
              </div>
              <div className={styles.amountWrapper}>
                <span className={styles.amount}>1740</span>
                <LogoUsdc />
                <span className={styles.currency}>USDC</span>
              </div>
            </div>
          </Flex>
          <Flex gap='gap-15'>
            <div>
              <label className={styles.label}>Size (Multiplier)</label>
              <Input type='number' value={multiplier} onChange={({ target }) => handleMultiplierChange(target.value)} />
            </div>
            <div className={styles.collateralWrapper}>
              Total Premium
              <div className={styles.amountWrapper}>
                <span className={styles.amount}>400</span>
                <LogoUsdc />
                <span className={styles.currency}>USDC</span>
              </div>
            </div>
            <div className={styles.collateralWrapper}>
              Total Price
              <div className={styles.amountWrapper}>
                <span className={styles.amount}>{orderDetails?.order.totalNetPrice}</span>
                <LogoUsdc />
                <span className={styles.currency}>USDC</span>
              </div>
            </div>
          </Flex>
        </Flex>
      )}
      <div className={styles.payoff}>
        {!compact && <h4>Payoff Diagram</h4>}
        <ChartPayoff
          chartData={payoffMap ?? CHART_FAKE_DATA}
          height={chartHeight}
          showKeys={false}
          showPortial={!compact}
        />
      </div>
      {!compact && <StorySummary summary={orderDetails} onSubmit={handleSubmit} />}
    </div>
  );
};

export default BonusTwinWin;
