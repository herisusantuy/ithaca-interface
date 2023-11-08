// Constants
import { TABLE_STRATEGY_HEADERS } from '@/UI/constants/tableStrategy';

// Utils
import { displaySideIcon } from '@/UI/utils/Icons';
import { formatWithCommas } from '@/UI/utils/Numbers';

// Components
import Dot, { DotTypes } from '@/UI/components/Dot/Dot';
import Button from '@/UI/components/Button/Button';
import Remove from '@/UI/components/Icons/Remove';

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
  removeRow?: (index: number) => void;
};

const TableStrategy = ({ data, removeRow }: StrategyTableProps) => {
  return (
    <div className={styles.table}>
      <div className={styles.header}>
        {TABLE_STRATEGY_HEADERS.map((header, idx) => {
          return (
            <div className={styles.cell} key={idx}>
              {header}
            </div>
          );
        })}
      </div>
      {data.map((strategy, idx) => (
        <div className={styles.row} key={idx}>
          <div className={styles.cell}>
            <div className={styles.dot}>
              <Dot type={strategy.type} />
              <div className={styles.strategy}>{strategy.type}</div>
            </div>
          </div>
          <div className={styles.cell}>{displaySideIcon(strategy.side)}</div>
          <div className={styles.cell}>{formatWithCommas(strategy.size)}</div>
          <div className={styles.cell}>{formatWithCommas(1500)}</div>
          <div className={styles.cell}>{formatWithCommas(strategy.enterPrice)}</div>
          <div className={styles.cell}>
            <Button title='Click to remove row' variant='icon' onClick={() => removeRow && removeRow(idx)}>
              <Remove />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableStrategy;
