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
import { DUMMY_STRATEGY_DATA, StrategyType } from '@/UI/constants/tables';
import { useState } from 'react';
import PositionBuilderRow from '@/UI/components/PositionBuilderRow/PositionBuilderRow';
import OrderSummary from '@/UI/components/OrderSummary/OrderSummary';
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';

const Index = () => {

  const [strategyList, setStrategyList] = useState(DUMMY_STRATEGY_DATA);

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
                <LabelValue label='Expiry Date' value='8Oct23' hasDropdown={true} />
                <LabelValue
                  label='Next Auction'
                  value={<CountdownTimer />}
                />
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
                options={['Call', 'Put']}
                valueOptions={['Call', 'Put']}
                addStrategy={(value: StrategyType) =>
                  setStrategyList([...strategyList, value])}
                defaultOption='Call'
                submitAuction={() => { }}
                id='options-row'
              />
              <h4 className={styles.positionTitle}>Digital Options</h4>
              <PositionBuilderRow
                options={['Call', 'Put']}
                valueOptions={['Binary Call', 'Binary Put']}
                addStrategy={(value: StrategyType) =>
                  setStrategyList([...strategyList, value])}
                defaultOption='Call'
                submitAuction={(value: StrategyType) => console.log(value)}
                id='digital-options-row'
              />
              <h4 className={styles.positionTitle}>Forwards</h4>
              <PositionBuilderRow
                options={['8Oct23', 'Next Auction']}
                valueOptions={['Forward (8 Oct 23)', 'Forward (Next Auction)']}
                addStrategy={(value: StrategyType) =>
                  setStrategyList([...strategyList, value])}
                defaultOption='Forward (Next Auction)'
                submitAuction={() => { }}
                id='forwards-row'
              />
              <div className={styles.summaryWrapper}>
                <OrderSummary
                  limit='100'
                  collatarelETH='120.2k'
                  collatarelUSDC='200.1k'
                  premium='1500'
                  submitAuction={() => { }} />
              </div>
            </div>
            <div className={styles.strategyPanel}>
              <Panel>
                <div className='p-20'>
                  <h3 className={`color-white mb-5`}>Strategy</h3>
                  <TableStrategy data={strategyList} removeRow={(index: number) => {
                    const updatedData = [...strategyList];
                    updatedData.splice(index, 1);
                    setStrategyList(updatedData);
                  }}></TableStrategy>
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
