// Packages
import { ReactNode } from 'react';

// Styles
import styles from './LabeledInput.module.scss';

// Types
type LabeledInputProps = {
  label: string;
  children: ReactNode;
  lowerLabel: ReactNode;
  labelClassName?: string;
};

const LabeledInput = ({ label, children, lowerLabel, labelClassName }: LabeledInputProps) => {
  const labelClass = `${labelClassName || ''}`.trim();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <p>{label}</p>
        {children}
      </div>
      <p className={labelClass}>{lowerLabel}</p>
    </div>
  );
};

export default LabeledInput;
