// Utils
import { getNumberFormat } from '@/UI/utils/Numbers';

// Styles
import styles from './Card.module.scss';

// Types
type CardProps = {
  label: string;
  value: number;
  className?: string;
};

const Card2 = ({ label, value, className }: CardProps) => {
  return (
    <div className={`${styles.container} ${className} ${styles.card2}`}>
      <div className={styles.data2}>
        <p>{label}</p>
        <p>{getNumberFormat(value)}</p>
      </div>
    </div>
  );
};

export default Card2;
