// Components
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
import { CHART_FAKE_DATA } from '@/UI/constants/charts';

// Map charts to contentId from TRADING_MARKET_TABS constants
const contentMap: { [key: string]: JSX.Element } = {
  optionsChart: <ChartPayoff chartData={CHART_FAKE_DATA} height={300}/>,
  digitalOptionsChart: <ChartPayoff chartData={CHART_FAKE_DATA} height={300}/>,
  forwardsChart: <ChartPayoff chartData={CHART_FAKE_DATA} height={300}/>,
  optionsCall: <ChartPayoff chartData={CHART_FAKE_DATA} height={300}/>,
  optionsPut: <ChartPayoff chartData={CHART_FAKE_DATA} height={300}/>,
  digitalOptionsCall: <ChartPayoff chartData={CHART_FAKE_DATA} height={300}/>,
  digitalOptionsPut: <ChartPayoff chartData={CHART_FAKE_DATA} height={300}/>,
  forwardsExpiryDate: <ChartPayoff chartData={CHART_FAKE_DATA} height={300}/>,
  forwardsNextAuction: <ChartPayoff chartData={CHART_FAKE_DATA} height={300}/>,
};

export const getChartMapper = (contentId: string) => {
  return contentMap[contentId] || null;
};
