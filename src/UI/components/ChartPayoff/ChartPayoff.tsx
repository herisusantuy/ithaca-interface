import React from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, CartesianAxis } from 'recharts';

interface Prop {
  baseValue: number;
}

const data = [
  {
    name: 'Jan',
    value: -50,
  },
  {
    name: 'Feb',
    value: -50,
  },
  {
    name: 'Mar',
    value: 100,
  },
  {
    name: 'Apr',
    value: 200,
  },
  {
    name: 'May',
    value: 300,
  },
];

const ChartPayoff = (props: Prop) => {
  let baseValue = props.baseValue;
  baseValue = 100;

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
    <AreaChart width={400} height={300} data={modifiedData}>
      <defs>
        <linearGradient id='splitColor' gradientTransform='rotate(90)'>
          <stop offset={off} stopColor='#5ee192' stopOpacity={0.2} />
          <stop offset={off} stopColor='#FF3F57' stopOpacity={0.2} />
        </linearGradient>
        <linearGradient id='fillGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='5%' stopColor='#8884d8' stopOpacity={0.4} />
          <stop offset={off} stopColor='#8884d8' stopOpacity={0} />
          <stop offset='95%' stopColor='#8884d8' stopOpacity={0.4} />
        </linearGradient>
      </defs>
      <Tooltip />
      <Area type='linear' stroke='#8884d8' dataKey='value' fill='url(#fillGradient)' />
      <ReferenceLine y={0} stroke='red' />
    </AreaChart>
  );
};

export default ChartPayoff;
