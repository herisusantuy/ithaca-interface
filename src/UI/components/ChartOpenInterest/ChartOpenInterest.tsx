// Packages
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

// Constants
import { COLORS, ChartOpenInterestData } from '@/UI/constants/charts/chartOpenInterest';

// Styles
import styles from './ChartOpenInterest.module.scss';

// Types
type ChartOpenInterestProps = {
  data: ChartOpenInterestData[];
};

const ChartOpenInterest = ({ data }: ChartOpenInterestProps) => {
  return (
    <ResponsiveContainer className={styles.container} width='100%' height={400}>
      <PieChart>
        <Pie data={data} cx='50%' cy='50%' innerRadius={60} outerRadius={80} fill='#8884d8' dataKey='value'>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ChartOpenInterest;
