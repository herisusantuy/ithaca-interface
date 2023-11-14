// Packages
import { ReactNode } from 'react';

// Styles
import styles from './AnalyticsLayout.module.scss';

// Types
type AnalyticsLayoutProps = {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
};

const AnalyticsLayout = ({ leftPanel, rightPanel }: AnalyticsLayoutProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>{leftPanel}</div>
      <div className={styles.rightPanel}>{rightPanel}</div>
    </div>
  );
};

export default AnalyticsLayout;
