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
};

const CustomLabel = (props: LabelProps) => {
  const { x, y, value, base, index, dataSize, special, dataList } = props;

  const renderLabel = (dx: number = 0, dy: number = 0, idx: number) => (
    <text x={x} y={y} dx={dx + 10} dy={dy} fill='#9D9DAA' fontSize={12} textAnchor='middle' key={idx}>
      {Math.round(dataList[Number(index) - 1].x)}
    </text>
  );

  if (index == 0) {
    return null;
  } else if (dataSize === Number(index) + 1) {
    return null;
  } else if (special.length == 0) {
    return null;
  } else {
    return special.map((item: SpecialDotLabel, idx: number) => {
      if (item.value === Number(value) + Number(base)) {
        if (dataList[Number(index) - 1] && Number(dataList[Number(index) - 1].value) != Number(value)) {
          return renderLabel(0, 20, idx);
        }
      }
    });
  }
};

export default CustomLabel;
