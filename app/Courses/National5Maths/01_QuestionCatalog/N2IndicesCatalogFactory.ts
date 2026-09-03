import type { CatalogEvidenceRef } from "../CatalogCoreTypes";
import type {
  QuestionAnswerForm,
  QuestionCatalogEntry,
  QuestionCommandType,
  QuestionDemandLevel,
  QuestionFinalValueForm,
  QuestionNumberType,
  QuestionOperationType,
  QuestionPart,
  QuestionPdfRenderMeasurement,
  QuestionReasoningType,
  QuestionRepresentationTransition,
  QuestionResponseType,
  QuestionStandardProfile,
} from "./QuestionCatalogTypes";
import { asHistoricalQuestionCatalogEntry } from "./QuestionCatalogHistoricalView";
import { catalogValue, notApplicable } from "./QuestionCatalogHelpers";

const SKILL_ID = "num-n2-indices";
const PAGE_WIDTH_PT = 595.276;
const PAGE_HEIGHT_PT = 841.89;

export type N2IndexQuestionFamily =
  | "FRACTIONAL_INDEX_EVALUATION"
  | "BRACKETED_INDEX_LAWS"
  | "MULTI_LAW_SIMPLIFICATION";

export type N2IndexQuestionConfig = {
  year: 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2021 | 2022 | 2023 | 2024 | 2025;
  paper: "P1" | "P2";
  questionNumber: string;
  pdfPage: number;
  printedPageLabel: string;
  marks: 2 | 3;
  family: N2IndexQuestionFamily;
  subFamilyId: string;
  primaryConceptId: string;
  conceptIds: string[];
  projectStandardProfile: QuestionStandardProfile;
  commandTypes: QuestionCommandType[];
  responseType: QuestionResponseType;
  answerForm: QuestionAnswerForm;
  expectedFinalValueForm: QuestionFinalValueForm;
  normalisedExpression: string;
  expressionDescription: string;
  targetFormDescription: string | null;
  operationTypes: QuestionOperationType[];
  theoremIds: string[];
  subgoals: string[];
  representationTransitions: QuestionRepresentationTransition[];
  stageCount: number;
  numberTypes: QuestionNumberType[];
  fractionalIndicesPresent: boolean;
  negativeIndicesPresent: boolean;
  rootNotationPresent: boolean;
  bracketedExpressionPresent: boolean;
  algebraicFractionPresent: boolean;
  additiveTermsPresent: boolean;
  coefficientSimplificationRequired: boolean;
  positivePowerOutputExplicit: boolean;
  simplestFormExplicit: boolean;
  reasoningTypes: QuestionReasoningType[];
  overallDifficulty: QuestionDemandLevel;
  algebraicLoad: QuestionDemandLevel;
  representationLoad: QuestionDemandLevel;
  difficultyDrivers: string[];
  structuralSignature: string[];
  surfaceStyleId: string;
  promptSentenceCount: number;
  promptWordCount: number;
  introductionStyle: string;
  commandStyle: string;
  informationOrder: string[];
  normalisedPromptStructure: string[];
  lexicalFeatureTags: string[];
  answerSpaceCategory: "MEDIUM" | "LARGE" | "FULL_PAGE";
  estimatedWritingLines: number;
  responseTopPt: number;
  responseBottomPt: number;
  responseBoundaryConvention: string;
};

const sourceEvidence = (config: N2IndexQuestionConfig): CatalogEvidenceRef => ({
  documentId: `N5_MATH_${config.year}_QP`,
  pdfPages: [config.pdfPage],
  printedPageLabels: [config.printedPageLabel],
  paper: config.paper,
  questionLocator: `Q${config.questionNumber}`,
  evidenceType: "QUESTION",
  locatorNote: null,
});

const nativeMeasurement = (config: N2IndexQuestionConfig): QuestionPdfRenderMeasurement => {
  const heightPt = Math.max(0, config.responseBottomPt - config.responseTopPt);
  return {
    id: `Q${config.questionNumber}_SPACE_MAIN`,
    regionType: "WRITTEN_WORKING",
    questionPartIds: [`Q${config.questionNumber}_MAIN`],
    pdfPageNumber: config.pdfPage,
    printedPageLabel: config.printedPageLabel,
    measurementMethod: "PDF_NATIVE",
    renderDpi: null,
    pageWidthPx: null,
    pageHeightPx: null,
    topPx: null,
    bottomPx: null,
    leftPx: null,
    rightPx: null,
    heightPx: null,
    widthPx: null,
    topPt: config.responseTopPt,
    bottomPt: config.responseBottomPt,
    leftPt: null,
    rightPt: null,
    heightPt,
    widthPt: null,
    heightMm: Number((heightPt * 25.4 / 72).toFixed(2)),
    widthMm: null,
    boundaryConvention: config.responseBoundaryConvention,
    notes: `PDF-native vertical measurement on a ${PAGE_WIDTH_PT.toFixed(3)} by ${PAGE_HEIGHT_PT.toFixed(2)} point source page.`,
  };
};

