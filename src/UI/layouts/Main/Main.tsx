// Packages
import { useContext } from 'react';

// Components
import SlidingNav from '@/UI/components/SlidingNav/SlidingNav';

// Styles
import styles from './Main.module.scss';

// Types
type MainProps = {
  children: React.ReactNode;
};

const Main = (props: MainProps) => {
  const { children } = props;

  return (
    <>
      <main className={styles.Main}>{children}</main>
    </>
  );
};

export default Main;
