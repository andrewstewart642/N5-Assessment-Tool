// ============================================================================
// NATIONAL 5 MATHS — UNIVERSAL ANSWER / MARKING CATALOGUE CONTRACT
// ============================================================================
//
// Describes how every historical Question can be answered and marked.
//
// The Answer Catalogue is NOT merely a worked solution.
// It models accepted answers, method pathways, individual mark nodes,
// dependencies, follow-through, visual evidence, common responses,
// shared rules, precision, units, notation, and Question ↔ marking links.
//
// This structure will later drive both Worked Answer generation and
// full Marking Scheme generation.
// ============================================================================

import type { CourseId } from "@/app/Courses/CourseTypes";
import type { Paper } from "@/app/Assessments/AssessmentTypes";

import type {
  CatalogConfidence,
  CatalogEvidenceRef,
  CatalogGenerationReadiness,
  CatalogProvenance,
  CatalogReviewProfile,
  CatalogSchemaVersion,
  CatalogValue,
  GeneralMarkingPolicyId,
  GeneratorFamilyId,
  PaperContextId,
  SharedMarkingRuleId,
} from "../CatalogCoreTypes";

import type {
  QuestionCatalogId,
  QuestionFamilyId,
  QuestionInformationId,
  QuestionPartId,
  QuestionResponseType,
  QuestionSubgoalId,
  QuestionUnitProfile,
} from "../01_QuestionCatalog/QuestionCatalogTypes";

import type {
  VisualElementId,
  VisualCandidateInteraction,
} from "../05_VisualAssets/VisualCatalogTypes";

// ============================================================================
// SECTION 1 — ANSWER / MARK IDS
// ============================================================================

export type AnswerCatalogId = string;
export type MarkNodeId = string;
export type MethodPathwayId = string;
export type MethodStepId = string;
export type AnswerVariantId = string;
export type AnswerRuleId = string;
export type CommonResponseId = string;
export type VisualMarkingRequirementId = string;

// ============================================================================
// SECTION 2 — IDENTITY
// ============================================================================

export type AnswerCatalogIdentity = {
  id: AnswerCatalogId;
  schemaVersion: CatalogSchemaVersion;
  sourceQuestionId: QuestionCatalogId;
  courseId: CourseId;
  paperContextId: PaperContextId;
  year: number;
  paper: Paper;
  questionNumber: string;
  questionFamilyId: QuestionFamilyId;
};

// ============================================================================
// SECTION 3 — SOURCE MARKING CONTEXT
// ============================================================================

export type AnswerSourceContext = {
  totalMarks: number;
  sourcePages: number[];
  sourceEvidence: CatalogEvidenceRef[];
  generalMarkingPolicyId: GeneralMarkingPolicyId;
};

// ============================================================================
// SECTION 4 — EXPECTED ANSWER SET
// ============================================================================

export type ExpectedAnswerForm =
  | "NUMBER"
  | "EXPRESSION"
  | "EQUATION"
  | "INEQUALITY"
  | "COORDINATES"
  | "VECTOR"
  | "GRAPHICAL"
  | "CONSTRUCTION"
  | "PROSE"
  | "MIXED";

export type ExpectedPrecisionType =
  | "NONE"
  | "DECIMAL_PLACES"
  | "SIGNIFICANT_FIGURES"
  | "NEAREST_UNIT"
  | "RANGE";

export type ExpectedAnswerVariant = {
  id: AnswerVariantId;                                               /* Gives the answer form a stable ID. */
  normalisedAnswer: string;                                          /* Stores concise mathematical/paraphrased answer content. */
  numericValue: number | null;                                       /* Stores numeric value when meaningful. */
  answerForm: ExpectedAnswerForm;                                    /* Records response form. */
  mathematicallyEquivalentToVariantIds: AnswerVariantId[];            /* Links equivalent accepted forms. */
  conditionsForAcceptance: string[];                                 /* Records conditions under which this form is valid. */
  notes: string | null;                                               /* Records unusual acceptance detail. */
};

export type AnswerExpectedResponseProfile = {
  responseTypes: QuestionResponseType[];
  canonicalAnswers: ExpectedAnswerVariant[];
  acceptedEquivalentForms: ExpectedAnswerVariant[];
  precisionType: ExpectedPrecisionType;
  precisionValue: number | null;
  acceptedRange: { min: number; max: number } | null;
  units: QuestionUnitProfile;
  requiredContextStatement: boolean;
  answerCountRequired: number | null;
  invalidRelatedValues: string[];
  extraAnswerTreatment: "IGNORE_IF_NOT_CONTRADICTORY" | "PENALISE" | "QUESTION_SPECIFIC" | "NOT_RELEVANT";
};

