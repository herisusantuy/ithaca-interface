// Components
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Add from '@/UI/components/Icons/Add';
import Subtract from '@/UI/components/Icons/Subtract';
import ChevronRightHighlighted from '@/UI/components/Icons/ChevronRightHighlighted';
import ChevronLeftHighlighted from '@/UI/components/Icons/ChevronLeftHighlighted';

// Styles
import styles from './Instructions.module.scss';

type NoGainNoPayinInstructionsProps = {
  type?: string;
};

const NoGainNoPayinInstructions = ({ type = 'Call' }: NoGainNoPayinInstructionsProps) => {
  return (
    <div className={styles.container}>
      <p>
        i. Select <LogoEth /> Price Reference.
      </p>
      <p>
        ii. Select minimum Expected <LogoEth />
        <span className='flex-column-center'>
          <span className={type == 'Call' ? 'color-white hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Upside
          </span>
          <span className={type == 'Put' ? 'color-white hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Downside
          </span>
        </span>
        move from <LogoEth /> Price Reference.
      </p>
      <p className='pl-54'>
        (maximum potential <LogoUsdc /> loss if <LogoEth /> Price at Expiry = <LogoEth /> Price Reference)
      </p>
      <p>
        iii. Post minimum expected <LogoEth className='ml-10' />
        <span className='flex-column-center'>
          <span className={type == 'Call' ? 'color-white hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Upside
          </span>
          <span className={type == 'Put' ? 'color-white hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            Downside
          </span>
        </span>
        as collateral.
      </p>
      <p className='pl-18'>
        - If <LogoEth /> Price at Expiry
        <ChevronRightHighlighted />
        <LogoEth className='ml-6' />
        Price Reference <Add />
        <span className='flex-column-center'>
          <span className='color-white-30 hide-psuedo p-0'>min Upside</span>
          <span className='color-white hide-psuedo p-0'>maxDownside</span>
        </span>
        , receive <LogoEth /> Price at Expiry <Subtract />
        <span className='flex-column-center'>
          <span className='color-white hide-psuedo p-0'>min Upside</span>
          <span className='color-white-30 hide-psuedo p-0'>maxDownside</span>
        </span>
        .
      </p>
      <p className='pl-18'>
        - If <LogoEth /> Price at Expiry <ChevronLeftHighlighted />
        <LogoEth className='ml-6' />
        Price Reference, receive collateral back.
      </p>
    </div>
  );
};

export default NoGainNoPayinInstructions;
