import { PayoffDataProps } from '@/UI/constants/charts';

// Types
type CustomDotProps = {
  cx?: number;
  cy?: number;
  stroke?: string;
  base?: number;
  payload?: PayoffDataProps;
};

const CustomDot = (props: CustomDotProps) => {
  const { cx, cy, base, payload } = props;

  const renderCircle = () => {
    if (Number(payload?.value) == 0) {
      return <circle cx={cx} cy={cy} r={1} fill='#fff' stroke='#fff' strokeWidth={1} />;
    }

    if (Number(payload?.value) > 0) {
      return <circle cx={cx} cy={cy} r={1} fill='#5ee192' stroke='#5ee192' strokeWidth={1} />;
    }
    if (Number(payload?.value) < 0) {
      return <circle cx={cx} cy={cy} r={1} fill='#FF3F57' stroke='#FF3F57' strokeWidth={1} />;
    }
  };

  return <>{renderCircle()}</>;
};

export default CustomDot;
