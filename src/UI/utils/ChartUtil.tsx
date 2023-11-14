import { PayoffDataProps, SpecialDotLabel } from '../constants/charts/charts';

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
  if (max - Math.abs(min) == 0) {
    return 0;
  }
  return max / (max - min);
};

export const breakPointList = (data: PayoffDataProps[]) => {
  const offsets: SpecialDotLabel[] = [];
  const offsetCompareVal = offsetLimitStudiedValue(data);
  let increament = false;
  for (let i = 0; i < data.length - 1; i++) {
    const currentOffset = Math.abs(Math.round(data[i + 1].value) - Math.round(data[i].value));
    if (currentOffset != 0) {
      if (currentOffset >= offsetCompareVal) {
        if (increament) {
          if (i - 2 >= 0) {
            const previewOffset = Math.abs(data[i - 2].value - data[i - 1].value);
            if (previewOffset > offsetCompareVal) {
              offsets.pop();
            }
          } else {
            offsets.pop();
          }
        } else {
          const obj: SpecialDotLabel = {
            value: data[i].value,
            x: data[i].x,
          };
          offsets.push(obj);
        }
        const obj1: SpecialDotLabel = {
          value: data[i + 1].value,
          x: data[i].x,
        };
        offsets.push(obj1);
        increament = true;
      } else {
        increament = false;
      }
    }
  }
  return offsets;
};

export const offsetLimitStudiedValue = (data: PayoffDataProps[]) => {
  let maxOffset = 0;

  for (let i = 0; i < data.length - 1; i++) {
    const currentOffset = Math.abs(data[i + 1].value - data[i].value);
    if (currentOffset > maxOffset) {
      maxOffset = Math.round(currentOffset);
    }
  }

  if (maxOffset > 10000) {
    return 1000;
  } else if (maxOffset > 5000 && maxOffset <= 10000) {
    return 500;
  } else if (maxOffset > 1000 && maxOffset <= 5000) {
    return 100;
  } else if (maxOffset > 500 && maxOffset <= 1000) {
    return 50;
  } else if (maxOffset > 100 && maxOffset <= 500) {
    return 10;
  } else return 2;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const makingChartData = (data: any[], key: string, dashed: string) => {
  const result: PayoffDataProps[] = data.map(item => ({
    value: item[key],
    dashValue: dashed != '' && dashed != key ? item[dashed] : undefined,
    x: item['x'],
  }));
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getLegs = (data: any[]) => {
  const keys = Object.keys(data[0]).filter(item => !['x'].includes(item));
  return keys;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const findOverallMinMaxValues = (data: any) => {
    let overallMin = Infinity;
    let overallMax = -Infinity;

    // Iterate over the data array to find overall min and max values
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.forEach((entry: any) => {
        Object.keys(entry).forEach(key => {
            if (key !== 'x') {
                overallMin = Math.min(overallMin, entry[key]);
                overallMax = Math.max(overallMax, entry[key]);
            }
        });
    });

    return { min: overallMin, max: overallMax };
}
