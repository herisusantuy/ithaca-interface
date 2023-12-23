// Props
import { PayoffDataProps, SpecialDotLabel } from '@/UI/constants/charts/charts';
import { LabelPositionProp } from '@/UI/utils/CalcChartPayoff';
import { getNumberFormat } from '@/UI/utils/Numbers';
import LogoUsdc from '../Icons/LogoUsdc';

// Types
type LabelProps = {
  x?: number | string;
  y?: number | string;
  value?: number | string;
  base: number | string;
  dataSize: number;
  index?: number;
  special: SpecialDotLabel[];
  dataList: PayoffDataProps[];
  height: number;
  labelPosition: LabelPositionProp[];
};

const CustomLabel = (props: LabelProps) => {
  const { x, y, index, special, dataList, height, labelPosition } = props;

  function renderLabel() {
    if (labelPosition.length == 0) {
      return (
        <text
          x={x}
          y={Number(y) >= height - 30 ? height - 30 : Number(y)}
          dx={13}
          dy={20}
          fill='#9D9DAA'
          fontSize={9}
          textAnchor='middle'
          key={index}
        >
          {Math.round(dataList[Number(index)].x)}
        </text>
      );
    } else {
      const PrevPosition: LabelPositionProp = labelPosition[labelPosition.length - 1];
      const prevX = PrevPosition.x;
      const prevY = PrevPosition.y;
      const prevOffset = PrevPosition.offset;
      if (prevX - 5 < Number(x) && prevX + 5 >= Number(x)) {
        if (prevY - 20 < Number(y) && prevY + 20 >= Number(y)) {
          return (
            <text
              x={x}
              y={Number(y) >= height - 20 ? height - 20 : prevOffset}
              dx={10}
              dy={20}
              fill='#9D9DAA'
              fontSize={9}
              textAnchor='middle'
              key={index}
            >
              {Math.round(dataList[Number(index)].x)}
            </text>
          );
        } else {
          return (
            <text
              x={x}
              y={Number(y) >= height - 30 ? height - 30 : Number(y)}
              dx={10}
              dy={20}
              fill='#9D9DAA'
              fontSize={9}
              textAnchor='middle'
              key={index}
            >
              {Math.round(dataList[Number(index)].x)}
            </text>
          );
        }
      } else {
        return (
          <text
            x={x}
            y={Number(y) >= height - 30 ? height - 30 : Number(y)}
            dx={10}
            dy={20}
            fill='#9D9DAA'
            fontSize={9}
            textAnchor='middle'
            key={index}
          >
            {Math.round(dataList[Number(index)].x)}
          </text>
        );
      }
    }
  }
  // if (
  //   special.find(item => item.x == dataList[index ?? 0]?.x) || (value === 0 && dataList[index ? index - 1 : 0]?.value !== 0)
  // ) {
  //   return renderLabel();
  // }
  if (special.find(item => item.x == dataList[index ?? 0]?.x)) {
    return renderLabel();
  }
  return null;
};

export default CustomLabel;
