import { memo, useContext, useEffect, useState } from "react";
import { Position, useEdges, useNodes, useNodesState } from "reactflow";
import { shallow } from "zustand/shallow";
import { selector, useStore } from "../hooks/store";
import { validate } from "../internal/validate";
import { portSpec } from "../types/portSpec";
import CustomHandle from "./customHandle";
import { ModalContext, ModalContextType } from "./Modal";

const DistributionNode = memo(({ id, data, selected }: any) => {
  const { nodes } = useStore(selector, shallow);
  const [color, setColor] = useState("stone");
  const { openModal } = useContext(ModalContext) as ModalContextType;
  const edges = useEdges();

  useEffect(() => {
    console.log("effect", data.dist.distType);
    switch (data.dist.distType) {
      case "continuous":
        setColor("amber");
        break;
      case "discrete":
        setColor("blue");
        break;
    }
  }, [data.dist.distType]);

  return (
    <div className="flex">
      {selected && (
        <div className="absolute -top-10 flex gap-2 rounded bg-gray-50 border border-gray-100">
          <button className="p-1">delete</button>
          <button
            onClick={() => {
              openModal(
                "bottom",
                <DistributionNodeModal id={id} name={data.name} />
              );
            }}
          >
            info
          </button>
        </div>
      )}

      {data.dist.input && (
        <div className="flex flex-col justify-center gap-1 py-1">
          {data.dist.input?.map((input: portSpec, index: number) => (
            <CustomHandle
              type="target"
              key={index}
              id={input.id}
              portSpec={input}
              position={Position.Left}
              optional={input.optional}
              isConnectableStart={false}
            ></CustomHandle>
          ))}
        </div>
      )}

      <div
        className={`bg-${color}-200 border border-${color}-600 p-1 flex flex-col justify-center`}
      >
        <p className="text-sm font-semibold mb-auto">{data.name}</p>
        <p className="text-xxs mt-2">{data.dist.displayName}</p>
        <p className="text-xxs">{id}</p>
      </div>

      {data.dist.output && (
        <div className="flex flex-col justify-center py-1">
          <CustomHandle
            type="source"
            key="support"
            id={data.dist.output.id}
            portSpec={data.dist.output}
            position={Position.Right}
            optional={false}
            isValidConnection={(connection) =>
              validate(connection, nodes, edges)
            }
            isConnectable={false}
            className={"w-full h-full"}
          ></CustomHandle>
        </div>
      )}
    </div>
  );
});

const DistributionNodeModal = ({ id, name }: { id: string; name: string }) => {
  const { updateNodeName } = useStore();
  return (
    <>
      <p className="text-xl font-semibold">Distribution</p>
      <div className="mt-4">
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => {
              updateNodeName(id, e.target.value);
            }}
            className="ml-2 px-1 py-0.5 bg-stone-200"
          />
        </label>
      </div>
    </>
  );
};

DistributionNode.displayName = "DistributionNode";
export default DistributionNode;
