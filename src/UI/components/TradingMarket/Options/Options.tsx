/* eslint-disable react-hooks/exhaustive-deps */
// Packages
import React, { useEffect, useState } from 'react';
import { OrderDetails, TradingStoriesProps } from '../../TradingStories';

// Components
import RadioButton from '@/UI/components/RadioButton/RadioButton';
import DropdownMenu from '@/UI/components/DropdownMenu/DropdownMenu';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Input from '@/UI/components/Input/Input';
import LogoEth from '@/UI/components/Icons/LogoEth';
import PriceLabel from '@/UI/components/PriceLabel/PriceLabel';
import Button from '@/UI/components/Button/Button';
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
import Greeks from '@/UI/components/Greeks/Greeks';
import LabeledControl from '@/UI/components/LabeledControl/LabeledControl';
import Toast from '@/UI/components/Toast/Toast';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';

// Constants
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';
import { SIDE_OPTIONS, TYPE_OPTIONS } from '@/UI/constants/options';

// Utils
import { getNumber, getNumberFormat, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';
import {
  ClientConditionalOrder,
  Leg,
  calcCollateralRequirement,
  calculateNetPrice,
  createClientOrderId,
} from '@ithaca-finance/sdk';
import useToast from '@/UI/hooks/useToast';
import OptionInstructions from '../../Instructions/OptionDescription';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration)

const Options = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const { ithacaSDK, currencyPrecision, getContractsByPayoff, currentExpiryDate, currentSpotPrice } = useAppStore();
  const callContracts = getContractsByPayoff('Call');
  const putContracts = getContractsByPayoff('Put');
  const strikes = Object.keys(callContracts).map(strike => ({ name: strike, value: strike }));

  const [callOrPut, setCallOrPut] = useState<'Call' | 'Put'>('Call');
  const [buyOrSell, setBuyOrSell] = useState<'BUY' | 'SELL'>('BUY');
  const [size, setSize] = useState('');
  const [strike, setStrike] = useState<string>(strikes[4].value);
  const [unitPrice, setUnitPrice] = useState('');
  const [iv, setIv] = useState(0);
  const [greeks, setGreeks] = useState();
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();

  const { toastList, position, showToast } = useToast();

  const handleCallOrPutChange = async (callOrPut: 'Call' | 'Put') => {
    setCallOrPut(callOrPut);
    if (!strike) return;
    const contract = callOrPut === 'Call' ? callContracts[strike] : putContracts[strike];
    setUnitPrice(`${contract.referencePrice}`);
    await handleStrikeChange(callOrPut, buyOrSell, getNumber(size), strike, `${contract.referencePrice}`);
  };

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
      setGreeks(undefined)
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
      setOrderDetails({
        order,
        orderLock,
      });
    } catch (error) {
      console.error(`Order estimation for ${callOrPut} failed`, error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    try {
      await ithacaSDK.orders.newOrder(orderDetails.order, callOrPut);
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
    const expiry = dayjs(currentExpiryDate.toString(), 'YYYYMMDD')
    const diff = expiry.diff(current)
    const params = {
      rate: 0,
      price: unitPrice,
      strike: strike,
      time: dayjs.duration(diff).asYears(),
      isCall: callOrPut === 'Call',
      underlying: currentSpotPrice
    }
    const sigma = (ithacaSDK.calculation.calcSigma(params))
    setIv(sigma * 100);
    setGreeks(ithacaSDK.calculation.calcOption({
      rate: 0,
      sigma,
      strike,
      time: dayjs.duration(diff).asYears(),
      isCall: callOrPut === 'Call',
      underlying: currentSpotPrice
    }));
  }

  const calcCollateral = () => {
    if (!strike || isInvalidNumber(getNumber(size))) return '-';
    const contract = callOrPut === 'Call' ? callContracts[strike] : putContracts[strike];
    const leg = {
      contractId: contract.contractId,
      quantity: size,
      side: buyOrSell,
    };
    const collateral = calcCollateralRequirement(leg, callOrPut, getNumber(strike), currencyPrecision.strike);
    return getNumberFormat(collateral, 'double');
  };

  useEffect(() => {
    const contract = callOrPut === 'Call' ? callContracts[strike] : putContracts[strike];
    setUnitPrice(`${contract.referencePrice}`);
    handleSizeChange('1', `${contract.referencePrice}`);
  }, []);

  const renderInstruction = () => {
    return (
      <>
        {!compact && showInstructions && <OptionInstructions />}
      </>
    )
  }

  return (
    <>
      {renderInstruction()}
      <Flex direction='row-space-between' margin={`${compact ? 'mb-12' : 'mb-34'}`} gap='gap-4'>
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
                width={105}
                increment={(direction) => size && handleSizeChange((direction === 'UP' ? Number(size) + 1 : Number(size) - 1).toString())}
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
                  const contract = callOrPut === 'Call' ? callContracts[value] : putContracts[value];
                  setUnitPrice(`${contract.referencePrice}`);
                  handleStrikeChange(callOrPut, buyOrSell, getNumber(size), value, `${contract.referencePrice}`);
                }}
              />
            </LabeledControl>

            <LabeledControl label='Unit Price'>
              <Input
                type='number'
                icon={<LogoUsdc />}
                footerText={`IV ${iv.toFixed(1)}%`}
                value={unitPrice}
                onChange={({ target }) => handleUnitPriceChange(target.value)}
              />
            </LabeledControl>


            <LabeledControl label='Collateral' labelClassName='justify-end'>
              <PriceLabel className='height-34 min-width-71' icon={<LogoEth />} label={calcCollateral()} />
            </LabeledControl>

            <LabeledControl label='Premium' labelClassName='justify-end'>
              <PriceLabel
                className='height-34 min-width-71'
                icon={<LogoUsdc />}
                label={orderDetails ? getNumberFormat(orderDetails.order.totalNetPrice) : '-'}
              />
            </LabeledControl>

            {/** Add disabled logic, add wrong network and not connected logic */}
            <Button size='sm' title='Click to submit to auction' onClick={handleSubmit} className='align-self-end'>
              Submit to Auction
            </Button>
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
      />

      {!compact && <Greeks greeks={greeks} />}
    </>
  );
};

export default Options;
