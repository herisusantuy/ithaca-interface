/**
 * Format a number with commas.
 * @param num - The number to format.
 * @returns - The number formatted with commas.
 */

export const formatWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
