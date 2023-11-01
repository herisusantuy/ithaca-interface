// Packages
import useFromStore from '@/UI/hooks/useFromStore';
import { useAppStore } from '@/UI/lib/zustand/store';
import React, { useState, useEffect } from 'react';

// Styles
import styles from './CountdownTimer.module.scss';

const CountdownTimer = () => {
  const { fetchNextAuction } = useAppStore();
  const nextAuction = useFromStore(useAppStore, state => state.nextAuction)
  const [time, setTime] = useState({
    hours: nextAuction?.hour || 0,
    minutes: nextAuction?.minute || 0,
    seconds: nextAuction?.second || 0,
  });

  useEffect(() => {
    const resetTimer = () => {
      fetchNextAuction();
      setTime({
        hours: nextAuction?.hour || 0,
        minutes: nextAuction?.minute || 0,
        seconds: nextAuction?.second || 0,
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
      } 
      if (seconds === 0 && minutes === 0 && hours === 0) {
        resetTimer()
      }
      else {
        setTime({
          hours, minutes, seconds
        })
      }
    };

    const interval = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [time, nextAuction, fetchNextAuction]);

  return (
    <div className={styles.countdownTimer}>
      {time.hours.toString().padStart(2, '0')} <span>Hrs</span> : {time.minutes.toString().padStart(2, '0')}
      <span>Mins</span> : {time.seconds.toString().padStart(2, '0')} <span>Secs</span>
    </div>
  );
};

export default CountdownTimer;
