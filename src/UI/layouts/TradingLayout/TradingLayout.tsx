// Styles
import styles from './TradingLayout.module.scss';

import Tabs from '@/UI/components/Tabs/Tabs';
import { TRADING_LITE_TABS_ITEMS, TRADING_PRO_TABS_ITEMS } from '@/UI/constants/tabs';
import Toggle from '@/UI/components/Toggle/Toggle';
import { useRouter } from 'next/navigation';

// Types
type TradingLayoutProps = {
  isLite: boolean;
};

const TradingLayout = (props: TradingLayoutProps) => {
  const router = useRouter();
  const { isLite } = props;

  return <div className={styles.container}>
    <Tabs tabs={isLite ? TRADING_LITE_TABS_ITEMS : TRADING_PRO_TABS_ITEMS}></Tabs>
    <div className={styles.toggleWrapper}>
      <Toggle leftLabel='Lite'
        rightLabel='Pro'
        defaultState={isLite ? 'left' : 'right'}
        onChange={(side: string) => {
          if (side === 'left') {
            router.push('/trading/lite/market');
          }
          else {
            router.push('/trading/pro/position-builder');
          }
        }}
      />
    </div>
  </div>
};

export default TradingLayout;
