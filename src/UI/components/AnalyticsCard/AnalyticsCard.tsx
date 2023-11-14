// Packages
import { ReactNode } from 'react';

// Styles
import styles from './AnalyticsCard.module.scss';

// Types
export type AnalyticsCardProps = {
  title: string;
  volume: string;
  change: string;
  currency?: string;
  currencySymbol: ReactNode;
  isChangePositive: boolean;
};

const AnalyticsCard = ({ title, volume, change, currency, currencySymbol, isChangePositive }: AnalyticsCardProps) => {
  const changeStyle = isChangePositive ? styles.positive : styles.negative;

  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.data}>
        {volume}{' '}
        {currency && (
          <span className={styles.currency}>
            {currencySymbol} {currency}
          </span>
        )}
      </div>
      <div className={styles.change}>
        <span className={changeStyle}>{change}</span>
        {currency && (
          <span className={styles.currency}>
            {currencySymbol} {currency}
          </span>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCard;
