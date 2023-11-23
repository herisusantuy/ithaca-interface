// Packages
import { ReactNode } from 'react';

// Styles
import styles from './LabeledControl.module.scss';

// Types
type LabeledControlProps = {
  label: string;
  children: ReactNode;
  labelClassName?: string;
};

const LabeledControl = ({ label, children, labelClassName }: LabeledControlProps) => {
  const labelClass = `${labelClassName || ''}`.trim();

  return (
    <div className={styles.container}>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
};

export default LabeledControl;
