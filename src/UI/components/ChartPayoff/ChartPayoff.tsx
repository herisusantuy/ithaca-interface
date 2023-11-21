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
  showGradientTags,
} from '@/UI/utils/ChartUtil';
import { LabelPositionProp, PayoffMap } from '@/UI/utils/CalcChartPayoff';
import { getNumber, getNumberFormat } from '@/UI/utils/Numbers';

// Types
type ChartDataProps = {
  chartData: PayoffMap[];
  height: number;
  showKeys?: boolean;
  showPortial?: boolean;
  showUnlimited?: boolean;
  compact?: boolean;
};

type DomainType = {
  min: number;
  max: number;
};

// Styles
import styles from '@/UI/components/ChartPayoff/ChartPayoff.module.scss';
import Flex from '@/UI/layouts/Flex/Flex';

const ChartPayoff = (props: ChartDataProps) => {
  const { chartData = PAYOFF_DUMMY_DATA, height, showKeys = true, showPortial = true, compact } = props;

  const [isClient, setIsClient] = useState(false);
  const [changeVal, setChangeVal] = useState(0);
  const [cursorX, setCursorX] = useState(0);
  const [bridge] = useState<KeyType>({ label: 'total', type: 'leg1' });
  const [dashed, setDashed] = useState<KeyType>({ label: '', type: 'leg1' });
  const [upSide, setUpSide] = useState<boolean>(false);
  const [downSide, setDownSide] = useState<boolean>(false);
  const [minimize, setMinimize] = useState<number>(0);
  const [modifiedData, setModifiedData] = useState<PayoffDataProps[]>([]);
  const [off, setOff] = useState<number>(0);
  const [breakPoints, setBreakPoints] = useState<SpecialDotLabel[]>([]);
  const [width, setWidth] = useState<number>(0);
  const [key, setKey] = useState<string[]>(['total']);
  const [color, setColor] = useState<string>('#5EE192');
  const [dashedColor, setDashedColor] = useState<string>('#B5B5F8');
  const [domain, setDomain] = useState<DomainType>({ min: 0, max: 0 });
  const [xAxisPosition, setXAxisPosition] = useState<number>(height - 30);
  const [pnlLabelPosition, setPnlLabelPosition] = useState<number>(0);
  const [labelPosition, setLabelPosition] = useState<LabelPositionProp[]>([]);

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
    setOff(gradientOffset(xAxisPosition, height, modified));
    // setOff(gradientOffset(modified));
    setXAxisPosition(0);
    setLabelPosition([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bridge, chartData, dashed]);

  useEffect(() => {
    setOff(gradientOffset(xAxisPosition, height, modifiedData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xAxisPosition]);

  useEffect(() => {
    renderGradient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [off]);
  // mouse move handle events
  const handleMouseMove = (e: CategoricalChartState) => {
    if (!e) return; // Avoid null event in compact mode when tooltip is not rendered
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
    setXAxisPosition(val);
  };

  const handleResize = (width: number) => {
    setWidth(width);
  };

  const updateDashed = (val: KeyType) => {
    setDashed(val);
  };

  const renderGradient = () => {
    return showGradientTags(off, color, dashedColor);
  };

  // const updateLabelPosition = (positionObj: LabelPositionProp) => {
  //   const updatedPositions = [...labelPosition, ...[positionObj]];
  //   setTimeout(() => {
  //     setLabelPosition(updatedPositions);
  //   }, 10);
  // };

  return (
    <>
      {isClient && (
        <>
          {!compact && (
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
          )}
          <div className={styles.leftSide}></div>
          <div className={styles.rightSide}></div>
          <ResponsiveContainer width='100%' height={height} onResize={handleResize}>
            <AreaChart
              data={modifiedData}
              onMouseMove={handleMouseMove}
              margin={{ top: compact ? 0 : 18, right: 0, left: 0, bottom: compact ? 0 : 25 }}
            >
              {renderGradient()}

              <YAxis type='number' domain={[domain.min, domain.max]} hide={true} />

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

              <Area
                type='linear'
                stroke='url(#lineGradient)'
                dataKey='value'
                fill='url(#fillGradient)'
                filter='url(#glow)'
                label={
                  !compact && (
                    <CustomLabel
                      base={baseValue}
                      dataSize={modifiedData.length}
                      special={breakPoints}
                      dataList={modifiedData}
                      height={height}
                      labelPosition={labelPosition}
                      // updateLabelPosition={updateLabelPosition}
                    />
                  )
                }
                dot={
                  !compact && (
                    <CustomDot
                      base={baseValue}
                      dataSize={modifiedData.length}
                      special={breakPoints}
                      dataList={modifiedData}
                      updatePosition={updatePosition}
                      updatePnlLabelPosition={setPnlLabelPosition}
                    />
                  )
                }
                activeDot={false}
              />
              {/* Reference line */}
              <ReferenceLine y={baseValue} stroke='white' strokeOpacity={0.3} strokeWidth={0.5} />

              {/* Tooltip */}
              {!compact && (
                <Tooltip
                  isAnimationActive={false}
                  animationDuration={1}
                  position={{ x: cursorX - 50, y: 7 }}
                  wrapperStyle={{ width: 100 }}
                  cursor={<CustomCursor x={cursorX} y={xAxisPosition} height={height} />}
                  content={<CustomTooltip x={cursorX} y={xAxisPosition} base={baseValue} setChangeVal={updateChange} height={height} />}
                />
              )}

              <XAxis tick={false} axisLine={false} className={`${!showPortial ? styles.hide : ''}`} height={1}>
                <Label
                  content={
                    <>
                      <text
                        x={10}
                        y={pnlLabelPosition + 20 > height ? height - 20 : pnlLabelPosition + 20}
                        fill={'#FF3F57'}
                        fontSize={12}
                        textAnchor='left'
                      >
                        {downSide
                          ? 'Unlimited Downside'
                          : minimize >= 0
                          ? '+' + '' + getNumberFormat(minimize)
                          : '-' + getNumberFormat(minimize)}
                      </text>
                      {downSide ? (
                        <></>
                      ) : (
                        <LogoUsdc
                          x={10 + (getNumberFormat(minimize).length + 1) * 7}
                          y={pnlLabelPosition + 20 > height ? height - 33 : pnlLabelPosition + 7}
                        />
                      )}
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
