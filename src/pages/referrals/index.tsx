import { useState } from 'react';

// Components
import Meta from '@/UI/components/Meta/Meta';
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import Tabs from '@/UI/components/Tabs/Tabs';
import Toast from '@/UI/components/Toast/Toast';
import ReferralCode from '@/pages/referrals/ReferralCode';
import LeaderBoard from '@/pages/referrals/LeaderBoard';

// Utils
import useToast from '@/UI/hooks/useToast';

// Styles
import styles from './referrals.module.scss';

const Referrals = () => {
  const { toastList, showToast } = useToast();

  const REFERRALS_TABS = [
    {
      id: 'referralCode',
      label: 'Referral Code',
      content: <ReferralCode showToast={showToast} />,
    },
    {
      id: 'leaderBoard',
      label: 'Leaderboard',
      content: <LeaderBoard />,
    },
  ];

  const [activeTab, setActiveTab] = useState(REFERRALS_TABS[0].id);

  return (
    <>
      <Meta />
      <Main>
        <Container>
          <div className={styles.wrapper}>
            <h1>Referrals</h1>
            <div className={styles.tabsContainer}>
              <Tabs
                tabs={REFERRALS_TABS}
                activeTab={activeTab}
                onChange={setActiveTab}
                className={styles.referralsTab}
                responsive={false}
              />
            </div>
          </div>
        </Container>
      </Main>
      <Toast toastList={toastList} position='bottom-right' autoDelete={true} autoDeleteTime={2000} />
    </>
  );
};
export default Referrals;
