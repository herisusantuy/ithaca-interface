import React from 'react';
import { AreaChart, Area, Tooltip, ReferenceLine, XAxis, Label } from 'recharts';
import CustomTooltip from './CustomTooltip';
import BookmarkBar from './BookmarkBar';
import CustomLabel from './CustomLabel';
import CustomDot from './CustomDot';
import LogoUsdc from '../Icons/LogoUsdc';

import styles from './ChartPayoff.module.scss';
import CustomLogoUsdc from '../Icons/CustomLogoUsdc';

const data = [
  {
    value: 100,
    dashValue: 0,
  },
  {
    value: 100,
    dashValue: 100,
  },
  {
    value: 200,
  },
  {
    value: 300,
  },
  {
    value: 400,
  },
];

const ChartPayoff = () => {
  const [isClient, setIsClient] = React.useState(false);
  const [dataMax, setDataMax] = React.useState(0);
  const [dataMin, setDataMin] = React.useState(0);
  const [changeVal, setChangeVal] = React.useState(0);

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
    dashValue: item.dashValue !== undefined ? item.dashValue - baseValue : undefined,
  }));

  // const interpolateData = (data: Array<DataTypeProps>) => {
  //   const interpolatedData = [];

  //   for (let i = 0; i < data.length - 1; i++) {
  //     interpolatedData.push(data[i]);

  //     const startValue = data[i].value;
  //     const endValue = data[i + 1].value;

  //     if (endValue - startValue > 1) {
  //       for (let j = startValue + 1; j < endValue; j++) {
  //         interpolatedData.push({ value: j });
  //       }
  //     } else if (endValue === startValue) {
  //       // Find the total number of repeated values
  //       let repetitions = 0;
  //       for (let k = i + 1; k < data.length && data[k].value === startValue; k++) {
  //         repetitions++;
  //       }

  //       if (repetitions > 0) {
  //         // Calculate the step for repeated values
  //         const step = (endValue - startValue) / (repetitions + 1);

  //         for (let k = 1; k <= repetitions; k++) {
  //           interpolatedData.push({ value: startValue + step * k });
  //         }
  //       }
  //     }
  //   }

  //   interpolatedData.push(data[data.length - 1]);

  //   return interpolatedData;
  // };

  // const makingData = interpolateData(modifiedData);

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
          <div className={styles.unlimited}>
            <h3>Potential P&L:</h3>
            <p>{ '+' + '' + changeVal }</p>
            <LogoUsdc />
          </div>
          <div className={styles.unlimited}>
            <p>Unlimited Upside</p>
            <LogoUsdc />
          </div>
          <AreaChart width={400} height={300} data={modifiedData}>
            <defs>
              <linearGradient id='fillGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#5ee192' stopOpacity={0.4} />
                <stop offset={off} stopColor='#8884d8' stopOpacity={0} />
                <stop offset='95%' stopColor='#FF3F57' stopOpacity={0.4} />
              </linearGradient>

              <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='2%' stopColor='#5ee192' stopOpacity={0.1} />
                <stop offset='8%' stopColor='#5ee192' stopOpacity={0.3} />
                <stop offset={off} stopColor='#fff' stopOpacity={0.6} />
                <stop offset='92%' stopColor='#FF3F57' stopOpacity={0.3} />
                <stop offset='98%' stopColor='#FF3F57' stopOpacity={0.1} />
              </linearGradient>

              <linearGradient id='dashGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='90%' stopColor='#B5B5F8' stopOpacity={0.4} />
                <stop offset='5%' stopColor='#B5B5F8' stopOpacity={0.3} />
                <stop offset='5%' stopColor='#B5B5F8' stopOpacity={0.1} />
              </linearGradient>

              <linearGradient id='referenceLine' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='8%' stopColor='#5ee192' stopOpacity={0.3} />
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
              dot={<CustomDot />}
            />
            <Area
              type='linear'
              stroke='url(#dashGradient)'
              dataKey='dashValue'
              strokeDasharray='3 3'
              fill='transparent'
            />
            <ReferenceLine y={0} stroke='#ffffff4d' strokeWidth={0.5} />
            <Tooltip content={<CustomTooltip base={baseValue} setChangeVal={setChangeVal} />} />

            <XAxis tick={false} axisLine={false}>
              <Label
                content={
                  <>
                    <text x={0} y={230} fill='#FF3F57' fontSize={10} textAnchor='left'>
                      {-2354}
                    </text>
                    <CustomLogoUsdc x={30} y={217} />
                  </>
                }
                position='insideBottom'
              />
            </XAxis>
          </AreaChart>
          <BookmarkBar />
        </div>
      )}
    </>
  );
};

export default ChartPayoff;
