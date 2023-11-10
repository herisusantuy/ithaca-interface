// Constants
import { CollateralType, TABLE_COLLATERAL_HEADERS } from '@/UI/constants/tableCollateral';

// Components
import Button from '@/UI/components/Button/Button';
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Asset from '@/UI/components/Asset/Asset';

// Styles
import styles from './TableCollateral.module.scss';

// Types
type CollateralTableProps = {
  isOpacity?: boolean;
  data: CollateralType[];
  deposit: (asset: string) => void;
  withdraw: (asset: string) => void;
  faucet: (asset: string) => void;
};

const TableCollateral = ({ isOpacity, data, deposit, withdraw, faucet }: CollateralTableProps) => {
  const tableClass = `${styles.table} ${isOpacity ? styles.isOpacity : ''}`;

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
      {data.map((collateral, idx) => (
        <div className={styles.row} key={idx}>
          <div className={styles.cell}>
            <Asset icon={collateral.asset === 'WETH' ? <LogoEth /> : <LogoUsdc />} label={collateral.asset} />
          </div>
          <div className={styles.cell}>{collateral.balance}</div>
          <div className={styles.cell}>{collateral.fundLock}</div>
          <div className={styles.cell}>{collateral.netOrders}</div>
          <div className={styles.cell}>{collateral.liveOrderValue}</div>
          <div className={styles.cell}>
            <Button
              title={`Click to deposit ${collateral.asset}`}
              variant='secondary'
              size='sm'
              role='button'
              onClick={() => deposit(collateral.asset)}
            >
              Deposit
            </Button>
            <Button
              title={`Click to withdraw ${collateral.asset}`}
              size='sm'
              variant='primary'
              onClick={() => withdraw(collateral.asset)}
            >
              Withdraw
            </Button>
            <Button
              title={`Click to faucet ${collateral.asset}`}
              size='sm'
              variant='primary'
              onClick={() => faucet(collateral.asset)}
            >
              Faucet
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableCollateral;
