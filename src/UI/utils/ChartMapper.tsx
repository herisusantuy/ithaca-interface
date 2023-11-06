// Components
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
import { PAYOFF_DUMMY_DATA, SPECIAL_DUMMY_DATA } from '../constants/charts';

// Map charts to contentId from TRADING_MARKET_TABS constants
const contentMap: { [key: string]: JSX.Element } = {
  optionsChart: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} specialDot={SPECIAL_DUMMY_DATA}/>,
  digitalOptionsChart: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} specialDot={SPECIAL_DUMMY_DATA}/>,
  forwardsChart: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} specialDot={SPECIAL_DUMMY_DATA}/>,
  optionsCall: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} specialDot={SPECIAL_DUMMY_DATA}/>,
  optionsPut: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} specialDot={SPECIAL_DUMMY_DATA}/>,
  digitalOptionsCall: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} specialDot={SPECIAL_DUMMY_DATA}/>,
  digitalOptionsPut: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} specialDot={SPECIAL_DUMMY_DATA}/>,
  forwardsExpiryDate: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} specialDot={SPECIAL_DUMMY_DATA}/>,
  forwardsNextAuction: <ChartPayoff chartData={PAYOFF_DUMMY_DATA} specialDot={SPECIAL_DUMMY_DATA}/>,
};

export const getChartMapper = (contentId: string) => {
  return contentMap[contentId] || null;
};
