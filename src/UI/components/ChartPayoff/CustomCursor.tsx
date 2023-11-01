import React from "react";


const CustomCursor = props => {
    const { x, y, width, height, stroke, points, payload } = props;
    
    return <rect fill="red" stroke="red" x={points[0].x} y={120} width={1} height={height / 2} />;
};

export default CustomCursor;