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
import { useAppStore } from '@/UI/lib/zustand/store';
import { useCallback, useEffect, useState } from 'react';
import { formatNumber } from '@/UI/utils/Numbers';
import { formatUnits, parseUnits } from 'viem';

const Analytics = () => {
  const {ithacaSDK, systemInfo} = useAppStore();
  const [analytics, setAnalytics] = useState(ANALYTICS_CARD_DATA);
  useEffect(() => {
    getAnalytics()
  }, [])

  const getAnalytics = useCallback(async () => {
    const volume = await ithacaSDK.analytics.totalTradingVolume('WETH', 'USDC');
    const contracts = await ithacaSDK.analytics.totalContractsTraded('WETH', 'USDC');
    const locked = await ithacaSDK.analytics.totalValueLocked('WETH', 'USDC');
    const interest = await ithacaSDK.analytics.totalOpenInterest('WETH', 'USDC');
    parseUnits(volume.toString(), systemInfo.tokenDecimals['USDC'])
    setAnalytics([
      {
        ...analytics[0],
        mainValue: formatNumber(Number(formatUnits(BigInt(volume), systemInfo.tokenDecimals['USDC'])), 'string')
      },
      {
        ...analytics[1],
        mainValue: formatNumber(contracts, 'string')
      }, 
      {
        ...analytics[2],
        mainValue: formatNumber(Number(formatUnits(BigInt(locked), systemInfo.tokenDecimals['WETH'])), 'string')
      }, 
      {
        ...analytics[3],
        mainValue: formatNumber(interest, 'string')
      }, 
    ]);
    const byProduct = await ithacaSDK.analytics.openInterestByProduct('WETH', 'USDC', '2023-01-01', '2023-12-31')
    const count = await ithacaSDK.analytics.dailyVolume('WETH', 'USDC', '2023-01-01', '2023-12-31')
    const byStrike = await ithacaSDK.analytics.openInterestByStrike('WETH', 'USDC', '2023-01-01', '2023-12-31', 1400, 2200)
    const trades = await ithacaSDK.analytics.trades('WETH', 'USDC', '2023-01-01', '2023-12-31')
  }, [])
  return (
    <>
      <Meta />
      <Main>
        <Container margin='mb-15 mt-8'>
          {/* <h1>Analytics</h1> */}
          <Flex direction='row-center' margin='mb-24' gap='gap-12 column-tablet-start gap-tablet-8'>
            <p className='fs-xs'>Date Range</p>
            <DatePicker />
          </Flex>
          <AnalyticsLayout
            leftPanel={
              <Flex direction='column' gap='gap-15 wrap-tablet'>
                {analytics.map((card: AnalyticsCardData, index: number) => (
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
              <Panel margin='ptb-24 plr-30 full-width full-height p-tablet-16'>
                <h3 className='mb-18 mb-tablet-16'>Trade Count</h3>
                <ChartTradeCount data={CHART_TRADE_COUNT_DATA} />
              </Panel>
            }
          />
          <Flex direction='row-space-between' gap='gap-15 mb-15 align-stretch column-tablet'>
            <Panel margin='ptb-24 plr-30 full-width p-tablet-16'>
              <h3 className='mb-18'>Open Interest</h3>
              <ChartOpenInterest data={CHART_OPEN_INTEREST_DATA} />
            </Panel>
            <Panel margin='ptb-24 plr-30 full-width p-tablet-16'>
              <h3 className='mb-18'>Trading Volumes</h3>
              <ChartTradingVolume data={CHART_TRADING_VOLUME_DATA} />
            </Panel>
          </Flex>
          <Panel margin='ptb-24 plr-30 full-width p-tablet-16'>
            <h3 className='mb-18'>Max Pain</h3>
            <ChartMaxPain data={CHART_MAX_PAIN_ANY_TYPE} />
          </Panel>
        </Container>
      </Main>
    </>
  );
};

export default Analytics;
