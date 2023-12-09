// Utils
import { getTradingStoryMapper } from '@/UI/utils/TradingStoryMapper';

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

const Tab = ({ tab, isActive, onClick, tabClassName }: TabProps) => (
  <div
    className={`${styles.tab} ${isActive ? styles.isActive : ''} ${tabClassName}`}
    role='button'
    onClick={onClick}
  >
    <div className={styles.tabInfo}>
      <h3>{tab.title}</h3>
      <p>{tab.description}</p>
    </div>
    <div className={styles.tabChart}>{getTradingStoryMapper(tab.contentId, false, true)}</div>
  </div>
);

export default Tab;