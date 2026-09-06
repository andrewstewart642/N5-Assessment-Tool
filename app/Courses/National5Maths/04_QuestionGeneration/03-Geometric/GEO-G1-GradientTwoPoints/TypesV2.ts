import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import type { HistoricalQuestionReferenceProfile } from "../../../CatalogCoreTypes";

export type G1GeneratorFamily =
  | "LINE_EQUATION_FROM_TWO_POINTS"
  | "CONTEXTUAL_LINEAR_MODEL"
  | "BEST_FIT_LINEAR_MODEL"
  | "SYMBOLIC_GRADIENT_FROM_TWO_POINTS";

export type G1GeneratorSurfaceStyle =
  | "DIRECT_COORDINATES_LINE_EQUATION"
  | "COORDINATE_DIAGRAM_LINE_EQUATION"
  | "CONTEXT_LINE_GRAPH_LABELLED_POINTS"
  | "BEST_FIT_LABELLED_POINTS_CONTEXT"
  | "BEST_FIT_GRID_READ_POINTS"
  | "SYMBOLIC_COORDINATE_GRADIENT";

export type G1GeneratorPaper = "P1" | "P2";
export type G1GeneratorReadiness = "CORE" | "SUPPORTED" | "EXPERIMENTAL" | "COMPOSITE_DEFERRED";
export type G1GeneratorDifficulty = 1 | 2;
export type G1GeneratorDifficultyBandId = "LOWER_VALID" | "UPPER_VALID";
export type G1GeneratorStandard = "C" | "A";
export type G1GeneratorThinking = "OPERATIONAL";

export type G1Rational = {
  numerator: number;
  denominator: number;
};

export type G1NumericPoint = {
  x: number;
  y: number;
};

export type G1AxisSpec = {
  xVariable: string;
  yVariable: string;
  xLabel: string;
  yLabel: string;
  xUnit: string | null;
  yUnit: string | null;
  xMinimum: number;
  xMaximum: number;
  xTickInterval: number;
  yMinimum: number;
  yMaximum: number;
  yTickInterval: number;
};

export type G1LineModelState = {
  family: "LINE_EQUATION_FROM_TWO_POINTS" | "CONTEXTUAL_LINEAR_MODEL" | "BEST_FIT_LINEAR_MODEL";
  xVariable: string;
  yVariable: string;
  points: readonly [G1NumericPoint, G1NumericPoint];
  gradient: G1Rational;
  intercept: G1Rational;
  equationLatex: string;
  equationPlain: string;
};

export type G1ContextProfile = {
  domainId: string;
  introduction: string;
  xDescription: string;
  yDescription: string;
  xVariable: string;
  yVariable: string;
  xUnit: string;
  yUnit: string;
};

export type G1ContextualLineState = G1LineModelState & {
  family: "CONTEXTUAL_LINEAR_MODEL";
  context: G1ContextProfile;
  followUp: {
    input: number;
    exactOutput: G1Rational;
    outputUnit: string;
    outputDescription: string;
  };
};

export type G1BestFitLineState = G1LineModelState & {
  family: "BEST_FIT_LINEAR_MODEL";
  context: G1ContextProfile;
  scatterPoints: readonly G1NumericPoint[];
  lineReadPoints: readonly G1NumericPoint[];
  embeddedS2MarksDeferred: 1;
};

export type G1SymbolicGradientState = {
  family: "SYMBOLIC_GRADIENT_FROM_TWO_POINTS";
  parameter: string;
  denominatorScale: number;
  parameterCoefficient: number;
  constant: number;
  numericPoint: {
    x: number;
    y: number;
  };
  parameterisedPoint: {
    xCoefficient: number;
    yCoefficient: number;
  };
  gradientQuotientLatex: string;
  numeratorFactorisationLatex: string;
  denominatorFactorisationLatex: string;
  finalGradientCoefficient: G1Rational;
  finalGradientConstant: G1Rational;
  finalGradientLatex: string;
  excludedParameterValue: G1Rational;
};

export type G1GeneratedMathState =
  | G1LineModelState
  | G1ContextualLineState
  | G1BestFitLineState
  | G1SymbolicGradientState;

export type G1CoordinateDiagramVisualSpec = {
  kind: "G1_COORDINATE_DIAGRAM";
  rendererFamilyId: "G1_COORDINATE_GRID";
  axis: G1AxisSpec;
  points: readonly [
    G1NumericPoint & { label: "A" },
    G1NumericPoint & { label: "B" },
  ];
  line: {
    gradient: G1Rational;
    intercept: G1Rational;
  };
  requirements: readonly string[];
};

export type G1ContextLineVisualSpec = {
  kind: "G1_CONTEXT_LINE_GRAPH";
  rendererFamilyId: "G1_CONTEXT_LINE_GRAPH";
  axis: G1AxisSpec;
  line: {
    gradient: G1Rational;
    intercept: G1Rational;
  };
  labelledPoints: readonly [
    G1NumericPoint & { label: "A" },
    G1NumericPoint & { label: "B" },
  ];
  requirements: readonly string[];
};

export type G1BestFitVisualSpec = {
  kind: "G1_BEST_FIT_GRAPH";
  rendererFamilyId: "G1_BEST_FIT_SCATTER_GRAPH";
  axis: G1AxisSpec;
  line: {
    gradient: G1Rational;
    intercept: G1Rational;
  };
  scatterPoints: readonly G1NumericPoint[];
  readableLinePoints: readonly G1NumericPoint[];
  labelledLinePoints: readonly (G1NumericPoint & { label: string })[];
  requirements: readonly string[];
};

