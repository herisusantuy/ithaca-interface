// Packages
import { motion } from 'framer-motion';
import { Fragment, useState } from 'react';

// Components
import Pagination from '@/UI/components/Pagination/Pagination';
import TableDescription from '@/UI/components/TableDescription/TableDescription';
import Delete from '@/UI/components/Icons/Delete';
import Button from '@/UI/components/Button/Button';
import Dropdown from '@/UI/components/Icons/Dropdown';

// Layout
import Flex from '@/UI/layouts/Flex/Flex';

// Constants
import { TABLE_ORDER_HEADERS, TableRowData } from '@/UI/constants/tableOrder';

// Styles
import styles from './TableOrder.module.scss';
import LogoEth from '../Icons/LogoEth';
import LogoUsdc from '../Icons/LogoUsdc';
import CollateralAmount from '../CollateralAmount/CollateralAmount';
import { orderDateSort } from '@/UI/utils/TableOrderFilter';

// Types
type TableOrderProps = {
  data: TableRowData[];
};

const TableOrder = ({ data }: TableOrderProps) => {
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

  // Animation for row expand and collapse
  const variants = {
    open: { opacity: 1, height: 'auto' },
    closed: { opacity: 0, height: 0 },
  };

  // Handle row expand and collapse
  const handleRowExpand = (rowIndex: number) => {
    if (expandedRow.includes(rowIndex)) {
      setExpandedRow(prev => prev.filter(idx => idx !== rowIndex));
    } else {
      setExpandedRow(prev => [...prev, rowIndex]);
    }
  };

  // Handle Filter for Testing
  const tableFilter = (header: string) => {
    if (header === 'Order Date') {
      data = orderDateSort(data, 'asc');
      console.log(data);
    }
  };

  return (
    <>
      <div className={styles.table}>
        <div className={`${styles.row} ${styles.header}`}>
          {TABLE_ORDER_HEADERS.map((header, idx) => (
            <div
              className={styles.cell}
              key={idx}
              onClick={() => {
                tableFilter(header);
              }}
            >
              {header}
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
                <div className={styles.cell}>{row.orderDate}</div>
                <div className={styles.cell}>
                  <div className={styles.currency}>
                    {row.currencyPair.split(' / ').map(currency => (
                      <Fragment key={currency}>
                        {currency === 'WETH' ? (
                          <>
                            <LogoEth />
                            {currency} /{' '}
                          </>
                        ) : null}
                        {currency === 'USDC' ? (
                          <>
                            <LogoUsdc />
                            {currency}
                          </>
                        ) : null}
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div className={styles.cell}>{row.product}</div>
                <div className={styles.cell}>{row.side}</div>
                <div className={styles.cell}>{row.tenor}</div>
                <div className={styles.cell}>
                  <CollateralAmount wethAmount={row.wethAmount} usdcAmount={row.usdcAmount} />
                </div>
                <div className={styles.cell}>{row.orderLimit}</div>
                <div className={styles.cell}>
                  <Button title='Click to delete' className={styles.delete}>
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