// ============================================================================
// SECTION 5 — MARK TYPES
// ============================================================================

export type MarkType =
  | "METHOD"
  | "PROCESS"
  | "ACCURACY"
  | "INTERPRETATION"
  | "REPRESENTATION"
  | "COMMUNICATION"
  | "CONCLUSION"
  | "ROUNDING"
  | "UNITS"
  | "PRESENTATION"
  | "SELECTION"
  | "JUSTIFICATION"
  | "OTHER";

export type MarkEvidenceLocation =
  | "WORKING"
  | "FINAL_ANSWER"
  | "DIAGRAM"
  | "GRAPH"
  | "GRID"
  | "TABLE"
  | "PREVIOUS_PART"
  | "LATER_PART"
  | "ANYWHERE_IN_QUESTION";

export type MarkEvidenceCondition = {
  id: string;
  evidenceSummary: string;
  acceptedLocations: MarkEvidenceLocation[];
  mayBeImpliedByLaterWork: boolean;
  mayBeImpliedByCorrectFinalAnswer: boolean;
  visualElementIds: VisualElementId[];
  sourceEvidence: CatalogEvidenceRef[];
};

// ============================================================================
// SECTION 6 — MARK DEPENDENCIES / FOLLOW-THROUGH
// ============================================================================

export type MarkDependencyType =
  | "REQUIRES_MARK"
  | "REQUIRES_EVIDENCE"
  | "CONSISTENT_WITH_EARLIER_RESULT"
  | "IMPLIED_BY_LATER_EVIDENCE"
  | "FOLLOW_THROUGH_FROM"
  | "INDEPENDENT_OF"
  | "BLOCKED_BY_ERROR"
  | "REQUIRES_VALID_METHOD"
  | "REQUIRES_COMPARABLE_DIFFICULTY";

export type MarkDependency = {
  type: MarkDependencyType;
  relatedMarkIds: MarkNodeId[];
  conditionSummary: string | null;
};

export type FollowThroughProfile = {
  allowed: boolean;
  fromMarkIds: MarkNodeId[];
  requiresComparableDifficulty: boolean;
  blockedForRequiredResult: boolean;
  blockedByInvalidMathematicalState: boolean;
  blockedByTrivialisedLaterWork: boolean;
  notes: string | null;
};

// ============================================================================
// SECTION 7 — INDIVIDUAL MARK NODE
// ============================================================================

export type MarkNode = {
  id: MarkNodeId;
  markNumber: number;
  markValue: 1;
  questionPartId: QuestionPartId;
  primaryType: MarkType;
  secondaryTypes: MarkType[];
  genericPurpose: string;
  linkedSubgoalIds: QuestionSubgoalId[];
  skillIds: string[];
  conceptIds: string[];
  requiredEvidence: MarkEvidenceCondition[];
  dependencies: MarkDependency[];
  followThrough: FollowThroughProfile;
  eligibilityConditions: string[];
  blockingConditions: string[];
  methodPathwayIds: MethodPathwayId[];
  presentationConditions: string[];
  visualRequirementIds: VisualMarkingRequirementId[];
  sourceEvidence: CatalogEvidenceRef[];
  confidence: CatalogConfidence;
};

// ============================================================================
// SECTION 8 — METHOD PATHWAYS
// ============================================================================

export type MethodEvidenceRole =
  | "PRIMARY_ILLUSTRATIVE"
  | "ILLUSTRATIVE_ALTERNATIVE"
  | "FULL_CREDIT_ALTERNATIVE"
  | "PARTIAL_METHOD_EVIDENCE"
  | "GENERIC_VALID_METHOD";

export type MethodStep = {
  id: MethodStepId;
  order: number;
  subgoal: string;
  linkedQuestionSubgoalIds: QuestionSubgoalId[];
  linkedMarkIds: MarkNodeId[];
  dependsOnStepIds: MethodStepId[];
  requiredOperations: string[];
  resultingStateSummary: string | null;
};

export type MethodPathway = {
  id: MethodPathwayId;
  variantId: string | null;
  evidenceRole: MethodEvidenceRole;
  supportsFullCredit: boolean;
  applicabilityConditions: string[];
  steps: MethodStep[];
  markMappingComplete: boolean;
  mathematicallyEquivalentMethodIds: MethodPathwayId[];
  materiallyDistinctFromMethodIds: MethodPathwayId[];
  excludedMethodReasons: string[];
  sourceEvidence: CatalogEvidenceRef[];
};

