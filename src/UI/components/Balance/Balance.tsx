// Styles
import styles from './Balance.module.scss';

// Types
type BalanceProps = {
  fundLock: number;
  balance: string;
  margin?: string;
};

const Balance = ({ fundLock, balance, margin = 'm-0' }: BalanceProps) => {
  return (
    <div className={`${styles.balance} ${margin && margin}`}>
      <div>Fund Lock: {fundLock}</div>
      <div>Balance: {balance}</div>
    </div>
  );
};

export default Balance;
