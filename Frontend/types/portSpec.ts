export type portSpec = {
  id: string;
  name: string;
  type: portSpecType;
  optional: boolean;
  default: number;
  lower: gate;
  lowerInclusive: boolean;
  upper: gate;
  upperInclusive: boolean;
};

export type gate = "inf" | `inputs[${string}]`;
export type portSpecType = "float" | "integer";
