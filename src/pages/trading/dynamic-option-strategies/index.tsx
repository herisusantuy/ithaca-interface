// Packages
import { useState } from 'react';

// SDK
import { ClientConditionalOrder, Leg, OrderLock, toPrecision } from '@ithaca-finance/sdk';
import { calculateNetPrice, createClientOrderId } from '@ithaca-finance/sdk';
import useToast from '@/UI/hooks/useToast';

// Lib
import { useAppStore } from '@/UI/lib/zustand/store';

// Constants
import { PrepackagedStrategy, LINEAR_STRATEGIES, STRUCTURED_STRATEGIES, SIDE } from '@/UI/constants/prepackagedStrategies';

// Utils
import { formatNumber, getNumber } from '@/UI/utils/Numbers';
import { PayoffMap, estimateOrderPayoff } from '@/UI/utils/CalcChartPayoff';
import ReadyState from '@/UI/utils/ReadyState';

// Components
import Meta from '@/UI/components/Meta/Meta';
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

// Hooks

import { useDevice } from '@/UI/hooks/useDevice';

// Styles
import styles from './dynamic-option-strategies.module.scss';
import Toggle from '@/UI/components/Toggle/Toggle';
import SubmitModal from '@/UI/components/SubmitModal/SubmitModal';
import { AuctionSubmission } from '../position-builder';
import { Currency } from '@/UI/components/Currency';

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
  const [submitModal, setSubmitModal] = useState<boolean>(false);
  const [strategy, setStrategy] = useState(LINEAR_STRATEGIES[0]);
  // Store
  const { ithacaSDK, currencyPrecision, getContractsByPayoff } =
    useAppStore();
  const { toastList, position, showToast } = useToast();
  const [auctionSubmission, setAuctionSubmission] = useState<AuctionSubmission | undefined>();
  const [sharedSize, setSharedSize] = useState(LINEAR_STRATEGIES[0].strategies.map((s) => s.size));
  const [linkToggle, setLinkToggle] = useState<'right'|'left'>('right');
  const [strategyType, setSetStrategyType] = useState<'LINEAR'|'STRUCTURED'>('LINEAR');
  const device = useDevice()

  const sections: SectionType[] = [
    { name: 'Product', style: styles.product },
    { name: 'Type', style: styles.type },
    { name: 'Side', style: styles.side },
    { name: 'Size', style: styles.size },
    { name: 'Strike', style: styles.strike },
    { name: 'Unit Price', style: styles.unitPrice },
  ];
  const handleStrategyChange = (strat: string, type: 'LINEAR' | 'STRUCTURED') => {
    const newStrategy = (type === 'LINEAR' ? LINEAR_STRATEGIES : STRUCTURED_STRATEGIES).find(s => s.key === strat) as PrepackagedStrategy;
    if (newStrategy.key === strategy.key) return;
    setSetStrategyType(type);
    setOrderSummary(undefined);
    setChartData(undefined);
    setPositionBuilderStrategies([]);
    setSharedSize(newStrategy.strategies.map((s) => s.size));
    setLinkToggle('right');
    setStrategy({...{
      label: newStrategy?.label,
      key: newStrategy?.key,
      strategies: newStrategy ? [
        ...newStrategy.strategies
      ] : [],
    }});
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
      setOrderSummary({
        order,
        orderLock
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
    const shared = [...sharedSize];
    shared.splice(index, 1);
    setSharedSize([...shared])
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
    setSharedSize([]);
    setStrategy({ ...strategy, strategies: [] });
  };

  const addPosition = () => {
    let size = 1;
    if (strategy.strategies.length) {
      const test = strategy.strategies.reduce((arr, s, i)=> {
        if (s.linked) {
          arr.push(sharedSize[i])
        }
        return arr;
      }, [] as number[]);
      if (test.length) {
        size = Math.max.apply(null, test);
      }
    }
    setStrategy({
      ...strategy,
      strategies: [
        ...strategy.strategies,
        {
          product: 'option',
          type: 'Call',
          side: SIDE.BUY,
          size: size || 1,
          strike: 0,
          linked: true
        },
      ],
    });
    setSharedSize([...sharedSize,size || 1])
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
                  <Currency
                    onExpiryChange={() => {
                      setOrderSummary(undefined);
                      setPositionBuilderStrategies([]);
                      setChartData(undefined);
                    }}
                  />
                  {(device !== 'desktop') ? (
                    <div className={styles.moduleHeader}>
                      <h3 className='mb-0'>Dynamic Option Strategy</h3>
                      <Toggle defaultState={linkToggle} size='sm' rightLabel='Link all' rightLabelClass='link-icon' onChange={(side) => {
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
                        }
                      />
                    </div>
                  ) :
                  (
                    <h3>Dynamic Option Strategy</h3>
                  )}
                  <div className='mb-24'>
                    <Flex direction='row-space-between'>
                      <Flex gap='gap-32'>
                        <div className={styles.prePackagedContainer}>
                          <div className={styles.prePackagedTitle}>Linear Combinations</div>
                          <div className={styles.dropDownWrapper}>
                            <DropdownMenu
                              width={200}
                              value={strategyType === 'LINEAR' ? {
                                name: strategy.label,
                                value: strategy.key,
                              } : {
                                name: '-',
                                value: ''
                              }}
                              options={LINEAR_STRATEGIES.map(strat => {
                                return {
                                  name: strat.label,
                                  value: strat.key,
                                };
                              })}
                              onChange={option => handleStrategyChange(option, 'LINEAR')}
                            />
                          </div>
                        </div>
                        <div className={styles.prePackagedContainer}>
                          <div className={styles.prePackagedTitle}>Structured Products</div>
                          <div className={styles.dropDownWrapper}>
                            <DropdownMenu
                              width={200}
                              value={strategyType === 'STRUCTURED' ? {
                                name: strategy.label,
                                value: strategy.key,
                              } : {
                                name: '-',
                                value: ''
                              }}
                              options={STRUCTURED_STRATEGIES.map(strat => {
                                return {
                                  name: strat.label,
                                  value: strat.key,
                                };
                              })}
                              onChange={option => handleStrategyChange(option, 'STRUCTURED')}
                            />
                          </div>
                        </div>
                      </Flex>
                      { (device === 'desktop') &&
                        <Toggle defaultState={linkToggle} size='sm' rightLabel='Link all' rightLabelClass='link-icon' onChange={(side) => {
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
                      }
                    </Flex>
                  </div>
                  <div className={styles.strategiesWrapper}>
                    {strategy.strategies.length ? (
                      <>
                        <div className={styles.parent}>
                          {
                            (device === 'desktop') &&
                            <>
                              {sections.map((section, index) => (
                                <div key={index} className={section.style}>
                                  <p>{section.name}</p>
                                </div>
                              ))}
                              <div className={styles.action}></div>
                            </>
                          }
                        </div>
                        {strategy.strategies.map((strat, index) => {
                          return (
                            <DynamicOptionRow
                              id={`strategy-${index}-${strategy.key}`}
                              key={`strategy-${index}-${strategy.key}`}
                              strategy={strat}
                              linked={strat.linked}
                              sizeChange={(size:number) => {
                                if (strat.linked) {
                                  const sizes = strategy.strategies.map((s, index) => 
                                    s.linked ? size :  sharedSize[index]
                                  )
                                  setSharedSize([...sizes]);
                                  const strats = positionBuilderStrategies.map((s, i) => {
                                    const st = strategy.strategies[i];
                                    return {
                                      ...s,
                                      leg: {
                                        ...s.leg,
                                        quantity: st.linked ? `${size}` as `${number}` : s.leg.quantity
                                      }
                                    }
                                  });
                                  setPositionBuilderStrategies(strats);
                                  getPositionBuilderSummary([...strats]);
                                }
                                else {
                                  const sizes = [...sharedSize];
                                  sizes[index] = size;
                                  setSharedSize([...sizes]);
                                  positionBuilderStrategies[index] = {
                                    ...positionBuilderStrategies[index],
                                    leg: {
                                      ...positionBuilderStrategies[index].leg,
                                      quantity: `${size}`
                                    }
                                  };
                                  setPositionBuilderStrategies(positionBuilderStrategies);
                                  getPositionBuilderSummary(positionBuilderStrategies);
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
                    premium={orderSummary?.order.totalNetPrice}
                    fee={1.5}
                    submitAuction={() => {
                      if (!orderSummary) return;
                      setSubmitModal(true);
                      setAuctionSubmission({
                        order: orderSummary?.order,
                        type: 'Position Builder',
                      });
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
                    removeRow={(index: number) => {
                      handleRemoveStrategy(index);
                    }}
                    clearAll={handleRemoveAllStrategies}
                  />
                  {chartData ? (
                    <ChartPayoff chartData={chartData} height={210} id='dynamic-chart' />
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
