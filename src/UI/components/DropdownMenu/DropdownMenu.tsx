// Packages
import { useState } from 'react';

// Components
import Dropdown from '@/UI/components/Icons/Dropdown';

// Styles
import styles from '@/UI/components/DropdownMenu/DropdownMenu.module.scss';

type Option = {
  name: string;
  value: string;
};

type DropdownMenuProps = {
  label?: string;
  id?: string;
  onChange?: (value: string, selectedOption: Option) => void;
  disabled?: boolean;
  options: Option[];
  value?: string;
};

const DropdownMenu = ({ onChange, options, value, disabled, label, id }: DropdownMenuProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const setOpen = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const changeItem = (item: Option) => {
    setSelectedOption(item);
    setIsDropdownOpen(false);
    if (onChange) onChange(item.value, item);
  };

  return (
    <div className={styles.dropdownInput}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={`${styles.dropdownContainer} ${disabled ? styles.disabled : ''}`}>
        <div className={styles.dropdownInputBox}>
          <div className={styles.displayValue} onClick={setOpen}>
            {selectedOption?.name ?? ''}
          </div>
          <div className={`${styles.displayIcon} ${isDropdownOpen ? styles.toggleIcon : ''}`} onClick={setOpen}>
            <Dropdown />
          </div>
        </div>
        <ul className={`${styles.listContainer} ${!isDropdownOpen ? styles.hide : ''}`}>
          {options &&
            options.map((item: Option, idx: number) => {
              return (
                <li key={idx} onClick={() => changeItem(item)} className={item.value === value ? 'selected' : ''}>
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
