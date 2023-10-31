// Packages
import React, { ReactNode, useState } from 'react';

// Components
import Tabs from '@/UI/components/Tabs/Tabs';

// Utils
import { getChartMapper } from '@/UI/utils/ChartMapper';

// Styles
import styles from './TabCard.module.scss';

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
  // Tab card state
  const [selectedMainTab, setSelectedMainTab] = useState<string>(tabs[0]?.title || '');

  // Find the active tab
  const activeTab = tabs.find(tab => tab.title === selectedMainTab);

  // Get main tab class from tab card state
  const getMainTabClass = (tabName: string) => {
    return `${styles.tab} ${selectedMainTab === tabName ? styles.isActive : ''}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        {tabs.map((tab: MainTab) => (
          <div
            key={tab.id}
            className={getMainTabClass(tab.title)}
            onClick={() => setSelectedMainTab(tab.title)}
            role='button'
          >
            <div className={styles.tabInfo}>
              <h3>{tab.title}</h3>
              <p>{tab.description}</p>
            </div>
            <div className={styles.subTabs}>
              {tab.subTabs && (
                <Tabs
                  className='gap-0 mb-10'
                  tabs={tab.subTabs.map(subTab => ({
                    ...subTab,
                    content: getChartMapper(subTab.contentId),
                  }))}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.rightPanel}>{activeTab && getChartMapper(activeTab.contentId)}</div>
    </div>
  );
};

export default TabCard;
