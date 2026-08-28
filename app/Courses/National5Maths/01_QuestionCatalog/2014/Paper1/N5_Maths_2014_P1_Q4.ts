import type { QuestionCatalogEntry } from "../../QuestionCatalogTypes";
import { catalogValue, notApplicable, qpEvidence, questionReviewInProgress, sourceIsolation } from "../../QuestionCatalogHelpers";

const evidence = qpEvidence("4", 4);

export const N5_MATHS_2014_P1_Q4 = {
  // ============================================================================
  // SECTION 1 — IDENTITY
  // ============================================================================
  identity: { id: "N5_MATH_2014_P1_Q4", schemaVersion: "N5_CATALOG_V2", courseId: "N5_MATH", paperContextId: "N5_MATH_2014_P1_CONTEXT", year: 2014, paper: "P1", questionNumber: "4", answerCatalogId: "N5_MATH_2014_P1_Q4_MS" },

  // ============================================================================
  // SECTION 2 — SOURCE LAYOUT
  // ============================================================================
  sourceLayout: { sourcePages: [4], printedPageLabels: ["Page 4"], continuesAcrossPages: false, answerSpace: { category: "LARGE", estimatedWritingLines: 10, responseSurfaceVisualIds: [], separateFinalAnswerAreaPresent: false, notes: "Large blank working area is supplied below the vector prompt." }, sourceEvidence: [evidence] },

  // ============================================================================
  // SECTION 3 — QUESTION STRUCTURE
  // ============================================================================
  structure: { structureType: "SINGLE", totalMarks: 2, parts: [{ id: "Q4_MAIN", label: "", marks: 2, primarySkillId: "geo-g09-vector-components", secondarySkillIds: [], conceptIds: ["geo-g9-1"], topic: "GEO", commandTypes: ["FIND", "EXPRESS"], responseTypes: ["VECTOR"], dependsOnPartIds: [], sharedInformationIds: [], visualElementIds: [] }], dependencyType: "INDEPENDENT", sharedStimulus: false, sharedVisuals: false, sharedGivenData: false, requiredResultProvided: false },

  // ============================================================================
  // SECTION 4 — CURRICULUM
  // ============================================================================
  curriculum: { primaryTopic: "GEO", primarySkillId: "geo-g09-vector-components", secondarySkillIds: [], primaryConceptId: "geo-g9-1", conceptIds: ["geo-g9-1"], paperSuitability: "P1", standardProfile: "C", thinkingProfile: "OPERATIONAL", crossSkillQuestion: false, skillMarkDistribution: { "geo-g09-vector-components": 2 }, conceptMarkDistribution: { "geo-g9-1": 2 } },

  // ============================================================================
  // SECTION 5 — TASK / RESPONSE
  // ============================================================================
  task: { commandTypes: ["FIND", "EXPRESS"], responseTypes: ["VECTOR"], responseCount: 1, explicitMethodCue: false, methodRestricted: false, workingRequestedInPrompt: false, justificationRequested: false, contextualConclusionRequested: false, visualResponseRequired: false },

  // ============================================================================
  // SECTION 6 — MATHEMATICAL STRUCTURE
  // ============================================================================
  mathematics: { primaryGoal: "Evaluate a scalar/vector linear combination and present the resultant in component form.", subgoals: [{ id: "Q4_S1", summary: "Multiply the first vector by the scalar.", dependsOnSubgoalIds: [] }, { id: "Q4_S2", summary: "Subtract the second vector component-wise.", dependsOnSubgoalIds: ["Q4_S1"] }], operationTypes: ["MULTIPLY", "SUBTRACT"], requiredFormulaIds: [], requiredTheoremIds: [], stageCount: 2, intermediateQuantityTypes: ["scaled vector"], methodSelectionRequired: false, solutionCountExpected: 1, validitySelectionRequired: false, representationTransitions: [] },

  // ============================================================================
  // SECTION 7 — INFORMATION
  // ============================================================================
  information: [
    { id: "Q4_INFO_U", informationType: "vector", normalisedContent: "three-component vector u", value: "(-2,3,5)", unit: null, source: "TEXT", explicitness: "EXPLICIT", role: "GIVEN_VALUE", visualElementId: null, usedByPartIds: ["Q4_MAIN"] },
    { id: "Q4_INFO_V", informationType: "vector", normalisedContent: "three-component vector v", value: "(0,-4,7)", unit: null, source: "TEXT", explicitness: "EXPLICIT", role: "GIVEN_VALUE", visualElementId: null, usedByPartIds: ["Q4_MAIN"] },
    { id: "Q4_INFO_TARGET", informationType: "operation", normalisedContent: "calculate 2u-v", value: "2u-v", unit: null, source: "TEXT", explicitness: "EXPLICIT", role: "TARGET", visualElementId: null, usedByPartIds: ["Q4_MAIN"] },
  ],

  // ============================================================================
  // SECTION 8 — REASONING / DIFFICULTY
  // ============================================================================
  reasoning: { reasoningTypes: ["DIRECT_PROCEDURE"], difficulty: { overallDifficulty: "LOW", methodSelectionLoad: "VERY_LOW", arithmeticLoad: "LOW", algebraicLoad: "VERY_LOW", representationLoad: "LOW", languageLoad: "LOW", contextInterpretationLoad: "VERY_LOW", reasoningDepth: "LOW", dependencyCount: 0, difficultyDrivers: ["signed component arithmetic"] } },

  // ============================================================================
  // SECTION 9 — NUMBER / PARAMETER DESIGN
  // ============================================================================
  numbers: { numberTypes: ["INTEGER", "NEGATIVE"], nonCalculatorFriendly: true, exactAndApproximateMixed: false, magnitudeNotes: null },
  parameterDesign: { deliberatelyConstructedValues: true, exactResultDesigned: true, roundingDesigned: false, factorisableDesigned: false, perfectSquareDesigned: false, pythagoreanTripleUsed: false, niceRatioUsed: false, validSolutionCountDesigned: null, parameterConstraints: ["three components remain integer", "at least one negative component is retained to test signed arithmetic"], safeVariationAxes: ["vector components", "scalar multiplier"], invariantRelationships: ["component-wise scalar multiplication followed by vector subtraction"], degeneracyConditionsToAvoid: ["identical vectors/scalars causing all-zero or trivial result"] },
  constraints: { mathematicalDomainConstraints: [], contextValidityConstraints: [], calculatorModeConstraints: ["Non-calculator arithmetic must remain feasible."], methodConstraints: [], presentationConstraints: ["Final response is required in component form."] },

  // ============================================================================
  // SECTION 10 — ANSWER SPECIFICATION
  // ============================================================================
  answerSpecification: { answerForm: "SYMBOLIC", simplestFormRequired: false, rationalDenominatorRequired: false, positivePowersRequired: false, scientificNotationRequired: false, precisionType: "NONE", precisionValue: null, units: { dimension: null, unitSymbol: null, conversionRequired: false, unitsExplicitlyRequested: false }, multipleAnswersRequired: 1, domainRestriction: null, contextualWordsRequired: false, coordinateOrderRelevant: false, bracketsRelevant: false, visualAnswerRequired: false },

  // ============================================================================
  // SECTION 11 — CONTEXT / LANGUAGE
  // ============================================================================
  context: { contextualised: false, contextDomain: null, contextRole: "NONE", namedPeoplePresent: false, currencyPresent: false, realWorldUnitsPresent: false, realismConstrainsAnswer: false, contextObjects: [], contextCanBeSafelyReplaced: true },
  language: { informationDensity: "LOW", scaffoldingLevel: "MEDIUM", bulletStructureUsed: false, naturalLanguageInterpretationRequired: false, promptSummary: "Calculate a scalar multiple of one three-component vector minus another and state the resultant in component form.", styleNotes: null },

  // ============================================================================
  // SECTION 12 — VISUAL EVIDENCE
  // ============================================================================
  visuals: notApplicable("No supplied visual material is used in this Question."),
  mathematicalModel: notApplicable(),

  // ============================================================================
  // SECTION 14 — SPECIALISED MATHEMATICAL PROFILES
  // ============================================================================
  specialisedProfiles: {
    arithmetic: notApplicable(), percentage: notApplicable(), powersSurdsScientific: notApplicable(), algebra: notApplicable(), equationsInequalities: notApplicable(), functionsGraphs: notApplicable(), statistics: notApplicable(), geometryMeasureCircleSimilarity: notApplicable(), trigonometry: notApplicable(), bearings: notApplicable(),
    coordinateGeometry: catalogValue({ coordinateDimension: "3D", midpointRequired: false, gradientRequired: false, distanceRequired: false, lineEquationRequired: false, perpendicularGradientRequired: false, coordinateVectorReasoningRequired: true }, [evidence]),
    vectors: catalogValue({ vectorRepresentationTypes: ["COLUMN_COMPONENT"], vectorAdditionRequired: true, scalarMultipleRequired: true, magnitudeRequired: false, ratioOrSectionRequired: false, geometricVectorReasoningRequired: false, candidateDrawsVector: false }, [evidence]),
  },

  // ============================================================================
  // SECTION 15 — FAMILY / SURFACE / GENERATION
  // ============================================================================
  family: { familyId: "VECTOR_COMPONENT_LINEAR_COMBINATION_3D", subFamilyId: null, familyConfidence: "HIGH", structuralSignature: ["three-component vectors", "scalar multiple", "component-wise subtraction"], surfaceStyleIds: ["COLUMN_VECTOR_NOTATION"], relatedFamilyIds: [] },
  surface: { abstractOrContextual: "ABSTRACT", proseAmount: "LOW", visualAmount: "NONE", layoutComplexity: "LOW", informationOrderCanVarySafely: true, visualPlacementCanVarySafely: true },
  generation: { readiness: "PARTIAL", linkedGeneratorFamilyIds: ["VECTOR_COMPONENT_LINEAR_COMBINATION_3D"], invariantMathematics: ["three-component vector linear combination"], variableParameters: ["vector components", "integer scalar"], parameterConstraints: ["result remains exact and Paper 1 friendly"], safeContextVariations: [], safeRepresentationVariations: [], unsafeVariations: [], difficultyControls: ["negative components", "scalar size"], requiredVisualCapabilities: [], requiredValidationChecks: ["mark total and part structure remain valid", "generated values satisfy all parameter constraints", "required answer form remains attainable without calculator", "generated instance is mathematically non-degenerate"], provenance: "GENERATION_ANALYSIS" },

  // ============================================================================
  // SECTION 16 — SOURCE ISOLATION / REVIEW
  // ============================================================================
  sourceIsolation: sourceIsolation(),
  review: questionReviewInProgress(false),
} satisfies QuestionCatalogEntry;
