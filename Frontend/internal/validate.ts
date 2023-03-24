import { Connection, Edge, Node } from "reactflow";
import { portSpec } from "../types/portSpec";

export const validateType = (a: string, b: string) => {
  if (a == "int" && b == "float") return true;
  return a == b;
};

export const validateUpper = (a: portSpec, b: portSpec): boolean => {
  console.log("validateUpper", { a, b });
  if (a.upper == b.upper) return true;

  const aParsed = parseFloat(a.upper);
  const bParsed = parseFloat(b.upper);

  // check if b.upper is a number
  if (isNaN(bParsed)) {
    //b.upper is not a number

    //check if a.upper is a number
    if (isNaN(aParsed)) {
      //a.upper is not an number
      //possible solutions should always be true both can only be "inf"
      return true;
    } else {
      //a.upper is a number
      // possible solutions should always be true b.upper can only be "inf" (a < inf)
      return true;
    }
  } else {
    //b.upper is a number

    //check if a.upper is a number
    if (isNaN(aParsed)) {
      //a.upper is not an number
      //possible solutions should always be false, b is number and a is inf
      return false;
    } else {
      //a.upper is a number
      //both a and b are numbers: compare

      //is inclusive?
      if (b.upperInclusive) {
        return a <= b;
      } else {
        return a < b;
      }
    }
  }
};

export const validateLower = (a: portSpec, b: portSpec) => {
  console.log("validateLower", { a, b });
  if (a.lower == b.lower) return true;

  const aParsed = parseFloat(a.lower);
  const bParsed = parseFloat(b.lower);

  // check if b.lower is a number
  if (isNaN(bParsed)) {
    //b.upper is not a number

    //check if a.lower is a number
    if (isNaN(aParsed)) {
      //a.lower is not an number
      //possible solutions should always be true both can only be "-inf"
      return true;
    } else {
      //a.lower is a number
      // possible solutions should always be true b.lower can only be "-inf" (a > -inf)
      return true;
    }
  } else {
    //b.lower is a number

    //check if a.upper is a number
    if (isNaN(aParsed)) {
      //a.lower is not an number
      //possible solutions should always be false, b is number and a is -inf
      return false;
    } else {
      //a.lower is a number
      //both a and b are numbers: compare

      //is inclusive?
      if (b.lowerInclusive) {
        return a >= b;
      } else {
        return a > b;
      }
    }
  }
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

const targetHandleIsEmpty = (
  node: Node,
  handleId: string,
  edges: Edge[]
): boolean => {
  console.log("empty?", edges);
  const alreadyConnectedEdge = edges.find((edge: Edge) => {
    return edge.target == node.id && edge.targetHandle == handleId;
  });
  return alreadyConnectedEdge ? false : true;
};

const findSourceHandleFromNode = (node: Node): any | undefined => {
  return node.data.dist.output;
};

const validateConstant = (
  connection: Connection,
  nodes: Node[],
  edges: Edge[]
): boolean => {
  console.log(edges);
  if (!connection.source) return false;
  const sourceNode = findSourceNodeFromId(connection.source, nodes);
  console.log("is constant");
  if (typeof sourceNode === "undefined") return false;

  if (!connection.target) return false;
  const targetNode = findTargetNodeFromId(connection.target, nodes);
  if (typeof targetNode === "undefined") return false;
  if (!connection.targetHandle) return false;
  if (!targetHandleIsEmpty(targetNode, connection.targetHandle, edges))
    return false;
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

const validateDistribution = (
  connection: Connection,
  nodes: Node[],
  edges: Edge[]
) => {
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
  if (!targetHandleIsEmpty(targetNode, connection.targetHandle, edges))
    return false;
  const targetHandle = findTargetHandleFromNode(
    targetNode,
    connection.targetHandle
  );

  const vtype = validateType(sourceHandle.type, targetHandle.type);
  const upper = validateUpper(sourceNode.data.dist.output, targetHandle);
  const lower = validateLower(sourceNode.data.dist.output, targetHandle);
  console.log({
    validating: "distribution",
    connection,
    sourceNode,
    targetNode,
    targetHandle,
    vtype,
    upper,
    lower,
  });
  return vtype && upper && lower;
};

export const validate = (
  connection: Connection,
  nodes: Node[],
  edges: Edge[]
): boolean => {
  console.log(edges);
  if (!connection.source) return false;
  const sourceNode = findSourceNodeFromId(connection.source, nodes);

  if (typeof sourceNode === "undefined") return false;
  // Handle constant node as source
  if (sourceNode.type == "constant") {
    return validateConstant(connection, nodes, edges);
  }

  if (sourceNode.type == "distribution") {
    return validateDistribution(connection, nodes, edges);
  }

  return false;
};
