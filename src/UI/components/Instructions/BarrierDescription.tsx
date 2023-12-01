// Components
import LogoEth from '@/UI/components/Icons/LogoEth';

// Styles
import styles from './Instructions.module.scss';

type BarrierDescriptionProps = {
  inOrOut: string,
  buyOrSell: string,
  upOrDown: string
}

const BarrierDescription = ({inOrOut, buyOrSell, upOrDown} : BarrierDescriptionProps) => {
  return (
    <div className={styles.description}>
      <p>
        {buyOrSell === 'BUY' ? 'BUY' : 'SELL'} {upOrDown === 'UP' ? 'UP' : 'DOWN'} and {inOrOut === 'IN' ? 'IN' : 'OUT'} {upOrDown === 'UP' ? 'Call' : 'Put'} if <LogoEth /> will end up at expiry {upOrDown === 'UP' ? 'UP' : 'DOWN'} from the strike price and NOT {inOrOut === 'IN' ? 'IN' : 'OUT'}side &lt;
        the barrier, if not, premium {upOrDown === 'UP' ? 'lost.' :''} 
      </p>
      <p>
        {upOrDown === 'DOWN' ? ' lost.' :''} ( Sell and earn premium if <LogoEth /> at expiry ends up below that strike or above the strike but still below
        the barrier )
      </p>
    </div>
  );
};

export default BarrierDescription;
