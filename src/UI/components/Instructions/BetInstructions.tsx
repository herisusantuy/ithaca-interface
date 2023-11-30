// Components
import LogoEth from '@/UI/components/Icons/LogoEth';

// Styles
import styles from './Instructions.module.scss';

type BetInstructionType = {
  type?: string;
};

const BetInstructions = ({ type = 'INSIDE' }: BetInstructionType) => {
  return (
    <div className={styles.container}>
      <p>
        Bet & Earn Return if <LogoEth /> at Expiry
        <span className='flex-column-center'>
          <span className={type == 'INSIDE' ? ' hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Inisde
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
            Inisde
          </span>
          <span className={type == 'OUTSIDE' ? 'hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Outside
          </span>
        </span>
        Range; Capital at Risk.
      </p>
      <p>ii. Select Range. </p>
      <p>iii. Enter Target Earn.</p>
      <p>
        iv. Expected Return reflects the probability of at Expiry{' '}
        <span className='flex-column-center'>
          <span className={type == 'INSIDE' ? ' hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Inisde
          </span>
          <span className={type == 'OUTSIDE' ? 'hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Outside
          </span>
        </span>
        Range.
      </p>
    </div>
  );
};

export default BetInstructions;
