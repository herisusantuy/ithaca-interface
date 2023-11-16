import React, { useEffect, useState } from 'react';

import styles from './NoGainNoPayin.module.scss';
import LogoUsdc from '../../Icons/LogoUsdc';
import ChartPayoff from '../../ChartPayoff/ChartPayoff';
import { OrderDetails, TradingStoriesProps } from '..';
import LogoEth from '../../Icons/LogoEth';
import Flex from '@/UI/layouts/Flex/Flex';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';
import Input from '../../Input/Input';
import RadioButton from '../../RadioButton/RadioButton';
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import { getNumber, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';
import { useAppStore } from '@/UI/lib/zustand/store';
import { ClientConditionalOrder, Leg, calculateNetPrice, createClientOrderId, toPrecision } from '@ithaca-finance/sdk';
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';
import StorySummary from '../StorySummary/StorySummary';

const NoGainNoPayin = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const { ithacaSDK, currencyPrecision, getContractsByPayoff } = useAppStore();
  const callContracts = getContractsByPayoff('Call');
  const putContracts = getContractsByPayoff('Put');
  const binaryCallContracts = getContractsByPayoff('BinaryCall');
  const binaryPutContracts = getContractsByPayoff('BinaryPut');
  const strikes = Object.keys(callContracts).map(strike => ({ name: strike, value: strike }));

  const [callOrPut, setCallOrPut] = useState<'CALL' | 'PUT'>('CALL');
  const [priceReference, setPriceReference] = useState<string>(strikes[3].value);
  const [maxPotentialLoss, setMaxPotentialLoss] = useState('');
  const [multiplier, setMultiplier] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();

  const handleCallOrPutChange = async (callOrPut: 'CALL' | 'PUT') => {
    setCallOrPut(callOrPut);
    if (!priceReference) return;
    await handlePriceReferenceChange(priceReference, callOrPut, getNumber(multiplier));
  };

  const handleMaxPotentialLossChange = async (amount: string) => {
    const maxPotentialLoss = getNumberValue(amount);
    if (!priceReference) return;
    await handlePriceReferenceChange(priceReference, callOrPut, getNumber(multiplier), getNumber(maxPotentialLoss));
  };

  const handleMultiplierChange = async (amount: string) => {
    const multiplier = getNumberValue(amount);
    setMultiplier(multiplier);
    if (!priceReference) return;
    await handlePriceReferenceChange(priceReference, callOrPut, getNumber(multiplier));
  };

  const handlePriceReferenceChange = async (
    priceReference: string,
    callOrPut: 'CALL' | 'PUT',
    multiplier: number,
    maxPotentialLoss?: number
  ) => {
    if (maxPotentialLoss ? isInvalidNumber(maxPotentialLoss) : isInvalidNumber(multiplier)) {
      setOrderDetails(undefined);
      setPayoffMap(undefined);
      return;
    }

    const buyContracts = callOrPut === 'CALL' ? callContracts : putContracts;
    const sellContracts = callOrPut === 'CALL' ? binaryCallContracts : binaryPutContracts;
    const buyContractId = buyContracts[priceReference].contractId;
    const sellContractId = sellContracts[priceReference].contractId;
    const buyContractRefPrice = buyContracts[priceReference].referencePrice;
    const sellContractRefPrice = sellContracts[priceReference].referencePrice;

    let sizeMultipier = multiplier;
    let downside = toPrecision((multiplier * buyContractRefPrice) / sellContractRefPrice, currencyPrecision.strike);

    if (maxPotentialLoss) {
      sizeMultipier = toPrecision(
        (maxPotentialLoss * sellContractRefPrice) / buyContractRefPrice,
        currencyPrecision.strike
      );
      downside = maxPotentialLoss;
      setMultiplier(`${sizeMultipier}`);
    }

    const buyLeg: Leg = { contractId: buyContractId, quantity: `${sizeMultipier}`, side: 'BUY' };
    const sellLeg: Leg = { contractId: sellContractId, quantity: `${downside}`, side: 'SELL' };

    const order: ClientConditionalOrder = {
      clientOrderId: createClientOrderId(),
      totalNetPrice: calculateNetPrice(
        [buyLeg, sellLeg],
        [buyContractRefPrice, sellContractRefPrice],
        currencyPrecision.strike
      ),
      legs: [buyLeg, sellLeg],
    };

    const payoffMap = estimateOrderPayoff([
      {
        ...buyContracts[priceReference],
        ...buyLeg,
        premium: buyContracts[priceReference].referencePrice,
      },
      {
        ...sellContracts[priceReference],
        ...sellLeg,
        premium: sellContracts[priceReference].referencePrice,
      },
    ]);
    setPayoffMap(payoffMap);
    setMaxPotentialLoss(`${downside}`);

    try {
      const orderLock = await ithacaSDK.calculation.estimateOrderLock(order);
      const orderPayoff = await ithacaSDK.calculation.estimateOrderPayoff(order);
      setOrderDetails({
        order,
        orderLock,
        orderPayoff,
      });
    } catch (error) {
      console.error('Order estimation for No Gain, No Payin’ failed', error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    try {
      await ithacaSDK.orders.newOrder(orderDetails.order, 'No Gain, No Payin’');
    } catch (error) {
      console.error('Failed to submit order', error);
    }
  };

  useEffect(() => {
    handleMultiplierChange('100');
  }, []);

  return (
    <div>
      {!compact && showInstructions && (
        <div className={`${styles.instructions} mb-20`}>
          <div>
            i. Select <LogoEth /> Price Reference.
          </div>
          <div>
            ii. Select minimum Expected <LogoEth /> move from <LogoEth /> Price Reference.
          </div>
          <div className='ml-48'>
            (maximum potential <LogoUsdc /> loss if <LogoEth /> Price at Expiry = <LogoEth /> Price Reference)
          </div>
          <div>
            iii. Post minimum expected <LogoEth /> as collateral.
          </div>
          <div className='ml-24'>
            - If <LogoEth /> Price at Expiry <LogoEth /> Price Reference , receive <LogoEth /> Price at Expiry .
          </div>
          <div className='ml-24'>
            - If <LogoEth /> Price at Expiry <LogoEth /> Price Reference, receive collateral back.
          </div>
        </div>
      )}
      <Flex direction='column' margin={compact ? 'mb-10' : 'mb-14'} gap='gap-12'>
        <Flex gap='gap-15'>
          <div>
            {!compact && <label className={styles.label}>Type</label>}
            <RadioButton
              size={compact ? 'compact' : 'regular'}
              width={compact ? 140 : 225}
              options={[
                { option: 'Call', value: 'CALL' },
                { option: 'Put', value: 'PUT' },
              ]}
              selectedOption={callOrPut}
              name={compact ? 'callOrPutCompact' : 'callOrPut'}
              onChange={value => handleCallOrPutChange(value as 'CALL' | 'PUT')}
            />
          </div>
          {!compact && (
            <>
              <div>
                <label className={styles.label}>
                  <LogoEth />
                  Price Reference
                </label>
                <DropdownMenu
                  options={strikes}
                  value={priceReference ? { name: priceReference, value: priceReference } : undefined}
                  onChange={value => {
                    setPriceReference(value);
                    handlePriceReferenceChange(value, callOrPut, getNumber(multiplier));
                  }}
                />
              </div>
              <div>
                <label className={styles.label}>Max Potential Loss</label>
                <Input
                  type='number'
                  value={maxPotentialLoss}
                  onChange={({ target }) => handleMaxPotentialLossChange(target.value)}
                />
              </div>
              <div className={styles.priceReference}>
                Price Reference + Min Upside | Max Loss
                <div className={styles.amountWrapper}>
                  <span className={styles.amount}>
                    {priceReference &&
                      !isInvalidNumber(getNumber(maxPotentialLoss)) &&
                      toPrecision(getNumber(priceReference) + getNumber(maxPotentialLoss), currencyPrecision.strike)}
                  </span>
                  <LogoUsdc />
                  <span className={styles.currency}>USDC</span>
                </div>
              </div>
            </>
          )}
        </Flex>
        {!compact && (
          <Flex gap='gap-15'>
            <div>
              <label className={styles.label}>Size (Multiplier)</label>
              <Input type='number' value={multiplier} onChange={({ target }) => handleMultiplierChange(target.value)} />
            </div>
            <div className={styles.collateralWrapper}>
              Collateral
              <div className={styles.amountWrapper}>
                <span className={styles.amount}>
                  {!isInvalidNumber(getNumber(multiplier)) &&
                    !isInvalidNumber(getNumber(maxPotentialLoss)) &&
                    toPrecision(getNumber(multiplier) * getNumber(maxPotentialLoss), currencyPrecision.strike)}
                </span>
                <LogoUsdc />
                <span className={styles.currency}>USDC</span>
              </div>
            </div>
          </Flex>
        )}
      </Flex>
      <ChartPayoff
        compact={compact}
        chartData={payoffMap ?? CHART_FAKE_DATA}
        height={chartHeight}
        showKeys={false}
        showPortial={!compact}
      />
      {!compact && <StorySummary summary={orderDetails} onSubmit={handleSubmit} />}
    </div>
  );
};

export default NoGainNoPayin;
