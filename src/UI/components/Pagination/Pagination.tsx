// Components
import Button from '@/UI/components/Button/Button';

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
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.pagination}>
      {pages.map(page => (
        <Button
          key={page}
          disabled={currentPage === page}
          onClick={() => onPageChange(page)}
          title='Click to view next page'
        >
          {page}
        </Button>
      ))}
    </div>
  );
};

export default Pagination;
