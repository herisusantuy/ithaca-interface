// Packages
import { useState } from 'react';

// Constants
import { LeaderboardEntry, TABLE_LEADERBOARD_HEADERS } from '@/UI/constants/tableLeaderboard';

// Layout
import Flex from '@/UI/layouts/Flex/Flex';

// Components
import Pagination from '@/UI/components/Pagination/Pagination';
import Avatar from '@/UI/components/Icons/Avatar';

// Styles
import styles from './TableLeaderboard.module.scss';

// Types
type TableLeaderboardProps = {
  data: LeaderboardEntry[];
};

const TableLeaderboard = ({ data }: TableLeaderboardProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const pageLimit = 9;

  // Handle page change in pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.table}>
      <div className={styles.header}>
        {TABLE_LEADERBOARD_HEADERS.map((header, idx) => {
          return (
            <div className={styles.cell} key={idx}>
              {header}
            </div>
          );
        })}
      </div>
      {data.length ? (
        data.map((leader, idx) => (
          <div className={styles.row} key={idx}>
            <div className={styles.cell}>{leader.ranking}</div>
            <div className={styles.cell}>
              <Avatar />
              {leader.user}
            </div>
            <div className={styles.cell}>{leader.points}</div>
            <div className={styles.cell}>{leader.totalPoints}</div>
          </div>
        ))
      ) : (
        <div className={styles.emptyContainer}>
          <div className={styles.row}>No results found</div>
        </div>
      )}
      {data.length > 9 ? (
        <Flex direction='row-space-between' margin='mt-35'>
          <div></div>
          <Pagination
            totalItems={data.length}
            itemsPerPage={pageLimit}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </Flex>
      ) : null}
    </div>
  );
};

export default TableLeaderboard;
