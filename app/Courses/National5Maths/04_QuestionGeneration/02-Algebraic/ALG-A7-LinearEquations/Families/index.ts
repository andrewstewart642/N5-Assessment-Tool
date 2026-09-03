export * from "./ALG-A7-LinearEquationsMixed";
export * from "./ALG-A7-LinearEquationsFractional";
export * from "./ALG-A7-LinearEquationsContext";

import { ALG_A7_LINEAR_EQUATIONS_MIXED } from "./ALG-A7-LinearEquationsMixed";
import { ALG_A7_LINEAR_EQUATIONS_FRACTIONAL } from "./ALG-A7-LinearEquationsFractional";
import { ALG_A7_LINEAR_EQUATIONS_CONTEXT } from "./ALG-A7-LinearEquationsContext";

export const ALG_A7_GENERATION_SELECTORS = [
  ALG_A7_LINEAR_EQUATIONS_MIXED,
  ALG_A7_LINEAR_EQUATIONS_FRACTIONAL,
  ALG_A7_LINEAR_EQUATIONS_CONTEXT,
] as const;
