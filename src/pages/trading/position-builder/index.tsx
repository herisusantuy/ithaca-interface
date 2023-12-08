// Packages
import { useState } from 'react';

// SDK
import { ClientConditionalOrder, Leg, OrderLock, toPrecision } from '@ithaca-finance/sdk';
import { calculateNetPrice, createClientOrderId } from '@ithaca-finance/sdk';
import useToast from '@/UI/hooks/useToast';

// Lib
import { useAppStore } from '@/UI/lib/zustand/store';

// Components
import Meta from '@/UI/components/Meta/Meta';
import TableStrategy from '@/UI/components/TableStrategy/TableStrategy';
import OrderSummary from '@/UI/components/OrderSummary/OrderSummary';
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
import PayoffOutline from '@/UI/components/Icons/PayoffOutline';
import Toast from '@/UI/components/Toast/Toast';

// Layouts
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import TradingLayout from '@/UI/layouts/TradingLayout/TradingLayout';
import Sidebar from '@/UI/layouts/Sidebar/Sidebar';

// Utils
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import { formatNumber, getNumber } from '@/UI/utils/Numbers';
import ReadyState from '@/UI/utils/ReadyState';

// Styles
import styles from './position-builder.module.scss';
import SubmitModal from '@/UI/components/SubmitModal/SubmitModal';
import { MainInfo } from './MainInfo';
<<<<<<< HEAD
import { Currency } from '@/UI/components/Currency';
=======
>>>>>>> d902b6f (feat: modularize Position builder main input component)

// Types
export interface PositionBuilderStrategy {
  leg: Leg;
  referencePrice: number;
  payoff: string;
  strike: string;
}

export type OrderSummary = {
  order: ClientConditionalOrder;
  orderLock: OrderLock;
};

export type AuctionSubmission = {
  type: string;
  order: ClientConditionalOrder;
};

