import { AnimatePresence, motion } from 'framer-motion';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

// Lib
import { useAppStore } from '@/UI/lib/zustand/store';

// SDK
import { Order, PortfolioCollateral, Position } from '@ithaca-finance/sdk';

// Constants
import {
  TABLE_ORDER_HEADERS,
  TABLE_ORDER_HEADERS_FOR_POSITIONS,
  TableRowData,
  TableRowDataWithExpanded,
  TABLE_ORDER_DATA_WITH_EXPANDED,
  TableDescriptionProps,
  TABLE_ORDER_LIVE_ORDERS,
} from '@/UI/constants/tableOrder';

// Utils
import {
  getSideIcon,
  orderDateSort,
  orderLimitSort,
  renderDate,
  tenorSort,
  variants,
  CURRENCY_PAIR_LABEL,
  FilterItemProps,
  PRODUCT_LABEL,
  SIDE_LABEL,
  productFilter,
  sideFilter,
  currencyFilter,
} from '@/UI/utils/TableOrder';

// Hooks
import { useEscKey } from '@/UI/hooks/useEscKey';

// Components
import Pagination from '@/UI/components/Pagination/Pagination';
import TableDescription from '@/UI/components/TableDescription/TableDescription';
import Delete from '@/UI/components/Icons/Delete';
import Button from '@/UI/components/Button/Button';
import CollateralAmount from '@/UI/components/CollateralAmount/CollateralAmount';
import Modal from '@/UI/components/Modal/Modal';
import Summary from '@/UI/components/Summary/Summary';
import ExpandedTable from '@/UI/components/TableOrder/ExpandedTable';
import Sort from '@/UI/components/Icons/Sort';
import Filter from '@/UI/components/Icons/Filter';
import CheckBox from '@/UI/components/CheckBox/CheckBox';
import DisconnectedWallet from '@/UI/components/DisconnectedWallet/DisconnectedWallet';

// Layout
import Flex from '@/UI/layouts/Flex/Flex';

// Styles
import styles from '../TableOrder.module.scss';
import Container from '@/UI/layouts/Container/Container';
import Loader from '../../Loader/Loader';
import DropdownOutlined from '../../Icons/DropdownOutlined';
import ExpandedPositionTable from '../ExpandedPositionTable';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getTableHeaders, transformClientOpenOrders } from '../helpers';
dayjs.extend(customParseFormat);

export const Separator = (props) => {
  const { className } = props
  return <div className={`${styles.separator} ${className}`} style={{ marginTop: 4, marginBottom: 7 }} />;
};

const SingleOrderRow = props => {
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
