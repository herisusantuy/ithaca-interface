import { useState } from 'react'

import styles from './position-builder.module.scss'
import { useAppStore } from '@/UI/lib/zustand/store';

import dayjs from 'dayjs';
import PositionBuilderRow from "@/UI/components/PositionBuilderRow/PositionBuilderRow";
import RadioButton from "@/UI/components/RadioButton/RadioButton";
import { useDevice } from '@/UI/hooks/useDevice';
import { PositionBuilderStrategy } from '.';

export type ProductOption = {
  option: string;
  value: string;
}

interface IMainInfo {
  handleAddStrategy: (strategy: PositionBuilderStrategy) => void
}
export const MainInfo = ({ 
  handleAddStrategy, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: IMainInfo) => {
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
  const { currentExpiryDate } = useAppStore();
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
      <h3>Position Builder</h3>
      { renderOptions() }
    </>
  )
}
