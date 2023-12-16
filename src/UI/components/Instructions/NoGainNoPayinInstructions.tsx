// Components
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Add from '@/UI/components/Icons/Add';
import Subtract from '@/UI/components/Icons/Subtract';
import ChevronRightHighlighted from '@/UI/components/Icons/ChevronRightHighlighted';
import ChevronLeftHighlighted from '@/UI/components/Icons/ChevronLeftHighlighted';

// Styles
import styles from './Instructions.module.scss';
import dayjs from 'dayjs';

type NoGainNoPayinInstructionsProps = {
  type?: string;
  currentExpiryDate: string;
};

const NoGainNoPayinInstructions = ({ type = 'Call', currentExpiryDate }: NoGainNoPayinInstructionsProps) => {
  return (
    <div className={styles.container}>
      <p>
        i. Select <LogoEth /> Price Reference.
      </p>
      <div className='d-flex flex-row'>
        <div style={{display:'flex',flexDirection:'column',alignItems:'end'}}>
          <p >ii. Select minimum Expected <LogoEth /></p>
          <p className='text-end'>(maximum potential <LogoUsdc /></p>
        </div>
        <div className='d-flex flex-column justify-content-start' style={{marginRight:'10px',marginLeft:'10px'}}>
          <p>
            <span className='flex-column-center'>
            <span className={type == 'Call' ? 'color-white hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
              Upside
            </span>
            <span className={type == 'Put' ? 'color-white hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
              Downside
            </span>
          </span>
            move from 
          </p>
          <p>
            loss if <LogoEth /> Price @<span className={`${styles.italic}  hide-psuedo p-0`}>{dayjs(currentExpiryDate).format('DD MMM YY')}</span> =
          </p>
        </div>
        <div className='d-flex flex-column justify-content-start'>
          <p>
            <LogoEth /> Price Reference.
          </p>
          <p>
            <LogoEth /> Price Reference)
          </p>
        </div>
      </div> 
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
        - If <LogoEth /> Price @<span className={`${styles.italic}  hide-psuedo p-0`}>{dayjs(currentExpiryDate).format('DD MMM YY')}</span>
        <ChevronRightHighlighted />
        <LogoEth className='ml-6' />
        Price Reference <Add />
        <span className='flex-column-center'>
          <span className={type == 'Put' ? 'color-white hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            min Upside 
          </span>
          <span className={type == 'Call' ? 'color-white hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            min Downside
          </span>
        </span>
        , receive <LogoEth /> Price @<span className={`${styles.italic}  hide-psuedo p-0`}>{dayjs(currentExpiryDate).format('DD MMM YY')}</span> <Subtract />
        <span className='flex-column-center'>
          <span className={type == 'Call' ? 'color-white hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            min Upside
          </span>
          <span className={type == 'Put' ? 'color-white hide-psuedo p-0' : 'color-white-30 hide-psuedo p-0'}>
            min Downside
          </span>
        </span>
        .
      </p>
      <p className='pl-18'>
        - If <LogoEth /> Price @<span className={`${styles.italic}  hide-psuedo p-0`}>{dayjs(currentExpiryDate).format('DD MMM YY')}</span> <ChevronLeftHighlighted />
        <LogoEth className='ml-6' />
        Price Reference, receive collateral back.
      </p>
    </div>
  );
};

export default NoGainNoPayinInstructions;
