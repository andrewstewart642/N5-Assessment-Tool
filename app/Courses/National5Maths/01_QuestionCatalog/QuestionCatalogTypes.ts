import type { CourseId } from "@/app/Courses/CourseTypes";
import type { AssessmentTopicCode, Paper, SkillPaperSuitability } from "@/app/Assessments/AssessmentTypes";
import type {
  CatalogConfidence,
  CatalogEvidenceRef,
  CatalogGenerationReadiness,
  CatalogProvenance,
  CatalogReviewProfile,
  CatalogSchemaVersion,
  CatalogSourceIsolationProfile,
  CatalogValue,
  GeneratorFamilyId,
  PaperContextId,
} from "../CatalogCoreTypes";
import type { VisualElementId, VisualEvidenceProfile } from "../05_VisualAssets/VisualCatalogTypes";

export type QuestionCatalogId = string;
export type QuestionPartId = string;
export type QuestionFamilyId = string;
export type QuestionInformationId = string;
export type QuestionSubgoalId = string;

export type QuestionCatalogIdentity = { id: QuestionCatalogId; schemaVersion: CatalogSchemaVersion; courseId: CourseId; paperContextId: PaperContextId; year: number; paper: Paper; questionNumber: string; answerCatalogId: string };

export type QuestionAnswerSpaceCategory = "NONE" | "VERY_SMALL" | "SMALL" | "MEDIUM" | "LARGE" | "FULL_PAGE" | "GRAPH_GRID" | "DIAGRAM_RESPONSE" | "CONSTRUCTION_RESPONSE" | "MIXED";
export type QuestionAnswerSpaceProfile = { category: QuestionAnswerSpaceCategory; estimatedWritingLines: number | null; responseSurfaceVisualIds: VisualElementId[]; separateFinalAnswerAreaPresent: boolean; notes: string | null };
export type QuestionSourceLayoutProfile = { sourcePages: number[]; printedPageLabels: string[]; continuesAcrossPages: boolean; answerSpace: QuestionAnswerSpaceProfile; sourceEvidence: CatalogEvidenceRef[] };

export type QuestionPartDependencyType = "INDEPENDENT" | "FOLLOW_ON" | "HENCE" | "SHARED_SETUP" | "SHARED_RESULT" | "MIXED";
export type QuestionCommandType = "CALCULATE" | "EVALUATE" | "FIND" | "STATE" | "WRITE_DOWN" | "DETERMINE" | "SOLVE" | "SIMPLIFY" | "EXPRESS" | "EXPAND" | "FACTORISE" | "CHANGE_SUBJECT" | "SHOW_THAT" | "JUSTIFY" | "COMPARE" | "COMMENT" | "ESTIMATE" | "DRAW" | "SKETCH" | "PLOT" | "CONSTRUCT" | "IDENTIFY" | "COMPLETE" | "PROVE" | "INTERPRET" | "OTHER";
export type QuestionResponseType = "NUMBER" | "EXPRESSION" | "EQUATION" | "INEQUALITY" | "COORDINATES" | "VECTOR" | "GRAPH" | "SKETCH" | "DIAGRAM_ANNOTATION" | "DRAWN_VECTOR" | "CONSTRUCTION" | "SHADED_REGION" | "TABLE_ENTRY" | "WRITTEN_COMPARISON" | "JUSTIFICATION" | "CONCLUSION" | "MIXED";
export type QuestionPart = { id: QuestionPartId; label: string; marks: number; primarySkillId: string; secondarySkillIds: string[]; conceptIds: string[]; topic: AssessmentTopicCode; commandTypes: QuestionCommandType[]; responseTypes: QuestionResponseType[]; dependsOnPartIds: QuestionPartId[]; sharedInformationIds: QuestionInformationId[]; visualElementIds: VisualElementId[] };
export type QuestionStructureProfile = { structureType: "SINGLE" | "MULTIPART"; totalMarks: number; parts: QuestionPart[]; dependencyType: QuestionPartDependencyType; sharedStimulus: boolean; sharedVisuals: boolean; sharedGivenData: boolean; requiredResultProvided: boolean };

