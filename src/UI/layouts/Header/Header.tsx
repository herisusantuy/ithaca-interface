// Packages
import { useRef, useState } from 'react';

// Components
import Navigation from '@/UI/components/Navigation/Navigation';
import Logo from '@/UI/components/Logo/Logo';
import SlidingNav from '@/UI/components/SlidingNav/SlidingNav';
import Hamburger from '@/UI/components/Hamburger/Hamburger';
import Bell from '@/UI/components/Icons/Bell';
import Wallet from '@/UI/components/Wallet/Wallet';
import Rewards from '@/UI/components/Icons/Rewards';
import RewardsDropdown from '@/UI/components/RewardsDropdown/RewardsDropdown';

// Hooks
import useMediaQuery from '@/UI/hooks/useMediaQuery';

// Constants
import { TABLET_BREAKPOINT } from '@/UI/constants/breakpoints';

// Styles
import styles from './Header.module.scss';
import { useClickOutside } from '@/UI/hooks/useClickoutside';
import { useEscKey } from '@/UI/hooks/useEscKey';

// Types
type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
  const tabletBreakpoint = useMediaQuery(TABLET_BREAKPOINT);

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const handleHamburgerClick = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
    document.body.classList.toggle('is-active');
  };

  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const rewardsDropdownRef = useRef(null);

  const toggleRewardsDropdown = () => {
    setIsRewardsOpen(!isRewardsOpen);
  };

  // Close dropdown callback
  const closeRewardsDropdown = () => {
    setIsRewardsOpen(false);
  };

  // Hook to close the dropdown when clicking outside
  useClickOutside(rewardsDropdownRef, closeRewardsDropdown);

  // Hook to close the dropdown on ESC key press
  useEscKey(closeRewardsDropdown);

  return (
    <header className={`${styles.header} ${className || ''}`}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Logo />
          {!tabletBreakpoint && <Navigation />}
        </div>
        <div className={styles.right}>
          <Bell />
          <Rewards onClick={toggleRewardsDropdown} strokeColor={isRewardsOpen ? 'white' : undefined} />
          <Wallet />
          {tabletBreakpoint && <Hamburger onClick={handleHamburgerClick} isActive={isHamburgerOpen} />}
          {isRewardsOpen && <RewardsDropdown value={123} ref={rewardsDropdownRef} />}
        </div>
      </div>
      {tabletBreakpoint && <SlidingNav isActive={isHamburgerOpen} onClick={handleHamburgerClick} />}
    </header>
  );
};

export default Header;
