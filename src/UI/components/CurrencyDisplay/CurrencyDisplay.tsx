// Packages
import { ReactNode } from 'react';

// Styles
import styles from './CurrencyDisplay.module.scss';

// Types
type CurrencyDisplayProps = {
  amount: number;
  symbol: ReactNode;
  currency: string;
};

const CurrencyDisplay = ({ amount, symbol, currency }: CurrencyDisplayProps) => {
  return (
    <div className={styles.container}>
      {amount} {symbol} <span>{currency}</span>
    </div>
  );
};

export default CurrencyDisplay;
