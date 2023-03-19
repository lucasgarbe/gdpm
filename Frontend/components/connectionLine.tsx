export default ({
  fromX,
  fromY,
  fromPosition,
  toX,
  toY,
  toPosition,
  connectionLineType,
  connectionLineStyle,
}: any) => {
  const xDistance = toX - fromX;
  return (
    <g>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} ${fromX + xDistance / 10},${fromY} ${
          toX - xDistance / 10
        },${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke="#222"
        strokeWidth={1.5}
      />
    </g>
  );
};
