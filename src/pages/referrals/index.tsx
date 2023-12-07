import { useState } from 'react';

// Components
import Meta from '@/UI/components/Meta/Meta';
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import Panel from '@/UI/layouts/Panel/Panel';
import Button from '@/UI/components/Button/Button';
// Styles
import styles from './referrals.module.scss';
import Tabs from '@/UI/components/Tabs/Tabs';
import useToast from '@/UI/hooks/useToast';
import Toast from '@/UI/components/Toast/Toast';
import TableReferralsLeaderBoard from '@/UI/components/TableReferralsLeaderBoard/TableReferralsLeaderBoard';
import { TABLE_REFERRALS_LEADERBOARD_DATA } from '@/UI/constants/referralsLeaderBoard';
import Card2 from '@/UI/components/Card/Card2';
const Referrals = () => {
  const { toastList, showToast } = useToast();
  const REFERRALS_TABS = [
    {
      id: 'referralCode',
      label: 'Referral Code',
      content: (
        <div className={styles.referralPanel}>
          <Panel margin={styles.mainPanel}>
            <p>Your referral link to share:</p>
            <a href='https://ithaca.domain/E1BAC' target='_blank'>
              https://ithaca.domain/E1BAC
            </a>
            <Button
              variant='secondary'
              title=''
              onClick={() => {
                navigator.clipboard.writeText('https://ithaca.domain/E1BAC');
                showToast(
                  {
                    id: new Date().getTime(),
                    title: 'Copied',
                    message: 'https://ithaca.domain/E1BAC',
                    type: 'success',
                  },
                  'top-right'
                );
              }}
            >
              Copy Link
            </Button>
          </Panel>
        </div>
      ),
    },
    {
      id: 'leaderBoard',
      label: 'Leaderboard',

      content: (
        <div className={styles.leaderBoardPanel}>
          <div className={styles.leaderBoardCardsContainer}>
            <Card2 label='Your Current Ranking' value={1024} />
            <Card2 label='Invited' value={50} />
            <Card2 label='Accepted Invites' value={8} />
          </div>
          <Panel margin='p-30 p-tablet-16'>
            <TableReferralsLeaderBoard data={TABLE_REFERRALS_LEADERBOARD_DATA} />
          </Panel>
        </div>
      ),
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
