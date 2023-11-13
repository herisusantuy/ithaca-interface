import { CHART_FAKE_DATA } from '@/UI/constants/charts/charts';
import ChartPayoff from '../../ChartPayoff/ChartPayoff';
import { TradingStoriesProps } from '@/UI/components/Market';
import RadioButton from '@/UI/components/RadioButton/RadioButton';

import styles from './OptionsChart.module.scss';

const OptionsChart = ({ compact = false }: TradingStoriesProps) => {
  if (compact == true) {
    return (
      <div className={styles.container}>
        <RadioButton
          options={[
            { option: 'Call', value: 'Call' },
            { option: 'Put', value: 'Put' },
          ]}
          name='callOrPut'
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

export default OptionsChart;
