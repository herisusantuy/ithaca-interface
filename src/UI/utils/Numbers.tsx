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
  if (!value) return '-';
  if (value * (isNeg ? -1 : 1) > 1000000000) {
    return (value / 1000000000).toFixed(6) + 'B';
  } else if (value * (isNeg ? -1 : 1) > 1000000) {
    return (value / 1000000).toFixed(3) + 'M';
  } else if (value * (isNeg ? -1 : 1) > 1000) {
    return (value / 1000).toFixed(1) + 'K';
  } else {
    return type == 'int' ? Math.round(value)?.toString() : Number(value)?.toFixed(1)?.toString();
  }
};

const formatDividedValue = (value: number, divisor: number, suffix: string) => {
  const dividedValue = value / divisor;
  const digits = Math.floor(Math.log10(dividedValue) + 1);
  const decimalPlaces = 4 - digits;
  return dividedValue.toFixed(decimalPlaces > 0 ? decimalPlaces : 0) + suffix;
};

/**
 * Formats a number by a specific currency.
 *
 * @param {number} value - The number to format.
 * @param {string} type - The type of the number (e.g., 'string').
 * @param {string} currency - The currency to use for formatting (e.g., 'WETH', 'USDC').
 *
 * @returns {string} The formatted number.
 *
 * @example
 * // For             'WETH'      and         'USDC':
 * //            1 => 1.000 |            1 => 1.00
 * //           12 => 12.000 |           12 => 12.00
 * //          123 => 123.00 |          123 => 123.00
 * //        1234 => 1234.0  |        1234 => 1234.0
 * //       12345 => 12345   |       12345 => 12345
 * //      123456 => 123.5K  |      123456 => 123.5K
 * //     1234567 => 1.235M  |     1234567 => 1.235M
 * //    12345678 => 12.35M  |    12345678 => 12.35M
 * //   123456789 => 123.5M  |   123456789 => 123.5M
 * //  1234567890 => 1.235B  |  1234567890 => 1.235B
 * // 12345678900 => 12.35B  | 12345678900 => 12.35B
 * //123456789000 => 123.5B  |123456789000 => 123.5B
 * //1234567890000 => 1.235T |1234567890000 => 1.235T
 */
export const formatNumberByCurrency = (value: number, type: string, currency: 'USDC' | 'WETH') => {
  let isNeg = false;
  if (value < 0) {
    isNeg = true;
  }
  const absValue = value * (isNeg ? -1 : 1);

  if (value === undefined) return '-';
  if (absValue > 1000000000000) {
    return formatDividedValue(value, 1000000000000, 'T');
  } else if (absValue > 1000000000) {
    return formatDividedValue(value, 1000000000, 'B');
  } else if (absValue > 1000000) {
    return formatDividedValue(value, 1000000, 'M');
  } else if (absValue > 99999) {
    return formatDividedValue(value, 1000, 'K');
  } else if (absValue >= 99) {
    return value.toFixed(5 - Math.floor(Math.log10(absValue) + 1));
  } else {
    switch (currency) {
      case 'USDC':
        return value.toFixed(2);
      case 'WETH':
        return value.toFixed(3);
    }
  }
};

export const formatEthAddress = (text: string) => (text ? `${text.slice(0, 4)}...${text.slice(-4)}` : '');
