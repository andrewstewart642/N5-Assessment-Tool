// ============================================================================
// 2025 PAPER 2 — PAPER CONTEXT CATALOGUE ENTRY
// ============================================================================

import type { ExamPaperContextCatalogEntry } from "../ExamPaperContextTypes";                  /* Uses the universal Paper Context contract. */

// ============================================================================
// SECTION 1 — PAPER CONTEXT ENTRY
// ============================================================================

export const national5Maths2025Paper2Context = {                                                /* Opens the complete 2025 Paper 2 context entry. */

  identity: {                                                                                    /* Opens the permanent paper identity. */
    id: "N5_MATH_2025_P2",                                                                       /* Gives this paper context its stable catalogue ID. */
    schemaVersion: "CATALOGUE_V1",                                                               /* Records the catalogue contract version. */
    courseId: "N5_MATH",                                                                         /* Links the paper to National 5 Mathematics. */
    year: 2025,                                                                                  /* Records the source assessment year. */
    assessmentSeries: null,                                                                      /* No separate source series needs recorded here. */
    paper: "P2",                                                                                 /* Records that this is Paper 2. */
  },                                                                                             /* Closes the permanent paper identity. */

  conditions: {                                                                                  /* Opens the conditions applying across the paper. */
    sourceKind: "STANDARD_EXAM",                                                                 /* Records this as a standard examination paper. */
    calculatorPolicy: "PERMITTED",                                                               /* Records that candidates may use a calculator. */
    durationMinutes: 90,                                                                         /* Records the 10:30 AM to 12:00 noon sitting length. */
    totalMarks: 50,                                                                              /* Records the total marks available on the paper. */
    numberedQuestionCount: 15,                                                                   /* Records the fifteen numbered Questions on Paper 2. */

    formulaList: {                                                                               /* Opens the formula-list context. */
      provided: true,                                                                            /* Records that the paper supplies a formula list. */
      profileId: null,                                                                           /* A canonical formula-list profile has not yet been assigned. */
      sourceEvidence: [                                                                          /* Opens the source evidence for the formula list. */
        {                                                                                        /* Opens the formula-list source reference. */
          id: "N5_MATH_2025_P2_QP_FORMULAE",                                                     /* Gives this source reference a stable ID. */
          evidenceType: "QUESTION",                                                              /* Records that the evidence comes from the Question Paper. */
          documentId: "N5_MATH_2025_QUESTION_PAPER",                                             /* Identifies the combined 2025 Question Paper source. */
          pdfPageNumbers: [15],                                                                  /* Points to physical PDF page 15. */
          printedPageLabels: ["02"],                                                             /* Records the printed page label. */
          questionLocator: null,                                                                 /* This evidence applies to the whole paper. */
          notes: "Paper 2 formula list.",                                                        /* Briefly describes the source location. */
        },                                                                                       /* Closes the formula-list source reference. */
      ],                                                                                         /* Closes the source evidence for the formula list. */
    },                                                                                           /* Closes the formula-list context. */
  },                                                                                             /* Closes the paper conditions. */

  generalMarkingPolicyId: "N5_MATH_2025_GENERAL_MARKING_POLICY",                                 /* Links the paper to its 2025 general marking policy. */

  sourceDocuments: {                                                                             /* Opens the source-document links. */
    questionPaper: [                                                                             /* Opens the Question Paper source references. */
      {                                                                                          /* Opens the Paper 2 cover reference. */
        id: "N5_MATH_2025_P2_QP_COVER",                                                          /* Gives this source reference a stable ID. */
        evidenceType: "QUESTION",                                                                /* Records that the evidence comes from the Question Paper. */
        documentId: "N5_MATH_2025_QUESTION_PAPER",                                               /* Identifies the combined 2025 Question Paper source. */
        pdfPageNumbers: [14],                                                                    /* Points to the physical PDF page where Paper 2 begins. */
        printedPageLabels: [],                                                                   /* The cover does not need a printed page label here. */
        questionLocator: null,                                                                   /* This evidence applies to the whole paper. */
        notes: "Paper 2 cover and candidate instructions.",                                      /* Briefly describes the source location. */
      },                                                                                         /* Closes the Paper 2 cover reference. */
      {                                                                                          /* Opens the formula-list document reference. */
        id: "N5_MATH_2025_P2_QP_FORMULAE",                                                       /* Reuses the formula-list evidence ID. */
        evidenceType: "QUESTION",                                                                /* Records that the evidence comes from the Question Paper. */
        documentId: "N5_MATH_2025_QUESTION_PAPER",                                               /* Identifies the combined 2025 Question Paper source. */
        pdfPageNumbers: [15],                                                                    /* Points to physical PDF page 15. */
        printedPageLabels: ["02"],                                                               /* Records the printed page label. */
        questionLocator: null,                                                                   /* This evidence applies to the whole paper. */
        notes: "Paper 2 formula list.",                                                          /* Briefly describes the source location. */
      },                                                                                         /* Closes the formula-list document reference. */
    ],                                                                                           /* Closes the Question Paper source references. */

    markingScheme: [                                                                             /* Opens the Marking Scheme source references. */
      {                                                                                          /* Opens the Paper 2 Marking Scheme reference. */
        id: "N5_MATH_2025_P2_MS_COVER",                                                          /* Gives this source reference a stable ID. */
        evidenceType: "MARKING_SCHEME",                                                          /* Records that the evidence comes from the Marking Scheme. */
        documentId: "N5_MATH_2025_MARKING_SCHEME",                                               /* Identifies the combined 2025 Marking Scheme source. */
        pdfPageNumbers: [23],                                                                    /* Points to the physical PDF page where Paper 2 marking begins. */
        printedPageLabels: [],                                                                   /* The title page does not need a printed page label here. */
        questionLocator: null,                                                                   /* This evidence applies to the whole paper. */
        notes: "Paper 2 finalised marking instructions title page.",                             /* Briefly describes the source location. */
      },                                                                                         /* Closes the Paper 2 Marking Scheme reference. */
    ],                                                                                           /* Closes the Marking Scheme source references. */
  },                                                                                             /* Closes the source-document links. */

  paperNotes: [                                                                                  /* Opens short paper-level observations. */
    "The source sitting ran from 10:30 AM to 12:00 noon on 14 May 2025.",                         /* Preserves the source sitting information. */
    "The formula-list profile ID can be added once formula-list versions are catalogued.",       /* Records the only current paper-context follow-up. */
  ],                                                                                             /* Closes short paper-level observations. */

  review: {                                                                                      /* Opens the catalogue review record. */
    status: "CATALOGUED",                                                                        /* Records that the first Paper Context pass is complete. */
    reviewedBy: null,                                                                            /* No named human reviewer has yet approved this entry. */
    reviewedAt: null,                                                                            /* No formal review date has yet been recorded. */
    unresolvedIssues: [                                                                          /* Opens remaining review points. */
      "Assign a formula-list profile ID when formula-list versions are catalogued.",             /* Records the outstanding formula-list linkage. */
    ],                                                                                           /* Closes remaining review points. */
    catalogueNotes: [],                                                                          /* No additional internal notes are needed. */
  },                                                                                             /* Closes the catalogue review record. */

} satisfies ExamPaperContextCatalogEntry;                                                        /* Checks this entry against the universal Paper Context contract. */
