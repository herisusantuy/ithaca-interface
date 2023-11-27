// Packages
import { ReactNode } from 'react';

// Styles
import styles from './Sidebar.module.scss';

// Types
type SidebarProps = {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  orderSummary: ReactNode;
};

const Sidebar = ({ leftPanel, rightPanel, orderSummary }: SidebarProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        {leftPanel}
        <div className={styles.orderSummary}>{orderSummary}</div>
      </div>
      <div className={styles.rightPanel}>{rightPanel}</div>
    </div>
  );
};

export default Sidebar;
