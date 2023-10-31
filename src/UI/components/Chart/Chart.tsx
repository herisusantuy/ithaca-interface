import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 12 },
  { name: 'Feb', value: 15 },
  { name: 'Mar', value: 20 },
  { name: 'Apr', value: 18 },
];

const Chart = () => {
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart width={400} height={300} data={data}>
        <Line type='monotone' dataKey='value' stroke='#8884d8' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
