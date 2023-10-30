// Styles


import Navigation from '@/UI/components/Navigation/Navigation';
import { TRADING_LITE_NAVIGATION_ITEMS, TRADING_PRO_NAVIGATION_ITEMS } from '@/UI/constants/navigation';

// Types
type TradingLayoutProps = {
  isLite: boolean;
};

const TradingLayout = (props: TradingLayoutProps) => {
  const { isLite } = props;

  return <Navigation navigationItems={isLite ? TRADING_LITE_NAVIGATION_ITEMS : TRADING_PRO_NAVIGATION_ITEMS}></Navigation>
};

export default TradingLayout;
