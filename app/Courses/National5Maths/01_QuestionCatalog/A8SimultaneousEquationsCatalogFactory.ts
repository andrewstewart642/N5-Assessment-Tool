import type { QuestionCatalogEntry, QuestionPart } from "./QuestionCatalogTypes";
import { catalogValue, notApplicable, questionReviewInProgress, sourceIsolation } from "./QuestionCatalogHelpers";
import type { A8QuestionConfig } from "./A8SimultaneousEquationsCatalogTypes";
import { sourceEvidence, nativeMeasurement, equationText } from "./A8SimultaneousEquationsCatalogSource";
import { buildGraphVisual } from "./A8SimultaneousEquationsGraphVisual";

export type { A8ContextConfig, A8Equation, A8QuestionConfig, A8QuestionMode, A8ResponseRegion } from "./A8SimultaneousEquationsCatalogTypes";

const SKILL_ID = "alg-a08-simultaneous-equations";
const CONCEPT_ID = "alg-a8-1";

export const createA8QuestionCatalogEntry = (config: A8QuestionConfig): QuestionCatalogEntry => {
  const q = `Q${config.questionNumber}`;
  const evidence = sourceEvidence(config, "QUESTION");
  const visualEvidence = sourceEvidence(config, "VISUAL");
  const contextual = config.mode === "CONTEXT_FORM_AND_SOLVE" || config.mode === "CONTEXT_DERIVED_TOTAL";
  const graphical = config.mode === "GRAPH_INTERSECTION_SOLVE";
  const parts: QuestionPart[] = contextual
    ? [
        { id: `${q}_a`, label: "a", marks: 1, primarySkillId: SKILL_ID, secondarySkillIds: [], conceptIds: [CONCEPT_ID], topic: "ALG", commandTypes: ["WRITE_DOWN"], responseTypes: ["EQUATION"], dependsOnPartIds: [], sharedInformationIds: [`${q}_INFO_REL1`], visualElementIds: [], standardProfile: "C", thinkingProfile: "OPERATIONAL", calculatorBurden: config.paper === "P1" ? "WRITTEN_NON_CALCULATOR" : "CALCULATOR_OPTIONAL" },
        { id: `${q}_b`, label: "b", marks: 1, primarySkillId: SKILL_ID, secondarySkillIds: [], conceptIds: [CONCEPT_ID], topic: "ALG", commandTypes: ["WRITE_DOWN"], responseTypes: ["EQUATION"], dependsOnPartIds: [], sharedInformationIds: [`${q}_INFO_REL2`], visualElementIds: [], standardProfile: "C", thinkingProfile: "OPERATIONAL", calculatorBurden: config.paper === "P1" ? "WRITTEN_NON_CALCULATOR" : "CALCULATOR_OPTIONAL" },
        { id: `${q}_c`, label: "c", marks: 4, primarySkillId: SKILL_ID, secondarySkillIds: [], conceptIds: [CONCEPT_ID], topic: "ALG", commandTypes: ["CALCULATE"], responseTypes: [config.mode === "CONTEXT_DERIVED_TOTAL" ? "NUMBER" : "MIXED"], dependsOnPartIds: [`${q}_a`, `${q}_b`], sharedInformationIds: [`${q}_INFO_REL1`, `${q}_INFO_REL2`, `${q}_INFO_TARGET`], visualElementIds: [], standardProfile: "C+A", thinkingProfile: "REASONING", calculatorBurden: config.paper === "P1" ? "WRITTEN_NON_CALCULATOR" : "CALCULATOR_OPTIONAL" },
      ]
    : [{ id: `${q}_MAIN`, label: "", marks: 3, primarySkillId: SKILL_ID, secondarySkillIds: [], conceptIds: [CONCEPT_ID], topic: "ALG", commandTypes: [graphical ? "FIND" : "SOLVE"], responseTypes: [graphical ? "COORDINATES" : "NUMBER"], dependsOnPartIds: [], sharedInformationIds: [`${q}_INFO_EQ1`, `${q}_INFO_EQ2`], visualElementIds: graphical ? [`VIS_${q}_GRAPH`] : [], standardProfile: "C+A", thinkingProfile: "OPERATIONAL", calculatorBurden: "WRITTEN_NON_CALCULATOR" }];

  const subgoals = contextual
    ? [
        { id: `${q}_S1`, summary: "Translate the first contextual relationship into a linear equation in two unknowns.", dependsOnSubgoalIds: [] },
        { id: `${q}_S2`, summary: "Translate the second contextual relationship into a second independent linear equation.", dependsOnSubgoalIds: [] },
        { id: `${q}_S3`, summary: "Scale and eliminate within the simultaneous system to obtain the two unknown values.", dependsOnSubgoalIds: [`${q}_S1`, `${q}_S2`] },
        { id: `${q}_S4`, summary: config.mode === "CONTEXT_DERIVED_TOTAL" ? "Use the solved values to evaluate the requested third linear combination." : "Interpret the two solved values in the original context.", dependsOnSubgoalIds: [`${q}_S3`] },
      ]
    : [
        { id: `${q}_S1`, summary: "Scale one or both equations so that one variable can be eliminated.", dependsOnSubgoalIds: [] },
        { id: `${q}_S2`, summary: "Eliminate one variable and solve for one unknown.", dependsOnSubgoalIds: [`${q}_S1`] },
        { id: `${q}_S3`, summary: graphical ? "Find the other unknown and state the common solution as the intersection coordinates." : "Find the second unknown and state both values.", dependsOnSubgoalIds: [`${q}_S2`] },
      ];

  const information = contextual && config.context
    ? [
        { id: `${q}_INFO_REL1`, informationType: "contextual linear relationship", normalisedContent: config.context.firstRelationshipSummary, value: equationText(config.equations[0], config.variableSymbols), unit: config.context.unitSymbol, source: "TEXT" as const, explicitness: "EXPLICIT" as const, role: "RELATIONSHIP" as const, visualElementId: null, usedByPartIds: [`${q}_a`, `${q}_c`] },
        { id: `${q}_INFO_REL2`, informationType: "contextual linear relationship", normalisedContent: config.context.secondRelationshipSummary, value: equationText(config.equations[1], config.variableSymbols), unit: config.context.unitSymbol, source: "TEXT" as const, explicitness: "EXPLICIT" as const, role: "RELATIONSHIP" as const, visualElementId: null, usedByPartIds: [`${q}_b`, `${q}_c`] },
        { id: `${q}_INFO_TARGET`, informationType: "contextual target", normalisedContent: config.context.targetSummary, value: config.context.derivedValue ?? null, unit: config.context.unitSymbol, source: "TEXT" as const, explicitness: "EXPLICIT" as const, role: "TARGET" as const, visualElementId: null, usedByPartIds: [`${q}_c`] },
      ]
    : [
        { id: `${q}_INFO_EQ1`, informationType: "linear equation", normalisedContent: "first equation of a two-variable linear system", value: equationText(config.equations[0], config.variableSymbols), unit: null, source: "TEXT" as const, explicitness: "EXPLICIT" as const, role: "GIVEN_VALUE" as const, visualElementId: graphical ? `VIS_${q}_GRAPH` : null, usedByPartIds: [`${q}_MAIN`] },
        { id: `${q}_INFO_EQ2`, informationType: "linear equation", normalisedContent: "second equation of a two-variable linear system", value: equationText(config.equations[1], config.variableSymbols), unit: null, source: "TEXT" as const, explicitness: "EXPLICIT" as const, role: "GIVEN_VALUE" as const, visualElementId: graphical ? `VIS_${q}_GRAPH` : null, usedByPartIds: [`${q}_MAIN`] },
      ];

  const determinant = config.equations[0].a * config.equations[1].b - config.equations[1].a * config.equations[0].b;
  const generatorFamily = config.mode === "ABSTRACT_SOLVE"
    ? "A8_SIMULTANEOUS_EQUATIONS_ABSTRACT"
    : config.mode === "GRAPH_INTERSECTION_SOLVE"
      ? "A8_SIMULTANEOUS_EQUATIONS_GRAPH_INTERSECTION"
      : config.mode === "CONTEXT_DERIVED_TOTAL"
        ? "A8_SIMULTANEOUS_EQUATIONS_CONTEXT_DERIVED_TOTAL"
        : "A8_SIMULTANEOUS_EQUATIONS_CONTEXT_FORM_AND_SOLVE";

  return {
    identity: {
      id: `N5_MATH_${config.year}_${config.paper}_Q${config.questionNumber}`,
      schemaVersion: "N5_CATALOG_V2",
      courseId: "N5_MATH",
      paperContextId: `N5_MATH_${config.year}_${config.paper}_CONTEXT`,
      year: config.year,
      paper: config.paper,
      questionNumber: config.questionNumber,
      answerCatalogId: `N5_MATH_${config.year}_${config.paper}_Q${config.questionNumber}_MS`,
    },
    sourceLayout: {
      sourcePages: [config.pdfPage],
      printedPageLabels: [config.printedPageLabel],
      continuesAcrossPages: false,
      answerSpace: {
        category: config.answerSpaceCategory,
        estimatedWritingLines: config.estimatedWritingLines,
        responseSurfaceVisualIds: [],
        separateFinalAnswerAreaPresent: false,
        measurementMethod: "PDF_NATIVE",
        sourceMeasurements: config.responseRegions.map((region) => nativeMeasurement(config, region)),
        notes: "Response-space boundaries were measured from native PDF text/graphic positions; the measurements are source evidence only and are not reusable generator layout coordinates.",
      },
      sourceEvidence: [evidence],
    },
    structure: {
      structureType: contextual ? "MULTIPART" : "SINGLE",
      totalMarks: contextual ? 6 : 3,
      parts,
      dependencyType: contextual ? "SHARED_SETUP" : "INDEPENDENT",
      sharedStimulus: contextual,
      sharedVisuals: graphical,
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
      standardProfile: "C+A",
      thinkingProfile: contextual ? "MIXED" : "OPERATIONAL",
      crossSkillQuestion: false,
      skillMarkDistribution: { [SKILL_ID]: contextual ? 6 : 3 },
      conceptMarkDistribution: { [CONCEPT_ID]: contextual ? 6 : 3 },
    },
    task: {
      commandTypes: contextual ? ["WRITE_DOWN", "CALCULATE"] : [graphical ? "FIND" : "SOLVE"],
      responseTypes: contextual ? ["EQUATION", config.mode === "CONTEXT_DERIVED_TOTAL" ? "NUMBER" : "MIXED"] : [graphical ? "COORDINATES" : "NUMBER"],
      responseCount: contextual ? (config.mode === "CONTEXT_DERIVED_TOTAL" ? 3 : 4) : 2,
      explicitMethodCue: config.algebraicallyExplicit,
      methodRestricted: config.algebraicallyExplicit,
      workingRequestedInPrompt: false,
      justificationRequested: false,
      contextualConclusionRequested: contextual && config.mode !== "CONTEXT_DERIVED_TOTAL",
      visualResponseRequired: false,
    },
    mathematics: {
      primaryGoal: contextual
        ? config.mode === "CONTEXT_DERIVED_TOTAL"
          ? "Construct and solve two simultaneous linear equations from context, then evaluate a requested linear combination of the solved quantities."
          : "Construct and solve two simultaneous linear equations from contextual relationships and interpret both unknowns."
        : graphical
          ? "Solve the two displayed linear equations algebraically to determine the coordinates of their common intersection."
          : "Solve a unique pair of simultaneous linear equations algebraically.",
      subgoals,
      operationTypes: contextual ? ["MODEL", "MULTIPLY", "SUBTRACT", "SOLVE", "SUBSTITUTE", "INTERPRET"] : ["MULTIPLY", "SUBTRACT", "SOLVE", "SUBSTITUTE"],
      requiredFormulaIds: [],
      requiredTheoremIds: [],
      stageCount: contextual ? 4 : 3,
      intermediateQuantityTypes: ["scaled linear equations", "first solved variable", "second solved variable"],
      methodSelectionRequired: false,
      solutionCountExpected: 2,
      validitySelectionRequired: false,
      representationTransitions: contextual
        ? [{ from: "contextual quantity relationships", to: "two simultaneous linear equations", purpose: "model two unknown quantities algebraically" }]
        : graphical
          ? [{ from: "two straight-line equations and their plotted intersection", to: "algebraic simultaneous system", purpose: "determine the intersection values using algebra rather than graphical read-off" }]
          : [],
    },
    information,
    reasoning: {
      reasoningTypes: contextual
        ? ["REPRESENTATION_TRANSLATION", "MULTI_STAGE", "STRUCTURE_RECOGNITION", "CONTEXT_INTERPRETATION"]
        : graphical
          ? ["REPRESENTATION_TRANSLATION", "DIRECT_PROCEDURE", "STRUCTURE_RECOGNITION"]
          : ["DIRECT_PROCEDURE", "MULTI_STAGE", "STRUCTURE_RECOGNITION"],
      difficulty: {
        overallDifficulty: contextual ? "MEDIUM" : "MEDIUM",
        methodSelectionLoad: "LOW",
        arithmeticLoad: config.numberTypes.includes("DECIMAL") ? "MEDIUM" : "LOW",
        algebraicLoad: "MEDIUM",
        representationLoad: graphical ? "MEDIUM" : contextual ? "LOW" : "VERY_LOW",
        languageLoad: contextual ? "MEDIUM" : "LOW",
        contextInterpretationLoad: contextual ? "MEDIUM" : "VERY_LOW",
        reasoningDepth: contextual ? "MEDIUM" : "LOW",
        dependencyCount: contextual ? 2 : 0,
        difficultyDrivers: contextual
          ? ["translating two independent relationships into equations", "choosing useful scaling for elimination", config.mode === "CONTEXT_DERIVED_TOTAL" ? "using solved values in a further requested combination" : "interpreting both solved values in context"]
          : graphical
            ? ["using algebra despite a supplied graph", "scaling coefficients for elimination", "reporting the common solution as coordinates"]
            : ["choosing useful scaling for elimination", "maintaining signs through elimination and substitution"],
      },
    },
    numbers: {
      numberTypes: config.numberTypes,
      nonCalculatorFriendly: config.paper === "P1",
      exactAndApproximateMixed: false,
      simplificationVisibility: "NOT_APPLICABLE",
      expectedFinalValueForm: graphical ? "COORDINATE" : config.numberTypes.includes("DECIMAL") ? "DECIMAL" : "INTEGER",
      intermediateValueSize: "MEDIUM",
      finalValueSize: config.mode === "CONTEXT_DERIVED_TOTAL" ? "MEDIUM" : "SMALL",
      dominantInputFormat: contextual && config.context?.currency ? "CURRENCY" : config.numberTypes.includes("DECIMAL") ? "DECIMAL" : "INTEGER",
      dominantOutputFormat: contextual && config.context?.currency ? "CURRENCY" : graphical ? "OTHER" : config.numberTypes.includes("DECIMAL") ? "DECIMAL" : "INTEGER",
      magnitudeNotes: null,
    },
    calculator: {
      status: config.paper === "P1" ? "NON_CALCULATOR" : "CALCULATOR_ALLOWED",
      burden: config.paper === "P1" ? "WRITTEN_NON_CALCULATOR" : "CALCULATOR_OPTIONAL",
      requiredFunctions: [],
      modeSensitive: false,
      modeRequirements: [],
      notes: config.paper === "P1" ? "The historical question appears on the non-calculator paper." : "A calculator is permitted, but the core algebraic structure does not require specialist calculator functionality.",
    },
    parameterDesign: {
      deliberatelyConstructedValues: true,
      exactResultDesigned: true,
      roundingDesigned: false,
      factorisableDesigned: false,
      perfectSquareDesigned: false,
      pythagoreanTripleUsed: false,
      niceRatioUsed: true,
      validSolutionCountDesigned: 1,
      parameterConstraints: [
        "The determinant of the coefficient matrix must be non-zero.",
        "At least one genuine coefficient-scaling step should be required before elimination.",
        "Solutions and any contextual totals must remain exact and appropriate to the source paper's arithmetic burden.",
        ...(contextual ? ["Context quantities must remain realistic and use consistent units."] : []),
      ],
      safeVariationAxes: contextual ? ["coefficient pairs", "unknown values", "derived totals", "context objects", "unit presentation"] : ["coefficient pairs", "constants", "variable symbols", "sign pattern"],
      invariantRelationships: ["two independent linear equations", `non-zero determinant (${determinant} in the historical instance)`, "one unique ordered pair of variable values"],
      degeneracyConditionsToAvoid: ["proportional equations", "zero determinant", "trivial identical equations", "unintended no-solution or infinitely-many-solution systems", ...(contextual ? ["negative or contextually impossible quantities unless the context explicitly permits them"] : [])],
    },
    constraints: {
      mathematicalDomainConstraints: ["The pair of equations has exactly one solution."],
      contextValidityConstraints: contextual ? ["Generated unknown values and totals must be plausible for the selected context."] : [],
      calculatorModeConstraints: [],
      methodConstraints: config.algebraicallyExplicit ? ["The source explicitly requires an algebraic solution."] : [],
      presentationConstraints: graphical ? ["The final response is the coordinate pair of the common intersection."] : [],
    },
    answerSpecification: {
      answerForm: contextual ? "MIXED" : graphical ? "EXACT" : "EXACT",
      simplestFormRequired: false,
      rationalDenominatorRequired: false,
      positivePowersRequired: false,
      scientificNotationRequired: false,
      precisionType: "NONE",
      precisionValue: null,
      units: {
        dimension: contextual ? config.context?.unitDimension ?? null : null,
        unitSymbol: contextual ? config.context?.unitSymbol ?? null : null,
        conversionRequired: false,
        unitsExplicitlyRequested: contextual,
      },
      multipleAnswersRequired: contextual ? (config.mode === "CONTEXT_DERIVED_TOTAL" ? 1 : 2) : graphical ? 1 : 2,
      domainRestriction: null,
      contextualWordsRequired: contextual && config.mode !== "CONTEXT_DERIVED_TOTAL",
      coordinateOrderRelevant: graphical,
      bracketsRelevant: graphical,
      visualAnswerRequired: false,
    },
    context: contextual && config.context
      ? {
          contextualised: true,
          contextDomain: config.context.domain,
          contextRole: "MODEL_DEFINING",
          namedPeoplePresent: config.context.namedPeople,
          currencyPresent: config.context.currency,
          realWorldUnitsPresent: config.context.realWorldUnits,
          realismConstrainsAnswer: true,
          contextObjects: [...config.context.objectLabels, ...config.context.relationshipLabels],
          contextCanBeSafelyReplaced: true,
        }
      : {
          contextualised: false,
          contextDomain: graphical ? "coordinate graph of a linear system" : null,
          contextRole: "NONE",
          namedPeoplePresent: false,
          currencyPresent: false,
          realWorldUnitsPresent: false,
          realismConstrainsAnswer: false,
          contextObjects: [],
          contextCanBeSafelyReplaced: true,
        },
    language: {
      informationDensity: contextual ? "HIGH" : graphical ? "MEDIUM" : "LOW",
      scaffoldingLevel: contextual ? "HIGH" : "MEDIUM",
      bulletStructureUsed: false,
      naturalLanguageInterpretationRequired: contextual,
      promptSummary: contextual
        ? config.mode === "CONTEXT_DERIVED_TOTAL"
          ? "Two contextual relationships are converted to simultaneous equations, solved, and then used to calculate a third requested total."
          : "Two contextual relationships are converted to simultaneous equations and solved for the two underlying quantities."
        : graphical
          ? "Two linear equations are shown with their intersecting lines; the common point is found algebraically."
          : "A compact pair of linear equations is solved algebraically.",
      promptStructure: {
        sentenceCount: config.promptSentenceCount,
        promptWordCount: config.promptWordCount,
        introductionStyle: contextual ? "TWO_RELATED_CONTEXTUAL_RELATIONSHIPS_INTRODUCED_SEQUENTIALLY" : graphical ? "EQUATIONS_AND_SUPPORTING_GRAPH_INTRODUCED_BEFORE_ALGEBRAIC_COMMAND" : "BARE_SYSTEM_OF_TWO_LINEAR_EQUATIONS",
        relationshipStatementStyle: contextual ? "EACH_RELATIONSHIP_GIVES_TWO_COUNTS_AND_A_TOTAL" : graphical ? "EQUATIONS_ARE_LINKED_TO_TWO_INTERSECTING_LINES" : null,
        commandStyle: contextual ? "FORM_TWO_EQUATIONS_THEN_CALCULATE" : graphical ? "FIND_INTERSECTION_COORDINATES_ALGEBRAICALLY" : "SOLVE_ALGEBRAICALLY",
        temporalStructure: contextual ? "SEQUENCE_OF_EVENTS" : "NONE",
        informationOrder: contextual ? ["CONTEXT_RELATIONSHIP_1", "EQUATION_1_TARGET", "CONTEXT_RELATIONSHIP_2", "EQUATION_2_TARGET", "SOLUTION_TARGET"] : graphical ? ["EQUATION_PAIR", "GRAPH", "INTERSECTION_LABEL", "ALGEBRAIC_SOLUTION_TARGET"] : ["ALGEBRAIC_COMMAND", "EQUATION_PAIR"],
        normalisedPromptStructure: contextual ? ["Introduce a first two-quantity relationship and request an equation.", "Introduce an independent second relationship and request an equation.", config.mode === "CONTEXT_DERIVED_TOTAL" ? "Request a further quantity that depends on the solved values." : "Request both underlying quantities."] : graphical ? ["Supply two linear equations and a supporting intersection graph.", "Require the intersection coordinates to be obtained algebraically."] : ["Present two linear equations.", "Require an algebraic solution."],
        usesPronounReference: contextual,
        lexicalFeatureTags: contextual ? ["simultaneous equations", "context modelling", "multipart scaffold"] : graphical ? ["simultaneous equations", "straight lines", "intersection", "algebraic method"] : ["simultaneous equations", "abstract algebra", "algebraic method"],
        generatorVariationNotes: contextual ? "Vary context, coefficients and exact target values while deriving every stated total from the intended solution and preserving an independent two-equation system." : "Vary coefficients, signs and exact solution values while preserving a unique system that genuinely requires coefficient scaling.",
      },
      styleNotes: null,
    },
    visuals: graphical ? catalogValue(buildGraphVisual(config, visualEvidence), [visualEvidence], "CATALOGUE_CLASSIFICATION", "HIGH", null) : notApplicable("No supplied visual material is required for this question."),
    mathematicalModel: notApplicable("The simultaneous-equation structure is represented directly by the equation-system profile rather than the single-input/single-output model profile."),
    specialisedProfiles: {
      arithmetic: notApplicable(),
      percentage: notApplicable(),
      powersSurdsScientific: notApplicable(),
      algebra: catalogValue({ expansionRequired: false, factorisationRequired: false, completingSquareRequired: false, rationalExpressionPresent: false, changeOfSubjectRequired: false }, [evidence], "CATALOGUE_CLASSIFICATION", "HIGH", null),
      equationsInequalities: catalogValue({ equationFamily: "SIMULTANEOUS_LINEAR", inequalityPresent: false, algebraicMethodRequired: config.algebraicallyExplicit, repeatedSubstitutionInvalid: false, expectedSolutionCount: 2, rejectedSolutionReason: null }, [evidence], "CATALOGUE_CLASSIFICATION", "HIGH", "Question-side evidence records the requested algebraic task; any source-specific prohibition of repeated substitution is retained in the matching Answer Catalogue rather than inferred here."),
      functionsGraphs: notApplicable(graphical ? "The supplied graph is catalogued in the visual subsystem; the assessed mathematical operation is algebraic simultaneous-equation solving." : null),
      statistics: notApplicable(),
      geometryMeasureCircleSimilarity: notApplicable(),
      trigonometry: notApplicable(),
      bearings: notApplicable(),
      coordinateGeometry: notApplicable(),
      vectors: notApplicable(),
    },
    family: {
      familyId: config.mode === "ABSTRACT_SOLVE"
        ? "ALG_SIMULTANEOUS_EQUATIONS_ABSTRACT_SOLVE"
        : config.mode === "GRAPH_INTERSECTION_SOLVE"
          ? "ALG_SIMULTANEOUS_EQUATIONS_GRAPH_INTERSECTION_ALGEBRAIC"
          : config.mode === "CONTEXT_DERIVED_TOTAL"
            ? "ALG_SIMULTANEOUS_EQUATIONS_CONTEXT_DERIVED_COMBINATION"
            : "ALG_SIMULTANEOUS_EQUATIONS_CONTEXT_FORM_AND_SOLVE",
      subFamilyId: contextual && config.context ? `A8_CONTEXT_${config.context.domain.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}` : null,
      familyConfidence: "HIGH",
      structuralSignature: contextual
        ? ["two unknown contextual quantities", "two independent linear relationships", "construct two equations", "scale and eliminate", config.mode === "CONTEXT_DERIVED_TOTAL" ? "evaluate a third linear combination" : "interpret both unknowns"]
        : graphical
          ? ["two displayed linear equations", "supporting intersecting-line graph", "algebraic elimination", "intersection coordinates"]
          : ["two linear equations", "two unknowns", "coefficient scaling", "elimination", "unique solution"],
      surfaceStyleIds: contextual ? ["MULTIPART_CONTEXT_TO_EQUATIONS"] : graphical ? ["GRAPH_PLUS_ALGEBRAIC_SYSTEM"] : ["BARE_SYSTEM"],
      relatedFamilyIds: [],
    },
    surface: {
      abstractOrContextual: contextual ? "CONTEXTUAL" : graphical ? "MIXED" : "ABSTRACT",
      proseAmount: contextual ? "HIGH" : graphical ? "MEDIUM" : "LOW",
      visualAmount: graphical ? "HIGH" : "NONE",
      layoutComplexity: contextual || graphical ? "MEDIUM" : "LOW",
      informationOrderCanVarySafely: !contextual,
      visualPlacementCanVarySafely: !graphical,
    },
    generation: {
      readiness: "READY_FOR_PROTOTYPE",
      linkedGeneratorFamilyIds: [generatorFamily],
      invariantMathematics: ["two independent linear equations in two unknowns", "non-zero determinant", "unique exact solution", "at least one coefficient-scaling step before elimination"],
      variableParameters: contextual ? ["coefficients", "unknown values", "derived totals", "context vocabulary", "unit system"] : ["coefficients", "constants", "variable symbols", "solution signs"],
      parameterConstraints: ["determinant non-zero", "avoid proportional equations", "avoid trivially identical coefficients when scaling is the assessed first mark", "keep arithmetic aligned with intended paper burden"],
      safeContextVariations: contextual ? ["cost bundles", "mass bundles", "material-use bundles", "other two-quantity additive contexts"] : [],
      safeRepresentationVariations: graphical ? ["original procedural straight-line graph consistent with the generated equations"] : [],
      unsafeVariations: ["dependent equations", "inconsistent equation/context totals", "a generated context with impossible negative quantities", "copying historical prompt wording or source graph geometry"],
      difficultyControls: ["whether one or both equations require scaling", "least-common-multiple size", "sign pattern", "integer versus simple decimal solution", "whether a contextual post-solution calculation is required"],
      requiredVisualCapabilities: graphical ? ["procedural straight-line graph renderer"] : [],
      requiredValidationChecks: ["mark total and part structure remain valid", "determinant non-zero", "equations evaluate exactly at intended solution", "generated totals derive from intended unknown values", "no historical wording/layout reuse", ...(graphical ? ["graph lines and intersection agree with generated algebra"] : [])],
      provenance: "GENERATION_ANALYSIS",
    },
    sourceIsolation: sourceIsolation(),
    review: questionReviewInProgress(graphical, config.paper, config.year, true),
  };
};
