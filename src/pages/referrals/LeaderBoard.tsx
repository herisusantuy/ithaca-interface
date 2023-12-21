// Components
import Card2 from '@/UI/components/Card/Card2';
import Panel from '@/UI/layouts/Panel/Panel';
import TableReferralsLeaderBoard from '@/UI/components/TableReferralsLeaderBoard/TableReferralsLeaderBoard';

// Constants
import { TABLE_REFERRALS_LEADERBOARD_DATA } from '@/UI/constants/referralsLeaderBoard';

// Utils

// Styles
import styles from '@/pages/referrals/referrals.module.scss';
import { useEffect, useState } from 'react';
import { GetReferrals } from '@/pages/points-program/PointsAPI';

type member = {
  name: string;
  acceptedInvites: number;
};

const LeaderBoard = () => {
  const [members, setMembers] = useState<member[]>([]);

  useEffect(() => {
    GetReferrals().then(res => {
      if (res) {
        const users = Object.keys(res).map(referralToken => {
          return { name: res[referralToken][0].invidedBy, acceptedInvites: res[referralToken].length };
        });
        setMembers(users);
      }
    });
  });

  return (
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
  );
};

export default LeaderBoard;
