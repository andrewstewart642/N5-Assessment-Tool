// ============================================================================
// 2025 PAPER 2 QUESTION 14 — MARKING SCHEME CATALOGUE ENTRY
// ============================================================================

import type {                                                                                      /* Opens catalogue-wide imports. */
  ExamCatalogueConfidence,                                                                        /* Reuses catalogue confidence levels. */
  ExamCatalogueEvidenceRef,                                                                       /* Reuses traceable source references. */
  ExamCatalogueProvenance,                                                                        /* Reuses source and generation provenance. */
  ExamCatalogueValue,                                                                             /* Reuses explicit catalogue value states. */
} from "../../../ExamCatalogTypes";                                                               /* Closes catalogue-wide imports. */
import type { ExamMarkingSchemeCatalogEntry } from "../../ExamMarkingSchemeTypes";                 /* Uses the universal Marking Scheme contract. */

// ============================================================================
// SECTION 1 — SOURCE EVIDENCE
// ============================================================================

const markingSchemeEvidence: ExamCatalogueEvidenceRef = {                                         /* Opens the Question-specific MS source reference. */
  id: "N5_MATH_2025_P2_Q14_MS",                                                                   /* Gives this source reference its stable ID. */
  evidenceType: "MARKING_SCHEME",                                                                 /* Records that this evidence comes from the Marking Scheme. */
  documentId: "N5_MATH_2025_MARKING_SCHEME",                                                      /* Identifies the combined 2025 Marking Scheme source. */
  pdfPageNumbers: [44],                                                                            /* Points to physical PDF page 44. */
  printedPageLabels: ["22"],                                                                       /* Records the printed Paper 2 marking page label. */
  questionLocator: "14",                                                                           /* Points directly to Question 14 marking guidance. */
  notes: "Paper 2 Question 14 detailed marking guidance.",                                        /* Keeps the source locator short and clear. */
};                                                                                                 /* Closes the Question-specific MS source reference. */

const generalPolicyEvidence: ExamCatalogueEvidenceRef = {                                         /* Opens the 2025 general-policy source reference. */
  id: "N5_MATH_2025_GENERAL_MARKING_POLICY_SOURCE",                                                /* Gives the general-policy source a stable ID. */
  evidenceType: "GENERAL_MARKING_POLICY",                                                         /* Records that this is general marking guidance. */
  documentId: "N5_MATH_2025_MARKING_SCHEME",                                                      /* Identifies the combined 2025 Marking Scheme source. */
  pdfPageNumbers: [2, 3, 4, 5],                                                                    /* Points to the physical pages containing general principles. */
  printedPageLabels: ["02", "03", "04", "05"],                                                    /* Records the printed page labels. */
  questionLocator: null,                                                                           /* General policy is not tied to one Question. */
  notes: "2025 general marking principles and MFI annotation note.",                              /* Summarises the policy evidence. */
};                                                                                                 /* Closes the 2025 general-policy source reference. */

// ============================================================================
// SECTION 2 — PROVENANCE HELPERS
// ============================================================================

const catalogueProvenance: ExamCatalogueProvenance = {                                            /* Opens provenance for catalogue analysis. */
  kind: "CATALOGUE_CLASSIFICATION",                                                                /* Marks these values as our structured interpretation. */
  evidence: [markingSchemeEvidence],                                                               /* Grounds the analysis in the detailed source MS. */
};                                                                                                 /* Closes catalogue-analysis provenance. */

const generationProvenance: ExamCatalogueProvenance = {                                           /* Opens provenance for generator-facing knowledge. */
  kind: "GENERATION_ANALYSIS",                                                                     /* Marks this section as derived generation analysis. */
  evidence: [markingSchemeEvidence, generalPolicyEvidence],                                       /* Grounds generation logic in detailed and general marking evidence. */
};                                                                                                 /* Closes generator-facing provenance. */

const catalogueValue = <T>(                                                                        /* Opens a helper for reviewed catalogue values. */
  value: T,                                                                                        /* Receives the reviewed value. */
  confidence: ExamCatalogueConfidence = "HIGH",                                                    /* Uses high confidence unless stated otherwise. */
): ExamCatalogueValue<T> => ({                                                                     /* Returns the universal catalogue wrapper. */
  state: "VALUE",                                                                                  /* Confirms that a reviewed value is present. */
  value,                                                                                            /* Stores the supplied value. */
  reason: null,                                                                                    /* Needs no missing-value reason. */
  confidence,                                                                                      /* Stores the chosen confidence level. */
  provenance: catalogueProvenance,                                                                 /* Marks the value as catalogue analysis. */
});                                                                                                 /* Closes the reviewed-value helper. */

// ============================================================================
// SECTION 3 — MARK IDS
// ============================================================================

const M1 = "N5_MATH_2025_P2_Q14_M1";                                                              /* Identifies the target-height substitution mark. */
const M2 = "N5_MATH_2025_P2_Q14_M2";                                                              /* Identifies the rearrangement mark. */
const M3 = "N5_MATH_2025_P2_Q14_M3";                                                              /* Identifies the first valid angle mark. */
const M4 = "N5_MATH_2025_P2_Q14_M4";                                                              /* Identifies the second valid angle mark. */
const METHOD = "TRIG_CONTEXTUAL_COSINE_EQUATION_STANDARD";                                        /* Identifies the normal full-credit solution route. */

// ============================================================================
// SECTION 4 — COMPLETE MARKING SCHEME CATALOGUE ENTRY
// ============================================================================

