// Packages
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Components
import Navigation from '@/UI/components/Navigation/Navigation';
import Logo from '@/UI/components/Logo/Logo';
import SlidingNav from '@/UI/components/SlidingNav/SlidingNav';
import Hamburger from '@/UI/components/Hamburger/Hamburger';
import Bell from '@/UI/components/Icons/Bell';

// Hooks
import useMediaQuery from '@/UI/hooks/useMediaQuery';

// Constants
import { TABLET_BREAKPOINT } from '@/UI/constants/breakpoints';

// Styles
import styles from './Header.module.scss';

// Types
type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const tabletBreakpoint = useMediaQuery(TABLET_BREAKPOINT);

  const handleHamburgerClick = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
    document.body.classList.toggle('is-active');
  };

  return (
    <header className={`${styles.header} ${className || ''}`}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Logo />
          {!tabletBreakpoint && <Navigation />}
        </div>
        <div className={styles.right}>
          <Bell />
          <ConnectButton />
          {tabletBreakpoint && <Hamburger onClick={handleHamburgerClick} isActive={isHamburgerOpen} />}
        </div>
      </div>
      {tabletBreakpoint && <SlidingNav isActive={isHamburgerOpen} onClick={handleHamburgerClick} />}
    </header>
  );
};

export default Header;
