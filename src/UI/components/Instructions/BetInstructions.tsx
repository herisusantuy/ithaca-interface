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
        <span>
          <p>{type == 'INSIDE' ? 'Inside' : 'Outside'}</p>
        </span>
        Range.
      </p>
      <p>
        i. Bet on
        <span>
          <p>{type == 'INSIDE' ? 'Inside' : 'Outside'}</p>
        </span>
        Range; Capital at Risk.
      </p>
      <p>ii. Select Range. </p>
      <p>iii. Enter Target Earn.</p>
      <p>
        iv. Expected Return reflects the probability of at Expiry{' '}
        <span>
          <p>{type == 'INSIDE' ? 'Inside' : 'Outside'}</p>
        </span>
        Range.
      </p>
    </div>
  );
};

export default BetInstructions;
