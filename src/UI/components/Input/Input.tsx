// Packages
import { ChangeEvent, ReactNode } from 'react';

// Utils
import { preventScrollOnNumberInput } from '@/UI/utils/Input';

// Types
type InputProps = {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: number;
  icon?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
};

// Styles
import styles from './Input.module.scss';

const Input = ({ onChange, value, icon, disabled, placeholder = '0' }: InputProps) => {
  return (
    <div className={styles.input}>
      <input
        type='number'
        value={value}
        placeholder={placeholder}
        inputMode='decimal'
        onChange={onChange}
        onWheel={preventScrollOnNumberInput}
        disabled={disabled}
      />
      {icon && icon}
    </div>
  );
};

export default Input;
