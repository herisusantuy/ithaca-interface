// Packages
import { ReactNode } from 'react';

// Styles
import styles from './PriceLabel.module.scss';

// Types
type PriceLabelProps = {
  label: number | string;
  icon: ReactNode;
};

const PriceLabel = ({ label, icon }: PriceLabelProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.label}>{label}</div>
      {icon}
    </div>
  );
};

export default PriceLabel;
