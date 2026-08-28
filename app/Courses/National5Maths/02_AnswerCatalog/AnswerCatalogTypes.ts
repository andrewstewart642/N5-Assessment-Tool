// ============================================================================
// NATIONAL 5 MATHS — UNIVERSAL ANSWER / MARKING CATALOGUE CONTRACT
// ============================================================================
//
// The Answer Catalogue is an evidence model of historical marking practice.
// It records what the source marking instructions actually awarded, required,
// accepted, limited or rejected. It does not harmonise inconsistent years and
// it does not bend source truth to suit the Builder or a future generator.
//
// Historical wording is evidence only. Source facts are normalised/paraphrased
// and linked back to page/question locators. Cross-corpus consistency analysis
// is deliberately separate from the historical source record.
// ============================================================================

import type { CourseId } from "@/app/Courses/CourseTypes";
import type { Paper } from "@/app/Assessments/AssessmentTypes";

import type {
  CatalogConfidence,
  CatalogDocumentId,
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

import type { VisualCandidateInteraction, VisualElementId } from "../05_VisualAssets/VisualCatalogTypes";

// ============================================================================
// SECTION 1 — STABLE IDS
// ============================================================================

export type AnswerCatalogId = string;
export type MarkNodeId = string;
export type MethodPathwayId = string;
export type MethodStepId = string;
export type AnswerVariantId = string;
export type SourceDirectiveId = string;
export type CommonResponseId = string;
export type VisualMarkingRequirementId = string;
export type ConsistencyFeatureId = string;
export type MarkingComparisonKeyId = string;

// ============================================================================
// SECTION 2 — IDENTITY / SOURCE CONTEXT
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

export type AnswerSourceContext = {
  sourceDocumentId: CatalogDocumentId;
  totalMarks: number;
  sourcePages: number[];                       /* Physical 1-based PDF pages. */
  printedPageLabels: string[];
  sourceEvidence: CatalogEvidenceRef[];
  generalMarkingPolicyId: GeneralMarkingPolicyId;
};

// ============================================================================
// SECTION 3 — SOURCE DIRECTIVES
// ============================================================================

export type MarkingSourceLayer =
  | "GENERAL_POLICY"
  | "EXPECTED_ANSWER"
  | "GENERIC_MARK_REQUIREMENT"
  | "ILLUSTRATIVE_EVIDENCE"
  | "QUESTION_NOTE"
  | "COMMON_RESPONSE"
  | "ALTERNATIVE_METHOD";

export type SourceDirectiveScope = "MARK" | "PART" | "QUESTION" | "QUESTION_GROUP" | "PAPER" | "ASSESSMENT";

export type SourceDirectiveEffect =
  | "AWARD"
  | "LIMIT"
  | "BLOCK"
  | "ACCEPT"
  | "REQUIRE"
  | "FOLLOW_THROUGH"
  | "IGNORE_PENALTY"
  | "SELECT_LOWEST_ATTEMPT"
  | "OTHER";

export type SourceMarkingDirective = {
  id: SourceDirectiveId;
  layer: MarkingSourceLayer;
  scope: SourceDirectiveScope;
  effect: SourceDirectiveEffect;
  normalisedSummary: string;                  /* Paraphrase only; never source prose. */
  appliesToPartIds: QuestionPartId[];
  appliesToMarkIds: MarkNodeId[];
  appliesToMethodIds: MethodPathwayId[];
  marksAwarded: number | null;
  maximumMarks: number | null;
  sourceEvidence: CatalogEvidenceRef[];
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

export type ExpectedPrecisionType = "NONE" | "DECIMAL_PLACES" | "SIGNIFICANT_FIGURES" | "NEAREST_UNIT" | "RANGE";

export type ExpectedAnswerVariant = {
  id: AnswerVariantId;
  normalisedAnswer: string;
  numericValue: number | null;
  answerForm: ExpectedAnswerForm;
  mathematicallyEquivalentToVariantIds: AnswerVariantId[];
  conditionsForAcceptance: string[];
  sourceEvidence: CatalogEvidenceRef[];
  notes: string | null;
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
// SECTION 5 — MARK-BEARING EVIDENCE
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
  normalisedEvidence: string;
  acceptedLocations: MarkEvidenceLocation[];
  mayBeImpliedByLaterWork: boolean;
  mayBeImpliedByCorrectFinalAnswer: boolean;
  visualElementIds: VisualElementId[];
  sourceEvidence: CatalogEvidenceRef[];
};

export type MarkPathwayRequirement = {
  methodPathwayId: MethodPathwayId;
  normalisedRequirement: string;
  sourceEvidence: CatalogEvidenceRef[];
};

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
  relatedQuestionPartIds: QuestionPartId[];
  conditionSummary: string | null;
  sourceEvidence: CatalogEvidenceRef[];
};

export type FollowThroughProfile = {
  allowed: boolean;
  fromMarkIds: MarkNodeId[];
  fromQuestionPartIds: QuestionPartId[];
  requiresComparableDifficulty: boolean;
  blockedForRequiredResult: boolean;
  blockedByInvalidMathematicalState: boolean;
  blockedByTrivialisedLaterWork: boolean;
  sourceBasis: "GENERAL_POLICY" | "QUESTION_SPECIFIC" | "BOTH" | "NOT_STATED";
  sourceEvidence: CatalogEvidenceRef[];
  notes: string | null;
};

export type MarkNode = {
  id: MarkNodeId;
  markNumber: number;
  markValue: 1;
  questionPartId: QuestionPartId;
  primaryType: MarkType;
  secondaryTypes: MarkType[];
  officialRequirement: string;                /* Normalised generic source requirement. */
  illustrativeEvidence: MarkEvidenceCondition[];
  pathwaySpecificRequirements: MarkPathwayRequirement[];
  genericPurpose: string;                     /* Catalogue classification, not source wording. */
  linkedSubgoalIds: QuestionSubgoalId[];
  skillIds: string[];
  conceptIds: string[];
  dependencies: MarkDependency[];
  followThrough: FollowThroughProfile;
  eligibilityConditions: string[];
  blockingConditions: string[];
  methodPathwayIds: MethodPathwayId[];
  presentationConditions: string[];
  visualRequirementIds: VisualMarkingRequirementId[];
  sourceDirectiveIds: SourceDirectiveId[];
  sourceEvidence: CatalogEvidenceRef[];
  confidence: CatalogConfidence;
};

// ============================================================================
// SECTION 6 — METHOD PATHWAYS / EQUIVALENCE
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
  normalisedStep: string;
  linkedQuestionSubgoalIds: QuestionSubgoalId[];
  linkedMarkIds: MarkNodeId[];
  dependsOnStepIds: MethodStepId[];
  requiredOperations: string[];
  resultingStateSummary: string | null;
  sourceEvidence: CatalogEvidenceRef[];
};

