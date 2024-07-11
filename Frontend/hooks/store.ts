import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "reactflow";
import { create } from "zustand";

//import inital nodes and edges?

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: any) => void;
  setNodes: (nodes: any) => void;
  setEdges: (edges: any) => void;
  updateNodeName: (nodeId: string, name: string) => void;
};

export const useStore = create<RFState>((set, get) => ({
  nodes: [
    { id: "node_0", type: "constant", data: {}, position: { x: 250, y: 25 } },
  ],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  addNode: (node: Node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  setNodes: (nodes: Node[]) => {
    set({
      nodes: nodes,
    });
  },
  setEdges: (edges: Edge[]) => {
    set({
      edges: edges,
    });
  },
  updateNodeName: (nodeId, name) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, name };
        }
        return node;
      }),
    });
  },
}));

export const selector = (state: any) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  updateNodeName: state.updateNodeName,
});
