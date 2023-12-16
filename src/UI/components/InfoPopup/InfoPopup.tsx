import dayjs from 'dayjs';

import { useAppStore } from '@/UI/lib/zustand/store';

import LogoEth from '@/UI/components/Icons/LogoEth';
import ArrowRight from '@/UI/components/Icons/ArrowRight';
import ChevronLeft from '@/UI/components/Icons/ChevronLeft';
import ChevronRight from '@/UI/components/Icons/ChevronRight';

import styles from './InfoPopup.module.scss';

const InfoPopup = () => {
  const { currentExpiryDate } = useAppStore();

  return (
    <div className={styles.popupContainer}>
      <p>
        <span className={styles.popupBuyEth}>Buy</span> <LogoEth /> at a Premium
      </p>
      <p>
        <span className={styles.popupIfEth}>If</span>
        <LogoEth />@<span className={styles.italic}>{dayjs(currentExpiryDate).format('DD MMM YY')}</span>
        <ChevronRight />
        Barrier (<ChevronLeft />
        Strike ) <ArrowRight />
        BONUS;
      </p>
      <p>
        Else <LogoEth />
      </p>
    </div>
  );
};

export default InfoPopup;
