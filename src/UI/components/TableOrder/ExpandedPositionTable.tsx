// Constants
import { TABLE_ORDER_EXPANDED_HEADERS_FOR_POSITIONS, TableExpandedRowData } from '@/UI/constants/tableOrder';

// Components
import CurrencyDisplay from '@/UI/components/CurrencyDisplay/CurrencyDisplay';
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';

// Styles
import styles from './ExpandedTable.module.scss';

// Types
type ExpandedTableProps = {
  data: TableExpandedRowData[];
};

const ExpandedPositionTable = ({ data }: ExpandedTableProps) => {
  return (
    <div className={styles.transactionDetail}>
      <div className={`${styles.table} ${styles.positionTable}`}>
        <div className={`${styles.row} ${styles.header}`}>
          {TABLE_ORDER_EXPANDED_HEADERS_FOR_POSITIONS.map((header, idx) => (
            <div className={styles.cell} key={idx}>
              {header}
            </div>
          ))}
        </div>
        {data.map((item, index) => (
          <div className={styles.rowBody} key={index}>
            <div className={styles.cell}>{item.type}</div>
            <div className={styles.cell}>
              <CurrencyDisplay amount={item.size} symbol={<LogoEth />} currency='WETH' />
            </div>
            <div className={styles.cell}>
              <CurrencyDisplay amount={item.strike} symbol={<LogoUsdc />} currency='USDC' />
            </div>
            <div className={styles.cell}>{item.enterPrice}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpandedPositionTable;
