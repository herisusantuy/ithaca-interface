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
import { getNumber, getNumberFormat } from '@/UI/utils/Numbers';

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
import Flex from '@/UI/layouts/Flex/Flex';

const ChartPayoff = (props: ChartDataProps) => {
  const { chartData = PAYOFF_DUMMY_DATA, height, showKeys = true, showPortial = true } = props;

  const [isClient, setIsClient] = useState(false);
  const [changeVal, setChangeVal] = useState(0);
  const [cursorX, setCursorX] = useState(0);
  const [bridge] = useState<KeyType>({ label: 'total', type: 'leg1' });
  const [dashed, setDashed] = useState<KeyType>({ label: 'total', type: 'leg1' });
  const [upSide, setUpSide] = useState<boolean>(false);
  const [downSide, setDownSide] = useState<boolean>(false);
  const [minimize, setMinimize] = useState<number>(0);
  const [modifiedData, setModifiedData] = useState<PayoffDataProps[]>([]);
  const [off, setOff] = useState<number>(0);
  const [breakPoints, setBreakPoints] = useState<SpecialDotLabel[]>([]);
  const [width, setWidth] = useState<number>(0);
  const [key, setKey] = useState<string[]>(['total']);
  const [color, setColor] = useState<string>('#4bb475');
  const [dashedColor, setDashedColor] = useState<string>('#B5B5F8');
  const [domain, setDomain] = useState<DomainType>({ min: 0, max: 0 });
  const [minimumPosition, setMinimumPosition] = useState<number>(0);
  const [showUnderBar, setShowUnderBar] = useState<boolean>(false);
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

  const dashedColorArray = [
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
    setShowUnderBar(false);
    setDomain(findOverallMinMaxValues(chartData));
    const tempData = makingChartData(chartData, bridge.label, dashed.label);
    const colorIndex = getNumber(bridge.type.replace('leg', ''));
    setColor(colorArray[colorIndex - 1]);
    const dashedColorIndex = getNumber(dashed.type.replace('leg', ''));
    setDashedColor(dashedColorArray[dashedColorIndex - 1]);
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
    }
  };

  const handleResize = (width: number) => {
    setWidth(width);
  };

  const handleAnimationEnd = () => {
    setShowUnderBar(false);
    setTimeout(() => {
      setShowUnderBar(true);
    }, 2000);
  };

  const updateDashed = (val: KeyType) => {
    setShowUnderBar(false);
    setDashed(val);
  };

  return (
    <>
      {isClient && (
        <>
          <Flex direction='row-space-between' margin='mb-10 mt-15'>
            <h3 className='mb-0'>Payoff Diagram</h3>
            <div className={`${styles.unlimited} ${!showPortial ? styles.hide : ''}`}>
              <h3>Potential P&L:</h3>
              <p className={changeVal < 0 ? styles.redColor : styles.greenColor}>
                {changeVal >= 0 ? '+' + getNumberFormat(changeVal) : '-' + getNumberFormat(changeVal)}
              </p>
              <LogoUsdc />
            </div>
          </Flex>
          <ResponsiveContainer width='100%' height={height} onResize={handleResize}>
            <AreaChart
              data={modifiedData}
              onMouseMove={handleMouseMove}
              margin={{ top: 18, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                {/* Area gradient */}
                <linearGradient id='fillGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='10%' stopColor={color} stopOpacity={0.2} />
                  <stop offset='40%' stopColor={color} stopOpacity={0} />
                  <stop offset={off} stopColor='#8884d8' stopOpacity={0} />
                  <stop offset='60%' stopColor='#FF3F57' stopOpacity={0} />
                  <stop offset='95%' stopColor='#FF3F57' stopOpacity={0.2} />
                </linearGradient>

                <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
                  <feGaussianBlur in='SourceGraphic' stdDeviation='2' result='blur' />
                </filter>

                {/* Core line gradient */}
                <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='2%' stopColor={color} stopOpacity={0.1} />
                  <stop offset='40%' stopColor={color} stopOpacity={0.9} />
                  <stop offset={off} stopColor='#fff' stopOpacity={0.6} />
                  <stop offset='75%' stopColor='#FF3F57' stopOpacity={0.9} />
                  <stop offset='98%' stopColor='#FF3F57' stopOpacity={0.1} />
                </linearGradient>

                <linearGradient id='dashGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='90%' stopColor={dashedColor} stopOpacity={0.4} />
                  <stop offset='5%' stopColor={dashedColor} stopOpacity={0.3} />
                  <stop offset='5%' stopColor={dashedColor} stopOpacity={0.1} />
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
                onAnimationEnd={handleAnimationEnd}
                activeDot={false}
              />

              <Area
                type='linear'
                stroke='url(#lineGradient)'
                strokeWidth='1'
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

              {/* Reference line */}
              <ReferenceLine y={baseValue} stroke='white' strokeOpacity={0.3} strokeWidth={0.5} />

              {/* Tooltip */}
              <Tooltip
                isAnimationActive={false}
                animationDuration={1}
                position={{ x: cursorX - 50, y: 7 }}
                wrapperStyle={{ width: 100 }}
                cursor={<CustomCursor x={cursorX} />}
                content={<CustomTooltip base={baseValue} setChangeVal={updateChange} />}
              />

              <XAxis tick={false} axisLine={false} className={`${!showPortial ? styles.hide : ''}`}>
                <Label
                  content={
                    <>
                      <text
                        x={10}
                        y={minimumPosition + 20}
                        fill={showUnderBar ? '#FF3F57' : 'transparent'}
                        fontSize={12}
                        textAnchor='left'
                      >
                        {downSide
                          ? 'Unlimited Downside'
                          : minimize >= 0
                          ? '+' + '' + getNumberFormat(minimize)
                          : '-' + getNumberFormat(minimize)}
                      </text>
                      {downSide || !showUnderBar ? <></> : <LogoUsdc x={50} y={minimumPosition + 7} />}
                    </>
                  }
                  position='insideBottom'
                />
                <Label
                  content={
                    <>
                      <text
                        x={width - 67}
                        y={8}
                        fill={upSide ? '#5EE192' : 'transparent'}
                        fontSize={12}
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
          {showKeys && <Key keys={key} onDashed={updateDashed} />}
        </>
      )}
    </>
  );
};

export default ChartPayoff;
