import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import type { HistoricalQuestionReferenceProfile } from "../../../CatalogCoreTypes";

export type N2GeneratorFamily =
  | "FRACTIONAL_INDEX_EVALUATION"
  | "BRACKETED_INDEX_LAWS"
  | "MULTI_LAW_SIMPLIFICATION";

export type N2GeneratorMechanism =
  | "PRODUCT_QUOTIENT_WITH_COEFFICIENT"
  | "FRACTIONAL_NUMERIC_EVALUATION"
  | "POWER_OF_POWER_WITH_NEGATIVE_INDEX"
  | "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX"
  | "SQUARED_FRACTIONAL_MONOMIAL"
  | "PRODUCT_OVER_ROOT"
  | "NEGATIVE_INDEX_QUOTIENT"
  | "DISTRIBUTIVE_INDEX_EXPANSION"
  | "POSITIVE_POWER_PRODUCT_QUOTIENT";

export type N2GeneratorSkillId = "N2.1" | "N2.2" | "N2.3";
export type N2GeneratorPaper = "P1" | "P2";
export type N2GeneratorFamilyReadiness = "CORE" | "SUPPORTED";
export type N2GeneratorMechanismReadiness = "CORE" | "SUPPORTED";
export type N2GeneratorDifficulty = 1 | 2;
export type N2GeneratorDifficultyBandId = "LOWER_VALID" | "UPPER_VALID";
export type N2GeneratorStandard = "C" | "A";
export type N2GeneratorStandardProfile = "C" | "A" | "C+A";
export type N2GeneratorThinking = "OPERATIONAL";

export type N2RationalExponent = {
  numerator: number;
  denominator: 1 | 2 | 3;
};

export type N2Exponent = number | N2RationalExponent;

export type N2FractionalEvaluationState = {
  family: "FRACTIONAL_INDEX_EVALUATION";
  mechanism: "FRACTIONAL_NUMERIC_EVALUATION";
  rootValue: number;
  rootIndex: 2 | 3;
  exponentNumerator: number;
  base: number;
  exactResult: number;
};

export type N2ProductQuotientCoefficientState = {
  family: "MULTI_LAW_SIMPLIFICATION";
  mechanism: "PRODUCT_QUOTIENT_WITH_COEFFICIENT";
  variable: string;
  coefficientNumerator: number;
  coefficientDenominator: number;
  firstExponent: number;
  secondExponent: number;
  denominatorExponent: number;
  numeratorExponent: number;
  coefficientResult: number;
  finalExponent: number;
  reverseNumeratorFactors: boolean;
};

export type N2PowerOfPowerNegativeIndexState = {
  family: "MULTI_LAW_SIMPLIFICATION";
  mechanism: "POWER_OF_POWER_WITH_NEGATIVE_INDEX";
  variable: string;
  innerExponent: number;
  outerExponent: number;
  secondExponent: number;
  poweredExponent: number;
  combinedExponent: number;
  finalDenominatorExponent: number;
  powerFactorFirst: boolean;
};

export type N2ReciprocalRootState = {
  family: "MULTI_LAW_SIMPLIFICATION";
  mechanism: "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX";
  variable: string;
  rootIndex: 2 | 3;
  radicandExponent: number;
  finalExponent: N2RationalExponent;
};

export type N2SquaredFractionalMonomialState = {
  family: "BRACKETED_INDEX_LAWS";
  mechanism: "SQUARED_FRACTIONAL_MONOMIAL";
  variable: string;
  coefficientNumerator: number;
  coefficientDenominator: number;
  variableExponent: number;
  outerPower: 2;
  resultCoefficientNumerator: number;
  resultCoefficientDenominator: number;
  resultExponent: number;
};

export type N2ProductOverRootState = {
  family: "MULTI_LAW_SIMPLIFICATION";
  mechanism: "PRODUCT_OVER_ROOT";
  variable: string;
  coefficient: number;
  firstExponent: number;
  secondExponent: number;
  rootIndex: 2 | 3;
  numeratorExponent: number;
  finalExponent: N2RationalExponent;
};

export type N2NegativeIndexQuotientState = {
  family: "MULTI_LAW_SIMPLIFICATION";
  mechanism: "NEGATIVE_INDEX_QUOTIENT";
  variable: string;
  coefficient: number;
  numeratorExponent: number;
  denominatorExponents: readonly [number, number];
  denominatorExponent: number;
  combinedExponent: number;
  finalDenominatorExponent: number;
};

