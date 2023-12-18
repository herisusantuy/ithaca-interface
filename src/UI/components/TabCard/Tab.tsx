// Utils
import { getTradingStoryMapper } from '@/UI/utils/TradingStoryMapper';
import { useState } from 'react';

// Components
import { MainTab } from './TabCard';

// Styles
import styles from './TabCard.module.scss';

// Types
type TabProps = {
  tab: MainTab;
  isActive: boolean;
  onClick: () => void;
  tabClassName?: string;
};

const Tab = ({ tab, isActive, onClick, tabClassName }: TabProps) => {
  const [description, setDescription] = useState(tab.radioOptions ? tab.radioOptions[0].description : tab.description);
  return (
    <div
      className={`${styles.tab} ${isActive ? styles.isActive : ''} ${tabClassName}`}
      role='button'
      onClick={onClick}
    >
      <div className={styles.tabInfo}>
        <h3>{tab.title}</h3>
        <p>{description}</p>
      </div>
      <div className={styles.tabChart}>{getTradingStoryMapper(tab.contentId, false, true, undefined, (option) => {
        setDescription(tab.radioOptions ? tab.radioOptions.find((o) => option === o.value)?.description : tab.description)
      })}</div>
    </div>
  )
};

export default Tab;