import type { QuestionCatalogEntry } from "../../QuestionCatalogTypes";
import { catalogValue, notApplicable, qpEvidence, questionReviewInProgress, sourceIsolation, visualOriginality, visualValidation } from "../../QuestionCatalogHelpers";

const evidence = qpEvidence("1", 19, "QUESTION", "P2", 3);

export const N5_MATHS_2014_P2_Q1 = {
  // ============================================================================
  // SECTION 1 — IDENTITY / SOURCE
  // ============================================================================
  identity: { id: "N5_MATH_2014_P2_Q1", schemaVersion: "N5_CATALOG_V2", courseId: "N5_MATH", paperContextId: "N5_MATH_2014_P2_CONTEXT", year: 2014, paper: "P2", questionNumber: "1", answerCatalogId: "N5_MATH_2014_P2_Q1_MS" },
  sourceLayout: { sourcePages: [
  19
], printedPageLabels: [
  "Page 3"
], continuesAcrossPages: false, answerSpace: {
  "category": "MEDIUM",
  "estimatedWritingLines": 5,
  "responseSurfaceVisualIds": [],
  "separateFinalAnswerAreaPresent": false,
  "measurementMethod": "PDF_RENDER",
  "sourceMeasurements": [
    {
      "id": "Q1_SPACE_MAIN",
      "regionType": "WRITTEN_WORKING",
      "questionPartIds": [
        "Q1_MAIN"
      ],
      "pdfPageNumber": 19,
      "printedPageLabel": "Page 3",
      "measurementMethod": "PDF_RENDER",
      "renderDpi": 300,
      "pageWidthPx": 2481,
      "pageHeightPx": 3508,
      "topPx": 577,
      "bottomPx": 1355,
      "leftPx": null,
      "rightPx": null,
      "heightPx": 778,
      "widthPx": null,
      "topPt": 138.48,
      "bottomPt": 325.2,
      "leftPt": null,
      "rightPt": null,
      "heightPt": 186.72,
      "widthPt": null,
      "heightMm": 65.87,
      "widthMm": null,
      "boundaryConvention": "Bottom of the final nearest-ten instruction to the top of the [Turn over] marker.",
      "notes": null
    }
  ],
  "notes": "A large working area follows the compound-decrease prompt."
}, sourceEvidence: [evidence] },

  // ============================================================================
  // SECTION 3 — STRUCTURE / CURRICULUM / TASK
  // ============================================================================
  structure: { structureType: "SINGLE", totalMarks: 3, parts: [
  {
    "id": "Q1_MAIN",
    "label": "",
    "marks": 3,
    "primarySkillId": "num-n4-appreciation-depreciation",
    "secondarySkillIds": [],
    "conceptIds": [
      "num-n4-2-depreciation"
    ],
    "topic": "NUM",
    "commandTypes": [
      "CALCULATE"
    ],
    "responseTypes": [
      "NUMBER"
    ],
    "dependsOnPartIds": [],
    "sharedInformationIds": [],
    "visualElementIds": [],
    "standardProfile": "C",
    "thinkingProfile": "OPERATIONAL",
    "calculatorBurden": "CALCULATOR_NATURAL"
  }
], dependencyType: "INDEPENDENT", sharedStimulus: false, sharedVisuals: false, sharedGivenData: false, requiredResultProvided: false },
  curriculum: {
  "primaryTopic": "NUM",
  "primarySkillId": "num-n4-appreciation-depreciation",
  "secondarySkillIds": [],
  "primaryConceptId": "num-n4-2-depreciation",
  "conceptIds": [
    "num-n4-2-depreciation"
  ],
  "paperSuitability": "P2",
  "standardProfile": "C",
  "thinkingProfile": "OPERATIONAL",
  "crossSkillQuestion": false,
  "skillMarkDistribution": {
    "num-n4-appreciation-depreciation": 3
  },
  "conceptMarkDistribution": {
    "num-n4-2-depreciation": 3
  }
},
  task: {
  "commandTypes": [
    "CALCULATE"
  ],
  "responseTypes": [
    "NUMBER"
  ],
  "responseCount": 1,
  "explicitMethodCue": false,
  "methodRestricted": false,
  "workingRequestedInPrompt": false,
  "justificationRequested": false,
  "contextualConclusionRequested": false,
  "visualResponseRequired": false
},

  // ============================================================================
  // SECTION 6 — MATHEMATICAL STRUCTURE / INFORMATION / DEMAND
  // ============================================================================
  mathematics: {
  "primaryGoal": "Apply repeated percentage decrease for three annual periods and round the resulting population to the nearest ten.",
  "subgoals": [
    {
      "id": "Q1_S1",
      "summary": "Convert the annual decrease into a multiplicative retention factor.",
      "dependsOnSubgoalIds": []
    },
    {
      "id": "Q1_S2",
      "summary": "Apply the factor for three years.",
      "dependsOnSubgoalIds": [
        "Q1_S1"
      ]
    },
    {
      "id": "Q1_S3",
      "summary": "Round the resulting expected roll to the nearest ten.",
      "dependsOnSubgoalIds": [
        "Q1_S2"
      ]
    }
  ],
  "operationTypes": [
    "MULTIPLY",
    "EVALUATE"
  ],
  "requiredFormulaIds": [],
  "requiredTheoremIds": [],
  "stageCount": 3,
  "intermediateQuantityTypes": [
    "annual multiplier",
    "unrounded three-year value"
  ],
  "methodSelectionRequired": false,
  "solutionCountExpected": 1,
  "validitySelectionRequired": false,
  "representationTransitions": []
},
  information: [
  {
    "id": "Q1_INFO_START",
    "informationType": "starting value",
    "normalisedContent": "initial school roll is 964 pupils",
    "value": 964,
    "unit": "pupils",
    "source": "TEXT",
    "explicitness": "EXPLICIT",
    "role": "GIVEN_VALUE",
    "visualElementId": null,
    "usedByPartIds": [
      "Q1_MAIN"
    ]
  },
  {
    "id": "Q1_INFO_RATE",
    "informationType": "percentage decrease",
    "normalisedContent": "roll decreases by 15 percent per year",
    "value": 15,
    "unit": "percent",
    "source": "TEXT",
    "explicitness": "EXPLICIT",
    "role": "RELATIONSHIP",
    "visualElementId": null,
    "usedByPartIds": [
      "Q1_MAIN"
    ]
  },
  {
    "id": "Q1_INFO_YEARS",
    "informationType": "period count",
    "normalisedContent": "forecast covers three years",
    "value": 3,
    "unit": "years",
    "source": "TEXT",
    "explicitness": "EXPLICIT",
    "role": "CONSTRAINT",
    "visualElementId": null,
    "usedByPartIds": [
      "Q1_MAIN"
    ]
  },
  {
    "id": "Q1_INFO_ROUND",
    "informationType": "rounding instruction",
    "normalisedContent": "final expected roll is required to the nearest ten",
    "value": 10,
    "unit": "pupils",
    "source": "TEXT",
    "explicitness": "EXPLICIT",
    "role": "RESPONSE_INSTRUCTION",
    "visualElementId": null,
    "usedByPartIds": [
      "Q1_MAIN"
    ]
  }
],
  reasoning: {
  "reasoningTypes": [
    "DIRECT_PROCEDURE",
    "MULTI_STAGE"
  ],
  "difficulty": {
    "overallDifficulty": "LOW",
    "methodSelectionLoad": "VERY_LOW",
    "arithmeticLoad": "MEDIUM",
    "algebraicLoad": "VERY_LOW",
    "representationLoad": "VERY_LOW",
    "languageLoad": "LOW",
    "contextInterpretationLoad": "VERY_LOW",
    "reasoningDepth": "LOW",
    "dependencyCount": 0,
    "difficultyDrivers": [
      "compound rather than one-off percentage decrease",
      "final rounding"
    ]
  }
},
  numbers: {
  "numberTypes": [
    "INTEGER",
    "PERCENTAGE",
    "DECIMAL"
  ],
  "nonCalculatorFriendly": false,
  "exactAndApproximateMixed": true,
  "magnitudeNotes": null,
  "simplificationVisibility": "NOT_APPLICABLE",
  "expectedFinalValueForm": "INTEGER",
  "intermediateValueSize": "MEDIUM",
  "finalValueSize": "MEDIUM",
  "dominantInputFormat": "INTEGER",
  "dominantOutputFormat": "INTEGER"
},
  calculator: {
  "status": "CALCULATOR_ALLOWED",
  "burden": "CALCULATOR_NATURAL",
  "requiredFunctions": [
    "powers"
  ],
  "modeSensitive": false,
  "modeRequirements": [],
  "notes": "The repeated decimal multiplier is naturally evaluated with a calculator, although the mathematical structure is not calculator-specific."
},
  parameterDesign: {
  "deliberatelyConstructedValues": true,
  "exactResultDesigned": false,
  "roundingDesigned": true,
  "factorisableDesigned": false,
  "perfectSquareDesigned": false,
  "pythagoreanTripleUsed": false,
  "niceRatioUsed": false,
  "validSolutionCountDesigned": null,
  "parameterConstraints": [
    "annual rate is between 0 and 100 percent",
    "period count is a small positive integer",
    "unrounded final value should give a meaningful nearest-ten rounding decision"
  ],
  "safeVariationAxes": [
    "starting population",
    "decrease rate",
    "period count",
    "rounding unit"
  ],
  "invariantRelationships": [
    "compound decrease is applied to the updated value each year"
  ],
  "degeneracyConditionsToAvoid": [
    "rate 0 or 100 percent",
    "values chosen so repeated decrease can be mistaken for a single subtraction without changing result"
  ]
},
  constraints: {
  "mathematicalDomainConstraints": [],
  "contextValidityConstraints": [
    "Expected roll must be non-negative."
  ],
  "calculatorModeConstraints": [
    "Calculator use is permitted on Paper 2."
  ],
  "methodConstraints": [],
  "presentationConstraints": [
    "Final value is rounded to the nearest ten."
  ]
},
  answerSpecification: {
  "answerForm": "APPROXIMATE",
  "simplestFormRequired": false,
  "rationalDenominatorRequired": false,
  "positivePowersRequired": false,
  "scientificNotationRequired": false,
  "precisionType": "NEAREST_UNIT",
  "precisionValue": 10,
  "units": {
    "dimension": "count",
    "unitSymbol": "pupils",
    "conversionRequired": false,
    "unitsExplicitlyRequested": false
  },
  "multipleAnswersRequired": 1,
  "domainRestriction": null,
  "contextualWordsRequired": false,
  "coordinateOrderRelevant": false,
  "bracketsRelevant": false,
  "visualAnswerRequired": false
},
  context: {
  "contextualised": true,
  "contextDomain": "school population",
  "contextRole": "MATHEMATICALLY_RELEVANT",
  "namedPeoplePresent": false,
  "currencyPresent": false,
  "realWorldUnitsPresent": true,
  "realismConstrainsAnswer": false,
  "contextObjects": [
    "school roll",
    "pupils"
  ],
  "contextCanBeSafelyReplaced": true
},
  language: {
  "informationDensity": "MEDIUM",
  "scaffoldingLevel": "MEDIUM",
  "bulletStructureUsed": false,
  "naturalLanguageInterpretationRequired": true,
  "promptSummary": "A school population is forecast to decrease by a fixed percentage each year; calculate the expected value after three years and round to the nearest ten.",
  "styleNotes": null,
  "promptStructure": {
    "sentenceCount": 4,
    "promptWordCount": 39,
    "introductionStyle": "CURRENT_COUNT_INTRODUCED_IN_NAMED_INSTITUTION_CONTEXT",
    "relationshipStatementStyle": "SEPARATE_FORECAST_SENTENCE_STATING_ANNUAL_PERCENTAGE_DECREASE",
    "commandStyle": "QUESTION_FORM_FUTURE_VALUE_REQUEST_WITH_SEPARATE_ROUNDING_INSTRUCTION",
    "temporalStructure": "YEAR_ON_YEAR",
    "informationOrder": [
      "CURRENT_COUNT",
      "CONTEXT",
      "ANNUAL_DECREASE",
      "PERIOD_COUNT",
      "FUTURE_VALUE_TARGET",
      "ROUNDING_INSTRUCTION"
    ],
    "normalisedPromptStructure": [
      "Introduce the current population count in context.",
      "State a repeated annual percentage decrease.",
      "Ask for the quantity after a specified number of years.",
      "State a separate final rounding requirement."
    ],
    "usesPronounReference": true,
    "lexicalFeatureTags": [
      "forecast language",
      "annual change",
      "count context",
      "explicit rounding"
    ],
    "generatorVariationNotes": "Vary institution/population context, initial value, decrease rate, period count and rounding target while preserving compound rather than fixed-amount change."
  }
},

  // ============================================================================
  // SECTION 12 — VISUAL EVIDENCE
  // ============================================================================
  visuals: notApplicable("No supplied visual material is used in this Question."),

  // ============================================================================
  // SECTION 13 — MODEL / SPECIALISED PROFILES
  // ============================================================================
  mathematicalModel: notApplicable(),
  specialisedProfiles: {
      arithmetic: notApplicable(),
      percentage: catalogValue({
  "relationshipType": "COMPOUND",
  "percentageValues": [
    15
  ],
  "multiplierValues": [
    0.85
  ],
  "periods": 3,
  "originalValueKnown": true,
  "finalValueKnown": false,
  "reverseCalculationRequired": false,
  "expressionStyles": [
    "ANNUAL_CHANGE"
  ],
  "knownValueRoles": [
    "INITIAL_VALUE"
  ],
  "requestedValueRole": "FINAL_VALUE",
  "workingStepCount": 1,
  "inverseCalculationProducesExactResult": false,
  "compoundRateStructure": "FIXED_RATE",
  "compoundStages": [
    {
      "percentageValue": 15,
      "multiplier": 0.85,
      "periods": 3
    }
  ],
  "totalPeriods": 3
}, [evidence], "CATALOGUE_CLASSIFICATION", "HIGH", null),
      powersSurdsScientific: notApplicable(),
      algebra: notApplicable(),
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
  "familyId": "NUM_COMPOUND_PERCENTAGE_DECREASE_WITH_ROUNDING",
  "subFamilyId": null,
  "familyConfidence": "HIGH",
  "structuralSignature": [
    "starting amount",
    "fixed annual percentage decrease",
    "multiple periods",
    "rounded final value"
  ],
  "surfaceStyleIds": [
    "CONTEXTUAL_COMPOUND_PERCENTAGE",
    "EXPLICIT_ROUNDING"
  ],
  "relatedFamilyIds": []
},
  surface: {
  "abstractOrContextual": "CONTEXTUAL",
  "proseAmount": "MEDIUM",
  "visualAmount": "NONE",
  "layoutComplexity": "LOW",
  "informationOrderCanVarySafely": true,
  "visualPlacementCanVarySafely": true
},
  generation: {
  "readiness": "PARTIAL",
  "linkedGeneratorFamilyIds": [
    "NUM_COMPOUND_PERCENTAGE_DECREASE_WITH_ROUNDING"
  ],
  "invariantMathematics": [
    "compound percentage decrease over several periods",
    "final contextual rounding"
  ],
  "variableParameters": [
    "starting value",
    "percentage rate",
    "period count",
    "rounding unit"
  ],
  "parameterConstraints": [
    "rate and periods produce sensible positive result",
    "rounding remains non-trivial"
  ],
  "safeContextVariations": [
    "population decline",
    "asset depreciation",
    "membership decline",
    "resource reduction"
  ],
  "safeRepresentationVariations": [],
  "unsafeVariations": [],
  "difficultyControls": [
    "number of periods",
    "percentage complexity",
    "rounding precision"
  ],
  "requiredVisualCapabilities": [],
  "requiredValidationChecks": [
    "mark total and part structure remain valid",
    "generated values satisfy all parameter constraints",
    "required answer form remains attainable",
    "generated instance is mathematically non-degenerate"
  ],
  "provenance": "GENERATION_ANALYSIS"
},

  // ============================================================================
  // SECTION 16 — SOURCE ISOLATION / REVIEW
  // ============================================================================
  sourceIsolation: sourceIsolation(),
  review: questionReviewInProgress(false, "P2"),
} satisfies QuestionCatalogEntry;
