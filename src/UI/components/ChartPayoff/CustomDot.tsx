import React from 'react';

interface CustomDotProps {
  cx?: number;
  cy?: number;
  stroke?: string;
}

const CustomDot = (props: CustomDotProps) => {
  const { cx, cy } = props;

  return (
    <>
      <circle cx={cx} cy={cy} r={2} fill='transparent' stroke='#b3b3b3' strokeWidth={1} />
    </>
  );
};

export default CustomDot;
