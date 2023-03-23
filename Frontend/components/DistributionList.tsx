import {
  ArrowDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useDistributions } from "../hooks/useDistributions";

export default function DistributionList() {
  const { data, isLoading } = useDistributions();

  if (isLoading) {
    return <div>loading</div>;
  }

  return (
    <div className="flex items-start gap-2 bg-gray-100 rounded">
      <ConstantButtom />
      <TypeList name="Discrete" distributions={data?.discrete} color="blue" />

      <TypeList
        name="Continuous"
        distributions={data?.continuous}
        color="amber"
      />
    </div>
  );
}

function ConstantButtom() {
  const handleDrag = (event: any): void => {
    if (event.dataTransfer === null) return;
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: "constant", constant: 1.0 })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <button
      className="bg-purple-100 hover:bg-purple-200 p-1 rounded"
      draggable
      onDragStart={(event) => handleDrag(event)}
    >
      Constant
    </button>
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
      {dist.displayName}
    </li>
  );
}

function TypeList({
  name,
  distributions,
  color,
}: {
  name: string;
  distributions: any;
  color: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => {
          setOpen(!open);
        }}
        className="flex gap-1 hover:bg-gray-200 rounded p-1"
      >
        {name}
        {open ? (
          <ChevronUpIcon className="w-5" />
        ) : (
          <ChevronDownIcon className="w-5" />
        )}
      </button>
      {open && (
        <ul className="flex flex-col gap-1">
          {distributions.map((dist: any, i: number) => (
            <DistributionListItem dist={dist} color={color} key={i} />
          ))}
        </ul>
      )}
    </div>
  );
}
