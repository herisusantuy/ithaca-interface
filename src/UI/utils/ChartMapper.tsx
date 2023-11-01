// Components
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';

// Map charts to contentId from TRADING_MARKET_TABS constants
const contentMap: { [key: string]: JSX.Element } = {
  optionsChart: <ChartPayoff />,
  digitalOptionsChart: <ChartPayoff />,
  forwardsChart: <ChartPayoff />,
  optionsCall: <ChartPayoff />,
  optionsPut: <ChartPayoff />,
  digitalOptionsCall: <ChartPayoff />,
  digitalOptionsPut: <ChartPayoff />,
  forwardsExpiryDate: <ChartPayoff />,
  forwardsNextAuction: <ChartPayoff />,
};

export const getChartMapper = (contentId: string) => {
  return contentMap[contentId] || null;
};
