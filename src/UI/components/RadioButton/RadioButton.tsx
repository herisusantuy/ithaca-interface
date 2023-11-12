// Packages
import { ReactNode } from 'react';

// Styles
import styles from './RadioButton.module.scss';

type RadioButtonProps = {
  options: { option: string | ReactNode; value: string }[];
  selectedOption?: string;
  name: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  onChange?: (value: string) => void;
  width?: number;
};

const RadioButton = ({
  options,
  selectedOption,
  name,
  disabled = false,
  orientation = 'horizontal',
  onChange,
  width = 0,
}: RadioButtonProps) => {
  const renderOptions = (optionList: { option: string | ReactNode; value: string }[]) => {
    return optionList.map(option => {
      return (
        <div key={`${name}${option.value}`} className={styles.option}>
          <input
            type='radio'
            id={`${name}${option.value}`}
            name={name}
            value={option.value}
            disabled={disabled}
            checked={option.value === selectedOption}
            onChange={() => onChange?.(option.value)}
          />
          <label htmlFor={`${name}${option.value}`} className={styles.label}>
            {option.option}
          </label>
        </div>
      );
    });
  };

  return (
    <div className={styles.radioButton + (orientation === 'vertical' ? ` ${styles.vertical}` : '')} style={width > 0 ? { width: width + 'px' } : {}}>
      {renderOptions(options)}
    </div>
  );
};

export default RadioButton;
