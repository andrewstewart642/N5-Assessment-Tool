export type A8GeneratorFamily =
  | "ABSTRACT_SOLVE"
  | "CONTEXT_FORM_AND_SOLVE"
  | "GRAPH_INTERSECTION_SOLVE"
  | "CONTEXT_DERIVED_TOTAL";

export type A8GeneratorPaper = "P1" | "P2";
export type A8GeneratorDifficulty = 1 | 2 | 3 | 4 | 5;

export type A8LinearEquation = {
  a: number;
  b: number;
  c: number;
};

export type A8EliminationPlan = {
  variable: "FIRST" | "SECOND";
  firstMultiplier: number;
  secondMultiplier: number;
  combine: "ADD" | "SUBTRACT";
  scaledFirst: A8LinearEquation;
  scaledSecond: A8LinearEquation;
};

export type A8GeneratedContext = {
  contextId: string;
  itemLabels: [string, string];
  relationshipLabels: [string, string, string?];
  unitDimension: "currency" | "mass" | "area" | "count";
  unitSymbol: string;
  unitPosition: "PREFIX" | "SUFFIX";
  displayDecimals: number;
  firstCounts: [number, number];
  secondCounts: [number, number];
  firstTotal: number;
  secondTotal: number;
  derivedCounts?: [number, number];
  derivedTotal?: number;
  promptVariableDefinitions: boolean;
};

export type A8GraphVisualSpec = {
  kind: "STRAIGHT_LINE_SYSTEM";
  xVariable: string;
  yVariable: string;
  firstEquation: A8LinearEquation;
  secondEquation: A8LinearEquation;
  intersection: [number, number];
  labelledIntersection: "P";
  numericScaleRequired: false;
  candidateMustReadIntersection: false;
  rendererFamilyId: "A8_SIMULTANEOUS_LINEAR_GRAPH";
};

export type A8GeneratedQuestion = {
  generatorId: "A8_SIMULTANEOUS_EQUATIONS_V1";
  instanceId: string;
  seed: number;
  family: A8GeneratorFamily;
  familyReadiness: "CORE" | "EXPERIMENTAL";
  paper: A8GeneratorPaper;
  difficulty: A8GeneratorDifficulty;
  marks: 3 | 6;
  variableSymbols: [string, string];
  equations: [A8LinearEquation, A8LinearEquation];
  solution: [number, number];
  determinant: number;
  eliminationPlans: [A8EliminationPlan, A8EliminationPlan];
  prompt: string;
  promptSections: { label: "" | "a" | "b" | "c"; text: string; marks: number }[];
  context: A8GeneratedContext | null;
  visual: A8GraphVisualSpec | null;
  sourceBasis: {
    questionCatalogIds: string[];
    answerCatalogIds: string[];
    comparisonFamily: A8GeneratorFamily;
  };
  generationConstraints: string[];
};

export type A8GenerateOptions = {
  seed: number;
  difficulty?: A8GeneratorDifficulty;
  family?: A8GeneratorFamily;
  paper?: A8GeneratorPaper;
  includeExperimentalFamilies?: boolean;
};

export type A8ValidationIssue = {
  severity: "ERROR" | "WARNING";
  code: string;
  message: string;
};

export type A8ValidationResult = {
  valid: boolean;
  issues: A8ValidationIssue[];
};
