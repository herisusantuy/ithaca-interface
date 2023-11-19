// Packages
import { ChangeEvent, ReactNode } from 'react';

// Utils
import { preventScrollOnNumberInput } from '@/UI/utils/Input';

// Components
import Error from '@/UI/components/Icons/Error';

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
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
  containerClassName?: string;
};

// Styles
import styles from './Input.module.scss';

const Input = ({
  onChange,
  value,
  icon,
  disabled,
  placeholder = '-',
  label,
  type = 'number',
  id,
  hasError = false,
  errorMessage,
  className,
  containerClassName,
}: InputProps) => {
  const inputClass = hasError ? `${styles.input} ${styles.error}` : styles.input;

  return (
    <div className={`${inputClass} ${className || ''}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={`${styles.container} ${containerClassName || ''}`}>
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
      {hasError && errorMessage && (
        <div className={styles.errorMessage}>
          <Error />
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default Input;
