import React from 'react';
import styles from './ChartPayoff.module.scss';

interface CustomTooltipProps {
  base: number | string;
  active?: boolean;
  payload?: Array<{ name: string; value: number }> | undefined;
  label?: string;
  coordinate?: object;
}

const CustomTooltip: React.FC<CustomTooltipProps> = (props: CustomTooltipProps) => {
  const { base, active, payload, label } = props;

  if (active) {
    // 'payload' contains the data for the active point
    return (
      <>
        <div>
          <p className={styles.tooltipLabel}>price at Expiry</p>
          <p className={styles.tooltipValue}>{`${
            payload && Math.abs(payload[0].value) >= 0 ? payload[0].value + Number(base) : 0
          }`}</p>
        </div>
      </>
    );
  }

  return null;
};

export default CustomTooltip;
