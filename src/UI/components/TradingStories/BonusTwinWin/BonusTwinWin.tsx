import React, { useState } from 'react';

import styles from './BonusTwinWin.module.scss';
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

const BonusTwinWin = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const [bonusOrTwinWin, setBonusOrTwinWin] = useState<'bonus' | 'twin-win'>('bonus');

  return (
    <div>
      <Flex margin='mb-12'>
        <RadioButton
          options={[
            { option: 'Bonus', value: 'bonus' },
            { option: 'Twin-Win', value: 'twin-win' },
          ]}
          selectedOption={bonusOrTwinWin}
          name={compact ? 'bonusOrTwinWinCompact' : 'bonusOrTwinWin'}
          // onChange={}
        />
      </Flex>
      {!compact && showInstructions && (
        <div className={styles.instructions}>
          <div>
            i. Select <LogoEth /> Price Reference.
          </div>
          <div>
            ii. Select desired <LogoEth /> Downside Protection Level.
          </div>
          <div>iii. Protection extinguished at Knock Out Barrier.</div>
        </div>
      )}
      {!compact && (
        <Flex direction='column' margin='mt-20 mb-14' gap='gap-12'>
          <Flex gap='gap-15'>
            <div>
              <label className={styles.label}>Price Reference</label>
              <DropdownMenu options={DROPDOWN_OPTIONS} onChange={() => {}} />
            </div>
            <div>
              <label className={styles.label}>KO Barrier</label>
              <DropdownMenu options={DROPDOWN_OPTIONS} onChange={() => {}} />
            </div>
            <div className={styles.collateralWrapper}>
              <div className={styles.amountWrapper}>
                <LogoEth />
                Protection Cost Inclusive
              </div>
              <div className={styles.amountWrapper}>
                <span className={styles.amount}>1740</span>
                <LogoUsdc />
                <span className={styles.currency}>USDC</span>
              </div>
            </div>
          </Flex>
          <Flex gap='gap-15'>
            <div className={styles.inputWrapper}>
              <Input id='in' label='Size (Multiplier)' type='number' />
            </div>
            <div className={styles.collateralWrapper}>
              Total Premium
              <div className={styles.amountWrapper}>
                <span className={styles.amount}>400</span>
                <LogoUsdc />
                <span className={styles.currency}>USDC</span>
              </div>
            </div>
            <div className={styles.collateralWrapper}>
              Total Price
              <div className={styles.amountWrapper}>
                <span className={styles.amount}>17.4K</span>
                <LogoUsdc />
                <span className={styles.currency}>USDC</span>
              </div>
            </div>
          </Flex>
        </Flex>
      )}
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

export default BonusTwinWin;
