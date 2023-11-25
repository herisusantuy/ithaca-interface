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
import NoGainNoPayinInstructions from '@/UI/components/Instructions/NoGainNoPayinInstructions';
import Asset from '@/UI/components/Asset/Asset';
import LabeledControl from '@/UI/components/LabeledControl/LabeledControl';
import StorySummary from '@/UI/components/TradingStories/StorySummary/StorySummary';

// Utils
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import { getNumber, getNumberFormat, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';

// Constants
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';
import { TYPE_OPTIONS } from '@/UI/constants/options';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';
import { ClientConditionalOrder, Leg, calculateNetPrice, createClientOrderId, toPrecision } from '@ithaca-finance/sdk';

const NoGainNoPayin = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const { ithacaSDK, currencyPrecision, getContractsByPayoff } = useAppStore();
  const callContracts = getContractsByPayoff('Call');
  const putContracts = getContractsByPayoff('Put');
  const binaryCallContracts = getContractsByPayoff('BinaryCall');
  const binaryPutContracts = getContractsByPayoff('BinaryPut');
  const strikes = Object.keys(callContracts).map(strike => ({ name: strike, value: strike }));

  const [callOrPut, setCallOrPut] = useState<'Call' | 'Put'>('Call');
  const [priceReference, setPriceReference] = useState<string>(strikes[3].value);
  const [maxPotentialLoss, setMaxPotentialLoss] = useState('');
  const [multiplier, setMultiplier] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();

  const handleCallOrPutChange = async (callOrPut: 'Call' | 'Put') => {
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
    callOrPut: 'Call' | 'Put',
    multiplier: number,
    maxPotentialLoss?: number
  ) => {
    if (maxPotentialLoss ? isInvalidNumber(maxPotentialLoss) : isInvalidNumber(multiplier)) {
      setOrderDetails(undefined);
      setPayoffMap(undefined);
      return;
    }

    const buyContracts = callOrPut === 'Call' ? callContracts : putContracts;
    const sellContracts = callOrPut === 'Call' ? binaryCallContracts : binaryPutContracts;
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
      // Add toast
      console.error('Order estimation for No Gain, No Payin’ failed', error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    try {
      await ithacaSDK.orders.newOrder(orderDetails.order, 'No Gain, No Payin’');
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
      {!compact && showInstructions && <NoGainNoPayinInstructions />}

      <Flex direction='column' margin={compact ? 'mb-10' : 'mb-17'} gap='gap-12'>
        <Flex gap='gap-15' margin='mt-19'>
          <LabeledControl label='Type' labelClassName='mt-2'>
            <RadioButton
              size={compact ? 'compact' : 'regular'}
              width={compact ? 140 : 186}
              options={TYPE_OPTIONS}
              selectedOption={callOrPut}
              name={compact ? 'callOrPutCompact' : 'callOrPut'}
              onChange={value => handleCallOrPutChange(value as 'Call' | 'Put')}
            />
          </LabeledControl>

          {!compact && (
            <>
              <LabeledControl label='Price Reference' icon={<LogoEth />}>
                <DropdownMenu
                  options={strikes}
                  value={priceReference ? { name: priceReference, value: priceReference } : undefined}
                  onChange={value => {
                    setPriceReference(value);
                    handlePriceReferenceChange(value, callOrPut, getNumber(multiplier));
                  }}
                />
              </LabeledControl>

              <LabeledControl label='Max Potential Loss'>
                <Input
                  type='number'
                  value={maxPotentialLoss}
                  onChange={({ target }) => handleMaxPotentialLossChange(target.value)}
                />
              </LabeledControl>

              <Flex direction='row-center' gap='gap-4' margin='mt-22'>
                <p className='fs-sm'>Price Reference + Min Upside | Max Loss</p>
                <span className='fs-md-bold color-white'>
                  {priceReference &&
                    !isInvalidNumber(getNumber(maxPotentialLoss)) &&
                    getNumberFormat(
                      toPrecision(getNumber(priceReference) + getNumber(maxPotentialLoss), currencyPrecision.strike)
                    )}
                </span>
                <Asset icon={<LogoUsdc />} label='USDC' size='xs' />
              </Flex>
            </>
          )}
        </Flex>

        {!compact && (
          <Flex gap='gap-15'>
            <LabeledControl label='Size (Multiplier)'>
              <Input type='number' value={multiplier} onChange={({ target }) => handleMultiplierChange(target.value)} />
            </LabeledControl>

            <Flex direction='row-center' gap='gap-9' margin='mt-22'>
              <p className='fs-sm min-width-60'>Collateral</p>
              <Flex direction='row-center' gap='gap-4'>
                <span className='fs-md-bold color-white'>
                  {!isInvalidNumber(getNumber(multiplier)) &&
                    !isInvalidNumber(getNumber(maxPotentialLoss)) &&
                    getNumberFormat(
                      toPrecision(getNumber(multiplier) * getNumber(maxPotentialLoss), currencyPrecision.strike)
                    )}
                </span>
                <Asset icon={<LogoUsdc />} label='USDC' size='xs' />
              </Flex>
            </Flex>
          </Flex>
        )}
      </Flex>

      <ChartPayoff
        id={`nogain-chart${compact ? '-compact' : ''}`}
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

export default NoGainNoPayin;
