import type { CatalogEvidenceRef, CatalogMarkThinking } from "../CatalogCoreTypes";
import type { QuestionCatalogEntry, QuestionNumberType, QuestionPart } from "./QuestionCatalogTypes";
import { asHistoricalQuestionCatalogEntry } from "./QuestionCatalogHistoricalView";
import { catalogValue, notApplicable, qpEvidence, questionReviewInProgress } from "./QuestionCatalogHelpers";

const SKILL_ID = "alg-a07-linear-equations";
const CONCEPT_ID = "alg-a7-1";

export type A7QuestionMode = "FRACTIONAL_COEFFICIENT" | "CONTEXT_AREA_EQUALITY";

export type A7QuestionConfig = {
  year: 2016 | 2019 | 2022 | 2025;
  paper: "P1" | "P2";
  questionNumber: string;
  pdfPages: number[];
  printedPageLabels: string[];
  mode: A7QuestionMode;
  marks: 3 | 5;
  thinking: CatalogMarkThinking;
  solution: string;
  numberTypes: QuestionNumberType[];
  promptWordCount: number;
  promptSentenceCount: number;
  answerSpaceCategory: "SMALL" | "MEDIUM" | "LARGE" | "FULL_PAGE";
  estimatedWritingLines: number;
};

const sourceEvidence = (config: A7QuestionConfig): CatalogEvidenceRef[] =>
  config.pdfPages.map((page, index) => ({
    ...qpEvidence(config.questionNumber, page, "QUESTION", config.paper, page, config.year),
    printedPageLabels: [config.printedPageLabels[index] ?? `PDF page ${page}`],
  }));

