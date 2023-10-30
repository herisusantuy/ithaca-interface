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
  {
    path: '/analytics',
    titleKey: 'Click to visit analytics',
    displayText: 'Analytics',
  },
  {
    path: '/components',
    titleKey: 'Click to visit components',
    displayText: 'Components',
  },
];

export const TRADING_LITE_NAVIGATION_ITEMS: NavigationItems[] = [
  {
    path: '/trading/lite/market',
    titleKey: 'Click to visit market',
    displayText: 'Market',
  },
  {
    path: '/trading/lite/stories',
    titleKey: 'Click to visit stories',
    displayText: 'Stories',
  },
];


export const TRADING_PRO_NAVIGATION_ITEMS: NavigationItems[] = [
  {
    path: '/trading/pro/position-builder',
    titleKey: 'Click to visit position builder',
    displayText: 'Position Builder',
  },
  {
    path: '/trading/pro/dynamic-option-strategies',
    titleKey: 'Click to visit dynamic option strategies',
    displayText: 'Dynamic Option Strategies',
  },
  {
    path: '/trading/pro/riskless-lending',
    titleKey: 'Click to visit riskless lending',
    displayText: 'Riskless Lending',
  },
];

