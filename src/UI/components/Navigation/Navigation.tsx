// Packages
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Constants
import { NAVIGATION_ITEMS } from '@/UI/constants/navigation';

// Components
import ChevronDown from '@/UI/components/Icons/ChevronDown';

// Lib
import { useAppStore } from '@/UI/lib/zustand/store';

// Styles
import styles from './Navigation.module.scss';

// Types
type NavigationProps = {
  onClick?: () => void;
};

const Navigation = ({ onClick }: NavigationProps) => {
  const router = useRouter();
  const [totalOpenOrders, setTotalOpenOrders] = useState<number>(0);
  const { ithacaSDK, isAuthenticated, openOrdersCount } = useAppStore();

  const checkIsActivePath = (path: string) => {
    return path === '/' ? router.pathname === path : router.pathname.includes(path.split('/')[1]);
  };

  useEffect(() => {
    if (isAuthenticated) {
      ithacaSDK.orders.clientOpenOrders().then(res => setTotalOpenOrders(res.length));
    } else {
      setTotalOpenOrders(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  useEffect(() => setTotalOpenOrders(openOrdersCount), [openOrdersCount]);

  return (
    <nav className={styles.nav}>
      {NAVIGATION_ITEMS.map(nav => (
        <Link
          key={nav.titleKey}
          href={!nav.disabled ? nav.path : router.pathname}
          className={checkIsActivePath(nav.path) ? styles.isActive : nav.disabled ? styles.disabled : ''}
          title={nav.titleKey}
          onClick={() => { if (!nav.disabled && onClick) onClick() }}
        >
          {nav.displayText}
          {nav.displayText === 'More' && <ChevronDown />}
          {nav.displayText === 'Dashboard' && totalOpenOrders > 0 && (
            <span className={styles.badge}>{totalOpenOrders}</span>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
