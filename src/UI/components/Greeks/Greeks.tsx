// Constants
import { GREEK_SYMBOLS } from '@/UI/constants/greeks';

// Styles
import styles from './Greeks.module.scss';

type GreekSymbolProps = {
  greeks?: Record<string, number>
}

const Greeks = ({greeks}: GreekSymbolProps) => {
  return (
    <div className={styles.container}>
      <h5>Greeks</h5>
      {GREEK_SYMBOLS.map(({ symbol, name, id }) => (
        <div className={styles.column} key={name}>
          <label>
            <span dangerouslySetInnerHTML={{ __html: symbol }}></span>
            {name}
          </label>
          {greeks ? greeks[id].toFixed(1) : '-'} {`<unit>`}
        </div>
      ))}
    </div>
  );
};

export default Greeks;
