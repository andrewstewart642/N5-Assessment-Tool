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
 * Source-calibrated display grammars from the three reviewed standalone A7
 * equations. These are structural grammars, not historical wording templates.
 *
 * SPLIT_TERMS
 *   ax/d1 - b/d2 = cx              (2016-type surface)
 *
 * BINOMIAL_RIGHT_NUMERATOR
 *   ax/d1 - n = (b - cx)/d2        (2019-type surface)
 *
 * BINOMIAL_LEFT_NUMERATOR
 *   (ax + b)/d1 = cx/d2 + n        (2025-type surface)
 */
export type A7FractionalSurfaceVariant =
  | "SPLIT_TERMS"
  | "BINOMIAL_RIGHT_NUMERATOR"
  | "BINOMIAL_LEFT_NUMERATOR";

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

export type A7ContextAreaState = {
  family: "CONTEXT_AREA_EQUALITY";
  triangle: {
    base: number;
    heightXCoefficient: 1;
    heightConstant: number;
  };
  rectangle: {
    height: number;
    widthXCoefficient: -1;
    widthConstant: number;
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
