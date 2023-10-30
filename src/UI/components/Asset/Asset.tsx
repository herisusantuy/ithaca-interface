// Styles
import styles from './Asset.module.scss';

// Types
type AssetProps = {};

const Asset = ({}: AssetProps) => {
  return (
    <div className={styles.asset}>
      <p>Asset</p>
    </div>
  );
};

export default Asset;
