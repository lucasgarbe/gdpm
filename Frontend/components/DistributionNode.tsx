import { memo, useContext, useEffect, useState } from "react";
import { Position, useEdges, useNodes, useNodesState } from "reactflow";
import { shallow } from "zustand/shallow";
import { selector, useModelStore } from "../hooks/store";
import { validate } from "../internal/validate";
import { portSpec } from "../types/portSpec";
import { Button } from "./ButtonsAndLinks";
import CustomHandle from "./customHandle";
import { ModalContext, ModalContextType } from "./Modal";

const DistributionNode = memo(({ id, data, selected }: any) => {
  const { nodes, removeNode } = useModelStore(selector, shallow);
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
        <div className="w-full absolute -top-6 flex items-center justify-center gap-1">
          <button className="text-xs px-1 border border-stone-900 bg-stone-200" onClick={() => removeNode(id)}>Delete</button>
          <button
            className="text-xs px-1 border border-stone-900 bg-stone-200"
            onClick={() => {
              openModal(
                "bottom",
                <DistributionNodeModal id={id} name={data.name} />
              );
            }}
          >
            Info
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
  const [value, setValue] = useState("");
  const { updateNodeName } = useModelStore();
  const { closeModal } = useContext(ModalContext) as ModalContextType;

  const handleClick = () => {
    updateNodeName(id, value);
    closeModal();
  }

  return (
    <>
      <p className="text-xl font-semibold">Distribution</p>
      <div className="w-full flex flex-col items-start mt-4">
        <label>
          Name:
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            className="ml-2 px-1 py-0.5 bg-stone-200"
          />
        </label>
        <Button className="self-end" onClick={handleClick}>update</Button>
      </div>
    </>
  );
};

DistributionNode.displayName = "DistributionNode";
export default DistributionNode;
