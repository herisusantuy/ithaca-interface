// Styles
import styles from './ChartPayoff.module.scss';

// Types
type CustomTooltipProps = {
  base: number | string;
  active?: boolean;
  payload?: Array<{ name: string; value: number }> | undefined;
  label?: string;
};

const CustomTooltip = (props: CustomTooltipProps) => {
  const { base, active, payload } = props;
  if (active) {
    // 'payload' contains the data for the active point
    return (
      <div>
        <p className={styles.tooltipLabel}>Price at Expiry</p>
        <p className={styles.tooltipValue}>{`${
          payload && Math.abs(payload[0].value) >= 0 ? payload[0].value + Number(base) : 0
        }`}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
