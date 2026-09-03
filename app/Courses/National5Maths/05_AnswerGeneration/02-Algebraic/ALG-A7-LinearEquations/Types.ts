import type {
  A7GeneratedQuestion,
  A7GeneratorFamily,
  A7GeneratorThinking,
  A7Rational,
} from "../../../03_QuestionGeneration/02-Algebraic/ALG-A7-LinearEquations/Types";

export type A7GeneratedMarkType = "REPRESENTATION" | "PROCESS" | "ACCURACY";

export type A7GeneratedAnswerProfileId =
  | "FRACTIONAL_MODERN_EXACT"
  | "CONTEXT_2022_EQUAL_AREA";

export type A7GeneratedMarkProfile =
  | "EQUIVALENT_REARRANGE_EXACT"
  | "AREA_EQUATE_START_REARRANGE_SOLVE";

export type A7GeneratedExcludedMethod = "GUESS_AND_CHECK" | "REPEATED_SUBSTITUTION";

export type A7GeneratedMarkRole =
  | "EQUIVALENT_EQUATION"
  | "REARRANGE"
  | "EXACT_SOLUTION"
  | "TRIANGLE_AREA"
  | "EQUAL_AREA_EQUATION"
  | "START_SOLVE"
  | "CONTEXT_SOLUTION";

export type A7GeneratedAnswerProfile = {
  id: A7GeneratedAnswerProfileId;
  family: A7GeneratorFamily;
  markProfile: A7GeneratedMarkProfile;
  sourceAnchorIds: readonly string[];
  exactFractionRequired: boolean;
  algebraicWorkingRequired: true;
  correctAnswerWithoutWorking: "NO_CREDIT";
  explicitlyExcludedMethods: readonly A7GeneratedExcludedMethod[];
  equivalentAlgebraicRoutesAccepted: true;
  laterPartCanSupplyTriangleAreaEvidence: boolean;
  triangleHalfFactorMustSurviveFirstSolveStep: boolean;
  trivialIntegerFinalDivisionBlocked: boolean;
  rationale: string;
};

export type A7GeneratedMarkPoint = {
  markNumber: number;
  partLabel: "" | "a" | "b";
  type: A7GeneratedMarkType;
  role: A7GeneratedMarkRole;
  primarySkillId: "alg-a07-linear-equations";
  standard: "A";
  thinking: A7GeneratorThinking;
  requirement: string;
  evidenceExamples: string[];
  acceptanceNotes: string[];
  dependsOnMarkNumbers: number[];
  followThroughFromMarkNumbers: number[];
  comparableDifficultyRequired: boolean;
  blockingConditions: string[];
  sourceAnchorIds: string[];
};

export type A7GeneratedAnswerLine = {
  id: string;
  text: string;
  markNumbers: number[];
};

export type A7GeneratedAnswerMethod = {
  methodFamilyId: "CLEAR_DENOMINATORS" | "AREA_EQUALITY_LINEAR_SOLVE";
  lines: A7GeneratedAnswerLine[];
  sourceEvidenceIds: string[];
};

export type A7GeneratedFinalAnswer = {
  partLabel: "" | "a" | "b";
  normalisedAnswer: string;
  numericValue: number | null;
  exactRational: A7Rational | null;
};

export type A7GeneratedWorkingPolicy = {
  unsupportedCorrectAnswerTreatment: "NO_CREDIT";
  algebraicWorkingRequired: true;
  equivalentAlgebraicRoutesAccepted: true;
  permittedMethodFamilies: A7GeneratedAnswerMethod["methodFamilyId"][];
  excludedPrototypeMethods: A7GeneratedExcludedMethod[];
  laterPartCanSupplyTriangleAreaEvidence: boolean;
  followThroughPrinciple: string;
  generationPolicyRationale: string;
};

export type A7GeneratedPresentationPolicy = {
  exactFractionRequired: boolean;
  simplestFormRequired: boolean;
  decimalApproximationDoesNotReplaceExactFraction: boolean;
  unitsRequiredForFinalAnswer: false;
  equivalentAreaExpressionsAccepted: boolean;
  triangleHalfFactorMustSurviveFirstSolveStep: boolean;
  trivialIntegerFinalDivisionBlocked: boolean;
};

export type A7GeneratedMarkingScheme = {
  generatorId: "A7_LINEAR_EQUATIONS_ANSWER_V1";
  questionInstanceId: string;
  family: A7GeneratorFamily;
  profileId: A7GeneratedAnswerProfileId;
  markProfile: A7GeneratedMarkProfile;
  profileSourceAnchorIds: string[];
  totalMarks: 3 | 5;
  standard: "A";
  thinking: A7GeneratorThinking;
  intendedSolution: A7Rational | number;
  finalAnswers: A7GeneratedFinalAnswer[];
  markPoints: A7GeneratedMarkPoint[];
  methods: A7GeneratedAnswerMethod[];
  defaultMethodFamilyId: A7GeneratedAnswerMethod["methodFamilyId"];
  workingPolicy: A7GeneratedWorkingPolicy;
  presentationPolicy: A7GeneratedPresentationPolicy;
  sourceBasis: A7GeneratedQuestion["sourceBasis"];
  generationNotes: string[];
};

export type A7AnswerValidationIssue = {
  severity: "ERROR" | "WARNING";
  code: string;
  message: string;
};

export type A7AnswerValidationResult = {
  valid: boolean;
  issues: A7AnswerValidationIssue[];
};
