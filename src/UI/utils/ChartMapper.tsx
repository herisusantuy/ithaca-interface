// Components
import Chart from '@/UI/components/Chart/Chart';
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';

// Map charts to contentId from TRADING_MARKET_TABS constants
const contentMap: { [key: string]: JSX.Element } = {
  optionsChart: <ChartPayoff />,
  digitalOptionsChart: <Chart />,
  forwardsChart: <Chart />,
  optionsCall: <Chart />,
  optionsPut: <Chart />,
  digitalOptionsCall: <Chart />,
  digitalOptionsPut: <Chart />,
  forwardsExpiryDate: <Chart />,
  forwardsNextAuction: <Chart />,
};

export const getChartMapper = (contentId: string) => {
  return contentMap[contentId] || null;
};
