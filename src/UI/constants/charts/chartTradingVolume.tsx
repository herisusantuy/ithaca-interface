// Types
export type ChartTradingVolumeData = {
  date: string;
  volume: number;
  week?: number;
};

const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const year = '2023';
const weeksPerMonth = 4;
const maxVolume = 6000;

const getRandomVolume = () => Math.floor(Math.random() * (maxVolume + 1));

const generateData = (months: string[], year: string) => {
  return months.reduce((data: ChartTradingVolumeData[], month) => {
    for (let week = 1; week <= weeksPerMonth; week++) {
      data.push({
        date: `${month} ${year}`,
        volume: getRandomVolume(),
        week,
      });
    }
    return data;
  }, []);
};

export const CHART_TRADING_VOLUME_DATA: ChartTradingVolumeData[] = generateData(months, year);
