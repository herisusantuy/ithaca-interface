import dayjs from 'dayjs';

import { useAppStore } from '@/UI/lib/zustand/store';

import LogoEth from '@/UI/components/Icons/LogoEth';
import ArrowRight from '@/UI/components/Icons/ArrowRight';
import ChevronLeft from '@/UI/components/Icons/ChevronLeft';
import ChevronRight from '@/UI/components/Icons/ChevronRight';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Add from '@/UI/components/Icons/Add';

import styles from './InfoPopup.module.scss';
import { formatNumberByCurrency, getNumber } from '@/UI/utils/Numbers';

type InfoPopupType = 'bonus' | 'twinWin' | 'risky';

type CommonProperties = {
  type: InfoPopupType;
};

type BonusTwinWinPopup = CommonProperties & {
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

export type InfoPopupProps = BonusTwinWinPopup | RiskyPopup;

export const InfoPopup = (props: InfoPopupProps) => {
  const { currentExpiryDate, spotPrices } = useAppStore();
  const spot = spotPrices['WETH/USDC'];

  const { type, price } = props;

  switch (type) {
    case 'bonus': {
      const { barrier, strike } = props as BonusTwinWinPopup;
      return (
        <div className={`${styles.popupContainer} ${styles.bonusOrTwinWin}`}>
          <p>
            <span className={styles.popupBuyEth}>Buy</span>
            <LogoEth />
            <span className={styles.lato}>@</span>
            {price}
          </p>
          <p>
            <span className={styles.popupIfEth}>If</span>
            <LogoEth />@<span className={styles.italic}>{dayjs(currentExpiryDate.toString()).format('DD MMM YY')}</span>
            <ChevronRight />
            {barrier} (<ChevronLeft />
            {strike} )<ArrowRight />
            BONUS;
          </p>
          <p>
            Else <LogoEth />
          </p>
        </div>
      );
    }
    case 'twinWin': {
      const { barrier, strike } = props as BonusTwinWinPopup;
      return (
        <div className={`${styles.popupContainer} ${styles.bonusOrTwinWin}`}>
          <p>
            <span className={styles.popupBuyEth}>Buy</span>
            <LogoEth />
            <span className={styles.lato}>@</span>
            {price}
          </p>
          <p>
            <span className={styles.popupIfEth}>If</span>
            <LogoEth />@<span className={styles.italic}>{dayjs(currentExpiryDate.toString()).format('DD MMM YY')}</span>
            <ChevronRight />
            {barrier} (<ChevronLeft />
            {strike} )<ArrowRight />
            TWIN WIN;
          </p>
          <p>
            Else <LogoEth />
          </p>
        </div>
      );
    }
    case 'risky': {
      const { risk, earn, currency } = props as RiskyPopup;

      const riskEth = currency !== 'WETH' ? formatNumberByCurrency((parseFloat(risk) / spot), '', 'WETH') : formatNumberByCurrency(Number(risk), '', 'WETH');
      const riskUsdc = currency !== 'USDC' ? formatNumberByCurrency((parseFloat(risk) * spot), '', 'USDC') : formatNumberByCurrency(Number(risk), '', 'USDC');

      return (
        <>
          <div className={`${styles.popupContainer} ${styles.popupTopContainer}`}>
            <p>
              If <LogoEth /> <ChevronLeft /> {price}, receive{' '}
              {riskEth} <LogoEth /> <Add /> {earn}{' '}
              <LogoUsdc />
            </p>
          </div>
          <div className={`${styles.popupContainer}`}>
            <p>
              If <LogoEth /> <ChevronRight /> {price}, receive {riskUsdc} <LogoUsdc /> <Add /> {earn} <LogoUsdc />
            </p>
          </div>
        </>
      );
    }
  }
};
