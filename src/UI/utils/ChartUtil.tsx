import { PayoffDataProps, SpecialDotLabel } from '../constants/charts/charts';

export const isIncrementing = (arr: PayoffDataProps[]) => {
  let result = true;
  if (arr[0].value != arr[1].value) {
    for (let i = 0; i < arr.length - 2; i++) {
      if (arr[i].value < arr[i + 1].value) {
        result = false;
        break;
      }
    }
  } else if (arr[arr.length - 1].value != arr[arr.length - 2].value) {
    for (let i = 0; i < arr.length - 2; i++) {
      if (arr[i].value > arr[i + 1].value) {
        result = false;
        break;
      }
    }
  } else if (arr[0].value == arr[1].value && arr[arr.length - 1].value == arr[arr.length - 2].value) {
    result = false;
  }

  return result;
};

export const isDecrementing = (arr: PayoffDataProps[]) => {
  let result = true;
  if (arr[0].value != arr[1].value) {
    for (let i = 0; i < arr.length - 2; i++) {
      if (arr[i].value > arr[i + 1].value) {
        result = false;
        break;
      }
    }
  } else if (arr[arr.length - 1].value != arr[arr.length - 2].value) {
    for (let i = 1; i < arr.length - 2; i++) {
      if (arr[i].value < arr[i + 1].value) {
        result = false;
        break;
      }
    }
  } else if (arr[0].value == arr[1].value && arr[arr.length - 1].value == arr[arr.length - 2].value) {
    result = false;
  }

  return result;
};

