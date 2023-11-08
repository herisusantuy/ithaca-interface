import { PayoffDataProps, SpecialDotLabel } from '../constants/charts';

export const isIncrementing = (arr: PayoffDataProps[]) => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].value > arr[i + 1].value) {
      return false;
    }
  }
  return true;
};

export const isDecrementing = (arr: PayoffDataProps[]) => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].value < arr[i + 1].value) {
      return false;
    }
  }
  return true;
};

export const gradientOffset = (data: PayoffDataProps[]) => {
  const max = Math.max(...data.map(i => i.value));
  const min = Math.min(...data.map(i => i.value));

  if (max <= 0) {
    return 0;
  }
  if (min >= 0) {
    return 1;
  }

  return max / (max - min);
};

export const breakPointList = (data: PayoffDataProps[]) => {
  const offsets: SpecialDotLabel[] = [];
  const offsetCompareVal = offsetLimitStudiedValue(data);
  let increament = false;
  for (let i = 0; i < data.length - 1; i++) {
    const currentOffset = data[i + 1].value - data[i].value;
    if (currentOffset > offsetCompareVal) {
      if (increament) {
        offsets.pop();
      } else {
        const obj: SpecialDotLabel = {
          value: data[i].value,
        };
        offsets.push(obj);
      }
      const obj1: SpecialDotLabel = {
        value: data[i + 1].value,
      };
      offsets.push(obj1);
      increament = true;
    } else {
      increament = false;
    }
  }

  return offsets;
};

export const offsetLimitStudiedValue = (data: PayoffDataProps[]) => {
  let maxOffset = 0;

  for (let i = 0; i < data.length - 1; i++) {
    const currentOffset = data[i + 1].value - data[i].value;
    if (currentOffset > maxOffset) {
      maxOffset = currentOffset;
    }
  }

  if (maxOffset >= 10000) {
    return 1000;
  } else if (maxOffset >= 1000 && maxOffset < 10000) {
    return 100;
  } else if (maxOffset >= 100 && maxOffset < 1000) {
    return 10;
  } else return 1;
};
