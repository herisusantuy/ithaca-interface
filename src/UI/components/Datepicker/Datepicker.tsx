// import modules
import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { createPortal } from 'react-dom';

import 'react-day-picker/dist/style.css';
import styles from './Datepicker.module.scss';
import { useEscKey } from '@/UI/hooks/useEscKey';
import { formatDate } from '@/UI/utils/DatePicker';

type DateProps = {
  start?: Date | undefined;
  end?: Date | undefined;
  disabled?: boolean;
};

const Datepicker = ({ start, end, disabled = false }: DateProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [startDay, setStartDay] = useState<Date | undefined>(start);
  const [tempStartDay, setTempStartDay] = useState<Date | undefined>(start);
  const [endDay, setEndDay] = useState<Date | undefined>(end);
  const [tempEndDay, setTempEndDay] = useState<Date | undefined>(end);
  const [dateText, setDateText] = useState<string>();

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
    // setSelectedOption(value || null);
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

  const calendarSvg = () => {
    return (
      <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect width='16' height='16' rx='4' fill='#35333E' />
        <path
          d='M3 6C3 5.22037 3 4.83056 3.17882 4.54596C3.27207 4.39756 3.39756 4.27207 3.54596 4.17882C3.83056 4 4.22037 4 5 4H11C11.7796 4 12.1694 4 12.454 4.17882C12.6024 4.27207 12.7279 4.39756 12.8212 4.54596C13 4.83056 13 5.22037 13 6V6H3V6Z'
          stroke='white'
        />
        <rect x='3' y='4' width='10' height='8' rx='1.16667' stroke='white' />
        <path d='M6 3L6 4' stroke='white' strokeLinecap='round' />
        <path d='M10 3L10 4' stroke='white' strokeLinecap='round' />
      </svg>
    );
  };

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
      setDateText(formatDate(startDay) + ' - ' + formatDate(endDay));
    } else if (startDay && !endDay) {
      setEndDay(startDay);
      setTempEndDay(startDay);
      setDateText(formatDate(startDay) + ' - ' + formatDate(startDay));
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
    <div>
      <div className={styles.datePickerContainer} onClick={() => handleDropdownClick()} ref={containerRef}>
        <div className={styles.dateInput}>{dateText}</div>
        {calendarSvg()}
      </div>

      {mounted &&
        document.querySelector<HTMLElement>('#datePicker') &&
        createPortal(
          <div ref={optionsRef}>
            <div
              className={`${styles.dateBlock} ${!isDropdownOpen ? styles.isHidden : ''}`}
              style={{
                width: `${optionsPostion.width}px`,
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
                <div className={styles.cancelButton} onClick={() => handleCancelClick()}>
                  Cancel
                </div>
                <div className={styles.applyButton} onClick={() => handleApplyClick()}>
                  Apply
                </div>
              </div>
            </div>
          </div>,
          document.querySelector<HTMLElement>('#datePicker') as HTMLElement
        )}
    </div>
  );
};

export default Datepicker;
