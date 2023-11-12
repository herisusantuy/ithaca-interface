// Types
export type ChartTradeCountData = {
  date: string;
  volume: number;
};

const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const year = '2023';
const weeksPerMonth = 4;
const maxVolume = 6000;

const getRandomVolume = (currentVolume: number, maxIncrease: number) => {
  return Math.min(currentVolume + Math.floor(Math.random() * maxIncrease), maxVolume);
};

const generateData = (months: string[], year: string, weeksPerMonth: number, maxVolume: number) => {
  let cumulativeVolume = 0;
  const data: ChartTradeCountData[] = [];

  for (const month of months) {
    for (let week = 1; week <= weeksPerMonth; week++) {
      const maxIncrease = maxVolume / (months.length * weeksPerMonth);
      cumulativeVolume = getRandomVolume(cumulativeVolume, maxIncrease);

      data.push({
        date: `${month} ${year}`,
        volume: cumulativeVolume,
      });
    }
  }

  return data;
};

export const CHART_TRADE_COUNT_DATA: ChartTradeCountData[] = generateData(months, year, weeksPerMonth, maxVolume);
