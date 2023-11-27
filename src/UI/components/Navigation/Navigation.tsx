// Packages
import { useRouter } from 'next/router';
import Link from 'next/link';

// Constants
import { NAVIGATION_ITEMS } from '@/UI/constants/navigation';

// Components
import ChevronDown from '@/UI/components/Icons/ChevronDown';

// Styles
import styles from './Navigation.module.scss';

// Types
type NavigationProps = {
  onClick?: () => void;
};

const Navigation = ({ onClick }: NavigationProps) => {
  const router = useRouter();

  const checkIsActivePath = (path: string) => {
    return path === '/' ? router.pathname === path : router.pathname.includes(path.split('/')[1]);
  };

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
          {/** TO DO: If user has open orders show the number in the badge, else hide the badge*/}
          {nav.displayText === 'Dashboard' && <span className={styles.badge}>2</span>}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
