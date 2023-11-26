// Components
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';

// Map charts to contentId from TRADING_MARKET_TABS constants
const contentMap: { [key: string]: JSX.Element } = {
  optionsChart: <ChartPayoff chartData={CHART_FAKE_DATA} height={300} id='tab-options-chart' />,
  digitalOptionsChart: <ChartPayoff chartData={CHART_FAKE_DATA} height={300} id='tab-digital-chart' />,
  forwardsChart: <ChartPayoff chartData={CHART_FAKE_DATA} height={300} id='tab-forwards-chart' />,
  optionsCall: <ChartPayoff chartData={CHART_FAKE_DATA} height={300} id='tab-call-chart' />,
  optionsPut: <ChartPayoff chartData={CHART_FAKE_DATA} height={300} id='tab-put-chart' />,
  digitalOptionsCall: <ChartPayoff chartData={CHART_FAKE_DATA} height={300} id='tab-digital-call-chart' />,
  digitalOptionsPut: <ChartPayoff chartData={CHART_FAKE_DATA} height={300} id='tab-digital-put-chart' />,
  forwardsExpiryDate: <ChartPayoff chartData={CHART_FAKE_DATA} height={300} id='tab-forward-expiry-chart' />,
  forwardsNextAuction: <ChartPayoff chartData={CHART_FAKE_DATA} height={300} id='tab-forward-next-chart' />,
};

export const getChartMapper = (contentId: string) => {
  return contentMap[contentId] || null;
};