export const gradientOffset1 = (data: PayoffDataProps[]) => {
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

export const gradientOffset = (xAxis: number, height: number, data: PayoffDataProps[]) => {
  if (xAxis == 0) {
    return xAxis / (height / 100) / 100;
  }

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

export const showGradientTags = (off: number, color: string, dashedColor: string) => {
  console.log(off);
  if (off == 0) {
    return (
      <defs>
        {/* Area gradient */}
        <linearGradient id='fillGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='10%' stopColor={color} stopOpacity={0.2} />
          <stop offset='40%' stopColor={color} stopOpacity={0} />
          <stop offset={off} stopColor='#8884d8' stopOpacity={0} />
          <stop offset='60%' stopColor='#FF3F57' stopOpacity={0} />
          <stop offset='95%' stopColor='#FF3F57' stopOpacity={0.2} />
        </linearGradient>

        <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='2' result='blur' />
        </filter>

        {/* Core line gradient */}
        <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='2%' stopColor={color} stopOpacity={0.1} />
          <stop offset='40%' stopColor={color} stopOpacity={0.9} />
          <stop offset={off} stopColor='#fff' stopOpacity={1} />
          <stop offset='75%' stopColor='#FF3F57' stopOpacity={0.9} />
          <stop offset='98%' stopColor='#FF3F57' stopOpacity={0.1} />
        </linearGradient>

        <linearGradient id='dashGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='90%' stopColor={dashedColor} stopOpacity={0.4} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.3} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.1} />
        </linearGradient>
      </defs>
    );
  } else if (off < 0.1) {
    return (
      <defs>
        {/* Area gradient */}
        <linearGradient id='fillGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='1%' stopColor={color} stopOpacity={0.2} />
          <stop offset={off} stopColor='#8884d8' stopOpacity={0} />
          <stop offset='70%' stopColor='#FF3F57' stopOpacity={0.2} />
          <stop offset='95%' stopColor='#FF3F57' stopOpacity={0.3} />
        </linearGradient>

        <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='2' result='blur' />
        </filter>

        {/* Core line gradient */}
        <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='1%' stopColor={color} stopOpacity={0.1} />
          <stop offset={off} stopColor='#fff' stopOpacity={0.1} />
          <stop offset='30%' stopColor='#FF3F57' stopOpacity={1} />
          <stop offset='70%' stopColor='#FF3F57' stopOpacity={1} />
          <stop offset='90%' stopColor='#FF3F57' stopOpacity={1} />
          <stop offset='99%' stopColor='#FF3F57' stopOpacity={0.1} />
        </linearGradient>

        <linearGradient id='dashGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='90%' stopColor={dashedColor} stopOpacity={0.4} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.3} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.1} />
        </linearGradient>
      </defs>
    );
  } else if (off < 0.2) {
    return (
      <defs>
        {/* Area gradient */}
        <linearGradient id='fillGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='6%' stopColor={color} stopOpacity={0.1} />
          <stop offset={off} stopColor='#8884d8' stopOpacity={0} />
          <stop offset='70%' stopColor='#FF3F57' stopOpacity={0.2} />
          <stop offset='95%' stopColor='#FF3F57' stopOpacity={0.3} />
        </linearGradient>

        <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='2' result='blur' />
        </filter>

        {/* Core line gradient */}
        <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='5%' stopColor={color} stopOpacity={1} />
          <stop offset={off} stopColor='#fff' stopOpacity={0.1} />
          <stop offset='20%' stopColor='#FF3F57' stopOpacity={1} />
          <stop offset='90%' stopColor='#FF3F57' stopOpacity={1} />
        </linearGradient>

        <linearGradient id='dashGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='90%' stopColor={dashedColor} stopOpacity={0.4} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.3} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.1} />
        </linearGradient>
      </defs>
    );
  } else if (off < 0.3) {
    return (
      <defs>
        {/* Area gradient */}
        <linearGradient id='fillGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='10%' stopColor={color} stopOpacity={0.2} />
          <stop offset={off} stopColor='#8884d8' stopOpacity={0} />
          <stop offset='70%' stopColor='#FF3F57' stopOpacity={0.2} />
          <stop offset='95%' stopColor='#FF3F57' stopOpacity={0.3} />
        </linearGradient>

        <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='2' result='blur' />
        </filter>

        {/* Core line gradient */}
        <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='15%' stopColor={color} stopOpacity={1} />
          <stop offset={off} stopColor='#fff' stopOpacity={0.1} />
          <stop offset='40%' stopColor='#FF3F57' stopOpacity={1} />
          <stop offset='90%' stopColor='#FF3F57' stopOpacity={1} />
        </linearGradient>

        <linearGradient id='dashGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='90%' stopColor={dashedColor} stopOpacity={0.4} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.3} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.1} />
        </linearGradient>
      </defs>
    );
  } else if (off < 0.4) {
    return (
      <defs>
        {/* Area gradient */}
        <linearGradient id='fillGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='10%' stopColor={color} stopOpacity={0.3} />
          <stop offset='20%' stopColor={color} stopOpacity={0.2} />
          <stop offset={off} stopColor='#8884d8' stopOpacity={0} />
          <stop offset='70%' stopColor='#FF3F57' stopOpacity={0.2} />
          <stop offset='95%' stopColor='#FF3F57' stopOpacity={0.3} />
        </linearGradient>

        <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='2' result='blur' />
        </filter>

        {/* Core line gradient */}
        <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='10%' stopColor={color} stopOpacity={1} />
          <stop offset='30%' stopColor={color} stopOpacity={1} />
          <stop offset={off} stopColor='#fff' stopOpacity={0.1} />
          <stop offset='45%' stopColor='#FF3F57' stopOpacity={1} />
          <stop offset='90%' stopColor='#FF3F57' stopOpacity={1} />
        </linearGradient>

        <linearGradient id='dashGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='90%' stopColor={dashedColor} stopOpacity={0.4} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.3} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.1} />
        </linearGradient>
      </defs>
    );
  } else if (off < 0.5) {
    return (
      <defs>
        {/* Area gradient */}
        <linearGradient id='fillGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='10%' stopColor={color} stopOpacity={0.3} />
          <stop offset='30%' stopColor={color} stopOpacity={0.2} />
          <stop offset={off} stopColor='#8884d8' stopOpacity={0} />
          <stop offset='70%' stopColor='#FF3F57' stopOpacity={0.2} />
          <stop offset='90%' stopColor='#FF3F57' stopOpacity={0.3} />
        </linearGradient>

        <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='2' result='blur' />
        </filter>

        {/* Core line gradient */}
        <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='10%' stopColor={color} stopOpacity={1} />
          <stop offset='30%' stopColor={color} stopOpacity={1} />
          <stop offset='40%' stopColor={color} stopOpacity={1} />
          <stop offset={off} stopColor='#fff' stopOpacity={0.1} />
          <stop offset='60%' stopColor='#FF3F57' stopOpacity={1} />
          <stop offset='70%' stopColor='#FF3F57' stopOpacity={1} />
          <stop offset='90%' stopColor='#FF3F57' stopOpacity={1} />
        </linearGradient>

        <linearGradient id='dashGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='90%' stopColor={dashedColor} stopOpacity={0.4} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.3} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.1} />
        </linearGradient>
      </defs>
    );
  } else if (off < 0.6) {
    return (
      <defs>
        {/* Area gradient */}
        <linearGradient id='fillGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='10%' stopColor={color} stopOpacity={0.3} />
          <stop offset='30%' stopColor={color} stopOpacity={0.2} />
          <stop offset={off} stopColor='#8884d8' stopOpacity={0} />
          <stop offset='80%' stopColor='#FF3F57' stopOpacity={0.2} />
          <stop offset='90%' stopColor='#FF3F57' stopOpacity={0.3} />
        </linearGradient>

        <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='2' result='blur' />
        </filter>

        {/* Core line gradient */}
        <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='10%' stopColor={color} stopOpacity={1} />
          <stop offset='30%' stopColor={color} stopOpacity={1} />
          <stop offset='50%' stopColor={color} stopOpacity={1} />
          <stop offset={off} stopColor='#fff' stopOpacity={0.1} />
          <stop offset='65%' stopColor='#FF3F57' stopOpacity={1} />
          <stop offset='80%' stopColor='#FF3F57' stopOpacity={1} />
        </linearGradient>

        <linearGradient id='dashGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='90%' stopColor={dashedColor} stopOpacity={0.4} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.3} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.1} />
        </linearGradient>
      </defs>
    );
  } else if (off < 0.7) {
    return (
      <defs>
        {/* Area gradient */}
        <linearGradient id='fillGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='10%' stopColor={color} stopOpacity={0.3} />
          <stop offset='30%' stopColor={color} stopOpacity={0.2} />
          <stop offset={off} stopColor='#8884d8' stopOpacity={0} />
          <stop offset='90%' stopColor='#FF3F57' stopOpacity={0.3} />
        </linearGradient>

        <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='2' result='blur' />
        </filter>

        {/* Core line gradient */}
        <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='10%' stopColor={color} stopOpacity={1} />
          <stop offset='50%' stopColor={color} stopOpacity={1} />
          <stop offset='60%' stopColor={color} stopOpacity={1} />
          <stop offset={off} stopColor='#fff' stopOpacity={0.1} />
          <stop offset='73%' stopColor='#FF3F57' stopOpacity={1} />
        </linearGradient>

        <linearGradient id='dashGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='90%' stopColor={dashedColor} stopOpacity={0.4} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.3} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.1} />
        </linearGradient>
      </defs>
    );
  } else if (off < 0.8) {
    return (
      <defs>
        {/* Area gradient */}
        <linearGradient id='fillGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='10%' stopColor={color} stopOpacity={0.3} />
          <stop offset='30%' stopColor={color} stopOpacity={0.2} />
          <stop offset={off} stopColor='#8884d8' stopOpacity={0} />
          <stop offset='90%' stopColor='#FF3F57' stopOpacity={0.3} />
        </linearGradient>

        <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='2' result='blur' />
        </filter>

        {/* Core line gradient */}
        <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='10%' stopColor={color} stopOpacity={1} />
          <stop offset='50%' stopColor={color} stopOpacity={1} />
          <stop offset='70%' stopColor={color} stopOpacity={1} />
          <stop offset={off} stopColor='#fff' stopOpacity={0.1} />
          <stop offset='83%' stopColor='#FF3F57' stopOpacity={1} />
        </linearGradient>

        <linearGradient id='dashGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='90%' stopColor={dashedColor} stopOpacity={0.4} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.3} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.1} />
        </linearGradient>
      </defs>
    );
  } else if (off < 0.9) {
    return (
      <defs>
        {/* Area gradient */}
        <linearGradient id='fillGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='10%' stopColor={color} stopOpacity={0.3} />
          <stop offset='30%' stopColor={color} stopOpacity={0.2} />
          <stop offset={off} stopColor='#8884d8' stopOpacity={0} />
          <stop offset='99%' stopColor='#FF3F57' stopOpacity={0.1} />
        </linearGradient>

        <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='2' result='blur' />
        </filter>

        {/* Core line gradient */}
        <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='10%' stopColor={color} stopOpacity={1} />
          <stop offset='30%' stopColor={color} stopOpacity={1} />
          <stop offset='80%' stopColor={color} stopOpacity={1} />
          <stop offset={off} stopColor='#fff' stopOpacity={0.1} />
          <stop offset='93%' stopColor='#FF3F57' stopOpacity={1} />
        </linearGradient>

        <linearGradient id='dashGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='90%' stopColor={dashedColor} stopOpacity={0.4} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.3} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.1} />
        </linearGradient>
      </defs>
    );
  } else {
    return (
      <defs>
        {/* Area gradient */}
        <linearGradient id='fillGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='10%' stopColor={color} stopOpacity={0.3} />
          <stop offset='30%' stopColor={color} stopOpacity={0.2} />
          <stop offset={off} stopColor='#8884d8' stopOpacity={0} />
          <stop offset='99%' stopColor='#FF3F57' stopOpacity={0.1} />
        </linearGradient>

        <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='2' result='blur' />
        </filter>

        {/* Core line gradient */}
        <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='10%' stopColor={color} stopOpacity={1} />
          <stop offset='85%' stopColor={color} stopOpacity={1} />
          <stop offset={off} stopColor='#fff' stopOpacity={0.1} />
          <stop offset='97%' stopColor='#FF3F57' stopOpacity={1} />
        </linearGradient>

        <linearGradient id='dashGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='90%' stopColor={dashedColor} stopOpacity={0.4} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.3} />
          <stop offset='5%' stopColor={dashedColor} stopOpacity={0.1} />
        </linearGradient>
      </defs>
    );
  }
};

export const breakPointList1 = (data: PayoffDataProps[]) => {
  const offsets: SpecialDotLabel[] = [];
  // const minMaxOffsetRange = findOverallMinMaxValues(data);
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

  // const minMaxOffset = Math.abs(minMaxOffsetRange.min) + Math.abs(minMaxOffsetRange.max);
  // let ruleValue = 0;
  // if (minMaxOffset > 10000) {
  //   ruleValue = 1000;
  // } else if (minMaxOffset > 1000 && minMaxOffset <= 10000) {
  //   ruleValue = 100;
  //  } else if (minMaxOffset > 100 && minMaxOffset <= 1000) {
  //   ruleValue = 10;
  // } else {
  //   ruleValue = 1;
  // }
  // for (let i = 1; i < data.length - 1; i++) {
  //   if (data[i].value <= 0 && data[i + 1].value > 0) {
  //     if (Math.abs(data[i].value) < Math.abs(data[i + 1].value)) {
  //       if(Math.abs(data[i] < rule))
  //     }
  //   }
  // }
  return offsets;
};

export const breakPointList = (data: PayoffDataProps[]) => {
  const offsets: SpecialDotLabel[] = [];
  let preTanValue = 0;
  for (let i = 0; i < data.length - 1; i++) {
    const tanValue = (data[i].value - data[i + 1].value) / (data[i].x - data[i + 1].x);
    if (preTanValue !== tanValue && Math.round((preTanValue / tanValue) * 10) / 10 !== 1 && data[i].value !== 0) {
      preTanValue = tanValue;
      if (i === 0) continue;
      offsets.push({
        x: data[i].x,
        value: data[i].value,
      });
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
    value: Math.round(item[key]),
    dashValue: dashed != '' ? item[dashed] : undefined,
    x: item['x'],
  }));

  const tempDataArray: PayoffDataProps[] = [result[0]];
  for (let i = 1; i < result.length; i++) {
    const prevItem = result[i - 1];
    const currentItem = result[i];
    if (prevItem.value * currentItem.value < 0) {
      const rate = (currentItem.x - prevItem.x) / (currentItem.value - prevItem.value);
      const zeroPoint = prevItem.x + Math.abs(rate * prevItem.value);
      tempDataArray.push({ value: 0, dashValue: undefined, x: zeroPoint });
    }
    tempDataArray.push(currentItem);
  }
  return tempDataArray;
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
};
