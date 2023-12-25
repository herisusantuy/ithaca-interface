import { useEffect, useState } from 'react';

// Components
import Meta from '@/UI/components/Meta/Meta';
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import Card2 from '@/UI/components/Card/Card2';
import Panel from '@/UI/layouts/Panel/Panel';
import TableReferralsLeaderBoard from '@/UI/components/TableReferralsLeaderBoard/TableReferralsLeaderBoard';
import Loader from '@/UI/components/Loader/Loader';

// Utils
import { GetReferrals } from '@/UI/components/Points/PointsAPI';
import { useAppStore } from '@/UI/lib/zustand/store';
import { useAccount } from 'wagmi';

// Constants
import { leaderboardMemberType, TABLE_REFERRALS_LEADERBOARD_DATA } from '@/UI/constants/referralsLeaderBoard';

// Styles
import styles from '@/pages/referrals-leaderboard/referrals-leaderboard.module.scss';

const getRandomColor = (): string => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

const ReferralsLeaderboard = () => {
  const { isAuthenticated } = useAppStore();
  const { isConnected } = useAccount();
  const [currentUser, setCurrentUser] = useState<leaderboardMemberType>();
  const [members, setMembers] = useState<leaderboardMemberType[]>([]);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (!isConnected || !isAuthenticated) return;
    GetReferrals({ page }).then(res => {
      if (res) {
        const { currentUser, referralsData } = res;

        setCurrentUser({ ranking: 0, ...currentUser[0] });
        const membersData: leaderboardMemberType[] = (Object.values(referralsData) as leaderboardMemberType[]).map(
          (userData: leaderboardMemberType) => {
            const colors: [string, string] = [getRandomColor(), getRandomColor()];
            return {
              ranking: 0,
              username: userData.username,
              acceptedInvites: userData.acceptedInvites || 0,
              referrerToken: userData.referrerToken,
              invitedBy: '',
              colors: colors,
            };
          }
        );

        membersData
          .sort((a, b) => b.acceptedInvites - a.acceptedInvites)
          .forEach((member, index) => (member.ranking = index + 1));
        setMembers(membersData);
      }
    });
  }, [isConnected, isAuthenticated]);

  useEffect(() => {
    if (members.length && currentUser) {
      const currentUserData: leaderboardMemberType | undefined = members.find(
        member => member.username === currentUser.username
      );
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
                    <TableReferralsLeaderBoard data={members} page={page} setPage={(page: number) => setPage(page)} />
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
                  <TableReferralsLeaderBoard
                    data={TABLE_REFERRALS_LEADERBOARD_DATA}
                    page={page}
                    setPage={(page: number) => setPage(page)}
                  />
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
