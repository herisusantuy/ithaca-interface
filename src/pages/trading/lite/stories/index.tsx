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
import { TRADING_STORIES_TABS } from '@/UI/constants/tabCard';
import styles from './stories.module.scss';
import { useState } from 'react';

const Index = () => {
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <>
      <Meta />
      <Main>
        <Container>
          <TradingLayout isLite={true} />
          <Flex gap='gap-12'>
            <Asset icon={<LogoEth />} label='ETH' />
            <LabelValue label='Expiry Date' value='10Nov23' hasDropdown={true} />
            <LabelValue label='Next Auction' value={<CountdownTimer />} />
            <LabelValue label='Last Auction Price' value='1,807.28' subValue='10Oct23 13:23' />
          </Flex>
          <div className={styles.tabWrapper}>
            <TabCard
              tabs={TRADING_STORIES_TABS}
              showInstructions={showInstructions}
              setShowInstructions={setShowInstructions}
            />
          </div>
        </Container>
      </Main>
    </>
  );
};

export default Index;
