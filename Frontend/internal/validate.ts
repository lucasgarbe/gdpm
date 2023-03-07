import { Node } from "reactflow";
import { portSpec, bound } from "../types/portSpec";

export const validateType = (a: portSpec, b: portSpec) => {
  return a.type == b.type;
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

export const validate = (
  sourceNode: Node,
  source: portSpec,
  target: portSpec
) => {
  return (
    validateType(source, target) &&
    validateLowerBound(source, target) &&
    validateUpperBound(source, target) &&
    validateUpper(source, target)
  );
};
