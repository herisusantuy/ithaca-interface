// Packages
import { ReactNode, useState } from 'react';

// Styles
import styles from './RadioButton.module.scss';

type RadioButtonProps = {
  options: (string | ReactNode)[];
  valueProps?: string[];
  name: string;
  defaultOption?: string | ReactNode;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  onChange?: (value: string) => void;
};

const RadioButton = ({
  options,
  valueProps,
  name,
  defaultOption,
  disabled = false,
  orientation = 'horizontal',
  onChange,
}: RadioButtonProps) => {
  const [selectedOption, setSelectedOption] = useState<string | ReactNode | undefined>(defaultOption);

  const handleRadioChange = (value: string | ReactNode, logValue?: string) => {
    setSelectedOption(value);
    if (onChange) {
      onChange(logValue || (value as string));
    }
  };

  const renderOptions = (optionList: (string | ReactNode)[]) => {
    return optionList.map((option, index) => {
      const keyIdentifier = typeof option === 'string' ? option : `option-${index}`;
      const logValue = valueProps && valueProps[index];

      return (
        <div key={keyIdentifier} className={styles.option}>
          <input
            type='radio'
            id={keyIdentifier}
            name={name}
            value={keyIdentifier}
            disabled={disabled}
            checked={option === selectedOption}
            onChange={() => handleRadioChange(option, logValue)}
          />
          <label htmlFor={keyIdentifier} className={styles.label}>
            {typeof option === 'string' ? option : option}
          </label>
        </div>
      );
    });
  };

  return (
    <div className={styles.radioButton + (orientation === 'vertical' ? ` ${styles.vertical}` : '')}>
      {renderOptions(options)}
    </div>
  );
};

export default RadioButton;
