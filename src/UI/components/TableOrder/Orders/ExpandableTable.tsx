import { AnimatePresence, motion } from 'framer-motion';

// Constants
import { TableRowDataWithExpanded } from '@/UI/constants/tableOrder';

// Utils
import { variants } from '@/UI/utils/TableOrder';

// Hooks

// Components
import ExpandedTable from '@/UI/components/TableOrder/ExpandedTable';

// Layout

// Styles
import ExpandedPositionTable from '../ExpandedPositionTable';
import { TABLE_TYPE } from '../TableOrder';
import styles from '../TableOrder.module.scss';

interface ExpandableTableProps {
  row: TableRowDataWithExpanded;
  isRowExpanded: boolean;
  type: TABLE_TYPE;
}

const ExpandableTable = (props: ExpandableTableProps) => {
  const { row, isRowExpanded, type } = props;
  const getExpandedTableTemplate = (row: TableRowDataWithExpanded) => {
    switch (type) {
      case TABLE_TYPE.ORDER:
        return <ExpandedPositionTable data={row.expandedInfo || []} />;
      default:
        return <ExpandedTable data={row.expandedInfo || []} />;
    }
  };
  const className = type === TABLE_TYPE.LIVE ? styles.gridContainerTable : styles.gridContainerTableNoCancel;
  return (
    <AnimatePresence>
      {isRowExpanded && (
        <motion.div
          className={styles.tableRowExpanded}
          initial='closed'
          animate='open'
          exit='closed'
          variants={variants}
        >
          <div className={styles.tableExpanderContainer}>
            <div className={className}>{getExpandedTableTemplate(row)}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExpandableTable;
