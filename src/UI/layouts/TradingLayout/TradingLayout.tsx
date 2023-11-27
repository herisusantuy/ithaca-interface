// Packages
import { usePathname } from 'next/navigation';

// Constants
import { TRADING_TABS_ITEMS } from '@/UI/constants/tabs';

// Components
import Tabs from '@/UI/components/Tabs/Tabs';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';

const TradingLayout = () => {
  const pathname = usePathname();

  return (
    <Flex margin='mb-24' direction='row-space-between'>
      <Tabs
        tabs={TRADING_TABS_ITEMS}
        className='mb-0'
        activeTab={TRADING_TABS_ITEMS.find(tab => tab.path === pathname)?.id ?? TRADING_TABS_ITEMS[0].id}
      />
      {/* <Toggle
        leftLabel='Lite'
        rightLabel='Pro'
        defaultState={isLite ? 'left' : 'right'}
        onChange={(side: string) => {
          if (side === 'left') {
            router.push('/trading/lite/market');
          } else {
            router.push('/trading/position-builder');
          }
        }}
      /> */}
    </Flex>
  );
};

export default TradingLayout;
