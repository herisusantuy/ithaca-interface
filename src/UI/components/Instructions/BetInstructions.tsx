import { useMemo } from 'react';
// Components
import LogoEth from '@/UI/components/Icons/LogoEth';
import dayjs from 'dayjs';

// Styles
import styles from './Instructions.module.scss';
import InsideOutside from './InsideOutside';

type BetInstructionType = {
  type?: 'INSIDE' | 'OUTSIDE';
  currentExpiryDate: string;
};

const BetInstructions = ({ type = 'INSIDE', currentExpiryDate }: BetInstructionType) => {
  const renderCurrentExpiryDate = useMemo(() => {
    return (
      <>
        @
        <span className={`${styles.italic}  hide-psuedo p-0`}>
          {dayjs(currentExpiryDate).format('DD MMM YY')}
        </span>
      </>
    )
  }, [currentExpiryDate])

  return (
    <div className={styles.container}>
      <p>
        Bet & Earn Return if
        <LogoEth />
        {renderCurrentExpiryDate}
        <InsideOutside type={type} />
        Range.
      </p>
      <p>
        i. Bet Capital at Risk;
        <LogoEth />
        {renderCurrentExpiryDate}
        <InsideOutside type={type} />
        Range?
      </p>
      <p className="mb-4">ii. Select Range. </p>
      <p>iii. Enter Target Earn.</p>
      <p>
        iv. Expected Return reflects the probability of
        <LogoEth />
        <InsideOutside type={type} />
        Range {renderCurrentExpiryDate}.
      </p>
    </div>
  );
};

export default BetInstructions;
