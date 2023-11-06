// Packages
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, Tooltip, ReferenceLine, XAxis, Label } from 'recharts';

// Components
import CustomTooltip from '@/UI/components/ChartPayoff/CustomTooltip';
import CustomCursor from '@/UI/components/ChartPayoff/CustomCursor';
import CustomLabel from '@/UI/components/ChartPayoff/CustomLabel';
import CustomDot from '@/UI/components/ChartPayoff/CustomDot';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Key from '@/UI/components/ChartPayoff/Key';

// Constants
import { PayoffDataProps, SpecialDotLabel } from '@/UI/constants/charts';

// Styles
import styles from '@/UI/components/ChartPayoff/ChartPayoff.module.scss';
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart';

type ChartDataProps = {
  chartData: PayoffDataProps[];
  specialDot: SpecialDotLabel[];
};

const ChartPayoff = (props: ChartDataProps) => {
  const { chartData, specialDot } = props;
  const [isClient, setIsClient] = useState(false);
  // const [dataMax, setDataMax] = useState(0);
  // const [dataMin, setDataMin] = useState(0);
  const [changeVal, setChangeVal] = useState(0);
  const [cursorX, setCursorX] = useState(0);

  useEffect(() => {
    const max = Math.max(...modifiedData.map(i => i.value));
    const min = Math.min(...modifiedData.map(i => i.value));
    // setDataMax(max);
    // setDataMin(min);
    setIsClient(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseMove = (e: CategoricalChartState ) => {
    if (e.activePayload) {
      const xValue = e.chartX;
      setCursorX(xValue ?? 0);
    }
  };
  const baseValue = 0;

  const modifiedData = chartData.map(item => ({
    ...item,
    value: item.value - baseValue,
    dashValue: item.dashValue !== undefined ? item.dashValue - baseValue : undefined,
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
          <div className={styles.unlimited}>
            <h3>Potential P&L:</h3>
            <p>{'+' + '' + changeVal}</p>
            <LogoUsdc />
          </div>
          {/* <div className={styles.unlimited}>
            <h2>Unlimited Upside</h2>
            <LogoUsdc />
          </div> */}
          <AreaChart data={modifiedData} width={400} height={300} onMouseMove={handleMouseMove}>
            <defs>
              <linearGradient id='fillGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#5ee192' stopOpacity={0.4} />
                <stop offset={off} stopColor='#8884d8' stopOpacity={0} />
                <stop offset='95%' stopColor='#FF3F57' stopOpacity={0.4} />
              </linearGradient>

              <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='2%' stopColor='#5ee192' stopOpacity={0.1} />
                <stop offset='40%' stopColor='#5ee192' stopOpacity={0.3} />
                <stop offset={off} stopColor='#fff' stopOpacity={0.6} />
                <stop offset='75%' stopColor='#FF3F57' stopOpacity={0.3} />
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
              strokeWidth='2'
              dataKey='value'
              fill='url(#fillGradient)'
              label={<CustomLabel base={baseValue} dataSize={modifiedData.length} special={specialDot} />}
              dot={<CustomDot base={baseValue} dataSize={modifiedData.length} special={specialDot} />}
              activeDot={false}
            />
            <Area
              type='linear'
              stroke='url(#dashGradient)'
              dataKey='dashValue'
              strokeDasharray='3 3'
              fill='transparent'
              activeDot={false}
            />
            <ReferenceLine y={baseValue} stroke='#ffffff4d' strokeWidth={0.5} />
            <Tooltip
              isAnimationActive={false}
              animationDuration={1}
              position={{ x: cursorX - 50, y: 0 }}
              wrapperStyle={{ width: 100 }}
              cursor={<CustomCursor x={cursorX} />}
              content={<CustomTooltip base={baseValue} setChangeVal={setChangeVal} />}
            />

            <XAxis tick={false} axisLine={false}>
              <Label
                content={
                  <>
                    <text x={10} y={220} fill='#FF3F57' fontSize={10} textAnchor='left'>
                      -{2354}
                    </text>
                    <LogoUsdc x={40} y={207} />
                  </>
                }
                position='insideBottom'
              />
            </XAxis>
          </AreaChart>
          <Key />
        </div>
      )}
    </>
  );
};

export default ChartPayoff;
