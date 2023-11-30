// Components
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import ArrowRight from '@/UI/components/Icons/ArrowRight';
import ChevronLeft from '@/UI/components/Icons/ChevronLeft';
import ChevronRight from '@/UI/components/Icons/ChevronRight';
import Add from '@/UI/components/Icons/Add';

// Styles
import styles from './Instructions.module.scss';
import Minus from '../Icons/Minus';
import CurlyBracketDown from '../Icons/CurlyBracketDown';
import CurlyBracketLeft from '../Icons/CurlyBracketLeft';
import CurlyBracketRight from '../Icons/CurlyBracketRight';
import SquareBracketLeft from '../Icons/SquareBracketLeft';
import SquareBracketRight from '../Icons/SquareBracketRight';
import dayjs from 'dayjs';

type props = {
  currentExpiry: string
}

const RisklessEarnInstructions = ({ currentExpiry }: props) => {
  return (
    <div className={styles.container}>
      <p className='mb-14'>Pay Capital <LogoUsdc /> Now <ArrowRight /> &#123; Receive Capital <LogoUsdc /> + Return <LogoUsdc /> &#125; @ <span className={`${styles.italic} hide-psuedo p-0`}>{dayjs(currentExpiry, 'YYYYMMDD').format('DD MMM YY')}</span></p>
      <p className='flex-row'>
        <p className={styles.risklessPay}>i. Pay</p>
        <p>
          <span className='flex-column-center hide-psuedo p-0 mb-10'>
            <span className='hide-psuedo flex-row'>
              <span className={`hide-psuedo ${styles.squareBracketSm} p-0`}>
                <SquareBracketLeft />
              </span>
              <span className='flex-column-center flex-start hide-psuedo p-0'>
                <span className='hide-psuedo p-0'>+ Call Spread</span>
                <span className='hide-psuedo p-0'>+ Put Spread</span>
              </span>
              <span className={`hide-psuedo ${styles.squareBracketSm} p-0`}>
                <SquareBracketRight />
              </span>
            </span>
            <span className='hide-psuedo flex-row'>
              <span className={`hide-psuedo ${styles.squareBracketSm} p-0`}>
                <SquareBracketLeft />
              </span>
              <span className='hide-psuedo flex-column-center'>
                <span className='hide-psuedo p-0'>(Call <Minus color='#9d9daa' /> Call) + (Put <Minus color='#9d9daa' /> Put)</span>
                <h6 className='hide-psuedo p-0'>
                  <span className={`hide-psuedo ${styles.largerGap}`}>Lower</span>
                  <span className={`hide-psuedo ${styles.largerGap}`}>Upper</span>
                  <span className={`hide-psuedo ${styles.largerGap}`}>Upper</span>
                  <span className={`hide-psuedo ${styles.largerGap}`}>Lower</span>
                </h6>
              </span>
              <span className={`hide-psuedo ${styles.squareBracketSm} p-0`}>
                <SquareBracketRight />
              </span>
            </span>
            <div className={styles.curlyDown}><CurlyBracketDown /></div>
            <span className={`hide-psuedo fs-lato-sm-italic`}>Capital</span>
          </span>
          <p className={`${styles.risklessPay} ${styles.italic}`}><LogoUsdc /> Now,</p>
          <span className='flex-column-center flex-start hide-psuedo p-0 mb-24'>
            <p>Receive (Lower Strike - Upper Strike) @ <span className={`${styles.italic} hide-psuedo p-0`}>{dayjs(currentExpiry, 'YYYYMMDD').format('DD MMM YY')}</span>.</p>
            <p>
              <p>Riskless Return</p>
              <span className={`hide-psuedo ${styles.curlySide} p-0`}><CurlyBracketLeft /></span>
              <span className='hide-psuedo flex-column-center p-0'>
                <span className='hide-psuedo'>Lower Strike - Upper Strike</span>
                <div className={styles.divider}></div>
                <span className={`hide-psuedo fs-lato-sm-italic`}>Capital</span>
              </span>
              <span className={`hide-psuedo ${styles.curlySide} p-0`}><CurlyBracketRight /></span>
              <LogoUsdc />.
            </p>
          </span>
        </p>
      </p>
      <p className='flex-row'>
        <p className={styles.risklessPay}>ii. Pay</p>
        <p>
          <span className='flex-column-center hide-psuedo p-0'>
            <span className='hide-psuedo flex-row'>
              <span className={`hide-psuedo ${styles.squareBracketLg} p-0`}>
                <SquareBracketLeft />
              </span>
              <span className='flex-column-center flex-start hide-psuedo p-0'>
                <span className='hide-psuedo p-0'>+ Put</span>
                <span className='hide-psuedo p-0'>- Call</span>
                <span className='hide-psuedo p-0'>+ Next Auction Forward</span>
              </span>
              <span className={`hide-psuedo ${styles.squareBracketLg} p-0`}>
                <SquareBracketRight />
              </span>
            </span>
            <span className='flex-column-center lg'>
              <span className='hide-psuedo p-0'>Forward Strike - (Call - Put)</span>
            </span>
            <div className={styles.curlyDown}><CurlyBracketDown /></div>
            <span className={`hide-psuedo fs-roboto-md-italic`}>Capital</span>
          </span>
          <p className={`${styles.risklessPay} ${styles.italic} ml-36`}><LogoUsdc /> Now,</p>
          <span className='flex-column-center flex-start hide-psuedo p-0 mb-24'>
            <p>Receive forward strike <LogoUsdc /> @ <span className={`${styles.italic} hide-psuedo p-0`}>{dayjs(currentExpiry, 'YYYYMMDD').format('DD MMM YY')}</span>.</p>
            <p>
              <p>Riskless Return</p>
              <span className={`hide-psuedo ${styles.curlySide} p-0`}><CurlyBracketLeft /></span>
              <span className='hide-psuedo flex-column-center p-0'>
                <span className='hide-psuedo'>Forward Strike</span>
                <div className={styles.divider}></div>
                <span className={`hide-psuedo fs-lato-sm-italic`}>Capital</span>
              </span>
              <span className={`hide-psuedo ${styles.curlySide} p-0`}><CurlyBracketRight /></span>
              <LogoUsdc />.
            </p>
          </span>
        </p>
      </p>
    </div>
  );
};

export default RisklessEarnInstructions;
