// Packages
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { AreaChart, Area, Tooltip, ReferenceLine, XAxis, Label, ResponsiveContainer, YAxis } from 'recharts';

// Components
import CustomTooltip from '@/UI/components/ChartPayoff/CustomTooltip';
import CustomCursor from '@/UI/components/ChartPayoff/CustomCursor';
import CustomLabel from '@/UI/components/ChartPayoff/CustomLabel';
import CustomDot from '@/UI/components/ChartPayoff/CustomDot';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Key from '@/UI/components/ChartPayoff/Key';
import { InfoPopup, InfoPopupProps } from '@/UI/components/InfoPopup/InfoPopup';

// Constants
import { PayoffDataProps, PAYOFF_DUMMY_DATA, SpecialDotLabel, KeyType, KeyOption } from '@/UI/constants/charts/charts';

// Event Props
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart';

// Utils
import {
  breakPointList,
  findOverallMinMaxValues,
  getLegs,
  gradientOffset,
  isDecrementing, 
  isIncrementingByBreakPoints,
  makingChartData,
  showGradientTags,
} from '@/UI/utils/ChartUtil';
import { LabelPositionProp, PayoffMap } from '@/UI/utils/CalcChartPayoff';
import { getNumberFormat } from '@/UI/utils/Numbers';

// Types
type ChartDataProps = {
  chartData: PayoffMap[];
  height: number;
  id: string;
  showKeys?: boolean;
  showPortial?: boolean;
  showUnlimited?: boolean;
  compact?: boolean;
  caller?: string;
  infoPopup?: InfoPopupProps;
  customDomain?: DomainType;
  showProfitLoss?: boolean;
};

type DomainType = {
  min: number;
  max: number;
};

// Styles
import styles from '@/UI/components/ChartPayoff/ChartPayoff.module.scss';
import Flex from '@/UI/layouts/Flex/Flex';
import ProfitLoss from './ProfitLoss';
import DownsideText from './DownsideText';
import { chartColorArray, chartDashedColorArray } from './helpers';