// ============================================================================
// SECTION 9 — METHOD EQUIVALENCE / ELIGIBILITY
// ============================================================================

export type MethodEquivalenceProfile = {
  equivalentMethodGroups: {
    id: string;
    methodIds: MethodPathwayId[];
    equivalenceReason: string;
  }[];
  methodEligibilityRules: {
    id: string;
    methodId: MethodPathwayId;
    condition: string;
    eligible: boolean;
    affectedMarkIds: MarkNodeId[];
  }[];
};

// ============================================================================
// SECTION 10 — CORRECT ANSWER WITHOUT WORKING
// ============================================================================

export type AnswerOnlyTreatment =
  | "FULL_CREDIT"
  | "PARTIAL_CREDIT"
  | "NO_CREDIT"
  | "NOT_STATED";

export type CorrectAnswerWithoutWorkingProfile = {
  treatment: AnswerOnlyTreatment;
  marksAwarded: number | null;
  markIdsAwarded: MarkNodeId[];
  conditions: string[];
  notes: string | null;
};

// ============================================================================
// SECTION 11 — WORKING / EVIDENCE POLICY
// ============================================================================

export type WorkingEvidencePolicy = {
  correctAnswerWithoutWorking: CorrectAnswerWithoutWorkingProfile;
  workingMandatoryForMarkIds: MarkNodeId[];
  workingMayBeImpliedForMarkIds: MarkNodeId[];
  diagramWorkCanScore: boolean;
  graphWorkCanScore: boolean;
  tableWorkCanScore: boolean;
  laterPartCanSupplyEvidence: boolean;
  earlierPartCanSupplyEvidence: boolean;
  repeatedSubstitutionAccepted: boolean;
  unsupportedCalculatorAnswerAccepted: boolean;
};

// ============================================================================
// SECTION 12 — PRECISION / UNITS / NOTATION
// ============================================================================

export type PresentationRequirement =
  | "REQUIRED_FOR_MARK"
  | "REQUIRED_FOR_FULL_CREDIT"
  | "ACCEPTED_VARIATION"
  | "DO_NOT_PENALISE"
  | "NOT_RELEVANT";

export type PrecisionPolicy = {
  finalPrecisionType: ExpectedPrecisionType;
  finalPrecisionValue: number | null;
  acceptedFinalRange: { min: number; max: number } | null;
  prematureRoundingAllowed: boolean;
  minimumIntermediatePrecision: string | null;
  followThroughAfterRoundingError: boolean;
};

export type PresentationPolicy = {
  precision: PrecisionPolicy;
  simplification: PresentationRequirement;
  exactValue: PresentationRequirement;
  units: PresentationRequirement;
  degreeSymbol: PresentationRequirement;
  coordinateBrackets: PresentationRequirement;
  vectorBrackets: PresentationRequirement;
  positivePowers: PresentationRequirement;
  rationalDenominator: PresentationRequirement;
  contextualWording: PresentationRequirement;
  answerLabelling: PresentationRequirement;
  significantNotationRequirements: string[];
  otherConditions: string[];
};

// ============================================================================
// SECTION 13 — VISUAL MARKING
// ============================================================================

export type VisualMarkingFeatureType =
  | "POINT_POSITION"
  | "ENDPOINT_POSITION"
  | "CURVE_SHAPE"
  | "TURNING_POINT"
  | "INTERCEPT"
  | "ROOT"
  | "LINE"
  | "ARROWHEAD"
  | "VECTOR_DIRECTION"
  | "NOSE_TO_TAIL"
  | "SHADED_REGION"
  | "LABEL"
  | "ANNOTATION"
  | "CONSTRUCTION_ARC"
  | "RIGHT_ANGLE"
  | "GEOMETRIC_RELATIONSHIP"
  | "OTHER";

export type VisualMarkingRequirement = {
  id: VisualMarkingRequirementId;
  visualElementId: VisualElementId;
  interaction: VisualCandidateInteraction;
  featureType: VisualMarkingFeatureType;
  requirementSummary: string;
  supportsMarkIds: MarkNodeId[];
  placementTolerance: string | null;
  shapeTolerance: string | null;
  arrowheadsRequired: boolean;
  labelsRequired: boolean;
  rulerRequired: boolean;
  visualEvidenceMayImplyProcess: boolean;
  sourceEvidence: CatalogEvidenceRef[];
};

