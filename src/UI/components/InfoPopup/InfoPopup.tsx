import styles from './InfoPopup.module.scss';
import LogoEth from '@/UI/components/Icons/LogoEth';
import ArrowRight from '@/UI/components/Icons/ArrowRight';
import ChevronLeft from '@/UI/components/Icons/ChevronLeft';
import ChevronRight from '@/UI/components/Icons/ChevronRight';

const InfoPopup = () => {
  return (
    <div className={styles.popupContainer}>
      <p>
        <span className={styles.popupBuyEth}>Buy</span> <LogoEth /> at a Premium
      </p>
      <p>
        <span className={styles.popupIfEth}>If</span>
        <LogoEth />
        <span className={styles.italic}>@ 20Nov23</span>
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
