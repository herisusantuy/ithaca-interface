// Components
import Meta from '@/UI/components/Meta/Meta';
import styles from './position-builder.module.scss';
// Layout
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import TradingLayout from '@/UI/layouts/TradingLayout/TradingLayout';
import Flex from '@/UI/layouts/Flex/Flex';
import LabelValue from '@/UI/components/LabelValue/LabelValue';
import CountdownTimer from '@/UI/components/CountdownTimer/CountdownTimer';
import Asset from '@/UI/components/Asset/Asset';
import LogoEth from '@/UI/components/Icons/LogoEth';
import Panel from '@/UI/layouts/Panel/Panel';
import TableStrategy from '@/UI/components/TableStrategy/TableStrategy';
import { TABLE_STRATEGY_DATA, StrategyType } from '@/UI/constants/tableStrategy';
import { useCallback, useState } from 'react';
import PositionBuilderRow, { Strategy } from '@/UI/components/PositionBuilderRow/PositionBuilderRow';
import OrderSummary from '@/UI/components/OrderSummary/OrderSummary';
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
import { useAppStore } from '@/UI/lib/zustand/store';
import dayjs from 'dayjs';
import { estimateLock, Leg } from '@/UI/lib/sdk/estimateOrders';
import { estimateOrderSingleLeg } from '@/UI/utils/estimate.order';
import useFromStore from '@/UI/hooks/useFromStore';
import { ConditionalOrder } from '@/UI/lib/sdk/ConditionalOrder';

const Index = () => {
  const [strategyList, setStrategyList] = useState<StrategyType[]>([]);
  const [previousLegs, setpreviousLegs] = useState<Leg[]>([]);
  const currentExpiryDate = useFromStore(useAppStore, state => state.currentExpiryDate);
  console.log(currentExpiryDate);
  const getOrderSummary = useCallback(async (payload: ConditionalOrder) => {
    const test = await estimateLock(payload);
    console.log(test);
  }, []);

  return (
    <>
      <Meta />
      <Main>
        <Container>
          <TradingLayout isLite={false} />
          <Flex>
            <div>
              <Flex gap='gap-12'>
                <Asset icon={<LogoEth />} label='ETH' />
                <LabelValue
                  label='Expiry Date'
                  value={currentExpiryDate && dayjs(currentExpiryDate.toString(), 'YYYYMMDD').format('DDMMMYY')}
                  hasDropdown={true}
                />
                <LabelValue label='Next Auction' value={<CountdownTimer />} />
                <LabelValue label='Last Auction Price' value='1629' subValue='10Oct23 13:23' />
              </Flex>
              <h3 className={styles.title}>Position Builder</h3>
              <div className={styles.positionTitle}>
                <Flex>
                  <h4>Options</h4>
                  {/* <p>Side</p>
                  <p>Size</p>
                  <p>Strike</p>
                  <p>Unit Price</p>
                  <p>Collateral</p>
                  <p>Premium</p> */}
                </Flex>
              </div>
              <PositionBuilderRow
                isForwards={false}
                options={['Call', 'Put']}
                valueOptions={['Call', 'Put']}
                addStrategy={(value: Strategy) => {
                  const legs = [
                    ...previousLegs,
                    {
                      contractId: value.contractId,
                      quantity: value.size,
                      side: value.side,
                    },
                  ];
                  setpreviousLegs(legs);
                  const payload = estimateOrderSingleLeg(value.type, legs, value.enterPrice, 20231110);
                  if (payload) {
                    getOrderSummary(payload);
                  }
                  setStrategyList([
                    ...strategyList,
                    {
                      ...value,
                      side: value.side === 'BUY' ? '+' : '-',
                    },
                  ] as StrategyType[]);
                }}
                // submitAuction={() => { }}
                id='options-row'
              />
              <h4 className={styles.positionTitle}>Digital Options</h4>
              <PositionBuilderRow
                isForwards={false}
                options={['Call', 'Put']}
                valueOptions={['BinaryCall', 'BinaryPut']}
                addStrategy={(value: Strategy) => {
                  const legs = [
                    ...previousLegs,
                    {
                      contractId: value.contractId,
                      quantity: value.size,
                      side: value.side,
                    },
                  ];
                  setpreviousLegs(legs);
                  const payload = estimateOrderSingleLeg(value.type, legs, value.enterPrice, 20231110);
                  if (payload) {
                    getOrderSummary(payload);
                  }
                  setStrategyList([
                    ...strategyList,
                    {
                      ...value,
                      side: value.side === 'BUY' ? '+' : '-',
                    },
                  ] as StrategyType[]);
                }}
                // submitAuction={(value: StrategyType) => console.log(value)}
                id='digital-options-row'
              />
              <h4 className={styles.positionTitle}>Forwards</h4>
              <PositionBuilderRow
                isForwards={true}
                options={['10Nov23', 'Next Auction']}
                valueOptions={['Forward (10 Nov 23)', 'Forward (Next Auction)']}
                addStrategy={(value: Strategy) => {
                  const legs = [
                    ...previousLegs,
                    {
                      contractId: value.contractId,
                      quantity: value.size,
                      side: value.side,
                    },
                  ];
                  setpreviousLegs(legs);
                  const payload = estimateOrderSingleLeg(value.type, legs, value.enterPrice, 20231110);
                  if (payload) {
                    getOrderSummary(payload);
                  }
                  setStrategyList([
                    ...strategyList,
                    {
                      ...value,
                      side: value.side === 'BUY' ? '+' : '-',
                    },
                  ] as StrategyType[]);
                }}
                // submitAuction={() => { }}
                id='forwards-row'
              />
              <div className={styles.summaryWrapper}>
                <OrderSummary
                  limit='100'
                  collatarelETH='120.2k'
                  collatarelUSDC='200.1k'
                  premium='1500'
                  submitAuction={() => {}}
                />
              </div>
            </div>
            <div className={styles.strategyPanel}>
              <Panel>
                <div className='p-20'>
                  <h3 className={`color-white mb-5`}>Strategy</h3>
                  <div className={styles.tableWrapper}>
                    <TableStrategy
                      data={strategyList}
                      removeRow={(index: number) => {
                        const updatedData = [...strategyList];
                        updatedData.splice(index, 1);
                        setStrategyList(updatedData);
                      }}
                    ></TableStrategy>
                  </div>
                  <h3 className={`color-white mb-5 mt-32`}>Payoff Diagram</h3>
                  <ChartPayoff />
                </div>
              </Panel>
            </div>
          </Flex>
        </Container>
      </Main>
    </>
  );
};

export default Index;
