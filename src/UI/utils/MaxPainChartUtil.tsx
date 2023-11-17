import { ChartMaxPainData } from '@/UI/constants/charts/chartMaxPain';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const maxPainChartFormat = (data: any) => {
  const transformedData: ChartMaxPainData[] = Object.keys(data).map(strike => ({
    strike: parseInt(strike),
    call: data[parseInt(strike)] ? parseInt(data[parseInt(strike)]['Call']) : 0,
    put: data[parseInt(strike)] ? parseInt(data[parseInt(strike)]['Put']) : 0,
  }));

  return transformedData;
};
