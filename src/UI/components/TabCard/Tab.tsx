// Utils
import { MOBILE_BREAKPOINT, TABLET_BREAKPOINT } from '@/UI/constants/breakpoints';
import useMediaQuery from '@/UI/hooks/useMediaQuery';
import { getTradingStoryMapper } from '@/UI/utils/TradingStoryMapper';
import { useState } from 'react';

// Components
import { MainTab } from './TabCard';

// Styles
import styles from './TabCard.module.scss';

// Types
type TabProps = {
  tab: MainTab;
  isActive: boolean;
  onClick: () => void;
  tabClassName?: string;
};

const Tab = ({ tab, isActive, onClick, tabClassName }: TabProps) => {
  const [description, setDescription] = useState(tab.description);

  const mobileBreakpoint = useMediaQuery(MOBILE_BREAKPOINT);
  const tabletBreakpoint = useMediaQuery(TABLET_BREAKPOINT);
  return (
    <div
      className={`${styles.tab} ${isActive ? styles.isActive : ''} ${tabClassName}`}
      role='button'
      onClick={onClick}
    >
      <div className={styles.tabInfo}>
        <h3>{tab.title}</h3>
        <p>{description}</p>
      </div>
      <div className={styles.tabChart}>{getTradingStoryMapper(tab.contentId, false, true, undefined, (desc) => {
        setDescription(desc)
      }, mobileBreakpoint, tabletBreakpoint)}</div>
    </div>
  )
};

export default Tab;