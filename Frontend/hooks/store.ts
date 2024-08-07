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
  removeNode: (nodeId: string) => void;
  setEdges: (edges: any) => void;
  updateNodeName: (nodeId: string, name: string) => void;
  modelname: string;
  setModelname: (name: string) => void;
};

export const useModelStore = create<RFState>((set, get) => ({
  modelName: "New Model",
  nodes: [],
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
  removeNode: (nodeId: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
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
  setModelname: (name) => {
    set({
      modelname: name,
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
  removeNode: state.removeNode,
  setEdges: state.setEdges,
  updateNodeName: state.updateNodeName,
  modelname: state.modelname,
  setModelname: state.setModelname,
});
