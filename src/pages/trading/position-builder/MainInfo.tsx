import { useState } from 'react'

import Flex from "@/UI/layouts/Flex/Flex";
import styles from './position-builder.module.scss'
import LogoEth from "@/UI/components/Icons/LogoEth";
import Asset from "@/UI/components/Asset/Asset";
import LabelValue from "@/UI/components/LabelValue/LabelValue";
import { useAppStore } from '@/UI/lib/zustand/store';
import { getNumber } from '@/UI/utils/Numbers';
import { Leg } from '@ithaca-finance/sdk';

import dayjs from 'dayjs';
import CountdownTimer from "@/UI/components/CountdownTimer/CountdownTimer";
import PositionBuilderRow from "@/UI/components/PositionBuilderRow/PositionBuilderRow";
import RadioButton from "@/UI/components/RadioButton/RadioButton";
import { useDevice } from '@/UI/hooks/useDevice';

export type ProductOption = {
  option: string;
  value: string;
}

export interface PositionBuilderStrategy {
  leg: Leg;
  referencePrice: number;
  payoff: string;
  strike: string;
}
export const MainInfo = ({
  setOrderSummary, 
  positionBuilderStrategies, 
  setPositionBuilderStrategies, 
  getPositionBuilderSummary, 
  setChartData 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => {
  const [product, setProduct] = useState<string>('options')
  const device = useDevice()
  const PRODUCT_OPTIONS: ProductOption[] = [{
    option: 'Options',
    value: 'options'
  }, {
    option: 'Digital Options',
    value: 'digital-options'
  }, {
    option: 'Forwards',
    value: 'forwards'
  }];
  const handleProductChange = (product: string) => { 
    setProduct(product)
  }
  const { currentExpiryDate, expiryList, setCurrentExpiryDate } = useAppStore();

  const handleAddStrategy = (strategy: PositionBuilderStrategy) => {
    const newPositionBuilderStrategies = [...positionBuilderStrategies, strategy];
    setPositionBuilderStrategies(newPositionBuilderStrategies);
    getPositionBuilderSummary(newPositionBuilderStrategies);
  };

  const renderOptions = () => {
    return (device === 'desktop') ? (
    <>
      <PositionBuilderRow
        title='Options'
        options={[
          { option: 'Call', value: 'Call' },
          { option: 'Put', value: 'Put' },
        ]}
        addStrategy={handleAddStrategy}
      />
      <PositionBuilderRow
        title='Digital Options'
        options={[
          { option: 'Call', value: 'BinaryCall' },
          { option: 'Put', value: 'BinaryPut' },
        ]}
        addStrategy={handleAddStrategy}
      />
      <PositionBuilderRow
        title='Forwards'
        options={[
          {
            option: dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('DDMMMYY'),
            value: 'Forward',
          },
          { option: 'Next Auction', value: 'Forward (Next Auction)' },
        ]}
        addStrategy={handleAddStrategy}
      />
    </>
    ) :
    (
      <>
      <div className={`mb-16 ${styles.options}`}>
        <RadioButton
          options={PRODUCT_OPTIONS}
          selectedOption={product}
          name={`${product}-product`}
          onChange={handleProductChange}
        />
      </div>
        <div className= {(product === 'options') ? `${styles.option} ${styles.option__active}` : `${styles.option}`}>
          <PositionBuilderRow
            title='Options'
            options={[
              { option: 'Call', value: 'Call' },
              { option: 'Put', value: 'Put' },
            ]}
            addStrategy={handleAddStrategy}
          />
          </div>
          <div className= {(product === 'digital-options') ? `${styles.option} ${styles.option__active}` : `${styles.option}`}>
          <PositionBuilderRow
            title='Digital Options'
            options={[
              { option: 'Call', value: 'BinaryCall' },
              { option: 'Put', value: 'BinaryPut' },
            ]}
            addStrategy={handleAddStrategy}
          />
          </div>
          <div className= {(product === 'forwards') ? `${styles.option} ${styles.option__active}` : `${styles.option}`}>
          <PositionBuilderRow
            title='Forwards'
            options={[
              {
                option: dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('DDMMMYY'),
                value: 'Forward',
              },
              { option: 'Next Auction', value: 'Forward (Next Auction)' },
            ]}
            addStrategy={handleAddStrategy}
          />
          </div>
      </>
    )
  }

  return (
    <>
      <Flex gap={ (device !== 'phone') ? 'gap-12' : 'gap-0' } margin='mb-24'>
        <div className={styles.currency__info}>
          <Asset icon={<LogoEth />} label='ETH' />
        </div>
        <div className={styles.currency__info}>
          <LabelValue
            label='Expiry Date'
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            valueList={expiryList.map((date:any) => ({
              label: dayjs(`${date}`, 'YYYYMMDD').format('DD MMM YY'),
              value: dayjs(`${date}`, 'YYYYMMDD').format('DD MMM YY'),
            }))}
            onChange={value => {
              setOrderSummary(undefined);
              setPositionBuilderStrategies([]);
              setChartData(undefined);
              setCurrentExpiryDate(getNumber(dayjs(value, 'DD MMM YY').format('YYYYMMDD')));
            }}
            value={dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('DD MMM YY')}
            hasDropdown={true}
          />
        </div>
        <div className={styles.currency__info}>
          <LabelValue label='Next Auction' value={<CountdownTimer />} />
        </div>
        <div className={styles.currency__info}>
          <LabelValue
            label='Last Auction Price'
            value='1629'
            subValue={
              <>
                <span>{dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('DD')}</span>
                <span>{dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('MMM')}</span>
                <span>{dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('YY')}</span>
              </>
            }
          />
        </div>
      </Flex>
      <h3>Position Builder</h3>
      { renderOptions() }
    </>
  )
}
