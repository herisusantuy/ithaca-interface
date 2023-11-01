import React from 'react';
import { AreaChart, Area, Tooltip, ReferenceLine } from 'recharts';
import CustomTooltip from './CustomTooltip';
import BookmarkBar from './BookmarkBar';
import CustomLabel from './CustomLabel';

const data = [
  {
    name: 'Jan',
    value: 100,
  },
  {
    name: 'Feb',
    value: 100,
  },
  {
    name: 'Mar',
    value: 200,
  },
  {
    name: 'Apr',
    value: 300,
  },
  {
    name: 'May',
    value: 400,
  },
];

const ChartPayoff = () => {
  const [isClient, setIsClient] = React.useState(false);
  const [dataMax, setDataMax] = React.useState(0);
  const [dataMin, setDataMin] = React.useState(0);
  React.useEffect(() => {
    const max = Math.max(...modifiedData.map(i => i.value));
    const min = Math.min(...modifiedData.map(i => i.value));
    setDataMax(max);
    setDataMin(min);
    setIsClient(true);
  }, []);
  const baseValue = 200;

  const modifiedData = data.map(item => ({
    ...item,
    value: item.value - baseValue,
  }));

  const gradientOffset = () => {
    const max = Math.max(...modifiedData.map(i => i.value));
    const min = Math.min(...modifiedData.map(i => i.value));

    if (max <= 0) {
      return 0;
    }
    if (min >= 0) {
      return 1;
    }

    return max / (max - min);
  };
  const off = gradientOffset();
  return (
    <>
      {isClient && (
        <div style={{ width: '400px', height: '400px' }}>
          <AreaChart width={400} height={300} data={modifiedData}>
            <defs>
              <linearGradient id='fillGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#5ee192' stopOpacity={0.4} />
                <stop offset={off} stopColor='#8884d8' stopOpacity={0} />
                <stop offset='95%' stopColor='#FF3F57' stopOpacity={0.4} />
              </linearGradient>

              <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='8%' stopColor='#5ee192' stopOpacity={0.3} />
                <stop offset={off} stopColor='#fff' stopOpacity={0.6} />
                <stop offset='92%' stopColor='#FF3F57' stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <Area
              type='linear'
              stroke='url(#lineGradient)'
              strokeWidth='3'
              dataKey='value'
              fill='url(#fillGradient)'
              label={<CustomLabel base={baseValue} max={dataMax} min={dataMin} />}
            />
            <ReferenceLine y={0} stroke='#ffffff4d' strokeWidth={0.5} />
            <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.3)' }} content={<CustomTooltip base={baseValue} />} />
          </AreaChart>
          <BookmarkBar />
        </div>
      )}
    </>
  );
};

export default ChartPayoff;
