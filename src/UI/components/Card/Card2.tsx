// Utils
import { getNumberFormat } from '@/UI/utils/Numbers';

// Styles
import styles from './Card.module.scss';

// Types
type CardProps = {
  label: string;
  value: number;
};

const Card2 = ({ label, value }: CardProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.data2}>
        <p>{label}</p>
        <p>{getNumberFormat(value)}</p>
      </div>
    </div>
  );
};

export default Card2;
