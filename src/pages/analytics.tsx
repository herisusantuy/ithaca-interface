// Components
import Meta from '@/UI/components/Meta/Meta';
import ChartOpenInterest from '@/UI/components/ChartOpenInterest/ChartOpenInterest';
import ChartMaxPain from '@/UI/components/ChartMaxPain/ChartMaxPain';
import ChartTradeCount from '@/UI/components/ChartTradeCount/ChartTradeCount';
import AnalyticsCard from '@/UI/components/AnalyticsCard/AnalyticsCard';

// Layout
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import Flex from '@/UI/layouts/Flex/Flex';
import Panel from '@/UI/layouts/Panel/Panel';
import AnalyticsLayout from '@/UI/layouts/AnalyticsLayout/AnalyticsLayout';
import DatePicker from '@/UI/components/DatePicker/DatePicker';

// Constants
import { CHART_OPEN_INTEREST_DATA } from '@/UI/constants/charts/chartOpenInterest';
import ChartTradingVolume from '@/UI/components/ChartTradingVolume/ChartTradingVolume';
import { CHART_TRADING_VOLUME_DATA } from '@/UI/constants/charts/chartTradingVolume';
import { CHART_MAX_PAIN_ANY_TYPE } from '@/UI/constants/charts/chartMaxPain';
import { CHART_TRADE_COUNT_DATA } from '@/UI/constants/charts/chartTradeCount';
import { ANALYTICS_CARD_DATA, AnalyticsCardData } from '@/UI/constants/analytics';

const Analytics = () => {
  return (
    <>
      <Meta />
      <Main>
        <Container margin='mb-15 mt-8'>
          <h1>Analytics</h1>
          <Flex direction='row-center' margin='mb-24' gap='gap-12'>
            <p className='fs-xs'>Date Range</p>
            <DatePicker />
          </Flex>
          <AnalyticsLayout
            leftPanel={
              <Flex direction='column' gap='gap-15'>
                {ANALYTICS_CARD_DATA.map((card: AnalyticsCardData, index: number) => (
                  <AnalyticsCard
                    key={index}
                    title={card.title}
                    volume={card.mainValue}
                    change={card.changeValue}
                    currency={card.currency}
                    currencySymbol={card.currencySymbol}
                    isChangePositive={card.isChangePositive}
                  />
                ))}
              </Flex>
            }
            rightPanel={
              <Panel margin='ptb-24 plr-30 full-width full-height'>
                <h3 className='mb-18'>Trade Count</h3>
                <ChartTradeCount data={CHART_TRADE_COUNT_DATA} />
              </Panel>
            }
          />
          <Flex direction='row-space-between' gap='gap-15 mb-15 align-stretch'>
            <Panel margin='ptb-24 plr-30 full-width'>
              <h3 className='mb-18'>Open Interest</h3>
              <ChartOpenInterest data={CHART_OPEN_INTEREST_DATA} />
            </Panel>
            <Panel margin='ptb-24 plr-30 full-width'>
              <h3 className='mb-18'>Trading Volumes</h3>
              <ChartTradingVolume data={CHART_TRADING_VOLUME_DATA} />
            </Panel>
          </Flex>
          <Panel margin='ptb-24 plr-30 full-width'>
            <h3 className='mb-18'>Max Pain</h3>
            <ChartMaxPain data={CHART_MAX_PAIN_ANY_TYPE} />
          </Panel>
        </Container>
      </Main>
    </>
  );
};

export default Analytics;
