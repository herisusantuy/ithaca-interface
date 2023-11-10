// Packages
import { useState } from 'react';
import dayjs from 'dayjs';

// SDK
import { ClientConditionalOrder, Leg, OrderLock, OrderPayoff, toPrecision } from '@ithaca-finance/sdk';
import { calculateNetPrice, createClientOrderId } from '@ithaca-finance/sdk';

// Lib
import { useAppStore } from '@/UI/lib/zustand/store';

// Components
import Meta from '@/UI/components/Meta/Meta';
import LabelValue from '@/UI/components/LabelValue/LabelValue';
import CountdownTimer from '@/UI/components/CountdownTimer/CountdownTimer';
import Asset from '@/UI/components/Asset/Asset';
import LogoEth from '@/UI/components/Icons/LogoEth';
import TableStrategy from '@/UI/components/TableStrategy/TableStrategy';
import PositionBuilderRow from '@/UI/components/PositionBuilderRow/PositionBuilderRow';
import OrderSummary from '@/UI/components/OrderSummary/OrderSummary';

// Layouts
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import TradingLayout from '@/UI/layouts/TradingLayout/TradingLayout';
import Flex from '@/UI/layouts/Flex/Flex';
import Sidebar from '@/UI/layouts/Sidebar/Sidebar';

// Styles
import styles from './position-builder.module.scss';
import ReadyState from '@/UI/utils/ReadyState';

// Types
import { DotTypes } from '@/UI/components/Dot/Dot';
import { getNumber } from '@/UI/utils/Numbers';

export interface PositionBuilderStrategy {
  leg: Leg;
  referencePrice: number;
  payoff: DotTypes;
  strike: string;
}

type OrderSummary = {
  order: ClientConditionalOrder;
  orderLock: OrderLock;
  orderPayoff: OrderPayoff;
};

const Index = () => {
  // State
  const [positionBuilderStrategies, setPositionBuilderStrategies] = useState<PositionBuilderStrategy[]>([]);
  const [orderSummary, setOrderSummary] = useState<OrderSummary>();

  // Store
  const { ithacaSDK, currencyPrecision, currentExpiryDate } = useAppStore();

  const getPositionBuilderSummary = async (positionBuilderStrategies: PositionBuilderStrategy[]) => {
    const { legs, referencePrices } = positionBuilderStrategies.reduce<{ legs: Leg[]; referencePrices: number[] }>(
      (strategies, currStrategy) => {
        strategies.legs = [...strategies.legs, currStrategy.leg];
        strategies.referencePrices = [...strategies.referencePrices, currStrategy.referencePrice];
        return strategies;
      },
      { legs: [], referencePrices: [] }
    );
    const totalNetPrice = calculateNetPrice(legs, referencePrices, currencyPrecision.strike);
    const order = {
      clientOrderId: createClientOrderId(),
      totalNetPrice,
      legs,
    };

    try {
      const orderLock = await ithacaSDK.calculation.estimateOrderLock(order);
      const orderPayoff = await ithacaSDK.calculation.estimateOrderPayoff(order);
      setOrderSummary({
        order,
        orderLock,
        orderPayoff,
      });
    } catch (error) {
      console.error('Order estimation for position builder failed', error);
    }
  };

  const handleAddStrategy = (strategy: PositionBuilderStrategy) => {
    const newPositionBuilderStrategies = [...positionBuilderStrategies, strategy];
    setPositionBuilderStrategies(newPositionBuilderStrategies);
    getPositionBuilderSummary(newPositionBuilderStrategies);
  };

  const submitToAuction = async (order: ClientConditionalOrder, orderDescr: string) => {
    try {
      await ithacaSDK.orders.newOrder(order, orderDescr);
    } catch (error) {
      console.error('Failed to submit order', error);
    }
  };

  return (
    <>
      <Meta />
      <Main>
        <Container>
          <ReadyState>
            <TradingLayout isLite={false} />
            <Sidebar
              leftPanel={
                <>
                  <Flex gap='gap-12' margin='mb-24'>
                    <Asset icon={<LogoEth />} label='ETH' />
                    <LabelValue
                      label='Expiry Date'
                      value={dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('DDMMMYY')}
                      hasDropdown={true}
                    />
                    <LabelValue label='Next Auction' value={<CountdownTimer />} />
                    <LabelValue label='Last Auction Price' value='1629' subValue='10Oct23 13:23' />
                  </Flex>
                  <h3>Position Builder</h3>
                  <PositionBuilderRow
                    title='Options'
                    options={[
                      { option: 'Call', value: 'Call' },
                      { option: 'Put', value: 'Put' },
                    ]}
                    addStrategy={handleAddStrategy}
                    submitAuction={(order: ClientConditionalOrder) => submitToAuction(order, 'Options')}
                  />
                  <PositionBuilderRow
                    title='Digital Options'
                    options={[
                      { option: 'Call', value: 'BinaryCall' },
                      { option: 'Put', value: 'BinaryPut' },
                    ]}
                    addStrategy={handleAddStrategy}
                    submitAuction={(order: ClientConditionalOrder) => submitToAuction(order, 'Digital Options')}
                  />
                  <PositionBuilderRow
                    title='Forwards'
                    options={[
                      {
                        option: dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('DDMMMYY'),
                        value: 'Forward',
                      },
                      { option: 'Next Auction', value: 'Forward (Next Auction)' },
                    ]}
                    addStrategy={handleAddStrategy}
                    submitAuction={(order: ClientConditionalOrder) => submitToAuction(order, 'Forward')}
                  />
                </>
              }
              orderSummary={
                <OrderSummary
                  limit={orderSummary?.order.totalNetPrice || '-'}
                  collatarelETH={orderSummary ? orderSummary.orderLock.underlierAmount : '-'}
                  collatarelUSDC={
                    orderSummary
                      ? toPrecision(
                          orderSummary.orderLock.underlierAmount - getNumber(orderSummary.order.totalNetPrice),
                          currencyPrecision.strike
                        )
                      : '-'
                  }
                  premium={orderSummary?.order.totalNetPrice || '-'}
                  fee={1.5}
                  submitAuction={() => {
                    if (!orderSummary) return;
                    submitToAuction(orderSummary.order, 'Position Builder');
                  }}
                />
              }
              rightPanel={
                <>
                  <h3 className='mb-13'>Strategy</h3>
                  <TableStrategy
                    strategies={positionBuilderStrategies}
                    removeRow={(index: number) => {
                      const newPositionBuilderStrategies = [...positionBuilderStrategies];
                      newPositionBuilderStrategies.splice(index, 1);
                      if (!newPositionBuilderStrategies.length) {
                        setPositionBuilderStrategies([]);
                        setOrderSummary(undefined);
                      } else {
                        setPositionBuilderStrategies(newPositionBuilderStrategies);
                        getPositionBuilderSummary(newPositionBuilderStrategies);
                      }
                    }}
                  />
                  <h3>Payoff Diagram</h3>
                  {/* {chartData ? (
                  <ChartPayoff chartData={chartData} width={400} height={300} />
                ) : (
                  <div className={styles.tableWrapper}></div>
                )} */}
                </>
              }
            />
          </ReadyState>
        </Container>
      </Main>
    </>
  );
};

export default Index;

// Single leg, generate order, login/logout and submit

// Multiple leg, add new leg to other legs then esitmate order
// Then login/logout submit
