import { CHART_FAKE_DATA } from '@/UI/constants/charts';
import ChartPayoff from '../../ChartPayoff/ChartPayoff';
import { TradingStoriesProps } from '../../TradingStories';
import RadioButton from '@/UI/components/RadioButton/RadioButton';

import styles from './DigitalOptionsChart.module.scss';

const DigitalOptionsChart = ({ compact = false }: TradingStoriesProps) => {
  if (compact == true) {
    return (
      <div className={styles.container}>
        <RadioButton
          options={[
            { option: 'Call', value: 'DigitalCall' },
            { option: 'Put', value: 'DigitalPut' },
          ]}
          name='digital'
          selectedOption='Call'
          onChange={value => console.log(value)}
          width={160}
        />
        <ChartPayoff
          chartData={CHART_FAKE_DATA}
          height={120}
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

export default DigitalOptionsChart;
