// Constants
import { TABLE_STRATEGY_HEADERS } from '@/UI/constants/tableStrategy';

// Utils
import { displaySideIcon } from '@/UI/utils/Icons';

// Components
import Button from '@/UI/components/Button/Button';
import Remove from '@/UI/components/Icons/Remove';

// Styles
import styles from './TableStrategy.module.scss';
import { PositionBuilderStrategy } from '@/pages/trading/position-builder';
import Dot from '../Dot/Dot';
import { formatNumber } from '@/UI/utils/Numbers';

type StrategyTableProps = {
  strategies: PositionBuilderStrategy[];
  removeRow?: (index: number) => void;
  clearAll?: () => void;
  hideClear?: boolean;
};

const TableStrategy = ({ strategies, removeRow, clearAll, hideClear=false }: StrategyTableProps) => {
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
              <div className={styles.cell}>{formatNumber(Number(strategy.strike), 'string')}</div>
              <div className={styles.cell}>{formatNumber(Number(strategy.referencePrice), 'string')}</div>
              {!hideClear && <div className={styles.cell}>
                <Button title='Click to remove row' variant='icon' onClick={() => removeRow && removeRow(idx)}>
                  <Remove />
                </Button>
              </div>}
            </div>
          ))
        ) : (
          <div className={styles.emptyContainer}>Please add a strategy.</div>
        )}
        {strategies.length > 0 && !hideClear && (
          <Button className={styles.clearAll} title='Click to clear all' onClick={clearAll} variant='clear'>
            Clear All
          </Button>
        )}
      </div>
    </>
  );
};

export default TableStrategy;
