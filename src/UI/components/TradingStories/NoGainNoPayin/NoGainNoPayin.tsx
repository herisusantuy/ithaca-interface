/* eslint-disable react-hooks/exhaustive-deps */
// Packages
import React, { useEffect, useState } from 'react';
import { OrderDetails, TradingStoriesProps } from '..';
import { PositionBuilderStrategy, AuctionSubmission, OrderSummary } from '@/pages/trading/position-builder';

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
import Toast from '@/UI/components/Toast/Toast';
import SubmitModal from '@/UI/components/SubmitModal/SubmitModal';

// Utils
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import { formatNumberByCurrency, getNumber, isInvalidNumber } from '@/UI/utils/Numbers';

// Constants
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';
import { TYPE_OPTIONS } from '@/UI/constants/options';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';
import { ClientConditionalOrder, Leg, createClientOrderId, toPrecision } from '@ithaca-finance/sdk';
import useToast from '@/UI/hooks/useToast';

//Styles
import radioButtonStyles from '@/UI/components/RadioButton/RadioButton.module.scss';

const NoGainNoPayin = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const { ithacaSDK, currencyPrecision, getContractsByPayoff, currentExpiryDate, unFilteredContractList } =
    useAppStore();
  const callContracts = getContractsByPayoff('Call');
  const putContracts = getContractsByPayoff('Put');
  const binaryCallContracts = getContractsByPayoff('BinaryCall');
  const binaryPutContracts = getContractsByPayoff('BinaryPut');
  const strikes = callContracts ? Object.keys(callContracts).map(strike => ({ name: strike, value: strike })) : [];

  const [callOrPut, setCallOrPut] = useState<'Call' | 'Put'>('Call');
  const [priceReference, setPriceReference] = useState<string>(strikes.length ? strikes[3].value : '0');
  const [maxPotentialLoss, setMaxPotentialLoss] = useState('');
  const [multiplier, setMultiplier] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();
  const [submitModal, setSubmitModal] = useState<boolean>(false);
  const { toastList, position, showToast } = useToast();
  const [auctionSubmission, setAuctionSubmission] = useState<AuctionSubmission | undefined>();
  const [positionBuilderStrategies, setPositionBuilderStrategies] = useState<PositionBuilderStrategy[]>([]);

  const handleCallOrPutChange = async (callOrPut: 'Call' | 'Put') => {
    setCallOrPut(callOrPut);
    if (!priceReference) return;
  };

  const handleMaxPotentialLossChange = async (amount: string) => {
    setMaxPotentialLoss(amount);
    if (!priceReference) return;
  };

  const handleMultiplierChange = async (amount: string) => {
    setMultiplier(amount);
    if (!priceReference) return;
  };

  const handlePriceReferenceChange = () => {
    if (maxPotentialLoss ? isInvalidNumber(getNumber(maxPotentialLoss)) : isInvalidNumber(getNumber(multiplier))) {
      setOrderDetails(undefined);
      setPayoffMap(undefined);
      return;
    }

    const buyContracts = callOrPut === 'Call' ? callContracts : putContracts;
    const sellContracts = callOrPut === 'Call' ? binaryCallContracts : binaryPutContracts;
    const buyContractId = buyContracts[priceReference].contractId;
    const sellContractId = sellContracts[priceReference].contractId;

    const sellQuantity = getNumber(multiplier) * getNumber(maxPotentialLoss);

    const buyLeg: Leg = { contractId: buyContractId, quantity: multiplier as `${number}`, side: 'BUY' };
    const sellLeg: Leg = { contractId: sellContractId, quantity: `${sellQuantity}`, side: 'SELL' };

    const order: ClientConditionalOrder = {
      clientOrderId: createClientOrderId(),
      totalNetPrice: '0.0000',
      legs: [buyLeg, sellLeg],
    };

    const payoffMap = estimateOrderPayoff([
      {
        ...buyContracts[priceReference],
        ...buyLeg,
        premium: 1,
      },
      {
        ...sellContracts[priceReference],
        ...sellLeg,
        premium: 1 / getNumber(maxPotentialLoss),
      },
    ]);
    setPayoffMap(payoffMap);
    updateOrderDetails(order);
  };

  const updateOrderDetails = async (order: ClientConditionalOrder) => {
    try {
      const orderLock = await ithacaSDK.calculation.estimateOrderLock(order);
      setOrderDetails({
        order,
        orderLock,
      });
    } catch (error) {
      // Add toast
      console.error('Order estimation for No Gain, No Payin’ failed', error);
    }
  };

  useEffect(() => {
    handlePriceReferenceChange();
  }, [multiplier, maxPotentialLoss, priceReference, callOrPut]);

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
      type: 'No Gain, No Payin’',
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

  useEffect(() => {
    setMaxPotentialLoss('200');
    handleMultiplierChange('1');
  }, []);

  const renderInstruction = () => {
    return (
      <>
        {!compact && showInstructions && (
          <NoGainNoPayinInstructions type={callOrPut} currentExpiryDate={currentExpiryDate.toString()} />
        )}
      </>
    );
  };

  return (
    <>
      {renderInstruction()}

      <Flex direction='column' margin={compact ? 'mb-10' : 'mb-17'} gap='gap-12'>
        <Flex gap='gap-15' margin={compact ? '' : 'mt-17'}>
          {!compact && (
            <LabeledControl label='Type' labelClassName='mt-2'>
              <RadioButton
                labelClassName={radioButtonStyles.microLabels}
                size={compact ? 'compact' : 'regular'}
                width={compact ? 140 : 186}
                options={TYPE_OPTIONS}
                selectedOption={callOrPut}
                name={compact ? 'callOrPutCompact' : 'callOrPut'}
                onChange={value => handleCallOrPutChange(value as 'Call' | 'Put')}
              />
            </LabeledControl>
          )}
          {compact && (
            <RadioButton
              labelClassName={radioButtonStyles.microLabels}
              size={compact ? 'compact' : 'regular'}
              width={compact ? 140 : 186}
              options={TYPE_OPTIONS}
              selectedOption={callOrPut}
              name={compact ? 'callOrPutCompact' : 'callOrPut'}
              onChange={value => handleCallOrPutChange(value as 'Call' | 'Put')}
            />
          )}

          {!compact && (
            <>
              <LabeledControl label='Price Reference' icon={<LogoEth />}>
                <DropdownMenu
                  options={strikes}
                  value={priceReference ? { name: priceReference, value: priceReference } : undefined}
                  onChange={value => {
                    setPriceReference(value);
                  }}
                />
              </LabeledControl>

              <LabeledControl label={callOrPut === 'Call' ? 'Min Upside' : 'Min Downside'}>
                <Input
                  type='number'
                  value={maxPotentialLoss}
                  onChange={({ target }) => handleMaxPotentialLossChange(target.value)}
                />
              </LabeledControl>

              <LabeledControl
                icon={<LogoEth />}
                label={
                  <span>
                    Breakeven Price{' '}
                    <span className='italic'>{`(Price Reference ${
                      callOrPut === 'Call' ? ' + Min Upside' : ' - Min Downside'
                    })`}</span>
                  </span>
                }
                labelClassName='mb-16 color-white'
              >
                <Flex>
                  <span className='fs-md-bold color-white'>
                    {priceReference && !isInvalidNumber(getNumber(maxPotentialLoss))
                      ? callOrPut === 'Call'
                        ? toPrecision(getNumber(priceReference) + getNumber(maxPotentialLoss), currencyPrecision.strike)
                        : toPrecision(getNumber(priceReference) - getNumber(maxPotentialLoss), currencyPrecision.strike)
                      : ''}
                  </span>
                  <Asset icon={<LogoUsdc />} label='USDC' size='xs' />
                </Flex>
              </LabeledControl>
            </>
          )}
        </Flex>

        {!compact && (
          <Flex gap='gap-15'>
            <LabeledControl label='Size (Multiplier)'>
              <Input type='number' value={multiplier} onChange={({ target }) => handleMultiplierChange(target.value)} />
            </LabeledControl>

            <LabeledControl label='Total Collateral' labelClassName='mb-16 color-white'>
              <Flex>
                <span className='fs-md-bold color-white'>
                  {!isInvalidNumber(getNumber(multiplier)) &&
                    !isInvalidNumber(getNumber(maxPotentialLoss)) &&
                    formatNumberByCurrency(
                      toPrecision(getNumber(multiplier) * getNumber(maxPotentialLoss), currencyPrecision.strike),
                      'string',
                      'USDC'
                    )}
                </span>
                <Asset icon={<LogoUsdc />} label='USDC' size='xs' />
              </Flex>
            </LabeledControl>
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

      {!compact && <StorySummary summary={orderDetails} onSubmit={handleSubmit} />}

      <Toast toastList={toastList} position={position} />
    </>
  );
};

export default NoGainNoPayin;