export const national5Maths2025P2Q14MS = {                                                        /* Opens the complete Question 14 MS entry. */

  identity: {                                                                                      /* Opens permanent MS identity. */
    id: "N5_MATH_2025_P2_Q14_MS",                                                                 /* Gives this MS its stable catalogue ID. */
    schemaVersion: "CATALOGUE_V1",                                                                 /* Records the catalogue contract version. */
    sourceQuestionId: "N5_MATH_2025_P2_Q14",                                                      /* Links directly to the matching Question entry. */
    courseId: "N5_MATH",                                                                           /* Links the MS to National 5 Mathematics. */
    paperContextId: "N5_MATH_2025_P2",                                                             /* Links to the shared 2025 Paper 2 context. */
    year: 2025,                                                                                    /* Records the source year. */
    paper: "P2",                                                                                   /* Records the source paper. */
    questionNumber: "14",                                                                          /* Records the printed Question number. */
    questionFamilyId: "TRIG_CONTEXTUAL_PERIODIC_MODEL_EQUATION",                                  /* Matches the Question's structural family. */
  },                                                                                               /* Closes permanent MS identity. */

  sourceContext: {                                                                                 /* Opens Question-specific source marking context. */
    totalMarks: 4,                                                                                 /* Records the four available marks. */
    sourcePages: [44],                                                                             /* Records the physical PDF page containing the marking guidance. */
    sourceEvidence: [markingSchemeEvidence],                                                       /* Links directly to the Question-specific source MS. */
  },                                                                                               /* Closes Question-specific source marking context. */

  expectedResponse: {                                                                              /* Opens accepted final-response requirements. */
    responseTypes: ["NUMBER"],                                                                     /* Records that the response consists of numerical angle values. */
    canonicalAnswer: {                                                                             /* Opens the main normalised answer form. */
      id: "Q14_EXPECTED_ANGLES_DECIMAL",                                                           /* Gives this answer form a stable local ID. */
      normalisedAnswer: "x ≈ 112.024° and x ≈ 247.976°",                                          /* Stores the two calculated degree solutions. */
      numericValue: null,                                                                          /* Two numbers cannot be represented by one numeric field. */
      answerForm: "NUMBER",                                                                        /* Records both final items as numerical answers. */
      notes: "Equivalent sensible rounding is accepted.",                                         /* Records the source's flexible numerical presentation. */
    },                                                                                             /* Closes the main normalised answer form. */
    acceptedEquivalentForms: [                                                                     /* Opens materially useful accepted variants. */
      {                                                                                            /* Opens the whole-degree form. */
        id: "Q14_EXPECTED_ANGLES_WHOLE_DEGREES",                                                   /* Gives this answer form a stable local ID. */
        normalisedAnswer: "x = 112° and x = 248°",                                                 /* Stores the accepted whole-degree values. */
        numericValue: null,                                                                        /* Two numbers cannot use one numeric field. */
        answerForm: "NUMBER",                                                                      /* Records the values as numerical answers. */
        notes: "Whole-degree answers remain acceptable.",                                         /* Records the accepted rounded form. */
      },                                                                                           /* Closes the whole-degree form. */
      {                                                                                            /* Opens the source-style mixed precision form. */
        id: "Q14_EXPECTED_ANGLES_SOURCE_PRECISION",                                                /* Gives this answer form a stable local ID. */
        normalisedAnswer: "x ≈ 112.024° and x ≈ 247.97°",                                         /* Stores another accepted decimal presentation. */
        numericValue: null,                                                                        /* Two numbers cannot use one numeric field. */
        answerForm: "NUMBER",                                                                      /* Records the values as numerical answers. */
        notes: "Represents the precision shown in the source illustrative scheme.",                /* Explains why this variant is retained. */
      },                                                                                           /* Closes the source-style mixed precision form. */
    ],                                                                                             /* Closes materially useful accepted variants. */
    precisionType: "NONE",                                                                         /* The Question gives no fixed rounding instruction. */
    precisionValue: null,                                                                          /* No required number of decimal places or significant figures exists. */
    acceptedRange: null,                                                                           /* No single numeric tolerance range can represent the pair of answers. */
    units: {                                                                                       /* Opens unit treatment. */
      dimension: "angle",                                                                          /* Records the physical quantity type. */
      unitSymbol: "°",                                                                              /* Records degrees as the intended angle unit. */
      conversionRequired: false,                                                                   /* No unit conversion is required. */
      unitsExplicitlyRequested: false,                                                             /* The Question defines x in degrees but does not separately demand a unit statement. */
    },                                                                                             /* Closes unit treatment. */
    requiredContextStatement: false,                                                               /* No prose statement about the ride is needed. */
    answerCountRequired: 2,                                                                        /* Records that two final angles are required. */
    invalidRelatedValues: ["68°", "292°"],                                                        /* Records plausible but invalid related-angle values. */
  },                                                                                               /* Closes accepted final-response requirements. */

  markNodes: [                                                                                     /* Opens the four individual Mark Nodes. */
    {                                                                                              /* Opens Mark 1. */
      id: M1,                                                                                      /* Gives Mark 1 its stable ID. */
      markNumber: 1,                                                                               /* Records its source order. */
      markValue: 1,                                                                                /* Records that this node is worth one mark. */
      questionPartId: "N5_MATH_2025_P2_Q14_MAIN",                                                 /* Links the mark to the single Question response unit. */
      primaryType: "PROCESS",                                                                      /* Rewards setting up the model at the required target. */
      secondaryTypes: ["INTERPRETATION"],                                                          /* Also reflects interpreting the target height correctly. */
      genericPurpose: "Set the target height in the supplied cosine model.",                      /* Paraphrases what earns the mark. */
      skillIds: ["trig-t02-equations"],                                                           /* Links the mark to trig-equation work. */
      conceptIds: ["trig-t2-2"],                                                                  /* Links the mark to the canonical trig-equations Concept. */
      requiredEvidence: [                                                                          /* Opens acceptable evidence for Mark 1. */
        {                                                                                          /* Opens the main evidence condition. */
          id: "Q14_M1_EVIDENCE_TARGET_SUBSTITUTION",                                               /* Gives the evidence condition a stable local ID. */
          evidenceSummary: "The supplied model is written with the target height set to 13.",     /* Describes sufficient evidence in plain language. */
          acceptedLocations: ["WORKING"],                                                          /* Requires evidence in the mathematical working. */
          mayBeImpliedByLaterWork: false,                                                          /* A later angle alone does not prove this substitution. */
          sourceEvidence: [markingSchemeEvidence],                                                 /* Links the condition to the detailed MS. */
        },                                                                                         /* Closes the main evidence condition. */
      ],                                                                                           /* Closes acceptable evidence for Mark 1. */
      dependencies: [],                                                                            /* Mark 1 has no earlier mark dependency. */
      followThrough: {                                                                             /* Opens follow-through behaviour for Mark 1. */
        allowed: false,                                                                            /* There is no earlier error to follow through from. */
        fromMarkIds: [],                                                                           /* No earlier marks feed into Mark 1. */
        requiresComparableDifficulty: false,                                                       /* Comparable-difficulty checking is not needed here. */
        blockedForRequiredResult: false,                                                           /* This is not a stated-result Question. */
        blockedByInvalidMathematicalState: false,                                                  /* No earlier invalid state can block this mark. */
        notes: null,                                                                               /* No special follow-through note is needed. */
      },                                                                                           /* Closes follow-through behaviour for Mark 1. */
      eligibilityConditions: [],                                                                   /* No special eligibility gate applies. */
      blockingConditions: [],                                                                      /* No Question-specific blocking rule applies. */
      methodFamilyIds: [METHOD],                                                                   /* Links Mark 1 to the normal solution route. */
      presentationConditions: [],                                                                  /* No special presentation condition controls this mark. */
      sourceEvidence: [markingSchemeEvidence],                                                     /* Links Mark 1 directly to the source MS. */
      confidence: "HIGH",                                                                          /* The source defines this mark clearly. */
    },                                                                                             /* Closes Mark 1. */

    {                                                                                              /* Opens Mark 2. */
      id: M2,                                                                                      /* Gives Mark 2 its stable ID. */
      markNumber: 2,                                                                               /* Records its source order. */
      markValue: 1,                                                                                /* Records that this node is worth one mark. */
      questionPartId: "N5_MATH_2025_P2_Q14_MAIN",                                                 /* Links the mark to the single Question response unit. */
      primaryType: "PROCESS",                                                                      /* Rewards correctly isolating the cosine expression. */
      secondaryTypes: [],                                                                          /* No second mark purpose is needed. */
      genericPurpose: "Rearrange the model to isolate cosine.",                                   /* Paraphrases what earns the mark. */
      skillIds: ["trig-t02-equations"],                                                           /* Links the mark to trig-equation work. */
      conceptIds: ["trig-t2-2"],                                                                  /* Links the mark to the canonical trig-equations Concept. */
      requiredEvidence: [                                                                          /* Opens acceptable evidence for Mark 2. */
        {                                                                                          /* Opens the main rearrangement condition. */
          id: "Q14_M2_EVIDENCE_ISOLATED_COSINE",                                                   /* Gives the evidence condition a stable local ID. */
          evidenceSummary: "The equation is rearranged to a valid isolated cosine value.",        /* Describes sufficient evidence without copying source wording. */
          acceptedLocations: ["WORKING"],                                                          /* Requires mathematical process evidence. */
          mayBeImpliedByLaterWork: true,                                                           /* A valid inverse-cosine calculation can imply the isolated value. */
          sourceEvidence: [markingSchemeEvidence],                                                 /* Links the condition to the detailed MS. */
        },                                                                                         /* Closes the main rearrangement condition. */
      ],                                                                                           /* Closes acceptable evidence for Mark 2. */
      dependencies: [                                                                              /* Opens Mark 2 dependencies. */
        {                                                                                          /* Opens consistency with the model setup. */
          type: "CONSISTENT_WITH_EARLIER_RESULT",                                                  /* Allows consistent continuation from the candidate's setup. */
          relatedMarkIds: [M1],                                                                    /* Links the dependency to Mark 1. */
          conditionSummary: "Rearrangement must be mathematically consistent with the equation being used.", /* States the consistency requirement. */
        },                                                                                         /* Closes consistency with the model setup. */
      ],                                                                                           /* Closes Mark 2 dependencies. */
      followThrough: {                                                                             /* Opens follow-through behaviour for Mark 2. */
        allowed: true,                                                                             /* A consistent rearrangement may survive an earlier setup error. */
        fromMarkIds: [M1],                                                                         /* Follow-through may arise from the equation established at Mark 1. */
        requiresComparableDifficulty: true,                                                        /* Later work must retain comparable algebraic demand. */
        blockedForRequiredResult: false,                                                           /* This is not a stated-result Question. */
        blockedByInvalidMathematicalState: false,                                                  /* A valid rearrangement can still be assessed where mathematically meaningful. */
        notes: "Normal positive-marking principles apply to a consistent rearrangement.",         /* Summarises the follow-through position. */
      },                                                                                           /* Closes follow-through behaviour for Mark 2. */
      eligibilityConditions: [],                                                                   /* No extra eligibility gate applies to the rearrangement itself. */
      blockingConditions: [],                                                                      /* No special blocking rule is needed here. */
      methodFamilyIds: [METHOD],                                                                   /* Links Mark 2 to the normal solution route. */
      presentationConditions: [],                                                                  /* No special presentation condition controls this mark. */
      sourceEvidence: [markingSchemeEvidence],                                                     /* Links Mark 2 directly to the source MS. */
      confidence: "HIGH",                                                                          /* The source defines this mark clearly. */
    },                                                                                             /* Closes Mark 2. */

    {                                                                                              /* Opens Mark 3. */
      id: M3,                                                                                      /* Gives Mark 3 its stable ID. */
      markNumber: 3,                                                                               /* Records its source order. */
      markValue: 1,                                                                                /* Records that this node is worth one mark. */
      questionPartId: "N5_MATH_2025_P2_Q14_MAIN",                                                 /* Links the mark to the single Question response unit. */
      primaryType: "ACCURACY",                                                                     /* Rewards one valid angle obtained trigonometrically. */
      secondaryTypes: ["SELECTION"],                                                               /* Also requires a valid quadrant choice. */
      genericPurpose: "Obtain one valid angle using a valid trigonometric calculation.",          /* Paraphrases the source mark purpose. */
      skillIds: ["trig-t02-equations", "trig-t02-related-angles"],                                /* Links the mark to equation solving and quadrant reasoning. */
      conceptIds: ["trig-t2-2", "trig-t2-1"],                                                     /* Links the matching canonical Concepts. */
      requiredEvidence: [                                                                          /* Opens acceptable evidence for Mark 3. */
        {                                                                                          /* Opens the valid-angle evidence condition. */
          id: "Q14_M3_EVIDENCE_FIRST_VALID_ANGLE",                                                 /* Gives the evidence condition a stable local ID. */
          evidenceSummary: "A valid trigonometric calculation produces one angle consistent with the trig value and domain.", /* Describes sufficient evidence. */
          acceptedLocations: ["WORKING", "FINAL_ANSWER"],                                          /* Allows the calculation and final value to provide the evidence. */
          mayBeImpliedByLaterWork: false,                                                          /* The second angle does not automatically prove the first-angle work. */
          sourceEvidence: [markingSchemeEvidence],                                                 /* Links the condition to the detailed MS. */
        },                                                                                         /* Closes the valid-angle evidence condition. */
      ],                                                                                           /* Closes acceptable evidence for Mark 3. */
      dependencies: [                                                                              /* Opens Mark 3 dependencies. */
        {                                                                                          /* Opens the valid-method dependency. */
          type: "REQUIRES_VALID_METHOD",                                                           /* The angle mark exists only inside a valid trig calculation. */
          relatedMarkIds: [M2],                                                                    /* Links the dependency to the isolated trig value. */
          conditionSummary: "The calculation must use a trig value strictly between -1 and 1.",  /* States the source eligibility condition. */
        },                                                                                         /* Closes the valid-method dependency. */
      ],                                                                                           /* Closes Mark 3 dependencies. */
      followThrough: {                                                                             /* Opens follow-through behaviour for Mark 3. */
        allowed: true,                                                                             /* Some earlier errors can still lead to a valid first-angle mark. */
        fromMarkIds: [M1, M2],                                                                     /* Earlier model or rearrangement errors may feed into this stage. */
        requiresComparableDifficulty: true,                                                        /* The resulting angle work must remain comparably demanding. */
        blockedForRequiredResult: false,                                                           /* This is not a stated-result Question. */
        blockedByInvalidMathematicalState: true,                                                   /* Invalid trig values outside the allowed range block this mark. */
        notes: "A positive cosine value blocks this mark because the first-angle work is then eased.", /* Records the source's special difficulty rule. */
      },                                                                                           /* Closes follow-through behaviour for Mark 3. */
      eligibilityConditions: [                                                                     /* Opens Mark 3 eligibility conditions. */
        "Angles must come from a valid trigonometric calculation.",                                /* Requires genuine trig processing rather than guess-and-check. */
        "The isolated cosine value must lie strictly between -1 and 1.",                           /* Requires a valid inverse-cosine input. */
        "For a negative cosine value, the credited angle must be consistent with quadrant II or III.", /* Preserves the required quadrant structure. */
      ],                                                                                           /* Closes Mark 3 eligibility conditions. */
      blockingConditions: [                                                                        /* Opens Mark 3 blocking conditions. */
        "A positive isolated cosine value makes this mark unavailable because the working is eased.", /* Records the special source rule. */
      ],                                                                                           /* Closes Mark 3 blocking conditions. */
      methodFamilyIds: [METHOD],                                                                   /* Links Mark 3 to the normal solution route. */
      presentationConditions: ["Degree symbol is not required."],                                  /* Records the explicit source presentation rule. */
      sourceEvidence: [markingSchemeEvidence],                                                     /* Links Mark 3 directly to the source MS. */
      confidence: "HIGH",                                                                          /* The detailed notes define this mark unusually clearly. */
    },                                                                                             /* Closes Mark 3. */

    {                                                                                              /* Opens Mark 4. */
      id: M4,                                                                                      /* Gives Mark 4 its stable ID. */
      markNumber: 4,                                                                               /* Records its source order. */
      markValue: 1,                                                                                /* Records that this node is worth one mark. */
      questionPartId: "N5_MATH_2025_P2_Q14_MAIN",                                                 /* Links the mark to the single Question response unit. */
      primaryType: "ACCURACY",                                                                     /* Rewards the second valid angle. */
      secondaryTypes: ["SELECTION"],                                                               /* Also rewards selecting a consistent second solution. */
      genericPurpose: "Obtain the second valid angle consistent with the trig value.",            /* Paraphrases the source mark purpose. */
      skillIds: ["trig-t02-related-angles"],                                                       /* Links this mark primarily to related-angle reasoning. */
      conceptIds: ["trig-t2-1"],                                                                  /* Links the mark to the canonical related-angles Concept. */
      requiredEvidence: [                                                                          /* Opens acceptable evidence for Mark 4. */
        {                                                                                          /* Opens the second-angle evidence condition. */
          id: "Q14_M4_EVIDENCE_SECOND_VALID_ANGLE",                                                /* Gives the evidence condition a stable local ID. */
          evidenceSummary: "A second angle is stated that is consistent with the trig value and required quadrant structure.", /* Describes sufficient evidence. */
          acceptedLocations: ["WORKING", "FINAL_ANSWER"],                                          /* Allows either working or the final response to establish the value. */
          mayBeImpliedByLaterWork: false,                                                          /* There is no later mathematical stage. */
          sourceEvidence: [markingSchemeEvidence],                                                 /* Links the condition to the detailed MS. */
        },                                                                                         /* Closes the second-angle evidence condition. */
      ],                                                                                           /* Closes acceptable evidence for Mark 4. */
      dependencies: [                                                                              /* Opens Mark 4 dependencies. */
        {                                                                                          /* Opens the valid-method dependency. */
          type: "REQUIRES_VALID_METHOD",                                                           /* The second angle must arise from valid trig reasoning. */
          relatedMarkIds: [M2],                                                                    /* Links the dependency to the isolated trig value. */
          conditionSummary: "The trig value must be mathematically valid and the second angle must be consistent with it.", /* States the dependency clearly. */
        },                                                                                         /* Closes the valid-method dependency. */
      ],                                                                                           /* Closes Mark 4 dependencies. */
      followThrough: {                                                                             /* Opens follow-through behaviour for Mark 4. */
        allowed: true,                                                                             /* The source explicitly allows this mark after some earlier errors. */
        fromMarkIds: [M1, M2, M3],                                                                 /* The final angle can survive failures at earlier nodes. */
        requiresComparableDifficulty: true,                                                        /* The candidate must still perform genuine related-angle reasoning. */
        blockedForRequiredResult: false,                                                           /* This is not a stated-result Question. */
        blockedByInvalidMathematicalState: true,                                                   /* Invalid trig values still block meaningful follow-through. */
        notes: "With a positive cosine error, a consistent fourth-quadrant second angle can still earn this mark.", /* Records the key source exception. */
      },                                                                                           /* Closes follow-through behaviour for Mark 4. */
      eligibilityConditions: [                                                                     /* Opens Mark 4 eligibility conditions. */
        "The angle must be consistent with a valid trigonometric calculation.",                    /* Requires genuine trig work rather than guess-and-check. */
        "The isolated cosine value must lie strictly between -1 and 1.",                           /* Requires a valid inverse-cosine input. */
        "For negative cosine, the second credited solution must complete the quadrant II and III pair.", /* Preserves the intended negative-cosine structure. */
        "For positive cosine follow-through, the credited second solution must be a consistent quadrant IV angle.", /* Preserves the source FT exception. */
      ],                                                                                           /* Closes Mark 4 eligibility conditions. */
      blockingConditions: [                                                                        /* Opens Mark 4 blocking conditions. */
        "Including 68 degrees clearly as an additional final answer makes this mark unavailable.", /* Records the explicit extra-answer rule. */
      ],                                                                                           /* Closes Mark 4 blocking conditions. */
      methodFamilyIds: [METHOD],                                                                   /* Links Mark 4 to the normal solution route. */
      presentationConditions: ["Degree symbol is not required."],                                  /* Records the explicit source presentation rule. */
      sourceEvidence: [markingSchemeEvidence],                                                     /* Links Mark 4 directly to the source MS. */
      confidence: "HIGH",                                                                          /* The source gives detailed eligibility examples for this mark. */
    },                                                                                             /* Closes Mark 4. */
  ],                                                                                               /* Closes the four individual Mark Nodes. */

  methodPathways: [                                                                                /* Opens valid solution pathways. */
    {                                                                                              /* Opens the primary cosine-equation method. */
      id: METHOD,                                                                                  /* Gives the method its stable ID. */
      variantId: "COS_NEGATIVE_TWO_SOLUTIONS",                                                     /* Records the source-specific negative-cosine route. */
      evidenceRole: "PRIMARY_ILLUSTRATIVE",                                                        /* Records this as the main illustrated method. */
      supportsFullCredit: true,                                                                    /* Confirms that this route can earn all four marks. */
      applicabilityConditions: [                                                                   /* Opens method applicability conditions. */
        "Use the supplied cosine height model.",                                                   /* Keeps the route tied to the model in the Question. */
        "Solve using degree-mode trigonometry over one rotation.",                                 /* Preserves the intended calculator and domain setting. */
      ],                                                                                           /* Closes method applicability conditions. */
      steps: [                                                                                     /* Opens the ordered method steps. */
        {                                                                                          /* Opens Step 1. */
          id: "Q14_METHOD_STEP_1",                                                                 /* Gives the step a stable local ID. */
          order: 1,                                                                                /* Records the first step. */
          subgoal: "Set the model height equal to the required target.",                           /* Describes the first mathematical subgoal. */
          linkedMarkIds: [M1],                                                                     /* Links the step to Mark 1. */
          dependsOnStepIds: [],                                                                    /* The first step has no earlier dependency. */
        },                                                                                         /* Closes Step 1. */
        {                                                                                          /* Opens Step 2. */
          id: "Q14_METHOD_STEP_2",                                                                 /* Gives the step a stable local ID. */
          order: 2,                                                                                /* Records the second step. */
          subgoal: "Rearrange to isolate cosine as -3/8.",                                         /* Describes the second mathematical subgoal. */
          linkedMarkIds: [M2],                                                                     /* Links the step to Mark 2. */
          dependsOnStepIds: ["Q14_METHOD_STEP_1"],                                                 /* Requires the target-height equation. */
        },                                                                                         /* Closes Step 2. */
        {                                                                                          /* Opens Step 3. */
          id: "Q14_METHOD_STEP_3",                                                                 /* Gives the step a stable local ID. */
          order: 3,                                                                                /* Records the third step. */
          subgoal: "Use inverse cosine to obtain a valid quadrant II angle.",                      /* Describes the first angle calculation. */
          linkedMarkIds: [M3],                                                                     /* Links the step to Mark 3. */
          dependsOnStepIds: ["Q14_METHOD_STEP_2"],                                                 /* Requires the isolated cosine value. */
        },                                                                                         /* Closes Step 3. */
        {                                                                                          /* Opens Step 4. */
          id: "Q14_METHOD_STEP_4",                                                                 /* Gives the step a stable local ID. */
          order: 4,                                                                                /* Records the fourth step. */
          subgoal: "Use related-angle reasoning to obtain the matching quadrant III angle.",      /* Describes the second solution step. */
          linkedMarkIds: [M4],                                                                     /* Links the step to Mark 4. */
          dependsOnStepIds: ["Q14_METHOD_STEP_3"],                                                 /* Builds from the first valid angle. */
        },                                                                                         /* Closes Step 4. */
      ],                                                                                           /* Closes the ordered method steps. */
      markMappingComplete: true,                                                                   /* Confirms that all four marks are mapped to the route. */
      alternativeEquivalentMethodIds: [],                                                         /* No materially different full method is explicitly illustrated. */
      excludedMethodReasons: [                                                                     /* Opens methods that do not earn normal full-method credit. */
        "Repeated substitution is treated as answer-only credit rather than a full valid method.",/* Records the source's explicit repeated-substitution rule. */
        "Angles not obtained using a valid trigonometric calculation cannot earn the angle marks.",/* Records the source's trig-method gate. */
      ],                                                                                           /* Closes methods that do not earn normal full-method credit. */
      sourceEvidence: [markingSchemeEvidence],                                                     /* Links the pathway directly to the source MS. */
    },                                                                                             /* Closes the primary cosine-equation method. */
  ],                                                                                               /* Closes valid solution pathways. */

  workingPolicy: {                                                                                 /* Opens working and evidence rules. */
    correctAnswerWithoutWorking: {                                                                 /* Opens correct-answer-only treatment. */
      treatment: "PARTIAL_CREDIT",                                                                 /* A fully correct final pair earns only part credit without working. */
      marksAwarded: 1,                                                                             /* Records the explicit 1/4 award. */
      markIdsAwarded: [M4],                                                                        /* The source mark pattern assigns the surviving credit to Mark 4. */
      notes: "The source explicitly awards 1/4 for the correct two answers with no working.",      /* Summarises the answer-only rule. */
    },                                                                                             /* Closes correct-answer-only treatment. */
    workingMandatoryForMarkIds: [M1, M2, M3],                                                     /* Marks 1–3 need appropriate process evidence. */
    workingMayBeImpliedForMarkIds: [M2],                                                          /* A valid later trig calculation can imply the rearrangement. */
    diagramWorkCanScore: false,                                                                    /* The source diagram is not a working surface for this Question. */
    graphWorkCanScore: false,                                                                      /* No graph response is involved. */
    laterPartCanSupplyEvidence: false,                                                             /* The Question has no later part. */
    earlierPartCanSupplyEvidence: false,                                                           /* The Question has no earlier part. */
    repeatedSubstitutionAccepted: false,                                                           /* Repeated substitution is not accepted as the normal method. */
  },                                                                                               /* Closes working and evidence rules. */

  presentationPolicy: {                                                                            /* Opens precision and presentation rules. */
    precision: {                                                                                   /* Opens precision treatment. */
      finalPrecisionType: "NONE",                                                                  /* No fixed final precision is demanded. */
      finalPrecisionValue: null,                                                                   /* No decimal-place or significant-figure count is set. */
      acceptedFinalRange: null,                                                                    /* No single numeric range represents the two answers. */
      prematureRoundingAllowed: true,                                                              /* Sensible numerical rounding does not change the intended credit. */
      minimumIntermediatePrecision: null,                                                          /* The detailed MS states no minimum intermediate precision here. */
    },                                                                                             /* Closes precision treatment. */
    simplification: "NOT_RELEVANT",                                                                /* Simplification is not a final-answer requirement. */
    exactValue: "NOT_RELEVANT",                                                                    /* Exact symbolic angle form is not required. */
    units: "DO_NOT_PENALISE",                                                                      /* Omission of the degree unit is not penalised. */
    degreeSymbol: "DO_NOT_PENALISE",                                                               /* The source explicitly says the degree sign may be omitted. */
    coordinateBrackets: "NOT_RELEVANT",                                                           /* Coordinates are not part of the answer. */
    vectorBrackets: "NOT_RELEVANT",                                                               /* Vectors are not part of the answer. */
    positivePowers: "NOT_RELEVANT",                                                               /* Index form is not part of the answer. */
    rationalDenominator: "NOT_RELEVANT",                                                          /* Surd denominator form is not part of the answer. */
    contextualWording: "NOT_RELEVANT",                                                            /* No contextual sentence is required. */
    answerLabelling: "ACCEPTED_VARIATION",                                                        /* The two angle values need only be clearly identifiable. */
    otherConditions: [],                                                                           /* No other presentation conditions are required. */
  },                                                                                               /* Closes precision and presentation rules. */

  questionSpecificRules: [                                                                         /* Opens structured Question-specific marking rules. */
    {                                                                                              /* Opens the answer-only rule. */
      id: "Q14_RULE_CORRECT_ANSWERS_NO_WORKING",                                                   /* Gives the rule a stable ID. */
      category: "ANSWER_ONLY",                                                                     /* Classifies the rule as answer-only treatment. */
      conditionSummary: "Both correct final angles are stated without appropriate working.",      /* Describes the trigger condition. */
      outcome: {                                                                                   /* Opens the marking consequence. */
        marksAwarded: 1,                                                                           /* Records the fixed 1/4 award. */
        maximumMarks: 1,                                                                           /* Caps this response at one mark. */
        unavailableMarkIds: [M1, M2, M3],                                                         /* Makes the three process-dependent marks unavailable. */
        followThroughMarkIds: [M4],                                                                /* Records the one surviving answer mark. */
      },                                                                                           /* Closes the marking consequence. */
      appliesToMarkIds: [M1, M2, M3, M4],                                                        /* Links the rule to all four marks. */
      sourceEvidence: [markingSchemeEvidence],                                                     /* Links the rule to the detailed MS. */
    },                                                                                             /* Closes the answer-only rule. */

    {                                                                                              /* Opens the repeated-substitution rule. */
      id: "Q14_RULE_REPEATED_SUBSTITUTION",                                                        /* Gives the rule a stable ID. */
      category: "METHOD_LIMIT",                                                                    /* Classifies the rule as a method-credit limit. */
      conditionSummary: "The two correct angles are obtained by repeated substitution rather than a valid trig solution method.", /* Describes the trigger. */
      outcome: {                                                                                   /* Opens the marking consequence. */
        marksAwarded: 1,                                                                           /* Records the fixed 1/4 award. */
        maximumMarks: 1,                                                                           /* Caps repeated substitution at one mark. */
        unavailableMarkIds: [M1, M2, M3],                                                         /* Blocks the three normal process marks. */
        followThroughMarkIds: [M4],                                                                /* Leaves the source's final one-mark credit available. */
      },                                                                                           /* Closes the marking consequence. */
      appliesToMarkIds: [M1, M2, M3, M4],                                                        /* Links the rule to all four marks. */
      sourceEvidence: [markingSchemeEvidence],                                                     /* Links the rule to the detailed MS. */
    },                                                                                             /* Closes the repeated-substitution rule. */

    {                                                                                              /* Opens the valid-trig-value rule. */
      id: "Q14_RULE_VALID_TRIG_VALUE",                                                             /* Gives the rule a stable ID. */
      category: "METHOD_LIMIT",                                                                    /* Classifies the rule as an eligibility limit. */
      conditionSummary: "Angle credit is attempted without a valid trig calculation using a cosine value strictly between -1 and 1.", /* Describes the trigger. */
      outcome: {                                                                                   /* Opens the marking consequence. */
        marksAwarded: null,                                                                        /* The total depends on earlier earned marks. */
        maximumMarks: 2,                                                                           /* Only Marks 1 and 2 can remain where angle marks are blocked. */
        unavailableMarkIds: [M3, M4],                                                             /* Blocks both angle marks. */
        followThroughMarkIds: [],                                                                  /* No angle follow-through survives an invalid trig state. */
      },                                                                                           /* Closes the marking consequence. */
      appliesToMarkIds: [M3, M4],                                                                  /* Links the rule to the two angle marks. */
      sourceEvidence: [markingSchemeEvidence],                                                     /* Links the rule to the detailed MS. */
    },                                                                                             /* Closes the valid-trig-value rule. */

    {                                                                                              /* Opens the negative-cosine quadrant rule. */
      id: "Q14_RULE_NEGATIVE_COSINE_QUADRANTS",                                                    /* Gives the rule a stable ID. */
      category: "SOLUTION_SELECTION",                                                              /* Classifies the rule as valid-solution selection. */
      conditionSummary: "The isolated cosine value is negative but stated angles are not consistent with quadrants II and III.", /* Describes the trigger. */
      outcome: {                                                                                   /* Opens the marking consequence. */
        marksAwarded: null,                                                                        /* The exact score depends on how many valid angles are present. */
        maximumMarks: null,                                                                        /* One of the two angle marks may still survive. */
        unavailableMarkIds: [],                                                                    /* Availability is decided separately for each angle node. */
        followThroughMarkIds: [M3, M4],                                                            /* Consistent negative-cosine angles can still score individually. */
      },                                                                                           /* Closes the marking consequence. */
      appliesToMarkIds: [M3, M4],                                                                  /* Links the rule to both angle marks. */
      sourceEvidence: [markingSchemeEvidence],                                                     /* Links the rule to the detailed MS. */
    },                                                                                             /* Closes the negative-cosine quadrant rule. */

    {                                                                                              /* Opens the positive-cosine eased-working rule. */
      id: "Q14_RULE_POSITIVE_COSINE_EASED_FIRST_ANGLE",                                            /* Gives the rule a stable ID. */
      category: "FOLLOW_THROUGH",                                                                  /* Classifies the rule as unusual follow-through behaviour. */
      conditionSummary: "An earlier error produces a positive cosine value.",                     /* Describes the trigger condition. */
      outcome: {                                                                                   /* Opens the marking consequence. */
        marksAwarded: null,                                                                        /* The total depends on other earned marks. */
        maximumMarks: null,                                                                        /* The source gives no simple overall score ceiling. */
        unavailableMarkIds: [M3],                                                                  /* Blocks the first-angle mark because the working is eased. */
        followThroughMarkIds: [M4],                                                                /* Allows the second-angle mark for a consistent quadrant IV solution. */
      },                                                                                           /* Closes the marking consequence. */
      appliesToMarkIds: [M3, M4],                                                                  /* Links the rule to the two angle marks. */
      sourceEvidence: [markingSchemeEvidence],                                                     /* Links the rule to the detailed MS. */
    },                                                                                             /* Closes the positive-cosine eased-working rule. */

    {                                                                                              /* Opens the extra-acute-answer rule. */
      id: "Q14_RULE_EXTRA_68_FINAL_ANSWER",                                                        /* Gives the rule a stable ID. */
      category: "SOLUTION_SELECTION",                                                              /* Classifies the rule as final-solution selection. */
      conditionSummary: "68 degrees is clearly included as an additional final answer.",          /* Describes the trigger condition. */
      outcome: {                                                                                   /* Opens the marking consequence. */
        marksAwarded: null,                                                                        /* Earlier earned marks remain case-dependent. */
        maximumMarks: 3,                                                                           /* The source examples cap such responses at three marks. */
        unavailableMarkIds: [M4],                                                                  /* The second-solution mark is unavailable. */
        followThroughMarkIds: [],                                                                  /* No further mark remains after Mark 4. */
      },                                                                                           /* Closes the marking consequence. */
      appliesToMarkIds: [M4],                                                                      /* Links the rule directly to the final angle mark. */
      sourceEvidence: [markingSchemeEvidence],                                                     /* Links the rule to the detailed MS. */
    },                                                                                             /* Closes the extra-acute-answer rule. */
  ],                                                                                               /* Closes structured Question-specific marking rules. */

  commonResponses: [                                                                               /* Opens useful source-discussed response patterns. */
    {                                                                                              /* Opens the positive-cosine sign-error pattern. */
      id: "Q14_COR_POSITIVE_COSINE_WITH_Q4_FOLLOW_THROUGH",                                        /* Gives the response pattern a stable ID. */
      category: "COMMON_ERROR",                                                                    /* Records this as a common incorrect route. */
      errorFamily: "TRIG_SIGN_ERROR_POSITIVE_COSINE",                                              /* Groups this with cosine-sign errors. */
      responseSummary: "A sign error gives positive 3/8, the first-angle mark is lost, but a consistent quadrant IV angle can still earn the final mark.", /* Paraphrases the response pattern. */
      affectedMarkIds: [M2, M3, M4],                                                               /* Links the marks affected by the sign error. */
      marksAwarded: 2,                                                                             /* Records the illustrated 2/4 outcome when Mark 1 and Mark 4 score. */
      maximumMarks: 2,                                                                             /* Records the demonstrated ceiling for this illustrated response. */
      followThroughAvailable: true,                                                                /* The final angle mark survives by follow-through. */
      linkedRuleIds: ["Q14_RULE_POSITIVE_COSINE_EASED_FIRST_ANGLE"],                               /* Links the rule explaining the outcome. */
      usefulForGeneratorValidation: true,                                                         /* This is an important edge case for generated MS logic. */
      sourceEvidence: [markingSchemeEvidence],                                                     /* Links the pattern to the source COR section. */
    },                                                                                             /* Closes the positive-cosine sign-error pattern. */

    {                                                                                              /* Opens the extra-acute-angle pattern. */
      id: "Q14_COR_EXTRA_ACUTE_FINAL_ANSWER",                                                      /* Gives the response pattern a stable ID. */
      category: "COMMON_ERROR",                                                                    /* Records this as a common final-answer selection error. */
      errorFamily: "TRIG_EXTRA_INVALID_SOLUTION",                                                  /* Groups it with extra invalid trig solutions. */
      responseSummary: "The acute reference angle is included as an additional final answer alongside otherwise valid solutions.", /* Paraphrases the error. */
      affectedMarkIds: [M4],                                                                       /* Links the error to the final-solution mark. */
      marksAwarded: null,                                                                          /* The total varies with the other stated answers. */
      maximumMarks: 3,                                                                             /* The source examples show a maximum of three marks. */
      followThroughAvailable: false,                                                               /* The extra answer directly removes the final mark. */
      linkedRuleIds: ["Q14_RULE_EXTRA_68_FINAL_ANSWER"],                                           /* Links the rule explaining the outcome. */
      usefulForGeneratorValidation: true,                                                         /* Generated MS logic should test extra-answer handling. */
      sourceEvidence: [markingSchemeEvidence],                                                     /* Links the pattern to the source notes. */
    },                                                                                             /* Closes the extra-acute-angle pattern. */

    {                                                                                              /* Opens the RAD-mode response pattern. */
      id: "Q14_COR_RAD_MODE",                                                                      /* Gives the RAD-mode pattern a stable ID. */
      category: "CALCULATOR_MODE_ERROR",                                                           /* Records this as a calculator-angle-mode issue. */
      errorFamily: "TRIG_CALCULATOR_MODE",                                                         /* Groups RAD and GRAD errors together. */
      responseSummary: "The inverse-trig calculation is carried out in radians and then continued consistently.", /* Paraphrases the source example. */
      affectedMarkIds: [M3, M4],                                                                   /* Links the mode error to the angle marks. */
      marksAwarded: null,                                                                          /* The exact award depends on whether the shared penalty was already applied. */
      maximumMarks: null,                                                                          /* The shared once-only rule prevents a simple local ceiling. */
      followThroughAvailable: true,                                                                /* Consistent later angle work can still be recognised. */
      linkedRuleIds: [],                                                                           /* The governing rule is shared across Questions rather than local. */
      usefulForGeneratorValidation: true,                                                         /* Calculator-mode handling must be tested in generated schemes. */
      sourceEvidence: [markingSchemeEvidence],                                                     /* Links the pattern to the detailed source note. */
    },                                                                                             /* Closes the RAD-mode response pattern. */

    {                                                                                              /* Opens the GRAD-mode response pattern. */
      id: "Q14_COR_GRAD_MODE",                                                                     /* Gives the GRAD-mode pattern a stable ID. */
      category: "CALCULATOR_MODE_ERROR",                                                           /* Records this as a calculator-angle-mode issue. */
      errorFamily: "TRIG_CALCULATOR_MODE",                                                         /* Groups RAD and GRAD errors together. */
      responseSummary: "The inverse-trig calculation is carried out in gradians and then continued consistently.", /* Paraphrases the source example. */
      affectedMarkIds: [M3, M4],                                                                   /* Links the mode error to the angle marks. */
      marksAwarded: null,                                                                          /* The exact award depends on the shared once-only penalty. */
      maximumMarks: null,                                                                          /* The shared rule prevents a simple local ceiling. */
      followThroughAvailable: true,                                                                /* Consistent later angle work can still be recognised. */
      linkedRuleIds: [],                                                                           /* The governing rule is shared across Questions rather than local. */
      usefulForGeneratorValidation: true,                                                         /* Calculator-mode handling must be tested in generated schemes. */
      sourceEvidence: [markingSchemeEvidence],                                                     /* Links the pattern to the detailed source note. */
    },                                                                                             /* Closes the GRAD-mode response pattern. */
  ],                                                                                               /* Closes useful source-discussed response patterns. */

  sharedRuleRefs: [                                                                                /* Opens shared and cross-Question rule references. */
    {                                                                                              /* Opens the RAD/GRAD shared-rule reference. */
      ruleId: "N5_MATH_2025_P2_RAD_GRAD_Q12_Q14",                                                 /* Gives the shared rule its stable ID. */
      scope: "QUESTION_GROUP",                                                                     /* Records that the rule spans a defined Question group. */
      category: "CALCULATOR_MODE",                                                                 /* Classifies the rule as calculator-mode treatment. */
      affectedQuestionIds: ["N5_MATH_2025_P2_Q12", "N5_MATH_2025_P2_Q14"],                        /* Records the two Questions covered by the source rule. */
      penaltyLimit: "ONCE",                                                                        /* Records that an inappropriate mode is penalised only once across the group. */
      applicationSummary: "An inappropriate RAD or GRAD setting is penalised at most once across Questions 12 and 14.", /* Paraphrases the shared rule. */
      sourceEvidence: [markingSchemeEvidence],                                                     /* Links to the Q14 source note that states the shared scope. */
    },                                                                                             /* Closes the RAD/GRAD shared-rule reference. */
  ],                                                                                               /* Closes shared and cross-Question rule references. */

  generalPolicy: {                                                                                 /* Opens the link to the wider 2025 marking policy. */
    policyId: "N5_MATH_2025_GENERAL_MARKING_POLICY",                                               /* Links to the planned full 2025 general-policy entry. */
    relevantRuleIds: [                                                                             /* Opens the general rules especially relevant here. */
      "N5_MATH_2025_GP_POSITIVE_MARKING",                                                          /* Links normal positive-marking behaviour. */
      "N5_MATH_2025_GP_ONE_MARK_PER_NODE",                                                         /* Links the one-mark-per-node principle. */
      "N5_MATH_2025_GP_WORKING_REQUIRED",                                                          /* Links the general requirement for appropriate working. */
      "N5_MATH_2025_GP_REPEATED_ERROR_WITHIN_QUESTION",                                           /* Links repeated-error treatment within a Question. */
      "N5_MATH_2025_GP_MULTIPLE_ATTEMPTS",                                                         /* Links treatment of multiple attempts. */
    ],                                                                                             /* Closes the general rules especially relevant here. */
    notes: ["Question-specific notes override general rules where they explicitly say so."],       /* Records normal precedence of detailed instructions. */
  },                                                                                               /* Closes the link to the wider 2025 marking policy. */

  relationship: {                                                                                  /* Opens the explicit Question-to-MS relationship. */
    partMarkMap: [                                                                                 /* Opens the Question-part to mark mapping. */
      {                                                                                            /* Opens the single response-unit mapping. */
        questionPartId: "N5_MATH_2025_P2_Q14_MAIN",                                               /* Links to the Question's only response unit. */
        markIds: [M1, M2, M3, M4],                                                                /* Assigns all four marks to that response unit. */
      },                                                                                           /* Closes the single response-unit mapping. */
    ],                                                                                             /* Closes the Question-part to mark mapping. */

    subgoalMarkMap: [                                                                              /* Opens mathematical subgoal mappings. */
      {                                                                                            /* Opens the target-substitution subgoal. */
        subgoalId: "Q14_SUBGOAL_TARGET",                                                           /* Gives the subgoal a stable local ID. */
        subgoalSummary: "Connect the requested height to the supplied model.",                    /* Summarises the subgoal. */
        markIds: [M1],                                                                             /* Links the subgoal to Mark 1. */
      },                                                                                           /* Closes the target-substitution subgoal. */
      {                                                                                            /* Opens the trig-isolation subgoal. */
        subgoalId: "Q14_SUBGOAL_ISOLATE",                                                          /* Gives the subgoal a stable local ID. */
        subgoalSummary: "Isolate the cosine value.",                                               /* Summarises the subgoal. */
        markIds: [M2],                                                                             /* Links the subgoal to Mark 2. */
      },                                                                                           /* Closes the trig-isolation subgoal. */
      {                                                                                            /* Opens the first-angle subgoal. */
        subgoalId: "Q14_SUBGOAL_FIRST_ANGLE",                                                      /* Gives the subgoal a stable local ID. */
        subgoalSummary: "Find one valid degree solution.",                                         /* Summarises the subgoal. */
        markIds: [M3],                                                                             /* Links the subgoal to Mark 3. */
      },                                                                                           /* Closes the first-angle subgoal. */
      {                                                                                            /* Opens the second-angle subgoal. */
        subgoalId: "Q14_SUBGOAL_SECOND_ANGLE",                                                     /* Gives the subgoal a stable local ID. */
        subgoalSummary: "Find the second valid related-angle solution.",                           /* Summarises the subgoal. */
        markIds: [M4],                                                                             /* Links the subgoal to Mark 4. */
      },                                                                                           /* Closes the second-angle subgoal. */
    ],                                                                                             /* Closes mathematical subgoal mappings. */

    promptInstructionConsequences: [                                                               /* Opens prompt-to-mark consequences. */
      {                                                                                            /* Opens the two-values instruction consequence. */
        instructionType: "TWO_VALUES_REQUIRED",                                                    /* Names the important response-count instruction. */
        markingConsequence: "The two valid angular solutions are separately represented by Marks 3 and 4.", /* States its marking effect. */
        affectedMarkIds: [M3, M4],                                                                 /* Links the consequence to both angle marks. */
      },                                                                                           /* Closes the two-values instruction consequence. */
    ],                                                                                             /* Closes prompt-to-mark consequences. */

    informationEvidenceMap: [                                                                      /* Opens links from Question information to marking evidence. */
      {                                                                                            /* Opens the supplied-model evidence link. */
        questionInformationId: "Q14_INFO_MODEL",                                                   /* Links to the supplied cosine model. */
        usedByMethodIds: [METHOD],                                                                  /* Records the method that uses the model. */
        supportsMarkIds: [M1, M2],                                                                  /* Links the model to setup and rearrangement marks. */
      },                                                                                           /* Closes the supplied-model evidence link. */
      {                                                                                            /* Opens the target-height evidence link. */
        questionInformationId: "Q14_INFO_TARGET_HEIGHT",                                           /* Links to the 13-metre target. */
        usedByMethodIds: [METHOD],                                                                  /* Records the method using the target. */
        supportsMarkIds: [M1],                                                                      /* Links the target directly to Mark 1. */
      },                                                                                           /* Closes the target-height evidence link. */
      {                                                                                            /* Opens the domain evidence link. */
        questionInformationId: "Q14_INFO_DOMAIN",                                                  /* Links to the one-rotation domain. */
        usedByMethodIds: [METHOD],                                                                  /* Records the method using the domain. */
        supportsMarkIds: [M3, M4],                                                                  /* Links the domain to solution validity. */
      },                                                                                           /* Closes the domain evidence link. */
      {                                                                                            /* Opens the angle-meaning evidence link. */
        questionInformationId: "Q14_INFO_ANGLE_MEANING",                                           /* Links to the definition of x in degrees. */
        usedByMethodIds: [METHOD],                                                                  /* Records the method using the angle meaning. */
        supportsMarkIds: [M3, M4],                                                                  /* Links the degree interpretation to the angle marks. */
      },                                                                                           /* Closes the angle-meaning evidence link. */
    ],                                                                                             /* Closes links from Question information to marking evidence. */

    representationEvidenceMap: [],                                                                 /* Confirms neither source visual directly earns marks. */
    crossPartDependencies: [],                                                                     /* Confirms the Question has no cross-part marking dependency. */

    errorPropagationGraph: [                                                                       /* Opens structured error-propagation routes. */
      {                                                                                            /* Opens the positive-cosine sign-error route. */
        sourceMarkIds: [M2],                                                                       /* Locates the sign error at the rearrangement stage. */
        affectedMarkIds: [M3, M4],                                                                 /* Records the later marks affected by the error. */
        survivingMarkIds: [M4],                                                                    /* Records that only the second-angle mark can survive. */
        conditionSummary: "If the rearrangement produces a positive cosine value, Mark 3 is blocked as eased work but Mark 4 can follow through for a consistent quadrant IV angle.", /* States the unusual FT route. */
      },                                                                                           /* Closes the positive-cosine sign-error route. */
      {                                                                                            /* Opens the invalid-trig-state route. */
        sourceMarkIds: [M2],                                                                       /* Locates the invalid state after rearrangement. */
        affectedMarkIds: [M3, M4],                                                                 /* Records both angle marks as affected. */
        survivingMarkIds: [],                                                                      /* No angle marks survive an invalid inverse-trig input. */
        conditionSummary: "If the isolated cosine value is not strictly between -1 and 1, neither angle mark is available.", /* States the validity gate. */
      },                                                                                           /* Closes the invalid-trig-state route. */
    ],                                                                                             /* Closes structured error-propagation routes. */
  },                                                                                               /* Closes the explicit Question-to-MS relationship. */

  sourceLayout: catalogueValue({                                                                   /* Opens source-layout evidence. */
    coreEvidenceBlocks: [                                                                          /* Opens the main marking-evidence blocks. */
      {                                                                                            /* Opens the core evidence block. */
        measurementMethod: "NOT_MEASURED",                                                         /* Records that exact dimensions have not yet been measured. */
        pdfPageNumber: 44,                                                                         /* Records the physical PDF page. */
        renderDpi: null,                                                                           /* No render DPI has been fixed for this block. */
        topPx: null,                                                                               /* No pixel top edge has been measured. */
        bottomPx: null,                                                                            /* No pixel bottom edge has been measured. */
        leftPx: null,                                                                              /* No pixel left edge has been measured. */
        rightPx: null,                                                                             /* No pixel right edge has been measured. */
        heightMm: null,                                                                            /* No physical height has been measured. */
        widthMm: null,                                                                             /* No physical width has been measured. */
        notes: "The main four-mark table appears at the top of the printed marking page.",         /* Preserves useful layout context without false precision. */
      },                                                                                           /* Closes the core evidence block. */
    ],                                                                                             /* Closes the main marking-evidence blocks. */
    fullQuestionBlocks: [                                                                          /* Opens the complete Question-specific block. */
      {                                                                                            /* Opens the full Question block. */
        measurementMethod: "NOT_MEASURED",                                                         /* Records that exact dimensions have not yet been measured. */
        pdfPageNumber: 44,                                                                         /* Records the physical PDF page. */
        renderDpi: null,                                                                           /* No render DPI has been fixed for this block. */
        topPx: null,                                                                               /* No pixel top edge has been measured. */
        bottomPx: null,                                                                            /* No pixel bottom edge has been measured. */
        leftPx: null,                                                                              /* No pixel left edge has been measured. */
        rightPx: null,                                                                             /* No pixel right edge has been measured. */
        heightMm: null,                                                                            /* No physical height has been measured. */
        widthMm: null,                                                                             /* No physical width has been measured. */
        notes: "The full block includes the mark table, seven detailed notes and the COR section.", /* Summarises the source layout. */
      },                                                                                           /* Closes the full Question block. */
    ],                                                                                             /* Closes the complete Question-specific block. */
  }),                                                                                               /* Closes source-layout evidence. */

  generation: {                                                                                    /* Opens generator-facing MS knowledge. */
    readiness: "PARTIAL",                                                                          /* Keeps MS generation provisional until more family examples are catalogued. */
    linkedMarkingGeneratorFamilyIds: [],                                                          /* No live MS generator family is linked yet. */
    requiredMethodFamilyIds: [METHOD],                                                             /* Requires the normal cosine-equation pathway. */
    minimumIllustrativeMethodCount: 1,                                                             /* One complete illustrated route is sufficient for this source family so far. */
    requiredMarkTypes: ["PROCESS", "ACCURACY", "SELECTION"],                                      /* Lists the mark purposes a generated scheme must preserve. */
    followThroughTemplateNotes: [                                                                  /* Opens reusable follow-through behaviour. */
      "A sign error producing positive cosine blocks the eased first-angle mark but can leave the second-angle mark available for a consistent quadrant IV solution.", /* Preserves the unusual difficulty rule. */
      "Invalid trig values outside the inverse-trig range block both angle marks.",                /* Preserves the mathematical-validity gate. */
    ],                                                                                             /* Closes reusable follow-through behaviour. */
    presentationTemplateNotes: [                                                                   /* Opens reusable presentation behaviour. */
      "Do not require a degree symbol for credit.",                                                /* Preserves the explicit source notation rule. */
      "A correct final pair without working receives only one mark.",                              /* Preserves the answer-only treatment. */
      "Repeated substitution receives only one mark even when the final pair is correct.",        /* Preserves the method-credit limit. */
    ],                                                                                             /* Closes reusable presentation behaviour. */
    commonErrorFamilyIds: [                                                                        /* Opens useful generator-test error families. */
      "TRIG_SIGN_ERROR_POSITIVE_COSINE",                                                           /* Tests the special sign-error follow-through route. */
      "TRIG_EXTRA_INVALID_SOLUTION",                                                               /* Tests extra-answer handling. */
      "TRIG_CALCULATOR_MODE",                                                                      /* Tests RAD/GRAD treatment. */
    ],                                                                                             /* Closes useful generator-test error families. */
    requiredValidationChecks: [                                                                    /* Opens required checks for future generated schemes. */
      "Four one-mark nodes must sum to the Question total of four.",                              /* Checks basic mark arithmetic. */
      "The first two marks must reward target substitution and rearrangement.",                   /* Preserves the process structure. */
      "The final two marks must represent separately creditable angle solutions.",                /* Preserves the two-solution structure. */
      "Angle marks must require a valid trig value within the inverse-trig range.",                /* Preserves the mathematical-validity gate. */
      "Negative cosine must require quadrant II and III consistency.",                            /* Preserves the intended quadrant structure. */
      "Positive-cosine sign-error follow-through must block the eased first angle but allow a valid quadrant IV second angle.", /* Preserves the source exception. */
      "Extra inclusion of the acute reference angle must remove the final mark.",                  /* Preserves the extra-answer rule. */
      "RAD/GRAD penalty must be represented as a shared once-only rule rather than a duplicated local penalty.", /* Preserves cross-Question rule ownership. */
    ],                                                                                             /* Closes required checks for future generated schemes. */
    provenance: generationProvenance,                                                              /* Marks this section as derived generation analysis. */
  },                                                                                               /* Closes generator-facing MS knowledge. */

  review: {                                                                                        /* Opens the shared catalogue review record. */
    status: "CATALOGUED",                                                                          /* Records that the first full MS catalogue pass is complete. */
    reviewedBy: null,                                                                              /* No named human reviewer has approved the entry yet. */
    reviewedAt: null,                                                                              /* No formal human review date is recorded yet. */
    unresolvedIssues: [                                                                            /* Opens remaining review points. */
      "Create the 2025 general marking-policy catalogue entry and resolve the referenced rule IDs.", /* Records the pending policy-link task. */
      "Define the shared Q12/Q14 RAD-GRAD rule centrally when the 2025 Paper 2 shared-rule catalogue is populated.", /* Records the pending shared-rule task. */
      "Compare this method and mark structure with other contextual trig-equation questions before freezing the family template.", /* Records the corpus stress-test follow-up. */
    ],                                                                                             /* Closes remaining review points. */
    catalogueNotes: ["First full Marking Scheme Catalogue V1 stress-test entry."],                 /* Records why this MS was catalogued first. */
  },                                                                                               /* Closes the shared catalogue review record. */

} satisfies ExamMarkingSchemeCatalogEntry;                                                        /* Checks this entry against the universal Marking Scheme contract. */