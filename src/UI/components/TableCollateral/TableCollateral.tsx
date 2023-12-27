// Constants
import { CollateralSummary, TABLE_COLLATERAL_HEADERS } from '@/UI/constants/tableCollateral';

// Utils
import { formatNumberByCurrency } from '@/UI/utils/Numbers';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';

// Components
import Button from '@/UI/components/Button/Button';
import Asset from '@/UI/components/Asset/Asset';

// Styles
import styles from './TableCollateral.module.scss';
import { Currency } from '../Balance/Balance';

// Types
type CollateralTableProps = {
  collateralSummary: { [currency: string]: CollateralSummary };
  deposit: (asset: string) => void;
  withdraw: (asset: string) => void;
  faucet: (asset: string) => void;
};

const TableCollateral = ({ collateralSummary, deposit, withdraw, faucet }: CollateralTableProps) => {
  const { isAuthenticated } = useAppStore();
  const tableClass = `${styles.table} ${!isAuthenticated ? styles.isOpacity : ''}`;

  return (
    <div className={tableClass.trim()}>
      <div className={styles.header}>
        {TABLE_COLLATERAL_HEADERS.map((header, idx) => {
          return (
            <div className={styles.cell} key={idx}>
              {header}
            </div>
          );
        })}
      </div>
      {Object.keys(collateralSummary).map((currency, idx) => (
        <div className={styles.row} key={idx}>
          <div className={styles.cell}>
            <Asset icon={collateralSummary[currency].currencyLogo} label={currency} />
          </div>
          <div className={styles.cell}>{formatNumberByCurrency(Number(collateralSummary[currency].walletBalance), 'string', currency as Currency)}</div>
          <div className={styles.cell}>{formatNumberByCurrency(Number(collateralSummary[currency].fundLockValue), 'string', currency as Currency)}</div>
          <div className={styles.cell}>{formatNumberByCurrency(Number(collateralSummary[currency].settleValue), 'string', currency as Currency)}</div>
          <div className={styles.cell}>{formatNumberByCurrency(Number(collateralSummary[currency].orderValue), 'string', currency as Currency)}</div>
          <div className={styles.cell}>
            <Button
              title={`Click to deposit ${currency}`}
              variant='secondary'
              size='sm'
              role='button'
              onClick={() => deposit(currency)}
            >
              Deposit
            </Button>
            <Button
              title={`Click to withdraw ${currency}`}
              size='sm'
              variant='primary'
              onClick={() => withdraw(currency)}
            >
              Withdraw
            </Button>
            <Button title={`Click to faucet ${currency}`} size='sm' variant='primary' onClick={() => faucet(currency)}>
              Faucet
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableCollateral;
