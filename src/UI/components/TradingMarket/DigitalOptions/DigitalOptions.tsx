// Packages
import React, { useEffect, useState } from 'react';
import { OrderDetails, TradingStoriesProps } from '../../TradingStories';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';

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

// Utils
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import { getNumber, getNumberFormat, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';

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
  calcCollateralRequirement,
} from '@ithaca-finance/sdk';

const DigitalOptions = ({ compact, chartHeight }: TradingStoriesProps) => {
  const { ithacaSDK, currencyPrecision, getContractsByPayoff } = useAppStore();
  const binaryCallContracts = getContractsByPayoff('BinaryCall');
  const binaryPutContracts = getContractsByPayoff('BinaryPut');
  const strikes = Object.keys(binaryCallContracts).map(strike => ({ name: strike, value: strike }));

  const [binaryCallOrPut, setBinaryCallOrPut] = useState<'BinaryCall' | 'BinaryPut'>('BinaryCall');
  const [buyOrSell, setBuyOrSell] = useState<'BUY' | 'SELL'>('BUY');
  const [size, setSize] = useState('');
  const [strike, setStrike] = useState<string>(strikes[4].value);
  const [unitPrice, setUnitPrice] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [payoffMap, setPayoffMap] = useState<PayoffMap[]>();

  const handleBinaryCallOrPutChange = async (binaryCallOrPut: 'BinaryCall' | 'BinaryPut') => {
    setBinaryCallOrPut(binaryCallOrPut);
    if (!strike) return;
    await handleStrikeChange(binaryCallOrPut, buyOrSell, getNumber(size), strike);
  };

  const handleBuyOrSellChange = async (buyOrSell: 'BUY' | 'SELL') => {
    setBuyOrSell(buyOrSell);
    if (!strike) return;
    await handleStrikeChange(binaryCallOrPut, buyOrSell, getNumber(size), strike, unitPrice);
  };

  const handleSizeChange = async (amount: string) => {
    const size = getNumberValue(amount);
    setSize(size);
    if (!strike) return;
    await handleStrikeChange(binaryCallOrPut, buyOrSell, getNumber(size), strike, unitPrice);
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
    if (isInvalidNumber(size)) {
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
    if (!unitPrice) setUnitPrice(`${referencePrice}`);

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
      console.error(`Order estimation for ${binaryCallOrPut} failed`, error);
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails) return;
    try {
      await ithacaSDK.orders.newOrder(orderDetails.order, binaryCallOrPut);
    } catch (error) {
      // Add toast
      console.error('Failed to submit order', error);
    }
  };

  const calcCollateral = () => {
    if (!strike || isInvalidNumber(getNumber(size))) return '-';
    const contract = binaryCallOrPut === 'BinaryCall' ? binaryCallContracts[strike] : binaryPutContracts[strike];
    const leg = {
      contractId: contract.contractId,
      quantity: size,
      side: buyOrSell,
    };
    const collateral = calcCollateralRequirement(leg, binaryCallOrPut, getNumber(strike), currencyPrecision.strike);
    return getNumberFormat(collateral, 'double');
  };

  useEffect(() => {
    handleSizeChange('100');
  }, []);

  return (
    <>
      <Flex margin={`${compact ? 'mb-12' : 'mb-34'}`} gap='gap-6'>
        {!compact && (
          <>
            <LabeledControl label='Type'>
              <RadioButton
                size={compact ? 'compact' : 'regular'}
                width={compact ? 120 : 160}
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
                icon={<LogoEth />}
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
                  handleStrikeChange(binaryCallOrPut, buyOrSell, getNumber(size), value);
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

      <ChartPayoff
        compact={compact}
        chartData={payoffMap ?? CHART_FAKE_DATA}
        height={chartHeight}
        showKeys={false}
        showPortial={!compact}
      />

      {!compact && <Greeks />}
    </>
  );
};

export default DigitalOptions;
