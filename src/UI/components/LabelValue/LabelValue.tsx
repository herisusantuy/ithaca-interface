// Packages
import React, { ReactNode } from 'react';

// Components
import Dropdown from '@/UI/components/Icons/Dropdown';

// Styles
import styles from './LabelValue.module.scss';

// Types
type LabelValueProps = {
  label: string;
  value: ReactNode;
  subValue?: string;
  hasDropdown?: boolean;
};

const LabelValue = ({ label, value, subValue, hasDropdown = false }: LabelValueProps) => {
  // Get label styles from dropdown prop
  const getDropdownStyle = (hasDropdown: boolean) => {
    return hasDropdown ? styles.labelDropdown : '';
  };

  return (
    <div className={`${styles.labelValue} ${getDropdownStyle(hasDropdown)}`}>
      <div className={styles.contentWrapper}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>
          {value}
          {subValue && <span className={styles.subValue}>{subValue}</span>}
        </span>
      </div>
      {hasDropdown && <Dropdown />}
    </div>
  );
};

export default LabelValue;
