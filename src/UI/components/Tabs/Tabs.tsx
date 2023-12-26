// Packages
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

// Components
import Button from '@/UI/components/Button/Button';
import DropdownMenu, { DropDownOption } from '../DropdownMenu/DropdownMenu';

// Constants
import { TABLET_BREAKPOINT } from '@/UI/constants/breakpoints';

// Hooks
import useMediaQuery from '@/UI/hooks/useMediaQuery';

// Styles
import styles from './Tabs.module.scss';

// Types
type Tab = {
  id: string;
  label: string;
  content?: ReactNode;
  path?: string;
};

type TabsProps = {
  tabs: Tab[];
  className?: string;
  activeTab: string;
  onChange?: (tabId: string) => void;
};

const Tabs = ({ tabs, className, activeTab, onChange }: TabsProps) => {
  const router = useRouter();
  const tabletBreakpoint = useMediaQuery(TABLET_BREAKPOINT);

  // Ensure tabs is defined and has at least one tab
  if (!tabs || tabs.length === 0) {
    return <div className={styles.tabs}>No tabs available.</div>;
  }

  // Get tab button styles from toggle state
  const getTabClass = (tabId: string) => {
    return tabId === activeTab ? styles.isActive : '';
  };

  const buttonsClass = `${styles.buttons} ${className || ''} mb-24`;

  // Transform tabs into dropdown options
  const dropdownOptions: DropDownOption[] = tabs.map(tab => ({
    name: tab.label,
    value: tab.id,
  }));

  // Find the current active option
  const activeOption = dropdownOptions.find(option => option.value === activeTab);

  const handleDropdownChange = (value: string) => {
    const selectedTab = tabs.find(tab => tab.id === value);
    if (selectedTab) {
      onChange?.(selectedTab.id);
      if (selectedTab.path) {
        router.push(selectedTab.path);
      }
    }
  };

  return (
    <>
      {tabletBreakpoint ? (
        <DropdownMenu
          options={dropdownOptions}
          value={activeOption}
          onChange={value => handleDropdownChange(value)}
          type='tablet'
          className='mb-16'
        />
      ) : (
        <div className={buttonsClass.trim()}>
          {tabs.map(tab => (
            <Button
              key={tab.id}
              onClick={e => {
                e.stopPropagation();
                onChange?.(tab.id);
                if (tab.path) {
                  router.push(tab.path);
                }
              }}
              className={getTabClass(tab.id)}
              role='tab'
              aria-selected={tab.id === activeTab}
              aria-controls={`tab-panel-${tab.id}`}
              title='Click to select tab'
            >
              {tab.label}
            </Button>
          ))}
        </div>
      )}

      {tabs.map(
        tab =>
          tab.id === activeTab && (
            <div
              key={tab.id}
              role='tabpanel'
              id={`tab-panel-${tab.id}`}
              aria-labelledby={tab.id}
              className={styles.tabContent}
            >
              {tab.content}
            </div>
          )
      )}
    </>
  );
};

export default Tabs;
