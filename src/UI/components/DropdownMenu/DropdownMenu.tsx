// Packages
import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

// Components
import Dropdown from '@/UI/components/Icons/Dropdown';

// Hooks
import { useEscKey } from '@/UI/hooks/useEscKey';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';

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
  value?: DropDownOption;
  width?: number;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  className?: string;
  type?: string;
};

const DropdownMenu = ({
  onChange,
  options,
  disabled,
  label,
  width = 0,
  id,
  value,
  iconStart,
  iconEnd,
  className,
  type,
}: DropdownMenuProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<DropDownOption | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const [optionsPostion, setOptionsPosition] = useState({ width: 0, top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    setSelectedOption(value || null);
    setMounted(true);
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [value]);

  useEscKey(() => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  });

  const handleDropdownClick = () => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    setOptionsPosition({
      width: containerRect?.width ?? 100,
      left: containerRect?.x ?? 0,
      top: (containerRect?.y ?? 0) + (containerRect?.height ?? 0) + document.documentElement.scrollTop + 1,
    });
    if (!disabled) setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (item: DropDownOption) => {
    setSelectedOption(item);
    if (onChange) onChange(item.value, item);
  };

  return (
    <div className={`${styles.container} ${className || ''} ${type ? styles[type] : ''}`} ref={containerRef}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div
        style={width > 0 ? { minWidth: width + 'px' } : {}}
        className={`${styles.dropdownContainer} ${disabled ? styles.disabled : ''}`}
        onClick={handleDropdownClick}
        role='button'
      >
        <div className={`${styles.input} ${isDropdownOpen ? styles.clickedDropdown : ''}`}>
          <Flex direction='dropdown' gap='gap-4'>
            {iconStart && iconStart}
            <span>{selectedOption?.name ?? <span className={styles.placeholder}>-</span>}</span>
          </Flex>
          <div className={styles.iconEnd}>
              {iconEnd && iconEnd}
            <div className={`${styles.icon} ${isDropdownOpen ? styles.isActive : ''}`}>
              <Dropdown />
            </div>
          </div>
        </div>
        {mounted &&
          document.querySelector<HTMLElement>('#portal') &&
          createPortal(
            <div ref={optionsRef}>
              <ul
                className={`${styles.options} ${!isDropdownOpen ? styles.isHidden : ''}`}
                style={{
                  width: `${optionsPostion.width}px`,
                  left: `${optionsPostion.left}px`,
                  top: `${optionsPostion.top}px`,
                }}
              >
                {options &&
                  options.map((item: DropDownOption, idx: number) => {
                    return (
                      <li
                        key={idx}
                        onClick={() => handleOptionClick(item)}
                        className={`${selectedOption?.value == item.value ? styles.selected : ''}`}
                      >
                        {item.name}
                      </li>
                    );
                  })}
              </ul>
            </div>,
            document.querySelector<HTMLElement>('#portal') as HTMLElement
          )}
      </div>
    </div>
  );
};

export default DropdownMenu;
