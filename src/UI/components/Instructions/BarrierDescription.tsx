// Components
import LogoEth from '@/UI/components/Icons/LogoEth';
import ChevronLeft from '@/UI/components/Icons/ChevronLeft';

// Styles
import styles from './Instructions.module.scss';

const BarrierDescription = () => {
  return (
    <div className={styles.description}>
      <p>
        BUY UP and IN Call if <LogoEth /> will end up at expiry UP from the strike price and NOT INside <ChevronLeft />
        the barrier, if not, premium lost.
      </p>
      <p>
        ( Sell and earn premium if <LogoEth /> at expiry ends up below that strike or above the strike but still below
        the barrier )
      </p>
    </div>
  );
};

export default BarrierDescription;
