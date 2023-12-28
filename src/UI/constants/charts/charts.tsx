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


export type KeyOption = {
  option: string;
  value: string;
}

export type KeyType = {
  type: DotTypes;
  label: KeyOption;
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

// export const KEY_DATA: KeyType[] = [
//   { type: 'White' as DotTypes, label: 'total' },
//   { type: 'Put' as DotTypes, label: 'leg1' },
//   { type: 'BinaryCall' as DotTypes, label: 'leg2' },
//   { type: 'BinaryPut' as DotTypes, label: 'leg3' },
//   { type: 'Forward (Next Auction)' as DotTypes, label: 'leg4' },
//   { type: 'Call' as DotTypes, label: 'leg5' },
// ];

export const CHART_FAKE_DATA = [
  { x: 1300, total: 0},
  { x: 1310, total: 0},
  { x: 1320, total: 0},
  { x: 1330, total: 0},
  { x: 1340, total: 0},
  { x: 1350, total: 0},
  { x: 1360, total: 0},
  { x: 1370, total: 0},
];

// Table order data
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
