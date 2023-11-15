// Packages
import { useEffect, useState } from 'react';

// constants
import { KeyType, getRandomInt } from '@/UI/constants/charts/charts';

// Components
import Dot, { DotTypes } from '@/UI/components/Dot/Dot';

// Styles
import styles from './ChartPayoff.module.scss';

type KeysProps = {
  keys: string[];
  onChange?: (key: KeyType) => void;
  onDashed: (label: string) => void;
};

const Key = (props: KeysProps) => {
  const { keys, onChange, onDashed } = props;
  const [keyMap, setKeyMap] = useState<KeyType[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selected, setSelected] = useState<KeyType>({ label: 'total', type: 'leg1' });

  useEffect(() => {
    const keyArray: KeyType[] = [];
    const dotArray: DotTypes[] = [
      'leg1',
      'leg2',
      'leg3',
      'leg4',
      'leg5',
      'leg6',
      'leg7',
      'leg8',
      'leg9',
      'leg10',
      'leg11',
      'leg12',
      'leg13',
      'leg14',
      'leg15',
    ];

    keys.map(item => {
      if (item == 'total') {
        const keyObj: KeyType = { label: item, type: 'leg1' };
        keyArray.push(keyObj);
      } else {
        const dotTypeInt = getRandomInt(1, 14);
        const keyObj: KeyType = { label: item, type: dotArray[dotTypeInt - 1] };
        keyArray.push(keyObj);
      }
    });

    setKeyMap(keyArray);
  }, [keys]);

  // Add class to total item
  const getBadgeClass = (label: string): string => {
    return label === selected.label ? styles.badge : '';
  };

  // Change Label
  const updateChange = (key: KeyType) => {
    // setSelected(key);
    if (onChange) onChange(key);
  };

  const showDashedLine = (label: string) => {
    onDashed(label);
  };

  return (
    <div className={styles.container}>
      {keyMap.map((key, index) => (
        <div
          key={index}
          className={`${styles.key} ${getBadgeClass(key.label)}`}
          onClick={() => updateChange(key)}
          onMouseEnter={() => showDashedLine(key.label)}
          onMouseLeave={() => showDashedLine('')}
        >
          <Dot type={key.type} />
          <p>{key.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Key;
