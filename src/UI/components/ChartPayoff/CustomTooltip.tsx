// Utils
import { getNumberFormat } from '@/UI/utils/Numbers';

// Styles
import styles from './ChartPayoff.module.scss';

// Types
type CustomTooltipProps = {
  base: number | string;
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
  setChangeVal: (state: number) => void;
  x: number;
  y: number;
  height: number
};

const CustomTooltip = (props: CustomTooltipProps) => {
  const { base, active, payload, setChangeVal, y, height } = props;

  if (active) {
    setChangeVal(payload && Math.abs(payload[0].value) >= 0 ? payload[0].value + Number(base) : 0);
    return (
      <div style={{ marginTop: y > 120 ?  y - 120 + 'px' : y <= 120 && y != 0 ? y + 80 + 'px' : height - 150 + 'px'}}>
        <p className={styles.tooltipLabel}>Price at Expiry</p>
        <p className={styles.tooltipValue}>
          {`${
            payload && Math.abs(payload[0].value) >= 0
              ? payload[0].value >= 0
                ? getNumberFormat(Math.round(payload[0].value + Number(base)))
                : '-' + getNumberFormat(Math.round(payload[0].value + Number(base)))
              : 0
          }`}
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
