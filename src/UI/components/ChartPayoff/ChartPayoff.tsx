// Packages
import { useEffect, useState } from 'react';
import { AreaChart, Area, Tooltip, ReferenceLine, XAxis, Label, ResponsiveContainer } from 'recharts';

// Components
import CustomTooltip from '@/UI/components/ChartPayoff/CustomTooltip';
import CustomCursor from '@/UI/components/ChartPayoff/CustomCursor';
import CustomLabel from '@/UI/components/ChartPayoff/CustomLabel';
import CustomDot from '@/UI/components/ChartPayoff/CustomDot';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Key from '@/UI/components/ChartPayoff/Key';

// Constants
import {
  PayoffDataProps,
  PAYOFF_DUMMY_DATA,
  SpecialDotLabel,
  KEY_DATA,
  KeyType,
  CHART_FAKE_DATA,
} from '@/UI/constants/charts';

//Event Props
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart';

// Styles
import styles from '@/UI/components/ChartPayoff/ChartPayoff.module.scss';
import { breakPointList, getLegs, gradientOffset, isDecrementing, isIncrementing, makingChartData } from '@/UI/utils/ChartUtil';

type ChartDataProps = {
  chartData: PayoffDataProps[];
  height: number;
};

const ChartPayoff = (props: ChartDataProps) => {
  const { chartData = PAYOFF_DUMMY_DATA, height } = props;
  const [isClient, setIsClient] = useState(false);
  const [changeVal, setChangeVal] = useState(0);
  const [cursorX, setCursorX] = useState(0);
  const [bridge, setBridge] = useState<string>('total');
  const [upSide, setUpSide] = useState<boolean>(false);
  const [downSide, setDownSide] = useState<boolean>(false);
  const [minimize, setMinimize] = useState<number>(0);
  const [modifiedData, setModifiedData] = useState<PayoffDataProps[]>([]);
  const [off, setOff] = useState<number>(0);
  const [breakPoints, setBreakPoints] = useState<SpecialDotLabel[]>([]);
  const [width, setWidth] = useState<number>(0);
  const [key, setKey] = useState<string[]>(['total']);
  const baseValue = 0;

  useEffect(() => {
    setIsClient(true);
    setKey(getLegs(chartData));
  }, [chartData]);

  // Update chartData and updating graph
  useEffect(() => {
    const tempData = makingChartData(chartData, bridge);
    setMinimize(Math.min(...tempData.map(i => i.value)));
    isIncrementing(tempData) ? setUpSide(true) : setUpSide(false);
    isDecrementing(tempData) ? setDownSide(true) : setDownSide(false);
    setBreakPoints(breakPointList(tempData));
    const modified = tempData.map(item => ({
      ...item,
      value: item.value - baseValue,
      dashValue: item.dashValue !== undefined ? item.dashValue - baseValue : undefined,
    }));
    setModifiedData(modified);

    // set gradient value
    setOff(gradientOffset(modified));
  }, [bridge, chartData]);

  // mouse move handle events
  const handleMouseMove = (e: CategoricalChartState) => {
    if (e.activePayload) {
      const xValue = e.chartX;
      setCursorX(xValue ?? 0);
    }
  };

  const updateChange = (val: number) => {
    setTimeout(() => {
      setChangeVal(val);
    }, 10);
  };

  const handleResize = (width: number) => {
    setWidth(width);
  };

  return (
    <>
      {isClient && (
        <>
          <div className={styles.unlimited}>
            <h3>Potential P&L:</h3>
            <p className={changeVal < 0 ? styles.redColor : styles.greenColor}>
              {changeVal >= 0 ? '+' + '' + changeVal : changeVal}
            </p>
            <LogoUsdc />
          </div>
          <ResponsiveContainer width='100%' height={height} onResize={handleResize}>
            <AreaChart data={modifiedData} onMouseMove={handleMouseMove}>
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
                label={<CustomLabel base={baseValue} dataSize={modifiedData.length} special={breakPoints} dataList={modifiedData}  />}
                dot={<CustomDot base={baseValue} dataSize={modifiedData.length} special={breakPoints} dataList={modifiedData} />}
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
                content={<CustomTooltip base={baseValue} setChangeVal={updateChange} />}
              />

              <XAxis tick={false} axisLine={false}>
                <Label
                  content={
                    <>
                      <text x={10} y={height - 50} fill='#FF3F57' fontSize={10} textAnchor='left'>
                        {downSide ? 'Unlimited Downside' : minimize >= 0 ? '+' + '' + minimize : '' + minimize}
                      </text>
                      {downSide ? <></> : <LogoUsdc x={60} y={height - 63} />}
                    </>
                  }
                  position='insideBottom'
                />
                <Label
                  content={
                    <>
                      <text
                        x={width - 50}
                        y={8}
                        fill={upSide ? '#5EE192' : 'transparent'}
                        fontSize={10}
                        textAnchor='middle'
                      >
                        Unlimited Upside
                      </text>
                    </>
                  }
                  position='insideBottom'
                />
              </XAxis>
            </AreaChart>
          </ResponsiveContainer>
          <Key keys={key} onChange={setBridge} />
        </>
      )}
    </>
  );
};

export default ChartPayoff;
