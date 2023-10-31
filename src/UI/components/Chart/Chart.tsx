import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', value: 12 },
  { name: 'Feb', value: 15 },
  { name: 'Mar', value: 20 },
  { name: 'Apr', value: 18 },
];

const Chart = () => {
  return (
    <LineChart width={400} height={300} data={data}>
      <Line type='monotone' dataKey='value' stroke='#8884d8' />
      <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
};

export default Chart;
