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
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
import PayoffOutline from '@/UI/components/Icons/PayoffOutline';

// Layouts
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import TradingLayout from '@/UI/layouts/TradingLayout/TradingLayout';
import Flex from '@/UI/layouts/Flex/Flex';
import Sidebar from '@/UI/layouts/Sidebar/Sidebar';

// Utils
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import ReadyState from '@/UI/utils/ReadyState';
import { formatNumber, getNumber } from '@/UI/utils/Numbers';

// Styles
import styles from './position-builder.module.scss';
import Modal from '@/UI/components/Modal/Modal';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Toast from '@/UI/components/Toast/Toast';
import { ToastItemProp } from '@/UI/constants/toast';

// Types
export interface PositionBuilderStrategy {
  leg: Leg;
  referencePrice: number;
  payoff: string;
  strike: string;
}

type OrderSummary = {
  order: ClientConditionalOrder;
  orderLock: OrderLock;
  orderPayoff: OrderPayoff;
};

type AuctionSubmission = {
  type: string,
  order: ClientConditionalOrder
}

const Index = () => {
  // State
  const [positionBuilderStrategies, setPositionBuilderStrategies] = useState<PositionBuilderStrategy[]>([]);
  const [orderSummary, setOrderSummary] = useState<OrderSummary>();
  const [chartData, setChartData] = useState<PayoffMap[]>();
  const [submitModal, setSubmitModal] = useState<boolean>(false);
  const [auctionSubmission, setAuctionSubmission] = useState<AuctionSubmission | undefined>();
  const [position, setPosition] = useState('top-right');
  const [type, setType] = useState('success');
  const [toastList, setToastList] = useState<ToastItemProp[]>([]);

  // Store
  const { ithacaSDK, currencyPrecision, currentExpiryDate, getContractsByPayoff, expiryList, setCurrentExpiryDate } =
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
      showToast({
        id: Math.floor(Math.random() * 1000),
        title: 'Transaction Sent',
        message: 'We have received your request',
      }, 'top-right', 'info')
    } catch (error) {
      showToast({
        id: Math.floor(Math.random() * 1000),
        title: 'Transaction Failed',
        message: 'Transaction Failed, please try again.',
      }, 'top-right', 'error')
      console.error('Failed to submit order', error);
    }
  };

  const showToast = (newToast: ToastItemProp, position: string, type: string = 'info') => {
    setToastList([...toastList, newToast]);
    setPosition(position);
    setType(type);
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
                      valueList={expiryList.map(date => ({
                        label: dayjs(`${date}`, 'YYYYMMDD').format('DD MMM YY'),
                        value: dayjs(`${date}`, 'YYYYMMDD').format('DD MMM YY'),
                      }))}
                      onChange={value => {
                        setOrderSummary(undefined);
                        setPositionBuilderStrategies([]);
                        setChartData(undefined);
                        setCurrentExpiryDate(getNumber(dayjs(value, 'DD MMM YY').format('YYYYMMDD')));
                      }}
                      value={dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('DD MMM YY')}
                      hasDropdown={true}
                    />
                    <LabelValue label='Next Auction' value={<CountdownTimer />} />
                    <LabelValue
                      label='Last Auction Price'
                      value='1629'
                      subValue={
                        <>
                          <span>{dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('DD')}</span>
                          <span>{dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('MMM')}</span>
                          <span>{dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('YY')}</span>
                        </>
                      }
                    />
                  </Flex>
                  <h3>Position Builder</h3>
                  <PositionBuilderRow
                    title='Options'
                    options={[
                      { option: 'Call', value: 'Call' },
                      { option: 'Put', value: 'Put' },
                    ]}
                    addStrategy={handleAddStrategy}
                    submitAuction={(order: ClientConditionalOrder) => {
                      setAuctionSubmission({
                        order,
                        type: 'Options'
                      });
                      setSubmitModal(true);
                    }}
                  />
                  <PositionBuilderRow
                    title='Digital Options'
                    options={[
                      { option: 'Call', value: 'BinaryCall' },
                      { option: 'Put', value: 'BinaryPut' },
                    ]}
                    addStrategy={handleAddStrategy}
                    submitAuction={(order: ClientConditionalOrder) => {
                      setAuctionSubmission({
                        order,
                        type: 'Digital Options'
                      });
                      setSubmitModal(true);
                    }}
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
                    submitAuction={(order: ClientConditionalOrder) => {
                      setAuctionSubmission({
                        order,
                        type: 'Forward'
                      });
                      setSubmitModal(true);
                    }}
                  />
                </>
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
                    premium={formatNumber(Number(orderSummary?.order.totalNetPrice) || 0, 'string') || '-'}
                    fee={1.5}
                    submitAuction={() => {
                      if (orderSummary?.order) {
                        setSubmitModal(true)
                        setAuctionSubmission({
                          order: orderSummary?.order,
                          type: 'Position Builder'
                        })
                      }
                    }}
                  />
                  <Modal
                    title='Submit to Auction'
                    isOpen={submitModal}
                    onCloseModal={() => setSubmitModal(false)}
                    // isLoading={transactionInProgress}
                    onSubmitOrder={async () => {
                      if (!auctionSubmission) return;
                      submitToAuction(auctionSubmission.order, auctionSubmission.type);
                      setAuctionSubmission(undefined);
                      setSubmitModal(false);
                    }}>
                    <>
                      <div>Please confirm if you’d like to submit your order to auction.</div>
                      <div className={styles.divider}></div>
                      <Flex margin='mb-14'>
                        <h5 className='flexGrow'>Order Limit</h5>
                        <div>
                        <span className={styles.amountLabel}>{formatNumber(Number(auctionSubmission?.order.totalNetPrice) || 0, 'string') || '-'}</span>
                          <LogoUsdc />
                          <span className={styles.currencyLabel}>USDC</span>
                        </div>
                      </Flex>
                      <Flex margin='mb-14'>
                        <h5 className='flexGrow'>Collateral Requirement</h5>
                        <div>
                          <div>
                          <span className={styles.amountLabel}>{orderSummary ? formatNumber(orderSummary.orderLock.underlierAmount, 'string') : '-'}</span>
                            <LogoEth />
                            <span className={styles.currencyLabel}>WETH</span>
                          </div>
                          <div>
                          <span className={styles.amountLabel}>{orderSummary
                              ? formatNumber(
                                toPrecision(
                                  orderSummary.orderLock.numeraireAmount - getNumber(orderSummary.order.totalNetPrice),
                                  currencyPrecision.strike
                                ),
                                'string'
                              )
                              : '-'
                          }</span> <LogoUsdc />
                            <span className={styles.currencyLabel}>USDC</span>
                          </div>
                        </div>
                      </Flex>
                      <Flex margin='mb-14'>
                        <h5 className='flexGrow color-white'>Total Premium</h5>
                        <div>
                        <span className={styles.amountLabel}>{formatNumber(Number(auctionSubmission?.order.totalNetPrice) || 0, 'string') || '-'}</span>
                          <LogoUsdc />
                          <span className={styles.currencyLabel}>USDC</span>
                        </div>
                      </Flex>
                      <div className={styles.divider}></div>
                      <Flex margin='mb-14'>
                        <h5 className='flexGrow'>Platform Fee</h5>
                        <div>
                        <span className={styles.amountLabel}>1.5</span>
                          <LogoUsdc />
                          <span className={styles.currencyLabel}>USDC</span>
                        </div>
                      </Flex>
                    </>
                  </Modal>
                  <Toast toastList={toastList} type={type} position={position} />
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
                    <ChartPayoff chartData={chartData} height={300} />
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