const ROBOTO_AVERAGE_WIDTH = 6.5;
const RIGHT_MARGIN_MAGIC_CONST = 17;
const RIGHT_MARGIN_FOR_TEXT = RIGHT_MARGIN_MAGIC_CONST + 10;
const ChartPayoff = (props: ChartDataProps) => {
  const { 
    chartData = PAYOFF_DUMMY_DATA,
    height,
    showKeys = true,
    showPortial = true,
    compact,
    id,
    caller,
    infoPopup,
    customDomain,
    showProfitLoss = true 
  } = props;
  const [isClient, setIsClient] = useState(false);
  const [changeVal, setChangeVal] = useState(0);
  const [cursorX, setCursorX] = useState(0);
  const [bridge] = useState<KeyType>({
    label: {
      option: 'Total',
      value: 'total',
    },
    type: 'leg1',
  });
  const [dashed, setDashed] = useState<KeyType>({
    label: {
      option: '',
      value: '',
    },
    type: 'leg1',
  });
  const [upSide, setUpSide] = useState<boolean>(false);
  const [downSide, setDownSide] = useState<boolean>(false);
  // const [minimize, setMinimize] = useState<number>(0);
  const [maximize, setMaximize] = useState<number>(0);
  const [modifiedData, setModifiedData] = useState<PayoffDataProps[]>([]);
  const [off, setOff] = useState<number | undefined>();
  const [breakPoints, setBreakPoints] = useState<SpecialDotLabel[]>([]);
  const [width, setWidth] = useState<number>(0);
  const [key, setKey] = useState<KeyOption[]>([
    {
      option: 'Total',
      value: 'total',
    },
  ]);
  const [selectedLeg, setSelectedLeg] = useState<KeyOption>({
    option: 'Total',
    value: 'total',
  });
  const [color, setColor] = useState<string>('#5EE192');
  const [dashedColor, setDashedColor] = useState<string>('#B5B5F8');
  const [domain, setDomain] = useState<DomainType>({ min: 0, max: 0 });
  const [xAxisPosition, setXAxisPosition] = useState<number>(height - 30);
  const [pnlLabelPosition, setPnlLabelPosition] = useState<number>(0);
  const [labelPosition, setLabelPosition] = useState<LabelPositionProp[]>([]);
  const [gradient, setGradient] = useState<ReactElement>();
  const [isChartHovered, setIsChartHovered] = useState<boolean>(false);

  const baseValue = 0;
  

  useEffect(() => {
    setIsClient(true);
    setKey(getLegs(chartData));
  }, [chartData]);

  useEffect(() => {
    const keyIndex = key.findIndex(k => {
      return k.value === selectedLeg.value;
    });
    if (selectedLeg.value !== 'total' && keyIndex === -1) {
      setSelectedLeg({
        option: 'Total',
        value: 'total',
      });
    }
  }, [key, selectedLeg]);

  // Update chartData and updating graph
  useEffect(() => {
    setDomain(customDomain || findOverallMinMaxValues(chartData));
    const tempData = makingChartData(
      chartData,
      bridge.label,
      selectedLeg.value !== 'total' ? selectedLeg : dashed.label
    );
    const colorIndex = key.findIndex(k => k.value === selectedLeg.value);
    setColor(chartColorArray[colorIndex - 1]);
    const dashedColorIndex = key.findIndex(k => k.value === dashed.label.value);

    setDashedColor(chartDashedColorArray[dashedColorIndex - 1]);
    setMaximize(Math.max(...tempData.map(i => i.value)));
    // setMinimize(Math.min(...tempData.map(i => i.value)));
    const breakPoints = breakPointList(tempData)
    setBreakPoints(breakPoints);
    if (caller === 'Forwards') {
      setUpSide(true);
      setDownSide(true);
    } else {
      isIncrementingByBreakPoints(tempData, breakPoints) ? setUpSide(true) : setUpSide(false);
      isDecrementing(tempData) ? setDownSide(true) : setDownSide(false);
    }
    
    const modified = tempData.map(item => ({
      ...item,
      value: selectedLeg.value !== 'total' && item.dashValue ? item.dashValue - baseValue : item.value - baseValue,
      dashValue: item.dashValue !== undefined ? item.dashValue - baseValue : undefined,
    }));
    setModifiedData(modified);
    // set gradient value
    setOff(gradientOffset(xAxisPosition, height, modified));
    setLabelPosition([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bridge, chartData, dashed, selectedLeg]);

  useEffect(() => {
    if (customDomain) {
      setXAxisPosition(customDomain.min === 0 ? 0 : height );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData])


  useEffect(() => {
    if (typeof off === 'number') {
      setGradient(showGradientTags(off, color, dashedColor, id, selectedLeg.value, !customDomain));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [off, color, dashedColor, selectedLeg, customDomain]);
  // mouse move handle events
  const handleMouseMove = (e: CategoricalChartState) => {
    if (!e) return; // Avoid null event in compact mode when tooltip is not rendered
    if (e.activePayload) {
      const xValue = e.chartX;
      setCursorX(xValue ?? 0);
    }
  };

  const settingToChildLeg = (key: KeyType) => {
    setSelectedLeg(key.label);
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

  const displayProfitLoss = showPortial && showProfitLoss
  const noDownSideStart = useMemo(() => {
    const [first, second] = modifiedData
    return first?.value === 0 && second?.value === 0
  }, [modifiedData]);

  const noDownSideEnd = useMemo(() => {
    const chartDataLength = modifiedData.length
    return modifiedData?.[chartDataLength - 1]?.value === 0 && modifiedData?.[chartDataLength - 2]?.value === 0
  }, [modifiedData]);

  
  return (
    <>
      {isClient && (
        <>
          {!compact && (
            <Flex direction='row-space-between' margin='mb-10 mt-15 z-unset'>
              <h3 className='mb-0'>Payoff Diagram</h3>
              <div className={`${styles.unlimited} ${!displayProfitLoss ? styles.hide : ''}`}>
                <ProfitLoss value={changeVal} isChartHovered={isChartHovered} />
              </div>
            </Flex>
          )}
          {!compact && infoPopup && <InfoPopup {...infoPopup} />}
          <ResponsiveContainer width='100%' height={height} onResize={handleResize}>
            <AreaChart
              onMouseEnter={() => setIsChartHovered(true)}
              onMouseLeave={() => setIsChartHovered(false)}
              data={modifiedData}
              onMouseMove={handleMouseMove}
              margin={{ top: compact ? 0 : 18, right: 0, left: 0, bottom: compact ? 0 : 25 }}
            >
              {gradient}

              <YAxis type='number' domain={[domain.min, domain.max]} hide={true} />

              <Area
                type='linear'
                stroke={`url(#lineGradient-${id})`}
                strokeWidth='1'
                dataKey='value'
                fill='transparent'
                activeDot={false}
              />

              <Area
                type='linear'
                stroke={`url(#dashGradient-${id})`}
                dataKey='dashValue'
                strokeDasharray='3 3'
                fill='transparent'
                activeDot={false}
              />

              <Area
                type='linear'
                stroke={`url(#lineGradient-${id})`}
                dataKey='value'
                fill={`url(#fillGradient-${id})`}
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
                  <CustomDot
                    base={baseValue}
                    compact={compact || false}
                    dataSize={modifiedData.length}
                    special={breakPoints}
                    dataList={modifiedData}
                    updatePosition={updatePosition}
                    updatePnlLabelPosition={setPnlLabelPosition}
                  />
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
                  content={
                    <CustomTooltip
                      x={cursorX}
                      y={xAxisPosition}
                      base={baseValue}
                      setChangeVal={updateChange}
                      height={height}
                    />
                  }
                />
              )}

              <XAxis tick={false} axisLine={false} className={`${!showPortial ? styles.hide : ''}`} height={1}>
                {noDownSideStart && <Label content={<DownsideText y={xAxisPosition} x={0} />} />}
                {noDownSideEnd && <Label content={<DownsideText y={xAxisPosition} x={width - 60} />} />}
                {downSide && <Label
                  content={
                      <text
                        x={10}
                        y={pnlLabelPosition + 20 > height ? height - 20 : pnlLabelPosition + 20}
                        fill={'#FF3F57'}
                        fontSize={12}
                        textAnchor='left'
                      >
                        Unlimited Downside
                      </text>
                  }
                  position='insideBottom'
                />}
                <Label
                  content={
                    <>
                      <text
                        x={width - (upSide ? 100 : (getNumberFormat(maximize).length) * ROBOTO_AVERAGE_WIDTH + RIGHT_MARGIN_FOR_TEXT)}
                        y={10}
                        fill={'#5EE192'}
                        fontSize={12}
                        textAnchor='right'
                      >
                        {upSide
                          ? 'Unlimited Upside'
                          : maximize >= 0
                          ? '+' + getNumberFormat(maximize)
                          : '-' + getNumberFormat(maximize)}
                      </text>
                      {upSide ? <></> : <LogoUsdc x={width - RIGHT_MARGIN_MAGIC_CONST} y={-3} />}
                    </>
                  }
                  position='insideBottom'
                />
              </XAxis>
            </AreaChart>
          </ResponsiveContainer>
          {showKeys && <Key keys={key} onDashed={updateDashed} onChange={settingToChildLeg} />}
        </>
      )}
    </>
  );
};

export default ChartPayoff;
