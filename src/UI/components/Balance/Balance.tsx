import { useMemo } from 'react';
import { TABLE_COLLATERAL_SUMMARY } from '@/UI/constants/tableCollateral';
import styles from './Balance.module.scss';
import { formatNumberByCurrency } from '@/UI/utils/Numbers';

export type Currency = 'USDC' | 'WETH';

// Types
type BalanceProps = {
  selectedCurrency: Currency;
  fundLock: number;
  balance: string;
  margin?: string;
};

const Balance = ({ selectedCurrency, fundLock, balance, margin = 'm-0' }: BalanceProps) => {
  const currencyInformation = useMemo(() => {
    return (
      <>
        {TABLE_COLLATERAL_SUMMARY[selectedCurrency].currencyLogo}
        {selectedCurrency}
      </>
    )
  }, [selectedCurrency])

  return (
    <div className={`${styles.balance} ${margin && margin}`}>
      <div className='flex-row gap-4'>
        FundLock: {formatNumberByCurrency(fundLock, '', selectedCurrency)}
        {currencyInformation}
      </div>

      <div className='flex-row gap-4'>
        Balance: {formatNumberByCurrency(Number(balance), '', selectedCurrency)}
        {currencyInformation}
      </div>
    </div>
  );
};

export default Balance;
