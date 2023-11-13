// Types
export type ChartOpenInterestData = {
  name: string;
  volume: number;
};

export const COLORS = ['url(#colorGroupA)', 'url(#colorGroupB)', '#B5B5F8', '#FF3F57'];

export const CHART_OPEN_INTEREST_DATA: ChartOpenInterestData[] = [
  { name: 'Total Long Call', volume: 400 },
  { name: 'Total Long Put', volume: 300 },
  { name: 'Total Short Call', volume: 300 },
  { name: 'Total Short Put', volume: 200 },
];
