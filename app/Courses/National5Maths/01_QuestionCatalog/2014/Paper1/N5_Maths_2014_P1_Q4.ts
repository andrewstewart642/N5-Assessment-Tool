import type { QuestionCatalogEntry } from "../../QuestionCatalogTypes";
import type { VisualEvidenceProfile } from "../../../05_VisualAssets/VisualCatalogTypes";
import { catalogValue, notApplicable, qpEvidence, questionReviewInProgress, sourceIsolation, visualOriginality, visualValidation } from "../../QuestionCatalogHelpers";

const evidence = qpEvidence("4", 4);

export const N5_MATHS_2014_P1_Q4 = {
  // ============================================================================
  // SECTION 1 — IDENTITY
  // ============================================================================
  identity: {
    id: "N5_MATH_2014_P1_Q4",
    schemaVersion: "N5_CATALOG_V2",
    courseId: "N5_MATH",
    paperContextId: "N5_MATH_2014_P1_CONTEXT",
    year: 2014,
    paper: "P1",
    questionNumber: "4",
    answerCatalogId: "N5_MATH_2014_P1_Q4_MS",
  },

  // ============================================================================
  // SECTION 2 — SOURCE LAYOUT
  // ============================================================================
  sourceLayout: {
    sourcePages: [4],
    printedPageLabels: ["Page 4"],
    continuesAcrossPages: false,
    answerSpace: {
      category: "LARGE",
      estimatedWritingLines: 9,
      responseSurfaceVisualIds: [],
      separateFinalAnswerAreaPresent: false,
      measurementMethod: "PDF_RENDER",
      sourceMeasurements: [{ id: "Q4_SPACE_1", regionType: "WRITTEN_WORKING", questionPartIds: ["Q4_MAIN"], pdfPageNumber: 4, printedPageLabel: "Page 4", measurementMethod: "PDF_RENDER", renderDpi: 300, pageWidthPx: 2481, pageHeightPx: 3508, topPx: 1746, bottomPx: 3252, leftPx: null, rightPx: null, heightPx: 1506, widthPx: null, topPt: 419.159, bottomPt: 780.449, leftPt: null, rightPt: null, heightPt: 361.29, widthPt: null, heightMm: 127.45, widthMm: null, boundaryConvention: "Upper boundary = final component-form instruction line; lower boundary = top edge of footer barcode/reference region. Horizontal extent is not objectively boxed in the source and is therefore not measured.", notes: "Measured on the original question-paper PDF rendered at 300 dpi; page furniture and marks-margin content are excluded from usable pupil response space." }],
      notes: "Large blank working area is supplied below the vector prompt. Exact usable height is now measured from the original PDF; footer/turn-over furniture is excluded."
    },
    sourceEvidence: [evidence],
  },

  // ============================================================================
  // SECTION 3 — QUESTION STRUCTURE
  // ============================================================================
  structure: {
    structureType: "SINGLE",
    totalMarks: 2,
    parts: [{ id: "Q4_MAIN", label: "", marks: 2, primarySkillId: "geo-g09-vector-components", secondarySkillIds: [], conceptIds: ["geo-g9-1"], topic: "GEO", commandTypes: ["FIND", "EXPRESS"], responseTypes: ["VECTOR"], dependsOnPartIds: [], sharedInformationIds: [], visualElementIds: [], standardProfile: "C", thinkingProfile: "OPERATIONAL", calculatorBurden: "WRITTEN_NON_CALCULATOR" }],
    dependencyType: "INDEPENDENT",
    sharedStimulus: false,
    sharedVisuals: false,
    sharedGivenData: false,
    requiredResultProvided: false,
  },

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
  calculator: { status: "NON_CALCULATOR", burden: "WRITTEN_NON_CALCULATOR", requiredFunctions: [], modeSensitive: false, modeRequirements: [], notes: "Historical 2014 Paper 1 explicitly prohibits calculator use; this profile records the burden of the actual Question instance rather than Skills-Tree suitability." },

  // ============================================================================
  // SECTION 9 — NUMBER / PARAMETER DESIGN
  // ============================================================================
  numbers: { numberTypes: ["INTEGER", "NEGATIVE"], nonCalculatorFriendly: true, exactAndApproximateMixed: false, simplificationVisibility: "NOT_APPLICABLE", expectedFinalValueForm: "VECTOR", intermediateValueSize: "MEDIUM", finalValueSize: "MEDIUM", dominantInputFormat: "INTEGER", dominantOutputFormat: "OTHER", magnitudeNotes: null },
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
  language: { informationDensity: "LOW", scaffoldingLevel: "MEDIUM", bulletStructureUsed: false, naturalLanguageInterpretationRequired: false, promptSummary: "Calculate a scalar multiple of one three-component vector minus another and state the resultant in component form.", promptStructure: { sentenceCount: 2, promptWordCount: 12, introductionStyle: "DIRECT_VECTOR_OPERATION_WITH_COMPONENT_GIVENS", relationshipStatementStyle: "VECTOR_VALUES_EMBEDDED_IN_OPERATION_STATEMENT", commandStyle: "FIND_RESULTANT_THEN_SPECIFY_COMPONENT_FORM", temporalStructure: "NONE", informationOrder: ["TARGET_VECTOR_OPERATION", "VECTOR_U", "VECTOR_V", "OUTPUT_FORM"], normalisedPromptStructure: ["Define a resultant-vector operation using two supplied component vectors.", "Give a separate component-form instruction."], usesPronounReference: true, lexicalFeatureTags: ["abstract", "component notation", "two-sentence output instruction"], generatorVariationNotes: "Vary vector components and scalar coefficients while preserving a non-trivial component-wise operation and explicit output form." }, styleNotes: null },

  // ============================================================================
  // SECTION 12 — VISUAL EVIDENCE
  // ============================================================================
  visuals: notApplicable("No supplied visual material is used in this Question."),
  mathematicalModel: notApplicable(),
  specialisedProfiles: { arithmetic: notApplicable(), percentage: notApplicable(), powersSurdsScientific: notApplicable(), algebra: notApplicable(), equationsInequalities: notApplicable(), functionsGraphs: notApplicable(), statistics: notApplicable(), geometryMeasureCircleSimilarity: notApplicable(), trigonometry: notApplicable(), bearings: notApplicable(), coordinateGeometry: catalogValue({ coordinateDimension: "3D", midpointRequired: false, gradientRequired: false, distanceRequired: false, lineEquationRequired: false, perpendicularGradientRequired: false, coordinateVectorReasoningRequired: true }, [evidence]), vectors: catalogValue({ vectorRepresentationTypes: ["COLUMN_COMPONENT"], vectorAdditionRequired: true, scalarMultipleRequired: true, magnitudeRequired: false, ratioOrSectionRequired: false, geometricVectorReasoningRequired: false, candidateDrawsVector: false }, [evidence]) },
  family: { familyId: "VECTOR_COMPONENT_LINEAR_COMBINATION_3D", subFamilyId: null, familyConfidence: "HIGH", structuralSignature: ["three-component vectors", "scalar multiple", "component-wise subtraction"], surfaceStyleIds: ["COLUMN_VECTOR_NOTATION"], relatedFamilyIds: [] },
  surface: { abstractOrContextual: "ABSTRACT", proseAmount: "LOW", visualAmount: "NONE", layoutComplexity: "LOW", informationOrderCanVarySafely: true, visualPlacementCanVarySafely: true },
  generation: { readiness: "PARTIAL", linkedGeneratorFamilyIds: ["VECTOR_COMPONENT_LINEAR_COMBINATION_3D"], invariantMathematics: ["three-component vector linear combination"], variableParameters: ["vector components", "integer scalar"], parameterConstraints: ["result remains exact and Paper 1 friendly"], safeContextVariations: [], safeRepresentationVariations: [], unsafeVariations: [], difficultyControls: ["negative components", "scalar size"], requiredVisualCapabilities: [], requiredValidationChecks: ["mark total and part structure remain valid", "generated values satisfy all parameter constraints", "required answer form remains attainable without calculator", "generated instance is mathematically non-degenerate"], provenance: "GENERATION_ANALYSIS" },
  sourceIsolation: sourceIsolation(),
  review: questionReviewInProgress(false),
} satisfies QuestionCatalogEntry;
