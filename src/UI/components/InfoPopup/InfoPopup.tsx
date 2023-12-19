import dayjs from 'dayjs';

import { useAppStore } from '@/UI/lib/zustand/store';

import LogoEth from '@/UI/components/Icons/LogoEth';
import ArrowRight from '@/UI/components/Icons/ArrowRight';
import ChevronLeft from '@/UI/components/Icons/ChevronLeft';
import ChevronRight from '@/UI/components/Icons/ChevronRight';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Add from '@/UI/components/Icons/Add';

import styles from './InfoPopup.module.scss';
import { getNumber, getNumberValue } from '@/UI/utils/Numbers';

type InfoPopupType = 'bonusTwinWin' | 'risky';

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
    case 'bonusTwinWin': {
      const { barrier, strike } = props as BonusTwinWinPopup;
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
      const { risk, earn, currency } = props as RiskyPopup;

      const riskEth = currency !== 'WETH' ? getNumber((parseFloat(risk) / spot).toString()) : getNumber(risk);
      const riskUsdc = currency !== 'USDC' ? getNumber((parseFloat(risk) * spot).toString()) : getNumber(risk);

      return (
        <>
          <div className={styles.popupContainer}>
            <p>
              If <LogoEth /> <ChevronLeft /> {price}, receive{' '}
              {riskEth - Math.floor(riskEth) !== 0 ? riskEth.toFixed(3) : riskEth} <LogoEth /> <Add /> {earn}{' '}
              <LogoUsdc />
            </p>
          </div>
          <div className={`${styles.popupContainer} ${styles.popupBottomContainer}`}>
            <p>
              If <LogoEth /> <ChevronRight /> {price}, receive {riskUsdc} <LogoUsdc /> <Add /> {earn} <LogoUsdc />
            </p>
          </div>
        </>
      );
    }
  }
};
