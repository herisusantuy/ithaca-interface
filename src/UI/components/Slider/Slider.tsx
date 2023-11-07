// Packages
import { useEffect, useState, ChangeEvent, useRef } from 'react';

// Utils
import { generateLabelList } from '@/UI/utils/SliderUtil';

//Style
import styles from './Slider.module.scss';

// Types
type ValueProps = {
  min: number;
  max: number;
};

type SliderProps = {
  value?: ValueProps;
  min: number;
  max: number;
  step?: number;
  range?: boolean;
  label?: number;
  showLabel?: boolean;
  title?: string;
  onChange?: (value: ValueProps) => void;
};

const Slider = ({
  title,
  value,
  min,
  max,
  step = 1,
  range = false,
  label = 2,
  showLabel = true,
  onChange,
}: SliderProps) => {
  const [minValue, setMinValue] = useState<number>(range ? (value ? value.min : min) : min);
  const [maxValue, setMaxValue] = useState<number>(value ? value.max : min);
  const [minPos, setMinPos] = useState<number>(0);
  const [maxPos, setMaxPos] = useState<number>(0);
  const labelList = generateLabelList(min, max, label);
  const controlWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMinPos(((minValue - min) / (max - min)) * 100);
    setMaxPos(((maxValue - min) / (max - min)) * 100);
  }, [maxValue, minValue, min, max]);

  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMinVal = Math.min(+e.target.value, maxValue);
    setMinValue(newMinVal);
    if (onChange) onChange({ min: newMinVal, max: maxValue });
  };

  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMaxVal = Math.max(+e.target.value, minValue);
    setMaxValue(newMaxVal);
    if (onChange) onChange({ min: minValue, max: newMaxVal });
  };

  const getLabelClassName = (item: number) => {
    const classList = [styles.labelItem];

    if (range) {
      if (item >= minValue && item <= maxValue) {
        classList.push(styles.highlight);
      }
    } else if (item == maxValue) {
      classList.push(styles.highlight);
    }
    return classList.join(' ');
  };

  const setMinMaxValue = (item: number) => {
    if (!range) {
      setMaxValue(item);
    } else {
      const betweenVal = minValue + (maxValue - minValue) / 2;
      if (item > maxValue) {
        setMaxValue(item);
      } else if (item < minValue) {
        setMinValue(item);
      } else if (betweenVal < item) {
        setMaxValue(item);
      } else if (betweenVal >= item) {
        setMinValue(item);
      }
    }
  };

  const getValuePosition = (event: React.MouseEvent) => {
    const offsetX = event.nativeEvent.offsetX;
    const width = event.currentTarget.clientWidth;
    const value = min + Math.round(((max - min) / width) * offsetX);
    if (range) {
      if (controlWrapperRef.current) {
        const rect = controlWrapperRef.current.getBoundingClientRect();
        const distanceFromXAxis = rect.left;
        const cursorPoint = event.clientX - distanceFromXAxis;
        const offestPosition = (width / 100) * minPos + offsetX;
        if (cursorPoint < (width / 100) * minPos) {
          setMinValue(value);
        } else if (cursorPoint > (width / 100) * maxPos) {
          setMaxValue(value);
        } else {
          const rangeItemValue = min + Math.round(((max - min) / width) * offestPosition);
          const betweenVal = minValue + (maxValue - minValue) / 2;
          if (rangeItemValue > maxValue) {
            setMaxValue(rangeItemValue);
          } else if (rangeItemValue < minValue) {
            setMinValue(rangeItemValue);
          } else if (betweenVal < rangeItemValue) {
            setMaxValue(rangeItemValue);
          } else if (betweenVal >= rangeItemValue) {
            setMinValue(rangeItemValue);
          }
        }
      }
    } else {
      setMaxValue(value);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <input
          className={`${styles.input} ${!range ? styles.hide : ''}`}
          type='range'
          value={minValue}
          min={min}
          max={max}
          step={step}
          onChange={handleMinChange}
        />
        <input
          className={styles.input}
          type='range'
          value={maxValue}
          min={min}
          max={max}
          step={step}
          onChange={handleMaxChange}
        />
      </div>

      <div
        data-id={title}
        className={styles.controlWrapper}
        onClick={event => getValuePosition(event)}
        ref={controlWrapperRef}
      >
        <div className={`${styles.control} ${!range ? styles.hide : ''}`} style={{ left: `${minPos}%` }} />
        <div className={styles.rail}>
          <div className={styles.innerRail} style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }} />
        </div>
        <div className={styles.control} style={{ left: `${maxPos}%` }} />
      </div>

      <div className={`${styles.labelContainer} ${!showLabel ? styles.hide : ''}`}>
        {labelList.map((item: number, idx: number) => {
          return (
            <div
              key={idx}
              className={getLabelClassName(item)}
              style={{
                left:
                  idx != 0
                    ? idx != labelList.length - 1
                      ? `calc(${idx * (100 / (label - 1)) + '%'} - 10px)`
                      : `calc(${idx * (100 / (label - 1)) + '%'} - 22px)`
                    : `calc(${idx * (100 / (label - 1)) + '%'})`,
              }}
              onClick={() => setMinMaxValue(item)}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Slider;
