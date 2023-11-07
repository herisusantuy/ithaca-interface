// Packages
import { motion } from 'framer-motion';
import { Fragment, useState } from 'react';

// Components
import Pagination from '@/UI/components/Pagination/Pagination';
import TableDescription from '@/UI/components/TableDescription/TableDescription';
import Delete from '@/UI/components/Icons/Delete';
import Button from '@/UI/components/Button/Button';
import Dropdown from '@/UI/components/Icons/Dropdown';
import Sort from '@/UI/components/Icons/Sort';
import Filter from '@/UI/components/Icons/Filter';
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import CollateralAmount from '@/UI/components/CollateralAmount/CollateralAmount';
import Plus from '@/UI/components/Icons/Plus';
import Minus from '@/UI/components/Icons/Minus';

// Layout
import Flex from '@/UI/layouts/Flex/Flex';

// Constants
import { TABLE_ORDER_HEADERS, TableRowData } from '@/UI/constants/tableOrder';

// Utils
import { orderDateSort } from '@/UI/utils/TableOrderFilter';

// Styles
import styles from './TableOrder.module.scss';

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

  // Get table header icons
  const getHeaderIcon = (header: string) => {
    switch (header) {
      case 'Order Date':
      case 'Tenor':
      case 'Collateral Amount':
      case 'Order Limit':
        return (
          <Button title='Click to sort column' className={styles.sort}>
            <Sort />
          </Button>
        );
      case 'Currency Pair':
      case 'Product':
      case 'Side':
        return (
          <Button title='Click to view filter options' className={styles.filter}>
            <Filter />
          </Button>
        );
      default:
        return null;
    }
  };

  // Get the side icon
  const getSideIcon = (side: string) => {
    return side === '+' ? <Plus /> : <Minus />;
  };

  // Split the dates and render as spans
  const renderDate = (dateStr: string) => {
    const parts = dateStr.split(' ');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    const time = parts.length > 3 ? parts[3] : '';
    return (
      <div className={styles.date}>
        <span>{day}</span>
        <span>{month}</span>
        <span>{year}</span>
        {time && <span className={styles.time}>{time}</span>}
      </div>
    );
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
                <div className={styles.cell}>{getSideIcon(row.side)}</div>
                <div className={styles.cell}>{renderDate(row.tenor)}</div>
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
