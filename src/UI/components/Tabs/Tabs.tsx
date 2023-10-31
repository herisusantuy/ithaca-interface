// Packages
import { ReactNode, useState } from 'react';

// Components
import Button from '@/UI/components/Button/Button';

// Styles
import styles from './Tabs.module.scss';
import { useRouter } from 'next/router';

// Types
type Tab = {
  id: string;
  label: string;
  content?: ReactNode;
  path?: string;
};

type TabsProps = {
  tabs: Tab[];
};

const Tabs = ({ tabs }: TabsProps) => {
  const router = useRouter()
  // Ensure tabs is defined and has at least one tab
  if (!tabs || tabs.length === 0) {
    return <div className={styles.tabs}>No tabs available.</div>;
  }
  const initialTab = tabs.find((t) => {
    return t.path === '/' ? router.pathname === t.path : router.pathname.includes(t.path || '');
  })
  console.log(initialTab)
  // Tab state
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [activeTab, setActiveTab] = useState(initialTab?.id || tabs[0]?.id);

  // Get tab button styles from toggle state
  const getTabClass = (tabId: string) => {
    return tabId === activeTab ? styles.isActive : '';
  };

  return (
    <>
      <div className={styles.buttons}>
        {tabs.map(tab => (
          <Button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              if (tab.path) {
                router.push(tab.path)
              }
            }}
            className={getTabClass(tab.id)}
            role='tab'
            aria-selected={tab.id === activeTab}
            aria-controls={`tab-panel-${tab.id}`}
            title='Click to select tab'
            variant='tab'
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
