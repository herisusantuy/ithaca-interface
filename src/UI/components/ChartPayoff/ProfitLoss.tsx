// Components
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';

// Styles
import styles from './ChartPayoff.module.scss';

// Utils
import { getNumberFormat } from '@/UI/utils/Numbers';

// Types
type ProfitLossProps = {
  value: number;
  isChartHovered: boolean;
};

const ProfitLoss = (props: ProfitLossProps) => {
  const { value, isChartHovered } = props;
  const formattedValue = getNumberFormat(value);

  const renderProfitLoss = () => {
    if (!isChartHovered) {
      return <p>-</p>;
    }

    const sign = value >= 0 ? '+' : '-';
    const className = value < 0 ? styles.redColor : styles.greenColor;
    return (
      <p className={className}>
        {sign}
        {formattedValue}
      </p>
    );
  };

  return (
    <>
      <h3>Potential P&L:</h3>
      {renderProfitLoss()}
      <LogoUsdc />
    </>
  );
};

export default ProfitLoss;