const familyId = (family: N2IndexQuestionFamily) => {
  switch (family) {
    case "FRACTIONAL_INDEX_EVALUATION":
      return "NUM_N2_FRACTIONAL_INDEX_EVALUATION";
    case "BRACKETED_INDEX_LAWS":
      return "NUM_N2_BRACKETED_INDEX_LAWS";
    case "MULTI_LAW_SIMPLIFICATION":
      return "NUM_N2_MULTI_LAW_SIMPLIFICATION";
  }
};

export const createN2IndexQuestionCatalogEntry = (
  config: N2IndexQuestionConfig,
): QuestionCatalogEntry => {
  const q = `Q${config.questionNumber}`;
  const fullSimplificationExplicit = config.targetFormDescription?.toLowerCase().includes("fully simplified") ?? false;
  const evidence = sourceEvidence(config);
  const part: QuestionPart = {
    id: `${q}_MAIN`,
    label: "",
    marks: config.marks,
    primarySkillId: SKILL_ID,
    secondarySkillIds: [],
    conceptIds: config.conceptIds,
    topic: "NUM",
    commandTypes: config.commandTypes,
    responseTypes: [config.responseType],
    dependsOnPartIds: [],
    sharedInformationIds: [`${q}_INFO_EXPR`],
    visualElementIds: [],
    standardProfile: config.projectStandardProfile,
    thinkingProfile: "OPERATIONAL",
    calculatorBurden: config.paper === "P1" ? "WRITTEN_NON_CALCULATOR" : "CALCULATOR_OPTIONAL",
  };

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
      sourcePages: [config.pdfPage],
      printedPageLabels: [config.printedPageLabel],
      continuesAcrossPages: false,
      answerSpace: {
        category: config.answerSpaceCategory,
        estimatedWritingLines: config.estimatedWritingLines,
        responseSurfaceVisualIds: [],
        separateFinalAnswerAreaPresent: false,
        measurementMethod: "PDF_NATIVE",
        sourceMeasurements: [nativeMeasurement(config)],
        notes: "The blank region beneath the source task is treated as the candidate working area until the next printed task or footer boundary.",
      },
      sourceEvidence: [evidence],
    },
    structure: {
      structureType: "SINGLE",
      totalMarks: config.marks,
      parts: [part],
      dependencyType: "INDEPENDENT",
      sharedStimulus: false,
      sharedVisuals: false,
      sharedGivenData: false,
      requiredResultProvided: false,
    },
    curriculum: {
      primaryTopic: "NUM",
      primarySkillId: SKILL_ID,
      secondarySkillIds: [],
      primaryConceptId: config.primaryConceptId,
      conceptIds: config.conceptIds,
      paperSuitability: config.paper,
      standardProfile: config.projectStandardProfile,
      thinkingProfile: "OPERATIONAL",
      crossSkillQuestion: false,
      skillMarkDistribution: { [SKILL_ID]: config.marks },
      conceptMarkDistribution: { [config.primaryConceptId]: config.marks },
    },
    task: {
      commandTypes: config.commandTypes,
      responseTypes: [config.responseType],
      responseCount: 1,
      explicitMethodCue: false,
      methodRestricted: false,
      workingRequestedInPrompt: false,
      justificationRequested: false,
      contextualConclusionRequested: false,
      visualResponseRequired: false,
    },
    mathematics: {
      primaryGoal: config.family === "FRACTIONAL_INDEX_EVALUATION"
        ? "Evaluate an exact numerical expression containing a fractional index."
        : config.family === "BRACKETED_INDEX_LAWS"
          ? "Remove the bracket structure and simplify the resulting indexed expression."
          : "Simplify an indexed expression by applying more than one index-law idea or representation step.",
      subgoals: config.subgoals.map((summary, index) => ({
        id: `${q}_S${index + 1}`,
        summary,
        dependsOnSubgoalIds: index === 0 ? [] : [`${q}_S${index}`],
      })),
      operationTypes: config.operationTypes,
      requiredFormulaIds: [],
      requiredTheoremIds: config.theoremIds,
      stageCount: config.stageCount,
      intermediateQuantityTypes: config.subgoals.slice(0, -1).map((_, index) => `index simplification stage ${index + 1}`),
      methodSelectionRequired: false,
      solutionCountExpected: 1,
      validitySelectionRequired: false,
      representationTransitions: config.representationTransitions,
    },
    information: [
      {
        id: `${q}_INFO_EXPR`,
        informationType: "indexed expression",
        normalisedContent: config.expressionDescription,
        value: config.normalisedExpression,
        unit: null,
        source: "TEXT",
        explicitness: "EXPLICIT",
        role: "GIVEN_VALUE",
        visualElementId: null,
        usedByPartIds: [`${q}_MAIN`],
      },
      ...(config.targetFormDescription
        ? [{
            id: `${q}_INFO_TARGET`,
            informationType: "required output form",
            normalisedContent: config.targetFormDescription,
            value: null,
            unit: null,
            source: "TEXT" as const,
            explicitness: "EXPLICIT" as const,
            role: "RESPONSE_INSTRUCTION" as const,
            visualElementId: null,
            usedByPartIds: [`${q}_MAIN`],
          }]
        : []),
    ],
    reasoning: {
      reasoningTypes: config.reasoningTypes,
      difficulty: {
        overallDifficulty: config.overallDifficulty,
        methodSelectionLoad: "VERY_LOW",
        arithmeticLoad: config.family === "FRACTIONAL_INDEX_EVALUATION" ? "LOW" : "VERY_LOW",
        algebraicLoad: config.algebraicLoad,
        representationLoad: config.representationLoad,
        languageLoad: "VERY_LOW",
        contextInterpretationLoad: "VERY_LOW",
        reasoningDepth: config.stageCount >= 3 ? "MEDIUM" : "LOW",
        dependencyCount: Math.max(0, config.stageCount - 1),
        difficultyDrivers: config.difficultyDrivers,
      },
    },
    numbers: {
      numberTypes: config.numberTypes,
      nonCalculatorFriendly: true,
      exactAndApproximateMixed: false,
      simplificationVisibility: config.commandTypes.includes("SIMPLIFY") || config.commandTypes.includes("EXPAND")
        ? "EXPLICIT_INSTRUCTION"
        : "NOT_APPLICABLE",
      expectedFinalValueForm: config.expectedFinalValueForm,
      intermediateValueSize: "SMALL",
      finalValueSize: "SMALL",
      dominantInputFormat: config.answerForm === "EXACT" ? "INTEGER" : "ALGEBRAIC",
      dominantOutputFormat: config.answerForm === "EXACT" ? "INTEGER" : "ALGEBRAIC",
      magnitudeNotes: null,
    },
    calculator: {
      status: config.paper === "P1" ? "NON_CALCULATOR" : "CALCULATOR_ALLOWED",
      burden: config.paper === "P1" ? "WRITTEN_NON_CALCULATOR" : "CALCULATOR_OPTIONAL",
      requiredFunctions: [],
      modeSensitive: false,
      modeRequirements: [],
      notes: config.paper === "P2"
        ? "A calculator is permitted by the source paper, but the assessed index manipulation is calculator-independent."
        : "The source task appears on the non-calculator paper and uses values/expressions designed for exact manipulation.",
    },
    constraints: {
      mathematicalDomainConstraints: [
        "All displayed powers use a common algebraic base where an index law is applied.",
        ...(config.rootNotationPresent ? ["Root notation is mathematically equivalent to a fractional power of the same base."] : []),
      ],
      contextValidityConstraints: [],
      calculatorModeConstraints: [],
      methodConstraints: [],
      presentationConstraints: [
        ...(config.positivePowerOutputExplicit ? ["The source explicitly requires the final expression to use a positive power."] : []),
        ...(fullSimplificationExplicit ? ["The source explicitly requires full simplification."] : []),
        ...(config.targetFormDescription ? [config.targetFormDescription] : []),
      ],
    },
    answerSpecification: {
      answerForm: config.answerForm,
      simplestFormRequired: fullSimplificationExplicit,
      rationalDenominatorRequired: false,
      positivePowersRequired: config.positivePowerOutputExplicit,
      scientificNotationRequired: false,
      precisionType: "NONE",
      precisionValue: null,
      units: {
        dimension: null,
        unitSymbol: null,
        conversionRequired: false,
        unitsExplicitlyRequested: false,
      },
      multipleAnswersRequired: 1,
      domainRestriction: null,
      contextualWordsRequired: false,
      coordinateOrderRelevant: false,
      bracketsRelevant: config.bracketedExpressionPresent,
      visualAnswerRequired: false,
    },
    context: {
      contextualised: false,
      contextDomain: null,
      contextRole: "NONE",
      namedPeoplePresent: false,
      currencyPresent: false,
      realWorldUnitsPresent: false,
      realismConstrainsAnswer: false,
      contextObjects: [],
      contextCanBeSafelyReplaced: true,
    },
    language: {
      informationDensity: "VERY_LOW",
      scaffoldingLevel: "LOW",
      bulletStructureUsed: false,
      naturalLanguageInterpretationRequired: false,
      promptSummary: config.expressionDescription,
      promptStructure: {
        sentenceCount: config.promptSentenceCount,
        promptWordCount: config.promptWordCount,
        introductionStyle: config.introductionStyle,
        relationshipStatementStyle: null,
        commandStyle: config.commandStyle,
        temporalStructure: "NONE",
        informationOrder: config.informationOrder,
        normalisedPromptStructure: config.normalisedPromptStructure,
        usesPronounReference: false,
        lexicalFeatureTags: config.lexicalFeatureTags,
      },
      styleNotes: "Minimal abstract prompt; almost all assessment information is carried by mathematical notation and the command/output-form instruction.",
    },
    visuals: notApplicable("No supplied visual material is used in this question."),
    mathematicalModel: notApplicable(),
    specialisedProfiles: {
      arithmetic: catalogValue({
        arithmeticComplexity: config.family === "FRACTIONAL_INDEX_EVALUATION" ? "LOW" : "VERY_LOW",
        commonDenominatorRequired: false,
        cancellationAvailable: config.coefficientSimplificationRequired,
        simplificationRequired: config.family !== "FRACTIONAL_INDEX_EVALUATION",
        simplificationVisibility: config.commandTypes.includes("SIMPLIFY") || config.commandTypes.includes("EXPAND")
          ? "EXPLICIT_INSTRUCTION"
          : "NOT_APPLICABLE",
        cancellationStyle: config.coefficientSimplificationRequired ? "FINAL_SIMPLIFICATION_ONLY" : "NONE",
      }, [evidence], "CATALOGUE_CLASSIFICATION", "HIGH", null),
      percentage: notApplicable(),
      powersSurdsScientific: catalogValue({
        powersPresent: true,
        surdsPresent: config.rootNotationPresent,
        scientificNotationPresent: false,
        rationalisationRequired: false,
        exactSimplificationRequired: true,
      }, [evidence], "CATALOGUE_CLASSIFICATION", "HIGH", [
        `Index-law ingredients: ${config.theoremIds.join(", ")}.`,
        `Fractional indices present: ${config.fractionalIndicesPresent ? "yes" : "no"}.`,
        `Negative indices present: ${config.negativeIndicesPresent ? "yes" : "no"}.`,
        `Root notation present: ${config.rootNotationPresent ? "yes" : "no"}.`,
        `Bracketed index structure present: ${config.bracketedExpressionPresent ? "yes" : "no"}.`,
        `Algebraic fraction present: ${config.algebraicFractionPresent ? "yes" : "no"}.`,
        `Additive terms present: ${config.additiveTermsPresent ? "yes" : "no"}.`,
      ].join(" ")),
      algebra: config.answerForm === "SYMBOLIC"
        ? catalogValue({
            expansionRequired: config.commandTypes.includes("EXPAND"),
            factorisationRequired: false,
            completingSquareRequired: false,
            rationalExpressionPresent: config.algebraicFractionPresent,
            changeOfSubjectRequired: false,
          }, [evidence], "CATALOGUE_CLASSIFICATION", "HIGH", null)
        : notApplicable(),
      equationsInequalities: notApplicable(),
      functionsGraphs: notApplicable(),
      statistics: notApplicable(),
      geometryMeasureCircleSimilarity: notApplicable(),
      trigonometry: notApplicable(),
      bearings: notApplicable(),
      coordinateGeometry: notApplicable(),
      vectors: notApplicable(),
    },
    family: {
      familyId: familyId(config.family),
      subFamilyId: config.subFamilyId,
      familyConfidence: "HIGH",
      structuralSignature: config.structuralSignature,
      surfaceStyleIds: [config.surfaceStyleId],
      relatedFamilyIds: [
        "NUM_N2_FRACTIONAL_INDEX_EVALUATION",
        "NUM_N2_BRACKETED_INDEX_LAWS",
        "NUM_N2_MULTI_LAW_SIMPLIFICATION",
      ].filter((id) => id !== familyId(config.family)),
    },
    surface: {
      abstractOrContextual: "ABSTRACT",
      proseAmount: "LOW",
      visualAmount: "NONE",
      layoutComplexity: "LOW",
      informationOrderCanVarySafely: true,
      visualPlacementCanVarySafely: true,
    },
    review: {
      status: "IN_PROGRESS",
      sourceFactsComplete: true,
      classificationComplete: false,
      counterpartCrossChecked: false,
      visualEvidenceCrossChecked: true,
      unresolvedIssues: [
        "Matching Answer Catalogue evidence has not yet been cross-checked.",
        "Mark-level standard classification remains provisional until the paired marking-evidence pass.",
        "N2 Builder concept labels still reflect the pre-synthesis law-by-law split and will be reconciled when generator wiring is migrated.",
      ],
      validationNotes: [
        `Question-paper evidence captured for ${config.year} ${config.paper} Q${config.questionNumber}.`,
        `Historical family classification: ${familyId(config.family)} / ${config.subFamilyId}.`,
      ],
      reviewedAt: null,
    },
  });
};
