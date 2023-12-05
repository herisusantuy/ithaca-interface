// Utils
import { getTradingStoryMapper } from '@/UI/utils/TradingStoryMapper';

// Components
import Dropdown from '../Icons/Dropdown';

// Styles
import styles from './TabCard.module.scss';

// Types
import { MainTab } from './TabCard';
type TabCardMobileProps = {
  activeDropdown: boolean;
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  setActiveDropdown: (activeDropdown: boolean) => void;
  tabClassName?: string;
  openOptions: MainTab[]
};

const TabCardMobile = (
  { activeDropdown,
    setActiveDropdown,
    openOptions,
    activeTab,
    setActiveTab,
    tabClassName
  }: TabCardMobileProps) => {

  return (
    <div style={{ maxHeight: activeDropdown ? '3000px' : '151px' }} className={styles.dropDownPanel}>
      {
        <div className={`${styles.tab} ${tabClassName}`}>
          <div className={styles.tabInfo}>
            <h3>{activeTab.title}</h3>
            <p>{activeTab.description}</p>
          </div>
          <div className={styles.tabChart}>{getTradingStoryMapper(activeTab.contentId, false, true)}</div>
        </div>
      }
      {openOptions.map((tab: MainTab) => (
        <div
          key={tab.id}
          className={`${styles.tab} ${tabClassName}`}
          onClick={() => { setActiveTab(tab), setActiveDropdown(false) }}
        >
          <div className={styles.tabInfo}>
            <h3>{tab.title}</h3>
            <p>{tab.description}</p>
          </div>
          <div className={styles.tabChart}>{getTradingStoryMapper(tab.contentId, false, true)}</div>
        </div>
      ))
      }
      <button onClick={() => setActiveDropdown(!activeDropdown)} className={styles.openStoriesDropdown}>
        <Dropdown />
      </button>
    </div>
  );
};

export default TabCardMobile;
