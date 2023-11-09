// Packages
import { ReactNode } from 'react';

// Styles
import styles from './Asset.module.scss';

// Types
type AssetProps = {
  icon: ReactNode;
  label: string;
  size?: string;
};

const Asset = ({ icon, label, size }: AssetProps) => {
  const sizeClass = size ? styles[size] : '';

  return (
    <div className={`${styles.asset} ${sizeClass}`.trim()}>
      {icon}
      <p className={styles.label}>{label}</p>
    </div>
  );
};

export default Asset;
