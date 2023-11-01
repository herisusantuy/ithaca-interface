// Packages
import React from 'react';

// Components
import Dot, { DotTypes } from '@/UI/components/Dot/Dot';

// Styles
import styles from './ChartPayoff.module.scss';

const keys = [
  { type: 'White' as DotTypes, label: 'Total' },
  { type: 'Put' as DotTypes, label: 'C' },
  { type: 'BinaryCall' as DotTypes, label: 'P' },
  { type: 'Forward' as DotTypes, label: 'F(Next Auction)' },
];

const Key = () => {
  // Add class to total item
  const getBadgeClass = (label: string): string => {
    return label === 'Total' ? styles.badge : '';
  };

  return (
    <div className={styles.container}>
      {keys.map((key, index) => (
        <div key={index} className={`${styles.key} ${getBadgeClass(key.label)}`}>
          <Dot type={key.type} />
          <p>{key.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Key;