export type N2DistributiveIndexExpansionState = {
  family: "BRACKETED_INDEX_LAWS";
  mechanism: "DISTRIBUTIVE_INDEX_EXPANSION";
  variable: string;
  outsideExponent: N2Exponent;
  firstTermExponent: N2Exponent;
  secondTermExponent: N2Exponent;
  firstResultExponent: N2RationalExponent;
  secondResultExponent: N2RationalExponent;
};

export type N2PositivePowerProductQuotientState = {
  family: "MULTI_LAW_SIMPLIFICATION";
  mechanism: "POSITIVE_POWER_PRODUCT_QUOTIENT";
  variable: string;
  firstExponent: number;
  innerExponent: number;
  outerExponent: number;
  denominatorExponent: number;
  poweredExponent: number;
  numeratorExponent: number;
  finalExponent: number;
};

export type N2GeneratedMathState =
  | N2FractionalEvaluationState
  | N2ProductQuotientCoefficientState
  | N2PowerOfPowerNegativeIndexState
  | N2ReciprocalRootState
  | N2SquaredFractionalMonomialState
  | N2ProductOverRootState
  | N2NegativeIndexQuotientState
  | N2DistributiveIndexExpansionState
  | N2PositivePowerProductQuotientState;

export type N2PromptSection = {
  label: "";
  text: string;
  marks: 2 | 3;
};

export type N2SourceBasis = {
  questionCatalogIds: string[];
  answerCatalogIds: string[];
  comparisonFamily: N2GeneratorFamily;
  comparisonMechanism: N2GeneratorMechanism;
  historicalReference: HistoricalQuestionReferenceProfile;
};

export type N2DifficultyMetrics = {
  stageCount: 2 | 3;
  negativeExponentCount: number;
  fractionalExponentCount: number;
  rootNotationPresent: boolean;
  bracketedExpressionPresent: boolean;
  algebraicFractionPresent: boolean;
  additiveTermsPresent: boolean;
  coefficientArithmeticPresent: boolean;
  positivePowerOutputRequired: boolean;
};

export type N2GenerationQualityProfile = {
  difficultyBandId: N2GeneratorDifficultyBandId;
  difficultyMetrics: N2DifficultyMetrics;
  historicalOverlapChecked: true;
  exactArithmeticChecked: true;
  familyObservedCount: number;
  familyObservedTotal: number;
  familyObservedProportion: number;
  mechanismObservedCount: number;
  calibrationSourceAnchorIds: string[];
  paperArithmeticProfile: "P1_WRITTEN" | "P2_CALCULATOR_AVAILABLE";
  structuralLevers: string[];
  difficultySignals: string[];
};

export type N2GeneratedQuestion = {
  generatorId: "N2_INDICES_V1";
  instanceId: string;
  seed: number;
  skillId: N2GeneratorSkillId;
  skillLabel: string;
  family: N2GeneratorFamily;
  mechanism: N2GeneratorMechanism;
  familyReadiness: N2GeneratorFamilyReadiness;
  mechanismReadiness: N2GeneratorMechanismReadiness;
  paper: N2GeneratorPaper;
  difficulty: N2GeneratorDifficulty;
  marks: 2 | 3;
  standardProfile: N2GeneratorStandardProfile;
  standardMarks: readonly N2GeneratorStandard[];
  thinking: N2GeneratorThinking;
  prompt: string;
  promptParts: PaperPart[];
  promptSections: N2PromptSection[];
  mathState: N2GeneratedMathState;
  sourceBasis: N2SourceBasis;
  generationConstraints: string[];
  quality: N2GenerationQualityProfile;
};

export type N2GenerateOptions = {
  seed: number;
  difficulty?: N2GeneratorDifficulty;
  family?: N2GeneratorFamily;
  mechanism?: N2GeneratorMechanism;
  paper?: N2GeneratorPaper;
};

export type N2ValidationIssue = {
  severity: "ERROR" | "WARNING";
  code: string;
  message: string;
};

export type N2ValidationResult = {
  valid: boolean;
  issues: N2ValidationIssue[];
};
