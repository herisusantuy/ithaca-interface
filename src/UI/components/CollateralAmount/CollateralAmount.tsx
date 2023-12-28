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

type SingleCurrencyAmountProps = {
  amount: number;
  symbol: JSX.Element;
  currency: string;
}

export const SingleCurrencyAmount = ({amount, symbol, currency}: SingleCurrencyAmountProps) => {
  return (
    <div className={styles.container}>  
      <span className={styles.amount}>{amount}</span>
      <div>{symbol}</div>
      <span className={styles.currency}>{currency}</span>
    </div>
  )
}
const CollateralAmount = ({ wethAmount, usdcAmount }: CollateralAmountProps) => {
  const amounts = [
    { amount: wethAmount, Logo: LogoEth, currency: 'WETH' },
    { amount: usdcAmount, Logo: LogoUsdc, currency: 'USDC' },
  ];

  return (
    <div className={styles.container}>
      {amounts.map(({ amount, Logo, currency }) => (
        <>
          <span className={styles.amount}>{amount}</span>
          <div>
            <Logo />
          </div>
          <span className={styles.currency}>{currency}</span>
        </>
      ))}
    </div>
  );
};

export default CollateralAmount;
