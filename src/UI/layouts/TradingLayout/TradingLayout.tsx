// Packages
import { useRouter } from 'next/navigation';

// Constants
import { TRADING_LITE_TABS_ITEMS, TRADING_PRO_TABS_ITEMS } from '@/UI/constants/tabs';

// Components
import Tabs from '@/UI/components/Tabs/Tabs';
import Toggle from '@/UI/components/Toggle/Toggle';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';

// Types
type TradingLayoutProps = {
  isLite: boolean;
};

const TradingLayout = ({ isLite }: TradingLayoutProps) => {
  const router = useRouter();

  return (
    <Flex margin='mb-24' direction='row-space-between'>
      <Tabs tabs={isLite ? TRADING_LITE_TABS_ITEMS : TRADING_PRO_TABS_ITEMS} className='mb-0' />
      <Toggle
        leftLabel='Lite'
        rightLabel='Pro'
        defaultState={isLite ? 'left' : 'right'}
        onChange={(side: string) => {
          if (side === 'left') {
            router.push('/trading/lite/market');
          } else {
            router.push('/trading/pro/position-builder');
          }
        }}
      />
    </Flex>
  );
};

export default TradingLayout;
