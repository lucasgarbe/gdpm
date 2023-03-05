import { FC } from "react";
import { Connection, Handle, NodeProps, Position, Node } from "reactflow";
import { shallow } from "zustand/shallow";
import { useStore, selector } from "../hooks/store";
import { validate, findPreviousNode } from "../internal/validate";
import { portSpec } from "../types/portSpec";

type props = {
  data: any;
};

type NodeData = {
  distribution: string;
};

const distributionNode: FC<NodeProps<NodeData>> = ({ data }: props) => {
  const { nodes, edges } = useStore(selector, shallow);
  const isValid = (connection: Connection): boolean => {
    const sourceOutput = data.dist.output;
    const targetNode: Node = nodes.find(
      (node: Node) => node.id == connection.target
    );
    const targetInput: portSpec = targetNode.data.dist.inputs.find(
      (input: any) => input.name == connection.targetHandle
    );

    //console.log(
    //  "find prev node: ",
    ////musse von aktueller node ausgehen, nicht von target
    //  findPreviousNode(sourceOutput, targetInput.name, edges, nodes)
    //);

    const v = validate(sourceOutput, targetInput);

    console.log("validating", sourceOutput, targetNode, targetInput, v);
    return v;
  };

  return (
    <div className="border border-blue-600 bg-blue-200 rounded px-8 py-4">
      {data.dist.inputs && (
        <div className="absolute top-0 left-0 -translate-x-1/2 flex flex-col justify-around h-full">
          {data.dist.inputs?.map((input: any, index: number) => (
            <div
              className="relative bg-black text-white text-[.4rem] p-1 rounded"
              key={index}
            >
              <Handle type="target" position={Position.Left} id={input.name} />
              {input.name}
            </div>
          ))}
        </div>
      )}

      <div>
        <p className="font-bold text-md">{data.dist.name}</p>
      </div>

      {data.dist.output && (
        <div className="absolute top-0 right-0 translate-x-1/2 flex flex-col justify-around h-full">
          <div className="relative bg-black text-white text-[.4rem] p-1 rounded">
            <Handle
              type="source"
              key="support"
              position={Position.Right}
              isValidConnection={isValid}
            />
            {data.dist.output.name}
          </div>
        </div>
      )}
    </div>
  );
};

export default distributionNode;
