// Components
import LogoEth from '@/UI/components/Icons/LogoEth';

// Styles
import styles from './Instructions.module.scss';
import dayjs from 'dayjs';
import ChevronRight from '../Icons/ChevronRight';
import ChevronLeft from '../Icons/ChevronLeft';

type BarrierDescriptionProps = {
  inOrOut: string; // Possible values: 'IN', 'OUT'
  buyOrSell: string; // Possible values: 'BUY', 'SELL'
  upOrDown: string; // Possible values: 'UP', 'DOWN'
  currentExpiryDate: string;
  strikeAmount?: string;
  barrierAmount?: string;
};

const BarrierDescription = ({
  inOrOut,
  buyOrSell,
  upOrDown,
  currentExpiryDate,
  strikeAmount = '',
  barrierAmount = '',
}: BarrierDescriptionProps) => {
  let description = <></>;

  if (buyOrSell === 'BUY' && upOrDown === 'UP' && inOrOut === 'IN') {
    description = (
      <>
        <span>Buy UP and IN and pay</span>
        <span>premium if you think</span>
        <span>
          <LogoEth /> @ <i>{dayjs(currentExpiryDate).format('DD MMM YY')}</i> UP from
        </span>
        <span>{strikeAmount}</span>
        <span>and not INside</span>
        <span>(<ChevronRight/>) {barrierAmount};</span>
        <span>if not, premium lost.</span>
      </>
    );
  } else if (buyOrSell === 'BUY' && upOrDown === 'DOWN' && inOrOut === 'IN') {
    description = (
      <>
        <span>Buy DOWN and IN and pay</span>
        <span>premium if you think</span>
        <span>
          <LogoEth /> @ <i>{dayjs(currentExpiryDate).format('DD MMM YY')}</i> DOWN from
        </span>
        <span>{strikeAmount}</span>
        <span>and INside</span>
        <span>(<ChevronLeft/>) {barrierAmount};</span>
        <span>if not, premium lost.</span>
      </>
    );
  } else if (buyOrSell === 'BUY' && upOrDown === 'UP' && inOrOut === 'OUT') {
    description = (
      <>
        <span>Buy UP and OUT and pay</span>
        <span>premium if you think</span>
        <span>
          <LogoEth /> @ <i>{dayjs(currentExpiryDate).format('DD MMM YY')}</i> UP from
        </span>
        <span>{strikeAmount}</span>
        <span>and INside</span>
        <span>(<ChevronLeft/>) {barrierAmount}; </span>
        <span>if not, premium lost.</span>
      </>
    );
  } else if (buyOrSell === 'BUY' && upOrDown === 'DOWN' && inOrOut === 'OUT') {
    description = (
      <>
        <span>Buy DOWN and OUT and pay</span>
        <span>premium if you think</span>
        <span>
          <LogoEth /> @ <i>{dayjs(currentExpiryDate).format('DD MMM YY')}</i> DOWN from
        </span>
        <span>{strikeAmount}</span>
        <span>and INside</span>
        <span>(<ChevronRight/>) {barrierAmount}; </span>
        <span>if not, premium lost.</span>
      </>
    );
  } else if (buyOrSell === 'SELL' && upOrDown === 'UP' && inOrOut === 'IN') {
    description = (
      <>
        <span>Sell UP and IN and earn</span>
        <span>premium if you think</span>
        <span>
          <LogoEth /> @ <i>{dayjs(currentExpiryDate).format('DD MMM YY')}</i> NOT UP from
        </span>
        <span>{strikeAmount}</span>
        <span>or INside</span>
        <span>(<ChevronLeft/>) {barrierAmount};</span>
        <span>
          if not, pay <LogoEth /> - strike.
        </span>
      </>
    );
  } else if (buyOrSell === 'SELL' && upOrDown === 'DOWN' && inOrOut === 'IN') {
    description = (
      <>
        <span>Sell DOWN and IN and earn</span>
        <span>premium if you think</span>
        <span>
          <LogoEth /> @ <i>{dayjs(currentExpiryDate).format('DD MMM YY')}</i> NOT DOWN from
        </span>
        <span>{strikeAmount}</span>
        <span>or NOT INside</span>
        <span>(<ChevronRight/>) {barrierAmount};</span>
        <span>
          if not, pay <LogoEth /> - strike.
        </span>
      </>
    );
  } else if (buyOrSell === 'SELL' && upOrDown === 'UP' && inOrOut === 'OUT') {
    description = (
      <>
        <span>Sell UP and OUT and earn</span>
        <span>premium if you think</span>
        <span>
          <LogoEth /> @ <i>{dayjs(currentExpiryDate).format('DD MMM YY')}</i> NOT UP from
        </span>
        <span>{strikeAmount}</span>
        <span>or NOT INside</span>
        <span>(<ChevronRight/>) {barrierAmount};</span>
        <span>
          if not, pay <LogoEth /> - strike.
        </span>
      </>
    );
  } else if (buyOrSell === 'SELL' && upOrDown === 'DOWN' && inOrOut === 'OUT') {
    description = (
      <>
        <span>Sell DOWN and OUT and earn</span>
        <span>premium if you think</span>
        <span>
          <LogoEth /> @ <i>{dayjs(currentExpiryDate).format('DD MMM YY')}</i> NOT DOWN
        </span>
        <span>{strikeAmount}</span>
        <span>or NOT INside</span>
        <span>(<ChevronLeft/>) {barrierAmount}; </span>
        <span>
          if not, pay <LogoEth /> - strike.
        </span>
      </>
    );
  }

  return <p className={styles.description}>{description}</p>;
};

export default BarrierDescription;
