import { useEffect, useState } from 'react';

// Components
import Meta from '@/UI/components/Meta/Meta';
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import Card2 from '@/UI/components/Card/Card2';
import Panel from '@/UI/layouts/Panel/Panel';
import TableReferralsLeaderBoard from '@/UI/components/TableReferralsLeaderBoard/TableReferralsLeaderBoard';

// Utils
import { GetReferrals } from '@/pages/points-program/PointsAPI';
import { useAppStore } from '@/UI/lib/zustand/store';

// Styles
import styles from '@/pages/referrals-leaderboard/referrals-leaderboard.module.scss';
import { useAccount } from 'wagmi';
import Loader from '@/UI/components/Loader/Loader';
import { TABLE_REFERRALS_LEADERBOARD_DATA } from '@/UI/constants/referralsLeaderBoard';

type member = {
  user: string;
  acceptedInvites: number;
  ranking: number;
  invitedBy: string;
};

const ReferralsLeaderboard = () => {
  const { isAuthenticated } = useAppStore();
  const { isConnected } = useAccount();
  const [members, setMembers] = useState<member[]>([]);

  useEffect(() => {
    if (!isConnected || !isAuthenticated) return;
    GetReferrals().then(res => {
      if (res) {
        console.log(res);
        const membersData: member[] = Object.keys(res).map(referralToken => {
          return {
            ranking: 0,
            user: res[referralToken][0].invitedBy,
            acceptedInvites: res[referralToken].length,
            invitedBy: '',
          };
        });

        membersData
          .sort((a, b) => b.acceptedInvites - a.acceptedInvites)
          .forEach((member, index) => (member.ranking = index + 1));
        setMembers(membersData);
      }
    });
  }, [isConnected, isAuthenticated]);

  useAccount({
    onDisconnect: () => {
      setMembers([]);
    },
  });

  return (
    <>
      <Meta />
      <Main>
        <Container>
          <div className={styles.wrapper}>
            {isConnected ? (
              <>
                <div className={styles.leaderBoardCardsContainer}>
                  <Card2 label='Your Current Ranking' value={1024} />
                  <Card2 label='Accepted Invites' value={8} />
                </div>
                <Panel margin='p-30 p-tablet-16'>
                  {members.length ? (
                    <TableReferralsLeaderBoard data={members} />
                  ) : (
                    <div className={styles.loaderWrapper}>
                      <Loader type={'sm'} />
                    </div>
                  )}
                </Panel>
              </>
            ) : (
              <>
                <div className={styles.leaderBoardCardsContainer}>
                  <Card2 label='Your Current Ranking' value={1024} />
                  <Card2 label='Accepted Invites' value={8} />
                </div>
                <Panel margin='p-30 p-tablet-16'>
                  <TableReferralsLeaderBoard data={TABLE_REFERRALS_LEADERBOARD_DATA} />
                </Panel>
              </>
            )}
          </div>
        </Container>
      </Main>
    </>
  );
};

export default ReferralsLeaderboard;
