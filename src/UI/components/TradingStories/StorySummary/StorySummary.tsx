// Packages
import React from 'react';
import { OrderDetails } from '..';

// Components
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Button from '@/UI/components/Button/Button';
import LogoEth from '@/UI/components/Icons/LogoEth';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';

// Utils
import { getNumber, getNumberFormat } from '@/UI/utils/Numbers';
import { useLastUrlSegment } from '@/UI/hooks/useLastUrlSegment';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';
import { toPrecision } from '@ithaca-finance/sdk';

// Styles
import styles from './StorySummary.module.scss';

// Types
type Props = {
  showCollateral?: boolean;
  summary?: OrderDetails;
  onSubmit: () => void;
  className?: string;
};
 
const StorySummary = ({ showCollateral = false, summary, onSubmit, className }: Props) => {
  const { currencyPrecision } = useAppStore();
  const lastSegment = useLastUrlSegment()
  const classes = `${styles.orderSummary} ${className || ''}`.trim();

  return (
    <div className={`${`orderSummary--${lastSegment}`} ${classes}`}>
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
      <Button size='lg' title='Click to submit to auction' onClick={onSubmit}>
        Submit to Auction
      </Button>
    </div>
  );
};

export default StorySummary;