const visualForContext = (config: A7QuestionConfig, evidence: CatalogEvidenceRef[]) => {
  const q = `Q${config.questionNumber}`;
  const visualEvidence: CatalogEvidenceRef = {
    ...evidence[0],
    evidenceType: "VISUAL",
    locatorNote: "Triangle/rectangle area diagram containing the dimensions used to construct the linear equation.",
  };
  const triangleId = `VIS_${q}_TRIANGLE`;
  const rectangleId = `VIS_${q}_RECTANGLE`;

  return catalogValue({
    elements: [{
      id: `VIS_${q}_AREA_DIAGRAM`,
      sourceOrder: 1,
      visualType: "GEOMETRIC_DIAGRAM" as const,
      roles: ["ESSENTIAL_DATA" as const, "STRUCTURAL_MODEL" as const],
      dependency: "REQUIRED_TO_SOLVE" as const,
      candidateInteraction: "READ_VALUES" as const,
      textRelationship: "VISUAL_ONLY" as const,
      scale: {
        mode: "SCHEMATIC" as const,
        measurementFromDrawingPermitted: false,
        proportionalAppearanceDesirable: true,
        exactGeometryRequiredForRenderer: false,
        notes: "The source diagram supplies labelled dimensions; candidates are not intended to measure the drawing.",
      },
      orientation: {
        verticalDirectionMeaningful: false,
        horizontalDirectionMeaningful: false,
        northReferenceMeaningful: false,
        groundReferenceMeaningful: false,
        startPositionMeaningful: false,
        rotationDirectionMeaningful: false,
        viewpointMeaningful: false,
        mirroringSafe: true,
        rotationSafe: true,
      },
      labels: [
        { entityId: triangleId, role: "LENGTH" as const, normalisedValue: "3 cm", placementMathematicallyConstrained: false, collisionPriority: "HIGH" as const },
        { entityId: triangleId, role: "VARIABLE" as const, normalisedValue: "(x+12) cm", placementMathematicallyConstrained: false, collisionPriority: "HIGH" as const },
        { entityId: rectangleId, role: "LENGTH" as const, normalisedValue: "6 cm", placementMathematicallyConstrained: false, collisionPriority: "HIGH" as const },
        { entityId: rectangleId, role: "VARIABLE" as const, normalisedValue: "(8-x) cm", placementMathematicallyConstrained: false, collisionPriority: "HIGH" as const },
      ],
      semanticModel: {
        entities: [
          { id: triangleId, entityType: "TRIANGLE" as const, semanticName: "triangle", printedLabel: null, numericValue: null, symbolicValue: null, unit: "cm", mathematicallyEssential: true, orientationMeaningful: false, candidateEditable: false, attributes: { base: 3, heightExpression: "x+12" } },
          { id: rectangleId, entityType: "RECTANGLE" as const, semanticName: "rectangle", printedLabel: null, numericValue: null, symbolicValue: null, unit: "cm", mathematicallyEssential: true, orientationMeaningful: false, candidateEditable: false, attributes: { height: 6, widthExpression: "8-x" } },
        ],
        relations: [],
        facts: [
          { id: `${q}_VF1`, factType: "TRIANGLE_DIMENSIONS", normalisedFact: "The triangle has base 3 cm and perpendicular height (x+12) cm.", relatedEntityIds: [triangleId], explicitness: "EXPLICIT_LABEL" as const, essentialToSolution: true, sourceEvidence: [visualEvidence] },
          { id: `${q}_VF2`, factType: "RECTANGLE_DIMENSIONS", normalisedFact: "The rectangle has dimensions 6 cm by (8-x) cm.", relatedEntityIds: [rectangleId], explicitness: "EXPLICIT_LABEL" as const, essentialToSolution: true, sourceEvidence: [visualEvidence] },
        ],
      },
      layout: {
        sourcePageNumber: config.pdfPages[0],
        sourcePagePosition: "TOP" as const,
        sourceRelativeWidth: "LARGE" as const,
        preferredGeneratedAspectRatio: "16:7",
        minimumReadableWidthMm: 95,
        minimumReadableHeightMm: 35,
        allowInlinePlacement: false,
        allowFullWidthPlacement: true,
        labelCollisionSensitive: true,
      },
      specialisedProfiles: {
        geometry: catalogValue({
          dimension: "2D" as const,
          shapeFamilies: ["triangle", "rectangle"],
          labelledPointIds: [],
          rightAnglesPresent: false,
          parallelRelationshipsPresent: false,
          equalLengthRelationshipsPresent: false,
          similarityPresent: false,
          congruencePresent: false,
          shadedRegionsPresent: false,
          auxiliaryLinesPresent: false,
          algebraicDimensionsPresent: true,
          compoundShapePresent: false,
        }, [visualEvidence], "CATALOGUE_CLASSIFICATION", "HIGH", null),
        circle: notApplicable(),
        graph: notApplicable(),
        scatter: notApplicable(),
        table: notApplicable(),
        vector: notApplicable(),
        bearing: notApplicable(),
        solid3D: notApplicable(),
        mechanism: notApplicable(),
        contextImage: notApplicable(),
        responseSurface: notApplicable(),
      },
      sourceEvidence: [visualEvidence],
      confidence: "HIGH" as const,
    }],
    visualCount: 1,
    relationships: [],
    containsEssentialVisualData: true,
    containsContextImage: false,
    containsProcedurallyReproducibleDiagram: true,
    containsResponseSurface: false,
  }, [visualEvidence], "CATALOGUE_CLASSIFICATION", "HIGH", null);
};

