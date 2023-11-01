// Styles
import styles from './Dot.module.scss';

// Types
export type DotTypes = 'White' | 'Call' | 'Put' | 'Binary Call' | 'Binary Put' | 'Forward (8 Oct 23)' | 'Forward (Next Auction)';

type DotProps = {
  type: DotTypes;
};

const TYPE_TO_COLOR: Record<DotTypes, string> = {
  White: styles.white,
  Call: styles.blue,
  Put: styles.red,
  'Binary Call': styles.orange,
  'Binary Put': styles.purple,
  'Forward (8 Oct 23)': styles.green,
  'Forward (Next Auction)': styles.primary,
};

const Dot = ({ type }: DotProps) => {
  const className = TYPE_TO_COLOR[type] || styles.gray;

  return <div className={`${styles.dot} ${className}`} />;
};

export default Dot;
