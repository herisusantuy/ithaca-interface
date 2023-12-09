// Components
import LogoEth from '@/UI/components/Icons/LogoEth';

// Styles
import styles from './Instructions.module.scss';
import dayjs from 'dayjs';

type BarrierDescriptionProps = {
  inOrOut: string,
  buyOrSell: string,
  upOrDown: string,
  currentExpiryDate: string
}

const BarrierDescription = ({inOrOut, buyOrSell, upOrDown, currentExpiryDate} : BarrierDescriptionProps) => {
  return (
    <div className={styles.description}>
      <p>
        {buyOrSell === 'BUY' ? 'BUY' : 'SELL'} {upOrDown === 'UP' ? 'UP' : 'DOWN'} and {inOrOut === 'IN' ? 'IN' : 'OUT'} {upOrDown === 'UP' ? 'Call' : 'Put'} if <LogoEth /> will end up @<span className={styles.italic}>{dayjs(currentExpiryDate).format('DD MMM YY')}</span> {upOrDown === 'UP' ? 'UP' : 'DOWN'} from the strike price and NOT {inOrOut === 'IN' ? 'IN' : 'OUT'}side &lt;
        the barrier, if not, premium {upOrDown === 'UP' ? 'lost.' :''} 
      </p>
      <p>
        {upOrDown === 'DOWN' ? ' lost.' :''} ( Sell and earn premium if <LogoEth /> @<span className={styles.italic}>{dayjs(currentExpiryDate).format('DD MMM YY')}</span> ends up below that strike or above the strike but still below
        the barrier )
      </p>
    </div>
  );
};

export default BarrierDescription;
