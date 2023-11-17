import DropdownMenu from '../DropdownMenu/DropdownMenu';

// import constants
import { DROPDOWN_DATE_OPTIONS } from '@/UI/constants/dropdown';

// Import styles
import styles from './ChartMaxPain.module.scss';
import LogoEth from '../Icons/LogoEth';

const ChartMaxPainHeader = () => {
  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.headerExpiryContainer}>
          <p>Expiry Date</p>
          <DropdownMenu options={DROPDOWN_DATE_OPTIONS} onChange={() => {}} />
        </div>
        <div className={styles.headerContent}>
          <p>The Max Pain for</p>
          <LogoEth /> <h3>WETH</h3> <p>options expiring on</p> <h3>10Nov23</h3> <p>is</p> <h3>1600</h3> <LogoEth />
          <p>WETH</p>
        </div>
      </div>
    </>
  );
};

export default ChartMaxPainHeader;
