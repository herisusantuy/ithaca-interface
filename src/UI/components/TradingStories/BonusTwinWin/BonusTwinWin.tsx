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
import DropdownMenu from '@/UI/components/DropdownMenu/DropdownMenu';
import Input from '@/UI/components/Input/Input';
import RadioButton from '@/UI/components/RadioButton/RadioButton';
import LabeledControl from '@/UI/components/LabeledControl/LabeledControl';
import Asset from '@/UI/components/Asset/Asset';
import Toast from '@/UI/components/Toast/Toast';
import OrderSummaryMarkets from '@/UI/components/OrderSummary/OrderSummary';


// Constants
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';
import { BONUS_TWIN_WIN_OPTIONS } from '@/UI/constants/options';

// Utils
import { formatNumber, getNumber, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';
import { ClientConditionalOrder, Leg, createClientOrderId, toPrecision } from '@ithaca-finance/sdk';
import useToast from '@/UI/hooks/useToast';
import SubmitModal from '@/UI/components/SubmitModal/SubmitModal';
import BonusInstructions from '@/UI/components/Instructions/BonusInstructions';
import TwinWinInstructions from '../../Instructions/TwinWinInstructions';
import LogoEth from '../../Icons/LogoEth';
import { DESCRIPTION_OPTIONS } from '@/UI/constants/tabCard';

//Styles
import radioButtonStyles from '@/UI/components/RadioButton/RadioButton.module.scss';

const BonusTwinWin = ({
  showInstructions,
  compact,
  chartHeight,
  radioChosen = 'Bonus',
  onRadioChange,
}: TradingStoriesProps) => {
  const { ithacaSDK, currencyPrecision, currentSpotPrice, getContractsByPayoff, unFilteredContractList } =
    useAppStore();
  const forwardContracts = getContractsByPayoff('Forward');
  const putContracts = getContractsByPayoff('Put');
  const binaryPutContracts = getContractsByPayoff('BinaryPut');
  const barrierStrikes = putContracts
    ? Object.keys(putContracts).reduce<string[]>((strikes, currStrike) => {
        if (parseFloat(currStrike) < currentSpotPrice) strikes.push(currStrike);
        return strikes;
      }, [])
    : [];
  const priceReference = barrierStrikes[barrierStrikes.length - 1];

  const [bonusOrTwinWin, setBonusOrTwinWin] = useState<'Bonus' | 'Twin Win'>((radioChosen as 'Bonus') || 'Bonus');
  const [koBarrier, setKoBarrier] = useState<string>(barrierStrikes[barrierStrikes.length - 3]);
  const [multiplier, setMultiplier] = useState('');
  const [price, setPrice] = useState('2100');
  const [total, setTotal] = useState('-');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();
  const [submitModal, setSubmitModal] = useState<boolean>(false);
  const { toastList, position, showToast } = useToast();
  const [auctionSubmission, setAuctionSubmission] = useState<AuctionSubmission | undefined>();
  const [positionBuilderStrategies, setPositionBuilderStrategies] = useState<PositionBuilderStrategy[]>([]);

  useEffect(() => {
    if (radioChosen) {
      handleBonusOrTwinWinChange(radioChosen as 'Bonus' | 'Twin Win');
    }
  }, [radioChosen]);

  const handleBonusOrTwinWinChange = (bonusOrTwinWin: 'Bonus' | 'Twin Win') => {
    setBonusOrTwinWin(bonusOrTwinWin);
    if (onRadioChange) onRadioChange(DESCRIPTION_OPTIONS[bonusOrTwinWin]);
    if (!koBarrier) return;
    handlePriceReferenceChange(bonusOrTwinWin, priceReference, koBarrier, getNumber(multiplier), getNumber(price));
  };

  const handleMultiplierChange = (amount: string) => {
    const multiplier = getNumberValue(amount);
    setMultiplier(multiplier);
    if (!koBarrier) return;
    handlePriceReferenceChange(bonusOrTwinWin, priceReference, koBarrier, getNumber(multiplier), getNumber(price));
  };

  const handleKOBarrierChange = (koBarrier: string) => {
    setKoBarrier(koBarrier);
    handlePriceReferenceChange(bonusOrTwinWin, priceReference, koBarrier, getNumber(multiplier), getNumber(price));
  };

  const handlePriceChange = (price: string) => {
    setPrice(price);
    if (!koBarrier) return;
    handlePriceReferenceChange(bonusOrTwinWin, priceReference, koBarrier, getNumber(multiplier), getNumber(price));
  };

  const handlePriceReferenceChange = async (
    bonusOrTwinWin: 'Bonus' | 'Twin Win',
    priceReference: string,
    koBarrier: string,
    multiplier: number,
    price: number
  ) => {
    if (isInvalidNumber(multiplier) || isInvalidNumber(price)) {
      setTotal('-');
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
    const totalPrice = (price * multiplier).toFixed(currencyPrecision.strike);
    setTotal(totalPrice);
    const order = {
      clientOrderId: createClientOrderId(),
      totalNetPrice: totalPrice,
      legs,
    } as ClientConditionalOrder;

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
      const orderFees = await ithacaSDK.calculation.estimateOrderFees(order);
      setOrderDetails({
        order,
        orderLock,
        orderFees
      });
    } catch (error) {
      // Add toast
      console.error(`Order estimation for ${bonusOrTwinWin} failed`, error);
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
      type: bonusOrTwinWin,
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
    handleMultiplierChange('100');
  }, []);

  return (
    <>
      {compact && (
        <Flex margin={compact ? 'mb-10' : 'mb-12'}>
          <RadioButton
            labelClassName={radioButtonStyles.microLabels}
            size={compact ? 'compact' : 'regular'}
            width={compact ? 140 : 186}
            options={BONUS_TWIN_WIN_OPTIONS}
            selectedOption={bonusOrTwinWin}
            name={compact ? 'bonusOrTwinWinCompact' : 'bonusOrTwinWin'}
            onChange={value => handleBonusOrTwinWinChange(value as 'Bonus' | 'Twin Win')}
          />
        </Flex>
      )}

      {!compact && showInstructions && (bonusOrTwinWin === 'Bonus' ? <BonusInstructions /> : <TwinWinInstructions />)}

      {!compact && (
        <Flex direction='column' margin='mt-20 mb-14' gap='gap-12'>
          <Flex gap='gap-15'>
            <div>
              <LabeledControl label='Price Reference'>
                <DropdownMenu
                  width={80}
                  disabled
                  options={[]}
                  value={{ name: priceReference, value: priceReference }}
                />
              </LabeledControl>
            </div>
            <div>
              <LabeledControl label='KO Barrier'>
                <DropdownMenu
                  options={barrierStrikes.slice(0, -1).map(strike => ({ name: strike, value: strike }))}
                  value={koBarrier ? { name: koBarrier, value: koBarrier } : undefined}
                  onChange={handleKOBarrierChange}
                />
              </LabeledControl>
            </div>
            {/* <Flex direction='row-center' gap='gap-4' margin='mt-22'>
              <LogoEth />
              <p className='fs-sm mr-10'>Protection Cost Inclusive</p>
            </Flex> */}
            <div>
              <LabeledControl
                label={
                  <>
                    <LogoEth /> Protection Cost Inclusive Price
                  </>
                }
                labelClassName='nowrap'
              >
                <Input type='number' value={price} onChange={({ target }) => handlePriceChange(target.value)} />
              </LabeledControl>
            </div>

            <LabeledControl label='Size (Multiplier)'>
              <Input type='number' value={multiplier} onChange={({ target }) => handleMultiplierChange(target.value)} />
            </LabeledControl>
            <LabeledControl label='Total Cost' labelClassName='color-white mb-16'>
              <Flex gap='gap-10'>
                <span className='fs-md-bold color-white'>
                  {!isInvalidNumber(getNumber(total)) ? getNumber(total).toFixed(0) : '-'}
                </span>
                <Asset icon={<LogoUsdc />} label='USDC' size='xs' />
              </Flex>
            </LabeledControl>
          </Flex>
        </Flex>
      )}

      <ChartPayoff
        // id='bonus-chart'
        id={`bonus-chart${compact ? '-compact' : ''}`}
        compact={compact}
        chartData={payoffMap ?? CHART_FAKE_DATA}
        height={chartHeight}
        showKeys={false}
        showPortial={!compact}
        infoPopup={{
          type: bonusOrTwinWin === 'Bonus' ? 'bonus' : 'twinWin',
          price: price,
          barrier: koBarrier,
          strike: priceReference,
        }}
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

export default BonusTwinWin;