export type VisualMarkingProfile = {
  requirements: VisualMarkingRequirement[];
  candidateVisualWorkCanEarnMarks: boolean;
  exactVisualAccuracyRequired: boolean;
  approximateVisualAccuracyAccepted: boolean;
  visualWorkMayProvideWorkingEvidence: boolean;
};

// ============================================================================
// SECTION 14 — QUESTION-SPECIFIC MARKING RULES
// ============================================================================

export type AnswerRuleCategory =
  | "FOLLOW_THROUGH"
  | "ROUNDING"
  | "WRONG_OPERATION"
  | "WRONG_VALUE"
  | "METHOD_LIMIT"
  | "METHOD_EXCLUSION"
  | "ERROR_LIMIT"
  | "ANSWER_ONLY"
  | "PRESENTATION"
  | "ALTERNATIVE_METHOD"
  | "SOLUTION_SELECTION"
  | "EXTRA_SOLUTION"
  | "CROSS_PART"
  | "VISUAL"
  | "OTHER";

export type AnswerRuleOutcome = {
  marksAwarded: number | null;
  maximumMarks: number | null;
  unavailableMarkIds: MarkNodeId[];
  followThroughMarkIds: MarkNodeId[];
  unaffectedMarkIds: MarkNodeId[];
};

export type AnswerRule = {
  id: AnswerRuleId;
  category: AnswerRuleCategory;
  conditionSummary: string;
  outcome: AnswerRuleOutcome;
  appliesToMarkIds: MarkNodeId[];
  sourceEvidence: CatalogEvidenceRef[];
};

// ============================================================================
// SECTION 15 — COMMON RESPONSE PATTERNS / ERRORS
// ============================================================================

export type CommonResponseCategory =
  | "COMMON_ERROR"
  | "MISCONCEPTION"
  | "PARTIAL_METHOD"
  | "VALID_ALTERNATIVE"
  | "ROUNDING_ERROR"
  | "ANSWER_ONLY"
  | "NOTATION_ERROR"
  | "CALCULATOR_MODE_ERROR"
  | "EXTRA_SOLUTION"
  | "VISUAL_ERROR"
  | "OTHER";

export type CommonResponsePattern = {
  id: CommonResponseId;
  category: CommonResponseCategory;
  errorFamily: string | null;
  responseSummary: string;
  affectedMarkIds: MarkNodeId[];
  marksAwarded: number | null;
  maximumMarks: number | null;
  followThroughAvailable: boolean;
  linkedRuleIds: AnswerRuleId[];
  usefulForGeneratorValidation: boolean;
  sourceEvidence: CatalogEvidenceRef[];
};

// ============================================================================
// SECTION 16 — SHARED / CROSS-QUESTION RULES
// ============================================================================

export type SharedRuleScope =
  | "QUESTION"
  | "QUESTION_GROUP"
  | "PAPER"
  | "ASSESSMENT"
  | "COURSE_POLICY";

export type SharedRuleCategory =
  | "CALCULATOR_MODE"
  | "REPEATED_ERROR"
  | "NOTATION"
  | "PRESENTATION"
  | "UNITS"
  | "MULTIPLE_ATTEMPTS"
  | "OTHER";

export type SharedMarkingRuleRef = {
  ruleId: SharedMarkingRuleId;
  scope: SharedRuleScope;
  category: SharedRuleCategory;
  affectedQuestionIds: QuestionCatalogId[];
  penaltyLimit: "ONCE" | "PER_QUESTION" | "PER_OCCURRENCE" | "NONE";
  applicationSummary: string;
  sourceEvidence: CatalogEvidenceRef[];
};

// ============================================================================
// SECTION 17 — GENERAL MARKING POLICY
// ============================================================================

export type GeneralMarkingPolicyRef = {
  policyId: GeneralMarkingPolicyId;
  relevantRuleIds: string[];
  notes: string[];
};

// ============================================================================
// SECTION 18 — QUESTION ↔ ANSWER/MS BRIDGE
// ============================================================================

export type PartMarkMap = {
  questionPartId: QuestionPartId;
  markIds: MarkNodeId[];
};

export type SubgoalMarkMap = {
  questionSubgoalId: QuestionSubgoalId;
  markIds: MarkNodeId[];
};

export type PromptInstructionConsequence = {
  instructionType: string;
  markingConsequence: string;
  affectedMarkIds: MarkNodeId[];
};

export type InformationEvidenceLink = {
  questionInformationId: QuestionInformationId;
  usedByMethodIds: MethodPathwayId[];
  supportsMarkIds: MarkNodeId[];
};

export type RepresentationEvidenceLink = {
  visualElementId: VisualElementId;
  evidenceSummary: string;
  supportsMarkIds: MarkNodeId[];
};

