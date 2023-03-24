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

export type bound = "open" | "closed";
export type gate = "inf" | `inputs[${string}]`;
export type portSpecType = "float" | "integer";
