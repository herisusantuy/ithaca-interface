// Packages
import React, { ReactNode, useEffect, useRef, useState } from 'react';

// Components
import Dropdown from '@/UI/components/Icons/Dropdown';

// Constants
import { EXPIRY_DATE_OPTIONS } from '@/UI/constants/expiryDate';

// Hooks
import { useEscKey } from '@/UI/hooks/useEscKey';

// Styles
import styles from './LabelValue.module.scss';

// Types
type LabelValueProps = {
  label: string;
  value?: ReactNode;
  subValue?: string;
  hasDropdown?: boolean;
  defaultValue?: string;
  onChange?: (newValue: string) => void;
};

const LabelValue = ({
  label,
  value: initialValue,
  defaultValue = EXPIRY_DATE_OPTIONS[0].value,
  subValue,
  hasDropdown = false,
  onChange,
}: LabelValueProps) => {
  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [value, setValue] = useState(initialValue || defaultValue);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  useEscKey(() => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  });

  // Get label styles from dropdown prop
  const getDropdownStyle = (hasDropdown: boolean) => {
    return hasDropdown ? styles.labelDropdown : '';
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle option click
  const handleOptionClick = (optionValue: string) => {
    setValue(optionValue);
    setIsDropdownOpen(false);
    onChange && onChange(optionValue);
  };

  // Render Dropdown Menu
  const renderDropdownOptions = () => {
    return (
      <ul className={styles.dropdownMenu}>
        {EXPIRY_DATE_OPTIONS.map(option => (
          <li key={option.value} className={styles.dropdownItem} onClick={() => handleOptionClick(option.value)}>
            {option.label}
          </li>
        ))}
      </ul>
    );
  };
  return (
    <div className={`${styles.labelValue} ${getDropdownStyle(hasDropdown)}`} ref={containerRef}>
      <div className={styles.contentWrapper}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>
          {value}
          {subValue && <span className={styles.subValue}>{subValue}</span>}
        </span>
      </div>
      {hasDropdown && (
        <div onClick={toggleDropdown} className={`${styles.dropdown} ${isDropdownOpen ? styles.isActive : ''}`}>
          <Dropdown />
          {isDropdownOpen && renderDropdownOptions()}
        </div>
      )}
    </div>
  );
};

export default LabelValue;
