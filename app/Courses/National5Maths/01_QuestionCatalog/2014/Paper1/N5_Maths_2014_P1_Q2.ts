import type { QuestionCatalogEntry } from "../../QuestionCatalogTypes";
import type { VisualEvidenceProfile } from "../../../05_VisualAssets/VisualCatalogTypes";
import { catalogValue, notApplicable, qpEvidence, questionReviewInProgress, sourceIsolation, visualOriginality, visualValidation } from "../../QuestionCatalogHelpers";

const evidence = qpEvidence("2", 3);

export const N5_MATHS_2014_P1_Q2 = {
  // ============================================================================
  // SECTION 1 — IDENTITY
  // ============================================================================
  identity: {
    id: "N5_MATH_2014_P1_Q2",
    schemaVersion: "N5_CATALOG_V2",
    courseId: "N5_MATH",
    paperContextId: "N5_MATH_2014_P1_CONTEXT",
    year: 2014,
    paper: "P1",
    questionNumber: "2",
    answerCatalogId: "N5_MATH_2014_P1_Q2_MS",
  },

  // ============================================================================
  // SECTION 2 — SOURCE LAYOUT
  // ============================================================================
  sourceLayout: {
    sourcePages: [3],
    printedPageLabels: ["Page 3"],
    continuesAcrossPages: false,
    answerSpace: {
      "category": "LARGE",
      "estimatedWritingLines": 7,
      "responseSurfaceVisualIds": [],
      "separateFinalAnswerAreaPresent": false,
      "notes": "Large blank working area is supplied beneath the algebraic expression. Exact usable height is now measured from the original PDF; footer/turn-over furniture is excluded.",
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurements": [{
        "id": "Q2_SPACE_1",
        "regionType": "WRITTEN_WORKING",
        "questionPartIds": ["Q2_MAIN"],
        "pdfPageNumber": 3,
        "printedPageLabel": "Page 3",
        "measurementMethod": "PDF_RENDER",
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 1836,
        "bottomPx": 3028,
        "leftPx": null,
        "rightPx": null,
        "heightPx": 1192,
        "widthPx": null,
        "topPt": 440.666,
        "bottomPt": 726.611,
        "leftPt": null,
        "rightPt": null,
        "heightPt": 285.945,
        "widthPt": null,
        "heightMm": 100.88,
        "widthMm": null,
        "boundaryConvention": "Upper boundary = lowest edge of the displayed algebraic expression; lower boundary = top edge of [Turn over] marker. Horizontal extent is not objectively boxed in the source and is therefore not measured.",
        "notes": "Measured on the original question-paper PDF rendered at 300 dpi; page furniture and marks-margin content are excluded from usable pupil response space."
      }]
    },
    sourceEvidence: [evidence],
  },

  // ============================================================================
  // SECTION 3 — QUESTION STRUCTURE
  // ============================================================================
  structure: {
    structureType: "SINGLE",
    totalMarks: 2,
    parts: [{
      "id": "Q2_MAIN",
      "label": "",
      "marks": 2,
      "primarySkillId": "alg-a01-expand-brackets",
      "secondarySkillIds": [],
      "conceptIds": ["alg-a1-1"],
      "topic": "ALG",
      "commandTypes": ["EXPAND"],
      "responseTypes": ["EXPRESSION"],
      "dependsOnPartIds": [],
      "sharedInformationIds": [],
      "visualElementIds": [],
      "standardProfile": "C",
      "thinkingProfile": "OPERATIONAL",
      "calculatorBurden": "WRITTEN_NON_CALCULATOR"
    }],
    dependencyType: "INDEPENDENT",
    sharedStimulus: false,
    sharedVisuals: false,
    sharedGivenData: false,
    requiredResultProvided: false,
  },

  // ============================================================================
  // SECTION 4 — CURRICULUM
  // ============================================================================
  curriculum: {
    "primaryTopic": "ALG",
    "primarySkillId": "alg-a01-expand-brackets",
    "secondarySkillIds": [],
    "primaryConceptId": "alg-a1-1",
    "conceptIds": ["alg-a1-1"],
    "paperSuitability": "P1",
    "standardProfile": "C",
    "thinkingProfile": "OPERATIONAL",
    "crossSkillQuestion": false,
    "skillMarkDistribution": {"alg-a01-expand-brackets": 2},
    "conceptMarkDistribution": {"alg-a1-1": 2}
  },

  // ============================================================================
  // SECTION 5 — TASK / RESPONSE
  // ============================================================================
  task: {
    "commandTypes": ["EXPAND"],
    "responseTypes": ["EXPRESSION"],
    "responseCount": 1,
    "explicitMethodCue": false,
    "methodRestricted": false,
    "workingRequestedInPrompt": false,
    "justificationRequested": false,
    "contextualConclusionRequested": false,
    "visualResponseRequired": false
  },

  // ============================================================================
  // SECTION 6 — MATHEMATICAL STRUCTURE
  // ============================================================================
  mathematics: {
    "primaryGoal": "Expand a product of two linear binomials and collect like terms.",
    "subgoals": [
      {"id": "Q2_S1", "summary": "Expand both brackets to produce four terms.", "dependsOnSubgoalIds": []},
      {"id": "Q2_S2", "summary": "Collect like terms to obtain a quadratic expression.", "dependsOnSubgoalIds": ["Q2_S1"]}
    ],
    "operationTypes": ["EXPAND", "SIMPLIFY"],
    "requiredFormulaIds": [],
    "requiredTheoremIds": [],
    "stageCount": 2,
    "intermediateQuantityTypes": ["expanded four-term expression"],
    "methodSelectionRequired": false,
    "solutionCountExpected": 1,
    "validitySelectionRequired": false,
    "representationTransitions": []
  },

  // ============================================================================
  // SECTION 7 — INFORMATION
  // ============================================================================
  information: [{
    "id": "Q2_INFO_EXPR",
    "informationType": "expression",
    "normalisedContent": "product of two linear binomials",
    "value": "(2x-5)(3x+1)",
    "unit": null,
    "source": "TEXT",
    "explicitness": "EXPLICIT",
    "role": "GIVEN_VALUE",
    "visualElementId": null,
    "usedByPartIds": ["Q2_MAIN"]
  }],

  // ============================================================================
  // SECTION 8 — REASONING / DIFFICULTY
  // ============================================================================
  reasoning: {
    "reasoningTypes": ["DIRECT_PROCEDURE"],
    "difficulty": {
      "overallDifficulty": "LOW",
      "methodSelectionLoad": "VERY_LOW",
      "arithmeticLoad": "LOW",
      "algebraicLoad": "LOW",
      "representationLoad": "VERY_LOW",
      "languageLoad": "LOW",
      "contextInterpretationLoad": "VERY_LOW",
      "reasoningDepth": "LOW",
      "dependencyCount": 0,
      "difficultyDrivers": ["sign handling during double-bracket expansion"]
    }
  },

  // ============================================================================
  // SECTION 8B — CALCULATOR DEMAND
  // ============================================================================
  calculator: {
    "status": "NON_CALCULATOR",
    "burden": "WRITTEN_NON_CALCULATOR",
    "requiredFunctions": [],
    "modeSensitive": false,
    "modeRequirements": [],
    "notes": "Historical 2014 Paper 1 explicitly prohibits calculator use; this profile records the burden of the actual Question instance rather than Skills-Tree suitability."
  },

  // ============================================================================
  // SECTION 9 — NUMBER / PARAMETER DESIGN
  // ============================================================================
  numbers: {
    "numberTypes": ["INTEGER", "NEGATIVE", "ALGEBRAIC"],
    "nonCalculatorFriendly": true,
    "exactAndApproximateMixed": false,
    "magnitudeNotes": null,
    "simplificationVisibility": "NOT_APPLICABLE",
    "expectedFinalValueForm": "ALGEBRAIC_EXPRESSION",
    "intermediateValueSize": "SMALL",
    "finalValueSize": "SMALL",
    "dominantInputFormat": "ALGEBRAIC",
    "dominantOutputFormat": "ALGEBRAIC"
  },
  parameterDesign: {
    "deliberatelyConstructedValues": true,
    "exactResultDesigned": true,
    "roundingDesigned": false,
    "factorisableDesigned": false,
    "perfectSquareDesigned": false,
    "pythagoreanTripleUsed": false,
    "niceRatioUsed": false,
    "validSolutionCountDesigned": null,
    "parameterConstraints": ["coefficients remain integer", "expansion produces a meaningful like-term collection step"],
    "safeVariationAxes": ["linear coefficients", "constant signs"],
    "invariantRelationships": ["product of two non-trivial linear binomials"],
    "degeneracyConditionsToAvoid": ["zero coefficient that collapses a bracket", "like terms cancel so completely that intended structure disappears"]
  },
  constraints: {
    "mathematicalDomainConstraints": [],
    "contextValidityConstraints": [],
    "calculatorModeConstraints": ["Non-calculator arithmetic must remain feasible."],
    "methodConstraints": [],
    "presentationConstraints": []
  },

  // ============================================================================
  // SECTION 10 — ANSWER SPECIFICATION
  // ============================================================================
  answerSpecification: {
    "answerForm": "SYMBOLIC",
    "simplestFormRequired": false,
    "rationalDenominatorRequired": false,
    "positivePowersRequired": false,
    "scientificNotationRequired": false,
    "precisionType": "NONE",
    "precisionValue": null,
    "units": {"dimension": null, "unitSymbol": null, "conversionRequired": false, "unitsExplicitlyRequested": false},
    "multipleAnswersRequired": 1,
    "domainRestriction": null,
    "contextualWordsRequired": false,
    "coordinateOrderRelevant": false,
    "bracketsRelevant": false,
    "visualAnswerRequired": false
  },

  // ============================================================================
  // SECTION 11 — CONTEXT / LANGUAGE
  // ============================================================================
  context: {
    "contextualised": false,
    "contextDomain": null,
    "contextRole": "NONE",
    "namedPeoplePresent": false,
    "currencyPresent": false,
    "realWorldUnitsPresent": false,
    "realismConstrainsAnswer": false,
    "contextObjects": [],
    "contextCanBeSafelyReplaced": true
  },
  language: {
    "informationDensity": "LOW",
    "scaffoldingLevel": "MEDIUM",
    "bulletStructureUsed": false,
    "naturalLanguageInterpretationRequired": false,
    "promptSummary": "Expand two linear brackets and collect like terms.",
    "styleNotes": null,
    "promptStructure": {
      "sentenceCount": 1,
      "promptWordCount": 8,
      "introductionStyle": "DIRECT_ALGEBRAIC_MANIPULATION_COMMAND",
      "relationshipStatementStyle": null,
      "commandStyle": "TWO_ACTION_COMMAND_EXPAND_THEN_COLLECT",
      "temporalStructure": "NONE",
      "informationOrder": ["COMMAND", "ALGEBRAIC_EXPRESSION"],
      "normalisedPromptStructure": ["Request expansion of a bracket product.", "Require collection of like terms within the same command."],
      "usesPronounReference": false,
      "lexicalFeatureTags": ["compact", "abstract", "compound command"],
      "generatorVariationNotes": "Vary coefficients, signs and phrasing while retaining a concise expand-and-collect task."
    }
  },

  // ============================================================================
  // SECTION 12 — VISUAL EVIDENCE
  // ============================================================================
  visuals: notApplicable("No supplied visual material is used in this Question."),

  // ============================================================================
  // SECTION 13 — MATHEMATICAL MODEL
  // ============================================================================
  mathematicalModel: notApplicable(),

  // ============================================================================
  // SECTION 14 — SPECIALISED MATHEMATICAL PROFILES
  // ============================================================================
  specialisedProfiles: {
    arithmetic: notApplicable(),
    percentage: notApplicable(),
    powersSurdsScientific: notApplicable(),
    algebra: catalogValue({"expansionRequired": true,"factorisationRequired": false,"completingSquareRequired": false,"rationalExpressionPresent": false,"changeOfSubjectRequired": false}, [evidence], "CATALOGUE_CLASSIFICATION", "HIGH", null),
    equationsInequalities: notApplicable(),
    functionsGraphs: notApplicable(),
    statistics: notApplicable(),
    geometryMeasureCircleSimilarity: notApplicable(),
    trigonometry: notApplicable(),
    bearings: notApplicable(),
    coordinateGeometry: notApplicable(),
    vectors: notApplicable()
  },

  // ============================================================================
  // SECTION 15 — FAMILY / SURFACE / GENERATION
  // ============================================================================
  family: {
    "familyId": "ALG_EXPAND_DOUBLE_BRACKETS",
    "subFamilyId": null,
    "familyConfidence": "HIGH",
    "structuralSignature": ["two linear binomials", "quadratic expansion", "like-term collection"],
    "surfaceStyleIds": ["INLINE_ALGEBRAIC_EXPRESSION"],
    "relatedFamilyIds": []
  },
  surface: {
    "abstractOrContextual": "ABSTRACT",
    "proseAmount": "LOW",
    "visualAmount": "NONE",
    "layoutComplexity": "LOW",
    "informationOrderCanVarySafely": true,
    "visualPlacementCanVarySafely": true
  },
  generation: {
    "readiness": "PARTIAL",
    "linkedGeneratorFamilyIds": ["ALG_EXPAND_DOUBLE_BRACKETS"],
    "invariantMathematics": ["two non-trivial linear brackets", "expanded quadratic output"],
    "variableParameters": ["coefficients", "constant terms", "sign pattern"],
    "parameterConstraints": ["integer arithmetic remains suitable for Paper 1"],
    "safeContextVariations": [],
    "safeRepresentationVariations": [],
    "unsafeVariations": ["zeroed bracket terms that trivialise expansion"],
    "difficultyControls": ["negative signs", "coefficient size"],
    "requiredVisualCapabilities": [],
    "requiredValidationChecks": ["mark total and part structure remain valid","generated values satisfy all parameter constraints","required answer form remains attainable without calculator","generated instance is mathematically non-degenerate"],
    "provenance": "GENERATION_ANALYSIS"
  },

  // ============================================================================
  // SECTION 16 — SOURCE ISOLATION / REVIEW
  // ============================================================================
  sourceIsolation: sourceIsolation(),
  review: questionReviewInProgress(false),
} satisfies QuestionCatalogEntry;
