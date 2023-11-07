// Constants
import { CollateralType, TABLE_COLLATERAL_HEADERS } from '@/UI/constants/tableCollateral';

// Utils
import { formatWithCommas } from '@/UI/utils/Numbers';

// Components
import Button from '@/UI/components/Button/Button';
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';

// Styles
import styles from './TableCollateral.module.scss';
import Asset from '../Asset/Asset';

// Types
type CollateralTableProps = {
  data: CollateralType[];
  deposit: (asset: string) => void;
  withdraw: (asset: string) => void;
  faucet: (asset: string) => void;
};

const TableCollateral = ({ data, deposit, withdraw, faucet }: CollateralTableProps) => {
  return (
    <div className={styles.table}>
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
          <div className={styles.cell}>{formatWithCommas(collateral.balance)}</div>
          <div className={styles.cell}>{formatWithCommas(collateral.fundLock)}</div>
          <div className={styles.cell}>{formatWithCommas(collateral.netOrders)}</div>
          <div className={styles.cell}>{formatWithCommas(collateral.liveOrderValue)}</div>
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
