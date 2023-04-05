import {
  ArrowDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useDistributions } from "../hooks/useDistributions";
import operations from "../internal/operations";
import { Button } from "./ButtonsAndLinks";

export default function DistributionList() {
  const { data, isLoading } = useDistributions();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return <div>loading</div>;
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(!open)} size="small">
        <PlusIcon className="w-5" />
        Add Nodes
      </Button>
    );
  }

  return (
    <div className="flex items-start gap-2 bg-stone-100">
      <Button onClick={() => setOpen(!open)} size="small">
        <PlusIcon className="w-5" />
        Add Nodes
      </Button>
      <ConstantButtom />
      <TypeList
        name="Discrete"
        distributions={data?.discrete}
        color="blue"
        type="distribution"
      />

      <TypeList
        name="Continuous"
        distributions={data?.continuous}
        color="amber"
        type="distribution"
      />
      <TypeList
        name="Operator"
        distributions={operations}
        color="green"
        type="operation"
      />
    </div>
  );
}

function ConstantButtom() {
  const handleDrag = (event: any): void => {
    if (event.dataTransfer === null) return;
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: "constant", value: 1, valueType: "int" })
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
function OperationListItem({ dist, color }: { dist: any; color: string }) {
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
      onDragStart={(event) => handleDrag(event, "operation", dist)}
    >
      {dist.displayName}
    </li>
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
  type,
}: {
  name: string;
  distributions: any;
  color: string;
  type: string;
}) {
  const [open, setOpen] = useState(false);

  const ListItem: any = ({ dist, i }: any) => {
    if (type == "distribution") {
      return <DistributionListItem dist={dist} color={color} key={i} />;
    }

    if (type == "operation") {
      return <OperationListItem dist={dist} color={color} key={i} />;
    }
  };
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
            <ListItem dist={dist} key={i} />
          ))}
        </ul>
      )}
    </div>
  );
}
