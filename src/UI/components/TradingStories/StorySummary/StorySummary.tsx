import React from 'react';
import LogoUsdc from '../../Icons/LogoUsdc';
import Button from '../../Button/Button';

import styles from './StorySummary.module.scss';
import Flex from '@/UI/layouts/Flex/Flex';
import LogoEth from '../../Icons/LogoEth';
import { OrderDetails } from '..';
import { useAppStore } from '@/UI/lib/zustand/store';
import { toPrecision } from '@ithaca-finance/sdk';
import { getNumber, getNumberFormat } from '@/UI/utils/Numbers';

type Props = {
  showCollateral?: boolean;
  summary?: OrderDetails;
  onSubmit: () => void;
};

const StorySummary = ({ showCollateral = false, summary, onSubmit }: Props) => {
  const { currencyPrecision } = useAppStore();

  return (
    <div className={styles.orderSummary}>
      {showCollateral && (
        <div className={styles.summary}>
          <h5>Collateral Requirement</h5>
          <Flex gap='gap-10'>
            <div className={styles.summaryInfoWrapper}>
              <h3>{summary ? getNumberFormat(summary.orderLock.underlierAmount, 'double') : '-'}</h3>
              <LogoEth />
              <p>WETH</p>
            </div>
            <div className={styles.summaryInfoWrapper}>
              <h3>
                {summary
                  ? getNumberFormat(
                      toPrecision(
                        summary.orderLock.numeraireAmount - getNumber(summary.order.totalNetPrice),
                        currencyPrecision.strike
                      )
                    )
                  : '-'}
              </h3>
              <LogoUsdc />
              <p>USDC</p>
            </div>
          </Flex>
        </div>
      )}
      <div className={styles.summary}>
        <h5>Total Premium</h5>
        <div className={styles.summaryInfoWrapper}>
          <h3>{summary ? getNumberFormat(summary.order.totalNetPrice) : '-'}</h3>
          <LogoUsdc />
          <p>USDC</p>
        </div>
      </div>
      <div className={styles.summary}>
        <h6>Platform Fee</h6>
        <div className={styles.summaryInfoWrapper}>
          <small>{1.5}</small>
          <LogoUsdc />
          <small>USDC</small>
        </div>
      </div>
      <Button size='sm' title='Click to submit to auction' onClick={onSubmit}>
        Submit to Auction
      </Button>
    </div>
  );
};

export default StorySummary;
