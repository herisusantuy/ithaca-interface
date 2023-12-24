/* eslint-disable react-hooks/exhaustive-deps */
// Packages
import React, { useEffect, useState } from 'react';
import { OrderDetails, TradingStoriesProps } from '../../TradingStories';
import { PositionBuilderStrategy, AuctionSubmission, OrderSummary } from '@/pages/trading/position-builder';

import dayjs from 'dayjs';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';

// Components
import RadioButton from '@/UI/components/RadioButton/RadioButton';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Input from '@/UI/components/Input/Input';
import LogoEth from '@/UI/components/Icons/LogoEth';
import PriceLabel from '@/UI/components/PriceLabel/PriceLabel';
import Button from '@/UI/components/Button/Button';
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
import Toast from '@/UI/components/Toast/Toast';
import SubmitModal from '@/UI/components/SubmitModal/SubmitModal';

// Constants
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';

// Utils
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import { formatNumber, getNumber, getNumberFormat, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';
import {
  Leg,
  ClientConditionalOrder,
  createClientOrderId,
  calculateNetPrice,
  calcCollateralRequirement,
  toPrecision,
} from '@ithaca-finance/sdk';
import LabeledControl from '../../LabeledControl/LabeledControl';
import { SIDE_OPTIONS } from '@/UI/constants/options';
import useToast from '@/UI/hooks/useToast';
import { useDevice } from '@/UI/hooks/useDevice';
import ForwardInstructions from '../../Instructions/ForwardInstructions';
import OrderSummaryMarkets from '../../OrderSummary/OrderSummary';

const Forwards = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const { ithacaSDK, currencyPrecision, currentExpiryDate, getContractsByPayoff, spotContract } = useAppStore();
  const device = useDevice();
  const currentForwardContract = getContractsByPayoff('Forward')['-'];
  const nextAuctionForwardContract = spotContract;

  const [currentOrNextAuction, setCurrentOrNextAuction] = useState<'CURRENT' | 'NEXT'>('CURRENT');
  const [buyOrSell, setBuyOrSell] = useState<'BUY' | 'SELL'>('BUY');
  const [size, setSize] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();
  const [submitModal, setSubmitModal] = useState<boolean>(false);
  const [auctionSubmission, setAuctionSubmission] = useState<AuctionSubmission | undefined>();

  const { toastList, position, showToast } = useToast();

  const handleCurrentOrNextAuctionChange = async (currentOrNextAuction: 'CURRENT' | 'NEXT') => {
    setCurrentOrNextAuction(currentOrNextAuction);
    const contract = currentOrNextAuction === 'CURRENT' ? currentForwardContract : nextAuctionForwardContract;
    setUnitPrice(`${contract.referencePrice}`);
    await handleStrikeChange(currentOrNextAuction, buyOrSell, getNumber(size), `${contract.referencePrice}`);
  };

  const handleBuyOrSellChange = async (buyOrSell: 'BUY' | 'SELL') => {
    setBuyOrSell(buyOrSell);
    await handleStrikeChange(currentOrNextAuction, buyOrSell, getNumber(size), unitPrice);
  };

  const handleSizeChange = async (amount: string) => {
    const size = getNumberValue(amount);
    setSize(size);
    await handleStrikeChange(currentOrNextAuction, buyOrSell, getNumber(size), unitPrice);
  };

  const handleUnitPriceChange = async (amount: string) => {
    const unitPrice = getNumberValue(amount);
    setUnitPrice(unitPrice);
    await handleStrikeChange(currentOrNextAuction, buyOrSell, getNumber(size), unitPrice);
  };

  const handleStrikeChange = async (
    currentOrNextAuction: 'CURRENT' | 'NEXT',
    buyOrSell: 'BUY' | 'SELL',
    size: number,
    unitPrice?: string
  ) => {
    if (isInvalidNumber(size) || isInvalidNumber(Number(unitPrice))) {
      setOrderDetails(undefined);
      setPayoffMap(undefined);
      return;
    }

    const contract = currentOrNextAuction === 'CURRENT' ? currentForwardContract : nextAuctionForwardContract;
    const leg: Leg = {
      contractId: contract.contractId,
      quantity: `${size}`,
      side: buyOrSell,
    };
    const referencePrice = unitPrice ? getNumber(unitPrice) : contract.referencePrice;
    const order: ClientConditionalOrder = {
      clientOrderId: createClientOrderId(),
      totalNetPrice: calculateNetPrice([leg], [referencePrice], currencyPrecision.strike),
      legs: [leg],
    };

    const payoffMap = estimateOrderPayoff([{ ...contract, ...leg, premium: referencePrice }]);
    setPayoffMap(payoffMap);
    // if (!unitPrice) setUnitPrice(`${referencePrice}`);

    try {
      const orderLock = await ithacaSDK.calculation.estimateOrderLock(order);
      setOrderDetails({
        order,
        orderLock,
      });
    } catch (error) {
      console.error(`Order estimation for forward failed`, error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    if (orderDetails)
      setAuctionSubmission({
        order: orderDetails?.order,
        type: 'Forward',
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

  const calcCollateral = () => {
    if (isInvalidNumber(getNumber(size))) return '-';
    const contract = currentOrNextAuction === 'CURRENT' ? currentForwardContract : nextAuctionForwardContract;
    const leg = {
      contractId: contract.contractId,
      quantity: size,
      side: buyOrSell,
    };
    const collateral = calcCollateralRequirement(leg, 'Forward', 0, currencyPrecision.strike);
    return getNumberFormat(collateral, 'double');
  };

  useEffect(() => {
    handleSizeChange('1');
    const contract = currentOrNextAuction === 'CURRENT' ? currentForwardContract : nextAuctionForwardContract;
    setUnitPrice(`${contract.referencePrice}`);
    handleStrikeChange(currentOrNextAuction, buyOrSell, 1, `${contract.referencePrice}`);
  }, []);

  const renderInstruction = () => {
    return <>{!compact && showInstructions && <ForwardInstructions />}</>;
  };

  return (
    <>
      {renderInstruction()}
      {!compact && (
        <Flex direction='row' margin={`${compact ? 'mb-12' : 'mb-34'}`} gap='gap-12'>
          <LabeledControl label='Type'>
            <RadioButton
              width={200}
              options={[
                { option: 'Next Auction', value: 'NEXT' },
                { option: dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('DDMMMYY'), value: 'CURRENT' },
              ]}
              name={compact ? 'currentOrNextAuctionCompact' : 'currentOrNextAuction'}
              selectedOption={currentOrNextAuction}
              onChange={value => handleCurrentOrNextAuctionChange(value as 'CURRENT' | 'NEXT')}
            />
          </LabeledControl>

          <LabeledControl label='Side'>
            <RadioButton
              options={SIDE_OPTIONS}
              name='buyOrSell'
              orientation='vertical'
              selectedOption={buyOrSell}
              onChange={value => handleBuyOrSellChange(value as 'BUY' | 'SELL')}
            />
          </LabeledControl>

          {/** Mising validation */}
          <LabeledControl label='Size'>
            <Input
              type='number'
              icon={<LogoEth />}
              width={device === 'desktop' ? 105 : undefined}
              increment={direction =>
                size && handleSizeChange((direction === 'UP' ? Number(size) + 1 : Number(size) - 1).toString())
              }
              value={size}
              onChange={({ target }) => handleSizeChange(target.value)}
            />
          </LabeledControl>

          <LabeledControl label='Unit Price'>
            <Input
              type='number'
              icon={<LogoUsdc />}
              value={unitPrice}
              onChange={({ target }) => handleUnitPriceChange(target.value)}
            />
          </LabeledControl>

          {/* <LabeledControl label='Collateral' labelClassName='justify-end'>
            <PriceLabel className='height-34 min-width-71' icon={<LogoEth />} label={calcCollateral()} />
          </LabeledControl> */}

          {/** Add disabled logic, add wrong network and not connected logic */}
          {/* <Button size='sm' title='Click to submit to auction' onClick={handleSubmit} className='align-self-end'>
            Submit to Auction
          </Button> */}
        </Flex>
      )}

      <Toast toastList={toastList} position={position} />

      <ChartPayoff
        // id='forwards-chart'
        id={`forwards-chart${compact ? '-compact' : ''}`}
        compact={compact}
        chartData={payoffMap ?? CHART_FAKE_DATA}
        height={chartHeight}
        showKeys={false}
        showPortial={!compact}
        showProfitLoss={false}
        caller='Forwards'
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
          positionBuilderStrategies={
            [
              {
                leg: orderDetails.order.legs[0],
                referencePrice: unitPrice,
                payoff:
                  currentOrNextAuction === 'CURRENT'
                    ? `Forward (${dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('DDMMMYY')})`
                    : 'Forward (Next Auction)',
              },
            ] as unknown as PositionBuilderStrategy[]
          }
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
                orderDetails.orderLock.numeraireAmount - getNumber(orderDetails.order.totalNetPrice),
                currencyPrecision.strike
              ),
              'string'
            )
            : '-'
        }
        premium={orderDetails?.order.totalNetPrice}
        fee={1.5}
        submitAuction={handleSubmit} />}
    </>
  );
};

export default Forwards;
