// Packages
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';

// Utils
import { getTradingStoryMapper } from '@/UI/utils/TradingStoryMapper';

// Components
import Toggle from '@/UI/components/Toggle/Toggle';

// Styles
import styles from './TabCard.module.scss';
import RadioButton from '../RadioButton/RadioButton';

// Types
type MainTab = {
  id: string;
  title: string;
  description: ReactNode;
  contentId: string;
  radioOptions?: {
    option: string;
    value: string;
  }[]
};

type TabCardProps = {
  className?: string;
  tabs: MainTab[];
  showInstructions: boolean;
  setShowInstructions: Dispatch<SetStateAction<boolean>>;
  tabClassName?: string;
};

const TabCard = ({ className, tabs, showInstructions, setShowInstructions, tabClassName }: TabCardProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [radioChosen, setRadioChosen] = useState(activeTab.radioOptions && activeTab.radioOptions[0].value || '');

  useEffect(() => {
    setRadioChosen(activeTab.radioOptions && activeTab.radioOptions[0].value || '')
  }, [activeTab.radioOptions])
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.leftPanel}>
        {tabs.map((tab: MainTab) => (
          <div
            key={tab.id}
            className={`${styles.tab} ${activeTab.id === tab.id ? styles.isActive : ''} ${tabClassName}`}
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
          {activeTab.id !== 'earn' && activeTab.id !== 'bonusTwinWin' ?<h2>{activeTab.title}</h2> : <RadioButton
              size='large'
              options={activeTab.radioOptions || []}
              selectedOption={radioChosen}
              name={`${activeTab.id}-type`}
              onChange={setRadioChosen}
              width={300}
            />}
            <div className={styles.toggleWrapper}>
              <Toggle
                size='sm'
                defaultState={showInstructions ? 'right' : 'left'}
                rightLabel='Show Instructions'
                onChange={() => setShowInstructions(!showInstructions)}
              />
              </div>
        </div>
        {getTradingStoryMapper(activeTab.contentId, showInstructions, false, radioChosen)}
      </div>
    </div>
  );
};

export default TabCard;
