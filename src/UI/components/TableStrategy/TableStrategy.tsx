// Packages
import { useState } from 'react';

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
type StrategyProps = {
  type: DotTypes;
  side: '+' | '-';
  size: number;
  strike: number;
  enterPrice: number;
};

type StrategyTableProps = {
  data: StrategyProps[];
};

const TableStrategy = ({ data: initialData }: StrategyTableProps) => {
  // Table strategy state
  const [data, setData] = useState(initialData);

  // Handler to remove a strategy from the data array
  const handleRemoveRow = (index: number) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    setData(updatedData);
  };

  return (
    <div className={styles.table}>
      <div className={`${styles.row} ${styles.header}`}>
        {STRATEGY_TABLE_HEADER.map((header, idx) => (
          <div className={styles.cell} key={idx}>
            {header}
          </div>
        ))}
      </div>
      {data.map((strategy, idx) => (
        <div className={styles.row} key={idx}>
          <div className={styles.cell}>
            <div className={styles.dot}>
              <Dot type={strategy.type} />
              {strategy.type}
            </div>
          </div>
          <div className={styles.cell}>{displaySideIcon(strategy.side)}</div>
          <div className={styles.cell}>{formatWithCommas(strategy.size)}</div>
          <div className={styles.cell}>{formatWithCommas(strategy.strike)}</div>
          <div className={styles.cell}>{formatWithCommas(strategy.enterPrice)}</div>
          <div className={styles.cell}>
            <Button title='Click to remove row' variant='icon' onClick={() => handleRemoveRow(idx)}>
              <Close />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableStrategy;
