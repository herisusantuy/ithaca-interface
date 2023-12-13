// Components
import LogoEth from '@/UI/components/Icons/LogoEth';
import dayjs from 'dayjs';

// Styles
import styles from './Instructions.module.scss';

type BetInstructionType = {
  type?: string;
  currentExpiryDate: string;
};

const BetInstructions = ({ type = 'INSIDE', currentExpiryDate }: BetInstructionType) => {
  return (
    <div className={styles.container}>
      <p>
        Bet & Earn Return if <LogoEth /> @<span className={`${styles.italic}  hide-psuedo p-0`}>{dayjs(currentExpiryDate).format('DD MMM YY')}</span>
        <span className='flex-column-center'>
          <span className={type == 'INSIDE' ? ' hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Inside
          </span>
          <span className={type == 'OUTSIDE' ? 'hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Outside
          </span>
        </span>
        Range.
      </p>
      <p>
        i. Bet on
        <span className='flex-column-center'>
          <span className={type == 'INSIDE' ? ' hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Inside
          </span>
          <span className={type == 'OUTSIDE' ? 'hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Outside
          </span>
        </span>
        Range; Capital at Risk.
      </p>
      <p className='pb-2'>ii. Select Range. </p>
      <p>iii. Enter Target Earn.</p>
      <p>
        iv. Expected Return reflects the probability of{' '}
        <span className='flex-column-center'>
          <span className={type == 'INSIDE' ? ' hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Inside
          </span>
          <span className={type == 'OUTSIDE' ? 'hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Outside
          </span>
        </span>
        Range @<span className={`${styles.italic}  hide-psuedo p-0`}>{dayjs(currentExpiryDate).format('DD MMM YY')}</span>.
      </p>
    </div>
  );
};

export default BetInstructions;
