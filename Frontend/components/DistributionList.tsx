import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useDistributions } from "../hooks/useDistributions";
import operations from "../internal/operations";
import SimpleBarReact from "simplebar-react";
import "../node_modules/simplebar-core/dist/simplebar.css";

export default function DistributionList() {
  const { data, isLoading } = useDistributions();
  const [info, setInfo] = useState<string|null>(null);

  const handleClick = (info: string|null) => () => {
    console.log("handle click", info)
    setInfo(info);
  }

  if (isLoading) {
    return <div>loading</div>;
  }

  return (
    <SimpleBarReact className="min-h-full max-h-[100% - 15px] w-full overlfow-y-scroll pb-12">
      <div className="w-full h-full flex flex-col items-start gap-2 bg-stone-100">
        <InfoBox info={info} handleClick={handleClick} />
          <div className="w-full h-full flex flex-col gap-2">
            <ConstantButtom handleClick={handleClick} />
            <TypeList
              name="Discrete"
              distributions={data?.discrete}
              color="blue"
              type="distribution"
              handleClick={handleClick}
            />

            <TypeList
              name="Continuous"
              distributions={data?.continuous}
              color="amber"
              type="distribution"
              handleClick={handleClick}
            />
            <TypeList
              name="Operator"
              distributions={operations}
              color="green"
              type="operation"
              handleClick={handleClick}
            />
          </div>
      </div>
    </SimpleBarReact>
  );
}

function InfoBox({info, handleClick}: {info: any, handleClick: Function}) {
    return (
      <div className="w-full h-1/6 flex flex-col gap-2 p-1 bg-stone-200 border border-black sticky top-0">
        <div className="w-full flex justify-between gap-2">
          <div className="text-xs text-stone-600">Infobox</div>
          {info &&
            <button onClick={handleClick(null)}>
              <XMarkIcon className="w-5 text-stone-600" />
            </button>
          }
        </div>
        <p className="text-stone-900">
          {info ? info.displayName ? (
          <div>
            <div>{info.displayName}</div>
            <a className="text-blue-600 underline" href={info.url} target="_blank">Documentation</a>
            <img src={info.image_url} />
          </div>
          ): info : "Select a distribution"}
        </p>
      </div>
    );
}

function ConstantButtom({handleClick}: {handleClick: any}) {
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
      className="w-full bg-purple-200 p-1 border border-purple-600"
      draggable
      onDragStart={(event) => handleDrag(event)}
      onClick={handleClick("constant")}
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

function DistributionListItem({ dist, color, handleClick }: { dist: any; color: string, handleClick: Function }) {
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
      onClick={handleClick(dist)}
    >
      {dist.name}
    </li>
  );
}

function TypeList({
  name,
  distributions,
  color,
  type,
  handleClick
}: {
  name: string;
  distributions: any;
  color: string;
  type: string;
  handleClick: Function; //handleClick for listitem
}) {
  const [open, setOpen] = useState(false);

  const ListItem: any = ({ dist, i }: any) => {
    if (type == "distribution") {
      return <DistributionListItem dist={dist} color={color} key={i} handleClick={handleClick} />;
    }

    if (type == "operation") {
      return <OperationListItem dist={dist} color={color} key={i} />;
    }
  };
  return (
    <div className="border border-black">
      <button
        onClick={() => {
          setOpen(!open);
        }}
        className="w-full flex justify-between gap-1 px-4 hover:bg-gray-200 p-1"
      >
        {name}
        {open ? (
          <ChevronUpIcon className="w-5" />
        ) : (
          <ChevronDownIcon className="w-5" />
        )}
      </button>
      {open && (
        <ul className="flex flex-col gap-1 p-2">
          {distributions.map((dist: any, i: number) => (
            <ListItem dist={dist} key={i} />
          ))}
        </ul>
      )}
    </div>
  );
}
