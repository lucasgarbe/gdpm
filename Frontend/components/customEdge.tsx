export default function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
}: any): any {
  const xDistance = targetX - sourceX;
  return (
    <>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        className="animated"
        d={`M${sourceX},${sourceY} ${sourceX + xDistance / 10},${sourceY} ${
          targetX - xDistance / 10
        },${targetY} ${targetX},${targetY}`}
      />
    </>
  );
}
