import dayjs from 'dayjs';

import { useAppStore } from '@/UI/lib/zustand/store';

import LogoEth from '@/UI/components/Icons/LogoEth';
import ArrowRight from '@/UI/components/Icons/ArrowRight';
import ChevronLeft from '@/UI/components/Icons/ChevronLeft';
import ChevronRight from '@/UI/components/Icons/ChevronRight';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Add from '@/UI/components/Icons/Add';

import styles from './InfoPopup.module.scss';

type InfoPopupType = 'barrier' | 'risky';

type CommonProperties = {
  type: InfoPopupType;
};

type BarrierPopup = CommonProperties & {
  price: string;
  barrier: string;
  strike: string;
};

type RiskyPopup = CommonProperties & {
  price: number;
  risk: string;
  currency: string;
  earn: string;
};

export type InfoPopupProps = BarrierPopup | RiskyPopup;

export const InfoPopup = (props: InfoPopupProps) => {
  const { currentExpiryDate } = useAppStore();
  const { type, price } = props;

  switch (type) {
    case 'barrier': {
      const { barrier, strike } = props as BarrierPopup;
      return (
        <div className={styles.popupContainer}>
          <p>
            <span className={styles.popupBuyEth}>Buy</span> <LogoEth /> at a{' '}
            <span className={styles.italic}>{price}</span>
          </p>
          <p>
            <span className={styles.popupIfEth}>If</span>
            <LogoEth />@<span className={styles.italic}>{dayjs(currentExpiryDate.toString()).format('DD MMM YY')}</span>
            <ChevronRight />
            <span className={styles.italic}>{barrier}</span>(<ChevronLeft />
            <span className={styles.italic}>{strike}</span>)<ArrowRight />
            BONUS;
          </p>
          <p>
            Else <LogoEth />
          </p>
        </div>
      );
    }
    case 'risky': {
      const { risk, currency, earn } = props as RiskyPopup;
      const currencyIcon = currency === 'USDC' ? <LogoUsdc /> : <LogoEth />;

      return (
        <div className={styles.popupContainer}>
          <p>
            If <LogoEth /> <ChevronLeft /> {price}, receive {risk} {currencyIcon} <Add /> {earn} {currencyIcon}
          </p>
        </div>
      );
    }
  }
};
