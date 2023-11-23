// Constants
import { GREEK_SYMBOLS } from '@/UI/constants/greeks';

// Styles
import styles from './Greeks.module.scss';

const Greeks = () => {
  return (
    <div className={styles.container}>
      <h5>Greeks</h5>
      {GREEK_SYMBOLS.map(({ symbol, name }) => (
        <div className={styles.column} key={name}>
          <label>
            <span dangerouslySetInnerHTML={{ __html: symbol }}></span>
            {name}
          </label>
          38 {`<unit>`}
        </div>
      ))}
    </div>
  );
};

export default Greeks;
