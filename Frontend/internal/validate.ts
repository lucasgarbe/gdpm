import { portSpec, gate, bound } from "../types/portSpec";

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

export const validate = (a: portSpec, b: portSpec) => {
  return (
    validateType(a, b) &&
    validateLowerBound(a, b) &&
    validateUpperBound(a, b) &&
    validateUpper(a, b)
  );
};
