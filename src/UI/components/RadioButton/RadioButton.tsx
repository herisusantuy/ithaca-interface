// Packages
import { useState } from 'react';

// Styles
import styles from './RadioButton.module.scss';

// Types
type RadioButtonProps = {
  options: string[];
  name: string;
  defaultOption?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

const RadioButton = ({ options, name, defaultOption, disabled = false, onChange }: RadioButtonProps) => {
  // Radio button state
  const [selectedOption, setSelectedOption] = useState<string | undefined>(defaultOption);

  // Handle selected radio button option
  const handleRadioChange = (value: string) => {
    setSelectedOption(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={styles.radioButton}>
      {options.map((option, index) => (
        <div key={index} className={styles.option}>
          <input
            type='radio'
            id={option}
            name={name}
            value={option}
            disabled={disabled}
            checked={option === selectedOption}
            onChange={() => handleRadioChange(option)}
          />
          <label htmlFor={option} className={styles.label}>
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioButton;
