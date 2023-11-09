// Constants
import { PayoffDataProps, SpecialDotLabel } from '@/UI/constants/charts';

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
};

const CustomDot = (props: CustomDotProps) => {
  const { cx, cy, payload, special, base, dataSize, index, dataList } = props;

  const renderCircle = (idx: number) => {
    if (Number(payload?.value) == 0) {
      if (dataList[Number(index) - 1] && Number(dataList[Number(index) - 1].value) != Number(payload?.value)) {
        return <circle cx={cx} cy={cy} r={2} fill='#fff' stroke='#fff' strokeWidth={1} key={idx} />;
      }
    }

    if (Number(payload?.value) > 0) {
      return <circle cx={cx} cy={cy} r={2} fill='#5ee192' stroke='#5ee192' strokeWidth={1} key={idx} />;
    }
    if (Number(payload?.value) < 0) {
      return <circle cx={cx} cy={cy} r={2} fill='#FF3F57' stroke='#FF3F57' strokeWidth={1} key={idx} />;
    }
  };

  if (index == 0) {
    return null;
  } else if (dataSize === Number(index) + 1) {
    return null;
  } else if (special.length == 0) {
    return null;
  } else {
    return special.map((item: SpecialDotLabel, idx: number) => {
      if (item.value === Number(payload?.value) + Number(base)) {
        return renderCircle(idx);
      }
    });
  }
};

export default CustomDot;
