// Packages
import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

// Constants
import { ChartTradingVolumeData } from '@/UI/constants/chartTradingVolume';

// Components
import ChartLegend from './ChartLegend';

// Types
type ChartTradingVolumeProps = {
  data: ChartTradingVolumeData[];
};

// Styles
import styles from './ChartTradingVolume.module.scss';

const ChartTradingVolume = ({ data }: ChartTradingVolumeProps) => {
  return (
    <ResponsiveContainer className={styles.container} width='100%' height={611}>
      <BarChart
        barCategoryGap={12}
        data={data}
        margin={{
          top: 18,
          right: 46,
          left: -10,
          bottom: 35,
        }}
      >
        <CartesianGrid strokeDasharray='0' vertical={false} stroke='rgba(255, 255, 255, 0.2)' />
        <defs>
          <linearGradient id='gradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='20.31%' stopColor='#B5B5F8' stopOpacity={1} />
            <stop offset='100%' stopColor='#B5B5F8' stopOpacity={0} />
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
        <Legend content={<ChartLegend />} />
        <Bar dataKey='volume' fill='url(#gradient)' barSize={30} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartTradingVolume;
