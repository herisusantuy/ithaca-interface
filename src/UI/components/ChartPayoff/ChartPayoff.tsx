// Packages
import { useEffect, useState } from 'react';
import { AreaChart, Area, Tooltip, ReferenceLine, XAxis, Label, ResponsiveContainer, YAxis } from 'recharts';

// Components
import CustomTooltip from '@/UI/components/ChartPayoff/CustomTooltip';
import CustomCursor from '@/UI/components/ChartPayoff/CustomCursor';
import CustomLabel from '@/UI/components/ChartPayoff/CustomLabel';
import CustomDot from '@/UI/components/ChartPayoff/CustomDot';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Key from '@/UI/components/ChartPayoff/Key';

// Constants
import { PayoffDataProps, PAYOFF_DUMMY_DATA, SpecialDotLabel, KeyType } from '@/UI/constants/charts/charts';

// Event Props
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart';

// Utils
import {
  breakPointList,
  findOverallMinMaxValues,
  getLegs,
  gradientOffset,
  isDecrementing,
  isIncrementing,
  makingChartData,
} from '@/UI/utils/ChartUtil';
import { PayoffMap } from '@/UI/utils/CalcChartPayoff';

// Types
type ChartDataProps = {
  chartData: PayoffMap[];
  height: number;
  showKeys?: boolean;
  showPortial?: boolean;
  showUnlimited?: boolean;
};

type DomainType = {
  min: number;
  max: number;
};

// Styles
import styles from '@/UI/components/ChartPayoff/ChartPayoff.module.scss';
import { getNumber } from '@/UI/utils/Numbers';

const ChartPayoff = (props: ChartDataProps) => {
  const { chartData = PAYOFF_DUMMY_DATA, height, showKeys = true, showPortial = true } = props;
  const [isClient, setIsClient] = useState(false);
  const [changeVal, setChangeVal] = useState(0);
  const [cursorX, setCursorX] = useState(0);
  const [bridge, setBridge] = useState<KeyType>({ label: 'total', type: 'leg1' });
  const [dashed, setDashed] = useState<string>('');
  const [upSide, setUpSide] = useState<boolean>(false);
  const [downSide, setDownSide] = useState<boolean>(false);
  const [minimize, setMinimize] = useState<number>(0);
  const [modifiedData, setModifiedData] = useState<PayoffDataProps[]>([]);
  const [off, setOff] = useState<number>(0);
  const [breakPoints, setBreakPoints] = useState<SpecialDotLabel[]>([]);
  const [width, setWidth] = useState<number>(0);
  const [key, setKey] = useState<string[]>(['total']);
  const [color, setColor] = useState<string>('#4bb475');
  const [domain, setDomain] = useState<DomainType>({ min: 0, max: 0 });
  const [minimumPosition, setMinimumPosition] = useState<number>(0);
  const baseValue = 0;
  const colorArray = [
    '#4bb475',
    '#b5b5f8',
    '#ff772a',
    '#a855f7',
    '#7ad136',
    '#ff3f57',
    '#6545a4',
    '#18b5b5',
    '#4421af',
    '#d7658b',
    '#7c1158',
    '#786028',
    '#50e991',
    '#b33dc6',
    '#00836e',
  ];

  useEffect(() => {
    setIsClient(true);
    setKey(getLegs(chartData));
  }, [chartData]);

  // Update chartData and updating graph
  useEffect(() => {
    setDomain(findOverallMinMaxValues(chartData));
    const tempData = makingChartData(chartData, bridge.label, dashed);
    const colorIndex = getNumber(bridge.type.replace('leg', ''));
    setColor(colorArray[colorIndex - 1]);
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
    setMinimumPosition(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bridge, chartData, dashed]);

  // mouse move handle events
  const handleMouseMove = (e: CategoricalChartState) => {
    if (e.activePayload) {
      const xValue = e.chartX;
      setCursorX(xValue ?? 0);
    }
  };

  const updateChange = (val: number) => {
    setTimeout(() => {
      setChangeVal(Math.round(val));
    }, 10);
  };

  const updatePosition = (val: number) => {
    if (val > minimumPosition) {

      setMinimumPosition(val);
      // setTimeout(() => {
      // }, 5);
    }
  };

  const handleResize = (width: number) => {
    setWidth(width);
  };

  return (
    <>
      {isClient && (
        <>
          <div className={`${styles.unlimited} ${!showPortial ? styles.hide : ''}`}>
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
                  <stop offset='5%' stopColor={color} stopOpacity={0.4} />
                  <stop offset={off} stopColor='#8884d8' stopOpacity={0} />
                  <stop offset='95%' stopColor='#FF3F57' stopOpacity={0.4} />
                </linearGradient>

                <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
                  <feGaussianBlur in='SourceGraphic' stdDeviation='3' result='blur' />
                </filter>

                <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='2%' stopColor={color} stopOpacity={0.1} />
                  <stop offset='40%' stopColor={color} stopOpacity={0.3} />
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
                  <stop offset='8%' stopColor={color} stopOpacity={0.3} />
                  <stop offset='92%' stopColor='#FF3F57' stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <YAxis type='number' domain={[domain.min, domain.max]} hide={true} />
              <Area
                type='linear'
                stroke='url(#lineGradient)'
                dataKey='value'
                fill='url(#fillGradient)'
                filter='url(#glow)'
                label={
                  <CustomLabel
                    base={baseValue}
                    dataSize={modifiedData.length}
                    special={breakPoints}
                    dataList={modifiedData}
                  />
                }
                dot={
                  <CustomDot
                    base={baseValue}
                    dataSize={modifiedData.length}
                    special={breakPoints}
                    dataList={modifiedData}
                    updatePosition={updatePosition}
                  />
                }
                activeDot={false}
              />
              <Area
                type='linear'
                stroke='url(#lineGradient)'
                strokeWidth='2'
                dataKey='value'
                fill='transparent'
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

              <XAxis tick={false} axisLine={false} className={`${!showPortial ? styles.hide : ''}`}>
                <Label
                  content={
                    <>
                      <text x={10} y={minimumPosition + 5} fill='#FF3F57' fontSize={10} textAnchor='left'>
                        {downSide
                          ? 'Unlimited Downside'
                          : minimize >= 0
                          ? '+' + '' + Math.round(minimize)
                          : '' + Math.round(minimize)}
                      </text>
                      {downSide ? <></> : <LogoUsdc x={60} y={minimumPosition - 8} />}
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
          {showKeys && <Key keys={key} onDashed={setDashed} />}
        </>
      )}
    </>
  );
};

export default ChartPayoff;
