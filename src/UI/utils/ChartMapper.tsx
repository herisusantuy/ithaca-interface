// Components
import Chart from '@/UI/components/Chart/Chart';

// Map charts to contentId from TRADING_MARKET_TABS constants
const contentMap: { [key: string]: JSX.Element } = {
  optionsChart: <Chart />,
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
