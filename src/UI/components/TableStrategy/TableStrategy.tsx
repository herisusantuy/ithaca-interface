// Constants
import { STRATEGY_TABLE_HEADER } from '@/UI/constants/tables';

// Utils
import { displaySideIcon } from '@/UI/utils/Icons';
import { formatWithCommas } from '@/UI/utils/Numbers';

// Components
import Dot, { DotTypes } from '@/UI/components/Dot/Dot';
import Button from '@/UI/components/Button/Button';
import Close from '@/UI/components/Icons/Close';

// Styles
import styles from './TableStrategy.module.scss';

// Types
type StrategyType = {
  type: DotTypes;
  side: '+' | '-';
  size: number;
  strike: number;
  enterPrice: number;
};

type StrategyTableProps = {
  data: StrategyType[];
  removeRow?: () => void;
};

const TableStrategy = ({ data, removeRow }: StrategyTableProps) => {
  return (
    <div className={styles.table}>
      <div className={`${styles.row} ${styles.header}`}>
        {STRATEGY_TABLE_HEADER.map((header, idx) => {
         return (
          <div className={styles.cell} key={idx}>
            {header === 'Type' ?
            <div className={`${styles.strategy} ml-24 mr-20`}>{header}</div>
            :<>{header}</>}
          </div>
        )})}
      </div>
      {data.map((strategy, idx) => (
        <div className={`${styles.row} ${styles.data}`} key={idx}>
          <div className={styles.cell}>
            <div className={styles.dot}>
              <Dot type={strategy.type} />
              <div className={styles.strategy}>{strategy.type}</div>
            </div>
          </div>
          <div className={styles.cell}>{displaySideIcon(strategy.side)}</div>
          <div className={styles.cell}>{formatWithCommas(strategy.size)}</div>
          <div className={styles.cell}>{formatWithCommas(strategy.strike)}</div>
          <div className={styles.cell}>{formatWithCommas(strategy.enterPrice)}</div>
          <div className={styles.cell}>
            <Button title='Click to remove row' variant='icon' onClick={() => removeRow && removeRow(idx)}>
              <Close />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableStrategy;
