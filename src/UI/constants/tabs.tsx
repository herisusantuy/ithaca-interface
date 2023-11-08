// Packages
import { ReactNode } from 'react';

// Types
type Tab = {
  id: string;
  label: string;
  content?: ReactNode;
  path?: string;
};

export const TABS: Tab[] = [
  {
    id: 'position-builder',
    label: 'Position Builder',
    content: <p>Content for Position Builder</p>,
  },
  {
    id: 'dynamic-option-strategies',
    label: 'Dynamic Option Strategies',
    content: <p>Content for Dynamic Option Strategies</p>,
  },
  {
    id: 'riskless-lending',
    label: 'Riskless Lending',
    content: <p>Content for Riskless Lending</p>,
  },
];

export const TRADING_LITE_TABS_ITEMS: Tab[] = [
  {
    id: 'market',
    path: '/trading/lite/market',
    label: 'Market',
  },
  {
    id: 'stories',
    path: '/trading/lite/stories',
    label: 'Stories',
  },
];

export const TRADING_PRO_TABS_ITEMS: Tab[] = [
  {
    id: 'position-builder',
    path: '/trading/pro/position-builder',
    label: 'Position Builder',
  },
  {
    id: 'dynamic-option-strategies',
    path: '/trading/pro/dynamic-option-strategies',
    label: 'Dynamic Option Strategies',
  },
  {
    id: 'riskless-lending',
    path: '/trading/pro/riskless-lending',
    label: 'Riskless Lending',
  },
];

export const MODAL_TABS: Tab[] = [
  {
    id: 'deposit',
    label: 'Deposit',
    // content: <p>Content deposit</p>,
  },
  {
    id: 'withdraw',
    label: 'Withdraw',
    // content: <p>Content for withdraw</p>,
  },
];
