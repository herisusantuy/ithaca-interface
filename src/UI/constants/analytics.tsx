// Packages
import { ReactNode } from 'react';

// Components
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import LogoEth from '@/UI/components/Icons/LogoEth';

// Types
export type AnalyticsCardData = {
  title: string;
  mainValue: string;
  changeValue: string;
  currencySymbol?: ReactNode;
  currency?: string;
  isChangePositive: boolean;
};

export const ANALYTICS_CARD_DATA: AnalyticsCardData[] = [
  {
    title: 'Total Trading Volume',
    mainValue: '593.1k',
    changeValue: '+52.29',
    currencySymbol: <LogoUsdc />,
    currency: 'USDC',
    isChangePositive: true,
  },
  {
    title: 'Total Contracts Traded',
    mainValue: '3.1k',
    changeValue: '-10.39',
    isChangePositive: false,
  },
  {
    title: 'Total Value Locked',
    mainValue: '13.1k',
    changeValue: '+29.1',
    currencySymbol: <LogoEth />,
    currency: 'WETH',
    isChangePositive: true,
  },
  {
    title: 'Open Interest',
    mainValue: '593.1k',
    changeValue: '+29.1',
    currencySymbol: <LogoEth />,
    currency: 'WETH',
    isChangePositive: true,
  },
];
