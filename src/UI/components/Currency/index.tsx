import Flex from '@/UI/layouts/Flex/Flex';
import React from 'react';

import { useDevice } from '@/UI/hooks/useDevice';

import LogoEth from '../Icons/LogoEth';
import Asset from '../Asset/Asset';
import LabelValue from '@/UI/components/LabelValue/LabelValue';
import dayjs from 'dayjs';
import CountdownTimer from '../CountdownTimer/CountdownTimer';
import { useAppStore } from '@/UI/lib/zustand/store';
import { getNumber } from '@/UI/utils/Numbers';

import styles from './currency.module.scss'

type CurrencyProps = {
  onExpiryChange: () => void;
}

export const Currency = ({
  onExpiryChange
} 
: CurrencyProps) => {

  const device = useDevice();
  const { currentExpiryDate, expiryList, setCurrentExpiryDate } = useAppStore();

  return (
    <Flex gap={device !== 'phone' ? 'gap-12' : 'gap-0'} margin='mb-24'>
      <div className={styles.currency__info}>
        <Asset icon={<LogoEth />} label='ETH' />
      </div>
      <div className={styles.currency__info}>
        <LabelValue
          label='Expiry Date'
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          valueList={expiryList.map((date: any) => ({
            label: dayjs(`${date}`, 'YYYYMMDD').format('DD MMM YY'),
            value: dayjs(`${date}`, 'YYYYMMDD').format('DD MMM YY'),
          }))}
          onChange={value => {
            onExpiryChange()
            setCurrentExpiryDate(getNumber(dayjs(value, 'DD MMM YY').format('YYYYMMDD')));
          }}
          value={dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('DD MMM YY')}
          hasDropdown={true}
        />
      </div>
      <div className={styles.currency__info}>
        <LabelValue label='Next Auction' value={<CountdownTimer />} />
      </div>
      {/* <div className={styles.currency__info}>
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
      </div> */}
    </Flex>
  );
};
