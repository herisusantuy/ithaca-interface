// Packages
import { useState } from 'react';
import dayjs from 'dayjs';

// SDK
import { ClientConditionalOrder, Leg, OrderLock, OrderPayoff, toPrecision } from '@ithaca-finance/sdk';
import { calculateNetPrice, createClientOrderId } from '@ithaca-finance/sdk';
import useToast from '@/UI/hooks/useToast';

// Lib
import { useAppStore } from '@/UI/lib/zustand/store';

// Constants
import { PrepackagedStrategy, STRATEGIES } from '@/UI/constants/prepackagedStrategies';

// Utils
import { formatNumber, getNumber } from '@/UI/utils/Numbers';
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import ReadyState from '@/UI/utils/ReadyState';

// Components
import Meta from '@/UI/components/Meta/Meta';
import LabelValue from '@/UI/components/LabelValue/LabelValue';
import CountdownTimer from '@/UI/components/CountdownTimer/CountdownTimer';
import Asset from '@/UI/components/Asset/Asset';
import LogoEth from '@/UI/components/Icons/LogoEth';
import TableStrategy from '@/UI/components/TableStrategy/TableStrategy';
import OrderSummary from '@/UI/components/OrderSummary/OrderSummary';
import Button from '@/UI/components/Button/Button';
import Plus from '@/UI/components/Icons/Plus';
import PayoffOutline from '@/UI/components/Icons/PayoffOutline';
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
import DynamicOptionRow from '@/UI/components/DynamicOptionRow/DynamicOptionRow';
import DropdownMenu from '@/UI/components/DropdownMenu/DropdownMenu';

// Layouts
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import TradingLayout from '@/UI/layouts/TradingLayout/TradingLayout';
import Flex from '@/UI/layouts/Flex/Flex';
import Sidebar from '@/UI/layouts/Sidebar/Sidebar';
import Toast from '@/UI/components/Toast/Toast';

// Styles
import styles from './dynamic-option-strategies.module.scss';
import Toggle from '@/UI/components/Toggle/Toggle';

