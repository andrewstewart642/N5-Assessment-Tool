import type { QuestionCatalogEntry } from "../../QuestionCatalogTypes";
import { catalogValue, notApplicable, qpEvidence, questionReviewInProgress, sourceIsolation, visualOriginality, visualValidation } from "../../QuestionCatalogHelpers";

const evidence = qpEvidence("5", 5);
const visualEvidence = qpEvidence("5", 5, "VISUAL");

export const N5_MATHS_2014_P1_Q5 = {
  // ============================================================================
  // SECTION 1 — IDENTITY
  // ============================================================================
  identity: { id: "N5_MATH_2014_P1_Q5", schemaVersion: "N5_CATALOG_V2", courseId: "N5_MATH", paperContextId: "N5_MATH_2014_P1_CONTEXT", year: 2014, paper: "P1", questionNumber: "5", answerCatalogId: "N5_MATH_2014_P1_Q5_MS" },

  // ============================================================================
  // SECTION 2 — SOURCE LAYOUT
  // ============================================================================
  sourceLayout: { sourcePages: [5], printedPageLabels: ["Page 5"], continuesAcrossPages: false, answerSpace: { category: "LARGE", estimatedWritingLines: 11, responseSurfaceVisualIds: [], separateFinalAnswerAreaPresent: false, notes: "Large blank response area follows the triangle and prompt." }, sourceEvidence: [evidence] },

  // ============================================================================
  // SECTION 3 — QUESTION STRUCTURE
  // ============================================================================
  structure: { structureType: "SINGLE", totalMarks: 3, parts: [{ id: "Q5_MAIN", label: "", marks: 3, primarySkillId: "trig-t04-sine-rule", secondarySkillIds: [], conceptIds: ["trig-t4-1"], topic: "TRIG", commandTypes: ["CALCULATE"], responseTypes: ["NUMBER"], dependsOnPartIds: [], sharedInformationIds: [], visualElementIds: ["VIS_Q5"] }], dependencyType: "INDEPENDENT", sharedStimulus: false, sharedVisuals: false, sharedGivenData: false, requiredResultProvided: false },

  // ============================================================================
  // SECTION 4 — CURRICULUM
  // ============================================================================
  curriculum: { primaryTopic: "TRIG", primarySkillId: "trig-t04-sine-rule", secondarySkillIds: [], primaryConceptId: "trig-t4-1", conceptIds: ["trig-t4-1"], paperSuitability: "P1", standardProfile: "A", thinkingProfile: "OPERATIONAL", crossSkillQuestion: false, skillMarkDistribution: { "trig-t04-sine-rule": 3 }, conceptMarkDistribution: { "trig-t4-1": 3 } },

  // ============================================================================
  // SECTION 5 — TASK / RESPONSE
  // ============================================================================
  task: { commandTypes: ["CALCULATE"], responseTypes: ["NUMBER"], responseCount: 1, explicitMethodCue: false, methodRestricted: false, workingRequestedInPrompt: false, justificationRequested: false, contextualConclusionRequested: false, visualResponseRequired: false },

  // ============================================================================
  // SECTION 6 — MATHEMATICAL STRUCTURE
  // ============================================================================
  mathematics: { primaryGoal: "Use the sine rule with supplied sine values to determine an unknown side.", subgoals: [{ id: "Q5_S1", summary: "Match each known sine value with its opposite side.", dependsOnSubgoalIds: [] }, { id: "Q5_S2", summary: "Apply the sine rule and calculate the unknown side.", dependsOnSubgoalIds: ["Q5_S1"] }], operationTypes: ["SUBSTITUTE", "REARRANGE", "DIVIDE", "MULTIPLY"], requiredFormulaIds: ["SINE_RULE"], requiredTheoremIds: [], stageCount: 2, intermediateQuantityTypes: ["common side-to-sine ratio"], methodSelectionRequired: false, solutionCountExpected: 1, validitySelectionRequired: false, representationTransitions: [] },

  // ============================================================================
  // SECTION 7 — INFORMATION
  // ============================================================================
  information: [
    { id: "Q5_INFO_KM", informationType: "length", normalisedContent: "KM has length 18 cm", value: 18, unit: "cm", source: "TEXT", explicitness: "EXPLICIT", role: "GIVEN_VALUE", visualElementId: "VIS_Q5", usedByPartIds: ["Q5_MAIN"] },
    { id: "Q5_INFO_SINK", informationType: "trig value", normalisedContent: "sin K is 0.4", value: 0.4, unit: null, source: "TEXT", explicitness: "EXPLICIT", role: "GIVEN_VALUE", visualElementId: "VIS_Q5", usedByPartIds: ["Q5_MAIN"] },
    { id: "Q5_INFO_SINL", informationType: "trig value", normalisedContent: "sin L is 0.9", value: 0.9, unit: null, source: "TEXT", explicitness: "EXPLICIT", role: "GIVEN_VALUE", visualElementId: "VIS_Q5", usedByPartIds: ["Q5_MAIN"] },
  ],

  // ============================================================================
  // SECTION 8 — REASONING / DIFFICULTY
  // ============================================================================
  reasoning: { reasoningTypes: ["DIRECT_PROCEDURE", "INFORMATION_MARSHALLING"], difficulty: { overallDifficulty: "MEDIUM", methodSelectionLoad: "LOW", arithmeticLoad: "LOW", algebraicLoad: "VERY_LOW", representationLoad: "LOW", languageLoad: "LOW", contextInterpretationLoad: "VERY_LOW", reasoningDepth: "MEDIUM", dependencyCount: 0, difficultyDrivers: ["matching opposite sides to angles", "rearranging a sine-rule proportion without calculator"] } },

  // ============================================================================
  // SECTION 9 — NUMBER / PARAMETER DESIGN
  // ============================================================================
  numbers: { numberTypes: ["INTEGER", "DECIMAL"], nonCalculatorFriendly: true, exactAndApproximateMixed: false, magnitudeNotes: null },
  parameterDesign: { deliberatelyConstructedValues: true, exactResultDesigned: true, roundingDesigned: false, factorisableDesigned: false, perfectSquareDesigned: false, pythagoreanTripleUsed: false, niceRatioUsed: true, validSolutionCountDesigned: null, parameterConstraints: ["sine values lie strictly between 0 and 1", "chosen values give an exact manageable side length", "triangle data remain geometrically feasible"], safeVariationAxes: ["known side", "supplied sine values", "triangle orientation"], invariantRelationships: ["one known side with its opposite sine value", "one target side with the other supplied sine value"], degeneracyConditionsToAvoid: ["equal sine values that remove proportional reasoning", "awkward non-calculator arithmetic"] },
  constraints: { mathematicalDomainConstraints: [], contextValidityConstraints: ["Side lengths must be positive and triangle data feasible."], calculatorModeConstraints: ["Non-calculator arithmetic must remain feasible."], methodConstraints: [], presentationConstraints: [] },

  // ============================================================================
  // SECTION 10 — ANSWER SPECIFICATION
  // ============================================================================
  answerSpecification: { answerForm: "EXACT", simplestFormRequired: false, rationalDenominatorRequired: false, positivePowersRequired: false, scientificNotationRequired: false, precisionType: "NONE", precisionValue: null, units: { dimension: "length", unitSymbol: "cm", conversionRequired: false, unitsExplicitlyRequested: false }, multipleAnswersRequired: 1, domainRestriction: null, contextualWordsRequired: false, coordinateOrderRelevant: false, bracketsRelevant: false, visualAnswerRequired: false },

  // ============================================================================
  // SECTION 11 — CONTEXT / LANGUAGE
  // ============================================================================
  context: { contextualised: false, contextDomain: null, contextRole: "NONE", namedPeoplePresent: false, currencyPresent: false, realWorldUnitsPresent: true, realismConstrainsAnswer: false, contextObjects: [], contextCanBeSafelyReplaced: true },
  language: { informationDensity: "MEDIUM", scaffoldingLevel: "MEDIUM", bulletStructureUsed: true, naturalLanguageInterpretationRequired: false, promptSummary: "Use a labelled triangle, one known side and two supplied sine values to calculate another side.", styleNotes: null },

  // ============================================================================
  // SECTION 12 — VISUAL EVIDENCE
  // ============================================================================
  visuals: catalogValue({
    elements: [{
      id: "VIS_Q5", sourceOrder: 1, visualType: "GEOMETRIC_DIAGRAM", roles: ["STRUCTURAL_MODEL", "SUPPORTIVE"], dependency: "REDUNDANT_WITH_TEXT", candidateInteraction: "READ_ONLY", textRelationship: "FULLY_DUPLICATED",
      scale: { mode: "SCHEMATIC", measurementFromDrawingPermitted: false, proportionalAppearanceDesirable: true, exactGeometryRequiredForRenderer: false, notes: null },
      orientation: { verticalDirectionMeaningful: false, horizontalDirectionMeaningful: false, northReferenceMeaningful: false, groundReferenceMeaningful: false, startPositionMeaningful: false, rotationDirectionMeaningful: false, viewpointMeaningful: false, mirroringSafe: true, rotationSafe: true },
      labels: [
        { entityId: "Q5_K", role: "POINT_NAME", normalisedValue: "K", placementMathematicallyConstrained: false, collisionPriority: "HIGH" },
        { entityId: "Q5_L", role: "POINT_NAME", normalisedValue: "L", placementMathematicallyConstrained: false, collisionPriority: "HIGH" },
        { entityId: "Q5_M", role: "POINT_NAME", normalisedValue: "M", placementMathematicallyConstrained: false, collisionPriority: "HIGH" },
        { entityId: "Q5_KM", role: "LENGTH", normalisedValue: "18 cm", placementMathematicallyConstrained: true, collisionPriority: "HIGH" },
      ],
      semanticModel: {
        entities: [
          { id: "Q5_K", entityType: "VERTEX", semanticName: "triangle vertex K", printedLabel: "K", numericValue: null, symbolicValue: null, unit: null, mathematicallyEssential: true, orientationMeaningful: false, candidateEditable: false, attributes: {} },
          { id: "Q5_L", entityType: "VERTEX", semanticName: "triangle vertex L", printedLabel: "L", numericValue: null, symbolicValue: null, unit: null, mathematicallyEssential: true, orientationMeaningful: false, candidateEditable: false, attributes: {} },
          { id: "Q5_M", entityType: "VERTEX", semanticName: "triangle vertex M", printedLabel: "M", numericValue: null, symbolicValue: null, unit: null, mathematicallyEssential: true, orientationMeaningful: false, candidateEditable: false, attributes: {} },
          { id: "Q5_TRI", entityType: "TRIANGLE", semanticName: "triangle KLM", printedLabel: null, numericValue: null, symbolicValue: null, unit: null, mathematicallyEssential: true, orientationMeaningful: false, candidateEditable: false, attributes: {} },
          { id: "Q5_KM", entityType: "SEGMENT", semanticName: "side KM", printedLabel: null, numericValue: 18, symbolicValue: null, unit: "cm", mathematicallyEssential: true, orientationMeaningful: false, candidateEditable: false, attributes: {} },
        ],
        relations: [
          { id: "Q5_R1", relationType: "PART_OF", fromEntityIds: ["Q5_KM"], toEntityIds: ["Q5_TRI"], normalisedMeaning: "KM is a side of triangle KLM", essentialToSolution: true, sourceEvidence: [visualEvidence] },
        ],
        facts: [{ id: "Q5_F1", factType: "SIDE_MEASUREMENT", normalisedFact: "KM has length 18 cm", relatedEntityIds: ["Q5_KM"], explicitness: "EXPLICIT_LABEL", essentialToSolution: true, sourceEvidence: [visualEvidence] }],
      },
      layout: { sourcePageNumber: 5, sourcePagePosition: "MIDDLE", sourceRelativeWidth: "MEDIUM", preferredGeneratedAspectRatio: "4:3", minimumReadableWidthMm: null, minimumReadableHeightMm: null, allowInlinePlacement: false, allowFullWidthPlacement: true, labelCollisionSensitive: true },
      specialisedProfiles: {
        geometry: catalogValue({ dimension: "2D", shapeFamilies: ["TRIANGLE"], labelledPointIds: ["Q5_K", "Q5_L", "Q5_M"], rightAnglesPresent: false, parallelRelationshipsPresent: false, equalLengthRelationshipsPresent: false, similarityPresent: false, congruencePresent: false, shadedRegionsPresent: false, auxiliaryLinesPresent: false, algebraicDimensionsPresent: false, compoundShapePresent: false }, [visualEvidence]),
        circle: notApplicable(), graph: notApplicable(), scatter: notApplicable(), table: notApplicable(), vector: notApplicable(), bearing: notApplicable(), solid3D: notApplicable(), mechanism: notApplicable(), contextImage: notApplicable(), responseSurface: notApplicable(),
      },
      generation: { readiness: "PARTIAL", strategy: "PROCEDURAL_SVG", rendererFamilyId: "TRIANGLE_GENERIC", allowedMediaAssetIds: [], requiredAssetTags: [], semanticInvariants: ["three labelled triangle vertices", "known side is opposite the correct supplied sine value", "target side remains opposite the other supplied sine value"], safeVariationAxes: ["triangle orientation", "non-semantic proportions", "label placement"], unsafeVariations: ["relabel vertices without updating opposite-side relationships"], permittedOrientationChanges: ["mirror or rotate when semantic relationships are preserved"], permittedStyleChanges: ["line weight", "label spacing", "overall size", "non-semantic proportions"], requiredRendererCapabilities: ["triangle drawing", "point labels", "side measurement labels"], requiredValidationChecks: ["all semantic entities resolve", "labels agree with generated parameters", "no clipping or collision", "print remains readable"], provenance: "GENERATION_ANALYSIS" },
      originality: visualOriginality(), validation: visualValidation(false, true), sourceEvidence: [visualEvidence], confidence: "HIGH",
    }],
    visualCount: 1, relationships: [], containsEssentialVisualData: false, containsContextImage: false, containsProcedurallyReproducibleDiagram: true, containsResponseSurface: false, generationRequiresMultipleVisuals: false,
  }, [visualEvidence]),

  // ============================================================================
  // SECTION 13 — MATHEMATICAL MODEL
  // ============================================================================
  mathematicalModel: notApplicable(),

  // ============================================================================
  // SECTION 14 — SPECIALISED MATHEMATICAL PROFILES
  // ============================================================================
  specialisedProfiles: {
    arithmetic: notApplicable(), percentage: notApplicable(), powersSurdsScientific: notApplicable(), algebra: notApplicable(), equationsInequalities: notApplicable(), functionsGraphs: notApplicable(), statistics: notApplicable(),
    geometryMeasureCircleSimilarity: catalogValue({ geometryFamilies: ["TRIANGLE"], dimensions: ["2D"], compoundShapeOrSolid: false, similarityUsed: false, circleGeometryUsed: false, pythagorasUsed: false, areaRequired: false, volumeRequired: false, surfaceAreaRequired: false }, [evidence]),
    trigonometry: catalogValue({ trigFunctions: ["SIN"], trigContext: "NON_RIGHT_TRIANGLE", angleUnit: "DEGREES", domainStart: null, domainEnd: null, domainEndInclusive: null, quadrantReasoningRequired: false, inverseTrigRequired: false, multipleSolutionsRequired: false, exactTrigValuesRequired: false, sineRuleUsed: true, cosineRuleUsed: false, areaFormulaUsed: false, calculatorModeSensitive: false }, [evidence]),
    bearings: notApplicable(), coordinateGeometry: notApplicable(), vectors: notApplicable(),
  },

  // ============================================================================
  // SECTION 15 — FAMILY / SURFACE / GENERATION
  // ============================================================================
  family: { familyId: "TRIG_SINE_RULE_SIDE_FROM_SUPPLIED_SINES", subFamilyId: null, familyConfidence: "HIGH", structuralSignature: ["non-right triangle", "one known side", "two supplied sine values", "unknown opposite side"], surfaceStyleIds: ["LABELLED_TRIANGLE", "BULLETED_GIVENS"], relatedFamilyIds: [] },
  surface: { abstractOrContextual: "ABSTRACT", proseAmount: "MEDIUM", visualAmount: "MEDIUM", layoutComplexity: "MEDIUM", informationOrderCanVarySafely: true, visualPlacementCanVarySafely: true },
  generation: { readiness: "PARTIAL", linkedGeneratorFamilyIds: ["TRIG_SINE_RULE_SIDE_FROM_SUPPLIED_SINES"], invariantMathematics: ["sine-rule side relationship", "non-right triangle structure"], variableParameters: ["known side", "two sine values", "vertex labels", "diagram orientation"], parameterConstraints: ["sine values and side produce exact manageable result", "triangle remains feasible"], safeContextVariations: [], safeRepresentationVariations: ["rotate or mirror triangle while preserving labels and opposite-side relationships"], unsafeVariations: ["swap labels without updating sine/side relationships"], difficultyControls: ["ratio complexity", "rearrangement complexity"], requiredVisualCapabilities: ["generic labelled triangle renderer"], requiredValidationChecks: ["mark total and part structure remain valid", "generated values satisfy all parameter constraints", "required answer form remains attainable without calculator", "generated instance is mathematically non-degenerate"], provenance: "GENERATION_ANALYSIS" },

  // ============================================================================
  // SECTION 16 — SOURCE ISOLATION / REVIEW
  // ============================================================================
  sourceIsolation: sourceIsolation(),
  review: { ...questionReviewInProgress(true), unresolvedIssues: [...questionReviewInProgress(true).unresolvedIssues, "Historical 2014 Paper 1 uses the canonical sine-rule Skill even though the current Skills Tree marks that Skill as P2; reconcile paper-suitability metadata before production generation."] },
} satisfies QuestionCatalogEntry;