const Index = () => {
  // State
  const [positionBuilderStrategies, setPositionBuilderStrategies] = useState<PositionBuilderStrategy[]>([]);
  const [orderSummary, setOrderSummary] = useState<OrderSummary>();
  const [chartData, setChartData] = useState<PayoffMap[]>();
  const [submitModal, setSubmitModal] = useState<boolean>(false);
  const [auctionSubmission, setAuctionSubmission] = useState<AuctionSubmission | undefined>();
  const { toastList, position, showToast } = useToast();

  // Store
  const { ithacaSDK, currencyPrecision, getContractsByPayoff } =
    useAppStore();

  const getPositionBuilderSummary = async (positionBuilderStrategies: PositionBuilderStrategy[]) => {
    const { legs, referencePrices, strikes, payoffs } = positionBuilderStrategies.reduce<{
      legs: Leg[];
      referencePrices: number[];
      strikes: string[];
      payoffs: string[];
    }>(
      (strategies, currStrategy) => {
        strategies.legs = [...strategies.legs, currStrategy.leg];
        strategies.referencePrices = [...strategies.referencePrices, currStrategy.referencePrice];
        strategies.strikes = [...strategies.strikes, currStrategy.strike];
        strategies.payoffs = [...strategies.payoffs, currStrategy.payoff];
        return strategies;
      },
      { legs: [], referencePrices: [], strikes: [], payoffs: [] }
    );
    const totalNetPrice = calculateNetPrice(legs, referencePrices, currencyPrecision.strike);
    const order = {
      clientOrderId: createClientOrderId(),
      totalNetPrice,
      legs,
    };

    const chartData = estimateOrderPayoff(
      strikes.map((strike, idx) => {
        const contracts = getContractsByPayoff(payoffs[idx]);
        return { ...contracts[strike], ...legs[idx], premium: referencePrices[idx] };
      })
    );
    setChartData(chartData);

    try {
      const orderLock = await ithacaSDK.calculation.estimateOrderLock(order);
      console.log("🚀 ~ file: index.tsx:101 ~ getPositionBuilderSummary ~ orderLock:", orderLock, order)
      setOrderSummary({
        order,
        orderLock
      });
    } catch (error) {
      console.error('Order estimation for position builder failed', error);
    }
  };
<<<<<<< HEAD
  const handleAddStrategy = (strategy: PositionBuilderStrategy) => {
    const newPositionBuilderStrategies = [...positionBuilderStrategies, strategy];
    setPositionBuilderStrategies(newPositionBuilderStrategies);
    getPositionBuilderSummary(newPositionBuilderStrategies);
  };
=======
>>>>>>> d902b6f (feat: modularize Position builder main input component)

  const submitToAuction = async (order: ClientConditionalOrder, orderDescr: string) => {
    try {
      await ithacaSDK.orders.newOrder(order, orderDescr);
      showToast(
        {
          id: Math.floor(Math.random() * 1000),
          title: 'Transaction Sent',
          message: 'We have received your request',
          type: 'info',
        },
        'top-right'
      );
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
<<<<<<< HEAD
=======

>>>>>>> d902b6f (feat: modularize Position builder main input component)
  
  return (
    <>
      <Meta />
      <Main>
        <Container>
          <ReadyState>
            <TradingLayout />
            <Sidebar
              leftPanel={
<<<<<<< HEAD
                <>
                  <Currency
                    setOrderSummary
                    setChartData
                    setPositionBuilderStrategies
                  />
                  <MainInfo
                    handleAddStrategy = {handleAddStrategy}
                  />
                </>
=======
                <MainInfo 
                  setOrderSummary 
                  positionBuilderStrategies
                  setPositionBuilderStrategies
                  getPositionBuilderSummary
                  setChartData 
                />
>>>>>>> d902b6f (feat: modularize Position builder main input component)
              }
              orderSummary={
                <>
                  <OrderSummary
                    limit={formatNumber(Number(orderSummary?.order.totalNetPrice), 'string') || '-'}
                    collatarelETH={orderSummary ? formatNumber(orderSummary.orderLock.underlierAmount, 'string') : '-'}
                    collatarelUSDC={
                      orderSummary
                        ? formatNumber(
                          toPrecision(
                            orderSummary.orderLock.numeraireAmount - getNumber(orderSummary.order.totalNetPrice),
                            currencyPrecision.strike
                          ),
                          'string'
                        )
                        : '-'
                    }
                    premium={orderSummary?.order.totalNetPrice}
                    fee={1.5}
                    submitAuction={() => {
                      if (orderSummary?.order) {
                        setSubmitModal(true);
                        setAuctionSubmission({
                          order: orderSummary?.order,
                          type: 'Position Builder',
                        });
                      }
                    }}
                  />
                  <SubmitModal
                    isOpen={submitModal}
                    closeModal={(val) => setSubmitModal(val)}
                    submitOrder={() => {
                      if (!auctionSubmission) return;
                      submitToAuction(auctionSubmission.order, auctionSubmission.type);
                      setAuctionSubmission(undefined);
                      setSubmitModal(false);
                    }}
                    auctionSubmission={auctionSubmission}
                    positionBuilderStrategies={positionBuilderStrategies}
                    orderSummary={orderSummary}/>
                  <Toast toastList={toastList} position={position} />
                </>
              }
              rightPanel={
                <>
                  <h3 className='mb-13'>Strategy</h3>
                  <TableStrategy
                    strategies={positionBuilderStrategies}
                    clearAll={() => {
                      setPositionBuilderStrategies([]);
                      setOrderSummary(undefined);
                      setChartData(undefined);
                    }}
                    removeRow={(index: number) => {
                      const newPositionBuilderStrategies = [...positionBuilderStrategies];
                      newPositionBuilderStrategies.splice(index, 1);
                      if (!newPositionBuilderStrategies.length) {
                        setPositionBuilderStrategies([]);
                        setOrderSummary(undefined);
                        setChartData(undefined);
                      } else {
                        setPositionBuilderStrategies(newPositionBuilderStrategies);
                        getPositionBuilderSummary(newPositionBuilderStrategies);
                      }
                    }}
                  />

                  {chartData ? (
                    <ChartPayoff chartData={chartData} height={300} id='position-chart' />
                  ) : (
                    <>
                      <h3>Payoff Diagram</h3>
                      <div className={styles.tableWrapper}>
                        <PayoffOutline />
                      </div>
                    </>
                  )}
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
