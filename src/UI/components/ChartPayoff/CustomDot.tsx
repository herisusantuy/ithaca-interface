// Constants
import { PayoffDataProps, SpecialDotLabel } from '@/UI/constants/charts/charts';
import { useEffect } from 'react';

// Types
type CustomDotProps = {
  cx?: number;
  cy?: number;
  stroke?: string;
  base?: number;
  payload?: PayoffDataProps;
  dataSize: number;
  special: SpecialDotLabel[];
  index?: number;
  dataList: PayoffDataProps[];
  updatePosition: (val: number) => void;
};

const CustomDot = (props: CustomDotProps) => {
  const { cx, cy, payload, special, base, dataSize, index, dataList, updatePosition } = props;

  // updatePosition(cy ? Math.round(cy) : 0);
  
  const renderCircle = (idx: number) => {
    if (Number(payload?.value) === 0) {
      return <circle cx={cx} cy={cy} r={2} fill='#fff' stroke='#fff' strokeWidth={1} key={idx} />;
    }

    if (Number(payload?.value) > 0) {
      return <circle cx={cx} cy={cy} r={2} fill='#5ee192' stroke='#5ee192' strokeWidth={1} key={idx} />;
    }
    if (Number(payload?.value) < 0) {
      return <circle cx={cx} cy={cy} r={2} fill='#FF3F57' stroke='#FF3F57' strokeWidth={1} key={idx} />;
    }
  };

  if (special.find(item => item.x == payload?.x) || payload?.value === 0) {
    return renderCircle(index ?? 0);
  }
  return null;
};

export default CustomDot;
