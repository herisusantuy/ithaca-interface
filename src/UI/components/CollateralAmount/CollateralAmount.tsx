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
  const amounts = [
    { amount: wethAmount, Logo: LogoEth, currency: 'WETH' },
    { amount: usdcAmount, Logo: LogoUsdc, currency: 'USDC' },
  ];

  return (
    <div className={styles.container}>
      {amounts.map(({ amount, Logo, currency }) => (
        <div key={currency} className={styles.amount}>
          <span>{amount}</span>
          <div className={styles.logo}>
            <Logo />
          </div>
          <span>{currency}</span>
        </div>
      ))}
    </div>
  );
};

export default CollateralAmount;
