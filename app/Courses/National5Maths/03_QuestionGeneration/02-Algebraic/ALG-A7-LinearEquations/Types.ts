import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import type { HistoricalQuestionReferenceProfile } from "../../../CatalogCoreTypes";

export type A7GeneratorFamily = "FRACTIONAL_COEFFICIENT" | "CONTEXT_AREA_EQUALITY";
export type A7GeneratorPaper = "P1" | "P2";
export type A7GeneratorReadiness = "CORE" | "EXPERIMENTAL";
export type A7GeneratorStandard = "A";
export type A7GeneratorThinking = "OPERATIONAL" | "REASONING";

/**
 * A7 uses two skill-specific difficulty bands. These are not Standard bands:
 * both remain A-standard. The distinction reflects the amount of structural
 * and numerical work needed to complete the same assessment construct.
 */
export type A7GeneratorDifficulty = 1 | 2;
export type A7GeneratorDifficultyBandId = "LOWER_VALID" | "UPPER_VALID";

export type A7Rational = {
  numerator: number;
  denominator: number;
};

/**
 * Source-calibrated surfaces plus one moderated extension. The extension is
 * intentionally narrow: two binomial fractions are permitted only where the
 * resulting written route still looks like National 5 rather than a rational-
 * expressions exercise.
 */
export type A7FractionalSurfaceVariant =
  | "SPLIT_TERMS"
  | "BINOMIAL_RIGHT_NUMERATOR"
  | "BINOMIAL_LEFT_NUMERATOR"
  | "BINOMIAL_BOTH_SIDES";

export type A7FractionalEquationState = {
  family: "FRACTIONAL_COEFFICIENT";
  surfaceVariant: A7FractionalSurfaceVariant;
  lhsX: A7Rational;
  lhsConstant: A7Rational;
  rhsX: A7Rational;
  rhsConstant: A7Rational;
  denominatorLcm: number;
  clearedEquation: {
    lhsX: number;
    lhsConstant: number;
    rhsX: number;
    rhsConstant: number;
  };
  rearrangedEquation: {
    xCoefficient: number;
    constant: number;
  };
  solution: A7Rational;
};

export type A7LinearDimension = {
  xCoefficient: -2 | -1 | 1 | 2;
  constant: number;
};

export type A7DimensionAxis = "BASE" | "HEIGHT";

/**
 * Each shape keeps exactly one fixed dimension and one linear dimension so the
 * equal-area model remains linear. The expression can appear on either axis;
 * the coefficient/sign can vary inside a moderated National 5 envelope.
 */
export type A7ContextAreaState = {
  family: "CONTEXT_AREA_EQUALITY";
  triangle: {
    algebraicDimension: A7DimensionAxis;
    fixedDimension: number;
    linearDimension: A7LinearDimension;
  };
  rectangle: {
    algebraicDimension: A7DimensionAxis;
    fixedDimension: number;
    linearDimension: A7LinearDimension;
  };
  equalAreaEquation: {
    triangleMultiplierNumerator: number;
    triangleMultiplierDenominator: 2;
    rectangleMultiplier: number;
  };
  clearedEquation: {
    leftXCoefficient: number;
    leftConstant: number;
    rightXCoefficient: number;
    rightConstant: number;
  };
  rearrangedEquation: {
    xCoefficient: number;
    constant: number;
  };
  solution: number;
};

export type A7AreaVisualSpec = {
  kind: "A7_EQUAL_AREA_DIAGRAM";
  rendererFamilyId: "A7_AREA_EQUALITY_DIAGRAM";
  unit: "cm";
  triangle: {
    baseLabel: string;
    heightLabel: string;
    baseLatex: string;
    heightLatex: string;
  };
  rectangle: {
    heightLabel: string;
    widthLabel: string;
    heightLatex: string;
    widthLatex: string;
  };
  requirements: string[];
};

export type A7PromptSection = {
  label: "" | "a" | "b";
  text: string;
  marks: number;
};

export type A7SourceBasis = {
  questionCatalogIds: string[];
  answerCatalogIds: string[];
  comparisonFamily: A7GeneratorFamily;
  historicalReference: HistoricalQuestionReferenceProfile;
};

export type A7DifficultyMetrics = {
  denominatorLcm: number | null;
  surfaceComplexity: 1 | 2 | 3;
  bracketExpansionCount: number;
  largestBracketMultiplier: number;
  nonUnitLinearCoefficientCount: number;
  largestWorkingCoefficient: number;
  largestWorkingConstant: number;
  rearrangedCoefficientMagnitude: number;
  solutionNumeratorMagnitude: number;
  solutionDenominator: number | null;
};

export type A7GenerationQualityProfile = {
  difficultyBandId: A7GeneratorDifficultyBandId;
  difficultyScore: number;
  difficultyMetrics: A7DifficultyMetrics;
  historicalOverlapChecked: true;
  familyObservedCount: number;
  familyObservedTotal: number;
  familyObservedProportion: number;
  calibrationSourceAnchorIds: string[];
  paperArithmeticProfile: "P1_WRITTEN" | "P2_CALCULATOR_AVAILABLE";
  structuralLevers: string[];
  difficultySignals: string[];
};

type A7GeneratedQuestionBase = {
  generatorId: "A7_LINEAR_EQUATIONS_V1";
  instanceId: string;
  seed: number;
  family: A7GeneratorFamily;
  familyReadiness: A7GeneratorReadiness;
  paper: A7GeneratorPaper;
  difficulty: A7GeneratorDifficulty;
  marks: 3 | 5;
  standard: A7GeneratorStandard;
  thinking: A7GeneratorThinking;
  prompt: string;
  promptParts: PaperPart[];
  promptSections: A7PromptSection[];
  sourceBasis: A7SourceBasis;
  generationConstraints: string[];
  quality: A7GenerationQualityProfile;
};

export type A7FractionalGeneratedQuestion = A7GeneratedQuestionBase & {
  family: "FRACTIONAL_COEFFICIENT";
  familyReadiness: "CORE";
  marks: 3;
  thinking: "OPERATIONAL";
  mathState: A7FractionalEquationState;
  visual: null;
};

export type A7ContextGeneratedQuestion = A7GeneratedQuestionBase & {
  family: "CONTEXT_AREA_EQUALITY";
  familyReadiness: "EXPERIMENTAL";
  paper: "P1";
  difficulty: 2;
  marks: 5;
  thinking: "REASONING";
  mathState: A7ContextAreaState;
  visual: A7AreaVisualSpec;
};

export type A7GeneratedQuestion = A7FractionalGeneratedQuestion | A7ContextGeneratedQuestion;

export type A7GenerateOptions = {
  seed: number;
  difficulty?: A7GeneratorDifficulty;
  family?: A7GeneratorFamily;
  paper?: A7GeneratorPaper;
  /** Set false to restrict automatic selection to the repeated core family. */
  includeExperimentalFamilies?: boolean;
};

export type A7ValidationIssue = {
  severity: "ERROR" | "WARNING";
  code: string;
  message: string;
};

export type A7ValidationResult = {
  valid: boolean;
  issues: A7ValidationIssue[];
};
