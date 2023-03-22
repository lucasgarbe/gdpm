import { useDistributions } from "../hooks/useDistributions";

export default function DistributionList() {
  const { data, isLoading } = useDistributions();

  if (isLoading) {
    return <div>loading</div>;
  }

  return (
    <div className="flex gap-2">
      <div>
        <h2>Discrete</h2>
        <ul className="flex flex-col gap-1">
          {data?.discrete.map((dist: any, i: number) => (
            <DistributionListItem dist={dist} color="blue" key={i} />
          ))}
        </ul>
      </div>

      <div>
        <h2>Continuous</h2>
        <ul className="flex flex-col gap-1">
          {data?.continuous.map((dist: any, i: number) => (
            <DistributionListItem dist={dist} color="amber" key={i} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function DistributionListItem({ dist, color }: { dist: any; color: string }) {
  const handleDrag = (event: any, nodeType: string, dist: Object): void => {
    if (event.dataTransfer === null) return;
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: nodeType, dist: dist })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <li
      className={`p-1 cursor-pointer bg-${color}-200 border border-${color}-600 text-center`}
      draggable
      onDragStart={(event) => handleDrag(event, "distribution", dist)}
    >
      {dist.name}
    </li>
  );
}
