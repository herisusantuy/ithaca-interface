export enum tableReferralsLeaderBoardEnums {
  RANKING = 'Ranking',
  USERNAME = 'User',
  INVITED_BY = 'Invited By',
  ACCEPTED_INVITES = 'Accepted Invites',
}

export const TABLE_REFERRALS_LEADERBOARD_HEADERS = Object.values(tableReferralsLeaderBoardEnums);

export type ReferralsLeaderboardEntry = {
  ranking: number;
  username: string;
  invitedBy: string;
  acceptedInvites: number;
  referrerToken: string;
  colors: [string, string];
};

export const TABLE_REFERRALS_LEADERBOARD_DATA: ReferralsLeaderboardEntry[] = [
  {
    ranking: 1,
    username: '0x4c31...c0ed',
    invitedBy: '@raf1928',
    acceptedInvites: 1820,
    referrerToken: '',
    colors: ['#4949A2', '#5EE192'],
  },
  {
    ranking: 2,
    username: '0x4c31...c0ed',
    invitedBy: '@john2023',
    acceptedInvites: 1420,
    referrerToken: '',
    colors: ['#4949A2', '#5EE192'],
  },
  {
    ranking: 3,
    username: '0x4c31...c0ed',
    invitedBy: '@matt20',
    acceptedInvites: 84200,
    referrerToken: '',
    colors: ['#4949A2', '#5EE192'],
  },
  {
    ranking: 4,
    username: '0x4c31...c0ed',
    invitedBy: '@jessie2',
    acceptedInvites: 10,
    referrerToken: '',
    colors: ['#4949A2', '#5EE192'],
  },
  {
    ranking: 5,
    username: '0x4c31...c0ed',
    invitedBy: '@james92',
    acceptedInvites: 1200,
    referrerToken: '',
    colors: ['#4949A2', '#5EE192'],
  },
  {
    ranking: 6,
    username: '0x4c31...c0ed',
    invitedBy: '@matt20',
    acceptedInvites: 1800,
    referrerToken: '',
    colors: ['#4949A2', '#5EE192'],
  },
  {
    ranking: 7,
    username: '0x4c31...c0ed',
    invitedBy: '@jessie2',
    acceptedInvites: 18400,
    referrerToken: '',
    colors: ['#4949A2', '#5EE192'],
  },
  {
    ranking: 8,
    username: '0x4c31...c0ed',
    invitedBy: '@james92',
    acceptedInvites: 14200,
    referrerToken: '',
    colors: ['#4949A2', '#5EE192'],
  },
  {
    ranking: 9,
    username: '0x4c31...c0ed',
    invitedBy: '@jessie2',
    acceptedInvites: 18200,
    referrerToken: '',
    colors: ['#4949A2', '#5EE192'],
  },
  {
    ranking: 24,
    username: 'You',
    invitedBy: '@matt20',
    acceptedInvites: 1842,
    referrerToken: '',
    colors: ['#4949A2', '#5EE192'],
  },
];
