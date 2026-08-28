import type { QuestionCatalogEntry } from "../../QuestionCatalogTypes";
import { catalogValue, notApplicable, qpEvidence, questionReviewInProgress, sourceIsolation } from "../../QuestionCatalogHelpers";

const evidence = qpEvidence("8", 9);

export const N5_MATHS_2014_P1_Q8 = {
  // ============================================================================
  // SECTION 1 — IDENTITY / SOURCE
  // ============================================================================
  identity: { id: "N5_MATH_2014_P1_Q8", schemaVersion: "N5_CATALOG_V2", courseId: "N5_MATH", paperContextId: "N5_MATH_2014_P1_CONTEXT", year: 2014, paper: "P1", questionNumber: "8", answerCatalogId: "N5_MATH_2014_P1_Q8_MS" },
  sourceLayout: { sourcePages: [9], printedPageLabels: ["Page 9"], continuesAcrossPages: false, answerSpace: { category: "MEDIUM", estimatedWritingLines: 7, responseSurfaceVisualIds: [], separateFinalAnswerAreaPresent: false, notes: "Compact surd prompt with a normal written working area." }, sourceEvidence: [evidence] },

  // ============================================================================
  // SECTION 3 — STRUCTURE / CURRICULUM / TASK
  // ============================================================================
  structure: { structureType: "SINGLE", totalMarks: 3, parts: [{ id: "Q8_MAIN", label: "", marks: 3, primarySkillId: "num-n1-surds", secondarySkillIds: [], conceptIds: ["num-n1-1"], topic: "NUM", commandTypes: ["EXPRESS", "SIMPLIFY"], responseTypes: ["EXPRESSION"], dependsOnPartIds: [], sharedInformationIds: [], visualElementIds: [] }], dependencyType: "INDEPENDENT", sharedStimulus: false, sharedVisuals: false, sharedGivenData: false, requiredResultProvided: false },
  curriculum: { primaryTopic: "NUM", primarySkillId: "num-n1-surds", secondarySkillIds: [], primaryConceptId: "num-n1-1", conceptIds: ["num-n1-1"], paperSuitability: "P1", standardProfile: "C", thinkingProfile: "OPERATIONAL", crossSkillQuestion: false, skillMarkDistribution: { "num-n1-surds": 3 }, conceptMarkDistribution: { "num-n1-1": 3 } },
  task: { commandTypes: ["EXPRESS", "SIMPLIFY"], responseTypes: ["EXPRESSION"], responseCount: 1, explicitMethodCue: false, methodRestricted: false, workingRequestedInPrompt: false, justificationRequested: false, contextualConclusionRequested: false, visualResponseRequired: false },

  // ============================================================================
  // SECTION 6 — MATHEMATICAL STRUCTURE / INFORMATION
  // ============================================================================
  mathematics: { primaryGoal: "Simplify a sum of surds to one like-surd term.", subgoals: [{ id: "Q8_S1", summary: "Rewrite each non-simplified radical using a perfect-square factor.", dependsOnSubgoalIds: [] }, { id: "Q8_S2", summary: "Collect the resulting like surd terms.", dependsOnSubgoalIds: ["Q8_S1"] }], operationTypes: ["SIMPLIFY", "ADD", "MULTIPLY"], requiredFormulaIds: [], requiredTheoremIds: ["SURD_PRODUCT_RULE"], stageCount: 2, intermediateQuantityTypes: ["simplified like surds"], methodSelectionRequired: false, solutionCountExpected: 1, validitySelectionRequired: false, representationTransitions: [] },
  information: [{ id: "Q8_INFO_EXPR", informationType: "surd expression", normalisedContent: "sum of three terms reducible to a common radical", value: "sqrt(40)+4sqrt(10)+sqrt(90)", unit: null, source: "TEXT", explicitness: "EXPLICIT", role: "GIVEN_VALUE", visualElementId: null, usedByPartIds: ["Q8_MAIN"] }],
  reasoning: { reasoningTypes: ["DIRECT_PROCEDURE", "STRUCTURE_RECOGNITION"], difficulty: { overallDifficulty: "MEDIUM", methodSelectionLoad: "LOW", arithmeticLoad: "LOW", algebraicLoad: "LOW", representationLoad: "VERY_LOW", languageLoad: "LOW", contextInterpretationLoad: "VERY_LOW", reasoningDepth: "MEDIUM", dependencyCount: 0, difficultyDrivers: ["recognising square factors inside radicals", "collecting like surds"] } },

  // ============================================================================
  // SECTION 9 — NUMBER / PARAMETER DESIGN / ANSWER
  // ============================================================================
  numbers: { numberTypes: ["INTEGER", "SURD"], nonCalculatorFriendly: true, exactAndApproximateMixed: false, magnitudeNotes: null },
  parameterDesign: { deliberatelyConstructedValues: true, exactResultDesigned: true, roundingDesigned: false, factorisableDesigned: false, perfectSquareDesigned: true, pythagoreanTripleUsed: false, niceRatioUsed: true, validSolutionCountDesigned: null, parameterConstraints: ["radicands contain perfect-square factors", "all terms simplify to the same base surd", "coefficients remain manageable by hand"], safeVariationAxes: ["base square-free radicand", "square multipliers", "outside coefficient"], invariantRelationships: ["all terms become like surds after simplification"], degeneracyConditionsToAvoid: ["already-like terms that remove the radical simplification step", "complete cancellation unless deliberately intended"] },
  constraints: { mathematicalDomainConstraints: [], contextValidityConstraints: [], calculatorModeConstraints: ["Non-calculator simplification must remain feasible."], methodConstraints: [], presentationConstraints: ["Final surd must be in simplest form."] },
  answerSpecification: { answerForm: "EXACT", simplestFormRequired: true, rationalDenominatorRequired: false, positivePowersRequired: false, scientificNotationRequired: false, precisionType: "NONE", precisionValue: null, units: { dimension: null, unitSymbol: null, conversionRequired: false, unitsExplicitlyRequested: false }, multipleAnswersRequired: 1, domainRestriction: null, contextualWordsRequired: false, coordinateOrderRelevant: false, bracketsRelevant: false, visualAnswerRequired: false },

  // ============================================================================
  // SECTION 11 — CONTEXT / VISUAL / SPECIALISED
  // ============================================================================
  context: { contextualised: false, contextDomain: null, contextRole: "NONE", namedPeoplePresent: false, currencyPresent: false, realWorldUnitsPresent: false, realismConstrainsAnswer: false, contextObjects: [], contextCanBeSafelyReplaced: true },
  language: { informationDensity: "LOW", scaffoldingLevel: "MEDIUM", bulletStructureUsed: false, naturalLanguageInterpretationRequired: false, promptSummary: "Simplify a sum of surds to a single simplest-form surd.", styleNotes: null },
  visuals: notApplicable("No supplied visual material is used in this Question."),
  mathematicalModel: notApplicable(),
  specialisedProfiles: { arithmetic: notApplicable(), percentage: notApplicable(), powersSurdsScientific: catalogValue({ powersPresent: false, surdsPresent: true, scientificNotationPresent: false, rationalisationRequired: false, exactSimplificationRequired: true }, [evidence]), algebra: notApplicable(), equationsInequalities: notApplicable(), functionsGraphs: notApplicable(), statistics: notApplicable(), geometryMeasureCircleSimilarity: notApplicable(), trigonometry: notApplicable(), bearings: notApplicable(), coordinateGeometry: notApplicable(), vectors: notApplicable() },

  // ============================================================================
  // SECTION 15 — FAMILY / GENERATION / REVIEW
  // ============================================================================
  family: { familyId: "NUM_SURDS_SIMPLIFY_AND_COLLECT", subFamilyId: null, familyConfidence: "HIGH", structuralSignature: ["multiple radical terms", "perfect-square extraction", "like-surd collection"], surfaceStyleIds: ["INLINE_SURD_EXPRESSION", "SIMPLEST_FORM_INSTRUCTION"], relatedFamilyIds: [] },
  surface: { abstractOrContextual: "ABSTRACT", proseAmount: "LOW", visualAmount: "NONE", layoutComplexity: "LOW", informationOrderCanVarySafely: true, visualPlacementCanVarySafely: true },
  generation: { readiness: "PARTIAL", linkedGeneratorFamilyIds: ["NUM_SURDS_SIMPLIFY_AND_COLLECT"], invariantMathematics: ["radicals simplify to common square-free base"], variableParameters: ["base radicand", "square factors", "term coefficients"], parameterConstraints: ["exact Paper 1 arithmetic", "non-trivial simplification remains"], safeContextVariations: [], safeRepresentationVariations: ["term order"], unsafeVariations: ["radicands that do not simplify to like surds"], difficultyControls: ["number of radical simplifications", "coefficient signs and size"], requiredVisualCapabilities: [], requiredValidationChecks: ["generated terms reduce to intended common surd", "exact answer remains non-calculator friendly", "instance is non-degenerate"], provenance: "GENERATION_ANALYSIS" },
  sourceIsolation: sourceIsolation(),
  review: questionReviewInProgress(false),
} satisfies QuestionCatalogEntry;
