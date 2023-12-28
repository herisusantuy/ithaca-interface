import { ReactNode } from 'react';

import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import dayjs from 'dayjs';

export type ProductOption = {
  option: string;
  value: string;
  options: { option: string; value: string }[];
  sizeIcon: ReactNode;
};

export const getProductOptions = (currentExpiryDate: number): ProductOption[] => [
  {
    option: 'Options',
    value: 'options',
    sizeIcon: <LogoEth />,
    options: [
      { option: 'Call', value: 'Call' },
      { option: 'Put', value: 'Put' },
    ],
  },
  {
    option: 'Digital Options',
    value: 'digital-options',
    sizeIcon: <LogoUsdc />,
    options: [
      { option: 'Call', value: 'BinaryCall' },
      { option: 'Put', value: 'BinaryPut' },
    ],
  },
  {
    option: 'Forwards',
    value: 'forwards',
    sizeIcon: <LogoEth />,
    options: [
      { option: 'Next Auction', value: 'NEXT_AUCTION' },
      {
        option: dayjs(`${currentExpiryDate}`, 'YYYYMMDD').format('DDMMMYY'),
        value: 'Forward',
      },
    ],
  },
];

// solves issue: found page without a React Component as default export
export default getProductOptions
