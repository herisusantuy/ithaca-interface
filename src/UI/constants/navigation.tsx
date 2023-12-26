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
    titleKey: 'Click to visit points',
    displayText: 'Points',
  },
  {
    path: '/trading/dynamic-option-strategies',
    titleKey: 'Click to visit trading',
    displayText: 'Trading',
  },
  {
    path: '/dashboard',
    titleKey: 'Click to visit dashboard',
    displayText: 'Dashboard',
  },
  {
    path: '/analytics',
    titleKey: 'Click to visit analytics',
    displayText: 'Analytics',
    disabled: true
  },  
  // {
  //   path: '/referrals-leaderboard',
  //   titleKey: 'Click to visit leaderboard',
  //   displayText: 'Leaderboard',
  // },
];
