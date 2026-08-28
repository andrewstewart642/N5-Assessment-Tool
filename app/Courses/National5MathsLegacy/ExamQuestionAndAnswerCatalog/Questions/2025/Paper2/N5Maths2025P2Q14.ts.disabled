// ============================================================================
// 2025 PAPER 2 QUESTION 14 — QUESTION CATALOGUE ENTRY
// ============================================================================

import type {                                                                                      /* Opens catalogue-wide type imports. */
  ExamCatalogueConfidence,                                                                        /* Reuses catalogue confidence levels. */
  ExamCatalogueEvidenceRef,                                                                       /* Reuses traceable source references. */
  ExamCatalogueProvenance,                                                                        /* Reuses source and analysis provenance. */
  ExamCatalogueValue,                                                                             /* Reuses explicit VALUE and N/A field states. */
} from "../../../ExamCatalogTypes";                                                               /* Closes catalogue-wide type imports. */
import type { ExamQuestionCatalogEntry } from "../../ExamQuestionTypes";                           /* Uses the universal Question Catalogue contract. */

// ============================================================================
// SECTION 1 — SOURCE EVIDENCE
// ============================================================================

const questionPaperEvidence: ExamCatalogueEvidenceRef = {                                         /* Opens the Question Paper source reference. */
  id: "N5_MATH_2025_P2_Q14_QP",                                                                   /* Gives this source reference a stable ID. */
  evidenceType: "QUESTION",                                                                        /* Records that the evidence comes from the Question Paper. */
  documentId: "N5_MATH_2025_QUESTION_PAPER",                                                      /* Identifies the combined 2025 Question Paper source. */
  pdfPageNumbers: [29],                                                                            /* Points to physical PDF page 29. */
  printedPageLabels: ["16"],                                                                       /* Records the printed Paper 2 page label. */
  questionLocator: "14",                                                                           /* Points to Question 14. */
  notes: "Paper 2 Question 14.",                                                                    /* Keeps the source locator short and clear. */
};                                                                                                 /* Closes the Question Paper source reference. */

const markingSchemeEvidence: ExamCatalogueEvidenceRef = {                                         /* Opens the matching Marking Scheme source reference. */
  id: "N5_MATH_2025_P2_Q14_MS",                                                                   /* Gives this source reference a stable ID. */
  evidenceType: "MARKING_SCHEME",                                                                 /* Records that the evidence comes from the Marking Scheme. */
  documentId: "N5_MATH_2025_MARKING_SCHEME",                                                      /* Identifies the combined 2025 Marking Scheme source. */
  pdfPageNumbers: [44],                                                                            /* Points to physical PDF page 44. */
  printedPageLabels: ["22"],                                                                       /* Records the printed Paper 2 marking page label. */
  questionLocator: "14",                                                                           /* Points to Question 14 marking guidance. */
  notes: "Paper 2 Question 14 marking guidance.",                                                  /* Keeps the source locator short and clear. */
};                                                                                                 /* Closes the Marking Scheme source reference. */

const photoEvidence: ExamCatalogueEvidenceRef = {                                                 /* Opens the contextual photograph source reference. */
  id: "N5_MATH_2025_P2_Q14_VISUAL_PHOTO",                                                         /* Gives the photograph evidence a stable ID. */
  evidenceType: "VISUAL",                                                                          /* Records that this reference points to visual evidence. */
  documentId: "N5_MATH_2025_QUESTION_PAPER",                                                      /* Identifies the Question Paper containing the photograph. */
  pdfPageNumbers: [29],                                                                            /* Points to physical PDF page 29. */
  printedPageLabels: ["16"],                                                                       /* Records the printed Paper 2 page label. */
  questionLocator: "14",                                                                           /* Links the photograph to Question 14. */
  notes: "Context photograph above the Question.",                                                 /* Describes the visual without storing the image. */
};                                                                                                 /* Closes the photograph source reference. */

const rideDiagramEvidence: ExamCatalogueEvidenceRef = {                                           /* Opens the rotating-arm diagram source reference. */
  id: "N5_MATH_2025_P2_Q14_VISUAL_DIAGRAM",                                                       /* Gives the diagram evidence a stable ID. */
  evidenceType: "VISUAL",                                                                          /* Records that this reference points to visual evidence. */
  documentId: "N5_MATH_2025_QUESTION_PAPER",                                                      /* Identifies the Question Paper containing the diagram. */
  pdfPageNumbers: [29],                                                                            /* Points to physical PDF page 29. */
  printedPageLabels: ["16"],                                                                       /* Records the printed Paper 2 page label. */
  questionLocator: "14",                                                                           /* Links the diagram to Question 14. */
  notes: "Schematic of the rotating arm, starting car and clockwise rotation.",                    /* Summarises the diagram's job. */
};                                                                                                 /* Closes the rotating-arm diagram source reference. */

// ============================================================================
// SECTION 2 — PROVENANCE HELPERS
// ============================================================================

const sourceProvenance: ExamCatalogueProvenance = {                                                /* Opens provenance for direct source facts. */
  kind: "SOURCE_FACT",                                                                             /* Marks these values as directly supported by source material. */
  evidence: [questionPaperEvidence, markingSchemeEvidence],                                        /* Links to the paired Question and Marking Scheme evidence. */
};                                                                                                 /* Closes direct source provenance. */

const catalogueProvenance: ExamCatalogueProvenance = {                                            /* Opens provenance for catalogue classifications. */
  kind: "CATALOGUE_CLASSIFICATION",                                                                /* Marks these values as our structured analysis. */
  evidence: [questionPaperEvidence, markingSchemeEvidence],                                        /* Grounds the classifications in the paired source evidence. */
};                                                                                                 /* Closes catalogue-classification provenance. */

const generationProvenance: ExamCatalogueProvenance = {                                           /* Opens provenance for generator-facing analysis. */
  kind: "GENERATION_ANALYSIS",                                                                     /* Marks these values as derived generation knowledge. */
  evidence: [questionPaperEvidence, markingSchemeEvidence],                                        /* Grounds the generation analysis in the paired evidence. */
};                                                                                                 /* Closes generator-facing provenance. */

