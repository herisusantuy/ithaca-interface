// Packages
import { motion } from 'framer-motion';
import { Fragment, useState } from 'react';

// Components
import Pagination from '@/UI/components/Pagination/Pagination';
import TableDescription from '@/UI/components/TableDescription/TableDescription';
import Delete from '@/UI/components/Icons/Delete';
import Button from '@/UI/components/Button/Button';
import Dropdown from '@/UI/components/Icons/Dropdown';
import CollateralAmount from '@/UI/components/CollateralAmount/CollateralAmount';
import Modal from '@/UI/components/Modal/Modal';
import Summary from '@/UI/components/Summary/Summary';

// Layout
import Flex from '@/UI/layouts/Flex/Flex';

// Constants
import { TABLE_ORDER_HEADERS, TableRowData } from '@/UI/constants/tableOrder';

// Utils
import {
  formatCurrencyPair,
  getHeaderIcon,
  getSideIcon,
  // orderDateSort,
  renderDate,
  variants,
} from '@/UI/utils/TableOrder';

// Styles
import styles from './TableOrder.module.scss';

// Types
type TableOrderProps = {
  data: TableRowData[];
};

const TableOrder = ({ data: initialData }: TableOrderProps) => {
  // Cancel order state
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [rowToCancelOrder, setRowToCancelOrder] = useState<TableRowData | null>(null);

  // Handle cancel order
  const handleCancelOrderClick = (rowIndex: number) => {
    setRowToCancelOrder(data[rowIndex]);
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRowToCancelOrder(null);
  };

  // Function to handle the actual delete operation
  const handleCancelOrderRemoveRow = () => {
    setIsDeleting(true);

    setTimeout(() => {
      const newData = data.filter(row => row !== rowToCancelOrder);
      setData(newData);
      setIsDeleting(false);
      setIsModalOpen(false);
      setRowToCancelOrder(null);
    }, 3000);
  };

  // Page state
  const [currentPage, setCurrentPage] = useState(1);

  // Expanded row state
  const [expandedRow, setExpandedRow] = useState<number[]>([]);
  const pageLimit = 9;

  // Handle page change in pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get start and end pages
  const pageStart = (currentPage - 1) * pageLimit;
  const pageEnd = pageStart + pageLimit;

  // Slice the data to only show 9 results
  const slicedData = data.slice(pageStart, pageEnd);

  // Handle row expand and collapse
  const handleRowExpand = (rowIndex: number) => {
    if (expandedRow.includes(rowIndex)) {
      setExpandedRow(prev => prev.filter(idx => idx !== rowIndex));
    } else {
      setExpandedRow(prev => [...prev, rowIndex]);
    }
  };

  // Handle Filter for Testing
  // const tableFilter = (header: string) => {
  //   if (header === 'Order Date') {
  //     data = orderDateSort(data, 'asc');
  //     console.log(data);
  //   }
  // };

  return (
    <>
      <div className={styles.table}>
        <div className={`${styles.row} ${styles.header}`}>
          {TABLE_ORDER_HEADERS.map((header, idx) => (
            <div
              className={styles.cell}
              key={idx}
              // onClick={() => {
              //   tableFilter(header);
              // }}
            >
              {header} {getHeaderIcon(header)}
            </div>
          ))}
        </div>
        {slicedData.map((row, rowIndex) => {
          return (
            <Fragment key={rowIndex}>
              <div className={styles.row}>
                <div onClick={() => handleRowExpand(rowIndex)} className={styles.cell}>
                  {expandedRow.includes(rowIndex) ? <Dropdown /> : <Dropdown />} {row.details}
                </div>
                <div className={styles.cell}>{renderDate(row.orderDate)}</div>
                <div className={styles.cell}>
                  <div className={styles.currency}>{formatCurrencyPair(row.currencyPair)}</div>
                </div>
                <div className={styles.cell}>{row.product}</div>
                <div className={styles.cell}>{getSideIcon(row.side)}</div>
                <div className={styles.cell}>{renderDate(row.tenor)}</div>
                <div className={styles.cell}>
                  <CollateralAmount wethAmount={row.wethAmount} usdcAmount={row.usdcAmount} />
                </div>
                <div className={styles.cell}>{row.orderLimit}</div>
                <div className={styles.cell}>
                  <Button
                    title='Click to cancel order'
                    className={styles.delete}
                    onClick={() => handleCancelOrderClick(rowIndex)}
                  >
                    <Delete />
                  </Button>
                </div>
              </div>
              <motion.div
                className='table-row-expanded'
                initial='closed'
                animate={expandedRow.includes(rowIndex) ? 'open' : 'closed'}
                variants={variants}
              >
                Expanded content for {row.details}
              </motion.div>
              {isModalOpen && rowToCancelOrder && (
                <Modal
                  title='Cancel Order'
                  onCloseModal={handleCloseModal}
                  onSubmitOrder={handleCancelOrderRemoveRow}
                  isLoading={isDeleting}
                  isOpen={isModalOpen}
                >
                  <p>Please confirm if you&apos;d like to cancel your order.</p>
                  <Summary detail={rowToCancelOrder} />
                </Modal>
              )}
            </Fragment>
          );
        })}
      </div>
      <Flex direction='row-space-between' margin='mt-35'>
        <TableDescription
          possibleReleaseX={10}
          possibleReleaseY={20}
          postOptimisationX={8}
          postOptimisationY={18}
          totalCollateral={30}
        />
        <Pagination
          totalItems={data.length}
          itemsPerPage={pageLimit}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </Flex>
    </>
  );
};

export default TableOrder;
