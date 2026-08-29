import type { QuestionNumberType } from "./QuestionCatalogTypes";

export type A8Equation = {
  a: number;
  b: number;
  c: number;
};

export type A8QuestionMode =
  | "ABSTRACT_SOLVE"
  | "CONTEXT_FORM_AND_SOLVE"
  | "GRAPH_INTERSECTION_SOLVE"
  | "CONTEXT_DERIVED_TOTAL";

export type A8ResponseRegion = {
  id: string;
  partIds: string[];
  topPt: number;
  bottomPt: number;
  boundaryConvention: string;
};

export type A8ContextConfig = {
  domain: string;
  objectLabels: [string, string];
  relationshipLabels: [string, string];
  unitDimension: string | null;
  unitSymbol: string | null;
  currency: boolean;
  namedPeople: boolean;
  realWorldUnits: boolean;
  firstRelationshipSummary: string;
  secondRelationshipSummary: string;
  targetSummary: string;
  explicitVariableDefinitions: boolean;
  derivedCoefficients?: [number, number];
  derivedValue?: number;
};

export type A8QuestionConfig = {
  year: number;
  paper: "P1" | "P2";
  questionNumber: string;
  pdfPage: number;
  printedPageLabel: string;
  mode: A8QuestionMode;
  equations: [A8Equation, A8Equation];
  variableSymbols: [string, string];
  solution: [number, number];
  numberTypes: QuestionNumberType[];
  responseRegions: A8ResponseRegion[];
  answerSpaceCategory: "MEDIUM" | "LARGE" | "FULL_PAGE";
  estimatedWritingLines: number;
  context?: A8ContextConfig;
  promptWordCount: number;
  promptSentenceCount: number;
  algebraicallyExplicit: boolean;
};
