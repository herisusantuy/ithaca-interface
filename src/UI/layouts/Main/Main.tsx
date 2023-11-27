import { useContext } from 'react';
// Styles
import styles from './Main.module.scss';

// Hooks
import useMediaQuery from '@/UI/hooks/useMediaQuery';

// Constants
import { TABLET_BREAKPOINT } from '@/UI/constants/breakpoints';
import SlidingNav from '@/UI/components/SlidingNav/SlidingNav';

import { NavCTX } from '@/UI/lib/provider/NavProvider';

// Types
type MainProps = {
  children: React.ReactNode;
};

const Main = (props: MainProps) => {
  const { children } = props;
  const tabletBreakpoint = useMediaQuery(TABLET_BREAKPOINT);

  const { isHamburgerOpen, handleHamburgerClick } = useContext(NavCTX);

  return (
    <>
      <main className={styles.Main}>{children}</main>
      {tabletBreakpoint && <SlidingNav isActive={isHamburgerOpen} onClick={handleHamburgerClick} />}
    </>
  );
};

export default Main;
