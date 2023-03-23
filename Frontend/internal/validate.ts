import { Connection, Node, useNodes } from "reactflow";
import { portSpec, bound } from "../types/portSpec";

export const validateType = (a: string, b: string) => {
  if (a == "int" && b == "float") return true;
  return a == b;
};

export const validateUpperBound = (a: portSpec, b: portSpec) => {
  return (
    compareBound(a.upperBound, b.upperBound) == 0 ||
    compareBound(a.upperBound, b.upperBound) == -1
  );
};

export const validateLowerBound = (a: portSpec, b: portSpec) => {
  return (
    compareBound(a.lowerBound, b.lowerBound) == 0 ||
    compareBound(a.lowerBound, b.lowerBound) == -1
  );
};

export const validateUpper = (a: portSpec, b: portSpec) => {
  return a.upper == b.upper;
};

export const validateLower = (a: portSpec, b: portSpec) => {
  return a.lower == b.lower;
};

const compareBound = (a: bound, b: bound): -1 | 0 | 1 => {
  if (a == b) return 0;

  if (a == "open" && b == "closed") {
    return 1;
  } else {
    return -1;
  }
};

const getInputPortSpec = (node: Node, inputString: string): portSpec | null => {
  //find input portspec from support/output port spec
  // needs outputHandleId and nodeId to find node in nodes or GETS NODE DIRECTLY

  // check if output is dependent on inputs
  if (!inputString.includes("inputs[")) return null;

  const inputName = inputString.substring(
    inputString.indexOf("[") + 1,
    inputString.lastIndexOf("]")
  );

  const inputPort = node.data.dist.inputs.find(
    (input: portSpec) => input.name == inputName
  );

  console.log(node, inputName, inputPort);

  return inputPort;
};

const findSourceNodeFromId = (
  nodeId: string,
  nodes: Node[]
): Node | undefined => {
  const sourceNode = nodes.find((n) => {
    return n.id == nodeId;
  });
  return sourceNode;
};

const findTargetNodeFromId = (
  nodeId: string,
  nodes: Node[]
): Node | undefined => {
  const targetNode = nodes.find((n) => {
    return n.id == nodeId;
  });
  return targetNode;
};

const findTargetHandleFromNode = (
  node: Node,
  handleId: string
): any | undefined => {
  const targetHandle = node.data.dist.input.find(
    (input: any) => input.id == handleId
  );

  return targetHandle;
};

const findSourceHandleFromNode = (node: Node): any | undefined => {
  return node.data.dist.output;
};

const validateConstant = (connection: Connection, nodes: Node[]): boolean => {
  if (!connection.source) return false;
  const sourceNode = findSourceNodeFromId(connection.source, nodes);
  console.log("is constant");
  if (typeof sourceNode === "undefined") return false;

  if (!connection.target) return false;
  const targetNode = findTargetNodeFromId(connection.target, nodes);
  if (typeof targetNode === "undefined") return false;
  if (!connection.targetHandle) return false;
  const targetHandle = findTargetHandleFromNode(
    targetNode,
    connection.targetHandle
  );

  const vtype = validateType(sourceNode.data.valueType, targetHandle.type);
  console.log({
    validating: "constant",
    connection,
    sourceNode,
    targetNode,
    targetHandle,
    vtype,
  });
  return vtype;
};

const validateDistribution = (connection: Connection, nodes: Node[]) => {
  if (!connection.source) return false;
  const sourceNode = findSourceNodeFromId(connection.source, nodes);
  console.log("is distribution");
  if (typeof sourceNode === "undefined") return false;
  if (!connection.sourceHandle) return false;
  const sourceHandle = findSourceHandleFromNode(sourceNode);

  if (!connection.target) return false;
  const targetNode = findTargetNodeFromId(connection.target, nodes);
  if (typeof targetNode === "undefined") return false;
  if (!connection.targetHandle) return false;
  const targetHandle = findTargetHandleFromNode(
    targetNode,
    connection.targetHandle
  );

  const vtype = validateType(sourceHandle.type, targetHandle.type);
  console.log({
    validating: "distribution",
    connection,
    sourceNode,
    targetNode,
    targetHandle,
    vtype,
  });
  return vtype;
};

export const validate = (connection: Connection, nodes: Node[]): boolean => {
  if (!connection.source) return false;
  const sourceNode = findSourceNodeFromId(connection.source, nodes);

  // const targetNode = nodes.find((n) => {
  // return n.id == connection.target;
  // });

  // if (typeof targetNode === "undefined") {
  // console.log("NO TARGETNODE");
  // return false;
  // }

  // const targetHandle = targetNode.data.dist.input.find(
  // (input: any) => input.id == connection.targetHandle
  // );

  if (typeof sourceNode === "undefined") return false;
  // Handle constant node as source
  if (sourceNode.type == "constant") {
    return validateConstant(connection, nodes);
  }

  if (sourceNode.type == "distribution") {
    return validateDistribution(connection, nodes);
  }

  return false;

  // return (
  //   validateType(source, target) &&
  //   validateLowerBound(source, target) &&
  //   validateUpperBound(source, target) &&
  //   validateUpper(source, target)
  // );
};
