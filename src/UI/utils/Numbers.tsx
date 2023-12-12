export const getNumberValue = (value: string): string => {
  if (!value) return '';

  // remove spaces from string
  value = value.replace(/\s/g, '');
  // remove aphats from string
  value = value.replace(/[^.\d]/g, '');

  return value;
};

export const getNumber = (value: string): number => {
  return Number(getNumberValue(value));
};

export const isInvalidNumber = (number: number) => !number || isNaN(number) || number <= 0;

export const getNumberFormat = (value: string | number, type: string = 'int') => {
  let result = '0';
  const number = getNumber(value.toString());
  if (isInvalidNumber(number)) {
    return '0';
  } else {
    result = formatNumber(number, type);
  }
  return result;
};

export const formatNumber = (value: number, type: string) => {
  let isNeg = false;
  if (value < 0) {
    isNeg = true;
  }
  if (!value) return '-'
  if (value*(isNeg ? -1: 1) > 1000000000) {
    return (value / 1000000000).toFixed(6) + 'B';
  } else if (value*(isNeg ? -1: 1) > 1000000) {
    return (value / 1000000).toFixed(3) + 'M';
  } else if (value*(isNeg ? -1: 1) > 1000) {
    return (value / 1000).toFixed(1) + 'K';
  } else {
    return type == 'int' ? Math.round(value)?.toString() : Number(value)?.toFixed(1)?.toString();
  }
};
