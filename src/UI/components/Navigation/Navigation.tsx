// Packages
import { useRouter } from 'next/router';
import Link from 'next/link';

// Constants
import { NavigationItems, NAVIGATION_ITEMS } from '@/UI/constants/navigation';

// Styles
import styles from './Navigation.module.scss';

// Types
type NavigationProps = {
  onClick?: () => void;
  navigationItems?: NavigationItems[]
};

const Navigation = ({ onClick, navigationItems }: NavigationProps) => {
  const router = useRouter();

  const checkIsActivePath = (path: string) => {
    return path === '/' ? router.pathname === path : router.pathname.includes(path);
  };

  return (
    <nav className={styles.nav}>
      {(navigationItems || NAVIGATION_ITEMS).map(nav => (
        <Link
          key={nav.titleKey}
          href={nav.path}
          className={checkIsActivePath(nav.path) ? styles.isActive : ''}
          title={nav.titleKey}
          onClick={onClick}
        >
          {nav.displayText}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
