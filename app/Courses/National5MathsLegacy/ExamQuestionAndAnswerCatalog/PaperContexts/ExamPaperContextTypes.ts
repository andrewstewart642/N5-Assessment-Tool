// ============================================================================
// CATALOGUE CONTRACT V1 — PAPER CONTEXT
// ============================================================================

import type { Paper } from "@/app/Assessments/AssessmentTypes";                     /* Uses the Assessment-owned paper type. */
import type { CourseId } from "@/app/Courses/CourseTypes";                          /* Uses the Course-owned course ID. */
import type {                                                                       /* Opens catalogue-wide imports. */
  ExamCatalogueEvidenceRef,                                                         /* Reuses traceable source references. */
  ExamCatalogueReviewProfile,                                                       /* Reuses the common review record. */
  ExamGeneralMarkingPolicyId,                                                       /* Reuses the general marking-policy ID. */
  ExamPaperContextId,                                                               /* Reuses the paper-context ID. */
} from "../ExamCatalogTypes";                                                       /* Closes catalogue-wide imports. */

// ============================================================================
// SECTION 1 — PAPER SOURCE TYPE
// ============================================================================

export type ExamPaperSourceKind =                                                   /* Describes the kind of source assessment. */
  | "STANDARD_EXAM"                                                                 /* A normal examination paper. */
  | "MODIFIED_EXAM"                                                                 /* A formally modified examination paper. */
  | "ASSESSMENT_RESOURCE"                                                           /* An assessment resource rather than a normal exam. */
  | "SPECIMEN"                                                                      /* A specimen or practice paper. */
  | "TEACHER_AUTHORED"                                                              /* A teacher-created paper. */
  | "OTHER";                                                                        /* Any other supported source. */

export type ExamPaperCalculatorPolicy =                                             /* Records calculator use for the whole paper. */
  | "PROHIBITED"                                                                    /* Calculators must not be used. */
  | "PERMITTED";                                                                    /* Calculators may be used. */

// ============================================================================
// SECTION 2 — FORMULA LIST CONTEXT
// ============================================================================

export type ExamPaperFormulaListProfile = {                                         /* Opens the formula-list details for this paper. */
  provided: boolean;                                                                /* Records whether a formula list was supplied. */
  profileId: string | null;                                                         /* Links a known formula-list version when available. */
  sourceEvidence: ExamCatalogueEvidenceRef[];                                       /* Links the details back to the source paper. */
};                                                                                  /* Closes the formula-list profile. */

// ============================================================================
// SECTION 3 — SOURCE DOCUMENTS
// ============================================================================

export type ExamPaperSourceDocuments = {                                            /* Opens the source documents linked to this paper. */
  questionPaper: ExamCatalogueEvidenceRef[];                                        /* Links to the Question Paper evidence. */
  markingScheme: ExamCatalogueEvidenceRef[];                                        /* Links to the matching Marking Scheme evidence. */
};                                                                                  /* Closes the source-document links. */

// ============================================================================
// SECTION 4 — PAPER IDENTITY
// ============================================================================

export type ExamPaperContextIdentity = {                                            /* Opens the permanent identity of one paper context. */
  id: ExamPaperContextId;                                                           /* Gives the paper context its stable ID. */
  schemaVersion: "CATALOGUE_V1";                                                    /* Records the catalogue contract version. */
  courseId: CourseId;                                                               /* Links the paper to its Course. */
  year: number;                                                                     /* Records the source assessment year. */
  assessmentSeries: string | null;                                                  /* Records a source series label when useful. */
  paper: Paper;                                                                     /* Records Paper 1 or Paper 2. */
};                                                                                  /* Closes the paper identity. */

// ============================================================================
// SECTION 5 — PAPER CONDITIONS
// ============================================================================

export type ExamPaperConditions = {                                                 /* Opens the main conditions of the historical paper. */
  sourceKind: ExamPaperSourceKind;                                                  /* Records the assessment regime. */
  calculatorPolicy: ExamPaperCalculatorPolicy;                                      /* Records the calculator rule. */
  durationMinutes: number;                                                          /* Records the paper duration. */
  totalMarks: number;                                                               /* Records the total marks available. */
  numberedQuestionCount: number;                                                    /* Records the number of numbered Questions. */
  formulaList: ExamPaperFormulaListProfile;                                         /* Stores the formula-list context. */
};                                                                                  /* Closes the paper conditions. */

// ============================================================================
// SECTION 6 — COMPLETE PAPER CONTEXT ENTRY
// ============================================================================

export type ExamPaperContextCatalogEntry = {                                        /* Opens the universal Paper Context catalogue entry. */
  identity: ExamPaperContextIdentity;                                               /* Stores permanent paper identity. */
  conditions: ExamPaperConditions;                                                  /* Stores timing, marks, calculator, and formula-list facts. */
  generalMarkingPolicyId: ExamGeneralMarkingPolicyId;                               /* Links the matching general marking policy. */
  sourceDocuments: ExamPaperSourceDocuments;                                        /* Stores the source-document links. */
  paperNotes: string[];                                                             /* Stores short paper-level observations. */
  review: ExamCatalogueReviewProfile;                                               /* Stores review state and unresolved issues. */
};                                                                                  /* Closes the Paper Context catalogue entry. */
