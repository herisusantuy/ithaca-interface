// Types
export type NavigationItems = {
  path: string;
  titleKey: string;
  displayText: string;
  disabled?: boolean;
  children?: NavigationItems[];
};

export const NAVIGATION_ITEMS: NavigationItems[] = [
  {
    path: '/points-program',
    titleKey: 'Click to visit register',
    displayText: 'Register',
  },
  // {
  //   path: '/referrals-leaderboard',
  //   titleKey: 'Click to visit leaderboard',
  //   displayText: 'Leaderboard',
  // },
];
