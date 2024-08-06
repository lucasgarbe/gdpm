import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
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
import { ArrowLeftIcon, Cog8ToothIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import ky from "ky-universal";
import { useQuery } from "@tanstack/react-query";
import ConstantNode from "./ConstantNode";
import PyMCButton from "./PyMCButton";
import PyMCModal from "./PyMCModal";
import OperationNode from "./OperationNode";
import { Button, HighlightLink } from "./ButtonsAndLinks";
import {
  useModal,
  ModalProvider,
  ModalContext,
  ModalContextType,
} from "./Modal";

import { shallow } from "zustand/shallow";
import { useStore, selector } from "../hooks/store";

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

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setNodes,
    setEdges,
  } = useStore(selector, shallow);

  const { setViewport } = useReactFlow();
  const [lastIndex, setLastIndex] = useState(0);
  const [showPyMCModal, setShowPyMCModal] = useState(false);

  const { openModal } = useContext(ModalContext) as ModalContextType;

  const { id } = router.query;
  const fetchModel = async () => {
    const model: modelResponse = await ky
      .get(`${process.env.NEXT_PUBLIC_API_URL}/models/${id}`)
      .json();
    // if (model) {
    //   setNodes(model.body.nodes);
    //   setEdges(model.body.edges);
    //   setViewport(model.body.viewport);
    //   setLastIndex(model.body.lastIndex);
    // }
    return model;
  };

  // const onConnect = useCallback(
  //   (params: any) => setEdges((edges) => addEdge(params, edges)),
  //   [setEdges]
  // );

  const { data, isLoading } = useQuery({
    queryKey: ["model", id || "new"],
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
        addNode(newNode);
      } else if (data.type == "distribution") {
        const newNode = {
          id: newNodeId,
          type: data.type,
          position,
          data: { dist: data.dist, name: data.dist.displayName },
        };
        addNode(newNode);
      } else if (data.type == "operation") {
        const newNode = {
          id: newNodeId,
          type: data.type,
          position,
          data: { dist: data.dist },
        };
        addNode(newNode);
      }
    },
    [nodes, reactFlowInstance, lastIndex, setLastIndex, setNodes]
  );

  const handleModelnameChange = (e: any) => {
    setModelname(e.target.value);
  }

  if (id && isLoading) {
    return <h1 className="h-screen w-screen">loading</h1>;
  }

  return (
    <div className="h-screen w-full" ref={flowWrapper}>
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
        <Panel position="top-left" className="w-1/6 h-full flex flex-col items-start gap-2 !m-0 p-[15px] bg-stone-100 border-r-2 border-black">
          <div className="flex gap-2">
            <HighlightLink href="/" size="small">
              <ArrowLeftIcon className="w-5" />
            </HighlightLink>
            <Button
              onClick={() =>
                openModal(
                  "top",
                  <SettingsModal
                    modelname={modelname}
                    updateModelname={handleModelnameChange}
                  />
                )
              }
              size="small"
            >
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
        <Background />
      </ReactFlow>
    </div>
  );
}

const SettingsModal = ({ modelname, handleModelnameChange }: any) => {
  return (
    <>
      <p className="text-xl font-semibold">Settings</p>
      <div className="mt-4">
        <label>
          Modelname:
          <input
            type="text"
            value={modelname}
            onChange={handleModelnameChange}
            className="ml-2 px-1 py-0.5 bg-stone-200"
          />
        </label>
      </div>
    </>
  );
};

const SimpleInput = ({ value, onChange }: any) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="ml-2 px-1 py-0.5 bg-stone-200"
    />
  );
}

const Workspace = () => (
  <ReactFlowProvider>
    <ModalProvider>
      <Flow />
    </ModalProvider>
  </ReactFlowProvider>
);

export default Workspace;
