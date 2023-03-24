import { memo } from "react";
import { Position, useEdges, useNodes } from "reactflow";
import { validate } from "../internal/validate";
import { portSpec } from "../types/portSpec";
import CustomHandle from "./customHandle";

const DistributionNode = memo(({ data, selected }: any) => {
  const nodes = useNodes();
  const edges = useEdges();

  return (
    <div className="flex">
      {selected && (
        <div className="absolute -top-10 flex gap-2 rounded bg-gray-50 border border-gray-100">
          <button className="p-1">edit</button>
          <button className="p-1">delete</button>
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
            ></CustomHandle>
          ))}
        </div>
      )}

      <div className="bg-blue-200 border border-blue-600 p-1 flex items-center justify-center">
        <p className="font-bold text-md">{data.dist.displayName}</p>
      </div>

      {data.dist.output && (
        <div className="flex flex-col justify-center py-1">
          <CustomHandle
            type="source"
            key="support"
            id={data.dist.output.id}
            portSpec={data.dist.output}
            position={Position.Right}
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

DistributionNode.displayName = "DistributionNode";
export default DistributionNode;
