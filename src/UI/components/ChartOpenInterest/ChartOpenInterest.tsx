// Packages
import { Cell, Label, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

// Constants
import { COLORS, ChartOpenInterestData } from '@/UI/constants/charts/chartOpenInterest';

// Components
import Watermark from '@/UI/components/Icons/Watermark';
import ChartLegend from './ChartLegend';
import ChartTooltip from './ChartTooltip';

// Styles
import styles from './ChartOpenInterest.module.scss';

// Types
type ChartOpenInterestProps = {
  data: ChartOpenInterestData[];
};

const ChartOpenInterest = ({ data }: ChartOpenInterestProps) => {
  const outerRadius = 150;
  const innerRadius = outerRadius - 45;

  const renderLabel = () => {
    return <Watermark />;
  };

  return (
    <ResponsiveContainer className={styles.container} width='100%' height={400}>
      <PieChart>
        <Legend layout='vertical' verticalAlign='middle' align='left' content={<ChartLegend />} />
        <defs>
          <linearGradient id='colorGroupA' x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='0%' stopColor='#5CCF8A' />
            <stop offset='100%' stopColor='#4BB475' />
          </linearGradient>
          <linearGradient id='colorGroupB' x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='0%' stopColor='#A855F7' />
            <stop offset='100%' stopColor='#8F2BEF' />
          </linearGradient>
        </defs>
        <Pie
          data={data}
          cx='50%'
          cy='50%'
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill='#8884d8'
          dataKey='volume'
          activeShape={{ fillOpacity: 1 }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} stroke='none' fill={COLORS[index % COLORS.length]} />
          ))}
          <Label content={renderLabel} position='center' className={styles.icon} />
        </Pie>
        <Tooltip content={<ChartTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ChartOpenInterest;
