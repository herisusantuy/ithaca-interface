// constants
import { KeyType } from '@/UI/constants/charts';

// Components
import Dot from '@/UI/components/Dot/Dot';

// Styles
import styles from './ChartPayoff.module.scss';

type KeysProps = {
  keys: KeyType[];
  onChange: (label: string) => void;
};

const Key = (props: KeysProps) => {
  const { keys, onChange } = props;

  // Add class to total item
  const getBadgeClass = (label: string): string => {
    return label === 'Total' ? styles.badge : '';
  };

  // Change Label
  const updateChange = (label: string) => {
    onChange(label);
  };

  return (
    <div className={styles.container}>
      {keys.map((key, index) => (
        <div
          key={index}
          className={`${styles.key} ${getBadgeClass(key.label)}`}
          onClick={() => updateChange(key.label)}
        >
          <Dot type={key.type} />
          <p>{key.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Key;
