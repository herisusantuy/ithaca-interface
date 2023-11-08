import React from 'react';

import styles from './Earn.module.scss';
import Flex from '@/UI/layouts/Flex/Flex';
import Slider from '../../Slider/Slider';
import LogoUsdc from '../../Icons/LogoUsdc';
import ChartPayoff from '../../ChartPayoff/ChartPayoff';
import { PAYOFF_DUMMY_DATA, SPECIAL_DUMMY_DATA } from '@/UI/constants/charts';
import { TradingStoriesProps } from '..';
import LogoEth from '../../Icons/LogoEth';
import Button from '../../Button/Button';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';
import { DROPDOWN_OPTIONS } from '@/UI/constants/dropdown';

const Earn = ({ compact = false }: TradingStoriesProps) => {
  return (
    <div>
      {!compact && (
        <div className={styles.instructions}>
          <div>
            i. Select <LogoEth /> Target Price.
          </div>
          <div>
            ii. Risk Earn <LogoUsdc /> Return.
          </div>
          <div>iii.</div>
          <div>
            - If at Expiry <LogoEth /> {'<'} Target Price, receive Risk equivalent worth of <LogoEth /> + Return in{' '}
            <LogoUsdc />.
          </div>
          <div>
            - If at Expiry <LogoEth /> {'>'} Target Price, receive Risk equivalent worth of <LogoUsdc /> + Return in{' '}
            <LogoUsdc />.
          </div>
        </div>
      )}
      <div className={styles.sliderWrapper}>
        {!compact && (
          <div className={styles.sliderTitle}>
            Select Target Price <LogoEth />
          </div>
        )}
        <Flex>
          <Slider
            title='Range'
            value={{ min: 1500, max: 1800 }}
            min={1300}
            max={2000}
            onChange={() => {}}
            label={8}
            range={true}
          />
        </Flex>
      </div>
      {!compact && (
        <div className={styles.earnInputs}>
          <div className={styles.gridWrapper}>
            <Flex direction='row-center'>
              <span className={styles.label}>Risk</span>
            </Flex>
            <DropdownMenu options={DROPDOWN_OPTIONS} onChange={() => {}} iconEnd={<LogoUsdc />} />
            <span />
            <span className={`${styles.label} ${styles.inputHint}`}>Capital At Risk</span>
          </div>
          <div>
            <div className={styles.returnsWrapper}>
              <div className={styles.earnWrapper}>
                <span className={styles.label}>Earn</span>
                <span className={styles.earn}>125</span>
                <LogoUsdc />
              </div>
            </div>
            <div className={styles.aprWrapper}>
              <span className={`${styles.label} ${styles.inputHint}`}>Expected Return</span>
              <span className={styles.apr}>5.0%</span>
            </div>
          </div>
        </div>
      )}
      <div className={styles.payoff}>
        {!compact && <h4>Payoff Diagram</h4>}
        <ChartPayoff chartData={PAYOFF_DUMMY_DATA} specialDot={SPECIAL_DUMMY_DATA} />
      </div>
      {!compact && (
        <div className={styles.orderSummary}>
          <div className={styles.summary}>
            <h5>Total Premium</h5>
            <div className={styles.summaryInfoWrapper}>
              <h3>{1500}</h3>
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
          <Button size='sm' title='Click to submit to auction'>
            Submit to Auction
          </Button>
        </div>
      )}
    </div>
  );
};

export default Earn;
