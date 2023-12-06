// Packages
import { useState } from 'react';

// Layout
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import TradingLayout from '@/UI/layouts/TradingLayout/TradingLayout';
import Flex from '@/UI/layouts/Flex/Flex';

// Components
import Meta from '@/UI/components/Meta/Meta';
import Asset from '@/UI/components/Asset/Asset';
import LogoEth from '@/UI/components/Icons/LogoEth';
import LabelValue from '@/UI/components/LabelValue/LabelValue';
import CountdownTimer from '@/UI/components/CountdownTimer/CountdownTimer';
import TabCard from '@/UI/components/TabCard/TabCard';

// Constants
import { TRADING_STORIES_TABS } from '@/UI/constants/tabCard';
import { useAppStore } from '@/UI/lib/zustand/store';
import dayjs from 'dayjs';
import { getNumber } from '@/UI/utils/Numbers';

const Index = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const {expiryList, setCurrentExpiryDate, currentExpiryDate} = useAppStore();

  return (
    <>
      <Meta />
      <Main>
        <Container>
          <TradingLayout />
          <Flex gap='gap-12' margin='mb-24'>
            <Asset icon={<LogoEth />} label='ETH' />
            <LabelValue
              label='Expiry Date'
              valueList={expiryList.map(date => ({
                label: dayjs(`${date}`, 'YYYYMMDD').format('DD MMM YY'),
                value: dayjs(`${date}`, 'YYYYMMDD').format('DD MMM YY'),
              }))}
              onChange={value => {
                setCurrentExpiryDate(getNumber(dayjs(value, 'DD MMM YY').format('YYYYMMDD')));
              }}
              value={dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('DD MMM YY')}
              hasDropdown={true}
            />
            <LabelValue label='Next Auction' value={<CountdownTimer />} />
            {/* <LabelValue
              label='Last Auction Price'
              value='1629'
              subValue={
                <>
                  <span>{dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('DD')}</span>
                  <span>{dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('MMM')}</span>
                  <span>{dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('YY')}</span>
                </>
              }
            />
          </Flex> */}
          <TabCard
            className='mt-39'
            tabClassName='ptb-15 plr-20'
            tabs={TRADING_STORIES_TABS}
            showInstructions={showInstructions}
            setShowInstructions={setShowInstructions}
          />
        </Container>
      </Main>
    </>
  );
};

export default Index;
