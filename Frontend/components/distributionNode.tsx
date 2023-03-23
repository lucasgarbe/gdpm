import { memo } from "react";
import { Position, Node, Connection, useEdges, useNodes } from "reactflow";
import { validate } from "../internal/validate";
import { portSpec } from "../types/portSpec";
import CustomHandle from "./customHandle";

const DistributionNode = memo(({ data, selected }: any) => {
  const nodes = useNodes();
  const edges = useEdges();
  const isValid = (connection: Connection): boolean => {
    const sourceOutput = data.dist.output;
    const targetNode: Node = nodes.find(
      (node: Node) => node.id == connection.target
    );
    const targetInput: portSpec = targetNode.data.dist.input.find(
      (input: any) => input.id == connection.targetHandle
    );

    const sourceNode: Node = nodes.find(
      (node: Node) => node.id == connection.source
    );

    const v = validate(sourceNode, sourceOutput, targetInput);

    console.log("validating", sourceOutput, targetNode, targetInput, v);
    return v;
  };

  return (
    <div className="flex">
      {selected && (
        <div className="absolute -top-10 flex gap-2 rounded bg-gray-50 border border-gray-100">
          <button className="p-1">edit</button>
          <button className="p-1">delete</button>
        </div>
      )}
      {data.dist.input && (
        <div className="h-full flex flex-col justify-between gap-1 py-1">
          {data.dist.input?.map((input: any, index: number) => (
            <CustomHandle
              type="target"
              key={index}
              id={input.id}
              name={input.id}
              position={Position.Left}
            ></CustomHandle>
          ))}
        </div>
      )}

      <div className="bg-blue-200 border border-blue-600 p-1 flex items-center justify-center">
        <p className="font-bold text-md">{data.dist.name}</p>
      </div>

      {data.dist.output && (
        <div className="flex flex-col justify-center py-1">
          <CustomHandle
            type="source"
            key="support"
            id={data.dist.output.id}
            name={data.dist.output.id}
            position={Position.Right}
            isValidConnection={isValid}
            className={"w-full h-full"}
          ></CustomHandle>
        </div>
      )}
    </div>
  );
});

DistributionNode.displayName = "DistributionNode";
export default DistributionNode;
