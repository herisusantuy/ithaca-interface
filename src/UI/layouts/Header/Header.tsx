// Packages
import { useEffect, useRef, useState } from 'react';

// Components
import Navigation from '@/UI/components/Navigation/Navigation';
import Logo from '@/UI/components/Logo/Logo';
import SlidingNav from '@/UI/components/SlidingNav/SlidingNav';
import Hamburger from '@/UI/components/Hamburger/Hamburger';
import Wallet from '@/UI/components/Wallet/Wallet';
// import Rewards from '@/UI/components/Icons/Rewards';
import RewardsDropdown from '@/UI/components/RewardsDropdown/RewardsDropdown';

// Hooks
import useMediaQuery from '@/UI/hooks/useMediaQuery';

// Constants
import { DESKTOP_BREAKPOINT, MOBILE_BREAKPOINT, TABLET_BREAKPOINT } from '@/UI/constants/breakpoints';

// Styles
import styles from './Header.module.scss';
import { useClickOutside } from '@/UI/hooks/useClickoutside';
import { useEscKey } from '@/UI/hooks/useEscKey';
import { useRouter } from 'next/navigation';
import { useAccount, useWalletClient } from 'wagmi';
import { useAppStore } from '@/UI/lib/zustand/store';

// Types
type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
  const { initIthacaSDK, disconnect } = useAppStore();
  const { data: walletClient } = useWalletClient();
  const tabletBreakpoint = useMediaQuery(TABLET_BREAKPOINT);
  const mobileBreakpoint = useMediaQuery(MOBILE_BREAKPOINT);
  const desktopBreakpoint = useMediaQuery(DESKTOP_BREAKPOINT);

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const handleHamburgerClick = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
    document.body.classList.toggle('is-active');
  };

  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const rewardsDropdownRef = useRef(null);

  // const toggleRewardsDropdown = () => {
  //   setIsRewardsOpen(!isRewardsOpen);
  // };

  // Close dropdown callback
  const closeRewardsDropdown = () => {
    setIsRewardsOpen(false);
  };
  const router = useRouter();
  // Hook to close the dropdown when clicking outside
  useClickOutside(rewardsDropdownRef, closeRewardsDropdown);

  // Hook to close the dropdown on ESC key press
  useEscKey(closeRewardsDropdown);

  useAccount({
    onDisconnect: disconnect,
  });


  useEffect(() => {
    if (!walletClient) return;
    initIthacaSDK(walletClient);
  }, [initIthacaSDK, walletClient]);

  return (
    <>
      <header className={`${styles.header} ${className || ''}`}>
        <div className={styles.container}>
          <div className={styles.left}>
            <span
              className={styles.logo}
              onClick={() => {
                router.push('/trading/dynamic-option-strategies');
              }}
            >
              <Logo />
            </span>
            {!desktopBreakpoint && !tabletBreakpoint && !mobileBreakpoint && <Navigation />}
          </div>
          <div className={styles.right}>
            {/* TODO: add EditProfileModal after editing a profile will not remove user shortcuts */}
            {/*<EditProfileModal trigger={<UserProfileIcon />} />*/}
            <Wallet />
            {(desktopBreakpoint || tabletBreakpoint || mobileBreakpoint) && (
              <Hamburger onClick={handleHamburgerClick} isActive={isHamburgerOpen} />
            )}
            {isRewardsOpen && <RewardsDropdown value={123} ref={rewardsDropdownRef} />}
          </div>
        </div>
      </header>
      {(tabletBreakpoint || mobileBreakpoint) && (
        <SlidingNav isActive={isHamburgerOpen} onClick={handleHamburgerClick} />
      )}
    </>
  );
};

export default Header;
