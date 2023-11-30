// Components
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import ArrowRight from '@/UI/components/Icons/ArrowRight';
import ChevronLeft from '@/UI/components/Icons/ChevronLeft';
import ChevronRight from '@/UI/components/Icons/ChevronRight';
import Add from '@/UI/components/Icons/Add';

// Styles
import styles from './Instructions.module.scss';

const RiskyEarnInstructions = () => {
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
        <ArrowRight />
        Earn
        <LogoUsdc />
        Return.
      </p>
      <p>iii. - If at expiry <LogoEth /> <ChevronLeft /> Target Price, receive Risk equivalent worth of <LogoEth /> <Add />
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
