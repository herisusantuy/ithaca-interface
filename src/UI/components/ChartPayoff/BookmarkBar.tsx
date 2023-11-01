import React from "react";

import styles from './ChartPayoff.module.scss';

const BookmarkBar = () => {
    return (
        <div className={styles.contentList}>
          <div className={styles.totalContainer}>
            <div className={styles.totalCircle}></div>
            <p>Total</p>
          </div>
          <div className={styles.cContainer}>
            <div className={styles.cCircle}></div>
            <p>C</p>
          </div>
          <div className={styles.pContainer}>
            <div className={styles.pCircle}></div>
            <p>P</p>
          </div>
          <div className={styles.fContainer}>
            <div className={styles.fCircle}></div>
            <p>F(Next Auction)</p>
          </div>
        </div>
    )
}

export default BookmarkBar;
