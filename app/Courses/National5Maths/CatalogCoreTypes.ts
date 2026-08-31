import type { CourseId } from "@/app/Courses/CourseTypes";
import type { Paper } from "@/app/Assessments/AssessmentTypes";

export type CatalogDocumentId = string;
export type PaperContextId = string;
export type GeneralMarkingPolicyId = string;
export type SharedMarkingRuleId = string;
export type GeneratorFamilyId = string;
export type RendererFamilyId = string;
export type MediaAssetId = string;
export type CatalogSchemaVersion = "N5_CATALOG_V2" | "N5_CATALOG_V3";

export type CatalogValueState = "VALUE" | "NOT_APPLICABLE" | "UNKNOWN" | "NOT_REVIEWED";
export type CatalogConfidence = "HIGH" | "MEDIUM" | "LOW";
export type CatalogProvenance = "SOURCE_FACT" | "CATALOGUE_CLASSIFICATION" | "GENERATION_ANALYSIS";
export type CatalogEvidenceType =
  | "QUESTION"
  | "MARKING_SCHEME"
  | "GENERAL_MARKING_POLICY"
  | "VISUAL"
  | "PAPER_CONTEXT"
  | "CLASSIFICATION_GUIDANCE"
  | "FOI_CLASSIFICATION";

export type CatalogEvidenceRef = {
  documentId: CatalogDocumentId;
  pdfPages: number[];
  printedPageLabels: string[];
  paper: Paper | null;
  questionLocator: string | null;
  evidenceType: CatalogEvidenceType;
  locatorNote: string | null;
};

export type CatalogValue<T> =
  | { state: "VALUE"; value: T; confidence: CatalogConfidence; provenance: CatalogProvenance; evidence: CatalogEvidenceRef[]; notes: string | null }
  | { state: "NOT_APPLICABLE"; value: null; confidence: CatalogConfidence; provenance: CatalogProvenance; evidence: CatalogEvidenceRef[]; notes: string | null }
  | { state: "UNKNOWN"; value: null; confidence: CatalogConfidence; provenance: CatalogProvenance; evidence: CatalogEvidenceRef[]; notes: string | null }
  | { state: "NOT_REVIEWED"; value: null; confidence: null; provenance: null; evidence: CatalogEvidenceRef[]; notes: string | null };

export type CatalogSourceDocumentType =
  | "QUESTION_PAPER"
  | "MARKING_SCHEME"
  | "ASSESSMENT_RESOURCE"
  | "MODIFIED_EXAM"
  | "SPECIMEN"
  | "CLASSIFICATION_GUIDANCE"
  | "FREEDOM_OF_INFORMATION"
  | "OTHER";
export type CatalogSourceDocumentRef = { id: CatalogDocumentId; courseId: CourseId; year: number; paper: Paper | null; documentType: CatalogSourceDocumentType; sourceLocator: string };

// ============================================================================
// V3 MARK-OWNERSHIP CLASSIFICATION
// ============================================================================

export type CatalogMarkStandard = "C" | "A";
export type CatalogMarkThinking = "OPERATIONAL" | "REASONING";

/**
 * V3 treats each one-mark node as wholly owned by exactly one canonical Skill.
 * Standard and thinking are also mark-level values. They retain their own
 * evidence/provenance because SQA/FOI/professional guidance may support one
 * classification without explicitly supporting the other.
 */
export type CatalogMarkClassificationProfile = {
  primarySkillId: string;
  standard: CatalogValue<CatalogMarkStandard>;
  thinking: CatalogValue<CatalogMarkThinking>;
};

export type CatalogMarkClassificationSummary = {
  skillMarkDistribution: Record<string, number>;
  standardMarkDistribution: Record<CatalogMarkStandard, number>;
  thinkingMarkDistribution: Record<CatalogMarkThinking, number>;
};

// ============================================================================
// GENERATED-QUESTION HISTORICAL REFERENCE
// ============================================================================

export type HistoricalQuestionMatchReason =
  | "SAME_FAMILY"
  | "SAME_SKILL"
  | "SAME_MARK_TARIFF"
  | "SAME_STANDARD_PROFILE"
  | "SAME_THINKING_PROFILE"
  | "SAME_PAPER"
  | "SIMILAR_STRUCTURE"
  | "SIMILAR_CONTEXT"
  | "SIMILAR_NUMERICAL_DEMAND"
  | "OTHER";

export type HistoricalQuestionReferenceProfile = {
  primaryQuestionCatalogId: string | null;
  supportingQuestionCatalogIds: string[];
  matchReasons: HistoricalQuestionMatchReason[];
};

/** Converts a canonical catalogue ID into compact teacher-facing source text. */
export const formatHistoricalQuestionReferenceLabel = (questionCatalogId: string): string | null => {
  const match = /^N5_MATH_(\d{4})_(P1|P2)_Q(.+)$/.exec(questionCatalogId);
  if (!match) return null;
  return `N5 Maths ${match[1]} ${match[2]} Q${match[3]}`;
};

export type CatalogReviewStatus = "NOT_REVIEWED" | "IN_PROGRESS" | "REVIEWED" | "VALIDATED";
export type CatalogReviewProfile = {
  status: CatalogReviewStatus;
  sourceFactsComplete: boolean;
  classificationComplete: boolean;
  generationAnalysisComplete: boolean;
  counterpartCrossChecked: boolean;
  visualEvidenceCrossChecked: boolean;
  unresolvedIssues: string[];
  validationNotes: string[];
  reviewedAt: string | null;
};

export type CatalogSourceIsolationProfile = {
  historicalPromptWordingStored: false;
  historicalMarkingWordingStored: false;
  historicalPixelArtworkStored: false;
  historicalVectorGeometryStored: false;
  exactSourceCoordinatesReusable: false;
  semanticFactsMayBeUsedForGeneration: true;
};

export type CatalogGenerationReadiness = "NOT_READY" | "PARTIAL" | "READY_FOR_PROTOTYPE" | "READY_FOR_PRODUCTION";
export type CatalogValidationSeverity = "INFO" | "WARNING" | "ERROR";
export type CatalogValidationIssue = { severity: CatalogValidationSeverity; code: string; summary: string; fieldPath: string | null };

export const CATALOG_CORE_VALIDATION_INVARIANTS = [
  "Reviewed entries must not retain required NOT_REVIEWED fields.",
  "All referenced IDs must resolve in their owning catalogue or Course system.",
  "Historical wording and artwork remain source evidence, never generator templates.",
  "SOURCE_FACT, CATALOGUE_CLASSIFICATION and GENERATION_ANALYSIS remain distinguishable.",
  "UNKNOWN must never be silently treated as NOT_APPLICABLE.",
  "V3 mark classifications assign exactly one primary Skill, one C/A value and one Operational/Reasoning value to each mark.",
  "Historical-reference links point to catalogue IDs; teacher-facing labels are derived rather than duplicated in generated question data.",
] as const;
