import type {
  CourseId,
  Paper,
} from "@/shared-types/AssessmentTypes_TEMP";

export type SourceMarkingSchemeId =
  string;

export type SourceMarkingSchemeSourceContext =
  | "STANDARD_EXAM"
  | "COVID_RESOURCE";

export type SourceMarkingSchemeReviewStatus =
  | "DRAFT"
  | "CATALOGUED"
  | "REVIEWED"
  | "APPROVED";

export type SourceMethodEvidenceRole =
  | "ILLUSTRATIVE"
  | "FULL_CREDIT_ALTERNATIVE"
  | "PARTIAL_METHOD_EVIDENCE";

export type SourceMarkingSchemeMethodEvidence = {
  /**
   * Normalised VecEd method identity.
   *
   * We do NOT use historical labels such as
   * "Method 1" as the permanent identity.
   */
  methodFamilyId: string;

  /**
   * Optional more-specific route.
   */
  variantId?: string;

  /**
   * How this method appeared in the historical MS.
   */
  evidenceRole: SourceMethodEvidenceRole;

  /**
   * Whether the historical presentation shown
   * was sufficient for full credit.
   */
  supportsFullCredit: boolean;
};

export type SourceMarkSkillOwnership = {
  markNumber: number;

  /**
   * SQA skill owning this mark.
   *
   * Particularly important for interleaved
   * questions.
   */
  skillId: string;
};

export type SourceMarkingSchemeCatalogEntry = {
  id: SourceMarkingSchemeId;

  /**
   * Direct connection to the corresponding
   * source-question catalogue entry.
   */
  sourceQuestionId: string;

  courseId: CourseId;

  year: number;
  paper: Paper;
  questionNumber: string;

  totalMarks: number;

  /**
   * Generator family this evidence informs.
   */
  questionFamilyId: string;

  /**
   * Context metadata only.
   *
   * COVID_RESOURCE does NOT reduce weighting.
   */
  sourceContext:
    SourceMarkingSchemeSourceContext;

  /**
   * Correct/usable method evidence extracted
   * from the historical marking scheme.
   *
   * No verbatim SQA prose.
   */
  methodEvidence:
    SourceMarkingSchemeMethodEvidence[];

  /**
   * Exact mark-level skill ownership.
   */
  markSkillOwnership:
    SourceMarkSkillOwnership[];

  reviewStatus:
    SourceMarkingSchemeReviewStatus;
};