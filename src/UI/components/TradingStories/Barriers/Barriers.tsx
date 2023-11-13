import React, { useState } from 'react';

import styles from './Barriers.module.scss';
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

const Barriers = ({ showInstructions, compact, chartHeight }: TradingStoriesProps) => {
  const [callOrPut, setCallOrPut] = useState<'call' | 'put'>('call');
  const [buyOrSell, setBuyOrSell] = useState<'buy' | 'sell'>('buy');
  const [upOrDown, setUpOrDown] = useState<'up' | 'down'>('up');
  const [inOrOut, setInOrOut] = useState<'in' | 'out'>('in');

  return (
    <div>
      {!compact && showInstructions && (
        <div className={styles.instructions}>
          <div>i. Select Desired Direction</div>
          <div>
            ii. Will <LogoEth /> move ‘a lot’? ( ‘Knock IN’ )
          </div>
          <div className='ml-14'>
            Will <LogoEth /> move ‘not too much’? ( ‘Knock OUT’ )
          </div>
          <div>iii. Call | Put</div>
        </div>
      )}
      {compact ? (
        <Flex gap='gap-3'>
          <RadioButton
            options={[
              { option: '+', value: 'buy' },
              { option: '-', value: 'sell' },
            ]}
            selectedOption={buyOrSell}
            name='buyOrSellCompact'
            orientation='vertical'
            // onChange={}
          />
          <RadioButton
            options={[
              { option: 'UP', value: 'up' },
              { option: 'DOWN', value: 'down' },
            ]}
            selectedOption={upOrDown}
            name='upOrDownCompact'
            orientation='vertical'
            // onChange={}
          />
          <RadioButton
            options={[
              { option: 'IN', value: 'in' },
              { option: 'OUT', value: 'out' },
            ]}
            selectedOption={inOrOut}
            name='inOrOutCompact'
            orientation='vertical'
            // onChange={}
          />
        </Flex>
      ) : (
        <Flex direction='column' margin='mt-20 mb-14' gap='gap-16'>
          <Flex gap='gap-10'>
            <div>
              <label className={styles.label}>Type</label>
              <RadioButton
                options={[
                  { option: 'Call', value: 'call' },
                  { option: 'Put', value: 'put' },
                ]}
                name='callOrPut'
                selectedOption={callOrPut}
                onChange={value => console.log(value)}
              />
            </div>
            <div>
              <label className={styles.label}>Side</label>
              <Flex gap='gap-10'>
                <RadioButton
                  options={[
                    { option: '+', value: 'buy' },
                    { option: '-', value: 'sell' },
                  ]}
                  selectedOption={buyOrSell}
                  name='buyOrSell'
                  orientation='vertical'
                  // onChange={}
                />
                <RadioButton
                  options={[
                    { option: 'UP', value: 'up' },
                    { option: 'DOWN', value: 'down' },
                  ]}
                  selectedOption={upOrDown}
                  name='upOrDown'
                  orientation='vertical'
                  // onChange={}
                />
              </Flex>
            </div>
            <div>
              <label className={styles.label}>Strike</label>
              <DropdownMenu options={DROPDOWN_OPTIONS} onChange={() => {}} />
            </div>
            <div className={styles.collateralWrapper}>Knock</div>
            <div className={styles.collateralWrapper}>
              <RadioButton
                options={[
                  { option: 'IN', value: 'in' },
                  { option: 'OUT', value: 'out' },
                ]}
                selectedOption={inOrOut}
                name='inOrOut'
                orientation='vertical'
                // onChange={}
              />
            </div>
            <div className={styles.collateralWrapper}>@</div>
            <div>
              <label className={styles.label}>Barrier</label>
              <DropdownMenu options={DROPDOWN_OPTIONS} onChange={() => {}} />
            </div>
            <div className={styles.inputWrapper}>
              <Input id='in' label='Size' type='number' />
            </div>
          </Flex>
          <div className={styles.calculationWrapper}>
            <div className={styles.calculation}>
              Total Premium
              <div className={styles.amountWrapper}>
                <span className={styles.amount}>400</span>
                <LogoUsdc />
                <span className={styles.currency}>USDC</span>
              </div>
            </div>
            <div className={styles.calculation}>
              Total Price
              <div className={styles.amountWrapper}>
                <span className={styles.amount}>17.4K</span>
                <LogoUsdc />
                <span className={styles.currency}>USDC</span>
              </div>
            </div>
          </div>
        </Flex>
      )}
      {!compact && showInstructions && (
        <div className={`${styles.additionalInstructions} mb-16`}>
          <div>
            BUY UP and IN Call if <LogoEth /> will end up at expiry UP from the strike price and NOT INside {'<'} the
            barrier, if not, premium lost.
          </div>
          <div>
            ( Sell and earn premium if <LogoEth /> at expiry ends up below that strike or above the strike but still
            below the barrier )
          </div>
        </div>
      )}
      <div className={styles.payoff}>
        {!compact && <h4>Payoff Diagram</h4>}
        <ChartPayoff chartData={CHART_FAKE_DATA} height={chartHeight} showKeys={false} />
      </div>
      {!compact && (
        <div className={styles.orderSummary}>
          <div className={styles.summary}>
            <h5>Collateral Requirement</h5>
            <Flex gap='gap-10'>
              <div className={styles.summaryInfoWrapper}>
                <h3>120.2K</h3>
                <LogoEth />
                <p>WETH</p>
              </div>
              <div className={styles.summaryInfoWrapper}>
                <h3>200.1K</h3>
                <LogoUsdc />
                <p>USDC</p>
              </div>
            </Flex>
          </div>
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

export default Barriers;
