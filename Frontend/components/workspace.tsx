import { shallow } from "zustand/shallow";
import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  MiniMap,
  Panel,
} from "reactflow";
import {
  ArrowPathIcon,
  CloudArrowDownIcon,
  CloudIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import DistributionNode from "../components/DistributionNode";
import { useStore, selector } from "../hooks/store";
import CustomEdge from "../components/customEdge";
import connectionLine from "./connectionLine";
import "reactflow/dist/base.css";
import { useUpdateModel } from "../hooks/useUpdateModel";

interface WorkspaceProps {
  className: string;
}

let id = 0;
const getId = () => `node_${id++}`;

const nodeTypes = {
  distribution: DistributionNode,
};

const edgeTypes = {
  default: CustomEdge,
};

export default function Workspace({ className }: WorkspaceProps) {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } =
    useStore(selector, shallow);
  const updateModelMutation = useUpdateModel();

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      if (reactFlowWrapper.current === null) return;
      const wrapper = reactFlowWrapper.current as any;
      const reactFlowBounds = wrapper.getBoundingClientRect();
      const data = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );
      console.log(data);

      // check if the dropped element is valid
      if (typeof data.type === "undefined" || !data.type) {
        return;
      }

      if (reactFlowInstance === null) return;
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type: data.type,
        position,
        data: { dist: data.dist },
      };

      // setNodes((nds) => nds.concat(newNode));
      addNode(newNode);
    },
    [reactFlowInstance]
  );

  const handleSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      updateModelMutation.mutate({ id: 1, title: "test", body: flow });
    }
  }, [reactFlowInstance]);

  return (
    <div className={className} ref={reactFlowWrapper}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          connectionLineComponent={connectionLine}
          fitView
        >
          <Controls />
          <MiniMap />
          <Panel position="top-right" className="bg-gray-100 rounded flex">
            <button className="p-1 hover:bg-gray-200 rounded">
              <TrashIcon className="w-5" />
            </button>
            <button
              className="p-1 hover:bg-gray-200 rounded"
              onClick={handleSave}
            >
              {updateModelMutation.isLoading ? (
                <ArrowPathIcon className="w-5" />
              ) : (
                <>
                  {updateModelMutation.isError ? (
                    <ExclamationTriangleIcon className="w-5 text-red-500" />
                  ) : (
                    <>
                      {updateModelMutation.isSuccess ? (
                        <CloudIcon className="w-5 text-green-500" />
                      ) : (
                        <CloudArrowDownIcon className="w-5" />
                      )}
                    </>
                  )}
                </>
              )}
            </button>
          </Panel>
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
