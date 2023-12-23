// Packages
import { ReactNode } from 'react';

// Styles
import styles from './LabeledControl.module.scss';

// Types
type LabeledControlProps = {
  label: string | ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  labelClassName?: string;
};

const LabeledControl = ({ label, icon, children, labelClassName }: LabeledControlProps) => {
  const labelClass = `${labelClassName || ''}`.trim();

  return (
    <div className={styles.container}>
      <label className={labelClass}>
        {icon && icon} {label}
      </label>
      {children}
    </div>
  );
};

export default LabeledControl;
