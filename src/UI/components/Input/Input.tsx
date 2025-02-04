// Packages
import { ChangeEvent, ReactElement, ReactNode, useEffect, useRef, useState } from 'react';

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
  footerText?: string;
  errorMessage?: string;
  className?: string;
  containerClassName?: string;
  onLink?: (linked: boolean) => void;
  increment?: (direction: 'UP' | 'DOWN') => void;
  isLinked?: boolean;
  canLink?: boolean;
  hasDropdown?: boolean;
  dropDownOptions?: DropDownOption[];
  onDropdownChange?: (option: string) => void
};

type DropDownOption = {
  value: string,
  label: string,
  icon: ReactElement
}

// Styles
import styles from './Input.module.scss';
import Link from '../Icons/Link';
import Button from '../Button/Button';
import UnLink from '../Icons/UnLink';
import ChevronUp from '../Icons/ChevronUp';
import ChevronDown from '../Icons/ChevronDown';
import Flex from '@/UI/layouts/Flex/Flex';
import DropdownOutlined from '../Icons/DropdownOutlined';
import { useEscKey } from '@/UI/hooks/useEscKey';

const Input = ({
  increment,
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
  onLink,
  footerText,
  hasDropdown,
  dropDownOptions,
  onDropdownChange
}: InputProps) => {
  const inputClass = hasError ? `${styles.input} ${styles.error}` : styles.input;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
  // Render Dropdown Menu
  const renderDropdownOptions = () => {
    return (
      <ul className={styles.dropdownMenu}>
        {dropDownOptions && dropDownOptions.map(option => (
          <li
            key={option.value}
            className={`${styles.dropdownItem} ${value === option.value ? styles.selected : ''}`}
            onClick={() => handleOptionClick(option.value)}
          >{option.icon} {option.label}</li>

        ))}
      </ul>
    );
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle option click
  const handleOptionClick = (optionValue: string) => {
    setIsDropdownOpen(false);
    onDropdownChange && onDropdownChange(optionValue);
  };
  return (
    <div className={`${inputClass} ${className || ''}`}
      style={width > 0 ? { width: width + 'px' } : {}}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={`${styles.container} ${containerClassName || ''}`}
        style={width > 0 ? { width: width + 'px' } : {}}>
        {canLink && <Button title='Click to link' variant='icon' size='sm' onClick={() => {
          onLink && onLink(!isLinked);
        }}>
          {isLinked ? <Link /> : <UnLink />}
        </Button>}
        <Flex direction='column'>
          <Flex direction='row-center'>
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
            {icon && <div className='mt-2'>{icon}</div>}
            {hasDropdown && (
              <div onClick={toggleDropdown} className={`${styles.dropdown} ${isDropdownOpen ? styles.isActive : ''}`}>
                <div className='mmt-2'>
                  <DropdownOutlined />
                </div>
                {isDropdownOpen && renderDropdownOptions()}
              </div>
            )}
          </Flex>
          {footerText && <div className={styles.footer}>{footerText}</div>}
        </Flex>
        {increment &&
          <div className={styles.incrementWrapper}>
            <Flex direction='column'>
              <div className={styles.incrementButton}>
                <Button
                  title='up'
                  onClick={() => increment && increment('UP')}
                  variant='icon'>
                  <ChevronUp />
                </Button>
              </div>
              <div className={styles.incrementButton}>
                <Button
                  title='up'
                  onClick={() => increment && increment('DOWN')}
                  variant='icon'>
                  <ChevronDown />
                </Button>
              </div>
            </Flex>
          </div>
        }
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
