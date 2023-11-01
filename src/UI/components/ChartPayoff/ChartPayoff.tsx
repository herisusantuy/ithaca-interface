import React from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, CartesianAxis, Label } from 'recharts';
import CustomTooltip from './CustomTooltip';
import BookmarkBar from './BookmarkBar';

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
  const baseValue = 200;

  const modifiedData = data.map(item => ({
    ...item,
    value: item.value - baseValue,
  }));

  const gradientOffset = () => {
    const dataMax = Math.max(...modifiedData.map(i => i.value));
    const dataMin = Math.min(...modifiedData.map(i => i.value));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };
  const off = gradientOffset();
  return (
    <>
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
              <stop offset={off} stopColor='#fff' stopOpacity={0.8} />
              <stop offset='92%' stopColor='#FF3F57' stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <Tooltip content={<CustomTooltip base={baseValue}/>} />
          <Area type='linear' stroke='url(#lineGradient)' strokeWidth='3' dataKey='value' fill='url(#fillGradient)' />
          <ReferenceLine y={0} stroke='#ffffff4d' strokeWidth={0.5} />
        </AreaChart>
        <BookmarkBar />
      </div>
    </>
  );
};

export default ChartPayoff;
