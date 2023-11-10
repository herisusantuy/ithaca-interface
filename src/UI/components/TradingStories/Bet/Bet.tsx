import React from 'react';

import styles from './Bet.module.scss';
import RadioButton from '../../RadioButton/RadioButton';
import Flex from '@/UI/layouts/Flex/Flex';
import Slider from '../../Slider/Slider';
import Input from '../../Input/Input';
import LogoUsdc from '../../Icons/LogoUsdc';
import ChartPayoff from '../../ChartPayoff/ChartPayoff';
import { CHART_FAKE_DATA } from '@/UI/constants/charts';
import { TradingStoriesProps } from '..';
import LogoEth from '../../Icons/LogoEth';
import Button from '../../Button/Button';

const Bet = ({ compact = false }: TradingStoriesProps) => {
  return (
    <div>
      {!compact && (
        <div className={styles.instructions}>
          <div>
            Bet & Earn Return if <LogoEth /> at Expiry Range.
          </div>
          <div>i. Bet on Range; Capital at Risk.</div>
          <div>ii. Select Range.</div>
          <div>iii. Enter Target Earn.</div>
          <div>iv. Expected Return reflects the probability of at Expiry Range.</div>
        </div>
      )}
      {compact && (
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
      )}
      <Flex margin='mt-10 mb-24'>
        <RadioButton
          options={['Inside Range', 'Outside Range']}
          name={compact ? 'insideOrOutsideCompact' : 'insideOrOutside'}
          defaultOption='Inside Range'
          onChange={value => console.log(value)}
        />
      </Flex>
      {!compact && (
        <Flex margin='mb-10'>
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
      )}
      {!compact && (
        <div className={styles.betInputs}>
          <div className={styles.gridWrapper}>
            <Flex direction='row-center'>
              <span className={styles.label}>Bet</span>
            </Flex>
            <div className={styles.inputWrapper}>
              <Input id='ini' type='number' icon={<LogoUsdc />} />
            </div>
            <span />
            <span className={`${styles.label} ${styles.inputHint}`}>Capital At Risk</span>
          </div>
          <div>
            <div className={styles.returnsWrapper}>
              <div className={styles.earnWrapper}>
                <span className={styles.label}>Target Earn</span>
                <span className={styles.earn}>2200</span>
                <LogoUsdc />
              </div>
            </div>
            <div className={styles.aprWrapper}>
              <span className={`${styles.label} ${styles.inputHint}`}>Expected Return</span>
              <span className={styles.apr}>46.6%</span>
            </div>
          </div>
        </div>
      )}
      <div className={styles.payoff}>
        {!compact && <h4>Payoff Diagram</h4>}
        <ChartPayoff chartData={CHART_FAKE_DATA} height={300} />
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

export default Bet;