export type MethodPathway = {
  id: MethodPathwayId;
  variantId: string | null;
  evidenceRole: MethodEvidenceRole;
  supportsFullCredit: boolean;
  applicabilityConditions: string[];
  steps: MethodStep[];
  markMappingComplete: boolean;
  sourceTotalAwardRules: SourceDirectiveId[];  /* For source notes that award totals directly. */
  mathematicallyEquivalentMethodIds: MethodPathwayId[];
  materiallyDistinctFromMethodIds: MethodPathwayId[];
  excludedMethodReasons: string[];
  sourceEvidence: CatalogEvidenceRef[];
};

export type MethodEquivalenceProfile = {
  equivalentMethodGroups: {
    id: string;
    methodIds: MethodPathwayId[];
    equivalenceReason: string;
    sourceEvidence: CatalogEvidenceRef[];
  }[];
  methodEligibilityRules: {
    id: string;
    methodId: MethodPathwayId;
    condition: string;
    eligible: boolean;
    affectedMarkIds: MarkNodeId[];
    sourceEvidence: CatalogEvidenceRef[];
  }[];
};

// ============================================================================
// SECTION 7 — ANSWER-ONLY / WORKING POLICY
// ============================================================================

export type AnswerOnlyTreatment = "FULL_CREDIT" | "PARTIAL_CREDIT" | "NO_CREDIT" | "NOT_STATED";

export type CorrectAnswerWithoutWorkingProfile = {
  treatment: AnswerOnlyTreatment;
  marksAwarded: number | null;
  markIdsAwarded: MarkNodeId[];
  conditions: string[];
  sourceDirectiveIds: SourceDirectiveId[];
  sourceEvidence: CatalogEvidenceRef[];
  notes: string | null;
};

