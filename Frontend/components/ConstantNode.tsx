import { memo, useCallback } from "react";
import { Node, Position, useEdges, useNodes } from "reactflow";
import { validate } from "../internal/validate";
import CustomHandle from "./customHandle";

const ConstantNode = memo(({ data, id }: any) => {
  const nodes = useNodes();
  const edges = useEdges();

  const handleChange = (e: any) => {
    const changedNodes = nodes.map((node: Node) => {
      if (node.id == id) {
        console.log(node);
        const value = parseFloat(e.target.value);
        const valueType = value % 1 === 0 ? "int" : "float";
        return { ...node, data: { ...node.data, value, valueType } };
      }

      return node;
    });
    data.setNodes(changedNodes);
  };

  return (
    <div className="flex">
      <div className="bg-purple-200 border border-purple-600 p-2 flex items-center justify-center">
        <input
          type="number"
          value={data.value}
          size={4}
          onChange={(e) => handleChange(e)}
          className="p-1 bg-purple-300 text-sm"
        />
      </div>
      <div className="flex flex-col justify-center py-1">
        <CustomHandle
          key="support"
          id="constant"
          type="source"
          portSpec={{ id: "support" }}
          position={Position.Right}
          isConnectable={false}
          optional={false}
          isValidConnection={(connection) => validate(connection, nodes, edges)}
          className="h-full w-full"
        />
      </div>
    </div>
  );
});

ConstantNode.displayName = "ConstantNode";
export default ConstantNode;