const catalogueValue = <T>(                                                                        /* Opens a small helper for reviewed catalogue values. */
  value: T,                                                                                        /* Receives the reviewed value. */
  confidence: ExamCatalogueConfidence = "HIGH",                                                    /* Uses high confidence unless stated otherwise. */
): ExamCatalogueValue<T> => ({                                                                     /* Returns the universal catalogue wrapper. */
  state: "VALUE",                                                                                  /* Confirms that a reviewed value is present. */
  value,                                                                                            /* Stores the supplied value. */
  reason: null,                                                                                    /* Needs no missing-value reason. */
  confidence,                                                                                      /* Stores the chosen confidence level. */
  provenance: catalogueProvenance,                                                                 /* Marks the value as catalogue analysis. */
});                                                                                                 /* Closes the reviewed-value helper. */

const notApplicable = <T = never>(reason: string): ExamCatalogueValue<T> => ({                    /* Opens a helper for fields that do not apply. */
  state: "NOT_APPLICABLE",                                                                         /* Explicitly records that the field is not relevant. */
  value: null,                                                                                     /* Stores no invented value. */
  reason,                                                                                          /* Briefly explains why the field does not apply. */
  confidence: null,                                                                                /* Needs no confidence score. */
  provenance: catalogueProvenance,                                                                 /* Records that N/A is a reviewed classification. */
});                                                                                                 /* Closes the not-applicable helper. */

// ============================================================================
// SECTION 3 — COMPLETE QUESTION CATALOGUE ENTRY
// ============================================================================

