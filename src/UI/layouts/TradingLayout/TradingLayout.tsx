// Styles

import Tabs from '@/UI/components/Tabs/Tabs';
import { TRADING_LITE_TABS_ITEMS, TRADING_PRO_TABS_ITEMS } from '@/UI/constants/tabs';

// Types
type TradingLayoutProps = {
  isLite: boolean;
};

const TradingLayout = (props: TradingLayoutProps) => {
  const { isLite } = props;

  return <Tabs tabs={isLite ? TRADING_LITE_TABS_ITEMS : TRADING_PRO_TABS_ITEMS}></Tabs>
};
 
export default TradingLayout;
