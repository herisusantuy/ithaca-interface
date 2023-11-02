/**
 * Format a number with commas.
 * @param num - The number to format.
 * @returns - The number formatted with commas.
 */

export const formatWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getNumberValue = (value: string): string => {
  if (!value) return ''

  // remove spaces from string
  value = value.replace(/\s/g, '')
  // remove aphats from string
  value = value.replace(/[^.\d\-]/g, '')

  return value
}

export const getNumber = (value: string): number => {
  return Number(getNumberValue(value))
}
