import React, { useState } from 'react';
import DropdownArrowIcon from '../Icons/Dropdown';
import styles from '@/UI/components/DropDown/DropDown.module.scss';

type Option = {
  name: string;
  value: string;
};
type DropDownProps = {
  label?: string;
  id?: string;
  onChange?: (value: string, selectedOption: Option) => void;
  disabled?: boolean;
  options: Option[];
  value: string;
};
const DropDown = (props: DropDownProps) => {
  const { onChange, options, value, disabled, label, id } = props;
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const setOpen = () => {
    setIsListOpen(!isListOpen);
  };
  const changeItem = (item: Option) => {
    setSelectedOption(item);
    setIsListOpen(false);
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
          <div className={`${styles.displayIcon} ${isListOpen ? styles.toggleIcon : ''}`} onClick={setOpen}>
            <DropdownArrowIcon />
          </div>
        </div>
        <ul className={`${styles.listContainer} ${!isListOpen ? styles.hide : ''}`}>
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

export default DropDown;
