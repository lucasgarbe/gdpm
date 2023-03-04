import { portSpec } from "../types/portSpec";

export const validateType = (a: portSpec, b: portSpec) => {
  return a.type == b.type;
};

export const validateLowerBound = (a: portSpec, b: portSpec) => {
  return a.lowerBound == b.lowerBound;
};

export const validateUpperBound = (a: portSpec, b: portSpec) => {
  return a.upperBound == b.upperBound;
};

export const validateLower = (a: portSpec, b: portSpec) => {
  return a.lower == b.lower;
};

export const validateUpper = (a: portSpec, b: portSpec) => {
  return a.upper == b.upper;
};

export const validate = (a: portSpec, b: portSpec) => {
  return (
    validateType(a, b) &&
    validateLowerBound(a, b) &&
    validateUpperBound(a, b) &&
    validateUpper(a, b)
  );
};
