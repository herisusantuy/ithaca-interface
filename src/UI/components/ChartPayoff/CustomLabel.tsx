import React from 'react';
import { base } from 'viem/chains';

interface LabelProps {
  x?: number | string;
  y?: number | string;
  value?: number | string;
  base: number | string;
  max: number | string;
  min: number | string;
}

const CustomLabel = (props: LabelProps) => {
  const { x, y, value, base, max, min } = props;
    console.log('----------', max);
  const showRenderItem = () => {
    if (value == 0) {
      return (
        <text x={x} y={y} dy={20} fill='#fff' fontSize={10} textAnchor='middle'>
          {Number(value) + Number(base)}
        </text>
      );
    } else if (value == max) {
      return (
        <text x={x} y={y} dy={20} dx={-10} fill='#fff' fontSize={10} textAnchor='middle'>
          {Number(value) + Number(base)}
        </text>
      );
    } else if (value == min) {
      return (
        <text x={x} y={y} dy={-20} dx={10} fill='#fff' fontSize={10} textAnchor='middle'>
          {Number(value) + Number(base)}
        </text>
      );
    }
  };
  return <>{showRenderItem()}</>;
};

export default CustomLabel;
