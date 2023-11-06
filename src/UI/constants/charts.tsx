// Types
export type PayoffDataProps = {
  value: number;
  dashValue: number | undefined;
};

export type SpecialDotLabel = {
  value: number;
};

export const SPECIAL_DUMMY_DATA: SpecialDotLabel[] = [
  {
    value: 100,
  },
  { value: 200 },
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
