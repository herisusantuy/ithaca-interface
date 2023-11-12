// Packages
import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

// Constants
import { ChartTradingVolumeData } from '@/UI/constants/chartTradingVolume';

// Types
type ChartTradingVolumeProps = {
  data: ChartTradingVolumeData[];
};

const ChartTradingVolume = ({ data }: ChartTradingVolumeProps) => {
  return (
    <ResponsiveContainer width='100%' height={611}>
      <BarChart
        barCategoryGap={12}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='0' vertical={false} stroke='rgba(255, 255, 255, 0.2)' />
        <defs>
          <linearGradient id='gradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='20.31%' stopColor='#B5B5F8' stopOpacity={1} />
            <stop offset='100%' stopColor='#B5B5F8' stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey='date' tickLine={false} />
        <YAxis type='number' allowDecimals={false} axisLine={false} tickLine={false} />
        <Legend />
        <Bar dataKey='volume' fill='url(#gradient)' barSize={20} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartTradingVolume;
