// Types
type OptionProps = {
  option: string;
  value: string;
};

export const TYPE_OPTIONS: OptionProps[] = [
  { option: 'Call', value: 'Call' },
  { option: 'Put', value: 'Put' },
];

export const SIDE_OPTIONS: OptionProps[] = [
  { option: '+', value: 'BUY' },
  { option: '-', value: 'SELL' },
];
