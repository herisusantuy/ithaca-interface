// Packages
import { ReactNode } from 'react';

// Styles
import styles from './Panel.module.scss';

// Types
type PanelProps = {
  margin?: string;
  children: ReactNode;
};

const Panel = ({ children, margin = 'm-0' }: PanelProps) => {
  return <div className={`${styles.panel} ${margin && margin}`}>{children}</div>;
};

export default Panel;
