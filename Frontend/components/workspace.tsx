import { useCallback, useEffect, useRef, useState } from "react";
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
import DistributionNode from "../components/DistributionNode";
import CustomEdge from "../components/customEdge";
import connectionLine from "./connectionLine";
import "reactflow/dist/base.css";
import SaveButton from "./SaveButton";
import DeleteButton from "./DeleteButton";
import DistributionList from "./DistributionList";
import Link from "next/link";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import ky from "ky-universal";
import { useQuery } from "@tanstack/react-query";
import ConstantNode from "./ConstantNode";
import PyMCButton from "./PyMCButton";
import PyMCModal from "./PyMCModal";

type modelResponse = {
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

  const { data: model, isLoading } = useQuery({
    queryKey: ["model", id],
    queryFn: () => fetchModel(),
    enabled: !!id,
    staleTime: Infinity,
  });

  //   useEffect(() => {
  //     if (model) {
  //       setNodes(model.body.nodes);
  //       setEdges(model.body.edges);
  //       setViewport(model.body.viewport);
  //     }
  //   }, [model]);

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
          <div className="bg-gray-100 rounded flex items-center">
            <Link href="/" className="hover:bg-gray-200 rounded p-1">
              <ArrowLeftIcon className="w-5" />
            </Link>
            <div className="relative hover:bg-gray-200 rounded p-1">
              <input
                type="text"
                value={modelname}
                size={modelname.length}
                onChange={(e) => {
                  setModelname(e.target.value);
                }}
                className="bg-transparent h-min"
              />
              <PencilIcon className="w-4 absolute top-1/2 right-1 -translate-y-1/2" />
            </div>
          </div>
          <DistributionList />
        </Panel>
        <Panel position="top-right" className="rounded flex gap-2">
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

const Workspace = () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);

export default Workspace;
