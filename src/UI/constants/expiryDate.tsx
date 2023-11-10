export const EXPIRY_DATE_OPTIONS: ExpiryDateOptions[] = [
  { label: '8 Oct 23', value: 1 },
  { label: '17 Oct 23', value: 2},
  { label: '24 Oct 23', value: 3 },
  { label: '30 Oct 23', value: 4 },
];

export type ExpiryDateOptions = {
  label: string,
  value: number
}