// Packages
import { TooltipProps } from 'recharts';

// Components
import LogoEth from '@/UI/components/Icons/LogoEth';

// Styles
import styles from './ChartMaxPain.module.scss';

// Types
type ValueType = number;
type NameType = string;

const ChartTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as { name: string; volume: number };

    return (
      <div className={styles.tooltip}>
        <p>{data.name}</p>
        <span>
          <span className={styles.number}>{data.volume}</span> <LogoEth /> WETH
        </span>
      </div>
    );
  }

  return null;
};

export default ChartTooltip;
