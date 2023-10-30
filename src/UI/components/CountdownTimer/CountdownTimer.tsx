// Styles
import styles from './CountdownTimer.module.scss';

// Types
type CountdownProps = {};

const CountdownTimer = ({}: CountdownProps) => {
  return (
    <div className={styles.countdownTimer}>
      <p>Countdown Timer</p>
    </div>
  );
};

export default CountdownTimer;
