import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';
import ChartPayoff from '../../ChartPayoff/ChartPayoff';
import { TradingStoriesProps } from '../../TradingStories';

import styles from './ForwardChart.module.scss'

const ForwardChart = ({ compact = false }: TradingStoriesProps) => {
  if (compact == true) {
    return (
      <div className={styles.container}>
        <ChartPayoff
          chartData={CHART_FAKE_DATA}
          height={150}
          showKeys={false}
          showPortial={false}
          showUnlimited={false}
        />
      </div>
    );
  } else {
    return <></>;
  }
};

export default ForwardChart;
