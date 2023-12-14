// Components
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import ArrowRight from '@/UI/components/Icons/ArrowRight';
import ChevronLeft from '@/UI/components/Icons/ChevronLeft';
import ChevronRight from '@/UI/components/Icons/ChevronRight';
import Add from '@/UI/components/Icons/Add';

// Styles
import styles from './Instructions.module.scss';
import CurlyBracketLeft from '../Icons/CurlyBracketLeft';
import CurlyBracketRight from '../Icons/CurlyBracketRight';
import dayjs from 'dayjs';

const RiskyEarnInstructions = () => {
  const RISKY_EXPIRE_DATE = '20231120'; // TO-DO: Pass as props
  return (
    <div className={styles.container}>
      <p>
        i. Select <LogoEth /> Target Price.
      </p>
      <p>
        ii. Risk
        <span className={styles.spacer} />
        <span className={styles.stackedLogo}>
          <LogoEth />
          <LogoUsdc />
        </span>
        <span className={styles.spacer} />
        <em>Now</em>
        <ArrowRight />
        <CurlyBracketLeft />
        Risk
        <span className={styles.stackedLogo}>
          <LogoEth />
          <LogoUsdc />
        </span>
        + Return
        <LogoUsdc />
        <CurlyBracketRight />@{' '}
        <span className={`${styles.italic} hide-psuedo p-0`}>
          {dayjs(RISKY_EXPIRE_DATE, 'YYYYMMDD').format('DD MMM YY')}
        </span>
      </p>
      <p>
        iii. - If at expiry <LogoEth /> <ChevronLeft /> Target Price, receive Risk equivalent worth of <LogoEth />{' '}
        <Add />
        Return in <LogoUsdc /> .
      </p>
      <p className='pl-18'>
        - If at expiry <LogoEth /> <ChevronRight /> Target Price, receive Risk equivalent worth of <LogoUsdc /> <Add />
        Return in <LogoUsdc /> .
      </p>
    </div>
  );
};

export default RiskyEarnInstructions;
