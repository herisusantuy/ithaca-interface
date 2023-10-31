// Packages
import React, { useState, useEffect } from 'react';

// Styles
import styles from './CountdownTimer.module.scss';

// Types
type CountdownTimerProps = {
  durationHours?: number;
  durationMinutes?: number;
  durationSeconds?: number;
};

const CountdownTimer = ({ durationHours = 0, durationMinutes = 59, durationSeconds = 59 }: CountdownTimerProps) => {
  const [time, setTime] = useState({
    hours: durationHours,
    minutes: durationMinutes,
    seconds: durationSeconds,
  });

  useEffect(() => {
    const resetTimer = () => {
      setTime({
        hours: durationHours,
        minutes: durationMinutes,
        seconds: durationSeconds,
      });
    };

    const decrementTime = () => {
      let { hours, minutes, seconds } = time;

      if (seconds > 0) {
        seconds--;
      } else if (minutes > 0) {
        minutes--;
        seconds = 59;
      } else if (hours > 0) {
        hours--;
        minutes = 59;
        seconds = 59;
      } else {
        resetTimer();
      }

      setTime({ hours, minutes, seconds });
    };

    const interval = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [time, durationHours, durationMinutes, durationSeconds]);

  return (
    <div className={styles.countdownTimer}>
      {time.hours.toString().padStart(2, '0')} <span>Hrs</span> : {time.minutes.toString().padStart(2, '0')}
      <span>Mins</span> : {time.seconds.toString().padStart(2, '0')} <span>Secs</span>
    </div>
  );
};

export default CountdownTimer;
