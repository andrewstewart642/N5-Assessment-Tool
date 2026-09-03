export * from "./ALG-A8-SimultaneousEquationsMixed";
export * from "./ALG-A8.1-SimultaneousEquationsBasic";
export * from "./ALG-A8.2-SimultaneousEquationsContext";
export * from "./ALG-A8.3-SimultaneousEquationsGraph";
export * from "./ALG-A8.4-SimultaneousEquationsDerivedTotal";

import { ALG_A8_SIMULTANEOUS_EQUATIONS_MIXED } from "./ALG-A8-SimultaneousEquationsMixed";
import { ALG_A8_1_SIMULTANEOUS_EQUATIONS_BASIC } from "./ALG-A8.1-SimultaneousEquationsBasic";
import { ALG_A8_2_SIMULTANEOUS_EQUATIONS_CONTEXT } from "./ALG-A8.2-SimultaneousEquationsContext";
import { ALG_A8_3_SIMULTANEOUS_EQUATIONS_GRAPH } from "./ALG-A8.3-SimultaneousEquationsGraph";
import { ALG_A8_4_SIMULTANEOUS_EQUATIONS_DERIVED_TOTAL } from "./ALG-A8.4-SimultaneousEquationsDerivedTotal";

export const ALG_A8_GENERATION_SELECTORS = [
  ALG_A8_SIMULTANEOUS_EQUATIONS_MIXED,
  ALG_A8_1_SIMULTANEOUS_EQUATIONS_BASIC,
  ALG_A8_2_SIMULTANEOUS_EQUATIONS_CONTEXT,
  ALG_A8_3_SIMULTANEOUS_EQUATIONS_GRAPH,
  ALG_A8_4_SIMULTANEOUS_EQUATIONS_DERIVED_TOTAL,
] as const;
