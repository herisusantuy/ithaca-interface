// Packages
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Constants
import { ChartTradeCountData } from '@/UI/constants/charts/chartTradeCount';

// Styles
import styles from './ChartTradeCount.module.scss';

// Types
type ChartTradeCountProps = {
  data: ChartTradeCountData[];
};

const ChartTradeCount = ({ data }: ChartTradeCountProps) => {
  return (
    <ResponsiveContainer className={styles.container} width='100%' height={450}>
      <AreaChart
        data={data}
        margin={{
          top: 18,
          right: 10,
          left: -10,
          bottom: 35,
        }}
      >
        <CartesianGrid strokeDasharray='0' vertical={false} stroke='rgba(255, 255, 255, 0.2)' />
        <defs>
          <linearGradient id='gradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#5EE192' stopOpacity={0.1} />
            <stop offset='100%' stopColor='#5EE192' stopOpacity={0} />
          </linearGradient>
          <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
            <feGaussianBlur in='SourceGraphic' stdDeviation='2' result='blur' />
          </filter>
          <linearGradient id='strokeGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#5EE192' stopOpacity={1} />
            <stop offset='100%' stopColor='#FFFFFF' stopOpacity={1} />
          </linearGradient>
        </defs>
        <XAxis dataKey='date' tickLine={false} axisLine={false} style={{ fill: '#9D9DAA', fontSize: 12 }} dy={21} />
        <YAxis
          type='number'
          allowDecimals={false}
          axisLine={false}
          tickLine={false}
          style={{ fill: '#9D9DAA', fontSize: 12 }}
          dx={-5}
        />
        <Area type='monotone' dataKey='volume' fill='url(#gradient)' filter='url(#glow)' />
        <Area type='monotone' dataKey='volume' stroke='url(#strokeGradient)' strokeWidth={1} fill='transparent' />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ChartTradeCount;
