// Components
import Next from '@/UI/components/Icons/Next';
import Previous from '@/UI/components/Icons/Previous';

// Styles
import styles from './Pagination.module.scss';

// Types
type PaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

type NavigationItemProps = {
  page: number;
  isCurrent?: boolean;
  isDisabled?: boolean;
};

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const updatePage = (newPage: number) => {
    const page = newPage > totalPages ? currentPage : newPage;
    onPageChange(page);
  };

  const NavigationItem = ({ page, isCurrent = false, isDisabled = false }: NavigationItemProps) => (
    <div
      className={`${styles.navigationItem} ${isCurrent ? styles.active : ''} ${isDisabled ? styles.disabled : ''}`}
      onClick={() => !isDisabled && updatePage(page)}
    >
      {page}
    </div>
  );

  const renderPageNumbers = () => {
    const items = [];
    let startPage = currentPage - 2;
    let endPage = currentPage + 2;

    if (currentPage <= 5) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage > totalPages - 5) {
      startPage = totalPages - 4;
      endPage = totalPages;
    }

    for (let page = startPage; page <= endPage; page++) {
      if (page > 0 && page <= totalPages) {
        items.push(
          <NavigationItem key={page} page={page} isCurrent={currentPage === page} isDisabled={page > totalPages} />
        );
      }
    }

    return items;
  };

  const renderPreviousButton = () =>
    currentPage > 1 && (
      <div className={`${styles.navigationItem} ${styles.nextItem}`} onClick={() => updatePage(currentPage - 1)}>
        <Previous />
      </div>
    );

  const renderNextButton = () =>
    currentPage < totalPages && (
      <div className={`${styles.navigationItem} ${styles.nextItem}`} onClick={() => updatePage(currentPage + 1)}>
        <Next />
      </div>
    );

  return (
    <div className={styles.pagination}>
      {renderPreviousButton()}
      {renderPageNumbers()}
      {renderNextButton()}
    </div>
  );
};

export default Pagination;
