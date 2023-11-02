type LabelProps = {
  x?: number | string;
  y?: number | string;
  value?: number | string;
  base: number | string;
  max: number | string;
  min: number | string;
};

const CustomLabel = (props: LabelProps) => {
  const { x, y, value, base, max, min } = props;
  
  const renderLabel = (dx: number = 0, dy: number = 0) => (
    <text x={x} y={y} dx={dx} dy={dy} fill='#fff' fontSize={12} textAnchor='middle'>
      {Number(value) + Number(base)}
    </text>
  );

  switch (value) {
    case 0:
      return renderLabel(0, 20);
    case max:
      return renderLabel(-10, 20);
    case min:
      return renderLabel(10, -20);
    default:
      return null;
  }
};

export default CustomLabel;
