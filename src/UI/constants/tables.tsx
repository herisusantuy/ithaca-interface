// Types
import { DotTypes } from '@/UI/components/Dot/Dot';

// Strategy table header
export const STRATEGY_TABLE_HEADER: string[] = ['Type', 'Side', 'Size', 'Strike', 'Enter Price', ''];

// Strategy table dummy Data
type StrategyProps = {
  type: DotTypes;
  side: '+' | '-';
  size: number;
  strike: number;
  enterPrice: number;
};

export const DUMMY_STRATEGY_DATA: StrategyProps[] = [
  {
    type: 'Call',
    side: '+',
    size: 120,
    strike: 6500,
    enterPrice: 800,
  },
  {
    type: 'Put',
    side: '-',
    size: 90,
    strike: 7200,
    enterPrice: 950,
  },
  {
    type: 'Forward',
    side: '+',
    size: 80,
    strike: 6800,
    enterPrice: 900,
  },
  {
    type: 'Call',
    side: '-',
    size: 150,
    strike: 7100,
    enterPrice: 1100,
  },
  {
    type: 'Put',
    side: '+',
    size: 110,
    strike: 6900,
    enterPrice: 850,
  },
];
