// Packages
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, Tooltip, ReferenceLine } from 'recharts';

// Components
import CustomTooltip from '@/UI/components/ChartPayoff/CustomTooltip';
import Key from '@/UI/components/ChartPayoff/Key';

// Constants
import { PAYOFF_DUMMY_DATA } from '@/UI/constants/charts';

const ChartPayoff = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const baseValue = 200;

  const modifiedData = PAYOFF_DUMMY_DATA.map(item => ({
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
                <stop offset={off} stopColor='#fff' stopOpacity={0.8} />
                <stop offset='92%' stopColor='#FF3F57' stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <Tooltip content={<CustomTooltip base={baseValue} />} />
            <Area type='linear' stroke='url(#lineGradient)' strokeWidth='3' dataKey='value' fill='url(#fillGradient)' />
            <ReferenceLine y={0} stroke='#ffffff4d' strokeWidth={0.5} />
          </AreaChart>
          <Key />
        </div>
      )}
    </>
  );
};

export default ChartPayoff;
