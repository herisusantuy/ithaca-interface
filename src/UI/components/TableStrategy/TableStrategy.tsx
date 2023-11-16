// Constants
import { TABLE_STRATEGY_HEADERS } from '@/UI/constants/tableStrategy';

// Utils
import { displaySideIcon } from '@/UI/utils/Icons';

// Components
import Button from '@/UI/components/Button/Button';
import Remove from '@/UI/components/Icons/Remove';

// Styles
import styles from './TableStrategy.module.scss';
import { PositionBuilderStrategy } from '@/pages/trading/pro/position-builder';
import Dot from '../Dot/Dot';

type StrategyTableProps = {
  strategies: PositionBuilderStrategy[];
  removeRow: (index: number) => void;
  clearAll: () => void;
};

const TableStrategy = ({ strategies, removeRow, clearAll }: StrategyTableProps) => {
  return (
    <>
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
        {strategies.length ? (
          strategies.map((strategy, idx) => (
            <div className={styles.row} key={idx}>
              <div className={styles.cell}>
                <div className={styles.dot}>
                  <Dot type={`leg${idx + 1}`} />
                  <div className={styles.strategy}>{strategy.payoff}</div>
                </div>
              </div>
              <div className={styles.cell}>{displaySideIcon(strategy.leg.side)}</div>
              <div className={styles.cell}>{strategy.leg.quantity}</div>
              <div className={styles.cell}>{strategy.strike}</div>
              <div className={styles.cell}>{strategy.referencePrice}</div>
              <div className={styles.cell}>
                <Button title='Click to remove row' variant='icon' onClick={() => removeRow(idx)}>
                  <Remove />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyContainer}>Please add a strategy.</div>
        )}
        {strategies.length && (
          <Button title='Click to clear all' onClick={clearAll} variant='clear'>
            Clear All
          </Button>
        )}
      </div>
    </>
  );
};

export default TableStrategy;