// Types
export interface DynamicOptionStrategy {
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

type SectionType = {
  name: string;
  style: string;
};

const Index = () => {
  // State
  const [positionBuilderStrategies, setPositionBuilderStrategies] = useState<DynamicOptionStrategy[]>([]);
  const [orderSummary, setOrderSummary] = useState<OrderSummary>();
  const [chartData, setChartData] = useState<PayoffMap[]>();
  const [strategy, setStrategy] = useState(STRATEGIES[0]);
  // Store
  const { ithacaSDK, currencyPrecision, currentExpiryDate, getContractsByPayoff, expiryList, setCurrentExpiryDate } =
    useAppStore();
  const { toastList, position, showToast } = useToast();
  const [sharedSize, setSharedSize] = useState(STRATEGIES[0].strategies.map((s) => s.size));
  const [linkToggle, setLinkToggle] = useState<'right'|'left'>('right');

  const sections: SectionType[] = [
    { name: 'Product', style: styles.product },
    { name: 'Type', style: styles.type },
    { name: 'Side', style: styles.side },
    { name: 'Size', style: styles.size },
    { name: 'Strike', style: styles.strike },
    { name: 'Price Per Leg', style: styles.unitPrice },
    { name: '', style: styles.action },
  ];
  const handleStrategyChange = (strat: string) => {
    const newStrategy = STRATEGIES.find(s => s.key === strat) as PrepackagedStrategy;
    setOrderSummary(undefined);
    setChartData(undefined);
    setPositionBuilderStrategies([]);
    setSharedSize(Array(newStrategy.strategies.length).fill('1'));
    setLinkToggle('right');
    setStrategy({
      label: newStrategy?.label,
      key: newStrategy?.key,
      strategies: newStrategy?.strategies,
    });
  };

  const getPositionBuilderSummary = async (positionBuilderStrategies: DynamicOptionStrategy[]) => {
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

  const handleStrategyUpdate = (strategy: DynamicOptionStrategy, index: number) => {
    positionBuilderStrategies[index] = strategy;
    setPositionBuilderStrategies(positionBuilderStrategies);
    getPositionBuilderSummary(positionBuilderStrategies);
  };

  const handleLinkChange = (isLinked: boolean, index: number) => {
    if (isLinked) {
      const otherLinked = strategy.strategies.reduce((arr,s, index) => {
        if (s.linked) {
          arr.push(index);
        }
        return arr
      }, [] as number[]);
      if (otherLinked.length) {
        const largest = Math.max.apply(null, otherLinked.map((i) => sharedSize[i]))        
        const sizes = [...sharedSize];
        sizes[index] = largest;
        setSharedSize([...sizes]);
        const newStrat = positionBuilderStrategies[index];
        newStrat.leg.quantity = `${largest}`;
        positionBuilderStrategies[index] = newStrat;
        setPositionBuilderStrategies(positionBuilderStrategies);
        getPositionBuilderSummary(positionBuilderStrategies);
      }
      if (otherLinked.length + 1 === strategy.strategies.length) {
        setLinkToggle('right');
      }
    }
    else {
      setLinkToggle('left')
    }
    strategy.strategies[index].linked = isLinked;
    setStrategy({...strategy});
  };

  const handleRemoveStrategy = (index: number) => {
    const newPositionBuilderStrategies = [...positionBuilderStrategies];
    newPositionBuilderStrategies.splice(index, 1);
    const newstrategies = [...strategy.strategies];
    newstrategies.splice(index, 1);
    setStrategy({
      ...strategy,
      strategies: newstrategies,
    });
    if (!newPositionBuilderStrategies.length) {
      setPositionBuilderStrategies([]);
      setOrderSummary(undefined);
      setChartData(undefined);
    } else {
      setPositionBuilderStrategies(newPositionBuilderStrategies);
      getPositionBuilderSummary(newPositionBuilderStrategies);
    }
  };

  const handleRemoveAllStrategies = () => {
    setPositionBuilderStrategies([]);
    setOrderSummary(undefined);
    setChartData(undefined);
    setStrategy({ ...strategy, strategies: [] });
  };

  const addPosition = () => {
    setStrategy({
      ...strategy,
      strategies: [
        ...strategy.strategies,
        {
          product: 'option',
          type: 'Call',
          side: 'BUY',
          size: 1,
          strike: 0,
          linked: true
        },
      ],
    });
  };

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

  return (
    <>
      <Meta />
      <Main>
        <Container>
          <ReadyState>
            <TradingLayout />
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
                    <LabelValue label='Last Auction Price' value='1629' subValue='10Oct23 13:23' />
                  </Flex>
                  <h3>Dynamic Option Strategy</h3>
                  <div className='mb-24'>
                    <Flex>
                      <Flex>
                        <div className={styles.prePackagedTitle}>Pre-Packaged Strategy</div>
                        <div className={styles.dropDownWrapper}>
                          <DropdownMenu
                            value={{
                              name: strategy.label,
                              value: strategy.key,
                            }}
                            options={STRATEGIES.map(strat => {
                              return {
                                name: strat.label,
                                value: strat.key,
                              };
                            })}
                            onChange={option => handleStrategyChange(option)}
                          />
                        </div>
                      </Flex>
                      <Toggle defaultState={linkToggle} size='sm' rightLabel='Link' rightLabelClass='link-icon' onChange={(side) => {
                          const newStrats = strategy.strategies.map((s) => {
                            return {
                              ...s,
                              linked: side === 'right'
                            }
                          });
                          setStrategy({...strategy,
                          strategies: newStrats})
                          if (side === 'right') {
                              const largest = Math.max.apply(null,  sharedSize);
                              setSharedSize(Array(newStrats.length).fill(largest));
                              const strats = positionBuilderStrategies.map((s) => {
                                const leg = {
                                  ...s.leg,
                                  quantity: `${largest}` as `${number}`
                                };
                                return {
                                  ...s,
                                  leg
                                }
                              });
                              setPositionBuilderStrategies([...strats]);
                              getPositionBuilderSummary([...strats]);
                            }
                          }
                      }/>
                    </Flex>
                  </div>
                  <div className={styles.strategiesWrapper}>
                    {strategy.strategies.length ? (
                      <>
                        <div className={styles.parent}>
                          <>
                            {sections.map((section, index) => (
                              <div key={index} className={section.style}>
                                <p>{section.name}</p>
                              </div>
                            ))}
                            <div className={styles.action}></div>
                          </>
                        </div>
                        {strategy.strategies.map((strat, index) => {
                          return (
                            <DynamicOptionRow
                              id={`strategy-${index}-${strategy.key}`}
                              key={`strategy-${index}`}
                              strategy={strat}
                              linked={strat.linked}
                              sizeChange={(size:number) => {
                                if (strat.linked) {
                                  const sizes = strategy.strategies.map((s, index) => 
                                    s.linked ? size :  sharedSize[index]
                                  )
                                  setSharedSize([...sizes]);
                                }
                                else {
                                  const sizes = [...sharedSize];
                                  sizes[index] = size;
                                  setSharedSize([...sizes]);
                                }
                              }}
                              sharedSize={sharedSize[index].toString()}
                              linkChange={(isLinked) => handleLinkChange(isLinked, index)}
                              updateStrategy={strat => handleStrategyUpdate(strat, index)}
                              removeStrategy={() => handleRemoveStrategy(index)}
                            />
                          );
                        })}
                      </>
                    ) : (
                      <div className={styles.strategiesPlaceholder}></div>
                    )}
                    <div>
                      <Button
                        title='Click to add Position '
                        size='sm'
                        variant='secondary'
                        onClick={() => addPosition()}
                      >
                        <Plus /> Add Position
                      </Button>
                      {positionBuilderStrategies.length > 0 && (
                        <Button
                          className={styles.clearAll}
                          title='Click to clear all'
                          onClick={handleRemoveAllStrategies}
                          variant='clear'
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                  </div>
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
                      if (!orderSummary) return;
                      submitToAuction(orderSummary.order, 'Position Builder');
                    }}
                  />
                  <Toast toastList={toastList} position={position} />
                </>
              }
              rightPanel={
                <>
                  <h3 className='mb-13'>Strategy</h3>
                  <TableStrategy
                    strategies={positionBuilderStrategies}
                    removeRow={(index: number) => {
                      handleRemoveStrategy(index);
                    }}
                    clearAll={handleRemoveAllStrategies}
                  />
                  {chartData ? (
                    <ChartPayoff chartData={chartData} height={230} id='dynamic-chart' />
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
