import type { QuestionCatalogEntry } from "../../QuestionCatalogTypes";
import type { VisualEvidenceProfile } from "../../../05_VisualAssets/VisualCatalogTypes";
import { catalogValue, notApplicable, qpEvidence, questionReviewInProgress, sourceIsolation, visualOriginality, visualValidation } from "../../QuestionCatalogHelpers";

const evidence = qpEvidence("1", 3);

export const N5_MATHS_2014_P1_Q1 = {
  // ============================================================================
  // SECTION 1 — IDENTITY
  // ============================================================================
  identity: {
    id: "N5_MATH_2014_P1_Q1",
    schemaVersion: "N5_CATALOG_V2",
    courseId: "N5_MATH",
    paperContextId: "N5_MATH_2014_P1_CONTEXT",
    year: 2014,
    paper: "P1",
    questionNumber: "1",
    answerCatalogId: "N5_MATH_2014_P1_Q1_MS",
  },

  // ============================================================================
  // SECTION 2 — SOURCE LAYOUT
  // ============================================================================
  sourceLayout: {
    sourcePages: [3],
    printedPageLabels: ["Page 3"],
    continuesAcrossPages: false,
    answerSpace: {
      category: "LARGE",
      estimatedWritingLines: 7,
      responseSurfaceVisualIds: [],
      separateFinalAnswerAreaPresent: false,
      notes: "Large blank working area follows the compact numerical prompt.",
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
      id: "Q1_MAIN",
      label: "",
      marks: 2,
      primarySkillId: "num-n5-fractions",
      secondarySkillIds: [],
      conceptIds: ["num-n5-1-multiply"],
      topic: "NUM",
      commandTypes: ["EVALUATE"],
      responseTypes: ["NUMBER"],
      dependsOnPartIds: [],
      sharedInformationIds: [],
      visualElementIds: [],
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
    primaryTopic: "NUM",
    primarySkillId: "num-n5-fractions",
    secondarySkillIds: [],
    primaryConceptId: "num-n5-1-multiply",
    conceptIds: ["num-n5-1-multiply"],
    paperSuitability: "P1",
    standardProfile: "C",
    thinkingProfile: "OPERATIONAL",
    crossSkillQuestion: false,
    skillMarkDistribution: { "num-n5-fractions": 2 },
    conceptMarkDistribution: { "num-n5-1-multiply": 2 },
  },

  // ============================================================================
  // SECTION 5 — TASK / RESPONSE
  // ============================================================================
  task: {
    commandTypes: ["EVALUATE"],
    responseTypes: ["NUMBER"],
    responseCount: 1,
    explicitMethodCue: false,
    methodRestricted: false,
    workingRequestedInPrompt: false,
    justificationRequested: false,
    contextualConclusionRequested: false,
    visualResponseRequired: false,
  },

  // ============================================================================
  // SECTION 6 — MATHEMATICAL STRUCTURE
  // ============================================================================
  mathematics: {
    primaryGoal: "Multiply a proper fraction by a mixed number and simplify the result.",
    subgoals: [
      { id: "Q1_S1", summary: "Convert the mixed number to a usable fractional form.", dependsOnSubgoalIds: [] },
      { id: "Q1_S2", summary: "Multiply and simplify to a single fraction.", dependsOnSubgoalIds: ["Q1_S1"] },
    ],
    operationTypes: ["MULTIPLY", "SIMPLIFY"],
    requiredFormulaIds: [],
    requiredTheoremIds: [],
    stageCount: 2,
    intermediateQuantityTypes: ["improper fraction"],
    methodSelectionRequired: false,
    solutionCountExpected: 1,
    validitySelectionRequired: false,
    representationTransitions: [],
  },

  // ============================================================================
  // SECTION 7 — INFORMATION
  // ============================================================================
  information: [
    {
      id: "Q1_INFO_EXPR",
      informationType: "expression",
      normalisedContent: "proper fraction multiplied by a mixed number",
      value: "5/12 × 2 2/9",
      unit: null,
      source: "TEXT",
      explicitness: "EXPLICIT",
      role: "GIVEN_VALUE",
      visualElementId: null,
      usedByPartIds: ["Q1_MAIN"],
    },
    {
      id: "Q1_INFO_FORM",
      informationType: "instruction",
      normalisedContent: "final fraction must be in simplest form",
      value: null,
      unit: null,
      source: "TEXT",
      explicitness: "EXPLICIT",
      role: "RESPONSE_INSTRUCTION",
      visualElementId: null,
      usedByPartIds: ["Q1_MAIN"],
    },
  ],

  // ============================================================================
  // SECTION 8 — REASONING / DIFFICULTY
  // ============================================================================
  reasoning: {
    reasoningTypes: ["DIRECT_PROCEDURE"],
    difficulty: {
      overallDifficulty: "LOW",
      methodSelectionLoad: "VERY_LOW",
      arithmeticLoad: "LOW",
      algebraicLoad: "VERY_LOW",
      representationLoad: "VERY_LOW",
      languageLoad: "LOW",
      contextInterpretationLoad: "VERY_LOW",
      reasoningDepth: "LOW",
      dependencyCount: 0,
      difficultyDrivers: ["mixed-number conversion", "fraction simplification"],
    },
  },

  // ============================================================================
  // SECTION 9 — NUMBER / PARAMETER DESIGN
  // ============================================================================
  numbers: { numberTypes: ["FRACTION", "INTEGER"], nonCalculatorFriendly: true, exactAndApproximateMixed: false, magnitudeNotes: null },
  parameterDesign: {
    deliberatelyConstructedValues: true,
    exactResultDesigned: true,
    roundingDesigned: false,
    factorisableDesigned: false,
    perfectSquareDesigned: false,
    pythagoreanTripleUsed: false,
    niceRatioUsed: true,
    validSolutionCountDesigned: null,
    parameterConstraints: ["mixed number converts cleanly to an improper fraction", "final fraction has a non-trivial simplification opportunity"],
    safeVariationAxes: ["proper-fraction numerator/denominator", "mixed-number whole and fractional parts"],
    invariantRelationships: ["fraction multiplication remains non-calculator friendly"],
    degeneracyConditionsToAvoid: ["integer-only result that removes simplification demand"],
  },
  constraints: {
    mathematicalDomainConstraints: [],
    contextValidityConstraints: [],
    calculatorModeConstraints: ["Non-calculator arithmetic must remain feasible."],
    methodConstraints: [],
    presentationConstraints: ["Final fraction must be in simplest form."],
  },

  // ============================================================================
  // SECTION 10 — ANSWER SPECIFICATION
  // ============================================================================
  answerSpecification: {
    answerForm: "EXACT",
    simplestFormRequired: true,
    rationalDenominatorRequired: false,
    positivePowersRequired: false,
    scientificNotationRequired: false,
    precisionType: "NONE",
    precisionValue: null,
    units: { dimension: null, unitSymbol: null, conversionRequired: false, unitsExplicitlyRequested: false },
    multipleAnswersRequired: 1,
    domainRestriction: null,
    contextualWordsRequired: false,
    coordinateOrderRelevant: false,
    bracketsRelevant: false,
    visualAnswerRequired: false,
  },

  // ============================================================================
  // SECTION 11 — CONTEXT / LANGUAGE
  // ============================================================================
  context: { contextualised: false, contextDomain: null, contextRole: "NONE", namedPeoplePresent: false, currencyPresent: false, realWorldUnitsPresent: false, realismConstrainsAnswer: false, contextObjects: [], contextCanBeSafelyReplaced: true },
  language: { informationDensity: "LOW", scaffoldingLevel: "MEDIUM", bulletStructureUsed: false, naturalLanguageInterpretationRequired: false, promptSummary: "Evaluate a fraction product involving a mixed number, then simplify the exact result.", styleNotes: null },

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
    arithmetic: catalogValue({ arithmeticComplexity: "LOW", commonDenominatorRequired: false, cancellationAvailable: true, simplificationRequired: true }, [evidence]),
    percentage: notApplicable(),
    powersSurdsScientific: notApplicable(),
    algebra: notApplicable(),
    equationsInequalities: notApplicable(),
    functionsGraphs: notApplicable(),
    statistics: notApplicable(),
    geometryMeasureCircleSimilarity: notApplicable(),
    trigonometry: notApplicable(),
    bearings: notApplicable(),
    coordinateGeometry: notApplicable(),
    vectors: notApplicable(),
  },

  // ============================================================================
  // SECTION 15 — FAMILY / SURFACE / GENERATION
  // ============================================================================
  family: {
    familyId: "NUM_FRACTION_MULTIPLY_MIXED_NUMBER",
    subFamilyId: null,
    familyConfidence: "HIGH",
    structuralSignature: ["fraction multiplication", "mixed-number conversion", "simplified exact result"],
    surfaceStyleIds: ["INLINE_NUMERICAL_EXPRESSION", "SIMPLEST_FORM_INSTRUCTION"],
    relatedFamilyIds: [],
  },
  surface: { abstractOrContextual: "ABSTRACT", proseAmount: "LOW", visualAmount: "NONE", layoutComplexity: "LOW", informationOrderCanVarySafely: true, visualPlacementCanVarySafely: true },
  generation: {
    readiness: "PARTIAL",
    linkedGeneratorFamilyIds: ["NUM_FRACTION_MULTIPLY_MIXED_NUMBER"],
    invariantMathematics: ["fraction-by-mixed-number multiplication", "exact simplified answer"],
    variableParameters: ["fraction values", "mixed-number values"],
    parameterConstraints: ["values remain small enough for non-calculator work", "final result simplifies exactly"],
    safeContextVariations: [],
    safeRepresentationVariations: [],
    unsafeVariations: [],
    difficultyControls: ["cancellation availability", "size of intermediate improper fraction"],
    requiredVisualCapabilities: [],
    requiredValidationChecks: ["mark total and part structure remain valid", "generated values satisfy all parameter constraints", "required answer form remains attainable without calculator", "generated instance is mathematically non-degenerate"],
    provenance: "GENERATION_ANALYSIS",
  },

  // ============================================================================
  // SECTION 16 — SOURCE ISOLATION / REVIEW
  // ============================================================================
  sourceIsolation: sourceIsolation(),
  review: questionReviewInProgress(false),
} satisfies QuestionCatalogEntry;
