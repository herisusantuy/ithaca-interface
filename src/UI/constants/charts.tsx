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
    value: 100,
    dashValue: 0,
  },
  {
    value: 100,
    dashValue: 100,
  },
  {
    value: 200,
    dashValue: undefined,
  },
  {
    value: 300,
    dashValue: undefined,
  },
  {
    value: 400,
    dashValue: undefined,
  },
];
