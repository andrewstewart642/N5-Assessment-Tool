// ============================================================================
// CATALOGUE CONTRACT V1 — CATALOGUE-WIDE TYPES
// ============================================================================

// ============================================================================
// SECTION 1 — SHARED IDS
// ============================================================================

export type ExamPaperContextId = string;                                             /* Gives each historical paper context a stable ID. */
export type ExamGeneralMarkingPolicyId = string;                                    /* Gives each general marking policy a stable ID. */
export type ExamCatalogueEvidenceId = string;                                       /* Gives each source reference a stable ID. */

// ============================================================================
// SECTION 2 — CATALOGUE VALUE STATES
// ============================================================================

export type ExamCatalogueValueState =                                               /* Lists the possible states of a catalogue field. */
  | "VALUE"                                                                         /* A reviewed value is known. */
  | "NOT_APPLICABLE"                                                                /* The field genuinely does not apply. */
  | "UNKNOWN"                                                                       /* The field matters but cannot be confirmed. */
  | "NOT_REVIEWED";                                                                 /* The field has not yet been reviewed. */

export type ExamCatalogueConfidence =                                               /* Records confidence in an analysed value. */
  | "HIGH"                                                                          /* The classification is strongly supported. */
  | "MEDIUM"                                                                        /* The classification is reasonable but not certain. */
  | "LOW";                                                                          /* The classification is tentative. */

// ============================================================================
// SECTION 3 — SOURCE AND PROVENANCE
// ============================================================================

export type ExamCatalogueProvenanceKind =                                           /* Says where catalogue knowledge came from. */
  | "SOURCE_FACT"                                                                   /* The source directly provides the fact. */
  | "CATALOGUE_CLASSIFICATION"                                                      /* We classified the source evidence. */
  | "GENERATION_ANALYSIS";                                                          /* We derived knowledge for future generation. */

export type ExamCatalogueEvidenceType =                                             /* Says which kind of source supplied the evidence. */
  | "QUESTION"                                                                      /* Evidence comes from a Question Paper. */
  | "MARKING_SCHEME"                                                                /* Evidence comes from a Marking Scheme. */
  | "GENERAL_MARKING_POLICY"                                                        /* Evidence comes from general marking guidance. */
  | "VISUAL";                                                                       /* Evidence comes from a visual in the source. */

export type ExamCatalogueEvidenceRef = {                                            /* Opens one traceable source reference. */
  id: ExamCatalogueEvidenceId;                                                      /* Gives the reference a stable ID. */
  evidenceType: ExamCatalogueEvidenceType;                                          /* Records the kind of source evidence. */
  documentId: string;                                                               /* Identifies the source document. */
  pdfPageNumbers: number[];                                                         /* Stores physical PDF page numbers. */
  printedPageLabels: string[];                                                      /* Stores printed page labels when useful. */
  questionLocator: string | null;                                                   /* Stores a Question or part label when relevant. */
  notes: string | null;                                                             /* Adds a short location note when useful. */
};                                                                                  /* Closes the source reference. */

export type ExamCatalogueProvenance = {                                             /* Opens the provenance record for a catalogue value. */
  kind: ExamCatalogueProvenanceKind;                                                /* Records whether the knowledge is source, analysis, or generation work. */
  evidence: ExamCatalogueEvidenceRef[];                                             /* Links the value to its supporting evidence. */
};                                                                                  /* Closes the provenance record. */

// ============================================================================
// SECTION 4 — CATALOGUE VALUE WRAPPER
// ============================================================================

export type ExamCatalogueKnownValue<T> = {                                          /* Opens a reviewed field with a known value. */
  state: "VALUE";                                                                   /* Confirms that a reviewed value is present. */
  value: T;                                                                         /* Stores the reviewed value. */
  reason: null;                                                                     /* Needs no missing-value reason. */
  confidence: ExamCatalogueConfidence | null;                                       /* Records confidence when judgement was needed. */
  provenance: ExamCatalogueProvenance;                                              /* Records where the value came from. */
};                                                                                  /* Closes the known-value form. */

export type ExamCatalogueNotApplicableValue = {                                     /* Opens a field that genuinely does not apply. */
  state: "NOT_APPLICABLE";                                                          /* Confirms that the field is irrelevant here. */
  value: null;                                                                      /* Stores no value. */
  reason: string | null;                                                            /* Can briefly explain why it does not apply. */
  confidence: null;                                                                 /* Needs no confidence score. */
  provenance: ExamCatalogueProvenance;                                              /* Records the basis for the decision. */
};                                                                                  /* Closes the not-applicable form. */

export type ExamCatalogueUnknownValue = {                                           /* Opens a field that cannot be confirmed. */
  state: "UNKNOWN";                                                                 /* Confirms that the field matters but is unknown. */
  value: null;                                                                      /* Prevents an unconfirmed value being stored. */
  reason: string;                                                                   /* Explains why the value cannot be confirmed. */
  confidence: null;                                                                 /* No chosen value needs a confidence score. */
  provenance: ExamCatalogueProvenance;                                              /* Records the evidence that was checked. */
};                                                                                  /* Closes the unknown form. */

export type ExamCatalogueNotReviewedValue = {                                       /* Opens a temporary field awaiting review. */
  state: "NOT_REVIEWED";                                                            /* Marks the field as not yet reviewed. */
  value: null;                                                                      /* Stores no value before review. */
  reason: null;                                                                     /* Stores no reason before review. */
  confidence: null;                                                                 /* Stores no confidence before review. */
  provenance: ExamCatalogueProvenance;                                              /* Records the current source context. */
};                                                                                  /* Closes the unreviewed form. */

export type ExamCatalogueValue<T> =                                                 /* Gives every reviewable field an explicit state. */
  | ExamCatalogueKnownValue<T>                                                      /* Allows a reviewed known value. */
  | ExamCatalogueNotApplicableValue                                                 /* Allows a genuine not-applicable value. */
  | ExamCatalogueUnknownValue                                                       /* Allows an evidence-limited unknown value. */
  | ExamCatalogueNotReviewedValue;                                                  /* Allows a temporary unreviewed value. */

// ============================================================================
// SECTION 5 — REVIEW STATUS
// ============================================================================

export type ExamCatalogueReviewStatus =                                             /* Records the review stage of a catalogue entry. */
  | "DRAFT"                                                                         /* The entry is still being built. */
  | "CATALOGUED"                                                                    /* The first catalogue pass is complete. */
  | "REVIEWED"                                                                      /* A later review has been completed. */
  | "APPROVED"                                                                      /* The entry is approved for normal use. */
  | "DEPRECATED";                                                                   /* The entry remains only for historical compatibility. */

export type ExamCatalogueReviewProfile = {                                          /* Opens the common review record. */
  status: ExamCatalogueReviewStatus;                                                /* Records the current review stage. */
  reviewedBy: string | null;                                                        /* Records the reviewer when available. */
  reviewedAt: string | null;                                                        /* Records the review date in ISO format when available. */
  unresolvedIssues: string[];                                                       /* Lists points that still need attention. */
  catalogueNotes: string[];                                                         /* Stores short internal catalogue notes. */
};                                                                                  /* Closes the common review record. */
