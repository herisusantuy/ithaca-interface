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
  width?: number;
  type?: 'text' | 'number';
  id?: string;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
  containerClassName?: string;
  onLink?: (linked: boolean) => void;
  isLinked?: boolean;
  canLink?: boolean;
};

// Styles
import styles from './Input.module.scss';
import Link from '../Icons/Link';
import Button from '../Button/Button';
import UnLink from '../Icons/UnLink';

const Input = ({
  onChange,
  value,
  icon,
  disabled,
  placeholder = '-',
  label,
  width = 0,
  type = 'number',
  id,
  hasError = false,
  errorMessage,
  className,
  containerClassName,
  isLinked,
  canLink,
  onLink
}: InputProps) => {
  const inputClass = hasError ? `${styles.input} ${styles.error}` : styles.input;
  return (
    <div className={`${inputClass} ${className || ''}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={`${styles.container} ${containerClassName || ''}`}
        style={width > 0 ? { width: width + 'px' } : {}}>
        {canLink && <Button title='Click to link' variant='icon' size='sm' onClick={()=> {
          onLink && onLink(!isLinked);
        }}>
          {isLinked ? <Link /> : <UnLink/>}
        </Button>}
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
