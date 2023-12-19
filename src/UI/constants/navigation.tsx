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
    path: '/trading/position-builder',
    titleKey: 'Click to visit trading',
    displayText: 'Trading',
  },
  {
    path: '/analytics',
    titleKey: 'Click to visit analytics',
    displayText: 'Analytics',
    disabled: true
  },
  {
    path: '/dashboard',
    titleKey: 'Click to visit dashboard',
    displayText: 'Dashboard',
  },
  // {
  //   path: '#',
  //   titleKey: 'Click to view more',
  //   displayText: 'More',
  //   children: [
  //     {
  //       path: '/profile',
  //       titleKey: 'Click to visit profile',
  //       displayText: 'Profile',
  //     },
  //     {
  //       path: '/rewards',
  //       titleKey: 'Click to visit rewards earned',
  //       displayText: 'Rewards Earned',
  //     },
  //     {
  //       path: '#',
  //       titleKey: 'Click to switch dark to light mode',
  //       displayText: 'Light mode',
  //     },
  //   ],
  // },
];
