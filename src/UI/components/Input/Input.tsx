// Packages
import { ChangeEvent, ReactNode } from 'react';

// Utils
import { preventScrollOnNumberInput } from '@/UI/utils/Input';

// Types
type InputProps = {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  icon?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  type?: 'text' | 'number';
  id?: string;
};

// Styles
import styles from './Input.module.scss';

const Input = ({ onChange, value, icon, disabled, placeholder = '-', label, type = 'number', id }: InputProps) => {
  return (
    <div className={styles.input}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.container}>
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          inputMode={type === 'number' ? 'decimal' : undefined}
          onChange={onChange}
          onWheel={type === 'number' ? preventScrollOnNumberInput : undefined}
          disabled={disabled}
        />
        {icon && icon}
      </div>
    </div>
  );
};

export default Input;