export type WorkingEvidencePolicy = {
  correctAnswerWithoutWorking: CorrectAnswerWithoutWorkingProfile;
  partSpecificAnswerOnly: { questionPartId: QuestionPartId; profile: CorrectAnswerWithoutWorkingProfile }[];
  workingMandatoryForMarkIds: MarkNodeId[];
  workingMayBeImpliedForMarkIds: MarkNodeId[];
  diagramWorkCanScore: boolean;
  graphWorkCanScore: boolean;
  tableWorkCanScore: boolean;
  laterPartCanSupplyEvidence: boolean;
  earlierPartCanSupplyEvidence: boolean;
  repeatedSubstitutionAccepted: CatalogValue<boolean>;
  unsupportedCalculatorAnswerAccepted: CatalogValue<boolean>;
};

// ============================================================================
// SECTION 8 — PRECISION / UNITS / NOTATION / PRESENTATION
// ============================================================================

export type PresentationRequirement =
  | "REQUIRED_FOR_MARK"
  | "REQUIRED_FOR_FULL_CREDIT"
  | "ACCEPTED_VARIATION"
  | "DO_NOT_PENALISE"
  | "NOT_STATED"
  | "NOT_RELEVANT";

export type PrecisionPolicy = {
  finalPrecisionType: ExpectedPrecisionType;
  finalPrecisionValue: number | null;
  acceptedFinalRange: { min: number; max: number } | null;
  prematureRoundingTreatment: "ACCEPT" | "PENALISE" | "FOLLOW_THROUGH" | "NOT_STATED" | "NOT_RELEVANT";
  minimumIntermediatePrecision: string | null;
  sourceEvidence: CatalogEvidenceRef[];
};

export type PresentationPolicy = {
  precision: PrecisionPolicy;
  simplification: PresentationRequirement;
  exactValue: PresentationRequirement;
  units: PresentationRequirement;
  degreeSymbol: PresentationRequirement;
  coordinateBrackets: PresentationRequirement;
  vectorBrackets: PresentationRequirement;
  vectorOrientation: PresentationRequirement;
  positivePowers: PresentationRequirement;
  rationalDenominator: PresentationRequirement;
  contextualWording: PresentationRequirement;
  answerLabelling: PresentationRequirement;
  significantNotationRequirements: string[];
  otherConditions: string[];
  sourceEvidence: CatalogEvidenceRef[];
};

// ============================================================================
// SECTION 9 — VISUAL MARKING
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
  normalisedRequirement: string;
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
// SECTION 10 — SOURCE-SPECIFIED COMMON RESPONSES
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
  | "PRESENTATION_ERROR"
  | "OTHER";

export type CommonResponsePattern = {
  id: CommonResponseId;
  sourceStatus: "EXPLICITLY_LISTED" | "DERIVED_FROM_EXPLICIT_NOTE";
  category: CommonResponseCategory;
  errorFamily: string | null;
  normalisedResponse: string;
  affectedMarkIds: MarkNodeId[];
  marksAwarded: number | null;
  maximumMarks: number | null;
  followThroughAvailable: boolean;
  sourceDirectiveIds: SourceDirectiveId[];
  sourceEvidence: CatalogEvidenceRef[];
};

// ============================================================================
// SECTION 11 — SHARED / GENERAL MARKING POLICY
// ============================================================================

export type SharedRuleScope = "QUESTION" | "QUESTION_GROUP" | "PAPER" | "ASSESSMENT" | "COURSE_POLICY";

export type SharedRuleCategory =
  | "POSITIVE_MARKING"
  | "VALID_METHODS"
  | "FOLLOW_THROUGH"
  | "TRANSCRIPTION"
  | "SCORED_OUT_WORK"
  | "MULTIPLE_ATTEMPTS"
  | "REPEATED_ERROR"
  | "NOTATION"
  | "PRESENTATION"
  | "UNITS"
  | "OTHER";

export type SharedMarkingRule = {
  id: SharedMarkingRuleId;
  scope: SharedRuleScope;
  category: SharedRuleCategory;
  normalisedRule: string;
  penaltyLimit: "ONCE" | "PER_QUESTION" | "PER_OCCURRENCE" | "NONE" | "NOT_APPLICABLE";
  sourceEvidence: CatalogEvidenceRef[];
};

export type GeneralMarkingPolicyCatalogEntry = {
  id: GeneralMarkingPolicyId;
  schemaVersion: CatalogSchemaVersion;
  courseId: CourseId;
  year: number;
  affectedPapers: Paper[];
  sourceDocumentId: CatalogDocumentId;
  rules: SharedMarkingRule[];
  sourceEvidence: CatalogEvidenceRef[];
  integrity: AnswerIntegrityProfile;
  review: CatalogReviewProfile;
};

