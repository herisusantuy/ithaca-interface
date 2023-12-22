// Types
export type NavigationItems = {
  path: string;
  titleKey: string;
  displayText: string;
};

export const NAVIGATION_ITEMS: NavigationItems[] = [
  {
    path: '/points-program',
    titleKey: 'Click to visit register',
    displayText: 'Register',
  },
  {
    path: '/referrals-leaderboard',
    titleKey: 'Click to visit leaderboard',
    displayText: 'Leaderboard',
  },
  // {
  //   path: '/referral-code',
  //   titleKey: 'Click to visit referrals',
  //   displayText: 'My Refferal Code',
  // },
];
