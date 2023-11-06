// Styles
import React from 'react';
import styles from './ChartPayoff.module.scss';

// Types
type CustomTooltipProps = {
  base: number | string;
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
  setChangeVal: (state: number) => void;
};

const CustomTooltip = (props: CustomTooltipProps) => {
  const { base, active, payload, setChangeVal } = props;

  if (active) {
    setChangeVal(payload && Math.abs(payload[0].value) >= 0 ? payload[0].value + Number(base) : 0);
    return (
      <div>
        <p className={styles.tooltipLabel}>Price at Expiry</p>
        <p className={styles.tooltipValue}>
          {`${payload && Math.abs(payload[0].value) >= 0 ? payload[0].value + Number(base) : 0}`}
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
