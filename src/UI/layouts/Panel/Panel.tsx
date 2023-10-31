// Packages
import { ReactNode } from 'react';

// Styles
import styles from './Panel.module.scss';

// Types
type PanelProps = {
  children: ReactNode;
};

const Panel = ({ children }: PanelProps) => {
  return <div className={styles.panel}>{children}</div>;
};

export default Panel;
