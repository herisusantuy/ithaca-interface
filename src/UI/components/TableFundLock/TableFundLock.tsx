// Packages
import { useState } from 'react';

// Constants
import { TABLE_FUND_LOCK_HEADERS, TableFundLockDataProps } from '@/UI/constants/tableFundLock';

// Utils
import { renderDate } from '@/UI/utils/TableOrder';

// Components
import CurrencyDisplay from '@/UI/components/CurrencyDisplay/CurrencyDisplay';
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import TableDescription from '@/UI/components/TableDescription/TableDescription';
import Pagination from '@/UI/components/Pagination/Pagination';
import Asset from '@/UI/components/Asset/Asset';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';

// Styles
import styles from './TableFundLock.module.scss';

// Types
type TableFundLockProps = {
  data: TableFundLockDataProps[];
};

const TableFundLock = ({ data }: TableFundLockProps) => {
  const pageLimit = 9;

  // Page state
  const [currentPage, setCurrentPage] = useState(1);

  // Handle page change in pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get start and end pages
  const pageStart = (currentPage - 1) * pageLimit;
  const pageEnd = pageStart + pageLimit;

  return (
    <>
      <div className={styles.table}>
        <div className={styles.header}>
          {TABLE_FUND_LOCK_HEADERS.map((header, idx) => (
            <div className={styles.cell} key={idx}>
              {header}
            </div>
          ))}
        </div>
        {data.map((item, index) => (
          <div className={styles.row} key={index}>
            <div className={styles.cell}>{renderDate(item.orderData)}</div>
            <div className={styles.cell}>
              <Asset size='sm' icon={<LogoEth />} label={item.asset} />
            </div>
            <div className={styles.cell}>{item.auction}</div>
            <div className={styles.cell}>
              <CurrencyDisplay size='md' amount={item.amount} symbol={<LogoUsdc />} currency={item.currency} />
            </div>
          </div>
        ))}
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

export default TableFundLock;
