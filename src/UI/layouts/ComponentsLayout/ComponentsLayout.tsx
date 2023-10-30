// Packages
import { useEffect } from 'react';
import Prism from 'prismjs';

// Styles
import styles from './ComponentsLayout.module.scss';

// Types
type ComponentItem = {
  name: string;
  component: JSX.Element;
  code: string;
  scssCode: string | null;
  tsxFileName: string;
  scssFileName: string | null;
  status: string;
  lastUpdated: string;
};

type ComponentLayoutProps = {
  sidebarContent: JSX.Element[];
  selectedComponent: ComponentItem | null;
};

const ComponentLayout = ({ sidebarContent, selectedComponent }: ComponentLayoutProps) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [selectedComponent]);

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return styles.yellow;
      case 'Done':
        return styles.green;
      case 'Blocked':
        return styles.red;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>{sidebarContent}</div>
      <div className={styles.main}>
        {selectedComponent && (
          <>
            <div className={styles.info}>
              <span>
                Status:{' '}
                <span className={`${styles.badge} ${getBadgeColor(selectedComponent.status)}`}>
                  {selectedComponent.status}
                </span>
              </span>
              <span>
                Last Updated: <span>{new Date(selectedComponent.lastUpdated).toLocaleString()}</span>
              </span>
            </div>
            <div className={styles.component}>{selectedComponent.component}</div>
            <div className={styles.codeBlock}>
              <div className={styles.titleBar}>{selectedComponent.tsxFileName}</div>
              <pre>
                <code className='language-javascript'>{selectedComponent.code}</code>
              </pre>
            </div>
            {selectedComponent.scssCode && (
              <div className={styles.codeBlock}>
                <div className={styles.titleBar}>{selectedComponent.scssFileName}</div>
                <pre>
                  <code className='language-css'>{selectedComponent.scssCode}</code>
                </pre>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ComponentLayout;
