import { useMemo } from 'react';
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
        Bet & Earn Return if <LogoEth />
        {renderCurrentExpiryDate}
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
        i. Bet Capital at Risk; <LogoEth />
        {renderCurrentExpiryDate}
        <span className='flex-column-center'>
          <span className={type == 'INSIDE' ? ' hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Inside
          </span>
          <span className={type == 'OUTSIDE' ? 'hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Outside
          </span>
        </span>
        Range?
      </p>
      <p className={styles.listParagraphStyle}>ii. Select Range. </p>
      <p>iii. Enter Target Earn.</p>
      <p>
        iv. Expected Return reflects the probability of <LogoEth />
        <span className='flex-column-center'>
          <span className={type == 'INSIDE' ? ' hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Inside
          </span>
          <span className={type == 'OUTSIDE' ? 'hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Outside
          </span>
        </span>
        Range {renderCurrentExpiryDate}.
      </p>
    </div>
  );
};

export default BetInstructions;
