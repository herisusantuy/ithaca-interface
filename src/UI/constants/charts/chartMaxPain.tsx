// Types
export type ChartMaxPainData = {
  strike: number;
  call: number;
  put: number;
};

export const CHART_MAX_PAIN_ANY_TYPE = {
  1100: { Call: 0, Put: 900, 'Binary Call': 0, 'Binary Put': 0 },
  1200: { Call: 0, Put: 800, 'Binary Call': 0, 'Binary Put': 0 },
  1300: { Call: 0, Put: 700, 'Binary Call': 0, 'Binary Put': 0 },
  1400: { Call: 0, Put: 600, 'Binary Call': 0, 'Binary Put': 0 },
  1500: { Call: 0, Put: 500, 'Binary Call': 0, 'Binary Put': 0 },
  1600: { Call: 500, Put: 0, 'Binary Call': 0, 'Binary Put': 0 },
  1700: { Call: 600, Put: 0, 'Binary Call': 0, 'Binary Put': 0 },
  1800: { Call: 700, Put: 0, 'Binary Call': 0, 'Binary Put': 0 },
  1900: { Call: 800, Put: 0, 'Binary Call': 0, 'Binary Put': 0 },
  2000: { Call: 900, Put: 0, 'Binary Call': 0, 'Binary Put': 0 },
  2100: { Call: 1000, Put: 0, 'Binary Call': 0, 'Binary Put': 0 },
};

export const CHART_MAX_PAIN_DATA: ChartMaxPainData[] = [
  { strike: 1000, call: 3917, put: 2220 },
  { strike: 1100, call: 5714, put: 25026 },
  { strike: 1200, call: 29947, put: 17563 },
  { strike: 1300, call: 19228, put: 27831 },
  { strike: 1400, call: 6624, put: 6684 },
  { strike: 1500, call: 1315, put: 25080 },
  { strike: 1600, call: 7538, put: 9976 },
  { strike: 1700, call: 29637, put: 18772 },
  { strike: 1800, call: 17779, put: 17550 },
  { strike: 1900, call: 29835, put: 21566 },
  { strike: 2000, call: 10191, put: 25650 },
  { strike: 2100, call: 5265, put: 13566 },
];

// Types
export type LegendItem = {
  label: string;
  classNameKey: string;
};

export const LEGEND: LegendItem[] = [
  { label: 'Total', classNameKey: 'total' },
  { label: 'Call: Max Pain', classNameKey: 'call' },
  { label: 'Put: Max Pain', classNameKey: 'put' },
];