export type GeneralMarkingPolicyRef = {
  policyId: GeneralMarkingPolicyId;
  relevantRuleIds: SharedMarkingRuleId[];
  questionSpecificOverrides: SourceDirectiveId[];
};

// ============================================================================
// SECTION 12 — QUESTION ↔ MARKING-SCHEME BRIDGE
// ============================================================================

export type PartMarkMap = { questionPartId: QuestionPartId; markIds: MarkNodeId[] };
export type SubgoalMarkMap = { questionSubgoalId: QuestionSubgoalId; markIds: MarkNodeId[] };

export type PromptInstructionConsequence = {
  instructionType: string;
  markingConsequence: string;
  affectedMarkIds: MarkNodeId[];
  sourceEvidence: CatalogEvidenceRef[];
};

export type InformationEvidenceLink = {
  questionInformationId: QuestionInformationId;
  usedByMethodIds: MethodPathwayId[];
  supportsMarkIds: MarkNodeId[];
};

export type RepresentationEvidenceLink = {
  visualElementId: VisualElementId;
  normalisedEvidence: string;
  supportsMarkIds: MarkNodeId[];
};

export type ErrorPropagationLink = {
  sourceMarkIds: MarkNodeId[];
  sourceQuestionPartIds: QuestionPartId[];
  affectedMarkIds: MarkNodeId[];
  survivingMarkIds: MarkNodeId[];
  conditionSummary: string;
  sourceEvidence: CatalogEvidenceRef[];
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
// SECTION 13 — SOURCE MARKING-SCHEME PRESENTATION
// ============================================================================

export type AnswerSourceMeasurementMethod = "PDF_RENDER" | "PDF_NATIVE" | "MANUAL_ESTIMATE" | "NOT_MEASURED";

export type AnswerSourceMeasuredBlock = {
  id: string;
  blockRole: "EXPECTED_ANSWER" | "GENERIC_REQUIREMENTS" | "ILLUSTRATIVE_EVIDENCE" | "NOTES" | "FULL_QUESTION_BLOCK" | "OTHER";
  measurementMethod: AnswerSourceMeasurementMethod;
  pdfPageNumber: number | null;
  printedPageLabel: string | null;
  renderDpi: number | null;
  pageWidthPx: number | null;
  pageHeightPx: number | null;
  topPx: number | null;
  bottomPx: number | null;
  leftPx: number | null;
  rightPx: number | null;
  heightPx: number | null;
  widthPx: number | null;
  topPt: number | null;
  bottomPt: number | null;
  leftPt: number | null;
  rightPt: number | null;
  heightPt: number | null;
  widthPt: number | null;
  heightMm: number | null;
  widthMm: number | null;
  notes: string | null;
};

export type AnswerSourcePresentationProfile = {
  layoutFamily: "TABLE_ROW" | "MULTI_METHOD_TABLE_ROW" | "MULTIPART_TABLE_ROW" | "MULTI_PAGE" | "OTHER";
  expectedAnswerShown: boolean;
  genericMarkRequirementsShown: boolean;
  illustrativeEvidenceShown: boolean;
  methodBlockCount: number;
  noteCount: number;
  explicitlyListedCommonResponseCount: number;
  sourcePages: number[];
  measuredBlocks: AnswerSourceMeasuredBlock[];
};

// ============================================================================
// SECTION 14 — CROSS-CORPUS CONSISTENCY FINGERPRINT
// ============================================================================

export type ConsistencyFeatureValue = string | number | boolean | null;

export type ConsistencyFeatureObservation = {
  featureId: ConsistencyFeatureId;
  value: ConsistencyFeatureValue;
  normalisedMeaning: string;
  provenance: "SOURCE_FACT" | "NORMALISED_SOURCE_FACT";
  sourceEvidence: CatalogEvidenceRef[];
};

export type MarkingComparisonKey = {
  id: MarkingComparisonKeyId;
  questionFamilyId: QuestionFamilyId;
  skillIds: string[];
  markCount: number;
  responseTypes: QuestionResponseType[];
  comparisonDimensions: string[];
};

export type ConsistencyClassification =
  | "NOT_REVIEWED"
  | "INSUFFICIENT_EVIDENCE"
  | "STABLE"
  | "CONTEXT_CONDITIONED"
  | "POLICY_REGIME_VARIATION"
  | "QUESTION_FAMILY_VARIATION"
  | "ISOLATED_EXCEPTION"
  | "CONFLICTING_EVIDENCE";

export type CrossCorpusConsistencyAnalysis = {
  classification: ConsistencyClassification;
  comparisonKey: MarkingComparisonKey;
  comparedEntryIds: AnswerCatalogId[];
  supportingEntryIds: AnswerCatalogId[];
  contradictingEntryIds: AnswerCatalogId[];
  sampleSize: number;
  observedPattern: string | null;
  distinguishingConditions: string[];
  unresolvedQuestions: string[];
  analysisMayAlterSourceFacts: false;
  provenance: "GENERATION_ANALYSIS";            /* Analysis layer, never historical fact. */
};

export type MarkingConsistencyProfile = {
  factualFingerprint: ConsistencyFeatureObservation[];
  crossCorpusAnalysis: CrossCorpusConsistencyAnalysis;
};

// ============================================================================
// SECTION 15 — SOURCE INTEGRITY
// ============================================================================

export type AnswerIntegrityProfile = {
  sourceFactsPreservedWithoutHarmonisation: true;
  unsupportedAssumptionsStoredAsFacts: false;
  crossCorpusAnalysisMayOverrideSourceFacts: false;
  historicalMarkingWordingStored: false;
  historicalSourceGeometryReusableByGenerator: false;
  builderRequirementsMayOverrideCatalogueTruth: false;
  generatorDecisionsDeferredFromSourceCatalogue: true;
};

// ============================================================================
// SECTION 16 — FUTURE ANSWER / MS GENERATION ANALYSIS
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
  requiredValidationChecks: string[];
  provenance: CatalogProvenance;
};

