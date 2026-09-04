import type {
  N2GeneratedQuestion,
  N2GeneratorFamily,
  N2GeneratorMechanism,
  N2GeneratorStandard,
  N2GeneratorStandardProfile,
  N2GeneratorThinking,
} from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";

export type N2GeneratedMarkType = "REPRESENTATION" | "PROCESS" | "ACCURACY";

export type N2GeneratedAnswerProfileId =
  | "FRACTIONAL_INDEX_EVALUATION_EXACT"
  | "PRODUCT_QUOTIENT_COEFFICIENT"
  | "POWER_OF_POWER_NEGATIVE_INDEX"
  | "RECIPROCAL_ROOT_SINGLE_POWER"
  | "SQUARED_FRACTIONAL_MONOMIAL"
  | "PRODUCT_OVER_ROOT"
  | "NEGATIVE_INDEX_QUOTIENT"
  | "DISTRIBUTIVE_INDEX_EXPANSION"
  | "POSITIVE_POWER_PRODUCT_QUOTIENT";

export type N2GeneratedMarkProfile =
  | "FRACTIONAL_INTERPRET_EVALUATE"
  | "PRODUCT_COEFFICIENT_QUOTIENT"
  | "POWER_SIGNED_CONVERT"
  | "ROOT_RECIPROCAL_SINGLE_POWER"
  | "POWERED_MONOMIAL_TWO_COMPONENT"
  | "PRODUCT_ROOT_QUOTIENT"
  | "DENOMINATOR_QUOTIENT_CONVERT"
  | "DISTRIBUTE_TWO_TERMS"
  | "POWER_PRODUCT_QUOTIENT";

export type N2GeneratedMarkRole =
  | "FRACTIONAL_INDEX_INTERPRETATION"
  | "EXACT_NUMERICAL_EVALUATION"
  | "NUMERATOR_PRODUCT_LAW"
  | "COEFFICIENT_SIMPLIFICATION"
  | "QUOTIENT_LAW"
  | "POWER_OF_POWER"
  | "SIGNED_EXPONENT_COMBINATION"
  | "POSITIVE_POWER_CONVERSION"
  | "ROOT_TO_FRACTIONAL_INDEX"
  | "RECIPROCAL_TO_NEGATIVE_INDEX"
  | "POWERED_MONOMIAL_COMPONENT"
  | "POWERED_MONOMIAL_COMPLETION"
  | "DENOMINATOR_PRODUCT_LAW"
  | "DISTRIBUTIVE_INDEX_PRODUCT"
  | "DISTRIBUTIVE_COMPLETION";

export type N2GeneratedMethodFamily =
  | "FRACTIONAL_ROOT_THEN_POWER"
  | "COEFFICIENT_PRODUCT_QUOTIENT"
  | "SIGNED_EXPONENT_ROUTE"
  | "ROOT_RECIPROCAL_CONVERSION"
  | "POWERED_MONOMIAL"
  | "PRODUCT_OVER_ROOT_ROUTE"
  | "NEGATIVE_QUOTIENT_ROUTE"
  | "DISTRIBUTIVE_EXPANSION_ROUTE"
  | "POSITIVE_THREE_LAW_ROUTE";

export type N2GeneratedAnswerProfile = {
  id: N2GeneratedAnswerProfileId;
  family: N2GeneratorFamily;
  mechanism: N2GeneratorMechanism;
  markProfile: N2GeneratedMarkProfile;
  sourceAnchorIds: readonly string[];
  correctAnswerWithoutWorking: "FULL_CREDIT" | "NO_CREDIT";
  workingRequired: boolean;
  equivalentRoutesAccepted: boolean;
  positivePowerOutputRequired: boolean;
  exactIntegerRequired: boolean;
  rationale: string;
};

export type N2GeneratedMarkPoint = {
  markNumber: number;
  partLabel: "";
  type: N2GeneratedMarkType;
  role: N2GeneratedMarkRole;
  primarySkillId: "num-n2-indices";
  standard: N2GeneratorStandard;
  thinking: N2GeneratorThinking;
  requirement: string;
  evidenceExamples: string[];
  acceptanceNotes: string[];
  dependsOnMarkNumbers: number[];
  followThroughFromMarkNumbers: number[];
  comparableDifficultyRequired: boolean;
  blockingConditions: string[];
  sourceAnchorIds: string[];
};

export type N2GeneratedAnswerLine = {
  id: string;
  text: string;
  latex: string | null;
  markNumbers: number[];
};

export type N2GeneratedAnswerMethod = {
  methodFamilyId: N2GeneratedMethodFamily;
  lines: N2GeneratedAnswerLine[];
  sourceEvidenceIds: string[];
};

export type N2GeneratedFinalAnswer = {
  partLabel: "";
  normalisedAnswer: string;
  latex: string;
  numericValue: number | null;
};

export type N2GeneratedWorkingPolicy = {
  correctAnswerWithoutWorking: "FULL_CREDIT" | "NO_CREDIT";
  workingRequired: boolean;
  equivalentRoutesAccepted: boolean;
  permittedMethodFamilies: N2GeneratedMethodFamily[];
  followThroughPrinciple: string;
  generationPolicyRationale: string;
};

export type N2GeneratedPresentationPolicy = {
  positivePowerOutputRequired: boolean;
  exactIntegerRequired: boolean;
  exactFormRequired: boolean;
  singlePowerOfBaseRequired: boolean;
  coefficientFractionReduced: boolean;
  fullSimplificationRequired: true;
};

export type N2GeneratedMarkingScheme = {
  generatorId: "N2_INDICES_ANSWER_V1";
  questionInstanceId: string;
  family: N2GeneratorFamily;
  mechanism: N2GeneratorMechanism;
  profileId: N2GeneratedAnswerProfileId;
  markProfile: N2GeneratedMarkProfile;
  profileSourceAnchorIds: string[];
  totalMarks: 2 | 3;
  standardProfile: N2GeneratorStandardProfile;
  standardMarks: readonly N2GeneratorStandard[];
  thinking: N2GeneratorThinking;
  finalAnswers: N2GeneratedFinalAnswer[];
  markPoints: N2GeneratedMarkPoint[];
  methods: N2GeneratedAnswerMethod[];
  defaultMethodFamilyId: N2GeneratedMethodFamily;
  workingPolicy: N2GeneratedWorkingPolicy;
  presentationPolicy: N2GeneratedPresentationPolicy;
  sourceBasis: N2GeneratedQuestion["sourceBasis"];
  generationNotes: string[];
};

export type N2AnswerValidationIssue = {
  severity: "ERROR" | "WARNING";
  code: string;
  message: string;
};

export type N2AnswerValidationResult = {
  valid: boolean;
  issues: N2AnswerValidationIssue[];
};
