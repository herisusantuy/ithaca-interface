import { SpecialDotLabel, PayoffDataProps } from '@/UI/constants/charts';

// Types
type LabelProps = {
  x?: number | string;
  y?: number | string;
  value?: number | string;
  base: number | string;
  dataSize: number;
  index?: number;
  special: SpecialDotLabel[];
};

const CustomLabel = (props: LabelProps) => {
  const { x, y, value, base, index, dataSize, special } = props;

  const renderLabel = (dx: number = 0, dy: number = 0) => (
    <text x={x} y={y} dx={dx} dy={dy} fill='#fff' fontSize={12} textAnchor='middle'>
      {Number(value) + Number(base)}
    </text>
  );

  if (index == 0) {
    return null;
  } else if (dataSize === Number(index) + 1) {
    return null;
  } else if (special.length == 0) {
    return null;
  } else {
    return special.map((item: SpecialDotLabel) => {
      if (item.value === Number(value) + Number(base)) {
        return renderLabel(0, 20);
      }
    });
  }
};

export default CustomLabel;
