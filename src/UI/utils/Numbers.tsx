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
