// Components
import LogoEth from '@/UI/components/Icons/LogoEth';

// Styles
import styles from './Instructions.module.scss';

const BonusTwinWinInstructions = () => {
  return (
    <div className={styles.container}>
      <p>
        i. Select <LogoEth /> Price Reference.
      </p>
      <p>
        ii. Select desired <LogoEth /> Downside Protection Level.
      </p>
      <p>iii. Protection extinguished at Knock Out Barrier.</p>
    </div>
  );
};

export default BonusTwinWinInstructions;
