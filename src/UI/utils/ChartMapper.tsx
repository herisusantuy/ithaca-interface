// Components
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
import { PAYOFF_DUMMY_DATA } from '@/UI/constants/charts';

// Map charts to contentId from TRADING_MARKET_TABS constants
const contentMap: { [key: string]: JSX.Element } = {
  optionsChart: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} height={300}/>,
  digitalOptionsChart: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} height={300}/>,
  forwardsChart: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} height={300}/>,
  optionsCall: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} height={300}/>,
  optionsPut: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} height={300}/>,
  digitalOptionsCall: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} height={300}/>,
  digitalOptionsPut: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} height={300}/>,
  forwardsExpiryDate: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} height={300}/>,
  forwardsNextAuction: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} height={300}/>,
};

export const getChartMapper = (contentId: string) => {
  return contentMap[contentId] || null;
};
