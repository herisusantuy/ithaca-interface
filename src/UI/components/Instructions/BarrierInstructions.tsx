// Components
import LogoEth from '@/UI/components/Icons/LogoEth';

// Styles
import styles from './Instructions.module.scss';

type BarrierDescriptionProps = {
  type? : string
}

const BarrierInstructions = ({type = 'BUY'} : BarrierDescriptionProps) => {
  return (
    <div className={styles.container}>
      <p>
        i. Select Desired Direction{' '}
        <span>
          <p>
            {type == 'BUY' ? 'UP' : 'DOWN'}
          </p>
        </span>
      </p>
      <p>
        ii. Will <LogoEth /> move &lsquo;a lot&rsquo;?{' '}
        <span className='hide-psuedo p-0 ml-54'>( &lsquo;Knock IN&rsquo; )</span>
      </p>
      <p className='pl-14'>
        Will <LogoEth /> move &lsquo;not too much&rsquo;? ( &lsquo;Knock OUT&rsquo; )
      </p>
      <p>
        iii. <span className={type == 'BUY' ? 'hide-psuedo color-white p-0' : 'hide-psuedo color-white-30 p-0'}>Call</span> |
        <span className={type == 'SELL' ? 'hide-psuedo color-white p-0' : 'hide-psuedo color-white-30 p-0'}>Put</span>
        <span className='flex-column-center mlr-6'>
          <span className={type == 'BUY' ? 'hide-psuedo color-white p-0' : 'hide-psuedo color-white-30 p-0'}>Buy</span>
          <span className={type == 'SELL' ? 'hide-psuedo color-white p-0' : 'hide-psuedo color-white-30 p-0'}>Sell</span>
        </span>
        <span className='flex-column-center mr-6'>
          <span className={type == 'BUY' ? 'hide-psuedo color-white p-0' : 'hide-psuedo color-white-30 p-0'}>Up</span>
          <span className={type == 'SELL' ? 'hide-psuedo color-white p-0' : 'hide-psuedo color-white-30 p-0'}>Down</span>
        </span>
        <span className='flex-column-center mr-6'>
          <span className='color-white hide-psuedo p-0'>Knocks In ( effective )</span>
          <span className='color-white-30 hide-psuedo p-0'>Knocks Out ( extinguished )</span>
        </span>
        <span className='flex-column-center hide-psuedo p-0'>
          <p>
            if <LogoEth /> at expiry beyond barrier
          </p>
          <p>
            if <LogoEth /> at expiry beyond barrier
          </p>
        </span>
      </p>
    </div>
  );
};

export default BarrierInstructions;
