// Packages
import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { createPortal } from 'react-dom';

// Hooks
import { useEscKey } from '@/UI/hooks/useEscKey';

// Utils
import { formatDate } from '@/UI/utils/DatePickerUtils';

// Components
import Calendar from '@/UI/components/Icons/Calendar';

// Styles
import styles from './DatePicker.module.scss';
import 'react-day-picker/dist/style.css';

// Types
type DateProps = {
  start?: Date | undefined;
  end?: Date | undefined;
  disabled?: boolean;
};

const DatePicker = ({ start, end, disabled = false }: DateProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [startDay, setStartDay] = useState<Date | undefined>(start);
  const [tempStartDay, setTempStartDay] = useState<Date | undefined>(start);
  const [endDay, setEndDay] = useState<Date | undefined>(end);
  const [tempEndDay, setTempEndDay] = useState<Date | undefined>(end);
  const [dateText, setDateText] = useState<JSX.Element | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const [optionsPostion, setOptionsPosition] = useState({ width: 0, top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    setMounted(true);
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [start, end]);

  useEscKey(() => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  });

  const handleDropdownClick = () => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    setOptionsPosition({
      width: 510,
      left: containerRect?.x ?? 0,
      top: (containerRect?.y ?? 0) + (containerRect?.height ?? 0) + document.documentElement.scrollTop + 1,
    });
    if (!disabled) setIsDropdownOpen(!isDropdownOpen);
  };

  const handleApplyClick = () => {
    if (startDay && endDay) {
      setTempEndDay(endDay);
      setTempStartDay(startDay);
      setDateText(
        <>
          <span dangerouslySetInnerHTML={{ __html: formatDate(startDay) }} />
          {' - '}
          <span dangerouslySetInnerHTML={{ __html: formatDate(endDay) }} />
        </>
      );
    } else if (startDay && !endDay) {
      setEndDay(startDay);
      setTempEndDay(startDay);
      setDateText(
        <>
          <span dangerouslySetInnerHTML={{ __html: formatDate(startDay) }} />
          {' - '}
          <span dangerouslySetInnerHTML={{ __html: formatDate(endDay) }} />
        </>
      );
    } else {
      setTempEndDay(endDay);
      setTempStartDay(startDay);
    }
    setIsDropdownOpen(false);
  };

  const handleCancelClick = () => {
    setStartDay(tempStartDay);
    setEndDay(tempEndDay);
    setIsDropdownOpen(false);
  };

  const selectStartDay = (e: Date | undefined) => {
    setStartDay(e);
  };

  const selectEndDay = (e: Date | undefined) => {
    setEndDay(e);
  };

  return (
    <>
      <div
        className={styles.datePickerContainer}
        onClick={() => handleDropdownClick()}
        ref={containerRef}
        role='button'
      >
        <div className={styles.dateInput}>{dateText}</div>
        <Calendar />
      </div>

      {mounted &&
        document.querySelector<HTMLElement>('#datePicker') &&
        createPortal(
          <div ref={optionsRef}>
            <div
              className={`${styles.dateBlock} ${!isDropdownOpen ? styles.isHidden : ''}`}
              style={{
                left: `${optionsPostion.left}px`,
                top: `${optionsPostion.top}px`,
              }}
            >
              <div className={styles.dateRangeContainer}>
                <div className={styles.subContainer}>
                  <p>From</p>
                  <DayPicker
                    className={`${styles.datePicker}`}
                    mode='single'
                    required
                    selected={startDay}
                    onSelect={e => selectStartDay(e)}
                    toDate={endDay}
                    modifiersClassNames={{
                      today: 'myToday',
                    }}
                    modifiersStyles={{
                      disabled: { fontSize: '90%' },
                    }}
                  />
                </div>
                <div className={styles.subContainer}>
                  <p>To</p>
                  <DayPicker
                    className={styles.datePicker}
                    mode='single'
                    fromDate={startDay}
                    required
                    selected={endDay}
                    onSelect={e => selectEndDay(e)}
                    modifiersClassNames={{
                      today: 'myToday',
                    }}
                    modifiersStyles={{
                      disabled: { fontSize: '90%' },
                    }}
                  />
                </div>
              </div>
              <div className={styles.buttonContainer}>
                <div className={styles.cancelButton} onClick={() => handleCancelClick()} role='button'>
                  Cancel
                </div>
                <div className={styles.applyButton} onClick={() => handleApplyClick()} role='button'>
                  Apply
                </div>
              </div>
            </div>
          </div>,
          document.querySelector<HTMLElement>('#datePicker') as HTMLElement
        )}
    </>
  );
};

export default DatePicker;
