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
  ranking: number;
  referrerToken: string;
  acceptedInvites: number;
  username: string;
  invitedBy: string;
  colors: [string, string];
};

const getRandomColor = (): string => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

const ReferralsLeaderboard = () => {
  const { isAuthenticated } = useAppStore();
  const { isConnected } = useAccount();
  const [currentUser, setCurrentUser] = useState<member>();
  const [members, setMembers] = useState<member[]>([]);

  useEffect(() => {
    if (!isConnected || !isAuthenticated) return;
    GetReferrals().then(res => {
      if (res) {
        const { currentUser, referralsData } = res;

        setCurrentUser({ ranking: 0, ...currentUser });
        const membersData: member[] = (Object.values(referralsData) as member[]).map((userData: member) => {
          const colors: [string, string] = [getRandomColor(), getRandomColor()];
          return {
            ranking: 0,
            username: userData.username,
            acceptedInvites: userData.acceptedInvites,
            referrerToken: userData.referrerToken,
            invitedBy: '',
            colors: colors,
          };
        });

        membersData
          .sort((a, b) => b.acceptedInvites - a.acceptedInvites)
          .forEach((member, index) => (member.ranking = index + 1));
        setMembers(membersData);
      }
    });
  }, [isConnected, isAuthenticated]);

  useEffect(() => {
    if (members.length && currentUser) {
      const currentUserData: member | undefined = members.find(member => member.username === currentUser.username);
      if (currentUserData) setCurrentUser(currentUserData);
    }
  }, [members]);

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
            <h1>Leaderboard</h1>
            {isConnected ? (
              <>
                <div className={styles.leaderBoardCardsContainer}>
                  <Card2 label='Your Current Ranking' value={currentUser ? currentUser.ranking : 0} />
                  <Card2 label='Accepted Invites' value={currentUser ? currentUser.acceptedInvites : 0} />
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
