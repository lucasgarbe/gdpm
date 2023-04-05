import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from "reactflow";
import DistributionNode from "./DistributionNode";
import CustomEdge from "../components/customEdge";
import connectionLine from "./connectionLine";
import "reactflow/dist/base.css";
import SaveButton from "./SaveButton";
import DeleteButton from "./DeleteButton";
import DistributionList from "./DistributionList";
import Link from "next/link";
import {
  ArrowLeftIcon,
  Cog8ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import ky from "ky-universal";
import { useQuery } from "@tanstack/react-query";
import ConstantNode from "./ConstantNode";
import PyMCButton from "./PyMCButton";
import PyMCModal from "./PyMCModal";
import OperationNode from "./OperationNode";
import { Button, HighlightLink } from "./ButtonsAndLinks";
import Modal from "./Modal";

type modelResponse = {
  id: string;
  title: string;
  body: {
    id: string;
    title: string;
    nodes: any;
    edges: any;
    viewport: any;
    lastIndex: number;
  };
};

const nodeTypes = {
  distribution: DistributionNode,
  constant: ConstantNode,
  operation: OperationNode,
};

const edgeTypes = {
  default: CustomEdge,
};

function Flow() {
  const router = useRouter();
  const flowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [modelname, setModelname] = useState("Modelname");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setViewport } = useReactFlow();
  const [lastIndex, setLastIndex] = useState(0);
  const [showPyMCModal, setShowPyMCModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const { id } = router.query;
  const fetchModel = async () => {
    const model: modelResponse = await ky
      .get(`${process.env.NEXT_PUBLIC_API_URL}/models/${id}`)
      .json();
    if (model) {
      setNodes(model.body.nodes);
      setEdges(model.body.edges);
      setViewport(model.body.viewport);
      setLastIndex(model.body.lastIndex);
    }
    return model;
  };

  const onConnect = useCallback(
    (params: any) => setEdges((edges) => addEdge(params, edges)),
    [setEdges]
  );

  const { data, isLoading } = useQuery({
    queryKey: ["model", id],
    queryFn: () => fetchModel(),
    enabled: !!id,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (data) {
        setModelname(data.title);
        setNodes(data.body.nodes);
        setEdges(data.body.edges);
        setViewport(data.body.viewport);
        setLastIndex(data.body.lastIndex);
      }
    },
  });

  const onDragOver = useCallback((event: any) => {
    console.log("drag over");
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      console.log("on drop");
      event.preventDefault();

      if (flowWrapper.current === null) return;
      const wrapper = flowWrapper.current as any;
      const reactFlowBounds = wrapper.getBoundingClientRect();
      const data = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );

      // check if the dropped element is valid
      if (typeof data.type === "undefined" || !data.type) {
        return;
      }

      if (reactFlowInstance === null) return;
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const onChange = (event: any, id: string) => {
        console.log("CHANGE", id, event);
        const changedNode = nodes.find((node) => {
          return node.id == id;
        });
        console.log(changedNode, nodes);
      };

      const newNodeId = "node_" + lastIndex;
      setLastIndex(lastIndex + 1);
      console.log(nodes, newNodeId);
      if (data.type == "constant") {
        const newNode = {
          id: newNodeId,
          type: data.type,
          position,
          data: {
            setNodes,
            onChange,
            value: data.value,
            valueType: data.valueType,
          },
        };
        setNodes(() => nodes.concat(newNode));
      } else if (data.type == "distribution") {
        const newNode = {
          id: newNodeId,
          type: data.type,
          position,
          data: { dist: data.dist },
        };
        setNodes(() => [...nodes, newNode]);
      } else if (data.type == "operation") {
        const newNode = {
          id: newNodeId,
          type: data.type,
          position,
          data: { dist: data.dist },
        };
        setNodes(() => [...nodes, newNode]);
      }
    },
    [nodes, reactFlowInstance, lastIndex, setLastIndex, setNodes]
  );

  if (id && isLoading) {
    return <h1 className="h-screen w-screen">loading</h1>;
  }

  return (
    <div className="h-full w-full" ref={flowWrapper}>
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
        <Panel position="top-left" className="flex items-start gap-2">
          <div className="flex gap-2">
            <HighlightLink href="/" size="small">
              <ArrowLeftIcon className="w-5" />
            </HighlightLink>
            <Button onClick={() => setShowSettingsModal(true)} size="small">
              <Cog8ToothIcon className="w-5" />
              Settings
            </Button>
          </div>
          <DistributionList />
        </Panel>
        <Panel position="top-right" className="flex gap-2">
          <PyMCButton
            id={id}
            toggleModal={() => setShowPyMCModal(!showPyMCModal)}
          />
          {id && <DeleteButton id={id} />}
          <SaveButton
            reactFlowInstance={reactFlowInstance}
            modelname={modelname}
            lastIndex={lastIndex}
          />
        </Panel>
        {showPyMCModal && (
          <PyMCModal id={id} closeModal={() => setShowPyMCModal(false)} />
        )}

        <Modal
          open={showSettingsModal}
          close={() => setShowSettingsModal(false)}
        >
          <p className="text-xl font-semibold">Settings</p>
          <div className="mt-6">
            <label className="flex items-center gap-2">
              Modelname:
              <input
                type="text"
                value={modelname}
                onChange={(e) => {
                  setModelname(e.target.value);
                }}
                className="bg-stone-300 p-1"
              />
            </label>
          </div>
        </Modal>
        <Background />
      </ReactFlow>
    </div>
  );
}

const Workspace = () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);

export default Workspace;
