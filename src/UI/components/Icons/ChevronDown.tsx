import { IconProps } from './types';

const ChevronDown = ({ color = '#9D9DAA' }: IconProps) => {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M16 10L12 14' stroke={color} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M8 10L12 14' stroke={color} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
};

export default ChevronDown;
