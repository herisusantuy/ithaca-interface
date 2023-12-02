export enum  tabelReferralsLeaderBoardEnums {
    RANKING = 'Ranking',
    USER = 'User',
    INVITED_BY = 'Invited By',
    ACCEPTED_INVITES = 'Accepted Invites'
}
export const TABLE_REFERRALS_LEADERBOARD_HEADERS = Object.values(tabelReferralsLeaderBoardEnums)

export type RefferalsLeaderboardEntry = {
  ranking: number;
  user: string;
  invitedBy: string;
  acceptedInvites: number;
};

export const TABLE_REFERRALS_LEADERBOARD_DATA: RefferalsLeaderboardEntry[] = [
  { ranking: 1, user: '0x4c31...c0ed', invitedBy: '@raf1928', acceptedInvites: 1820 },
  { ranking: 2, user: '0x4c31...c0ed', invitedBy: '@john2023', acceptedInvites: 1420 },
  { ranking: 3, user: '0x4c31...c0ed', invitedBy: '@matt20', acceptedInvites: 84200 },
  { ranking: 4, user: '0x4c31...c0ed', invitedBy: '@jessie2', acceptedInvites: 10 },
  { ranking: 5, user: '0x4c31...c0ed', invitedBy: '@james92', acceptedInvites: 1200 },
  { ranking: 6, user: '0x4c31...c0ed', invitedBy: '@matt20', acceptedInvites: 1800 },
  { ranking: 7, user: '0x4c31...c0ed', invitedBy: '@jessie2', acceptedInvites: 18400 },
  { ranking: 8, user: '0x4c31...c0ed', invitedBy: '@james92', acceptedInvites: 14200 },
  { ranking: 9, user: '0x4c31...c0ed', invitedBy: '@jessie2', acceptedInvites: 18200 },
  { ranking: 24, user: 'You', invitedBy: '@matt20', acceptedInvites: 1842 },
];
