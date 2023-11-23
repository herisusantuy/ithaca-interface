// Packages
import { ReactNode } from 'react';

// Styles
import styles from './LabeledControl.module.scss';

// Types
type LabeledControlProps = {
  label: string;
  children: ReactNode;
};

const LabeledControl = ({ label, children }: LabeledControlProps) => {
  return (
    <div className={styles.container}>
      <label>{label}</label>
      {children}
    </div>
  );
};

export default LabeledControl;
