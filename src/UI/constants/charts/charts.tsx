import { DotTypes } from '@/UI/components/Dot/Dot';

// Types
export type PayoffDataProps = {
  value: number;
  dashValue: number | undefined;
  x: number;
};

export type SpecialDotLabel = {
  value: number;
  x: number;
};

export type KeyType = {
  type: DotTypes;
  label: string;
};

// Payoff chart dummy data
export const PAYOFF_DUMMY_DATA: PayoffDataProps[] = [
  {
    value: 40000,
    dashValue: undefined,
    x:1
  },
  {
    value: 38000,
    dashValue: undefined,
    x:2
  },
  {
    value: 36000,
    dashValue: undefined,
    x:3
  },
  {
    value: 34000,
    dashValue: undefined,
    x: 4
  },
  {
    value: 32000,
    dashValue: undefined,
    x: 5
  },
  {
    value: 30000,
    dashValue: undefined,
    x: 6
  },
  {
    value: 28000,
    dashValue: undefined,
    x: 7
  },
  {
    value: 26000,
    dashValue: undefined,
    x: 8
  },
];

export const KEY_DATA: KeyType[] = [
  { type: 'White' as DotTypes, label: 'total' },
  { type: 'Put' as DotTypes, label: 'leg1' },
  { type: 'BinaryCall' as DotTypes, label: 'leg2' },
  { type: 'BinaryPut' as DotTypes, label: 'leg3' },
  { type: 'Forward (Next Auction)' as DotTypes, label: 'leg4' },
  { type: 'Call' as DotTypes, label: 'leg5' },
];

export const CHART_FAKE_DATA = [
  { x: 1300, total: 40000, leg1: 0, leg2: 20000, leg3: 20000, leg4: 0, leg5: 0 },
  { x: 1310, total: 38000, leg1: 0, leg2: 19000, leg3: 19000, leg4: 0, leg5: 0 },
  { x: 1320, total: 36000, leg1: 0, leg2: 18000, leg3: 18000, leg4: 0, leg5: 0 },
  { x: 1330, total: 34000, leg1: 0, leg2: 17000, leg3: 17000, leg4: 0, leg5: 0 },
  { x: 1340, total: 32000, leg1: 0, leg2: 16000, leg3: 16000, leg4: 0, leg5: 0 },
  { x: 1350, total: 30000, leg1: 0, leg2: 15000, leg3: 15000, leg4: 0, leg5: 0 },
  { x: 1360, total: 28000, leg1: 0, leg2: 14000, leg3: 14000, leg4: 0, leg5: 0 },
  { x: 1370, total: 26000, leg1: 0, leg2: 13000, leg3: 13000, leg4: 0, leg5: 0 },
];

// Table order data
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
