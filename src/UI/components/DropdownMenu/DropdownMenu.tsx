// Packages
import { useState, useRef, useEffect, ReactNode } from 'react';

// Components
import Dropdown from '@/UI/components/Icons/Dropdown';

// Hooks
import { useEscKey } from '@/UI/hooks/useEscKey';

// Styles
import styles from '@/UI/components/DropdownMenu/DropdownMenu.module.scss';

// Types
export type DropDownOption = {
  name: string;
  value: string;
};

type DropdownMenuProps = {
  label?: string;
  id?: string;
  onChange?: (value: string, selectedOption: DropDownOption) => void;
  disabled?: boolean;
  options: DropDownOption[];
  value?: string;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
};

const DropdownMenu = ({ onChange, options, disabled, label, id, iconStart, iconEnd }: DropdownMenuProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<DropDownOption | null>(null);

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

  const handleDropdownClick = () => {
    if (!disabled) setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (item: DropDownOption) => {
    setSelectedOption(item);
    setIsDropdownOpen(false);
    if (onChange) onChange(item.value, item);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div
        className={`${styles.dropdownContainer} ${disabled ? styles.disabled : ''}`}
        onClick={handleDropdownClick}
        role='button'
      >
        <div className={styles.input}>
          {iconStart && iconStart}
          <span>{selectedOption?.name ?? <span className={styles.placeholder}>-</span>}</span>
          <div className={`${styles.icon} ${isDropdownOpen ? styles.isActive : ''}`}>
            <Dropdown />
          </div>
          {iconEnd && iconEnd}
        </div>
        <ul className={`${styles.options} ${!isDropdownOpen ? styles.isHidden : ''}`}>
          {options &&
            options.map((item: DropDownOption, idx: number) => {
              return (
                <li key={idx} onClick={() => handleOptionClick(item)}>
                  {item.name}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default DropdownMenu;
