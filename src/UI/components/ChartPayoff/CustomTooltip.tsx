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
};

const CustomTooltip = (props: CustomTooltipProps) => {
  const { base, active, payload, setChangeVal, x, y } = props;

  if (active) {
    setChangeVal(payload && Math.abs(payload[0].value) >= 0 ? payload[0].value + Number(base) : 0);
    return (
      <div style={{ marginTop: y < 100 ? y + 120 + 'px' : y - 140 + 'px' }}>
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
