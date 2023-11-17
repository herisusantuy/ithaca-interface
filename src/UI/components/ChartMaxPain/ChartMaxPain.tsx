// Packages
import { useState, useEffect } from 'react';
import { ChartMaxPainData } from '@/UI/constants/charts/chartMaxPain';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart';

// Components
import ChartLegend from './ChartLegend';
import ChartTooltip from './ChartTooltip';
import ChartCursor from './ChartCursor';
import ChartLabel from './ChartLabel';

// Styles
import styles from './ChartMaxPain.module.scss';
import { maxPainChartFormat } from '@/UI/utils/MaxPainChartUtil';

type ChartDataType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const ChartMaxPain = ({data}: ChartDataType) => {
  const [chartData, setChartData] = useState<ChartMaxPainData[]>([]);

  useEffect(() => {
    setChartData(maxPainChartFormat(data));
  }, []);

  const [cursorX, setCursorX] = useState(0);

  const handleMouseMove = (e: CategoricalChartState) => {
    if (e.activePayload) {
      const xValue = e.chartX;
      setCursorX(xValue ?? 0);
    }
  };

  return (
    <ResponsiveContainer className={styles.container} width='100%' height={487}>
      <BarChart
        barCategoryGap={33}
        data={chartData}
        margin={{
          top: 18,
          right: 46,
          left: 20,
          bottom: 35,
        }}
        onMouseMove={handleMouseMove}
      >
        <ReferenceLine
          x={1500}
          stroke='#561198'
          strokeDasharray={'2 2'}
          label={<ChartLabel label='Max Pain' value='1600' />}
        />
        <ReferenceLine
          x={1600}
          stroke='#9D9DAA'
          strokeDasharray={'2 2'}
          label={<ChartLabel label='Underlying Price' value='1700' />}
        />
        <CartesianGrid strokeDasharray='0' vertical={false} stroke='rgba(255, 255, 255, 0.2)' />
        <defs>
          <linearGradient id='greenGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='20.31%' stopColor='#4BB475' stopOpacity='1' />
            <stop offset='100%' stopColor='#4BB475' stopOpacity='0' />
          </linearGradient>
        </defs>
        <defs>
          <linearGradient id='redGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='20.31%' stopColor='#FF3F57' stopOpacity='1' />
            <stop offset='100%' stopColor='#FF3F57' stopOpacity='0' />
          </linearGradient>
        </defs>
        <XAxis dataKey='strike' tickLine={false} axisLine={false} style={{ fill: '#9D9DAA', fontSize: 12 }} dy={21}>
          <Label value='Strikes' offset={10} position='bottom' className={styles.axisLabel} />
        </XAxis>
        <YAxis
          type='number'
          allowDecimals={false}
          axisLine={false}
          tickLine={false}
          style={{ fill: '#9D9DAA', fontSize: 12 }}
          dx={-5}
          label={{ value: 'Option Market Value', angle: -90, position: 'left' }}
          className={styles.axisLabel}
        />
        <Tooltip content={<ChartTooltip />} cursor={<ChartCursor x={cursorX} />} />
        <Legend content={<ChartLegend />} />
        <Bar dataKey='call' fill='url(#greenGradient)' barSize={20} radius={[4, 4, 0, 0]} />
        <Bar dataKey='put' fill='url(#redGradient)' barSize={20} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartMaxPain;
