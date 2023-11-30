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
const Referrals = () => {
  const { toastList, position, showToast } = useToast();
  const REFERRALS_TABS = [
    {
      id: 'referralCode',
      label: 'Referral Code',
      content: (
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
                  id: Math.floor(Math.random() * 1000),
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
      ),
    },
    {
      id: 'leaderBoard',
      label: 'Leaderboard',
      content: (
        <Panel margin={styles.mainPanel}>
          <p>Leaderboard</p>
        </Panel>
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
            <Tabs tabs={REFERRALS_TABS} activeTab={activeTab} onChange={setActiveTab} />
          </div>
        </Container>
      </Main>
      <Toast toastList={toastList} position='bottom-right' autoDelete={true} autoDeleteTime={2000} />
    </>
  );
};
export default Referrals;
