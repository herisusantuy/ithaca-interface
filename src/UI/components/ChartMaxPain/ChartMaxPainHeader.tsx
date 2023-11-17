import DropdownMenu, { DropDownOption } from '../DropdownMenu/DropdownMenu';

// import constants
import { DROPDOWN_DATE_OPTIONS } from '@/UI/constants/dropdown';

// Import styles
import styles from './ChartMaxPain.module.scss';
import LogoEth from '../Icons/LogoEth';
import { useState } from 'react';

const ChartMaxPainHeader = () => {
  const [option, setOption] = useState(DROPDOWN_DATE_OPTIONS[0]['value']);
  const [selectedOption, setSlectedOption] = useState<DropDownOption>(DROPDOWN_DATE_OPTIONS[0]);

  const selectOption = (value: string, selectedOption: DropDownOption) => {
    setOption(value);
    setSlectedOption(selectedOption);
  };

  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.headerExpiryContainer}>
          <p>Expiry Date</p>
          <DropdownMenu
            options={DROPDOWN_DATE_OPTIONS}
            onChange={(value, selectedOption) => {
              selectOption(value, selectedOption);
            }}
            value={selectedOption}
          />
        </div>
        <div className={styles.headerContent}>
          <p>The Max Pain for</p>
          <LogoEth /> <h3>WETH</h3> <p>options expiring on</p> <h3>{option}</h3> <p>is</p> <h3>1600</h3> <LogoEth />
          <p>WETH</p>
        </div>
      </div>
    </>
  );
};

export default ChartMaxPainHeader;
