export const TABLE_LEADERBOARD_HEADERS: string[] = ['Ranking', 'User', '24H Points', 'Total Points'];

export type LeaderboardEntry = {
  ranking: number;
  user: string;
  points: string;
  totalPoints: string;
};

export const TABLE_LEADERBOARD_DATA: LeaderboardEntry[] = [
  { ranking: 1, user: '0x4c31...c0ed', points: '32k', totalPoints: '184.2k' },
  { ranking: 2, user: '0x4c31...c0ed', points: '32k', totalPoints: '184.2k' },
  { ranking: 3, user: '0x4c31...c0ed', points: '32k', totalPoints: '184.2k' },
  { ranking: 4, user: '0x4c31...c0ed', points: '32k', totalPoints: '184.2k' },
  { ranking: 5, user: '0x4c31...c0ed', points: '32k', totalPoints: '184.2k' },
  { ranking: 6, user: '0x4c31...c0ed', points: '32k', totalPoints: '184.2k' },
  { ranking: 7, user: '0x4c31...c0ed', points: '32k', totalPoints: '184.2k' },
  { ranking: 8, user: '0x4c31...c0ed', points: '32k', totalPoints: '184.2k' },
  { ranking: 9, user: '0x4c31...c0ed', points: '32k', totalPoints: '184.2k' },
  { ranking: 24, user: 'You', points: '32k', totalPoints: '184.2k' },
];
