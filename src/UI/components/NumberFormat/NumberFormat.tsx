import { NUMBER_DUMMY_DATA } from '@/UI/constants/number';
import styles from './NumberFormat.module.scss';
import { getNumberFormat } from '@/UI/utils/Numbers';

const NumberFormat = () => {
  return (
    <>
      <h3 className='mb-14'>Number Formats</h3>
      <div className={styles.container}>
        <div className={styles.subContainer}>
          <h5>Number Format-USDC</h5>
          {NUMBER_DUMMY_DATA.map((num: string, idx: number) => (
            <p key={idx}>{getNumberFormat(num)}</p>
          ))}
        </div>
        <div className={styles.subContainer}>
          <h5>Number Format-ETH</h5>
          {NUMBER_DUMMY_DATA.map((num: string, idx: number) => (
            <p key={idx}>{getNumberFormat(num, 'double')}</p>
          ))}
        </div>
        <div className={styles.subContainer}>
          <h5>Number Format-(USDC/ETH)</h5>
          {NUMBER_DUMMY_DATA.map((num: string, idx: number) => (
            <p key={idx}>{getNumberFormat(num, 'double')}</p>
          ))}
        </div>
      </div>
    </>
  );
};

export default NumberFormat;
