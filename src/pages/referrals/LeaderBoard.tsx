// Components
import Card2 from '@/UI/components/Card/Card2';
import Panel from '@/UI/layouts/Panel/Panel';
import TableReferralsLeaderBoard from '@/UI/components/TableReferralsLeaderBoard/TableReferralsLeaderBoard';

// Utils

// Styles
import styles from '@/pages/referrals/referrals.module.scss';
import { useEffect, useState } from 'react';
import { GetReferrals } from '@/pages/points-program/PointsAPI';
// import { useAppStore } from '@/UI/lib/zustand/store';

type member = {
  user: string;
  acceptedInvites: number;
  ranking: number;
  invitedBy: string;
};

// type member = {
// username: string;
// acceptedInvites: number;
// };

const LeaderBoard = () => {
  // const { isAuthenticated } = useAppStore();
  const [members, setMembers] = useState<member[]>([]);

  useEffect(() => {
    GetReferrals().then(res => {
      if (res) {
        const membersData: member[] = Object.keys(res).map(referralToken => {
          return {
            ranking: 0,
            user: res[referralToken][0].invidedBy,
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
  }, []);

  return (
    <div className={styles.leaderBoardPanel}>
      <div className={styles.leaderBoardCardsContainer}>
        <Card2 label='Your Current Ranking' value={1024} />
        <Card2 label='Invited' value={50} />
        <Card2 label='Accepted Invites' value={8} />
      </div>
      <Panel margin='p-30 p-tablet-16'>
        <TableReferralsLeaderBoard data={members} />
      </Panel>
    </div>
  );
};

export default LeaderBoard;