export type QuestionStandardProfile = "C" | "A" | "C+A";
export type QuestionThinkingProfile = "OPERATIONAL" | "REASONING" | "MIXED";
export type QuestionCurriculumProfile = { primaryTopic: AssessmentTopicCode; primarySkillId: string; secondarySkillIds: string[]; primaryConceptId: string; conceptIds: string[]; paperSuitability: SkillPaperSuitability; standardProfile: QuestionStandardProfile; thinkingProfile: QuestionThinkingProfile; crossSkillQuestion: boolean; skillMarkDistribution: Record<string, number>; conceptMarkDistribution: Record<string, number> };

export type QuestionTaskProfile = { commandTypes: QuestionCommandType[]; responseTypes: QuestionResponseType[]; responseCount: number | null; explicitMethodCue: boolean; methodRestricted: boolean; workingRequestedInPrompt: boolean; justificationRequested: boolean; contextualConclusionRequested: boolean; visualResponseRequired: boolean };

export type QuestionOperationType = "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE" | "SIMPLIFY" | "EXPAND" | "FACTORISE" | "SUBSTITUTE" | "REARRANGE" | "SOLVE" | "EVALUATE" | "INTERPRET" | "CONSTRUCT" | "COMPARE" | "FILTER_SOLUTIONS" | "PROVE" | "MODEL" | "OTHER";
export type QuestionRepresentationTransition = { from: string; to: string; purpose: string };
export type QuestionMathematicalStructureProfile = { primaryGoal: string; subgoals: { id: QuestionSubgoalId; summary: string; dependsOnSubgoalIds: QuestionSubgoalId[] }[]; operationTypes: QuestionOperationType[]; requiredFormulaIds: string[]; requiredTheoremIds: string[]; stageCount: number; intermediateQuantityTypes: string[]; methodSelectionRequired: boolean; solutionCountExpected: number | null; validitySelectionRequired: boolean; representationTransitions: QuestionRepresentationTransition[] };

export type QuestionInformationSource = "TEXT" | "DIAGRAM" | "IMAGE" | "GRAPH" | "TABLE" | "PREVIOUS_PART" | "FORMULA_SHEET" | "COURSE_KNOWLEDGE";
export type QuestionInformationExplicitness = "EXPLICIT" | "IMPLIED" | "MUST_INFER";
export type QuestionInformationRole = "GIVEN_VALUE" | "RELATIONSHIP" | "CONSTRAINT" | "FORMULA" | "CONTEXT" | "TARGET" | "ORIENTATION" | "DOMAIN" | "RESPONSE_INSTRUCTION";
export type QuestionInformationItem = { id: QuestionInformationId; informationType: string; normalisedContent: string; value: number | string | null; unit: string | null; source: QuestionInformationSource; explicitness: QuestionInformationExplicitness; role: QuestionInformationRole; visualElementId: VisualElementId | null; usedByPartIds: QuestionPartId[] };

export type QuestionReasoningType = "DIRECT_PROCEDURE" | "REVERSE_REASONING" | "METHOD_SELECTION" | "INFORMATION_MARSHALLING" | "MULTI_STAGE" | "REPRESENTATION_TRANSLATION" | "JUSTIFICATION" | "COMPARISON_INTERPRETATION" | "VALIDATION" | "STRUCTURE_RECOGNITION" | "SOLUTION_FILTERING" | "DERIVATION" | "CONTEXT_INTERPRETATION" | "VISUAL_INTERPRETATION";
export type QuestionDemandLevel = "VERY_LOW" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
export type QuestionDifficultyProfile = { overallDifficulty: QuestionDemandLevel; methodSelectionLoad: QuestionDemandLevel; arithmeticLoad: QuestionDemandLevel; algebraicLoad: QuestionDemandLevel; representationLoad: QuestionDemandLevel; languageLoad: QuestionDemandLevel; contextInterpretationLoad: QuestionDemandLevel; reasoningDepth: QuestionDemandLevel; dependencyCount: number; difficultyDrivers: string[] };
export type QuestionReasoningProfile = { reasoningTypes: QuestionReasoningType[]; difficulty: QuestionDifficultyProfile };

