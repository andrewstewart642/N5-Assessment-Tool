import type {
  A8GeneratedQuestion,
  A8GeneratorFamily,
  A8LinearEquation,
} from "../../../04_QuestionGeneration/02-Algebraic/ALG-A8-SimultaneousEquations/Types";

export type A8GeneratedMarkType =
  | "REPRESENTATION"
  | "PROCESS"
  | "ACCURACY"
  | "COMMUNICATION";

export type A8GeneratedMarkProfile =
  | "SCALE_STRATEGY_CORRECT"
  | "SCALE_VALUE_VALUE"
  | "FORM_FORM_SCALE_STRATEGY_CORRECT_COMMUNICATE"
  | "FORM_FORM_SCALE_VALUE_VALUE_COMMUNICATE"
  | "FORM_FORM_SCALE_VALUE_VALUE_DERIVED";

export type A8GeneratedAnswerProfileId =
  | "ABSTRACT_RECENT_VALUE_VALUE"
  | "CONTEXT_P1_RECENT_VALUE_VALUE"
  | "CONTEXT_P2_RECENT_VALUE_VALUE"
  | "GRAPH_2017_PROFILE"
  | "DERIVED_2025_PROFILE";

export type A8GeneratedExcludedMethod =
  | "GUESS_AND_CHECK"
  | "REPEATED_SUBSTITUTION";

export type A8GeneratedMarkRole =
  | "FORM_EQUATION_1"
  | "FORM_EQUATION_2"
  | "SCALE"
  | "STRATEGY"
  | "FIRST_VALUE"
  | "SECOND_VALUE"
  | "CORRECT_PAIR"
  | "COMMUNICATE"
  | "DERIVED_TOTAL";

export type A8GeneratedAnswerProfile = {
  id: A8GeneratedAnswerProfileId;
  family: A8GeneratorFamily;
  paper: "P1" | "P2";
  markProfile: A8GeneratedMarkProfile;
  sourceAnchorIds: readonly string[];
  answerOnlyTreatment: "NO_CREDIT";
  explicitlyExcludedMethod: A8GeneratedExcludedMethod | null;
  roundedFollowThroughAtLeastDp: number | null;
  separateScalingEitherCorrect: boolean;
  finalFractionConversionNotPenalised: boolean;
  equationEvidenceCanAppearLater: boolean;
  reversedCoordinatePairFullCredit: boolean;
  communicationMark: boolean;
  negativeValuesBlockFinalMark: boolean;
  rationale: string;
};

export type A8GeneratedMarkPoint = {
  markNumber: number;
  partLabel: "" | "a" | "b" | "c";
  type: A8GeneratedMarkType;
  role: A8GeneratedMarkRole;
  requirement: string;
  evidenceExamples: string[];
  acceptanceNotes: string[];
  dependsOnMarkNumbers: number[];
  followThroughFromMarkNumbers: number[];
  comparableDifficultyRequired: boolean;
  blockingConditions: string[];
  sourceAnchorIds: string[];
};

export type A8GeneratedAnswerLine = {
  id: string;
  text: string;
  markNumbers: number[];
};

export type A8GeneratedAnswerMethod = {
  methodFamilyId: "ELIMINATE_FIRST_VARIABLE" | "ELIMINATE_SECOND_VARIABLE";
  eliminatedVariable: "FIRST" | "SECOND";
  lines: A8GeneratedAnswerLine[];
  solvedValues: [number, number];
  sourceEvidenceIds: string[];
};

export type A8GeneratedFinalAnswer = {
  partLabel: "" | "a" | "b" | "c";
  normalisedAnswer: string;
  numericValues: number[];
};

export type A8GeneratedWorkingPolicy = {
  unsupportedCorrectAnswerTreatment: "NO_CREDIT";
  algebraicWorkingRequired: true;
  permittedMethodFamilies: A8GeneratedAnswerMethod["methodFamilyId"][];
  excludedPrototypeMethods: A8GeneratedExcludedMethod[];
  followThroughRoundedAtLeastDp: number | null;
  separateScalingEitherCorrect: boolean;
  finalFractionConversionNotPenalised: boolean;
  equationEvidenceCanAppearLater: boolean;
  followThroughPrinciple: string;
  generationPolicyRationale: string;
};

export type A8GeneratedPresentationPolicy = {
  contextualLabelsRequiredForFinalMark: boolean;
  unitsRequiredForFinalMark: boolean;
  currencyNearestPennyRequired: boolean;
  derivedTargetRequired: boolean;
  equivalentEquationFormsAccepted: boolean;
  candidateChosenVariablesAccepted: boolean;
  negativeValuesBlockFinalMark: boolean;
  coordinatePairRequired: boolean;
  reversedCoordinatePairFullCreditWithValidWorking: boolean;
};

export type A8GeneratedMarkingScheme = {
  generatorId: "A8_SIMULTANEOUS_EQUATIONS_ANSWER_V2";
  questionInstanceId: string;
  family: A8GeneratorFamily;
  profileId: A8GeneratedAnswerProfileId;
  markProfile: A8GeneratedMarkProfile;
  profileSourceAnchorIds: string[];
  totalMarks: 3 | 6;
  equationState: [A8LinearEquation, A8LinearEquation];
  intendedSolution: [number, number];
  finalAnswers: A8GeneratedFinalAnswer[];
  markPoints: A8GeneratedMarkPoint[];
  methods: A8GeneratedAnswerMethod[];
  defaultMethodFamilyId: A8GeneratedAnswerMethod["methodFamilyId"];
  workingPolicy: A8GeneratedWorkingPolicy;
  presentationPolicy: A8GeneratedPresentationPolicy;
  sourceBasis: A8GeneratedQuestion["sourceBasis"];
  generationNotes: string[];
};

export type A8AnswerValidationIssue = {
  severity: "ERROR" | "WARNING";
  code: string;
  message: string;
};

export type A8AnswerValidationResult = {
  valid: boolean;
  issues: A8AnswerValidationIssue[];
};
