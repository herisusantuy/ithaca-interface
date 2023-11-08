// Packages
import React, { ReactNode, useState } from 'react';

// Styles
import styles from './TabCard.module.scss';
import { getTradingStoryMapper } from '@/UI/utils/TradingStoryMapper';

// Types
type SubTab = {
  id: string;
  label: string;
  contentId: string;
};

type MainTab = {
  id: string;
  title: string;
  description: ReactNode;
  contentId: string;
  subTabs?: SubTab[];
};

type TabCardProps = {
  tabs: MainTab[];
};

const TabCard = ({ tabs }: TabCardProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        {tabs.map((tab: MainTab) => (
          <div
            key={tab.id}
            className={`${styles.tab} ${activeTab.id === tab.id ? styles.isActive : ''}`}
            onClick={() => setActiveTab(tab)}
            role='button'
          >
            <div className={styles.tabInfo}>
              <h3>{tab.title}</h3>
              <p>{tab.description}</p>
            </div>
            <div>{getTradingStoryMapper(tab.contentId, true)}</div>
          </div>
        ))}
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.rightPanelHeader}>
          <h2>{activeTab.title}</h2>
          <p>Show Instructions</p>
        </div>
        <div>{getTradingStoryMapper(activeTab.contentId)}</div>
      </div>
    </div>
  );
};

export default TabCard;