// ============================================================================
// SECTION 17 — COMPLETE ANSWER CATALOGUE ENTRY
// ============================================================================

export type AnswerCatalogEntry = {
  identity: AnswerCatalogIdentity;
  sourceContext: AnswerSourceContext;
  expectedResponse: AnswerExpectedResponseProfile;
  sourceDirectives: SourceMarkingDirective[];
  markNodes: MarkNode[];
  methodPathways: MethodPathway[];
  methodEquivalence: MethodEquivalenceProfile;
  workingPolicy: WorkingEvidencePolicy;
  presentationPolicy: PresentationPolicy;
  visualMarking: VisualMarkingProfile;
  commonResponses: CommonResponsePattern[];
  generalPolicy: GeneralMarkingPolicyRef;
  relationship: QuestionAnswerRelationship;
  sourcePresentation: AnswerSourcePresentationProfile;
  consistency: MarkingConsistencyProfile;
  integrity: AnswerIntegrityProfile;
  generation: CatalogValue<AnswerGenerationProfile>;
  review: CatalogReviewProfile;
};

// ============================================================================
// SECTION 18 — VALIDATION INVARIANTS
// ============================================================================

export const ANSWER_CATALOG_VALIDATION_INVARIANTS = [
  "Every Answer entry must resolve to exactly one Question Catalogue entry.",
  "Answer total marks must equal the sum of MarkNode mark values.",
  "Every MarkNode must resolve to a valid Question part and canonical Course skill/concept.",
  "Generic source requirements and illustrative source evidence must remain distinguishable.",
  "Question-specific source notes must be retained as explicit directives rather than absorbed into guesses.",
  "Common responses may be stored as SOURCE_FACT only when the source explicitly lists them or an explicit source note defines them.",
  "Correct-answer-without-working treatment must be explicit when stated and NOT_STATED when the source is silent.",
  "Follow-through must record its source basis and any comparable-difficulty gate.",
  "Materially distinct valid source methods must be represented as separate pathways.",
  "Method-specific mark requirements must not be collapsed when the source differentiates them.",
  "Cross-corpus consistency analysis must never modify, harmonise or replace historical source facts.",
  "A consistency classification needs explicit comparator entries; otherwise it remains NOT_REVIEWED or INSUFFICIENT_EVIDENCE.",
  "Question-specific rules override general policy only where the source explicitly supplies the override.",
  "Historical marking-scheme wording and source geometry are evidence only and must not become generator templates.",
  "Builder/runtime requirements must not alter the historical catalogue record.",
] as const;
