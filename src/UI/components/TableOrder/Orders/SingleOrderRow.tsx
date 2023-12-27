// Utils
import { getSideIcon } from '@/UI/utils/TableOrder';

// Components
import Button from '@/UI/components/Button/Button';
import CollateralAmount from '@/UI/components/CollateralAmount/CollateralAmount';
import Delete from '@/UI/components/Icons/Delete';

// Styles
import DropdownOutlined from '../../Icons/DropdownOutlined';
import styles from '../TableOrder.module.scss';
import { TableRowDataWithExpanded } from '@/UI/constants/tableOrder';

type SingleOrderRowProps = {
  row: TableRowDataWithExpanded;
  cancelOrder?: boolean;
  handleCancelOrderClick: (index: number) => void;
  rowIndex: number;
  handleRowExpand: (index: number) => void;
  expandedRow: number[];
}

export const Separator = (props: { className?: string }) => {
  const { className } = props;
  return <div className={`${styles.separator} ${className}`} style={{ marginTop: 4, marginBottom: 7 }} />;
};

const SingleOrderRow = (props: SingleOrderRowProps) => {
  const { row, cancelOrder, handleCancelOrderClick, rowIndex, handleRowExpand, expandedRow } = props;
  return (
    <>
      {rowIndex > 0 && <Separator />}
      <div onClick={() => handleRowExpand(rowIndex)} className={styles.cell}>
        <Button
          title='Click to expand dropdown'
          className={`${styles.dropdown} ${expandedRow.includes(rowIndex) ? styles.isActive : ''}`}
        >
          <DropdownOutlined />
        </Button>
      </div>
      <div className={styles.cellContent}>{row.orderDate}</div>
      <div className={styles.cellContent}>
        <div className={styles.currency}>{row.currencyPair}</div>
      </div>
      <div className={styles.cellContent}>{row.product}</div>
      <div className={styles.cellContent}>{getSideIcon(row.side)}</div>
      <div className={styles.cellContent}>{row.tenor}</div>
      <div className={styles.cellContent} style={{ justifyContent: 'flex-end' }}>
        <CollateralAmount wethAmount={row.wethAmount} usdcAmount={row.usdcAmount} />
      </div>
      <div className={styles.cellContent} style={{ justifyContent: 'flex-end' }}>
        {row.orderLimit}
      </div>

      <div className={styles.cellContent} style={{ justifyContent: 'flex-end' }}>
        {cancelOrder && (
          <Button
            title='Click to cancel order'
            className={styles.delete}
            onClick={() => handleCancelOrderClick(rowIndex)}
          >
            <Delete />
          </Button>
        )}
      </div>
    </>
  );
};

export default SingleOrderRow;
