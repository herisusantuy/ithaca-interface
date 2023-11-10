// Packages
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

// Components
import Button from '@/UI/components/Button/Button';

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

  // Ensure tabs is defined and has at least one tab
  if (!tabs || tabs.length === 0) {
    return <div className={styles.tabs}>No tabs available.</div>;
  }

  // Get tab button styles from toggle state
  const getTabClass = (tabId: string) => {
    return tabId === activeTab ? styles.isActive : '';
  };

  const buttonsClass = `${styles.buttons} ${className || ''}`;

  return (
    <>
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
