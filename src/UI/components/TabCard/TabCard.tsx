// Packages
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';

// Utils
import { getTradingStoryMapper } from '@/UI/utils/TradingStoryMapper';
import { useDevice } from '@/UI/hooks/useDevice';
import { useLastUrlSegment } from '@/UI/hooks/useLastUrlSegment';

// Components
import Toggle from '@/UI/components/Toggle/Toggle';
import TabCardMobile from './TabCardMobile'
import TabCardDesktop from './TabCardDesktop';

// Styles
import styles from './TabCard.module.scss';
import RadioButton from '../RadioButton/RadioButton';

// Types
export type MainTab = {
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

  const device = useDevice()
  const lastSegment = useLastUrlSegment()

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [radioChosen, setRadioChosen] = useState(activeTab.radioOptions && activeTab.radioOptions[0].value || '');
  const [openOptions, setOpenOptions] = useState<MainTab[]>([])
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false)

  useEffect(() => {
    setRadioChosen(activeTab.radioOptions && activeTab.radioOptions[0].value || '')
    const options = tabs.filter(tab => tab.id !== activeTab.id);
    setOpenOptions(options)
  }, [activeTab, tabs])

  useEffect(() => {
  }, [openOptions, activeDropdown])

  return (
    <div className={`tabCard--${lastSegment} ${styles.container} ${className}`}>
      {
        device !== 'desktop'
          ?
          <TabCardMobile
            activeTab={activeTab}
            activeDropdown={activeDropdown}
            setActiveTab={setActiveTab}
            tabClassName={tabClassName}
            setActiveDropdown={setActiveDropdown}
            openOptions={openOptions}
          />
          :
          <TabCardDesktop
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabClassName={tabClassName}
          />
      }
      <div className={`tabCard--${activeTab.id} ${styles.rightPanel}`}>
        <div className={`rightPanelHeader--${activeTab.id} ${styles.rightPanelHeader}`}>
          {activeTab.id !== 'earn' && activeTab.id !== 'bonusTwinWin' ? <h2>{activeTab.title}</h2> : <RadioButton
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
