// Constants
import { TABLE_ORDER_EXPANDED_HEADERS, TableExpandedRowData } from '@/UI/constants/tableOrder';

// Utils
import { getSideIcon } from '@/UI/utils/TableOrder';

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

const ExpandedTable = ({ data }: ExpandedTableProps) => {
  return (
    <div className={styles.table}>
      <div className={`${styles.row} ${styles.header}`}>
        {TABLE_ORDER_EXPANDED_HEADERS.map((header, idx) => (
          <div className={styles.cell} key={idx}>
            {header}
          </div>
        ))}
      </div>
      {data.map((item, index) => (
        <div className={styles.rowBody} key={index}>
          <div className={styles.cell}>{item.type}</div>
          <div className={styles.cell}>{getSideIcon(item.side)}</div>
          <div className={styles.cell}>
            <CurrencyDisplay amount={item.size} symbol={<LogoEth />} currency='WETH' />
          </div>
          <div className={styles.cell}>
            <CurrencyDisplay amount={item.strike} symbol={<LogoUsdc />} currency='USDC' />
          </div>
          <div className={styles.cell}>
            <CurrencyDisplay amount={item.enterPrice} symbol={<LogoUsdc />} currency='USDC' />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpandedTable;
