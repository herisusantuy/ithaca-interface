// Packages
import { useCallback, useState } from 'react';
import dayjs from 'dayjs';

// Constants
import { StrategyType } from '@/UI/constants/tableStrategy';
import { PayoffDataProps, SPECIAL_DUMMY_DATA } from '@/UI/constants/charts';

// SDK
import { Leg } from '@ithaca-finance/sdk';
import { calculateNetPrice, createClientOrderId, toPrecision } from '@ithaca-finance/sdk';
import readWriteSDK from '@/UI/lib/sdk/readWriteSDK';
import { ENUM_STRATEGY_TYPES } from '@/UI/lib/sdk/StrategyType';

// Lib
import { useAppStore } from '@/UI/lib/zustand/store';

// Hooks
import useFromStore from '@/UI/hooks/useFromStore';

// Utils
import { getLeg, getStrategy, getStrategyPrices, getStrategyTotal } from '@/UI/utils/Cakculations';

// Components
import { Strategy } from '@/UI/components/PositionBuilderRow/PositionBuilderRow';
import Meta from '@/UI/components/Meta/Meta';
import LabelValue from '@/UI/components/LabelValue/LabelValue';
import CountdownTimer from '@/UI/components/CountdownTimer/CountdownTimer';
import Asset from '@/UI/components/Asset/Asset';
import LogoEth from '@/UI/components/Icons/LogoEth';
import TableStrategy from '@/UI/components/TableStrategy/TableStrategy';
import PositionBuilderRow from '@/UI/components/PositionBuilderRow/PositionBuilderRow';
import OrderSummary from '@/UI/components/OrderSummary/OrderSummary';
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';

// Layouts
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import TradingLayout from '@/UI/layouts/TradingLayout/TradingLayout';
import Flex from '@/UI/layouts/Flex/Flex';
import Sidebar from '@/UI/layouts/Sidebar/Sidebar';

// Styles
import styles from './position-builder.module.scss';

// Types
type Summary = {
  underlierAmount: number;
  numeraireAmount: number;
  limit: number;
  premium: number;
};

