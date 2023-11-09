// constants
import { KeyType, getRandomInt } from '@/UI/constants/charts';

// Components
import Dot, { DotTypes } from '@/UI/components/Dot/Dot';

// Styles
import styles from './ChartPayoff.module.scss';
import { useEffect, useState } from 'react';

type KeysProps = {
  keys: string[];
  onChange: (label: string) => void;
};

const Key = (props: KeysProps) => {
  const { keys, onChange } = props;
  const [keyMap, setKeyMap] = useState<KeyType[]>([]);

  useEffect(() => {
    const keyArray: KeyType[] = [];
    const dotArray: DotTypes[] = [
      'Call',
      'Put',
      'BinaryCall',
      'BinaryPut',
      'Forward (10 Nov 23)',
      'Forward (Next Auction)',
    ];
    keys.map(item => {
      if (item == 'total') {
        const keyObj: KeyType = { label: item, type: 'White' };
        keyArray.push(keyObj);
      } else {
        const dotTypeInt = getRandomInt(1, 5);
        const keyObj: KeyType = { label: item, type: dotArray[dotTypeInt - 1] };
        keyArray.push(keyObj);
      }
    });
    setKeyMap(keyArray);
  }, [keys]);

  // Add class to total item
  const getBadgeClass = (label: string): string => {
    return label === 'total' ? styles.badge : '';
  };

  // Change Label
  const updateChange = (label: string) => {
    onChange(label);
  };

  return (
    <div className={styles.container}>
      {keyMap.map((key, index) => (
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
