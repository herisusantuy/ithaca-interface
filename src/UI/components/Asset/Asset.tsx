// Packages
import { ReactNode } from 'react';

// Styles
import styles from './Asset.module.scss';

// Types
type AssetProps = {
  icon: ReactNode;
  label: string;
};

const Asset = ({ icon, label }: AssetProps) => {
  return (
    <div className={styles.asset}>
      {icon}
      <p className={styles.label}>{label}</p>
    </div>
  );
};

export default Asset;
