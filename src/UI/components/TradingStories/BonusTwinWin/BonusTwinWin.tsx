// Packages
import React, { useEffect, useState } from 'react';
import { OrderDetails, TradingStoriesProps } from '..';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';

// Components
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
import LogoEth from '@/UI/components/Icons/LogoEth';
import DropdownMenu from '@/UI/components/DropdownMenu/DropdownMenu';
import Input from '@/UI/components/Input/Input';
import RadioButton from '@/UI/components/RadioButton/RadioButton';
import BonusTwinWinInstructions from '@/UI/components/Instructions/BonusTwinWinInstructions';
import StorySummary from '@/UI/components/TradingStories/StorySummary/StorySummary';

// Constants
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';

// Utils
import { getNumber, getNumberFormat, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';
import { ClientConditionalOrder, Leg, calculateNetPrice, createClientOrderId } from '@ithaca-finance/sdk';

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
      // Add toast
      console.error(`Order estimation for ${bonusOrTwinWin} failed`, error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    try {
      await ithacaSDK.orders.newOrder(orderDetails.order, bonusOrTwinWin);
    } catch (error) {
      // Add toast
      console.error('Failed to submit order', error);
    }
  };

  useEffect(() => {
    handleMultiplierChange('100');
  }, []);

  return (
    <>
      <Flex margin={compact ? 'mb-10' : 'mb-12'}>
        <RadioButton
          size={compact ? 'compact' : 'regular'}
          width={compact ? 140 : 186}
          options={[
            { option: 'Bonus', value: 'Bonus' },
            { option: 'Twin-Win', value: 'Twin Win' },
          ]}
          selectedOption={bonusOrTwinWin}
          name={compact ? 'bonusOrTwinWinCompact' : 'bonusOrTwinWin'}
          onChange={value => handleBonusOrTwinWinChange(value as 'Bonus' | 'Twin Win')}
        />
      </Flex>

      {!compact && showInstructions && <BonusTwinWinInstructions />}

      {!compact && (
        <Flex direction='column' margin='mt-20 mb-14' gap='gap-12'>
          <Flex gap='gap-15'>
            <div>
              <label>Price Reference</label>
              <DropdownMenu disabled options={[]} value={{ name: priceReference, value: priceReference }} />
            </div>
            <div>
              <label>KO Barrier</label>
              <DropdownMenu
                options={barrierStrikes.slice(0, -1).map(strike => ({ name: strike, value: strike }))}
                value={koBarrier ? { name: koBarrier, value: koBarrier } : undefined}
                onChange={handleKOBarrierChange}
              />
            </div>
            <div>
              <div>
                <LogoEth />
                Protection Cost Inclusive
              </div>
              <div>
                <span>1740</span>
                <LogoUsdc />
                <span>USDC</span>
              </div>
            </div>
          </Flex>

          <Flex gap='gap-15'>
            <div>
              <label>Size (Multiplier)</label>
              <Input type='number' value={multiplier} onChange={({ target }) => handleMultiplierChange(target.value)} />
            </div>
            <div>
              Total Premium
              <div>
                <span>400</span>
                <LogoUsdc />
                <span>USDC</span>
              </div>
            </div>
            <div>
              Total Price
              <div>
                <span>{orderDetails ? getNumberFormat(orderDetails.order.totalNetPrice) : '-'}</span>
                <LogoUsdc />
                <span>USDC</span>
              </div>
            </div>
          </Flex>
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

export default BonusTwinWin;