export type QuestionNumberType = "INTEGER" | "DECIMAL" | "FRACTION" | "PERCENTAGE" | "SURD" | "POWER" | "SCIENTIFIC_NOTATION" | "PI" | "EXACT_TRIG_VALUE" | "NEGATIVE" | "ALGEBRAIC";
export type QuestionNumberProfile = { numberTypes: QuestionNumberType[]; nonCalculatorFriendly: boolean; exactAndApproximateMixed: boolean; magnitudeNotes: string | null };
export type QuestionParameterDesignProfile = { deliberatelyConstructedValues: boolean; exactResultDesigned: boolean; roundingDesigned: boolean; factorisableDesigned: boolean; perfectSquareDesigned: boolean; pythagoreanTripleUsed: boolean; niceRatioUsed: boolean; validSolutionCountDesigned: number | null; parameterConstraints: string[]; safeVariationAxes: string[]; invariantRelationships: string[]; degeneracyConditionsToAvoid: string[] };
export type QuestionConstraintProfile = { mathematicalDomainConstraints: string[]; contextValidityConstraints: string[]; calculatorModeConstraints: string[]; methodConstraints: string[]; presentationConstraints: string[] };

export type QuestionAnswerForm = "EXACT" | "APPROXIMATE" | "SYMBOLIC" | "GRAPHICAL" | "PROSE" | "MIXED";
export type QuestionPrecisionType = "NONE" | "DECIMAL_PLACES" | "SIGNIFICANT_FIGURES" | "NEAREST_UNIT" | "ACCEPTED_RANGE";
export type QuestionUnitProfile = { dimension: string | null; unitSymbol: string | null; conversionRequired: boolean; unitsExplicitlyRequested: boolean };
export type QuestionAnswerSpecification = { answerForm: QuestionAnswerForm; simplestFormRequired: boolean; rationalDenominatorRequired: boolean; positivePowersRequired: boolean; scientificNotationRequired: boolean; precisionType: QuestionPrecisionType; precisionValue: number | null; units: QuestionUnitProfile; multipleAnswersRequired: number | null; domainRestriction: string | null; contextualWordsRequired: boolean; coordinateOrderRelevant: boolean; bracketsRelevant: boolean; visualAnswerRequired: boolean };

export type QuestionContextRole = "NONE" | "SURFACE_ONLY" | "MATHEMATICALLY_RELEVANT" | "MODEL_DEFINING";
export type QuestionContextProfile = { contextualised: boolean; contextDomain: string | null; contextRole: QuestionContextRole; namedPeoplePresent: boolean; currencyPresent: boolean; realWorldUnitsPresent: boolean; realismConstrainsAnswer: boolean; contextObjects: string[]; contextCanBeSafelyReplaced: boolean };
export type QuestionLanguageProfile = { informationDensity: QuestionDemandLevel; scaffoldingLevel: QuestionDemandLevel; bulletStructureUsed: boolean; naturalLanguageInterpretationRequired: boolean; promptSummary: string; styleNotes: string | null };

export type QuestionMathematicalModelProfile = { modelFamily: string; normalisedModel: string; independentVariable: string; dependentVariable: string; physicalOrContextDomain: string | null; modelProvidedToCandidate: boolean; candidateMustConstructModel: boolean; candidateMustInterpretModel: boolean; solveForIndependentVariable: boolean; targetDependentValueProvided: boolean; modelParameters: Record<string, number | string> };

