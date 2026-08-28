import type { QuestionCatalogEntry } from "../../QuestionCatalogTypes";
import { catalogValue, notApplicable, qpEvidence, questionReviewInProgress, sourceIsolation } from "../../QuestionCatalogHelpers";

const evidence = qpEvidence("3", 4);

export const N5_MATHS_2014_P1_Q3 = {
  // ============================================================================
  // SECTION 1 — IDENTITY
  // ============================================================================
  identity: { id: "N5_MATH_2014_P1_Q3", schemaVersion: "N5_CATALOG_V2", courseId: "N5_MATH", paperContextId: "N5_MATH_2014_P1_CONTEXT", year: 2014, paper: "P1", questionNumber: "3", answerCatalogId: "N5_MATH_2014_P1_Q3_MS" },

  // ============================================================================
  // SECTION 2 — SOURCE LAYOUT
  // ============================================================================
  sourceLayout: { sourcePages: [4], printedPageLabels: ["Page 4"], continuesAcrossPages: false, answerSpace: { category: "LARGE", estimatedWritingLines: 10, responseSurfaceVisualIds: [], separateFinalAnswerAreaPresent: false, notes: "Substantial blank working area separates Q3 from Q4." }, sourceEvidence: [evidence] },

  // ============================================================================
  // SECTION 3 — QUESTION STRUCTURE
  // ============================================================================
  structure: { structureType: "SINGLE", totalMarks: 2, parts: [{ id: "Q3_MAIN", label: "", marks: 2, primarySkillId: "alg-a03-complete-the-square", secondarySkillIds: [], conceptIds: ["alg-a3-1"], topic: "ALG", commandTypes: ["EXPRESS"], responseTypes: ["EXPRESSION"], dependsOnPartIds: [], sharedInformationIds: [], visualElementIds: [] }], dependencyType: "INDEPENDENT", sharedStimulus: false, sharedVisuals: false, sharedGivenData: false, requiredResultProvided: false },

  // ============================================================================
  // SECTION 4 — CURRICULUM
  // ============================================================================
  curriculum: { primaryTopic: "ALG", primarySkillId: "alg-a03-complete-the-square", secondarySkillIds: [], primaryConceptId: "alg-a3-1", conceptIds: ["alg-a3-1"], paperSuitability: "P1", standardProfile: "C+A", thinkingProfile: "OPERATIONAL", crossSkillQuestion: false, skillMarkDistribution: { "alg-a03-complete-the-square": 2 }, conceptMarkDistribution: { "alg-a3-1": 2 } },

  // ============================================================================
  // SECTION 5 — TASK / RESPONSE
  // ============================================================================
  task: { commandTypes: ["EXPRESS"], responseTypes: ["EXPRESSION"], responseCount: 1, explicitMethodCue: false, methodRestricted: false, workingRequestedInPrompt: false, justificationRequested: false, contextualConclusionRequested: false, visualResponseRequired: false },

  // ============================================================================
  // SECTION 6 — MATHEMATICAL STRUCTURE
  // ============================================================================
  mathematics: { primaryGoal: "Rewrite a monic quadratic expression in completed-square form.", subgoals: [{ id: "Q3_S1", summary: "Determine the value used inside the square.", dependsOnSubgoalIds: [] }, { id: "Q3_S2", summary: "Adjust the constant term to preserve equivalence.", dependsOnSubgoalIds: ["Q3_S1"] }], operationTypes: ["REARRANGE", "SIMPLIFY"], requiredFormulaIds: [], requiredTheoremIds: [], stageCount: 2, intermediateQuantityTypes: ["half linear coefficient", "square adjustment"], methodSelectionRequired: false, solutionCountExpected: 1, validitySelectionRequired: false, representationTransitions: [] },

  // ============================================================================
  // SECTION 7 — INFORMATION
  // ============================================================================
  information: [
    { id: "Q3_INFO_QUAD", informationType: "expression", normalisedContent: "monic quadratic with integer linear and constant terms", value: "x^2-14x+44", unit: null, source: "TEXT", explicitness: "EXPLICIT", role: "GIVEN_VALUE", visualElementId: null, usedByPartIds: ["Q3_MAIN"] },
    { id: "Q3_INFO_FORM", informationType: "answer form", normalisedContent: "required form is (x-a)^2+b", value: null, unit: null, source: "TEXT", explicitness: "EXPLICIT", role: "RESPONSE_INSTRUCTION", visualElementId: null, usedByPartIds: ["Q3_MAIN"] },
  ],

  // ============================================================================
  // SECTION 8 — REASONING / DIFFICULTY
  // ============================================================================
  reasoning: { reasoningTypes: ["DIRECT_PROCEDURE", "STRUCTURE_RECOGNITION"], difficulty: { overallDifficulty: "MEDIUM", methodSelectionLoad: "VERY_LOW", arithmeticLoad: "LOW", algebraicLoad: "MEDIUM", representationLoad: "VERY_LOW", languageLoad: "LOW", contextInterpretationLoad: "VERY_LOW", reasoningDepth: "MEDIUM", dependencyCount: 0, difficultyDrivers: ["sign control in completed-square adjustment"] } },

  // ============================================================================
  // SECTION 9 — NUMBER / PARAMETER DESIGN
  // ============================================================================
  numbers: { numberTypes: ["INTEGER", "NEGATIVE", "ALGEBRAIC"], nonCalculatorFriendly: true, exactAndApproximateMixed: false, magnitudeNotes: null },
  parameterDesign: { deliberatelyConstructedValues: true, exactResultDesigned: true, roundingDesigned: false, factorisableDesigned: false, perfectSquareDesigned: true, pythagoreanTripleUsed: false, niceRatioUsed: false, validSolutionCountDesigned: null, parameterConstraints: ["linear coefficient must be even for a clean integer half-coefficient in this family", "constant should produce a manageable final adjustment"], safeVariationAxes: ["linear coefficient", "constant term"], invariantRelationships: ["monic quadratic", "completed-square form"], degeneracyConditionsToAvoid: ["already-perfect-square expression that removes the adjustment step"] },
  constraints: { mathematicalDomainConstraints: [], contextValidityConstraints: [], calculatorModeConstraints: ["Non-calculator arithmetic must remain feasible."], methodConstraints: [], presentationConstraints: ["Answer must be structurally equivalent to completed-square form."] },

  // ============================================================================
  // SECTION 10 — ANSWER SPECIFICATION
  // ============================================================================
  answerSpecification: { answerForm: "SYMBOLIC", simplestFormRequired: false, rationalDenominatorRequired: false, positivePowersRequired: false, scientificNotationRequired: false, precisionType: "NONE", precisionValue: null, units: { dimension: null, unitSymbol: null, conversionRequired: false, unitsExplicitlyRequested: false }, multipleAnswersRequired: 1, domainRestriction: null, contextualWordsRequired: false, coordinateOrderRelevant: false, bracketsRelevant: false, visualAnswerRequired: false },

  // ============================================================================
  // SECTION 11 — CONTEXT / LANGUAGE
  // ============================================================================
  context: { contextualised: false, contextDomain: null, contextRole: "NONE", namedPeoplePresent: false, currencyPresent: false, realWorldUnitsPresent: false, realismConstrainsAnswer: false, contextObjects: [], contextCanBeSafelyReplaced: true },
  language: { informationDensity: "LOW", scaffoldingLevel: "MEDIUM", bulletStructureUsed: false, naturalLanguageInterpretationRequired: false, promptSummary: "Rewrite a monic quadratic in completed-square form.", styleNotes: null },

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
  specialisedProfiles: { arithmetic: notApplicable(), percentage: notApplicable(), powersSurdsScientific: notApplicable(), algebra: catalogValue({ expansionRequired: false, factorisationRequired: false, completingSquareRequired: true, rationalExpressionPresent: false, changeOfSubjectRequired: false }, [evidence]), equationsInequalities: notApplicable(), functionsGraphs: notApplicable(), statistics: notApplicable(), geometryMeasureCircleSimilarity: notApplicable(), trigonometry: notApplicable(), bearings: notApplicable(), coordinateGeometry: notApplicable(), vectors: notApplicable() },

  // ============================================================================
  // SECTION 15 — FAMILY / SURFACE / GENERATION
  // ============================================================================
  family: { familyId: "ALG_COMPLETE_SQUARE_UNITARY_QUADRATIC", subFamilyId: null, familyConfidence: "HIGH", structuralSignature: ["monic quadratic", "completed-square transformation"], surfaceStyleIds: ["INLINE_ALGEBRAIC_EXPRESSION", "TARGET_FORM_GIVEN"], relatedFamilyIds: [] },
  surface: { abstractOrContextual: "ABSTRACT", proseAmount: "LOW", visualAmount: "NONE", layoutComplexity: "LOW", informationOrderCanVarySafely: true, visualPlacementCanVarySafely: true },
  generation: { readiness: "PARTIAL", linkedGeneratorFamilyIds: ["ALG_COMPLETE_SQUARE_UNITARY_QUADRATIC"], invariantMathematics: ["monic quadratic", "completed-square output form"], variableParameters: ["linear coefficient", "constant term"], parameterConstraints: ["Paper 1 values remain exactly manageable"], safeContextVariations: [], safeRepresentationVariations: [], unsafeVariations: [], difficultyControls: ["negative constant adjustment", "coefficient magnitude"], requiredVisualCapabilities: [], requiredValidationChecks: ["mark total and part structure remain valid", "generated values satisfy all parameter constraints", "required answer form remains attainable without calculator", "generated instance is mathematically non-degenerate"], provenance: "GENERATION_ANALYSIS" },

  // ============================================================================
  // SECTION 16 — SOURCE ISOLATION / REVIEW
  // ============================================================================
  sourceIsolation: sourceIsolation(),
  review: questionReviewInProgress(false),
} satisfies QuestionCatalogEntry;
