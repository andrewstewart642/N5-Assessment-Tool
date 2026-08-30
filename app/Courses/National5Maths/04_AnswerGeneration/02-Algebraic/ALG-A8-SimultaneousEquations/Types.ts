import type {
  A8GeneratedQuestion,
  A8GeneratorFamily,
  A8LinearEquation,
} from "../../../03_QuestionGeneration/02-Algebraic/ALG-A8-SimultaneousEquations/Types";

export type A8GeneratedMarkType =
  | "REPRESENTATION"
  | "PROCESS"
  | "ACCURACY"
  | "COMMUNICATION";

export type A8GeneratedMarkPoint = {
  markNumber: number;
  partLabel: "" | "a" | "b" | "c";
  type: A8GeneratedMarkType;
  requirement: string;
  evidenceExamples: string[];
  dependsOnMarkNumbers: number[];
  followThroughFromMarkNumbers: number[];
  comparableDifficultyRequired: boolean;
  blockingConditions: string[];
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
  excludedPrototypeMethods: ("GUESS_AND_CHECK" | "REPEATED_SUBSTITUTION")[];
  followThroughPrinciple: string;
  generationPolicyRationale: string;
};

export type A8GeneratedPresentationPolicy = {
  contextualLabelsRequiredForFinalMark: boolean;
  unitsRequiredForFinalMark: boolean;
  currencyNearestPennyRequired: boolean;
  derivedTargetRequired: boolean;
};

export type A8GeneratedMarkingScheme = {
  generatorId: "A8_SIMULTANEOUS_EQUATIONS_ANSWER_V1";
  questionInstanceId: string;
  family: A8GeneratorFamily;
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
