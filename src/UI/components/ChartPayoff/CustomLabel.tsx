// Props
import { PayoffDataProps, SpecialDotLabel } from '@/UI/constants/charts/charts';

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
};

const CustomLabel = (props: LabelProps) => {
  const { x, y, value, base, index, dataSize, special, dataList, height } = props;
  const renderLabel = () => (
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
  if (
    special.find(item => item.x == dataList[index ?? 0]?.x) ||
    (value === 0 && dataList[index ? index - 1 : 0]?.value !== 0)
  ) {
    return renderLabel();
  }
  return null;
};

export default CustomLabel;
