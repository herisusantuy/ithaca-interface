import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import styles from './CheckBox.module.scss';

type CheckBoxType = {
  label: string;
  component?: ReactElement | null;
  checked?: boolean;
  clearCheckMark?: boolean;
  onChange?: (label: string, status: boolean) => void;
};

const CheckBox = (props: CheckBoxType) => {
  const { component, label, checked = false, clearCheckMark, onChange } = props;
  const [status, setStatus] = useState<boolean>(checked);

  const updateState = (e: ChangeEvent<HTMLInputElement>) => {
    setStatus(e.currentTarget.checked);
    if (onChange) {
      onChange(label, e.currentTarget.checked);
    }
  };

  useEffect(() => {
    if (clearCheckMark) {
      setStatus(false);
    }
  }, [clearCheckMark]);

  return (
    <label className={styles.container}>
      <div className={styles.componentFlex}>
        {component} <p>{label}</p>
      </div>
      <input type='checkbox' onChange={e => updateState(e)} checked={status} />
      <span className={styles.checkmark}></span>
    </label>
  );
};

export default CheckBox;
