// Components
import LogoEth from '@/UI/components/Icons/LogoEth';

// Styles
import styles from './ChartTradingVolume.module.scss';

const ChartLegend = () => {
  return (
    <div className={styles.legend}>
      <div className={styles.dot} />
      <span>
        <LogoEth />
        WETH
      </span>
    </div>
  );
};

export default ChartLegend;
