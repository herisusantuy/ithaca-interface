export const generateLabelList = (start: number, end: number, numParts: number): number[] => {
  const step = Math.floor((end - start) / (numParts - 1));
  return Array.from({ length: numParts }, (_, i) => start + i * step);
};
