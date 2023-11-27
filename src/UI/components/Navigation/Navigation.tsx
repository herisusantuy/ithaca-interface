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

// SDK
import { Order } from '@ithaca-finance/sdk';

// Styles
import styles from './Navigation.module.scss';

// Types
type NavigationProps = {
  onClick?: () => void;
};

const Navigation = ({ onClick }: NavigationProps) => {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const router = useRouter();
  const { ithacaSDK, isAuthenticated, unFilteredContractList } = useAppStore();

  const checkIsActivePath = (path: string) => {
    return path === '/' ? router.pathname === path : router.pathname.includes(path.split('/')[1]);
  };

  useEffect(() => {
    if (isAuthenticated) {
      ithacaSDK.orders.clientOpenOrders().then(res => {
        setOrderList(res);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <nav className={styles.nav}>
      {NAVIGATION_ITEMS.map(nav => (
        <Link
          key={nav.titleKey}
          href={nav.path}
          className={checkIsActivePath(nav.path) ? styles.isActive : ''}
          title={nav.titleKey}
          onClick={onClick}
        >
          {nav.displayText}
          {nav.displayText === 'More' && <ChevronDown />}
          {/** TO DO: If user has open orders show the number in the badge, else hide the badge */}
          {nav.displayText === 'Dashboard' && orderList.length > 0 && (
            <span className={styles.badge}>{orderList.length}</span>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
