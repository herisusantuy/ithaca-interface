// Components
import Meta from '@/UI/components/Meta/Meta';

// Layout
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import TradingLayout from '@/UI/layouts/TradingLayout/TradingLayout';
import Flex from '@/UI/layouts/Flex/Flex';
import Asset from '@/UI/components/Asset/Asset';
import LogoEth from '@/UI/components/Icons/LogoEth';
import LabelValue from '@/UI/components/LabelValue/LabelValue';
import CountdownTimer from '@/UI/components/CountdownTimer/CountdownTimer';
import TabCard from '@/UI/components/TabCard/TabCard';
import { TRADING_MARKET_TABS } from '@/UI/constants/tabCard';
import styles from './market.module.scss';

const Index = () => {
  return (
    <>
      <Meta />
      <Main>
        <Container>
          <TradingLayout isLite={true} />
          <Flex gap='gap-12'>
            <Asset icon={<LogoEth />} label='ETH' />
            <LabelValue label='Expiry Date' value='8Oct23' hasDropdown={true} />
            <LabelValue
              label='Next Auction'
              value={<CountdownTimer durationHours={0} durationMinutes={0} durationSeconds={20} />}
            />
            <LabelValue label='Last Auction Price' value='1,807.28' subValue='10Oct23 13:23' />
          </Flex>
          <div className={styles.tabWrapper }>
            <TabCard tabs={TRADING_MARKET_TABS} />
          </div>
        </Container>
      </Main>
    </>
  );
};

export default Index;
