import { portSpec } from "../types/portSpec";

export type distribution = {
  distType: "discrete" | "continuous";
  name: string;
  output: portSpec;
  inputs: portSpec[];
  description: string;
  pymcdocsurl: string;
  image: string;
};
