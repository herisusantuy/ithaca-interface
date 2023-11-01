// Styles
import styles from './Dot.module.scss';

// Types
export type DotTypes = 'Call' | 'Put' | 'BinaryCall' | 'BinaryPut' | 'Forward';

type DotProps = {
  type: DotTypes;
};

const TYPE_TO_COLOR: Record<DotTypes, string> = {
  Call: styles.blue,
  Put: styles.red,
  BinaryCall: styles.orange,
  BinaryPut: styles.purple,
  Forward: styles.green,
};

const Dot = ({ type }: DotProps) => {
  const className = TYPE_TO_COLOR[type] || styles.gray;

  return <div className={`${styles.dot} ${className}`} />;
};

export default Dot;
