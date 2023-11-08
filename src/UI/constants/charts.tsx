import { DotTypes } from '@/UI/components/Dot/Dot';

// Types
export type PayoffDataProps = {
  value: number;
  dashValue: number | undefined;
};

export type SpecialDotLabel = {
  value: number;
};

export type KeyType = {
  type: DotTypes;
  label: string;
};

export const SPECIAL_DUMMY_DATA: SpecialDotLabel[] = [
  {
    value: -90.98,
  },
  { value: 40451 },
  { value: 40451.02 },
];
// Payoff chart dummy data
export const PAYOFF_DUMMY_DATA: PayoffDataProps[] = [
  {
    value: -190.99,
    dashValue: undefined,
  },
  {
    value: -190.99,
    dashValue: undefined,
  },
  {
    value: -90.99,
    dashValue: undefined,
  },
  {
    value: -90.98,
    dashValue: undefined,
  },
  {
    value: 20180.01,
    dashValue: undefined,
  },
  {
    value: 40451.0,
    dashValue: undefined,
  },
  {
    value: 40451.01,
    dashValue: undefined,
  },
  {
    value: 40451.02,
    dashValue: undefined,
  },
  {
    value: 59505.21,
    dashValue: undefined,
  },
];

export const KEY_DATA: KeyType[] = [
  { type: 'White' as DotTypes, label: 'Total' },
  { type: 'Put' as DotTypes, label: 'C' },
  { type: 'BinaryCall' as DotTypes, label: 'P' },
  { type: 'Forward' as DotTypes, label: 'F(Next Auction)' },
];
