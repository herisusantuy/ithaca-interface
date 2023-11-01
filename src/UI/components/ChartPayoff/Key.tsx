// Packages
import React from 'react';

// Styles
import styles from './ChartPayoff.module.scss';

const keys = [
  { className: styles.totalCircle, label: 'Total' },
  { className: styles.cCircle, label: 'C' },
  { className: styles.pCircle, label: 'P' },
  { className: styles.fCircle, label: 'F(Next Auction)' },
];

const Key = () => {
  return (
    <div className={styles.contentList}>
      {keys.map((key, index) => (
        <div key={index} className={styles.keyContainer}>
          <div className={key.className} />
          <p>{key.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Key;
