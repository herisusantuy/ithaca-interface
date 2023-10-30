// Packages
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';

// Components
import Navigation from '@/UI/components/Navigation/Navigation';
import Logo from '@/UI/components/Logo/Logo';
import SlidingNav from '@/UI/components/SlidingNav/SlidingNav';
import Hamburger from '@/UI/components/Hamburger/Hamburger';

// Hooks
import useMediaQuery from '@/UI/hooks/useMediaQuery';

// Constants
import { TABLET_BREAKPOINT } from '@/UI/constants/breakpoints';

// Styles
import styles from './Header.module.scss';

const Header = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const tabletBreakpoint = useMediaQuery(TABLET_BREAKPOINT);
  const router = useRouter();

  const handleHamburgerClick = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
    document.body.classList.toggle('is-active');
  };

  const getHeaderClassName = () => {
    let className = styles.header;
    if (router.pathname === '/components') {
      className += ` ${styles.headerComponents}`;
    }
    return className;
  };

  return (
    <header className={getHeaderClassName()}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Logo />
          {!tabletBreakpoint && <Navigation />}
        </div>
        <div className={styles.right}>
          <ConnectButton />
          {tabletBreakpoint && <Hamburger onClick={handleHamburgerClick} isActive={isHamburgerOpen} />}
        </div>
      </div>
      {tabletBreakpoint && <SlidingNav isActive={isHamburgerOpen} onClick={handleHamburgerClick} />}
    </header>
  );
};

export default Header;