const Index = () => {
  // State
  const [strategyList, setStrategyList] = useState<StrategyType[]>([]);
  const [previousLegs, setpreviousLegs] = useState<Leg[]>([]);
  const [chartData, setChartData] = useState<PayoffDataProps[]>([]);
  const [summaryDetails, setSummaryDetails] = useState<Summary>();

  // Store
  const currentExpiryDate = useFromStore(useAppStore, state => state.currentExpiryDate);

  const getOrderSummary = useCallback(async (legs: Leg[], list: StrategyType[]) => {
    const totalNetPrice = calculateNetPrice(legs, getStrategyPrices(list), 4, getStrategyTotal(list));
    try {
      const orderLock = await readWriteSDK.sdk?.calculation.estimateOrderLock({
        clientOrderId: createClientOrderId(),
        totalNetPrice: toPrecision(totalNetPrice, 4),
        legs,
      });
      const orderPayoff = await readWriteSDK.sdk?.calculation.estimateOrderPayoff({
        clientOrderId: createClientOrderId(),
        totalNetPrice: toPrecision(totalNetPrice, 4),
        legs,
      });

      setChartData(
        Object.keys(orderPayoff).map(key => ({
          value: orderPayoff[key],
          dashValue: undefined,
        }))
      );
      setSummaryDetails({
        underlierAmount: orderLock.underlierAmount,
        numeraireAmount: orderLock.numeraireAmount,
        limit: totalNetPrice,
        premium: totalNetPrice,
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const submitToAcution = useCallback(
    async (type: string, isSingleOrder: boolean, strategy?: Strategy) => {
      const legs: Leg[] = isSingleOrder && strategy ? [getLeg(strategy)] : previousLegs;
      const list = (isSingleOrder && strategy ? [getStrategy(strategy)] : strategyList) as StrategyType[];
      const totalNetPrice = calculateNetPrice(legs, getStrategyPrices(list), 4, getStrategyTotal(list));
      try {
        await readWriteSDK.sdk?.auth.getSession();
      } catch {
        try {
          await readWriteSDK.sdk?.auth.login();
        } catch (e) {
          console.error(e);
        }
      }
      await readWriteSDK.sdk?.orders.newOrder(
        {
          clientOrderId: createClientOrderId(),
          totalNetPrice: toPrecision(totalNetPrice, 4),
          legs,
        },
        type
      );
    },
    [previousLegs, strategyList]
  );

  return (
    <>
      <Meta />
      <Main>
        <Container>
          <TradingLayout isLite={false} />
          <Sidebar
            leftPanel={
              <>
                <Flex gap='gap-12' margin='mb-24'>
                  <Asset icon={<LogoEth />} label='ETH' />
                  <LabelValue
                    label='Expiry Date'
                    value={currentExpiryDate && dayjs(currentExpiryDate.toString(), 'YYYYMMDD').format('DDMMMYY')}
                    hasDropdown={true}
                  />
                  <LabelValue label='Next Auction' value={<CountdownTimer />} />
                  <LabelValue label='Last Auction Price' value='1629' subValue='10Oct23 13:23' />
                </Flex>
                <h3>Position Builder</h3>
                <PositionBuilderRow
                  title='Options'
                  isForwards={false}
                  options={['Call', 'Put']}
                  valueOptions={['Call', 'Put']}
                  addStrategy={(strategy: Strategy) => {
                    const legs: Leg[] = [...previousLegs, getLeg(strategy)];
                    setpreviousLegs(legs);
                    const list = [...strategyList, getStrategy(strategy)] as StrategyType[];
                    setStrategyList(list as StrategyType[]);
                    getOrderSummary(legs, list);
                  }}
                  submitAuction={(value: Strategy) => submitToAcution(value.type, true, value)}
                  id='options-row'
                />
                <PositionBuilderRow
                  title='Digital Options'
                  isForwards={false}
                  options={['Call', 'Put']}
                  valueOptions={['BinaryCall', 'BinaryPut']}
                  addStrategy={(strategy: Strategy) => {
                    const legs: Leg[] = [...previousLegs, getLeg(strategy)];
                    setpreviousLegs(legs);
                    const list = [...strategyList, getStrategy(strategy)] as StrategyType[];
                    setStrategyList(list as StrategyType[]);
                    getOrderSummary(legs, list);
                  }}
                  submitAuction={(value: Strategy) => submitToAcution(value.type, true, value)}
                  id='digital-options-row'
                />
                <PositionBuilderRow
                  title='Forwards'
                  isForwards={true}
                  options={['10Nov23', 'Next Auction']}
                  valueOptions={['Forward (10 Nov 23)', 'Forward (Next Auction)']}
                  addStrategy={(strategy: Strategy) => {
                    const legs: Leg[] = [...previousLegs, getLeg(strategy)];
                    setpreviousLegs(legs);
                    const list = [...strategyList, getStrategy(strategy)] as StrategyType[];
                    setStrategyList(list as StrategyType[]);
                    getOrderSummary(legs, list);
                  }}
                  submitAuction={(value: Strategy) => submitToAcution(value.type, true, value)}
                  id='forwards-row'
                />
              </>
            }
            orderSummary={
              <OrderSummary
                limit={summaryDetails?.limit || '-'}
                collatarelETH={summaryDetails?.numeraireAmount || '-'}
                collatarelUSDC={summaryDetails?.underlierAmount || '-'}
                premium={summaryDetails?.premium || '-'}
                fee={1.5}
                submitAuction={() => submitToAcution(ENUM_STRATEGY_TYPES.STRATEGY_BUILDER, true)}
              />
            }
            rightPanel={
              <>
                <h3>Strategy</h3>
                <TableStrategy
                  data={strategyList}
                  removeRow={(index: number) => {
                    const legs = [...previousLegs];
                    legs.splice(index, 1);
                    setpreviousLegs(legs);
                    if (legs.length === 0) {
                      setChartData([]);
                    }
                    const list = [...strategyList];
                    list.splice(index, 1);
                    setStrategyList(list);
                    getOrderSummary(legs, list);
                  }}
                />
                <h3>Payoff Diagram</h3>
                {chartData.length && previousLegs.length ? (
                  <ChartPayoff chartData={chartData} specialDot={SPECIAL_DUMMY_DATA} />
                ) : (
                  <div className={styles.tableWrapper}></div>
                )}
              </>
            }
          />
        </Container>
      </Main>
    </>
  );
};

export default Index;

// Single leg, generate order, login/logout and submit

// Multiple leg, add new leg to other legs then esitmate order
// Then login/logout submit
