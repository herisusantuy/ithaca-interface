// Packages
import { useMemo, useState } from 'react';

// Constants
import {
  ReferralsLeaderboardEntry,
  TABLE_REFERRALS_LEADERBOARD_HEADERS,
  tableReferralsLeaderBoardEnums,
} from '@/UI/constants/referralsLeaderBoard';

// Utils
import { getNumberFormat } from '@/UI/utils/Numbers';

// Layout
import Flex from '@/UI/layouts/Flex/Flex';

// Components
import Pagination from '@/UI/components/Pagination/Pagination';
import Avatar from '@/UI/components/Icons/Avatar';
import Button from '@/UI/components/Button/Button';
import Sort from '@/UI/components/Icons/Sort';

// Styles
import styles from './TableReferralsLeaderBoard.module.scss';

// Types
type TableReferralsLeaderBoardProps = {
  data: ReferralsLeaderboardEntry[];
  page: number;
  setPage: (page: number) => void;
};

type SortConfig = {
  key: keyof ReferralsLeaderboardEntry;
  direction: 'ascending' | 'descending';
};

const TableReferralsLeaderBoard = ({ data, page, setPage }: TableReferralsLeaderBoardProps) => {
  const initialSortConfig: SortConfig = {
    key: 'ranking',
    direction: 'ascending',
  };

  const headerToKeyMap: Record<tableReferralsLeaderBoardEnums, keyof ReferralsLeaderboardEntry> = {
    Ranking: 'ranking',
    'Invited By': 'invitedBy',
    'Accepted Invites': 'acceptedInvites',
    User: 'username',
  };

  const [sortConfig, setSortConfig] = useState<SortConfig | null>(initialSortConfig);

  const pageLimit = 9;

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  // Sort the data
  const sortableColumns = [
    tableReferralsLeaderBoardEnums.RANKING,
    tableReferralsLeaderBoardEnums.INVITED_BY,
    tableReferralsLeaderBoardEnums.ACCEPTED_INVITES,
  ];

  const sortedData = useMemo(() => {
    const sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  // Handle sorting
  const requestSort = (key: keyof ReferralsLeaderboardEntry) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className={styles.table}>
      <div className={styles.header}>
        {TABLE_REFERRALS_LEADERBOARD_HEADERS.map((header, idx) => {
          const isSortable = sortableColumns.includes(header);
          const sortKey = headerToKeyMap[header];

          return (
            <div className={styles.cell} key={idx}>
              {header}
              {isSortable && (
                <Button title='Click to sort column' className={styles.sort} onClick={() => requestSort(sortKey)}>
                  <Sort />
                </Button>
              )}
            </div>
          );
        })}
      </div>
      {sortedData.length ? (
        sortedData.map((leader, idx) => (
          <div className={styles.row} key={idx}>
            <div className={styles.cell}>{leader.ranking}</div>
            <div className={styles.cell}>
              <Avatar colors={leader.colors} />
              {leader.username}
            </div>
            <div className={styles.cell}>{leader.invitedBy}</div>
            <div className={styles.cell}>{getNumberFormat(leader.acceptedInvites)}</div>
          </div>
        ))
      ) : (
        <div className={styles.emptyContainer}>
          <div className={styles.row}>No results found</div>
        </div>
      )}
      {sortedData.length > 9 ? (
        <Flex direction='row-space-between' margin='mt-35 mt-tablet-16'>
          <div />
          <Pagination
            totalItems={data.length}
            itemsPerPage={pageLimit}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </Flex>
      ) : null}
    </div>
  );
};

export default TableReferralsLeaderBoard;
