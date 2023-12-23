// Imports
import { DotTypes } from '@/UI/components/Dot/Dot';

// Types
export type StrategyType = {
  type: DotTypes;
  side: '+' | '-';
  size: number;
  strike: number;
  enterPrice: number;
};

// Table strategy headers
export const TABLE_STRATEGY_HEADERS: string[] = ['Type', 'Side', 'Size', 'Strike', 'Unit Price', ''];

export const TABLE_COLLATERAL_HEADERS: string[] = [
  'Asset',
  'Balance',
  'FundLock Value',
  'Net of Current Orders',
  'Live Order Collateral Net Value',
  '',
];

// Table strategy data
export const TABLE_STRATEGY_DATA: StrategyType[] = [
  {
    type: 'leg1',
    side: '+',
    size: 120,
    strike: 6500,
    enterPrice: 800,
  },
  {
    type: 'leg2',
    side: '-',
    size: 90,
    strike: 7200,
    enterPrice: 950,
  },
  {
    type: 'leg3',
    side: '+',
    size: 80,
    strike: 6800,
    enterPrice: 900,
  },
  {
    type: 'leg4',
    side: '-',
    size: 150,
    strike: 7100,
    enterPrice: 1100,
  },
  {
    type: 'leg5',
    side: '+',
    size: 110,
    strike: 6900,
    enterPrice: 850,
  },
];
