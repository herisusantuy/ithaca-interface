/* eslint-disable react-hooks/exhaustive-deps */
// Packages
import React, { useEffect, useState } from 'react';
import { OrderDetails, TradingStoriesProps } from '../../TradingStories';
import { PositionBuilderStrategy, AuctionSubmission, OrderSummary } from '@/pages/trading/position-builder';

// Components
import RadioButton from '@/UI/components/RadioButton/RadioButton';
import DropdownMenu from '@/UI/components/DropdownMenu/DropdownMenu';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Input from '@/UI/components/Input/Input';
import LogoEth from '@/UI/components/Icons/LogoEth';
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
import LabeledControl from '@/UI/components/LabeledControl/LabeledControl';
import Toast from '@/UI/components/Toast/Toast';
import OrderSummaryMarkets from '@/UI/components/OrderSummary/OrderSummary';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';

// Constants
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';
import { SIDE_OPTIONS, TYPE_OPTIONS } from '@/UI/constants/options';

// Utils
import { formatNumber, getNumber, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';
import {
  ClientConditionalOrder,
  Leg,
  calculateNetPrice,
  createClientOrderId,
  toPrecision,
} from '@ithaca-finance/sdk';
import useToast from '@/UI/hooks/useToast';
import { useDevice } from '@/UI/hooks/useDevice';
import SubmitModal from '@/UI/components/SubmitModal/SubmitModal';
import OptionInstructions from '../../Instructions/OptionDescription';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const Options = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const { ithacaSDK, currencyPrecision, getContractsByPayoff, currentExpiryDate, currentSpotPrice } = useAppStore();
  const device = useDevice();
  const [callContracts, setCallContracts] = useState(getContractsByPayoff('Call'));
  const [putContracts, setPutContracts] = useState(getContractsByPayoff('Put'));
  const strikeList = Object.keys(getContractsByPayoff('Call')).map(strike => ({ name: strike, value: strike }));
  const [strikes, setStrikes] = useState(strikeList);

  const [callOrPut, setCallOrPut] = useState<'Call' | 'Put'>('Call');
  const [buyOrSell, setBuyOrSell] = useState<'BUY' | 'SELL'>('BUY');
  const [size, setSize] = useState('');
  const [strike, setStrike] = useState<string>(
    strikeList.length > 4 ? strikeList[4].value : strikeList[strikeList.length - 1].value
  );
  const [unitPrice, setUnitPrice] = useState('');
  const [iv, setIv] = useState(0);
  const [greeks, setGreeks] = useState();
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();
  const [submitModal, setSubmitModal] = useState<boolean>(false);

  const { toastList, position, showToast } = useToast();

  const [auctionSubmission, setAuctionSubmission] = useState<AuctionSubmission | undefined>();

  const handleCallOrPutChange = async (callOrPut: 'Call' | 'Put') => {
    setCallOrPut(callOrPut);
    if (!strike) return;
    const contract = callOrPut === 'Call' ? callContracts[strike] : putContracts[strike];
    setUnitPrice(`${contract.referencePrice}`);
    await handleStrikeChange(callOrPut, buyOrSell, getNumber(size), strike, `${contract.referencePrice}`);
  };

  useEffect(() => {
    setCallContracts(getContractsByPayoff('Call'));
    setPutContracts(getContractsByPayoff('Put'));
    const strikeList = Object.keys(getContractsByPayoff('Call')).map(strike => ({ name: strike, value: strike }));
    setStrikes(strikeList);
    setStrike(strikeList.length > 4 ? strikeList[4].value : strikeList[strikeList.length - 1].value);
  }, [currentExpiryDate]);

  useEffect(() => {
    const contract = callOrPut === 'Call' ? callContracts[strike] : putContracts[strike];
    setUnitPrice(`${contract.referencePrice}`);
    handleStrikeChange(callOrPut, buyOrSell, getNumber(size), strike, `${contract.referencePrice}`);
  }, [strike]);

  const handleBuyOrSellChange = async (buyOrSell: 'BUY' | 'SELL') => {
    setBuyOrSell(buyOrSell);
    if (!strike) return;
    await handleStrikeChange(callOrPut, buyOrSell, getNumber(size), strike, unitPrice);
  };

  const handleSizeChange = async (amount: string, price?: string) => {
    const size = getNumberValue(amount);
    setSize(size);
    if (!strike) return;
    await handleStrikeChange(callOrPut, buyOrSell, getNumber(size), strike, price || unitPrice);
  };

  const handleUnitPriceChange = async (amount: string) => {
    const unitPrice = getNumberValue(amount);
    setUnitPrice(unitPrice);
    if (!strike) return;
    await handleStrikeChange(callOrPut, buyOrSell, getNumber(size), strike, unitPrice);
  };

  const handleStrikeChange = async (
    callOrPut: 'Call' | 'Put',
    buyOrSell: 'BUY' | 'SELL',
    size: number,
    strike: string,
    unitPrice?: string
  ) => {
    if (isInvalidNumber(size) || isInvalidNumber(Number(unitPrice))) {
      setOrderDetails(undefined);
      setPayoffMap(undefined);
      setIv(0);
      setGreeks(undefined);
      return;
    }

    const contract = callOrPut === 'Call' ? callContracts[strike] : putContracts[strike];

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

    calcIv(unitPrice || `${referencePrice}`, strike, callOrPut);

    try {
      const orderLock = await ithacaSDK.calculation.estimateOrderLock(order);
      const orderFees = await ithacaSDK.calculation.estimateOrderFees(order);
      setOrderDetails({
        order,
        orderLock,
        orderFees
      });
    } catch (error) {
      console.error(`Order estimation for ${callOrPut} failed`, error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    if (orderDetails)
      setAuctionSubmission({
        order: orderDetails?.order,
        type: callOrPut,
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

  const calcIv = (unitPrice: string, strike: string, callOrPut: string) => {
    if (!strike || isInvalidNumber(getNumber(unitPrice))) return '-';
    const current = dayjs();
    const expiry = dayjs(currentExpiryDate.toString(), 'YYYYMMDD');
    const diff = expiry.diff(current);
    const sigma = ithacaSDK.calculation.impliedVolatility(
      callOrPut === 'Call', 
      currentSpotPrice, 
      getNumber(strike), 
      dayjs.duration(diff).asYears(), 
      getNumber(unitPrice)
    );
    setIv(sigma * 100);
    setGreeks(ithacaSDK.calculation.blackFormulaExtended(
      callOrPut === 'Call', 
      currentSpotPrice, 
      getNumber(strike), 
      dayjs.duration(diff).asYears(), 
      sigma)
    );
  };

  useEffect(() => {
    const contract = callOrPut === 'Call' ? callContracts[strike] : putContracts[strike];
    setUnitPrice(`${contract.referencePrice}`);
    handleSizeChange('1', `${contract.referencePrice}`);
  }, []);

  const renderInstruction = () => {
    return <>{!compact && showInstructions && <OptionInstructions />}</>;
  };

  return (
    <>
      {renderInstruction()}
      <Flex direction='row' margin={`${compact ? 'mb-12' : 'mb-34'}`} gap='gap-12'>
        {compact && (
          <RadioButton
            size={compact ? 'compact' : 'regular'}
            width={compact ? 120 : 110}
            options={TYPE_OPTIONS}
            name={compact ? 'callOrPutCompact' : 'callOrPut'}
            selectedOption={callOrPut}
            onChange={value => handleCallOrPutChange(value as 'Call' | 'Put')}
          />
        )}
        {!compact && (
          <>
            <LabeledControl label='Type'>
              <RadioButton
                size={compact ? 'compact' : 'regular'}
                width={compact ? 120 : 110}
                options={TYPE_OPTIONS}
                name={compact ? 'callOrPutCompact' : 'callOrPut'}
                selectedOption={callOrPut}
                onChange={value => handleCallOrPutChange(value as 'Call' | 'Put')}
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

            <LabeledControl label='Strike'>
              <DropdownMenu
                options={strikes}
                iconEnd={<LogoUsdc />}
                value={strike ? { name: strike, value: strike } : undefined}
                onChange={value => {
                  setStrike(value);
                }}
              />
            </LabeledControl>

            <LabeledControl label='Unit Price'>
              <Input
                type='number'
                icon={<LogoUsdc />}
                footerText={`IV ${iv > 10 ? iv.toFixed(1) : iv.toFixed(2)}%`}
                value={unitPrice}
                onChange={({ target }) => handleUnitPriceChange(target.value)}
              />
            </LabeledControl>
          </>
        )}
      </Flex>
      <Toast toastList={toastList} position={position} />
      <ChartPayoff
        // id='options-chart'
        id={`options-chart${compact ? '-compact' : ''}`}
        compact={compact}
        chartData={payoffMap ?? CHART_FAKE_DATA}
        height={chartHeight}
        showKeys={false}
        showPortial={!compact}
        infoPopup={{
          type: 'options',
          greeks
        }
        }
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
              { leg: orderDetails.order.legs[0], referencePrice: unitPrice, payoff: callOrPut, strike: strike },
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
    </>
  );
};

export default Options;
