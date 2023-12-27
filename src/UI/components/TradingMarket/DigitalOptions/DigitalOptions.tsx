/* eslint-disable react-hooks/exhaustive-deps */
// Packages
import React, { useEffect, useState } from 'react';
import { OrderDetails, TradingStoriesProps } from '../../TradingStories';
import { PositionBuilderStrategy, AuctionSubmission, OrderSummary } from '@/pages/trading/position-builder';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';

// Components
import RadioButton from '@/UI/components/RadioButton/RadioButton';
import DropdownMenu from '@/UI/components/DropdownMenu/DropdownMenu';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Input from '@/UI/components/Input/Input';
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
import LabeledControl from '@/UI/components/LabeledControl/LabeledControl';
import Toast from '@/UI/components/Toast/Toast';

// Utils
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import { formatNumber, getNumber, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';

// Constants
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';
import { DIGITAL_OPTIONS, SIDE_OPTIONS } from '@/UI/constants/options';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';
import {
  Leg,
  ClientConditionalOrder,
  createClientOrderId,
  calculateNetPrice,
  toPrecision,
} from '@ithaca-finance/sdk';
import useToast from '@/UI/hooks/useToast';
import SubmitModal from '@/UI/components/SubmitModal/SubmitModal';
import DigitalInstructions from '../../Instructions/DigitalInstructions';
import OrderSummaryMarkets from '../../OrderSummary/OrderSummary';

const DigitalOptions = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const { ithacaSDK, currencyPrecision, getContractsByPayoff, currentExpiryDate } = useAppStore();
  const [binaryCallContracts, setBinaryCallContracts] = useState(getContractsByPayoff('BinaryCall'));
  const [binaryPutContracts, setBinaryPutContracts] = useState(getContractsByPayoff('BinaryPut'));
  const strikeList = Object.keys(getContractsByPayoff('BinaryCall')).map(strike => ({ name: strike, value: strike }));
  const [strikes, setStrikes] = useState(strikeList);

  const [binaryCallOrPut, setBinaryCallOrPut] = useState<'BinaryCall' | 'BinaryPut'>('BinaryCall');
  const [buyOrSell, setBuyOrSell] = useState<'BUY' | 'SELL'>('BUY');
  const [size, setSize] = useState('');
  const [strike, setStrike] = useState<string>(
    strikeList.length > 5 ? strikeList[5].value : strikeList[strikeList.length - 1].value
  );
  const [unitPrice, setUnitPrice] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();
  const [submitModal, setSubmitModal] = useState<boolean>(false);

  const { toastList, position, showToast } = useToast();

  const [auctionSubmission, setAuctionSubmission] = useState<AuctionSubmission | undefined>();

  useEffect(() => {
    setBinaryCallContracts(getContractsByPayoff('BinaryCall'));
    setBinaryPutContracts(getContractsByPayoff('BinaryPut'));
    const strikeList = Object.keys(getContractsByPayoff('BinaryCall')).map(strike => ({ name: strike, value: strike }));
    setStrikes(strikeList);
    setStrike(strikeList.length > 5 ? strikeList[5].value : strikeList[strikeList.length - 1].value);
  }, [currentExpiryDate]);

  useEffect(() => {
    const contract = binaryCallOrPut === 'BinaryCall' ? binaryCallContracts[strike] : binaryPutContracts[strike];
    setUnitPrice(`${contract.referencePrice}`);
    handleStrikeChange(binaryCallOrPut, buyOrSell, getNumber(size), strike, `${contract.referencePrice}`);
  }, [strike]);

  const handleBinaryCallOrPutChange = async (binaryCallOrPut: 'BinaryCall' | 'BinaryPut') => {
    setBinaryCallOrPut(binaryCallOrPut);
    if (!strike) return;
    const contract = binaryCallOrPut === 'BinaryCall' ? binaryCallContracts[strike] : binaryPutContracts[strike];
    setUnitPrice(`${contract.referencePrice}`);
    await handleStrikeChange(binaryCallOrPut, buyOrSell, getNumber(size), strike, `${contract.referencePrice}`);
  };

  const handleBuyOrSellChange = async (buyOrSell: 'BUY' | 'SELL') => {
    setBuyOrSell(buyOrSell);
    if (!strike) return;
    await handleStrikeChange(binaryCallOrPut, buyOrSell, getNumber(size), strike, unitPrice);
  };

  const handleSizeChange = async (amount: string, price?: string) => {
    const size = getNumberValue(amount);
    setSize(size);
    if (!strike) return;
    await handleStrikeChange(binaryCallOrPut, buyOrSell, getNumber(size), strike, price || unitPrice);
  };

  const handleUnitPriceChange = async (amount: string) => {
    const unitPrice = getNumberValue(amount);
    setUnitPrice(unitPrice);
    if (!strike) return;
    await handleStrikeChange(binaryCallOrPut, buyOrSell, getNumber(size), strike, unitPrice);
  };

  const handleStrikeChange = async (
    binaryCallOrPut: 'BinaryCall' | 'BinaryPut',
    buyOrSell: 'BUY' | 'SELL',
    size: number,
    strike: string,
    unitPrice?: string
  ) => {
    if (isInvalidNumber(size) || isInvalidNumber(Number(unitPrice))) {
      setOrderDetails(undefined);
      setPayoffMap(undefined);
      return;
    }

    const contract = binaryCallOrPut === 'BinaryCall' ? binaryCallContracts[strike] : binaryPutContracts[strike];
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

    try {
      const orderLock = await ithacaSDK.calculation.estimateOrderLock(order);
      setOrderDetails({
        order,
        orderLock,
      });
    } catch (error) {
      console.error(`Order estimation for ${binaryCallOrPut} failed`, error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    if (orderDetails)
      setAuctionSubmission({
        order: orderDetails?.order,
        type: binaryCallOrPut,
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

  // const calcCollateral = () => {
  //   if (!strike || isInvalidNumber(getNumber(size))) return '-';
  //   const contract = binaryCallOrPut === 'BinaryCall' ? binaryCallContracts[strike] : binaryPutContracts[strike];
  //   const leg = {
  //     contractId: contract.contractId,
  //     quantity: size,
  //     side: buyOrSell,
  //   };
  //   const collateral = calcCollateralRequirement(leg, binaryCallOrPut, getNumber(strike), currencyPrecision.strike);
  //   return getNumberFormat(collateral, 'double');
  // };

  useEffect(() => {
    const contract = binaryCallOrPut === 'BinaryCall' ? binaryCallContracts[strike] : binaryPutContracts[strike];
    setUnitPrice(`${contract.referencePrice}`);
    handleSizeChange('100', `${contract.referencePrice}`);
  }, []);

  const renderInstruction = () => {
    return <>{!compact && showInstructions && <DigitalInstructions />}</>;
  };

  return (
    <>
      {renderInstruction()}
      <Flex direction='row' margin={`${compact ? 'mb-12' : 'mb-34'}`} gap='gap-12'>
        {compact && (
          <RadioButton
            size={compact ? 'compact' : 'regular'}
            width={compact ? 120 : 110}
            options={DIGITAL_OPTIONS}
            name={compact ? 'binaryCallOrPutCompact' : 'binaryCallOrPut'}
            selectedOption={binaryCallOrPut}
            onChange={value => handleBinaryCallOrPutChange(value as 'BinaryCall' | 'BinaryPut')}
          />
        )}
        {!compact && (
          <>
            <LabeledControl label='Type'>
              <RadioButton
                size={compact ? 'compact' : 'regular'}
                width={compact ? 120 : 110}
                options={DIGITAL_OPTIONS}
                name={compact ? 'binaryCallOrPutCompact' : 'binaryCallOrPut'}
                selectedOption={binaryCallOrPut}
                onChange={value => handleBinaryCallOrPutChange(value as 'BinaryCall' | 'BinaryPut')}
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
                icon={<LogoUsdc />}
                width={105}
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
                value={unitPrice}
                onChange={({ target }) => handleUnitPriceChange(target.value)}
              />
            </LabeledControl>

            {/* <LabeledControl label='Collateral' labelClassName='justify-end'>
              <PriceLabel className='height-34' icon={<LogoEth />} label={calcCollateral()} />
            </LabeledControl>

            <LabeledControl label='Premium' labelClassName='justify-end'>
              <PriceLabel
                className='height-34'
                icon={<LogoUsdc />}
                label={orderDetails ? getNumberFormat(orderDetails.order.totalNetPrice) : '-'}
              />
            </LabeledControl> */}

            {/** Add disabled logic, add wrong network and not connected logic */}
            {/* <Button size='sm' title='Click to submit to auction' onClick={handleSubmit} className='align-self-end'>
              Submit to Auction
            </Button> */}
          </>
        )}
      </Flex>
      <Toast toastList={toastList} position={position} />
      <ChartPayoff
        // id='digital-chart'
        id={`digital-chart${compact ? '-compact' : ''}`}
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
          positionBuilderStrategies={
            [
              { leg: orderDetails.order.legs[0], referencePrice: unitPrice, payoff: binaryCallOrPut, strike: strike },
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
      {/* {!compact && <Greeks />} */}
    </>
  );
};

export default DigitalOptions;