export type G1GeneratedVisualSpec =
  | G1CoordinateDiagramVisualSpec
  | G1ContextLineVisualSpec
  | G1BestFitVisualSpec;

export type G1PromptSection = {
  label: "" | "a" | "b";
  text: string;
  marks: number;
};

export type G1SourceBasis = {
  questionCatalogIds: string[];
  answerCatalogIds: string[];
  comparisonFamily: G1GeneratorFamily;
  historicalReference: HistoricalQuestionReferenceProfile;
};

export type G1DifficultySignals = {
  coordinateDiagramRead: boolean;
  scaledGraphPointSelection: boolean;
  contextualModel: boolean;
  bestFitContext: boolean;
  fractionalOrDecimalGradient: boolean;
  largeCoordinateScale: boolean;
  signedCoordinateBurden: boolean;
  symbolicCoordinates: boolean;
  factorisationAndCancellation: boolean;
};

export type G1GenerationQualityProfile = {
  difficultyBandId: G1GeneratorDifficultyBandId;
  difficultyScore: number;
  difficultySignals: G1DifficultySignals;
  historicalOverlapChecked: true;
  familyObservedCount: number;
  familyObservedTotal: number;
  familyObservedProportion: number;
  calibrationSourceAnchorIds: string[];
  paperArithmeticProfile: "P1_WRITTEN" | "P2_CALCULATOR_AVAILABLE";
  structuralLevers: string[];
};

type G1GeneratedQuestionBase = {
  generatorId: "G1_GRADIENT_TWO_POINTS_V1";
  instanceId: string;
  seed: number;
  skillId: "geo-g01-gradient-two-points";
  conceptId: "geo-g1-1";
  family: G1GeneratorFamily;
  familyReadiness: G1GeneratorReadiness;
  surfaceStyleId: G1GeneratorSurfaceStyle;
  paper: G1GeneratorPaper;
  difficulty: G1GeneratorDifficulty;
  marks: 3 | 4;
  standard: G1GeneratorStandard;
  thinking: G1GeneratorThinking;
  prompt: string;
  promptParts: PaperPart[];
  promptSections: G1PromptSection[];
  sourceBasis: G1SourceBasis;
  generationConstraints: string[];
  quality: G1GenerationQualityProfile;
};

export type G1LineEquationGeneratedQuestion = G1GeneratedQuestionBase & {
  family: "LINE_EQUATION_FROM_TWO_POINTS";
  familyReadiness: "CORE";
  paper: "P1";
  difficulty: G1GeneratorDifficulty;
  marks: 3;
  standard: "C";
  surfaceStyleId: "DIRECT_COORDINATES_LINE_EQUATION" | "COORDINATE_DIAGRAM_LINE_EQUATION";
  mathState: G1LineModelState & { family: "LINE_EQUATION_FROM_TWO_POINTS" };
  visual: G1CoordinateDiagramVisualSpec | null;
};

export type G1ContextualGeneratedQuestion = G1GeneratedQuestionBase & {
  family: "CONTEXTUAL_LINEAR_MODEL";
  familyReadiness: "SUPPORTED";
  paper: "P1";
  difficulty: G1GeneratorDifficulty;
  marks: 4;
  standard: "C";
  surfaceStyleId: "CONTEXT_LINE_GRAPH_LABELLED_POINTS";
  mathState: G1ContextualLineState;
  visual: G1ContextLineVisualSpec;
};

/**
 * The historical best-fit wrapper contains a fourth mark owned by S2. G1 owns
 * only the three line-model marks, but the complete two-part wrapper is retained
 * in the generated question so that the cross-skill architecture can be tested.
 */
export type G1BestFitGeneratedQuestion = G1GeneratedQuestionBase & {
  family: "BEST_FIT_LINEAR_MODEL";
  familyReadiness: "COMPOSITE_DEFERRED";
  paper: "P1";
  marks: 3;
  standard: "C";
  surfaceStyleId: "BEST_FIT_LABELLED_POINTS_CONTEXT" | "BEST_FIT_GRID_READ_POINTS";
  mathState: G1BestFitLineState;
  visual: G1BestFitVisualSpec;
  deferredComposite: {
    totalHistoricalArchitectureMarks: 4;
    g1MarksGenerated: 3;
    embeddedSkillId: "stat-s02-linear-model";
    embeddedMarksDeferred: 1;
    reason: string;
  };
};

export type G1SymbolicGeneratedQuestion = G1GeneratedQuestionBase & {
  family: "SYMBOLIC_GRADIENT_FROM_TWO_POINTS";
  familyReadiness: "EXPERIMENTAL";
  paper: "P2";
  difficulty: 2;
  marks: 3;
  standard: "A";
  surfaceStyleId: "SYMBOLIC_COORDINATE_GRADIENT";
  mathState: G1SymbolicGradientState;
  visual: null;
};

export type G1GeneratedQuestion =
  | G1LineEquationGeneratedQuestion
  | G1ContextualGeneratedQuestion
  | G1BestFitGeneratedQuestion
  | G1SymbolicGeneratedQuestion;

export type G1GenerateOptions = {
  seed: number;
  family?: G1GeneratorFamily;
  surfaceStyleId?: G1GeneratorSurfaceStyle;
  paper?: G1GeneratorPaper;
  difficulty?: G1GeneratorDifficulty;
  includeExperimentalFamilies?: boolean;
  includeDeferredCompositeFamilies?: boolean;
};

export type G1ValidationIssue = {
  severity: "ERROR" | "WARNING";
  code: string;
  message: string;
};

export type G1ValidationResult = {
  valid: boolean;
  issues: G1ValidationIssue[];
};
