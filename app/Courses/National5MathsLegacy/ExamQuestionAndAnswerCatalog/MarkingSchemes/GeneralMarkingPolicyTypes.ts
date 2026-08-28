// ============================================================================
// CATALOGUE CONTRACT V1 — GENERAL MARKING POLICY
// ============================================================================

import type { CourseId } from "@/app/Courses/CourseTypes";                          /* Uses the Course-owned course ID. */
import type {                                                                       /* Opens catalogue-wide imports. */
  ExamCatalogueEvidenceRef,                                                         /* Reuses traceable source references. */
  ExamCatalogueReviewProfile,                                                       /* Reuses the common review record. */
  ExamGeneralMarkingPolicyId,                                                       /* Reuses the general policy ID. */
  ExamPaperContextId,                                                               /* Reuses paper-context IDs. */
} from "../ExamCatalogTypes";                                                       /* Closes catalogue-wide imports. */

// ============================================================================
// SECTION 1 — RULE CATEGORIES
// ============================================================================

export type ExamGeneralMarkingRuleCategory =                                        /* Groups general rules by their main purpose. */
  | "POSITIVE_MARKING"                                                              /* Guidance on awarding marks for valid evidence. */
  | "ERROR_TREATMENT"                                                               /* Guidance on candidate errors. */
  | "TRANSCRIPTION_ERROR"                                                           /* Guidance on copied values or transcription slips. */
  | "HORIZONTAL_VERTICAL_MARKING"                                                   /* Guidance on how work may be marked across a response. */
  | "SIMPLIFICATION"                                                                /* Guidance on expected simplification. */
  | "ROUNDING"                                                                      /* Guidance on rounding and precision. */
  | "EXACTNESS"                                                                     /* Guidance on exact rather than decimal answers. */
  | "UNITS"                                                                         /* Guidance on the treatment of units. */
  | "NOTATION"                                                                      /* Guidance on required mathematical notation. */
  | "REPEATED_ERROR"                                                                /* Guidance on repeated mistakes. */
  | "FOLLOW_THROUGH"                                                                /* Guidance on later marks after an earlier error. */
  | "SHOW_THAT"                                                                     /* Guidance for stated-result or show-that Questions. */
  | "SCORED_OUT_WORKING"                                                            /* Guidance on work that has been crossed out. */
  | "MULTIPLE_ATTEMPTS"                                                             /* Guidance where more than one solution attempt is shown. */
  | "METHOD_SELECTION"                                                              /* Guidance where particular methods affect credit. */
  | "CALCULATOR_MODE"                                                               /* Guidance on RAD, GRAD, or other calculator-mode errors. */
  | "ANNOTATION_CONVENTION"                                                        /* Records source marking-annotation conventions. */
  | "OTHER";                                                                        /* Any general rule outside the named groups. */

export type ExamGeneralMarkingRuleScope =                                           /* Records how widely a general rule applies. */
  | "POLICY"                                                                        /* The rule applies throughout this policy. */
  | "PAPER"                                                                         /* The rule applies to one linked paper. */
  | "QUESTION_GROUP"                                                                /* The rule applies to a named group of Questions. */
  | "QUESTION";                                                                     /* The rule applies to one named Question. */

// ============================================================================
// SECTION 2 — RULE EFFECT
// ============================================================================

export type ExamGeneralMarkingPenaltyLimit =                                        /* Records how often a penalty may be applied. */
  | "ONCE"                                                                          /* The penalty can be applied once in its stated scope. */
  | "PER_QUESTION"                                                                  /* The penalty can be applied once per Question. */
  | "PER_OCCURRENCE"                                                                /* The penalty can apply each time the error occurs. */
  | "NO_FIXED_LIMIT"                                                                /* The source gives no simple fixed limit. */
  | "NOT_A_PENALTY";                                                                /* The rule is guidance rather than a penalty. */

export type ExamGeneralMarkingRuleEffect = {                                        /* Opens the practical effect of one general rule. */
  penaltyLimit: ExamGeneralMarkingPenaltyLimit;                                     /* Records how often any penalty may apply. */
  maximumMarksLost: number | null;                                                  /* Records a fixed maximum loss when the source gives one. */
  notes: string[];                                                                  /* Stores short details that do not fit the simple fields. */
};                                                                                  /* Closes the rule effect. */

// ============================================================================
// SECTION 3 — GENERAL MARKING RULE
// ============================================================================

export type ExamGeneralMarkingRule = {                                              /* Opens one structured general marking rule. */
  id: string;                                                                       /* Gives the rule a stable ID within the policy. */
  category: ExamGeneralMarkingRuleCategory;                                         /* Records the main purpose of the rule. */
  scope: ExamGeneralMarkingRuleScope;                                               /* Records how widely the rule applies. */
  summary: string;                                                                  /* Gives a short plain-English description. */
  affectedPaperContextIds: ExamPaperContextId[];                                    /* Lists papers explicitly covered by the rule. */
  affectedQuestionIds: string[];                                                    /* Lists Questions explicitly covered by the rule. */
  effect: ExamGeneralMarkingRuleEffect;                                             /* Stores any penalty or practical effect. */
  sourceEvidence: ExamCatalogueEvidenceRef[];                                       /* Links the rule back to source guidance. */
};                                                                                  /* Closes the general marking rule. */

// ============================================================================
// SECTION 4 — SOURCE PRESENTATION
// ============================================================================

export type ExamGeneralMarkingPresentationProfile = {                               /* Opens source presentation details worth preserving. */
  annotationConventionNotes: string[];                                              /* Records useful source annotation conventions. */
  layoutNotes: string[];                                                            /* Records useful general layout observations. */
  sourceEvidence: ExamCatalogueEvidenceRef[];                                       /* Links the presentation details to the source. */
};                                                                                  /* Closes the source presentation profile. */

// ============================================================================
// SECTION 5 — POLICY IDENTITY
// ============================================================================

export type ExamGeneralMarkingPolicyIdentity = {                                    /* Opens the permanent identity of one marking policy. */
  id: ExamGeneralMarkingPolicyId;                                                   /* Gives the policy its stable ID. */
  schemaVersion: "CATALOGUE_V1";                                                    /* Records the catalogue contract version. */
  courseId: CourseId;                                                               /* Links the policy to its Course. */
  year: number;                                                                     /* Records the source year. */
  policyVersion: string;                                                            /* Records the source regime or policy version. */
  paperContextIds: ExamPaperContextId[];                                            /* Links every paper governed by this policy. */
};                                                                                  /* Closes the policy identity. */

// ============================================================================
// SECTION 6 — COMPLETE GENERAL MARKING POLICY ENTRY
// ============================================================================

export type ExamGeneralMarkingPolicyCatalogEntry = {                                /* Opens the universal General Marking Policy entry. */
  identity: ExamGeneralMarkingPolicyIdentity;                                       /* Stores permanent policy identity. */
  rules: ExamGeneralMarkingRule[];                                                  /* Stores all structured general marking rules. */
  presentation: ExamGeneralMarkingPresentationProfile;                              /* Stores source presentation conventions separately. */
  sourceEvidence: ExamCatalogueEvidenceRef[];                                       /* Links to the full general guidance used for review. */
  policyNotes: string[];                                                            /* Stores short policy-level observations. */
  review: ExamCatalogueReviewProfile;                                               /* Stores review state and unresolved issues. */
};                                                                                  /* Closes the General Marking Policy entry. */
