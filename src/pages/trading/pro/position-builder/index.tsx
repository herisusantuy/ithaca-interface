// Components
import Meta from '@/UI/components/Meta/Meta';
import styles from './position-builder.module.scss';
// Layout
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import TradingLayout from '@/UI/layouts/TradingLayout/TradingLayout';
import Flex from '@/UI/layouts/Flex/Flex';
import LabelValue from '@/UI/components/LabelValue/LabelValue';
import CountdownTimer from '@/UI/components/CountdownTimer/CountdownTimer';
import Asset from '@/UI/components/Asset/Asset';
import LogoEth from '@/UI/components/Icons/LogoEth';

const Index = () => {
  return (
    <>
      <Meta />
      <Main>
        <Container>
          <TradingLayout isLite={false}/>
          <Flex>
            <div>
              <Flex gap='gap-12'>
                <Asset icon={<LogoEth />} label='ETH' />
                <LabelValue label='Expiry Date' value='8Oct23' hasDropdown={true} />
                <LabelValue
                  label='Next Auction'
                  value={<CountdownTimer durationHours={2} durationMinutes={30} durationSeconds={0} />}
                />
                <LabelValue label='Last Auction Price' value='1629' subValue='10Oct23 13:23' />
              </Flex>
              <p className={styles.title}>Position Builder</p>
              <div className={styles.positionBuilder}>Position Builder content</div>
              <div className={styles.summary}>Order Summary</div>
            </div>
              <div className={styles.strategy}>Strategy</div>
          </Flex>
        </Container>
      </Main>
    </>
  );
};

export default Index;
