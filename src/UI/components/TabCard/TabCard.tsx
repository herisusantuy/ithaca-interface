// Packages
import React, { Dispatch, ReactNode, SetStateAction, useState } from 'react';

// Styles
import styles from './TabCard.module.scss';
import { getTradingStoryMapper } from '@/UI/utils/TradingStoryMapper';
import Toggle from '../Toggle/Toggle';

// Types
type MainTab = {
  id: string;
  title: string;
  description: ReactNode;
  contentId: string;
};

type TabCardProps = {
  className?: string;
  tabs: MainTab[];
  showInstructions: boolean;
  setShowInstructions: Dispatch<SetStateAction<boolean>>;
};

const TabCard = ({ className, tabs, showInstructions, setShowInstructions }: TabCardProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className={`${styles.container} ${className}`}>
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
            <div className={styles.tabChart}>{getTradingStoryMapper(tab.contentId, false, true)}</div>
          </div>
        ))}
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.rightPanelHeader}>
          <h2>{activeTab.title}</h2>
          <Toggle
            size='sm'
            defaultState={showInstructions ? 'right' : 'left'}
            rightLabel='Show Instructions'
            onChange={() => setShowInstructions(!showInstructions)}
          />
        </div>
        {getTradingStoryMapper(activeTab.contentId, showInstructions)}
      </div>
    </div>
  );
};

export default TabCard;
