// Components
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';

// Styles
import styles from './CollateralAmount.module.scss';

// Types
type CollateralAmountProps = {
  wethAmount: number;
  usdcAmount: number;
};

const CollateralAmount = ({ wethAmount, usdcAmount }: CollateralAmountProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.amount}>
        <span>{wethAmount}</span>
        <span>
          <LogoEth />
        </span>
        <span>WETH</span>
      </div>
      <div className={styles.amount}>
        <span>{usdcAmount}</span>
        <span>
          <LogoUsdc />
        </span>
        <span>USDC</span>
      </div>
    </div>
  );
};

export default CollateralAmount;
