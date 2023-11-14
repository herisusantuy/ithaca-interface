// Packages
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from 'recharts';

// Constants
import { COLORS, ChartOpenInterestData } from '@/UI/constants/charts/chartOpenInterest';

// Components
import Watermark from '@/UI/components/Icons/Watermark';
import ChartLegend from './ChartLegend';
import ChartTooltip from './ChartTooltip';

// Styles
import styles from './ChartOpenInterest.module.scss';
import { useState } from 'react';

// Types
type ChartOpenInterestProps = {
  data: ChartOpenInterestData[];
};

const ChartOpenInterest = ({ data }: ChartOpenInterestProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeIndex, setActiveIndex] = useState(0);
  const outerRadius = 150;
  const innerRadius = outerRadius - 45;

  const renderLabel = () => {
    return <Watermark />;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

    return (
      <>
        <g style={{ filter: 'url(#glow)' }}>
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
          />
          <Sector
            cx={cx}
            cy={cy}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={outerRadius}
            outerRadius={outerRadius}
            fill={fill}
          />
        </g>
        <g>
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
          />
          <Sector
            cx={cx}
            cy={cy}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={outerRadius}
            outerRadius={outerRadius}
            fill={fill}
          />
        </g>
        <defs>
          <filter id='glow'>
            <feGaussianBlur in='SourceGraphic' stdDeviation='5' result='blur' />
            <feFlood floodColor={fill} result='color' />
            <feComposite in2='color' operator='in' />
            <feMerge>
              <feMergeNode in='color' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>
      </>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPieEnter = (e: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <>
      <div className={styles.pieContainer}>
        <div className={styles.waterMark}>{renderLabel()}</div>
        <ResponsiveContainer className={styles.container} width='100%' height={400}>
          <PieChart>
            <Legend layout='vertical' verticalAlign='top' align='right' content={<ChartLegend />} />
            <defs>
              <linearGradient id='colorGroupA' x1='0%' y1='0%' x2='0%' y2='100%'>
                <stop offset='0%' stopColor='#5CCF8A' />
                <stop offset='100%' stopColor='#4BB475' />
              </linearGradient>
              <linearGradient id='colorGroupB' x1='0%' y1='0%' x2='0%' y2='100%'>
                <stop offset='0%' stopColor='#A855F7' />
                <stop offset='100%' stopColor='#8F2BEF' />
              </linearGradient>
              <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
                <feGaussianBlur in='SourceGraphic' stdDeviation='3' result='blur' />
              </filter>
            </defs>
            <Pie
              data={data}
              activeShape={renderActiveShape}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={90}
              endAngle={450}
              fill='#8884d8'
              dataKey='volume'
              onMouseEnter={onPieEnter}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} stroke='none' fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default ChartOpenInterest;
