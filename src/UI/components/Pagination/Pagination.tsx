// Components
import Next from '@/UI/components/Icons/Next';

// Styles
import styles from './Pagination.module.scss';

// Types
type PaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  // const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const updatePage = (page: number) => {
    if (page > totalPages) {
      onPageChange(currentPage);
    } else {
      onPageChange(page);
    }
  };

  const pageNavigationRender = () => {
    if (currentPage <= 5) {
      return (
        <>
          <div
            className={`${styles.navigationItem} ${currentPage == 1 ? styles.active : ''}`}
            onClick={() => updatePage(1)}
          >
            1
          </div>
          <div
            className={`${styles.navigationItem} ${currentPage == 2 ? styles.active : ''} ${
              totalPages < 2 ? styles.disabled : ''
            }`}
            onClick={() => updatePage(2)}
          >
            2
          </div>
          <div
            className={`${styles.navigationItem} ${currentPage == 3 ? styles.active : ''} ${
              totalPages < 3 ? styles.disabled : ''
            }`}
            onClick={() => updatePage(3)}
          >
            3
          </div>
          <div
            className={`${styles.navigationItem} ${currentPage == 4 ? styles.active : ''} ${
              totalPages < 4 ? styles.disabled : ''
            }`}
            onClick={() => updatePage(4)}
          >
            4
          </div>
          <div
            className={`${styles.navigationItem} ${currentPage == 5 ? styles.active : ''} ${
              totalPages < 5 ? styles.disabled : ''
            }`}
            onClick={() => updatePage(5)}
          >
            5
          </div>
          <div
            className={`${styles.navigationItem} ${totalPages < currentPage + 1 ? styles.disabled : ''} ${
              styles.nextItem
            }`}
            onClick={() => updatePage(currentPage + 1)}
          >
            <Next />
          </div>
        </>
      );
    }

    if (currentPage > 5) {
      if (currentPage <= totalPages - 2) {
        return (
          <>
            <div
              className={`${styles.navigationItem} ${styles.previewItem}`}
              onClick={() => updatePage(currentPage - 1)}
            >
              <Next />
            </div>
            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 2)}>
              {currentPage - 2}
            </div>
            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 1)}>
              {currentPage - 1}
            </div>

            <div className={`${styles.navigationItem} ${styles.active}`} onClick={() => updatePage(currentPage)}>
              {currentPage}
            </div>
            <div
              className={`${styles.navigationItem} ${currentPage + 1 > totalPages ? styles.disabled : ''}`}
              onClick={() => updatePage(currentPage + 1)}
            >
              {currentPage + 1}
            </div>
            <div
              className={`${styles.navigationItem} ${currentPage + 2 > totalPages ? styles.disabled : ''}`}
              onClick={() => updatePage(currentPage + 2)}
            >
              {currentPage + 2}
            </div>
            <div
              className={`${styles.navigationItem} ${currentPage >= totalPages ? styles.disabled : ''} ${
                styles.nextItem
              }`}
              onClick={() => updatePage(currentPage + 1)}
            >
              <Next />
            </div>
          </>
        );
      }
      if (currentPage <= totalPages - 1) {
        return (
          <>
            <div
              className={`${styles.navigationItem} ${styles.previewItem}`}
              onClick={() => updatePage(currentPage - 1)}
            >
              <Next />
            </div>
            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 3)}>
              {currentPage - 3}
            </div>
            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 2)}>
              {currentPage - 2}
            </div>

            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 1)}>
              {currentPage - 1}
            </div>
            <div className={`${styles.navigationItem} ${styles.active}`} onClick={() => updatePage(currentPage)}>
              {currentPage}
            </div>
            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage + 1)}>
              {currentPage + 1}
            </div>
            <div
              className={`${styles.navigationItem} ${currentPage >= totalPages ? styles.hide : ''} ${styles.nextItem}`}
              onClick={() => updatePage(currentPage + 1)}
            >
              <Next />
            </div>
          </>
        );
      }
      if (currentPage == totalPages) {
        return (
          <>
            <div
              className={`${styles.navigationItem} ${styles.previewItem}`}
              onClick={() => updatePage(currentPage - 1)}
            >
              <Next />
            </div>
            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 4)}>
              {currentPage - 4}
            </div>
            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 3)}>
              {currentPage - 3}
            </div>

            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 2)}>
              {currentPage - 2}
            </div>
            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 1)}>
              {currentPage - 1}
            </div>
            <div className={`${styles.navigationItem} ${styles.active}`} onClick={() => updatePage(currentPage)}>
              {currentPage}
            </div>
            <div
              className={`${styles.navigationItem} ${currentPage >= totalPages ? styles.hide : ''} ${styles.nextItem}`}
              onClick={() => updatePage(currentPage + 1)}
            >
              <Next />
            </div>
          </>
        );
      }
    }
  };

  return (
    <div className={styles.pagination}>
      {/* {pages.map(page => (
        <Button
          key={page}
          disabled={currentPage === page}
          onClick={() => onPageChange(page)}
          title='Click to view next page'
        >
          {page}
        </Button>
      ))} */}
      {pageNavigationRender()}
    </div>
  );
};

export default Pagination;