export type ErrorPropagationLink = {
  sourceMarkIds: MarkNodeId[];
  affectedMarkIds: MarkNodeId[];
  survivingMarkIds: MarkNodeId[];
  conditionSummary: string;
};

export type QuestionAnswerRelationship = {
  partMarkMap: PartMarkMap[];
  subgoalMarkMap: SubgoalMarkMap[];
  promptInstructionConsequences: PromptInstructionConsequence[];
  informationEvidenceMap: InformationEvidenceLink[];
  representationEvidenceMap: RepresentationEvidenceLink[];
  crossPartDependencies: string[];
  errorPropagationGraph: ErrorPropagationLink[];
};

// ============================================================================
// SECTION 19 — SOURCE MS LAYOUT
// ============================================================================

export type AnswerSourceMeasurementMethod =
  | "PDF_RENDER"
  | "MANUAL_ESTIMATE"
  | "NOT_MEASURED";

export type AnswerSourceMeasuredBlock = {
  measurementMethod: AnswerSourceMeasurementMethod;
  pdfPageNumber: number | null;
  renderDpi: number | null;
  topPx: number | null;
  bottomPx: number | null;
  leftPx: number | null;
  rightPx: number | null;
  heightMm: number | null;
  widthMm: number | null;
  notes: string | null;
};

export type AnswerSourceLayoutEvidence = {
  coreEvidenceBlocks: AnswerSourceMeasuredBlock[];
  fullQuestionBlocks: AnswerSourceMeasuredBlock[];
};

// ============================================================================
// SECTION 20 — ANSWER / MARKING GENERATION ANALYSIS
// ============================================================================

export type AnswerGenerationProfile = {
  readiness: CatalogGenerationReadiness;
  linkedAnswerGeneratorFamilyIds: GeneratorFamilyId[];
  requiredMethodFamilyIds: MethodPathwayId[];
  minimumIllustrativeMethodCount: number;
  requiredMarkTypes: MarkType[];
  followThroughTemplateNotes: string[];
  presentationTemplateNotes: string[];
  visualMarkingTemplateNotes: string[];
  commonErrorFamilyIds: string[];
  requiredValidationChecks: string[];
  provenance: CatalogProvenance;
};

// ============================================================================
// SECTION 21 — COMPLETE ANSWER CATALOGUE ENTRY
// ============================================================================

export type AnswerCatalogEntry = {
  identity: AnswerCatalogIdentity;
  sourceContext: AnswerSourceContext;
  expectedResponse: AnswerExpectedResponseProfile;
  markNodes: MarkNode[];
  methodPathways: MethodPathway[];
  methodEquivalence: MethodEquivalenceProfile;
  workingPolicy: WorkingEvidencePolicy;
  presentationPolicy: PresentationPolicy;
  visualMarking: VisualMarkingProfile;
  questionSpecificRules: AnswerRule[];
  commonResponses: CommonResponsePattern[];
  sharedRuleRefs: SharedMarkingRuleRef[];
  generalPolicy: GeneralMarkingPolicyRef;
  relationship: QuestionAnswerRelationship;
  sourceLayout: CatalogValue<AnswerSourceLayoutEvidence>;
  generation: AnswerGenerationProfile;
  review: CatalogReviewProfile;
};

// ============================================================================
// SECTION 22 — ANSWER CATALOGUE VALIDATION INVARIANTS
// ============================================================================

export const ANSWER_CATALOG_VALIDATION_INVARIANTS = [
  "Answer identity must resolve to exactly one Question Catalogue entry.",
  "Answer total marks must equal the sum of all MarkNode mark values.",
  "Every MarkNode must belong to a valid Question part.",
  "Every MarkNode skill ID must resolve in the canonical Course Skills Tree.",
  "Every MethodPathway step dependency must resolve inside its pathway.",
  "Every MethodPathway capable of full credit must map all marks it claims to support.",
  "Materially distinct valid methods must be represented explicitly rather than collapsed into one linear solution.",
  "Follow-through must identify both its source error/evidence and the marks that survive.",
  "Correct-answer-without-working treatment must be explicit for every reviewed entry.",
  "Visual mark requirements must resolve to Question visual elements.",
  "Shared rules must use stable shared rule IDs rather than duplicating paper-wide policy inside individual Questions.",
  "Generated Answer/MS logic must preserve the exact generated Question parameters rather than recalculating an independent Question.",
  "Historical marking-scheme prose must not be reproduced verbatim in generator source code.",
] as const;