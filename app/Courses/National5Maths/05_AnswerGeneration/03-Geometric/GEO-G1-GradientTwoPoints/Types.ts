import type {
  G1GeneratedQuestion,
  G1GeneratorFamily,
  G1GeneratorStandard,
  G1GeneratorThinking,
  G1Rational,
} from "../../../04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Types";

export type G1GeneratedMarkType = "METHOD" | "PROCESS" | "ACCURACY";

export type G1GeneratedAnswerProfileId =
  | "LINE_EQUATION_WORKED"
  | "DETERMINISTIC_CONTEXT_MODEL"
  | "BEST_FIT_G1_CONSTRUCTION_ONLY"
  | "SYMBOLIC_GRADIENT_FACTOR_CANCEL";

export type G1GeneratedMarkProfile =
  | "GRADIENT_ANCHOR_EQUATION"
  | "GRADIENT_ANCHOR_EQUATION_APPLY"
  | "SYMBOLIC_QUOTIENT_FACTOR_CANCEL";

export type G1GeneratedMarkRole =
  | "GRADIENT"
  | "LINE_POSITION"
  | "FINAL_EQUATION"
  | "MODEL_APPLICATION"
  | "SYMBOLIC_QUOTIENT"
  | "SYMBOLIC_FACTORISATION"
  | "SYMBOLIC_CANCEL_FINAL";

export type G1GeneratedMethodFamily =
  | "SLOPE_INTERCEPT"
  | "POINT_SLOPE"
  | "MODEL_APPLICATION"
  | "SYMBOLIC_FACTOR_CANCEL";

export type G1GeneratedAnswerProfile = {
  id: G1GeneratedAnswerProfileId;
  family: G1GeneratorFamily;
  markProfile: G1GeneratedMarkProfile;
  sourceAnchorIds: readonly string[];
  workingRequired: true;
  correctAnswerWithoutWorking: "NO_CREDIT";
  equivalentLineFormsAccepted: boolean;
  coordinateSubtractionMustBeConsistent: true;
  simplestFormRequired: true;
  exactGradientRequired: true;
  contextVariablesRequiredForModel: boolean;
  followUpOwner: "G1" | "DEFERRED_S2" | null;
  unitsRequiredForFollowUp: false;
  rationale: string;
};

export type G1GeneratedMarkPoint = {
  markNumber: number;
  partLabel: "" | "a" | "b";
  type: G1GeneratedMarkType;
  role: G1GeneratedMarkRole;
  primarySkillId: "geo-g01-gradient-two-points";
  standard: G1GeneratorStandard;
  thinking: G1GeneratorThinking;
  requirement: string;
  evidenceExamples: string[];
  acceptanceNotes: string[];
  dependsOnMarkNumbers: number[];
  followThroughFromMarkNumbers: number[];
  comparableDifficultyRequired: boolean;
  blockingConditions: string[];
  sourceAnchorIds: string[];
};

export type G1GeneratedAnswerLine = {
  id: string;
  text: string;
  latex: string | null;
  markNumbers: number[];
};

export type G1GeneratedAnswerMethod = {
  methodFamilyId: G1GeneratedMethodFamily;
  lines: G1GeneratedAnswerLine[];
  sourceEvidenceIds: string[];
};

export type G1GeneratedFinalAnswer = {
  partLabel: "" | "a" | "b";
  normalisedAnswer: string;
  latex: string;
  numericValue: number | null;
  exactRational: G1Rational | null;
  unit: string | null;
};

export type G1GeneratedWorkingPolicy = {
  correctAnswerWithoutWorking: "NO_CREDIT";
  workingRequired: true;
  equivalentLineFormsAccepted: boolean;
  coordinateSubtractionMustBeConsistent: true;
  permittedMethodFamilies: G1GeneratedMethodFamily[];
  followThroughPrinciple: string;
  generationPolicyRationale: string;
};

export type G1GeneratedPresentationPolicy = {
  simplestFormRequired: true;
  exactGradientRequired: true;
  decimalApproximationDoesNotReplaceExactFraction: true;
  contextVariablesRequiredForModel: boolean;
  unitsRequiredForFollowUp: false;
  deferredCrossSkillMarksExcluded: boolean;
};

export type G1GeneratedDeferredComposite = {
  embeddedSkillId: "stat-s02-linear-model";
  embeddedMarksDeferred: 1;
  generatedG1Marks: 3;
  reason: string;
};

export type G1GeneratedMarkingScheme = {
  generatorId: "G1_GRADIENT_TWO_POINTS_ANSWER_V1";
  questionInstanceId: string;
  family: G1GeneratorFamily;
  surfaceStyleId: G1GeneratedQuestion["surfaceStyleId"];
  profileId: G1GeneratedAnswerProfileId;
  markProfile: G1GeneratedMarkProfile;
  profileSourceAnchorIds: string[];
  totalMarks: 3 | 4;
  standard: G1GeneratorStandard;
  thinking: G1GeneratorThinking;
  finalAnswers: G1GeneratedFinalAnswer[];
  markPoints: G1GeneratedMarkPoint[];
  methods: G1GeneratedAnswerMethod[];
  defaultMethodFamilyId: G1GeneratedMethodFamily;
  workingPolicy: G1GeneratedWorkingPolicy;
  presentationPolicy: G1GeneratedPresentationPolicy;
  deferredComposite: G1GeneratedDeferredComposite | null;
  sourceBasis: G1GeneratedQuestion["sourceBasis"];
  generationNotes: string[];
};

export type G1AnswerValidationIssue = {
  severity: "ERROR" | "WARNING";
  code: string;
  message: string;
};

export type G1AnswerValidationResult = {
  valid: boolean;
  issues: G1AnswerValidationIssue[];
};
