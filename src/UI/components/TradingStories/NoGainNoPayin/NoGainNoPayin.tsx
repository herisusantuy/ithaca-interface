import React, { useState } from 'react';

import styles from './NoGainNoPayin.module.scss';
import LogoUsdc from '../../Icons/LogoUsdc';
import ChartPayoff from '../../ChartPayoff/ChartPayoff';
import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';
import { TradingStoriesProps } from '..';
import LogoEth from '../../Icons/LogoEth';
import Button from '../../Button/Button';
import Flex from '@/UI/layouts/Flex/Flex';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';
import { DROPDOWN_OPTIONS } from '@/UI/constants/dropdown';
import Input from '../../Input/Input';
import RadioButton from '../../RadioButton/RadioButton';

const NoGainNoPayin = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const [callOrPut, setCallOrPut] = useState<'call' | 'put'>('call');

  return (
    <div>
      {!compact && showInstructions && (
        <div className={`${styles.instructions} mb-20`}>
          <div>
            i. Select <LogoEth /> Price Reference.
          </div>
          <div>
            ii. Select minimum Expected <LogoEth /> move from <LogoEth /> Price Reference.
          </div>
          <div className='ml-48'>
            (maximum potential <LogoUsdc /> loss if <LogoEth /> Price at Expiry = <LogoEth /> Price Reference)
          </div>
          <div>
            iii. Post minimum expected <LogoEth /> as collateral.
          </div>
          <div className='ml-24'>
            - If <LogoEth /> Price at Expiry <LogoEth /> Price Reference , receive <LogoEth /> Price at Expiry .
          </div>
          <div className='ml-24'>
            - If <LogoEth /> Price at Expiry <LogoEth /> Price Reference, receive collateral back.
          </div>
        </div>
      )}
      <Flex direction='column' margin='mb-14' gap='gap-12'>
        <Flex gap='gap-15'>
          <div>
            {!compact && <label className={styles.label}>Type</label>}
            <RadioButton
              options={[
                { option: 'Call', value: 'call' },
                { option: 'Put', value: 'put' },
              ]}
              selectedOption={callOrPut}
              name={compact ? 'callOrPutCompact' : 'callOrPut'}
              // onChange={}
            />
          </div>
          {!compact && (
            <>
              <div>
                <label className={styles.label}>
                  <LogoEth />
                  Price Reference
                </label>
                <DropdownMenu options={DROPDOWN_OPTIONS} onChange={() => {}} />
              </div>
              <div>
                <label className={styles.label}>Max Potential Loss</label>
                <DropdownMenu options={DROPDOWN_OPTIONS} onChange={() => {}} />
              </div>
              <div className={styles.priceReference}>
                Price Reference + Min Upside | Max Loss
                <div className={styles.amountWrapper}>
                  <span className={styles.amount}>125</span>
                  <LogoUsdc />
                  <span className={styles.currency}>USDC</span>
                </div>
              </div>
            </>
          )}
        </Flex>
        {!compact && (
          <Flex gap='gap-15'>
            <div className={styles.inputWrapper}>
              <Input id='in' label='Size (Multiplier)' type='number' />
            </div>
            <div className={styles.collateralWrapper}>
              Collateral
              <div className={styles.amountWrapper}>
                <span className={styles.amount}>1000</span>
                <LogoUsdc />
                <span className={styles.currency}>USDC</span>
              </div>
            </div>
          </Flex>
        )}
      </Flex>
      <div className={styles.payoff}>
        {!compact && <h4>Payoff Diagram</h4>}
        <ChartPayoff chartData={CHART_FAKE_DATA} height={chartHeight} showKeys={false} />
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

export default NoGainNoPayin;
