import { shallow } from "zustand/shallow";
import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  MiniMap,
  Panel,
} from "reactflow";
import DistributionNode from "../components/distributionNode";
import { useStore, selector } from "../hooks/store";
import CustomEdge from "../components/customEdge";
import connectionLine from "./connectionLine";
import "reactflow/dist/base.css";
import SaveButton from "./SaveButton";
import DeleteButton from "./DeleteButton";
import DistributionList from "./DistributionList";
import Link from "next/link";
import ArrowLeft from "./arrow-left";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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
  const [modelname, setModelname] = useState("Model");

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
          <Panel
            position="top-left"
            className="bg-gray-100 rounded flex items-start p-1"
          >
            <div className="flex items-center gap-2">
              <Link href="/">
                <ArrowLeftIcon className="w-5" />
              </Link>
              <input
                type="text"
                value={modelname}
                onChange={(e) => {
                  setModelname(e.target.value);
                }}
                className="bg-transparent h-min"
              />
            </div>
            <DistributionList />
          </Panel>
          <Panel position="top-right" className="bg-gray-100 rounded flex">
            <DeleteButton
              reactFlowInstance={reactFlowInstance}
              modelname={modelname}
            />
            <SaveButton
              reactFlowInstance={reactFlowInstance}
              modelname={modelname}
            />
          </Panel>
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
