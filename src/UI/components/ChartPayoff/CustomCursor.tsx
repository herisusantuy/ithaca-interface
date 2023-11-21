// Types
type CustomCursorProps = {
  x: number;
  y: number;
  height: number;
};

const CustomCursor = ({ x, y, height }: CustomCursorProps) => {
  if (y > 100) {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='2'
        height='91'
        viewBox='0 0 2 91'
        fill='none'
        x={x - 2}
        y={y - 100}
      >
        <path d='M0.875 0.742188L0.875004 90.7422' stroke='url(#paint0_linear_1826_73533)' />
        <defs>
          <linearGradient
            id='paint0_linear_1826_73533'
            x1='1.375'
            y1='0.742187'
            x2='1.375'
            y2='90.7422'
            gradientUnits='userSpaceOnUse'
          >
            <stop stopColor='white' />
            <stop offset='1' stopColor='white' stopOpacity='0' />
          </linearGradient>
        </defs>
      </svg>
    );
  } else if (y <= 100 && y != 0) {
    return (
      <svg xmlns='http://www.w3.org/2000/svg' width='2' height='91' viewBox='0 0 2 91' fill='none' x={x - 2} y={y + 25}>
        <path d='M0.875 0.742188L0.875004 90.7422' stroke='url(#paint0_linear_1826_73533)' />
        <defs>
          <linearGradient
            id='paint0_linear_1826_73533'
            x1='1.375'
            y1='0.742187'
            x2='1.375'
            y2='90.7422'
            gradientUnits='userSpaceOnUse'
          >
            <stop offset='0' stopColor='white' stopOpacity='0' />
            <stop offset='1' stopColor='white' />
          </linearGradient>
        </defs>
      </svg>
    );
  } else {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='2'
        height='91'
        viewBox='0 0 2 91'
        fill='none'
        x={x - 2}
        y={height - 130}
      >
        <path d='M0.875 0.742188L0.875004 90.7422' stroke='url(#paint0_linear_1826_73533)' />
        <defs>
          <linearGradient
            id='paint0_linear_1826_73533'
            x1='1.375'
            y1='0.742187'
            x2='1.375'
            y2='90.7422'
            gradientUnits='userSpaceOnUse'
          >
            <stop offset='0' stopColor='white' stopOpacity='0' />
            <stop offset='1' stopColor='white' />
          </linearGradient>
        </defs>
      </svg>
    );
  }
};

export default CustomCursor;