export const createA7QuestionCatalogEntry = (config: A7QuestionConfig): QuestionCatalogEntry => {
  const q = `Q${config.questionNumber}`;
  const evidence = sourceEvidence(config);
  const contextual = config.mode === "CONTEXT_AREA_EQUALITY";
  const parts: QuestionPart[] = contextual
    ? [
        { id: `${q}_a`, label: "a", marks: 1, primarySkillId: SKILL_ID, secondarySkillIds: [], conceptIds: [CONCEPT_ID], topic: "ALG", commandTypes: ["FIND"], responseTypes: ["EXPRESSION"], dependsOnPartIds: [], sharedInformationIds: [`${q}_INFO_TRIANGLE`, `${q}_INFO_RECTANGLE`], visualElementIds: [`VIS_${q}_AREA_DIAGRAM`], standardProfile: "A", thinkingProfile: "REASONING", calculatorBurden: "WRITTEN_NON_CALCULATOR" },
        { id: `${q}_b`, label: "b", marks: 4, primarySkillId: SKILL_ID, secondarySkillIds: [], conceptIds: [CONCEPT_ID], topic: "ALG", commandTypes: ["FIND"], responseTypes: ["NUMBER"], dependsOnPartIds: [`${q}_a`], sharedInformationIds: [`${q}_INFO_TRIANGLE`, `${q}_INFO_RECTANGLE`, `${q}_INFO_EQUAL_AREAS`], visualElementIds: [`VIS_${q}_AREA_DIAGRAM`], standardProfile: "A", thinkingProfile: "REASONING", calculatorBurden: "WRITTEN_NON_CALCULATOR" },
      ]
    : [{ id: `${q}_MAIN`, label: "", marks: 3, primarySkillId: SKILL_ID, secondarySkillIds: [], conceptIds: [CONCEPT_ID], topic: "ALG", commandTypes: ["SOLVE"], responseTypes: ["NUMBER"], dependsOnPartIds: [], sharedInformationIds: [`${q}_INFO_EQUATION`], visualElementIds: [], standardProfile: "A", thinkingProfile: "OPERATIONAL", calculatorBurden: config.paper === "P1" ? "WRITTEN_NON_CALCULATOR" : "CALCULATOR_OPTIONAL" }];

  const information = contextual
    ? [
        { id: `${q}_INFO_TRIANGLE`, informationType: "triangle dimensions", normalisedContent: "A triangle has base 3 cm and height (x+12) cm.", value: "base=3;height=x+12", unit: "cm", source: "DIAGRAM" as const, explicitness: "EXPLICIT" as const, role: "GIVEN_VALUE" as const, visualElementId: `VIS_${q}_AREA_DIAGRAM`, usedByPartIds: [`${q}_a`, `${q}_b`] },
        { id: `${q}_INFO_RECTANGLE`, informationType: "rectangle dimensions", normalisedContent: "A rectangle has dimensions 6 cm by (8-x) cm.", value: "height=6;width=8-x", unit: "cm", source: "DIAGRAM" as const, explicitness: "EXPLICIT" as const, role: "GIVEN_VALUE" as const, visualElementId: `VIS_${q}_AREA_DIAGRAM`, usedByPartIds: [`${q}_a`, `${q}_b`] },
        { id: `${q}_INFO_EQUAL_AREAS`, informationType: "area relationship", normalisedContent: "The two displayed shapes have equal area.", value: null, unit: null, source: "TEXT" as const, explicitness: "EXPLICIT" as const, role: "RELATIONSHIP" as const, visualElementId: null, usedByPartIds: [`${q}_b`] },
      ]
    : [{ id: `${q}_INFO_EQUATION`, informationType: "linear equation with fractional coefficients", normalisedContent: "A one-variable linear equation containing fractional terms is supplied directly.", value: null, unit: null, source: "TEXT" as const, explicitness: "EXPLICIT" as const, role: "GIVEN_VALUE" as const, visualElementId: null, usedByPartIds: [`${q}_MAIN`] }];

  return asHistoricalQuestionCatalogEntry({
    identity: {
      id: `N5_MATH_${config.year}_${config.paper}_Q${config.questionNumber}`,
      schemaVersion: "N5_CATALOG_V3",
      courseId: "N5_MATH",
      paperContextId: `N5_MATH_${config.year}_${config.paper}_CONTEXT`,
      year: config.year,
      paper: config.paper,
      questionNumber: config.questionNumber,
      answerCatalogId: `N5_MATH_${config.year}_${config.paper}_Q${config.questionNumber}_MS`,
    },
    sourceLayout: {
      sourcePages: config.pdfPages,
      printedPageLabels: config.printedPageLabels,
      continuesAcrossPages: config.pdfPages.length > 1,
      answerSpace: {
        category: config.answerSpaceCategory,
        estimatedWritingLines: config.estimatedWritingLines,
        responseSurfaceVisualIds: [],
        separateFinalAnswerAreaPresent: false,
        notes: null,
      },
      sourceEvidence: evidence,
    },
    structure: {
      structureType: contextual ? "MULTIPART" : "SINGLE",
      totalMarks: config.marks,
      parts,
      dependencyType: contextual ? "FOLLOW_ON" : "INDEPENDENT",
      sharedStimulus: contextual,
      sharedVisuals: contextual,
      sharedGivenData: contextual,
      requiredResultProvided: false,
    },
    curriculum: {
      primaryTopic: "ALG",
      primarySkillId: SKILL_ID,
      secondarySkillIds: [],
      primaryConceptId: CONCEPT_ID,
      conceptIds: [CONCEPT_ID],
      paperSuitability: config.paper,
      standardProfile: "A",
      thinkingProfile: config.thinking,
      crossSkillQuestion: false,
      skillMarkDistribution: { [SKILL_ID]: config.marks },
      conceptMarkDistribution: { [CONCEPT_ID]: config.marks },
    },
    task: {
      commandTypes: contextual ? ["FIND"] : ["SOLVE"],
      responseTypes: contextual ? ["EXPRESSION", "NUMBER"] : ["NUMBER"],
      responseCount: contextual ? 2 : 1,
      explicitMethodCue: contextual,
      methodRestricted: contextual,
      workingRequestedInPrompt: false,
      justificationRequested: false,
      contextualConclusionRequested: false,
      visualResponseRequired: false,
    },
    mathematics: {
      primaryGoal: contextual
        ? "Construct area expressions from a diagram, equate them, and solve the resulting linear equation algebraically."
        : "Solve a one-variable linear equation containing fractional coefficients exactly.",
      subgoals: contextual
        ? [
            { id: `${q}_S1`, summary: "Construct the triangle area expression from the supplied dimensions.", dependsOnSubgoalIds: [] },
            { id: `${q}_S2`, summary: "Construct the rectangle area expression and equate it to the triangle area.", dependsOnSubgoalIds: [`${q}_S1`] },
            { id: `${q}_S3`, summary: "Clear the fraction or otherwise begin a valid algebraic solution of the area equation.", dependsOnSubgoalIds: [`${q}_S2`] },
            { id: `${q}_S4`, summary: "Rearrange the linear equation into a single-variable form.", dependsOnSubgoalIds: [`${q}_S3`] },
            { id: `${q}_S5`, summary: "Solve for the unknown value.", dependsOnSubgoalIds: [`${q}_S4`] },
          ]
        : [
            { id: `${q}_S1`, summary: "Eliminate fractional denominators or combine the fractional algebra into an equivalent linear form.", dependsOnSubgoalIds: [] },
            { id: `${q}_S2`, summary: "Rearrange the equation into the form ax=b.", dependsOnSubgoalIds: [`${q}_S1`] },
            { id: `${q}_S3`, summary: "Divide to obtain the exact value of x.", dependsOnSubgoalIds: [`${q}_S2`] },
          ],
      operationTypes: contextual ? ["MODEL", "MULTIPLY", "EXPAND", "REARRANGE", "SOLVE"] : ["MULTIPLY", "REARRANGE", "SOLVE"],
      requiredFormulaIds: contextual ? ["AREA_TRIANGLE", "AREA_RECTANGLE"] : [],
      requiredTheoremIds: [],
      stageCount: config.marks,
      intermediateQuantityTypes: contextual ? ["area expression", "linear equation"] : ["equivalent integer-coefficient equation", "ax=b form"],
      methodSelectionRequired: contextual,
      solutionCountExpected: 1,
      validitySelectionRequired: false,
      representationTransitions: contextual ? [{ from: "labelled geometric diagram", to: "linear equation", purpose: "represent equality of the two areas algebraically" }] : [],
    },
    information,
    reasoning: {
      reasoningTypes: contextual ? ["CONTEXT_INTERPRETATION", "REPRESENTATION_TRANSLATION", "MULTI_STAGE", "STRUCTURE_RECOGNITION"] : ["DIRECT_PROCEDURE", "MULTI_STAGE"],
      difficulty: {
        overallDifficulty: contextual ? "HIGH" : "MEDIUM",
        methodSelectionLoad: contextual ? "MEDIUM" : "LOW",
        arithmeticLoad: "LOW",
        algebraicLoad: "MEDIUM",
        representationLoad: contextual ? "MEDIUM" : "VERY_LOW",
        languageLoad: contextual ? "LOW" : "VERY_LOW",
        contextInterpretationLoad: contextual ? "MEDIUM" : "VERY_LOW",
        reasoningDepth: contextual ? "MEDIUM" : "LOW",
        dependencyCount: contextual ? 4 : 2,
        difficultyDrivers: contextual
          ? ["constructing two area expressions", "recognising equality creates a linear equation", "maintaining fractional area structure while solving"]
          : ["fractional coefficients", "exact non-integer solution", "maintaining equivalence while clearing denominators"],
      },
    },
    numbers: {
      numberTypes: config.numberTypes,
      nonCalculatorFriendly: true,
      exactAndApproximateMixed: false,
      simplificationVisibility: contextual ? "NOT_EXPLICITLY_STATED" : "EXPLICIT_INSTRUCTION",
      expectedFinalValueForm: contextual ? "INTEGER" : config.solution.includes("/") ? "PROPER_FRACTION" : "DECIMAL",
      intermediateValueSize: "SMALL",
      finalValueSize: "SMALL",
      dominantInputFormat: contextual ? "ALGEBRAIC" : "FRACTION",
      dominantOutputFormat: contextual ? "INTEGER" : config.solution.includes("/") ? "FRACTION" : "DECIMAL",
      magnitudeNotes: null,
    },
    calculator: {
      status: config.paper === "P1" ? "NON_CALCULATOR" : "CALCULATOR_ALLOWED",
      burden: config.paper === "P1" ? "WRITTEN_NON_CALCULATOR" : "CALCULATOR_OPTIONAL",
      requiredFunctions: [],
      modeSensitive: false,
      modeRequirements: [],
      notes: "The assessed demand is algebraic manipulation rather than calculator functionality.",
    },
    constraints: {
      mathematicalDomainConstraints: contextual ? ["The physical dimensions represented in the area model must be positive."] : [],
      contextValidityConstraints: contextual ? ["All displayed lengths represent physically meaningful dimensions."] : [],
      calculatorModeConstraints: [],
      methodConstraints: contextual ? ["Part (b) explicitly requires an algebraic solution."] : [],
      presentationConstraints: contextual ? [] : ["The final exact value is stated in simplest form when the source requires it."],
    },
    answerSpecification: {
      answerForm: "EXACT",
      simplestFormRequired: !contextual,
      rationalDenominatorRequired: false,
      positivePowersRequired: false,
      scientificNotationRequired: false,
      precisionType: "NONE",
      precisionValue: null,
      units: { dimension: null, unitSymbol: null, conversionRequired: false, unitsExplicitlyRequested: false },
      multipleAnswersRequired: contextual ? 2 : 1,
      domainRestriction: contextual ? "physical dimensions remain positive" : null,
      contextualWordsRequired: false,
      coordinateOrderRelevant: false,
      bracketsRelevant: false,
      visualAnswerRequired: false,
    },
    context: contextual
      ? { contextualised: true, contextDomain: "equal areas of a triangle and rectangle", contextRole: "MODEL_DEFINING", namedPeoplePresent: false, currencyPresent: false, realWorldUnitsPresent: true, realismConstrainsAnswer: true, contextObjects: ["triangle", "rectangle"], contextCanBeSafelyReplaced: false }
      : { contextualised: false, contextDomain: null, contextRole: "NONE", namedPeoplePresent: false, currencyPresent: false, realWorldUnitsPresent: false, realismConstrainsAnswer: false, contextObjects: [], contextCanBeSafelyReplaced: true },
    language: {
      informationDensity: contextual ? "MEDIUM" : "VERY_LOW",
      scaffoldingLevel: contextual ? "MEDIUM" : "LOW",
      bulletStructureUsed: false,
      naturalLanguageInterpretationRequired: contextual,
      promptSummary: contextual ? "A diagram supplies dimensions for two shapes; after forming the triangle area, equal areas are used to construct and solve a linear equation." : "A compact fractional linear equation is supplied with a direct solve command.",
      promptStructure: {
        sentenceCount: config.promptSentenceCount,
        promptWordCount: config.promptWordCount,
        introductionStyle: contextual ? "DIAGRAM_FIRST_WITH_TWO_SHAPES" : "BARE_LINEAR_EQUATION",
        relationshipStatementStyle: contextual ? "EQUALITY_OF_TWO_AREAS_STATED_BEFORE_ALGEBRAIC_COMMAND" : null,
        commandStyle: contextual ? "FORM_EXPRESSION_THEN_SOLVE_ALGEBRAICALLY" : "SOLVE_EQUATION",
        temporalStructure: "NONE",
        informationOrder: contextual ? ["DIAGRAM_DIMENSIONS", "TRIANGLE_AREA_TARGET", "EQUAL_AREA_RELATIONSHIP", "ALGEBRAIC_SOLUTION_TARGET"] : ["EQUATION", "SOLVE_COMMAND"],
        normalisedPromptStructure: contextual ? ["Supply dimensions visually.", "Request one area expression.", "State equality of areas.", "Require algebraic solution for x."] : ["Present a one-variable fractional equation.", "Require an exact solution."],
        usesPronounReference: false,
        lexicalFeatureTags: contextual ? ["area", "linear equation", "algebraically", "diagram"] : ["linear equation", "fractions", "exact solution"],
      },
      styleNotes: null,
    },
    visuals: contextual ? visualForContext(config, evidence) : notApplicable("No supplied visual material is required for this question."),
    mathematicalModel: notApplicable("The linear equation is catalogued directly in the equations/inequalities specialised profile."),
    specialisedProfiles: {
      arithmetic: catalogValue({ arithmeticComplexity: "LOW", commonDenominatorRequired: !contextual, cancellationAvailable: false, simplificationRequired: true, simplificationVisibility: contextual ? "NOT_EXPLICITLY_STATED" : "EXPLICIT_INSTRUCTION", cancellationStyle: !contextual ? "COMMON_DENOMINATOR_REQUIRED" : "NONE" }, evidence, "CATALOGUE_CLASSIFICATION", "HIGH", null),
      percentage: notApplicable(),
      powersSurdsScientific: notApplicable(),
      algebra: catalogValue({ expansionRequired: contextual, factorisationRequired: false, completingSquareRequired: false, rationalExpressionPresent: !contextual, changeOfSubjectRequired: false }, evidence, "CATALOGUE_CLASSIFICATION", "HIGH", null),
      equationsInequalities: catalogValue({ equationFamily: contextual ? "LINEAR_CONTEXT_MODEL" : "LINEAR_FRACTIONAL_COEFFICIENT", inequalityPresent: false, algebraicMethodRequired: contextual, repeatedSubstitutionInvalid: false, expectedSolutionCount: 1, rejectedSolutionReason: null }, evidence, "CATALOGUE_CLASSIFICATION", "HIGH", null),
      functionsGraphs: notApplicable(),
      statistics: notApplicable(),
      geometryMeasureCircleSimilarity: contextual ? catalogValue({ geometryFamilies: ["triangle area", "rectangle area"], dimensions: ["2D"], compoundShapeOrSolid: false, similarityUsed: false, circleGeometryUsed: false, pythagorasUsed: false, areaRequired: true, volumeRequired: false, surfaceAreaRequired: false }, evidence, "CATALOGUE_CLASSIFICATION", "HIGH", "Geometry supplies the modelling context; the marks remain owned by A7 under the moderated skill-umbrella rule.") : notApplicable(),
      trigonometry: notApplicable(),
      bearings: notApplicable(),
      coordinateGeometry: notApplicable(),
      vectors: notApplicable(),
    },
    family: {
      familyId: contextual ? "ALG_LINEAR_EQUATION_CONTEXT_FORM_AND_SOLVE" : "ALG_LINEAR_EQUATION_FRACTIONAL_COEFFICIENT",
      subFamilyId: contextual ? "A7_EQUAL_AREAS" : "A7_FRACTIONAL_COEFFICIENTS",
      familyConfidence: "HIGH",
      structuralSignature: contextual ? ["two area expressions", "equal-area relationship", "construct one linear equation", "solve algebraically"] : ["one variable", "fractional coefficients", "clear/combine denominators", "rearrange to ax=b", "exact non-integer solution"],
      surfaceStyleIds: contextual ? ["DIAGRAM_CONTEXT_MULTIPART"] : ["BARE_EQUATION"],
      relatedFamilyIds: [],
    },
    surface: {
      abstractOrContextual: contextual ? "CONTEXTUAL" : "ABSTRACT",
      proseAmount: contextual ? "MEDIUM" : "LOW",
      visualAmount: contextual ? "MEDIUM" : "NONE",
      layoutComplexity: contextual ? "MEDIUM" : "LOW",
      informationOrderCanVarySafely: !contextual,
      visualPlacementCanVarySafely: contextual,
    },
    review: questionReviewInProgress(true, config.paper, config.year, true),
  });
};
