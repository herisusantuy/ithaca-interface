import React, { useEffect, useState, ChangeEvent } from 'react';

//Utility import
import { generateLabelList } from '@/UI/utils/SliderUtil';

//Style
import styles from './Slider.module.scss';

type ValueProps = {
  min: number;
  max: number;
};

type SliderProps = {
  value?: ValueProps;
  min: number;
  max: number;
  step?: number;
  onChange?: (value: ValueProps) => void;
  range?: boolean;
  label?: number;
  showLabel?: boolean;
  title?: string;
};

const Slider = (props: SliderProps) => {
  const { title, value, min, max, step = 1, onChange, range = false, label = 2, showLabel = true } = props;
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);
  const [minPos, setMinPos] = useState<number>(0);
  const [maxPos, setMaxPos] = useState<number>(0);
  const [labelList, setLabelList] = useState<number[]>([]);

  useEffect(() => {
    setLabelList(generateLabelList(min, max, label));
    setMinValue(range ? (value ? value.min : min) : min);
    setMaxValue(value ? value.max : min);
  }, []);

  useEffect(() => {
    setMinPos(((minValue - min) / (max - min)) * 100);
    setMaxPos(((maxValue - min) / (max - min)) * 100);
  }, [max, maxValue, min, minValue]);

  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMinVal = Math.min(+e.target.value, maxValue);
    setMinPos(((newMinVal - min) / (max - min)) * 100);
    setMinValue(newMinVal);
    if (onChange) onChange({ min: newMinVal, max: maxValue });
  };

  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMaxVal = Math.max(+e.target.value, minValue);
    setMaxPos(((newMaxVal - min) / (max - min)) * 100);
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
    }
  };

  const getValuePosition = (event: React.MouseEvent) => {
    const offsetX = event.nativeEvent.offsetX;
    const width = event.currentTarget.clientWidth;
    if (!range) {
      setMaxValue(Math.round((offsetX * 100) / width));
    }
  };

  return (
    <div className={styles.container}>
      <div>{title && <label className={styles.label}>{title}</label>}</div>
      <div className={styles.wrapper}>
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

        <div className={styles.controlWrapper} onClick={event => getValuePosition(event)}>
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
                style={{ left: idx * (100 / (label - 1)) + '%' }}
                onClick={() => setMinMaxValue(item)}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Slider;
