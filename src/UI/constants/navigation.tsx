// Types
export type NavigationItems = {
  path: string;
  titleKey: string;
  displayText: string;
};

export const NAVIGATION_ITEMS: NavigationItems[] = [
  {
    path: '/trading',
    titleKey: 'Click to visit trading',
    displayText: 'Trading',
  },
  // {
  //   path: '/analytics',
  //   titleKey: 'Click to visit analytics',
  //   displayText: 'Analytics',
  // },
  {
    path: '/dashboard',
    titleKey: 'Click to visit dashboard',
    displayText: 'Dashboard',
  },
  // {
  //   path: '/leaderboard',
  //   titleKey: 'Click to visit leaderboard',
  //   displayText: 'Leaderboard',
  // },
  // {
  //   path: '#',
  //   titleKey: 'Click to view more',
  //   displayText: 'More',
  // },
  {
    path: '/components',
    titleKey: 'Click to visit components',
    displayText: 'Components',
  },
];