export type QuestionArithmeticProfile = { arithmeticComplexity: QuestionDemandLevel; commonDenominatorRequired: boolean; cancellationAvailable: boolean; simplificationRequired: boolean };
export type QuestionPercentageProfile = { relationshipType: "INCREASE" | "DECREASE" | "PART_OF_WHOLE" | "REVERSE" | "COMPOUND"; percentageValues: number[]; multiplierValues: number[]; periods: number | null; originalValueKnown: boolean; finalValueKnown: boolean; reverseCalculationRequired: boolean };
export type QuestionPowersSurdsScientificProfile = { powersPresent: boolean; surdsPresent: boolean; scientificNotationPresent: boolean; rationalisationRequired: boolean; exactSimplificationRequired: boolean };
export type QuestionAlgebraProfile = { expansionRequired: boolean; factorisationRequired: boolean; completingSquareRequired: boolean; rationalExpressionPresent: boolean; changeOfSubjectRequired: boolean };
export type QuestionEquationProfile = { equationFamily: string; inequalityPresent: boolean; algebraicMethodRequired: boolean; repeatedSubstitutionInvalid: boolean; expectedSolutionCount: number | null; rejectedSolutionReason: string | null };
export type QuestionFunctionProfile = { functionFamily: string; functionNotationUsed: boolean; transformationParametersPresent: boolean; rootsRelevant: boolean; turningPointsRelevant: boolean; graphInterpretationRequired: boolean };
export type QuestionStatisticsProfile = { rawDataProvided: boolean; summaryStatisticsProvided: boolean; sampleSize: number | null; statisticsRequired: string[]; comparisonRequired: boolean; interpretationRequired: boolean };
export type QuestionGeometryProfile = { geometryFamilies: string[]; dimensions: ("2D" | "3D")[]; compoundShapeOrSolid: boolean; similarityUsed: boolean; circleGeometryUsed: boolean; pythagorasUsed: boolean; areaRequired: boolean; volumeRequired: boolean; surfaceAreaRequired: boolean };
export type QuestionTrigonometryProfile = { trigFunctions: ("SIN" | "COS" | "TAN")[]; trigContext: "RIGHT_TRIANGLE" | "NON_RIGHT_TRIANGLE" | "EQUATION" | "GRAPH" | "PERIODIC_MODEL"; angleUnit: "DEGREES" | "RADIANS" | "GRADIANS"; domainStart: number | null; domainEnd: number | null; domainEndInclusive: boolean | null; quadrantReasoningRequired: boolean; inverseTrigRequired: boolean; multipleSolutionsRequired: boolean; exactTrigValuesRequired: boolean; sineRuleUsed: boolean; cosineRuleUsed: boolean; areaFormulaUsed: boolean; calculatorModeSensitive: boolean };
export type QuestionBearingProfile = { bearingsPresent: boolean; threeFigureBearingsRequired: boolean; northReferenceRequired: boolean; clockwiseFromNorthReasoningRequired: boolean; scaleDrawingProhibited: boolean };
export type QuestionCoordinateGeometryProfile = { coordinateDimension: "2D" | "3D"; midpointRequired: boolean; gradientRequired: boolean; distanceRequired: boolean; lineEquationRequired: boolean; perpendicularGradientRequired: boolean; coordinateVectorReasoningRequired: boolean };
export type QuestionVectorProfile = { vectorRepresentationTypes: string[]; vectorAdditionRequired: boolean; scalarMultipleRequired: boolean; magnitudeRequired: boolean; ratioOrSectionRequired: boolean; geometricVectorReasoningRequired: boolean; candidateDrawsVector: boolean };

