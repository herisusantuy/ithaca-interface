// Styles
import Toast from '@/UI/components/Toast/Toast';
import styles from './Main.module.scss';
import { ToastCTX } from '@/UI/lib/context/ToastProvider';
import { useContext } from 'react';

// Types
type MainProps = {
  children: React.ReactNode;
};

const Main = (props: MainProps) => {
  const { children } = props;
  const {toastList, position} = useContext(ToastCTX);

  return (
    <main className={styles.Main}>
      {children}
      <Toast toastList={toastList} position={position} />
    </main>
  );
};

export default Main;
