// Packages
import { ReactNode } from 'react';

// Components
import Panel from '@/UI/layouts/Panel/Panel';

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
      <Panel margin='p-20 width-50 box-shadow-panel'>{rightPanel}</Panel>
    </div>
  );
};

export default Sidebar;
