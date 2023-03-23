import { memo } from "react";
import { Node, Position, useNodes } from "reactflow";
import CustomHandle from "./customHandle";

const ConstantNode = memo(({ data, id }: any) => {
  const nodes = useNodes();
  const handleChange = (e: any) => {
    const changedNodes = nodes.map((node: Node) => {
      if (node.id == id) {
        console.log(node);
        const constant = parseFloat(e.target.value);
        return { ...node, data: { ...node.data, constant } };
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
          value={data.constant}
          size={4}
          onChange={(e) => handleChange(e)}
          className="p-1 bg-purple-300 text-sm"
        />
      </div>
      <div className="flex flex-col justify-center py-1">
        <CustomHandle
          key="support"
          id="constant"
          name="constant"
          type="source"
          position={Position.Right}
          isConnectable={false}
          className="h-full w-full"
        />
      </div>
    </div>
  );
});
ConstantNode.displayName = "ConstantNode";
export default ConstantNode;
