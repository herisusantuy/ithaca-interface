// Constants
import { TABLE_ORDER_EXPANDED_HEADERS, TableExpandedRowData } from '@/UI/constants/tableOrder';

// Utils
import { getSideIcon } from '@/UI/utils/TableOrder';

// Components
import CurrencyDisplay from '@/UI/components/CurrencyDisplay/CurrencyDisplay';
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';

// Styles
import styles from './TableOrder.module.scss';
import { SingleCurrencyAmount } from '../CollateralAmount/CollateralAmount';

// Types
type ExpandedTableProps = {
  data: TableExpandedRowData[];
};

const EmptyDiv = () => <div></div>;

const ExpandedTable = ({ data }: ExpandedTableProps) => {
  console.log('DEBUG INFO 23/12/2023 13:32:42', data);
  return (
    <>
      <EmptyDiv />
      <div className={styles.headerExpandedTable}>
        Strategy
      </div>
      <EmptyDiv />
      {TABLE_ORDER_EXPANDED_HEADERS.map((header, idx) => (
        <div className={styles.cell} style={{flexDirection: 'column', justifyContent: header.alignment, alignItems: header.alignment}}>
          <div className={styles.cell} key={idx}>
            {header.name}
          </div>
        </div>
      ))}
      <EmptyDiv />
      <div style={{gridColumn: 'b/i'}}>
        <div className={styles.line} />
      </div>
      <EmptyDiv />
      {[...data, ...data].map((item, index) => (
          <>
            <div style={{gridColumn: 'a/j', marginTop: 5}}>
            </div>
            <EmptyDiv />
            <div className={`${styles.cellContentExpanded} ${styles.bolded}`}>{item.type}</div>
            <EmptyDiv />
            <EmptyDiv />
            <div className={styles.cellContentExpanded}>{getSideIcon(item.side)}</div>
            <div className={styles.cellContentExpanded}>
              <span className={styles.date}>{item.expiryDate}</span>
            </div>
            <div className={styles.cellContentExpanded} style={{justifyContent: 'flex-end'}}>
              <SingleCurrencyAmount amount={item.size} symbol={<LogoEth />} currency='WETH' />
            </div>
            <div className={styles.cellContentExpanded} style={{justifyContent: 'flex-end'}}>
              <SingleCurrencyAmount amount={item.strike} symbol={<LogoUsdc />} currency='USDC' />
            </div>
            
            <EmptyDiv />
          </>
        ))}
        <div style={{gridColumn: 'a/j', marginTop: 15}}>
            </div>
    </>
  );
};

export default ExpandedTable;
