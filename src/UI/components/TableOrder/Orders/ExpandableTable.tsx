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
import { TABLE_TYPE } from '../TableOrder';
dayjs.extend(customParseFormat);

const ExpandableTable = props => {
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

export default ExpandableTable