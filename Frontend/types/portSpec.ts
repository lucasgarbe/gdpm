export type portSpec = {
  name: string;
  type: portSpecType;
  optional: boolean;
  default: number;
  lower: gate;
  lowerBound: bound;
  upper: gate;
  upperBound: bound;
};

type bound = "open" | "closed";
type gate = string;
type portSpecType = "float" | "integer";