export const national5Maths2025P2Q14 = {                                                          /* Opens the complete Question 14 catalogue entry. */

  identity: {                                                                                      /* Opens permanent Question identity. */
    id: "N5_MATH_2025_P2_Q14",                                                                     /* Gives the Question its stable catalogue ID. */
    schemaVersion: "CATALOGUE_V1",                                                                 /* Records the catalogue contract version. */
    courseId: "N5_MATH",                                                                           /* Links the Question to National 5 Mathematics. */
    paperContextId: "N5_MATH_2025_P2",                                                             /* Links to the shared 2025 Paper 2 context. */
    year: 2025,                                                                                    /* Records the source year. */
    paper: "P2",                                                                                   /* Records the source paper. */
    questionNumber: "14",                                                                          /* Records the printed Question number. */
    markingSchemeId: "N5_MATH_2025_P2_Q14_MS",                                                     /* Links to the matching Marking Scheme catalogue entry. */
  },                                                                                               /* Closes permanent Question identity. */

  sourceLayout: {                                                                                  /* Opens source page and answer-space evidence. */
    sourcePages: [29],                                                                             /* Records the physical PDF page containing the Question. */
    printedPageLabels: ["16"],                                                                     /* Records the printed Paper 2 page label. */
    continuesAcrossPages: false,                                                                   /* Confirms the Question fits on one source page. */
    answerSpace: {                                                                                 /* Opens the supplied answer-space profile. */
      category: "LARGE",                                                                           /* Records the substantial blank working area below the prompt. */
      estimatedLines: 10,                                                                          /* Gives a practical estimate of usable written lines. */
      responseSurfaceVisualIds: [],                                                                /* Confirms there is no supplied response grid or diagram. */
      notes: "Open working space occupies the lower part of the page.",                            /* Summarises the response-space layout. */
    },                                                                                             /* Closes the supplied answer-space profile. */
    sourceEvidence: [questionPaperEvidence],                                                       /* Links the layout to the Question Paper. */
  },                                                                                               /* Closes source page and answer-space evidence. */

  structure: {                                                                                     /* Opens Question structure. */
    structureType: "SINGLE",                                                                       /* Records a single unparted Question. */
    totalMarks: 4,                                                                                 /* Records the four available marks. */
    parts: [                                                                                        /* Opens the ordered Question parts. */
      {                                                                                             /* Opens the single main part. */
        id: "N5_MATH_2025_P2_Q14_MAIN",                                                            /* Gives the response unit a stable ID. */
        label: "14",                                                                                /* Uses the printed Question label. */
        marks: 4,                                                                                   /* Records the marks available for this response. */
        skillIds: ["trig-t02-equations", "trig-t02-related-angles"],                               /* Links the assessed canonical Trigonometry Skills. */
        conceptIds: ["trig-t2-2", "trig-t2-1"],                                                    /* Links the matching canonical Concepts. */
        topic: "TRIG",                                                                              /* Records Trigonometry as the assessment topic. */
        commandTypes: ["CALCULATE"],                                                                /* Records the source command style. */
        responseTypes: ["NUMBER"],                                                                  /* Records that two numerical angle values are required. */
        dependsOnPartIds: [],                                                                       /* Confirms there are no earlier parts. */
      },                                                                                            /* Closes the single main part. */
    ],                                                                                              /* Closes the ordered Question parts. */
    dependencyType: "INDEPENDENT",                                                                 /* Confirms there are no cross-part dependencies. */
    sharedStimulus: false,                                                                         /* No multipart shared stimulus exists. */
    sharedVisuals: false,                                                                          /* No multipart shared visual exists. */
    sharedGivenData: false,                                                                        /* No multipart shared-data structure exists. */
    requiredResultProvided: false,                                                                 /* The candidate is not working towards a stated result. */
  },                                                                                               /* Closes Question structure. */

  curriculum: {                                                                                    /* Opens curriculum classification. */
    primaryTopic: "TRIG",                                                                          /* Records Trigonometry as the main topic. */
    primarySkillId: "trig-t02-equations",                                                         /* Uses the canonical trig-equations Skill as primary. */
    secondarySkillIds: ["trig-t02-related-angles"],                                               /* Records related-angle reasoning as a secondary Skill. */
    primaryConceptId: "trig-t2-2",                                                                /* Uses the canonical trig-equations Concept as primary. */
    conceptIds: ["trig-t2-2", "trig-t2-1"],                                                       /* Records both materially assessed Concepts. */
    paperSuitability: "P2",                                                                        /* Records this as calculator-paper work. */
    standardProfile: "A",                                                                          /* Matches the Course Skills Tree's higher-demand standard. */
    thinkingProfile: "REASONING",                                                                  /* Reflects quadrant and multi-solution reasoning. */
    crossSkillQuestion: true,                                                                      /* Records that two canonical Skills are materially involved. */
    skillMarkDistribution: {                                                                       /* Opens the analysed Skill mark split. */
      "trig-t02-equations": 3,                                                                     /* Attributes substitution, rearrangement and first solution to trig equations. */
      "trig-t02-related-angles": 1,                                                                /* Attributes the second related-angle solution to related angles. */
    },                                                                                             /* Closes the analysed Skill mark split. */
    conceptMarkDistribution: {                                                                     /* Opens the analysed Concept mark split. */
      "trig-t2-2": 3,                                                                              /* Attributes three marks to trig-equation work. */
      "trig-t2-1": 1,                                                                              /* Attributes one mark to related-angle work. */
    },                                                                                             /* Closes the analysed Concept mark split. */
  },                                                                                               /* Closes curriculum classification. */

  task: {                                                                                          /* Opens task and response requirements. */
    commandTypes: ["CALCULATE"],                                                                   /* Records the explicit calculation command. */
    responseTypes: ["NUMBER"],                                                                     /* Records the final response form. */
    responseCount: 2,                                                                              /* Records that exactly two final values are requested. */
    explicitMethodCue: false,                                                                      /* The Question does not name inverse trig or quadrant methods. */
    methodRestricted: false,                                                                       /* No particular valid trig method is demanded. */
    workingRequestedInPrompt: false,                                                               /* The Question itself adds no separate working instruction. */
    justificationRequested: false,                                                                 /* No written justification is requested. */
    contextualConclusionRequested: false,                                                         /* No prose conclusion about the ride is required. */
  },                                                                                               /* Closes task and response requirements. */

  mathematics: {                                                                                   /* Opens the mathematical skeleton. */
    primaryGoal: "Solve a supplied contextual cosine model for two angles in one rotation.",      /* Summarises the mathematical target. */
    operationTypes: ["SUBSTITUTE", "REARRANGE", "SOLVE", "INTERPRET"],                            /* Records the main solution operations. */
    requiredFormulaIds: [],                                                                        /* No separate formula-sheet formula is required. */
    requiredTheoremIds: [],                                                                        /* No named theorem is required. */
    stageCount: 4,                                                                                 /* Counts substitution, isolation, first angle and second angle. */
    intermediateQuantityTypes: ["isolated cosine value", "principal/reference angle"],             /* Records the important intermediate results. */
    methodSelectionRequired: false,                                                                /* The supplied model gives a clear equation-solving route. */
    solutionCountExpected: 2,                                                                      /* Records the two valid solutions in one rotation. */
    validitySelectionRequired: true,                                                               /* Valid solutions must match the stated angular domain and quadrants. */
    representationTransitions: [                                                                   /* Opens important representation changes. */
      {                                                                                            /* Opens the target-to-equation transition. */
        from: "contextual target height",                                                          /* Starts from the required physical height. */
        to: "cosine-model equation",                                                               /* Moves to the supplied mathematical model. */
        purpose: "Substitute the target height into the model.",                                   /* Explains the purpose of the transition. */
      },                                                                                           /* Closes the target-to-equation transition. */
      {                                                                                            /* Opens the equation-to-trig-value transition. */
        from: "cosine-model equation",                                                             /* Starts from the substituted model. */
        to: "isolated cosine value",                                                               /* Rearranges to a single trig value. */
        purpose: "Prepare the equation for inverse cosine.",                                       /* Explains the purpose of the transition. */
      },                                                                                           /* Closes the equation-to-trig-value transition. */
      {                                                                                            /* Opens the trig-value-to-angle transition. */
        from: "isolated cosine value",                                                             /* Starts from the rearranged trig equation. */
        to: "two degree-angle solutions",                                                          /* Produces the required angular responses. */
        purpose: "Use inverse cosine and related-angle reasoning over one rotation.",              /* Explains why the transition matters. */
      },                                                                                           /* Closes the trig-value-to-angle transition. */
    ],                                                                                             /* Closes important representation changes. */
  },                                                                                               /* Closes the mathematical skeleton. */

  information: [                                                                                   /* Opens the normalised Question information. */
    {                                                                                              /* Opens the supplied cosine model item. */
      id: "Q14_INFO_MODEL",                                                                         /* Gives the information item a stable local ID. */
      informationType: "SUPPLIED_PERIODIC_MODEL",                                                  /* Classifies the supplied mathematical relationship. */
      normalisedContent: "Height is modelled by h = 10 - 8 cos(x°).",                              /* Stores the mathematical fact without source prose. */
      value: "h = 10 - 8 cos(x°)",                                                                 /* Stores the supplied model compactly. */
      unit: null,                                                                                  /* The relationship itself has mixed variable units. */
      source: "TEXT",                                                                              /* Records that the model is printed in the Question. */
      explicitness: "EXPLICIT",                                                                    /* Confirms the relationship is directly supplied. */
      role: "RELATIONSHIP",                                                                        /* Records that it defines how height depends on angle. */
      visualElementId: null,                                                                       /* The model is not sourced from a visual. */
    },                                                                                             /* Closes the supplied cosine model item. */
    {                                                                                              /* Opens the angular-domain item. */
      id: "Q14_INFO_DOMAIN",                                                                        /* Gives the domain item a stable local ID. */
      informationType: "ONE_ROTATION_DOMAIN",                                                      /* Classifies the supplied domain. */
      normalisedContent: "Angle is restricted to one rotation from 0 inclusive to 360 exclusive.",/* Paraphrases the domain meaning. */
      value: "0 <= x < 360",                                                                       /* Stores the mathematical domain. */
      unit: "degrees",                                                                             /* Records the angle unit. */
      source: "TEXT",                                                                              /* Records that the domain is printed in the Question. */
      explicitness: "EXPLICIT",                                                                    /* Confirms the domain is directly supplied. */
      role: "CONSTRAINT",                                                                          /* Records that it restricts valid solutions. */
      visualElementId: null,                                                                       /* The domain is not sourced from a visual. */
    },                                                                                             /* Closes the angular-domain item. */
    {                                                                                              /* Opens the target-height item. */
      id: "Q14_INFO_TARGET_HEIGHT",                                                                 /* Gives the target item a stable local ID. */
      informationType: "TARGET_HEIGHT",                                                            /* Classifies the requested model output. */
      normalisedContent: "Find angles at which the car reaches a height of 13 metres.",            /* Paraphrases the target. */
      value: 13,                                                                                   /* Stores the target height. */
      unit: "m",                                                                                   /* Records metres as the height unit. */
      source: "TEXT",                                                                              /* Records that the target is printed in the Question. */
      explicitness: "EXPLICIT",                                                                    /* Confirms the target is directly supplied. */
      role: "TARGET",                                                                              /* Records that this drives the calculation. */
      visualElementId: null,                                                                       /* The target is not sourced from a visual. */
    },                                                                                             /* Closes the target-height item. */
    {                                                                                              /* Opens the angle-meaning item. */
      id: "Q14_INFO_ANGLE_MEANING",                                                                 /* Gives the angle-definition item a stable local ID. */
      informationType: "INDEPENDENT_VARIABLE_MEANING",                                             /* Classifies the meaning of x. */
      normalisedContent: "x measures the arm's turn from car A's starting position.",             /* Paraphrases the variable meaning. */
      value: "angle turned from starting position",                                                /* Stores the variable meaning compactly. */
      unit: "degrees",                                                                             /* Records the intended angle unit. */
      source: "TEXT",                                                                              /* Records that the meaning is printed in the Question. */
      explicitness: "EXPLICIT",                                                                    /* Confirms the variable meaning is directly supplied. */
      role: "RELATIONSHIP",                                                                        /* Links the variable to the physical motion. */
      visualElementId: null,                                                                       /* The meaning is stated in text as well as supported visually. */
    },                                                                                             /* Closes the angle-meaning item. */
    {                                                                                              /* Opens the starting-position visual item. */
      id: "Q14_INFO_START_POSITION",                                                                /* Gives the visual-context item a stable local ID. */
      informationType: "STARTING_POSITION",                                                        /* Classifies the diagram information. */
      normalisedContent: "The labelled car begins below the central pivot.",                       /* Records the visual fact in words. */
      value: null,                                                                                 /* No single numeric value belongs to this fact. */
      unit: null,                                                                                  /* No unit belongs to this fact. */
      source: "DIAGRAM",                                                                           /* Records that the fact comes from the schematic. */
      explicitness: "EXPLICIT",                                                                    /* The labelled starting position is directly shown. */
      role: "CONTEXT",                                                                             /* The fact supports interpretation of the model setting. */
      visualElementId: "N5_MATH_2025_P2_Q14_VISUAL_DIAGRAM",                                      /* Links directly to the schematic visual. */
    },                                                                                             /* Closes the starting-position visual item. */
  ],                                                                                               /* Closes the normalised Question information. */

  reasoning: {                                                                                     /* Opens reasoning-demand analysis. */
    reasoningTypes: ["REVERSE_REASONING", "MULTI_STAGE", "REPRESENTATION_TRANSLATION", "SOLUTION_FILTERING"], /* Records the main reasoning demands. */
    overallDifficulty: "HIGH",                                                                     /* Rates the overall demand as high for this Course. */
    methodSelectionLoad: "LOW",                                                                    /* The supplied model strongly suggests the method. */
    arithmeticLoad: "LOW",                                                                         /* The numerical rearrangement is light. */
    algebraicLoad: "MEDIUM",                                                                       /* The candidate must isolate the cosine term correctly. */
    representationLoad: "LOW",                                                                     /* The picture is not needed to decode the mathematics. */
    reasoningDepth: "HIGH",                                                                        /* Two valid quadrant solutions must be produced consistently. */
    dependencyCount: 3,                                                                            /* Counts the main dependencies after substitution. */
  },                                                                                               /* Closes reasoning-demand analysis. */

  numbers: {                                                                                       /* Opens the broad number profile. */
    numberTypes: ["INTEGER", "FRACTION", "NEGATIVE", "DECIMAL"],                                  /* Records source, rearranged and approximate solution values. */
    nonCalculatorFriendly: false,                                                                  /* Inverse cosine makes calculator use natural. */
    exactAndApproximateMixed: true,                                                                /* Exact rearrangement leads to approximate angle values. */
    magnitudeNotes: "Small model parameters produce angles across a full 360-degree rotation.",   /* Summarises the useful magnitude pattern. */
  },                                                                                               /* Closes the broad number profile. */

  parameterDesign: {                                                                               /* Opens generator-facing value-design analysis. */
    deliberatelyConstructedValues: true,                                                          /* The values create a simple isolated cosine fraction and two solutions. */
    exactResultDesigned: false,                                                                    /* The final angles are not intended as exact special angles. */
    roundingDesigned: false,                                                                       /* The prompt gives no fixed rounding instruction. */
    factorisableDesigned: false,                                                                   /* Factorisation is not part of the mathematics. */
    perfectSquareDesigned: false,                                                                  /* Perfect-square structure is not relevant. */
    pythagoreanTripleUsed: false,                                                                  /* No Pythagorean triple is involved. */
    niceRatioUsed: true,                                                                           /* Rearrangement produces the simple ratio -3/8. */
    validSolutionCountDesigned: 2,                                                                 /* The selected target gives two valid angles in one rotation. */
    parameterConstraints: [                                                                        /* Opens generation constraints. */
      "Target height must lie within the model's physical height range.",                          /* Prevents impossible target heights. */
      "For the same quadrant structure, the isolated cosine value should lie strictly between -1 and 0.", /* Preserves second- and third-quadrant solutions. */
      "The angular domain should represent one complete rotation without duplicating the endpoint.",/* Preserves the two-solution structure. */
      "Avoid special-angle targets when non-trivial inverse-trig calculation is intended.",       /* Preserves comparable calculator demand. */
    ],                                                                                             /* Closes generation constraints. */
    safeVariationAxes: ["vertical shift", "amplitude magnitude", "target height", "ride context"],/* Records safe dimensions for future variation. */
    invariantRelationships: [                                                                      /* Opens family-defining relationships. */
      "A supplied cosine model links height to angular position.",                                 /* Preserves the periodic-model structure. */
      "The target produces two valid solutions in one rotation.",                                 /* Preserves the response structure. */
      "The final solutions require inverse trig plus related-angle reasoning.",                    /* Preserves the intended demand. */
    ],                                                                                             /* Closes family-defining relationships. */
  },                                                                                               /* Closes generator-facing value-design analysis. */

  answerSpecification: {                                                                           /* Opens final-answer requirements. */
    answerForm: "APPROXIMATE",                                                                     /* The required angles are naturally decimal approximations. */
    simplestFormRequired: false,                                                                   /* Simplest-form language is not relevant. */
    rationalDenominatorRequired: false,                                                            /* Rationalising a denominator is not relevant. */
    positivePowersRequired: false,                                                                 /* Positive-power form is not relevant. */
    scientificNotationRequired: false,                                                             /* Scientific notation is not relevant. */
    precisionType: "NONE",                                                                         /* The Question gives no explicit rounding instruction. */
    precisionValue: null,                                                                          /* No precision amount is specified. */
    units: {                                                                                        /* Opens angle-unit expectations. */
      dimension: "angle",                                                                          /* Records the physical quantity type. */
      unitSymbol: "°",                                                                              /* Records degrees as the intended unit. */
      conversionRequired: false,                                                                   /* No unit conversion is required. */
      unitsExplicitlyRequested: false,                                                             /* The Question defines x in degrees but does not separately demand the symbol. */
    },                                                                                             /* Closes angle-unit expectations. */
    multipleAnswersRequired: 2,                                                                    /* Records that exactly two values are requested. */
    domainRestriction: "0 <= x < 360",                                                             /* Stores the permitted one-rotation domain. */
    contextualWordsRequired: false,                                                                /* No contextual sentence is required in the final response. */
    coordinateOrderRelevant: false,                                                                /* Coordinates are not part of the answer. */
    bracketsRelevant: false,                                                                       /* Bracket notation is not part of the final answer. */
  },                                                                                               /* Closes final-answer requirements. */

  context: {                                                                                       /* Opens real-world context analysis. */
    contextualised: true,                                                                          /* Confirms the Question uses a real-world setting. */
    contextDomain: "theme park ride",                                                              /* Records the broad setting. */
    contextRole: "MODEL_DEFINING",                                                                 /* The rotating ride gives meaning to the periodic model. */
    namedPeoplePresent: false,                                                                     /* No named person appears. */
    currencyPresent: false,                                                                        /* Money is not part of the Question. */
    realWorldUnitsPresent: true,                                                                   /* Height is measured in metres and angle in degrees. */
    realismConstrainsAnswer: true,                                                                 /* One-rotation motion constrains the valid angle set. */
  },                                                                                               /* Closes real-world context analysis. */

  language: {                                                                                      /* Opens language and wording analysis. */
    informationDensity: "MEDIUM",                                                                  /* Several linked facts are presented without excessive text. */
    scaffoldingLevel: "LOW",                                                                       /* The wording supplies the model but not the solving method. */
    bulletStructureUsed: false,                                                                    /* The main information is written in sentences and a displayed model. */
    naturalLanguageInterpretationRequired: true,                                                  /* The target height must be connected back to the model. */
    promptSummary: "A rotating ride is modelled by a cosine height function; find the two angles giving a stated height.", /* Paraphrases the task. */
    styleNotes: "The Question uses both a real photograph and a simple schematic before presenting the model.", /* Records the notable surface style. */
  },                                                                                               /* Closes language and wording analysis. */

  visuals: catalogueValue({                                                                        /* Opens the reviewed visual-evidence profile. */
    elements: [                                                                                     /* Opens the ordered visual elements. */
      {                                                                                             /* Opens the contextual photograph element. */
        id: "N5_MATH_2025_P2_Q14_VISUAL_PHOTO",                                                   /* Gives the photograph its stable visual ID. */
        visualType: "PHOTO_OR_REALISTIC_IMAGE",                                                    /* Records the source as a real-world photograph. */
        roles: ["CONTEXTUAL", "DECORATIVE"],                                                       /* Records its setting and presentation roles. */
        mathematicalDependency: "NOT_REQUIRED",                                                    /* Confirms the mathematics can be solved without the photograph. */
        candidateInteraction: "READ_ONLY",                                                         /* The candidate only views the photograph. */
        textRelationship: "CONTEXT_ONLY",                                                          /* The photograph supplies atmosphere rather than mathematical data. */
        informationDensity: "VERY_LOW",                                                            /* Very little mathematical information is carried by the image. */
        layout: {                                                                                   /* Opens the photograph layout profile. */
          pageNumber: 29,                                                                          /* Records the physical PDF page. */
          pagePosition: "TOP",                                                                     /* Places the photograph near the top of the Question. */
          relativeWidth: "MEDIUM",                                                                 /* Records its approximate source width. */
          relativeHeight: "MEDIUM",                                                                /* Records its approximate source height. */
          orientation: "SQUARE",                                                                   /* Records its roughly square presentation. */
        },                                                                                         /* Closes the photograph layout profile. */
        semanticFacts: [],                                                                         /* Confirms that no mathematical facts need storing from the photo. */
        diagramProfile: notApplicable("This element is a photograph, not a mathematical diagram."),/* Explicitly marks diagram metadata as N/A. */
        graphProfile: notApplicable("This element is not a graph."),                               /* Explicitly marks graph metadata as N/A. */
        contextImageProfile: catalogueValue({                                                      /* Opens the contextual-image profile. */
          subjectCategory: "amusement ride",                                                       /* Gives a broad reusable subject category. */
          primaryObject: "rotating-arm ride",                                                      /* Names the main object generically. */
          sceneType: "real-world theme park photograph",                                           /* Records the scene type without copying source artwork. */
          viewpoint: null,                                                                         /* Viewpoint does not affect the mathematics. */
          measurementsOverlaid: false,                                                             /* No measurements are written on the photograph. */
          labelsOverlaid: false,                                                                   /* No mathematical labels are written on the photograph. */
          orientationRelevant: false,                                                              /* Exact photographic orientation is not mathematically important. */
          relativePositionRelevant: false,                                                         /* Exact object placement is not mathematically important. */
          scaleRelevant: false,                                                                    /* Apparent photographic scale is not used. */
          replaceability: "CONTEXT_ONLY_REPLACEMENT_ACCEPTABLE",                                   /* Any suitable original ride image could replace it. */
          originalGenerationBrief: "Use an original image of a rotating-arm amusement ride as optional context only.", /* Gives a safe replacement brief. */
        }),                                                                                        /* Closes the contextual-image profile. */
        tableProfile: notApplicable("This element is not a table."),                               /* Explicitly marks table metadata as N/A. */
        responseSurfaceProfile: notApplicable("The candidate does not answer on this image."),     /* Explicitly marks response-surface metadata as N/A. */
        sourceEvidence: [photoEvidence],                                                           /* Links the photograph description back to the source page. */
      },                                                                                            /* Closes the contextual photograph element. */
      {                                                                                             /* Opens the rotating-arm schematic element. */
        id: "N5_MATH_2025_P2_Q14_VISUAL_DIAGRAM",                                                 /* Gives the schematic its stable visual ID. */
        visualType: "MATHEMATICAL_DIAGRAM",                                                       /* Records the source as a simplified mathematical schematic. */
        roles: ["STRUCTURAL_MODEL", "SUPPORTIVE", "CONTEXTUAL"],                                  /* Records its modelling, support and context roles. */
        mathematicalDependency: "NOT_REQUIRED",                                                    /* Confirms the equation can be solved without reading the schematic. */
        candidateInteraction: "READ_ONLY",                                                         /* The candidate only inspects the schematic. */
        textRelationship: "PARTLY_DUPLICATED",                                                     /* Direction is repeated in text while starting position is shown visually. */
        informationDensity: "LOW",                                                                 /* The diagram contains only a few useful semantic facts. */
        layout: {                                                                                   /* Opens the schematic layout profile. */
          pageNumber: 29,                                                                          /* Records the physical PDF page. */
          pagePosition: "MIDDLE",                                                                  /* Places the schematic between the opening context and model. */
          relativeWidth: "MEDIUM",                                                                 /* Records its approximate source width. */
          relativeHeight: "MEDIUM",                                                                /* Records its approximate source height. */
          orientation: "IRREGULAR",                                                                /* Avoids false precision about the schematic shape. */
        },                                                                                         /* Closes the schematic layout profile. */
        semanticFacts: [                                                                           /* Opens facts communicated by the schematic. */
          {                                                                                         /* Opens the starting-position fact. */
            id: "Q14_VISUAL_FACT_START",                                                           /* Gives the visual fact a stable local ID. */
            factType: "POSITION",                                                                  /* Records this as a positional fact. */
            entities: ["car A", "central pivot"],                                                  /* Names the objects involved. */
            normalisedFact: "Car A starts below the central pivot.",                               /* Stores the visual fact in plain language. */
            value: null,                                                                           /* No numeric value is attached. */
            unit: null,                                                                            /* No unit is attached. */
            alsoPresentInText: false,                                                              /* The precise starting position is shown rather than restated. */
            essentialForSolution: false,                                                           /* The supplied equation makes this unnecessary for solving. */
          },                                                                                        /* Closes the starting-position fact. */
          {                                                                                         /* Opens the rotation-direction fact. */
            id: "Q14_VISUAL_FACT_DIRECTION",                                                       /* Gives the direction fact a stable local ID. */
            factType: "DIRECTION",                                                                 /* Records this as a direction fact. */
            entities: ["rotating arm"],                                                            /* Names the moving object. */
            normalisedFact: "The arm rotates clockwise.",                                          /* Stores the direction fact plainly. */
            value: "clockwise",                                                                    /* Stores the direction as structured text. */
            unit: null,                                                                            /* No unit is attached. */
            alsoPresentInText: true,                                                               /* The wording repeats this information. */
            essentialForSolution: false,                                                           /* It is not needed once the supplied model is used. */
          },                                                                                        /* Closes the rotation-direction fact. */
        ],                                                                                         /* Closes facts communicated by the schematic. */
        diagramProfile: catalogueValue({                                                           /* Opens the mathematical-diagram profile. */
          dimension: "2D",                                                                         /* Records a two-dimensional schematic. */
          mathematicalObjects: ["central pivot", "rotating arm", "two endpoint cars", "ground reference", "clockwise arrow"], /* Lists the main objects shown. */
          labelledPoints: [],                                                                      /* No formal mathematical points or vertices are labelled. */
          labelledMeasurements: [],                                                                /* No lengths or angles are labelled on the diagram. */
          relationships: ["OTHER"],                                                                /* The main relationship is rotational rather than a listed geometry relation. */
          shadedRegionsPresent: false,                                                             /* No shaded mathematical region is used. */
          rightAngleMarkersPresent: false,                                                         /* No right-angle markers are shown. */
          arrowsPresent: true,                                                                     /* A curved arrow shows rotation direction. */
          dashedOrHiddenLinesPresent: true,                                                        /* Dashed arm positions show possible rotation positions. */
          intendedToScale: false,                                                                  /* The schematic is not intended for scale measurement. */
          inferredFactsRequired: false,                                                            /* No unlabelled fact must be inferred to solve the Question. */
        }),                                                                                        /* Closes the mathematical-diagram profile. */
        graphProfile: notApplicable("This element is a schematic, not a graph."),                  /* Explicitly marks graph metadata as N/A. */
        contextImageProfile: notApplicable("This element is handled as a mathematical schematic rather than a context image."), /* Explicitly marks picture metadata as N/A. */
        tableProfile: notApplicable("This element is not a table."),                               /* Explicitly marks table metadata as N/A. */
        responseSurfaceProfile: notApplicable("The candidate does not answer on this diagram."),   /* Explicitly marks response-surface metadata as N/A. */
        sourceEvidence: [rideDiagramEvidence],                                                     /* Links the schematic description back to the source page. */
      },                                                                                            /* Closes the rotating-arm schematic element. */
    ],                                                                                              /* Closes the ordered visual elements. */
    visualCount: 2,                                                                                /* Records the photograph and schematic as two distinct visuals. */
    containsEssentialVisualData: false,                                                            /* Confirms that neither visual is required to solve the equation. */
    containsResponseSurface: false,                                                                /* Confirms there is no visual response surface. */
  }),                                                                                               /* Closes the reviewed visual-evidence profile. */

  mathematicalModel: catalogueValue({                                                              /* Opens the reviewed contextual-model profile. */
    modelFamily: "COSINE",                                                                          /* Classifies the supplied periodic model as cosine. */
    normalisedModel: "h = 10 - 8 cos(x°)",                                                         /* Stores the source model in compact mathematical form. */
    independentVariable: "x = angle turned from the starting position, in degrees",                /* Records the meaning of the input variable. */
    dependentVariable: "h = height of car A above the ground, in metres",                          /* Records the meaning of the output variable. */
    physicalOrContextDomain: "one rotation: 0 <= x < 360 degrees",                                 /* Stores the model's meaningful domain. */
    modelProvidedToCandidate: true,                                                                /* Confirms the model is supplied in the Question. */
    candidateMustConstructModel: false,                                                            /* The candidate does not derive the model. */
    candidateMustInterpretModel: true,                                                             /* The target height must be connected to the model. */
    solveForIndependentVariable: true,                                                             /* The task solves backwards for angle. */
    targetDependentValueProvided: true,                                                            /* A target height is supplied. */
    verticalShiftValue: 10,                                                                        /* Stores the model's vertical shift. */
    amplitudeValue: -8,                                                                            /* Stores the signed cosine coefficient. */
    phaseShiftValue: 0,                                                                            /* Records that no phase shift is present. */
    periodValue: 360,                                                                              /* Records the degree-based cosine period. */
    modelParameters: {                                                                             /* Opens additional named model parameters. */
      targetHeight: 13,                                                                            /* Stores the requested height. */
      angleUnit: "degrees",                                                                         /* Stores the intended calculator angle unit. */
    },                                                                                             /* Closes additional named model parameters. */
  }),                                                                                               /* Closes the reviewed contextual-model profile. */

  specialisedProfiles: {                                                                           /* Opens every specialised mathematical profile slot. */
    arithmetic: notApplicable("Arithmetic is supporting work rather than the Question family."),   /* Explicitly marks the arithmetic profile as N/A. */
    percentage: notApplicable("No percentage mathematics is present."),                            /* Explicitly marks the percentage profile as N/A. */
    powersSurdsScientific: notApplicable("No powers, surds or scientific notation are present."),  /* Explicitly marks this profile as N/A. */
    algebra: notApplicable("Algebraic rearrangement is supporting work rather than a separate algebra family."), /* Explicitly marks the algebra profile as N/A. */
    equation: catalogueValue({                                                                      /* Opens the equation-specific profile. */
      equationFamily: "trigonometric equation from a supplied contextual model",                   /* Names the equation family plainly. */
      inequalityPresent: false,                                                                    /* Confirms the task is not an inequality. */
      algebraicMethodRequired: false,                                                              /* The prompt does not explicitly demand an algebraic method. */
      repeatedSubstitutionInvalid: true,                                                           /* The MS limits guess-and-check style substitution to minimal credit. */
      expectedSolutionCount: 2,                                                                    /* Records the intended two solutions. */
      rejectedSolutionReason: "Angles must be consistent with the isolated cosine sign and the one-rotation domain.", /* Records the main validity rule. */
    }),                                                                                            /* Closes the equation-specific profile. */
    function: notApplicable("The model is supplied for solving rather than assessed as a function-analysis task."), /* Explicitly marks function metadata as N/A. */
    statistics: notApplicable("No statistics are present."),                                      /* Explicitly marks statistics metadata as N/A. */
    geometry: notApplicable("The ride diagram is contextual and no geometry calculation is required."), /* Explicitly marks geometry metadata as N/A. */
    trigonometry: catalogueValue({                                                                 /* Opens trigonometry-specific metadata. */
      trigFunctions: ["COS"],                                                                      /* Records cosine as the only trig function used. */
      trigContext: "PERIODIC_MODEL",                                                               /* Records the contextual periodic-model setting. */
      angleUnit: "DEGREES",                                                                        /* Records the intended angle unit. */
      domainStart: 0,                                                                              /* Records the start of the one-rotation domain. */
      domainEnd: 360,                                                                              /* Records the end value of the one-rotation domain. */
      domainEndInclusive: false,                                                                   /* Records that 360 degrees is excluded. */
      isolatedTrigValue: "-3/8",                                                                   /* Stores the exact cosine value after rearranging. */
      inverseTrigRequired: true,                                                                   /* Records the need for inverse cosine. */
      quadrantReasoningRequired: true,                                                             /* Records the need to place solutions in valid quadrants. */
      expectedSolutionQuadrants: ["II", "III"],                                                    /* Records the two valid solution quadrants. */
      secondSolutionRequired: true,                                                                /* Records the need for a second related-angle solution. */
      targetTrigValueSign: "NEGATIVE",                                                             /* Records the sign of the isolated cosine value. */
      radGradSensitivity: true,                                                                    /* The MS explicitly discusses wrong calculator angle modes. */
    }),                                                                                            /* Closes trigonometry-specific metadata. */
    coordinateGeometry: notApplicable("No coordinate geometry is present."),                      /* Explicitly marks coordinate geometry as N/A. */
    vectors: notApplicable("No vector mathematics is present."),                                  /* Explicitly marks vector metadata as N/A. */
  },                                                                                               /* Closes every specialised mathematical profile slot. */

  family: {                                                                                        /* Opens normalised Question-family classification. */
    familyId: "TRIG_CONTEXTUAL_PERIODIC_MODEL_EQUATION",                                           /* Assigns the broad structural Question family. */
    subFamilyId: "COSINE_TWO_SOLUTIONS_ONE_ROTATION",                                              /* Assigns the narrower cosine two-solution family. */
    familyConfidence: "HIGH",                                                                      /* Records strong confidence in this structural family. */
    structuralSignature: [                                                                         /* Opens the family-defining structural signature. */
      "contextual quantity described by a supplied cosine model",                                  /* Records the supplied-model feature. */
      "target dependent value substituted into the model",                                        /* Records the reverse-solving feature. */
      "trig function isolated to a non-special negative value",                                    /* Records the core trig-equation structure. */
      "two valid degree solutions required in one rotation",                                       /* Records the solution structure. */
      "second solution requires related-angle reasoning",                                          /* Records the higher-demand reasoning feature. */
    ],                                                                                             /* Closes the family-defining structural signature. */
    surfaceStyleIds: ["CONTEXT_PHOTO", "SUPPORTIVE_MECHANISM_SCHEMATIC", "SUPPLIED_MODEL"],        /* Records notable presentation styles. */
    relatedFamilyIds: [],                                                                          /* Leaves related families empty until the wider trig catalogue is reviewed. */
  },                                                                                               /* Closes normalised Question-family classification. */

  generation: {                                                                                    /* Opens generator-facing knowledge. */
    readiness: "PARTIAL",                                                                          /* Keeps generation provisional until more family examples are catalogued. */
    linkedGeneratorFamilyIds: [],                                                                  /* No live generator family is linked yet. */
    invariantMathematics: [                                                                        /* Opens mathematics that a generator must preserve. */
      "Use a periodic cosine model with a meaningful one-cycle domain.",                           /* Preserves the model family and domain. */
      "Choose a target producing exactly two valid angle solutions.",                              /* Preserves the response count. */
      "Require inverse trig followed by related-angle reasoning.",                                 /* Preserves the intended solution process. */
      "Keep model parameters physically consistent with the chosen context.",                      /* Preserves contextual validity. */
    ],                                                                                             /* Closes mathematics that a generator must preserve. */
    variableParameters: ["vertical shift", "amplitude", "target height", "context object", "surface illustration"], /* Lists safe generator parameters. */
    parameterConstraints: [                                                                        /* Opens generator parameter rules. */
      "The target must be inside the model's attainable range.",                                   /* Prevents impossible generated questions. */
      "The isolated trig value must remain inside [-1, 1].",                                       /* Prevents invalid inverse-trig inputs. */
      "For this subfamily, use a negative cosine target that produces quadrant II and III solutions.", /* Preserves the tested subfamily. */
      "The two returned angles must both satisfy the stated domain.",                              /* Prevents out-of-domain answers. */
    ],                                                                                             /* Closes generator parameter rules. */
    safeContextVariations: ["rotating observation ride", "mechanical arm ride", "other cyclic vertical motion"], /* Lists safe original contexts. */
    safeRepresentationVariations: ["omit the photograph", "replace the photograph with original artwork", "use an original simple rotating-arm schematic"], /* Lists safe visual changes. */
    unsafeVariations: [                                                                            /* Opens changes that would break the family. */
      "Choose a target at a maximum or minimum if two non-trivial solutions are required.",        /* Avoids collapsing the two-solution structure. */
      "Choose a target outside the model range.",                                                  /* Avoids impossible equations. */
      "Change the angle domain without rechecking the number of valid solutions.",                 /* Avoids hidden changes to answer count. */
      "Reuse or closely recreate the historical source artwork.",                                 /* Protects against copying historical visuals. */
    ],                                                                                             /* Closes changes that would break the family. */
    difficultyControls: [                                                                          /* Opens deliberate demand controls. */
      "Move the isolated cosine value closer to a special angle to reduce numerical demand.",      /* Gives one way to ease the calculation. */
      "Change the sign of the isolated trig value to alter required quadrants.",                   /* Gives one way to alter related-angle demand. */
      "Change how directly the model variables are explained.",                                   /* Gives one way to alter interpretation load. */
      "Vary whether a supportive mechanism diagram is supplied.",                                 /* Gives one way to alter representation support. */
    ],                                                                                             /* Closes deliberate demand controls. */
    requiredValidationChecks: [                                                                    /* Opens required generator checks. */
      "Confirm every model parameter produces the intended physical range.",                       /* Checks model validity. */
      "Confirm the isolated cosine value lies within [-1, 1].",                                    /* Checks inverse-trig validity. */
      "Confirm exactly two intended solutions lie in the domain.",                                 /* Checks answer count. */
      "Confirm the expected solution quadrants match the trig-value sign.",                        /* Checks related-angle logic. */
      "Confirm calculator-mode assumptions are degrees.",                                         /* Checks the intended calculator setting. */
      "Confirm any generated visual is original and not copied from historical artwork.",         /* Checks visual provenance. */
    ],                                                                                             /* Closes required generator checks. */
    provenance: generationProvenance,                                                              /* Marks this section as derived generation analysis. */
  },                                                                                               /* Closes generator-facing knowledge. */

  review: {                                                                                        /* Opens the shared catalogue review record. */
    status: "CATALOGUED",                                                                          /* Records that the first full catalogue pass is complete. */
    reviewedBy: null,                                                                              /* No named human reviewer has approved this entry yet. */
    reviewedAt: null,                                                                              /* No formal human review date is recorded yet. */
    unresolvedIssues: [                                                                            /* Opens remaining review points. */
      "Confirm family and subfamily IDs against the wider trigonometry corpus before Contract V1 is frozen.", /* Records the main taxonomy follow-up. */
      "Confirm the estimated answer-space line count if exact layout measurement is later adopted.", /* Records the minor layout follow-up. */
    ],                                                                                             /* Closes remaining review points. */
    catalogueNotes: ["First full Question Catalogue V1 stress-test entry."],                       /* Records why this entry is being used first. */
  },                                                                                               /* Closes the shared catalogue review record. */

} satisfies ExamQuestionCatalogEntry;                                                              /* Checks the entry against the universal Question Catalogue contract. */