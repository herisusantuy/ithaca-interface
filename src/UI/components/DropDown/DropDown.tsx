import React, { useState } from 'react';

import Dropdown from '../Icons/Dropdown';
import { DropDownProps, DROPDOWN_CONST_DATA } from '@/UI/constants/dropdown';

import styles from '@/UI/components/DropDown/DropDown.module.scss';

const DropDown = () => {
  const [isListOpen, setIsListOpen] = useState(false);
  const [text, setText] = useState('');
  const [value, setValue] = useState<string>('');

  const setOpen = () => {
    setIsListOpen(!isListOpen);
  };

  const changeItem = (item: DropDownProps) => {
    setText(item.name);
    setValue(item.value.toString());
    setIsListOpen(false);
  };
  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.dropdownInputBox}>
        <div className={styles.displayValue}>{text}</div>
        <div className={`${styles.displayIcon} ${isListOpen ? styles.toggleIcon : ''}`} onClick={setOpen}>
          <Dropdown />
        </div>
      </div>
      <ul className={`${styles.listContainer} ${!isListOpen ? styles.hide : ''}`}>
        {DROPDOWN_CONST_DATA.map((item: DropDownProps, idx: number) => {
          return (
            <li key={idx} onClick={() => changeItem(item)}>
              {item.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DropDown;