export type QuestionSpecialisedProfiles = {
  arithmetic: CatalogValue<QuestionArithmeticProfile>;
  percentage: CatalogValue<QuestionPercentageProfile>;
  powersSurdsScientific: CatalogValue<QuestionPowersSurdsScientificProfile>;
  algebra: CatalogValue<QuestionAlgebraProfile>;
  equationsInequalities: CatalogValue<QuestionEquationProfile>;
  functionsGraphs: CatalogValue<QuestionFunctionProfile>;
  statistics: CatalogValue<QuestionStatisticsProfile>;
  geometryMeasureCircleSimilarity: CatalogValue<QuestionGeometryProfile>;
  trigonometry: CatalogValue<QuestionTrigonometryProfile>;
  bearings: CatalogValue<QuestionBearingProfile>;
  coordinateGeometry: CatalogValue<QuestionCoordinateGeometryProfile>;
  vectors: CatalogValue<QuestionVectorProfile>;
};

export type QuestionFamilyProfile = { familyId: QuestionFamilyId; subFamilyId: string | null; familyConfidence: CatalogConfidence; structuralSignature: string[]; surfaceStyleIds: string[]; relatedFamilyIds: QuestionFamilyId[] };
export type QuestionSurfaceProfile = { abstractOrContextual: "ABSTRACT" | "CONTEXTUAL" | "MIXED"; proseAmount: "LOW" | "MEDIUM" | "HIGH"; visualAmount: "NONE" | "LOW" | "MEDIUM" | "HIGH"; layoutComplexity: "LOW" | "MEDIUM" | "HIGH"; informationOrderCanVarySafely: boolean; visualPlacementCanVarySafely: boolean };
export type QuestionGenerationProfile = { readiness: CatalogGenerationReadiness; linkedGeneratorFamilyIds: GeneratorFamilyId[]; invariantMathematics: string[]; variableParameters: string[]; parameterConstraints: string[]; safeContextVariations: string[]; safeRepresentationVariations: string[]; unsafeVariations: string[]; difficultyControls: string[]; requiredVisualCapabilities: string[]; requiredValidationChecks: string[]; provenance: CatalogProvenance };
export type QuestionSourceIsolationProfile = CatalogSourceIsolationProfile & { generatorMayConsumeSourceLayoutCoordinates: false; generatorMayConsumeHistoricalPromptWording: false; generatorMayConsumeSemanticStructure: true };

export type QuestionCatalogEntry = {
  identity: QuestionCatalogIdentity;
  sourceLayout: QuestionSourceLayoutProfile;
  structure: QuestionStructureProfile;
  curriculum: QuestionCurriculumProfile;
  task: QuestionTaskProfile;
  mathematics: QuestionMathematicalStructureProfile;
  information: QuestionInformationItem[];
  reasoning: QuestionReasoningProfile;
  numbers: QuestionNumberProfile;
  parameterDesign: QuestionParameterDesignProfile;
  constraints: QuestionConstraintProfile;
  answerSpecification: QuestionAnswerSpecification;
  context: QuestionContextProfile;
  language: QuestionLanguageProfile;
  visuals: CatalogValue<VisualEvidenceProfile>;
  mathematicalModel: CatalogValue<QuestionMathematicalModelProfile>;
  specialisedProfiles: QuestionSpecialisedProfiles;
  family: QuestionFamilyProfile;
  surface: QuestionSurfaceProfile;
  generation: QuestionGenerationProfile;
  sourceIsolation: QuestionSourceIsolationProfile;
  review: CatalogReviewProfile;
};

export const QUESTION_CATALOG_VALIDATION_INVARIANTS = [
  "Question identity resolves to one paper context and one matching Answer Catalogue ID.",
  "Question total marks equal the sum of Question-part marks.",
  "Canonical Skill IDs resolve in the Course Skills Tree.",
  "Every specialised profile slot exists even when NOT_APPLICABLE.",
  "Every visualElementId reference resolves in the Question visual profile.",
  "Generation analysis contains no verbatim historical prompt wording.",
  "Parameter constraints prevent degenerate generated instances.",
  "Visual generation preserves semantic relationships while allowing original composition.",
] as const;
