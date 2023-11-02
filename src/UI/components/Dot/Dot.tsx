// Styles
import styles from './Dot.module.scss';

// Types
export type DotTypes = 'White' | 'Call' | 'Put' | 'BinaryCall' | 'BinaryPut' | 'Forward (10 Nov 23)' | 'Forward (Next Auction)';

type DotProps = {
  type: DotTypes;
};

const TYPE_TO_COLOR: Record<DotTypes, string> = {
  White: styles.white,
  Call: styles.blue,
  Put: styles.red,
  'BinaryCall': styles.orange,
  'BinaryPut': styles.purple,
  'Forward (10 Nov 23)': styles.green,
  'Forward (Next Auction)': styles.primary,
};

const Dot = ({ type }: DotProps) => {
  const className = TYPE_TO_COLOR[type] || styles.gray;

  return <div className={`${styles.dot} ${className}`} />;
};

export default Dot;
