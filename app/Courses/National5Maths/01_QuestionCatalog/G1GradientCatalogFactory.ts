import type { CatalogEvidenceRef } from "../CatalogCoreTypes";
import type {
  QuestionCatalogEntry,
  QuestionInformationItem,
  QuestionOperationType,
  QuestionPart,
  QuestionPdfRenderMeasurement,
  QuestionReasoningType,
} from "./QuestionCatalogTypes";
import { asHistoricalQuestionCatalogEntry } from "./QuestionCatalogHistoricalView";
import { catalogValue, notApplicable } from "./QuestionCatalogHelpers";
import type { G1QuestionConfig, G1ResponseRegion } from "./G1GradientCatalogSource";

const G1_SKILL_ID = "geo-g01-gradient-two-points";
const G1_CONCEPT_ID = "geo-g1-1";
const S2_SKILL_ID = "stat-s02-linear-model";
const S2_CONCEPT_ID = "stat-s2-1";
const PAGE_WIDTH_PT = 595.276;
const PAGE_HEIGHT_PT = 841.89;

const sourceEvidence = (
  config: G1QuestionConfig,
  evidenceType: "QUESTION" | "VISUAL" = "QUESTION",
  pages = config.sourcePages,
  printedPageLabels = config.printedPageLabels,
): CatalogEvidenceRef => ({
  documentId: `N5_MATH_${config.year}_QP`,
  pdfPages: pages,
  printedPageLabels,
  paper: config.paper,
  questionLocator: `Q${config.questionNumber}`,
  evidenceType,
  locatorNote: evidenceType === "VISUAL" ? "Supplied coordinate/graph visual associated with the question." : null,
});

const nativeMeasurement = (region: G1ResponseRegion): QuestionPdfRenderMeasurement => {
  const heightPt = Math.max(0, region.bottomPt - region.topPt);
  return {
    id: region.id,
    regionType: "WRITTEN_WORKING",
    questionPartIds: [region.partId],
    pdfPageNumber: region.pdfPage,
    printedPageLabel: region.printedPageLabel,
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
    topPt: region.topPt,
    bottomPt: region.bottomPt,
    leftPt: null,
    rightPt: null,
    heightPt,
    widthPt: null,
    heightMm: Number((heightPt * 25.4 / 72).toFixed(2)),
    widthMm: null,
    boundaryConvention: region.boundaryConvention,
    notes: `PDF-native vertical boundary capture on a ${PAGE_WIDTH_PT.toFixed(3)} by ${PAGE_HEIGHT_PT.toFixed(2)} point source page; exact source artwork/coordinates are evidence only and are not reusable layout instructions.`,
  };
};

const visualId = (config: G1QuestionConfig) => `VIS_Q${config.questionNumber}_G1`;
const pointInfoId = (config: G1QuestionConfig, pointId: string) => `Q${config.questionNumber}_INFO_POINT_${pointId}`;

const buildParts = (config: G1QuestionConfig): QuestionPart[] => {
  const q = `Q${config.questionNumber}`;
  const visualElementIds = config.visual ? [visualId(config)] : [];
  const pointIds = config.points.map((point) => pointInfoId(config, point.id));
  const calculatorBurden = config.paper === "P1" ? "WRITTEN_NON_CALCULATOR" as const : "CALCULATOR_OPTIONAL" as const;

  if (config.totalMarks === 3) {
    return [{
      id: `${q}_MAIN`,
      label: "",
      marks: 3,
      primarySkillId: G1_SKILL_ID,
      secondarySkillIds: [],
      conceptIds: [G1_CONCEPT_ID],
      topic: "GEO",
      commandTypes: ["FIND"],
      responseTypes: [config.candidateMustFindGradientExpressionOnly ? "EXPRESSION" : "EQUATION"],
      dependsOnPartIds: [],
      sharedInformationIds: [...pointIds, `${q}_INFO_RELATIONSHIP`],
      visualElementIds,
      standardProfile: config.standardProfile,
      thinkingProfile: "OPERATIONAL",
      calculatorBurden,
    }];
  }

  const embeddedStatisticalFollowUp = config.embeddedS2Marks === 1;
  return [
    {
      id: `${q}_a`,
      label: "a",
      marks: 3,
      primarySkillId: G1_SKILL_ID,
      secondarySkillIds: [],
      conceptIds: [G1_CONCEPT_ID],
      topic: "GEO",
      commandTypes: ["FIND"],
      responseTypes: ["EQUATION"],
      dependsOnPartIds: [],
      sharedInformationIds: [...pointIds, `${q}_INFO_RELATIONSHIP`],
      visualElementIds,
      standardProfile: "C",
      thinkingProfile: "OPERATIONAL",
      calculatorBurden,
    },
    {
      id: `${q}_b`,
      label: "b",
      marks: 1,
      primarySkillId: embeddedStatisticalFollowUp ? S2_SKILL_ID : G1_SKILL_ID,
      secondarySkillIds: [],
      conceptIds: [embeddedStatisticalFollowUp ? S2_CONCEPT_ID : G1_CONCEPT_ID],
      topic: embeddedStatisticalFollowUp ? "STAT" : "GEO",
      commandTypes: [embeddedStatisticalFollowUp ? "ESTIMATE" : "CALCULATE"],
      responseTypes: ["NUMBER"],
      dependsOnPartIds: [`${q}_a`],
      sharedInformationIds: [`${q}_INFO_TARGET`, `${q}_INFO_RELATIONSHIP`],
      visualElementIds,
      standardProfile: "C",
      thinkingProfile: embeddedStatisticalFollowUp ? "REASONING" : "OPERATIONAL",
      calculatorBurden,
    },
  ];
};

const buildInformation = (config: G1QuestionConfig): QuestionInformationItem[] => {
  const q = `Q${config.questionNumber}`;
  const pointItems: QuestionInformationItem[] = config.points.map((point) => ({
    id: pointInfoId(config, point.id),
    informationType: point.isCandidateReadFromGraph ? "candidate-readable point on supplied line" : "coordinate pair",
    normalisedContent: point.label
      ? `${point.label} has coordinate ${point.printedCoordinate}.`
      : `A relevant line point has coordinate ${point.printedCoordinate}.`,
    value: point.printedCoordinate,
    unit: null,
    source: point.source,
    explicitness: point.isCandidateReadFromGraph ? "MUST_INFER" : "EXPLICIT",
    role: "GIVEN_VALUE",
    visualElementId: point.source === "TEXT" ? null : visualId(config),
    usedByPartIds: config.totalMarks === 4 ? [`${q}_a`] : [`${q}_MAIN`],
  }));

  const items: QuestionInformationItem[] = [
    ...pointItems,
    {
      id: `${q}_INFO_RELATIONSHIP`,
      informationType: config.mode.includes("BEST_FIT") ? "best-fit line relationship" : "straight-line relationship",
      normalisedContent: config.sourceRelationship,
      value: null,
      unit: null,
      source: config.visual ? "GRAPH" : "TEXT",
      explicitness: "EXPLICIT",
      role: "RELATIONSHIP",
      visualElementId: config.visual ? visualId(config) : null,
      usedByPartIds: config.totalMarks === 4 ? [`${q}_a`, `${q}_b`] : [`${q}_MAIN`],
    },
  ];

  if (config.context.contextualised) {
    items.push(
      {
        id: `${q}_INFO_X_VARIABLE`,
        informationType: "independent variable definition",
        normalisedContent: `${config.axis.xVariable} represents ${config.axis.xLabel}${config.axis.xUnit ? ` measured in ${config.axis.xUnit}` : ""}.`,
        value: config.axis.xVariable,
        unit: config.axis.xUnit,
        source: "TEXT",
        explicitness: "EXPLICIT",
        role: "CONTEXT",
        visualElementId: config.visual ? visualId(config) : null,
        usedByPartIds: config.totalMarks === 4 ? [`${q}_a`, `${q}_b`] : [`${q}_MAIN`],
      },
      {
        id: `${q}_INFO_Y_VARIABLE`,
        informationType: "dependent variable definition",
        normalisedContent: `${config.axis.yVariable} represents ${config.axis.yLabel}${config.axis.yUnit ? ` measured in ${config.axis.yUnit}` : ""}.`,
        value: config.axis.yVariable,
        unit: config.axis.yUnit,
        source: "TEXT",
        explicitness: "EXPLICIT",
        role: "CONTEXT",
        visualElementId: config.visual ? visualId(config) : null,
        usedByPartIds: config.totalMarks === 4 ? [`${q}_a`, `${q}_b`] : [`${q}_MAIN`],
      },
    );
  }

  if (config.target) {
    items.push({
      id: `${q}_INFO_TARGET`,
      informationType: "follow-on model input",
      normalisedContent: `The follow-on part supplies ${config.target.variable}=${config.target.value}${config.target.unit ? ` ${config.target.unit}` : ""} and requests the ${config.target.outputDescription}.`,
      value: config.target.value,
      unit: config.target.unit,
      source: "TEXT",
      explicitness: "EXPLICIT",
      role: "TARGET",
      visualElementId: null,
      usedByPartIds: [config.target.partId],
    });
  }

  if (config.simplestFormExplicit) {
    items.push({
      id: `${q}_INFO_OUTPUT_FORM`,
      informationType: "required output form",
      normalisedContent: "The source explicitly requires the requested equation or expression in simplest form.",
      value: null,
      unit: null,
      source: "TEXT",
      explicitness: "EXPLICIT",
      role: "RESPONSE_INSTRUCTION",
      visualElementId: null,
      usedByPartIds: [config.totalMarks === 4 ? `${q}_a` : `${q}_MAIN`],
    });
  }

  return items;
};

const buildVisuals = (config: G1QuestionConfig) => {
  if (!config.visual) return notApplicable("No supplied visual is used; the two coordinates are given directly in text.");

  const q = `Q${config.questionNumber}`;
  const v = config.visual;
  const evidence = sourceEvidence(config, "VISUAL", [v.sourcePageNumber], [config.printedPageLabels[config.sourcePages.indexOf(v.sourcePageNumber)] ?? `PDF page ${v.sourcePageNumber}`]);
  const xAxisId = `${q}_X_AXIS`;
  const yAxisId = `${q}_Y_AXIS`;
  const lineId = `${q}_LINE`;
  const pointEntityIds = config.points.map((point) => `${q}_POINT_${point.id}`);
  const entities = [
    { id: xAxisId, entityType: "AXIS" as const, semanticName: `${v.axis.xLabel} axis`, printedLabel: v.axis.xVariable, numericValue: null, symbolicValue: v.axis.xVariable, unit: v.axis.xUnit, mathematicallyEssential: v.candidateMustReadValues, orientationMeaningful: true, candidateEditable: false, attributes: { minimum: v.axis.xMinimum, maximum: v.axis.xMaximum, tickInterval: v.axis.xTickInterval, numericScaleShown: v.axis.numericScaleShown } },
    { id: yAxisId, entityType: "AXIS" as const, semanticName: `${v.axis.yLabel} axis`, printedLabel: v.axis.yVariable, numericValue: null, symbolicValue: v.axis.yVariable, unit: v.axis.yUnit, mathematicallyEssential: v.candidateMustReadValues, orientationMeaningful: true, candidateEditable: false, attributes: { minimum: v.axis.yMinimum, maximum: v.axis.yMaximum, tickInterval: v.axis.yTickInterval, numericScaleShown: v.axis.numericScaleShown } },
    { id: lineId, entityType: "LINE" as const, semanticName: v.lineOfBestFitPresent ? "supplied line of best fit" : "supplied straight line", printedLabel: null, numericValue: null, symbolicValue: null, unit: null, mathematicallyEssential: true, orientationMeaningful: false, candidateEditable: false, attributes: { lineOfBestFit: v.lineOfBestFitPresent, candidateDrawsLine: v.candidateDrawsBestFitLine } },
    ...config.points.map((point) => ({
      id: `${q}_POINT_${point.id}`,
      entityType: "POINT" as const,
      semanticName: point.label ? `point ${point.label}` : `readable line point ${point.id}`,
      printedLabel: point.label,
      numericValue: null,
      symbolicValue: point.printedCoordinate,
      unit: null,
      mathematicallyEssential: point.isPrimaryGradientPoint || point.isCandidateReadFromGraph,
      orientationMeaningful: false,
      candidateEditable: false,
      attributes: { x: point.xDisplay, y: point.yDisplay, coordinateSource: point.source, candidateMustRead: point.isCandidateReadFromGraph },
    })),
    ...(v.scatterPresent ? [{ id: `${q}_SCATTER_SET`, entityType: "OTHER" as const, semanticName: "scatter observations", printedLabel: null, numericValue: null, symbolicValue: null, unit: null, mathematicallyEssential: false, orientationMeaningful: false, candidateEditable: false, attributes: { scatterPresent: true } }] : []),
  ];

  const relations = config.points.map((point) => ({
    id: `${q}_REL_${point.id}_LINE`,
    relationType: "PART_OF" as const,
    fromEntityIds: [`${q}_POINT_${point.id}`],
    toEntityIds: [lineId],
    normalisedMeaning: point.isCandidateReadFromGraph
      ? `${point.printedCoordinate} is a grid-readable point on the supplied line used as coordinate evidence.`
      : `${point.label ?? "The point"} lies on the supplied straight line.`,
    essentialToSolution: true,
    sourceEvidence: [evidence],
  }));

  const labels = [
    { entityId: xAxisId, role: "AXIS" as const, normalisedValue: v.axis.xVariable, placementMathematicallyConstrained: true, collisionPriority: "HIGH" as const },
    { entityId: yAxisId, role: "AXIS" as const, normalisedValue: v.axis.yVariable, placementMathematicallyConstrained: true, collisionPriority: "HIGH" as const },
    ...config.points.flatMap((point) => [
      ...(point.label ? [{ entityId: `${q}_POINT_${point.id}`, role: "POINT_NAME" as const, normalisedValue: point.label, placementMathematicallyConstrained: false, collisionPriority: "HIGH" as const }] : []),
      ...(!point.isCandidateReadFromGraph && point.source !== "TEXT" ? [{ entityId: `${q}_POINT_${point.id}`, role: "COORDINATE" as const, normalisedValue: point.printedCoordinate, placementMathematicallyConstrained: false, collisionPriority: "HIGH" as const }] : []),
    ]),
  ];

  return catalogValue({
    elements: [{
      id: visualId(config),
      sourceOrder: 1,
      visualType: v.visualType,
      roles: v.scatterPresent ? ["STRUCTURAL_MODEL" as const, "SUPPORTIVE" as const] : ["ESSENTIAL_DATA" as const, "STRUCTURAL_MODEL" as const],
      dependency: v.dependency,
      candidateInteraction: v.candidateMustReadValues ? "READ_VALUES" as const : "READ_ONLY" as const,
      textRelationship: v.textRelationship,
      scale: {
        mode: v.exactGeometryRequiredForRenderer ? "TO_SCALE" as const : "SCHEMATIC" as const,
        measurementFromDrawingPermitted: false,
        proportionalAppearanceDesirable: true,
        exactGeometryRequiredForRenderer: v.exactGeometryRequiredForRenderer,
        notes: v.candidateMustReadValues
          ? "Grid/axis values are intended to be read mathematically; generated equivalents require internally exact point/line placement but must not reproduce source coordinates or artwork."
          : "The visual carries structural/context information; source pixel geometry is not part of the mathematical evidence.",
      },
      orientation: {
        verticalDirectionMeaningful: true,
        horizontalDirectionMeaningful: true,
        northReferenceMeaningful: false,
        groundReferenceMeaningful: false,
        startPositionMeaningful: false,
        rotationDirectionMeaningful: false,
        viewpointMeaningful: false,
        mirroringSafe: false,
        rotationSafe: false,
      },
      labels,
      semanticModel: {
        entities,
        relations,
        facts: [
          { id: `${q}_VF_LINE`, factType: v.lineOfBestFitPresent ? "BEST_FIT_LINE_PRESENT" : "STRAIGHT_LINE_PRESENT", normalisedFact: v.lineOfBestFitPresent ? "A straight line of best fit is supplied through the graph region." : "A straight line through the relevant points is supplied.", relatedEntityIds: [lineId], explicitness: "EXPLICIT_TEXT" as const, essentialToSolution: true, sourceEvidence: [evidence] },
          ...(v.candidateMustReadValues ? [{ id: `${q}_VF_GRID_READ`, factType: "CANDIDATE_READS_COORDINATES", normalisedFact: "The candidate must obtain suitable line coordinates from the scaled axes/grid; the coordinate values are not duplicated in prose.", relatedEntityIds: pointEntityIds, explicitness: "VISUALLY_IMPLIED" as const, essentialToSolution: true, sourceEvidence: [evidence] }] : []),
        ],
      },
      layout: {
        sourcePageNumber: v.sourcePageNumber,
        sourcePagePosition: v.sourcePagePosition,
        sourceRelativeWidth: v.sourceRelativeWidth,
        preferredGeneratedAspectRatio: v.preferredGeneratedAspectRatio,
        minimumReadableWidthMm: v.candidateMustReadValues ? 95 : 70,
        minimumReadableHeightMm: v.candidateMustReadValues ? 65 : 35,
        allowInlinePlacement: false,
        allowFullWidthPlacement: true,
        labelCollisionSensitive: true,
      },
      specialisedProfiles: {
        geometry: catalogValue({
          dimension: "2D" as const,
          shapeFamilies: ["coordinate straight line"],
          labelledPointIds: pointEntityIds,
          rightAnglesPresent: false,
          parallelRelationshipsPresent: false,
          equalLengthRelationshipsPresent: false,
          similarityPresent: false,
          congruencePresent: false,
          shadedRegionsPresent: false,
          auxiliaryLinesPresent: false,
          algebraicDimensionsPresent: false,
          compoundShapePresent: false,
        }, [evidence], "CATALOGUE_CLASSIFICATION", "HIGH", "Visual belongs to coordinate geometry; it is not a measure-from-drawing task."),
        circle: notApplicable(),
        graph: catalogValue({
          graphFamily: "STRAIGHT_LINE" as const,
          xAxis: { variable: v.axis.xVariable, label: v.axis.xLabel, unit: v.axis.xUnit, numericScaleShown: v.axis.numericScaleShown, tickInterval: v.axis.xTickInterval, minimumShown: v.axis.xMinimum, maximumShown: v.axis.xMaximum },
          yAxis: { variable: v.axis.yVariable, label: v.axis.yLabel, unit: v.axis.yUnit, numericScaleShown: v.axis.numericScaleShown, tickInterval: v.axis.yTickInterval, minimumShown: v.axis.yMinimum, maximumShown: v.axis.yMaximum },
          originShown: v.axis.originShown,
          gridShown: v.axis.gridShown,
          rootsRelevant: false,
          turningPointsRelevant: false,
          asymptotesRelevant: false,
          symmetryRelevant: false,
          labelledPointIds: pointEntityIds.filter((_, index) => config.points[index]?.label != null),
          referenceLinesPresent: false,
          candidateMustReadValues: v.candidateMustReadValues,
          candidateMustProduceGraph: false,
          accuracyExpectation: v.candidateMustReadValues ? "ACCURATE" as const : "SCHEMATIC" as const,
        }, [evidence], "CATALOGUE_CLASSIFICATION", "HIGH", null),
        scatter: v.scatterPresent
          ? catalogValue({
              xVariable: v.axis.xVariable,
              yVariable: v.axis.yVariable,
              dataPointCount: null,
              lineOfBestFitPresent: v.lineOfBestFitPresent,
              candidateDrawsBestFitLine: v.candidateDrawsBestFitLine,
              correlationInterpretationRequired: false,
              interpolationRequired: v.interpolationRequired,
              extrapolationRequired: v.extrapolationRequired,
              highlightedObservationIds: pointEntityIds.filter((_, index) => config.points[index]?.label != null),
            }, [evidence], "CATALOGUE_CLASSIFICATION", "HIGH", "Individual scatter observations are source artwork/data-display evidence; only the line/axis/point semantics needed by this G1 task are retained here." )
          : notApplicable(),
        table: notApplicable(),
        vector: notApplicable(),
        bearing: notApplicable(),
        solid3D: notApplicable(),
        mechanism: notApplicable(),
        contextImage: notApplicable(),
        responseSurface: notApplicable(),
      },
      sourceEvidence: [evidence],
      confidence: "HIGH" as const,
    }],
    visualCount: 1,
    relationships: [],
    containsEssentialVisualData: v.dependency === "REQUIRED_TO_SOLVE" || v.dependency === "PARTIALLY_REQUIRED",
    containsContextImage: false,
    containsProcedurallyReproducibleDiagram: true,
    containsResponseSurface: false,
  }, [evidence], "CATALOGUE_CLASSIFICATION", "HIGH", null);
};

const mathematicalSubgoals = (config: G1QuestionConfig) => {
  const q = `Q${config.questionNumber}`;
  if (config.candidateMustFindGradientExpressionOnly) {
    return [
      { id: `${q}_S1`, summary: "Substitute the two coordinate pairs into the two-point gradient quotient.", dependsOnSubgoalIds: [] },
      { id: `${q}_S2`, summary: "Recognise and factor the algebraic structure created in the gradient numerator.", dependsOnSubgoalIds: [`${q}_S1`] },
      { id: `${q}_S3`, summary: "Factor the denominator as needed, cancel a valid common factor, and state the gradient expression in simplest form.", dependsOnSubgoalIds: [`${q}_S2`] },
    ];
  }
  if (config.totalMarks === 4) {
    return [
      { id: `${q}_S1`, summary: config.mode === "BEST_FIT_READ_FROM_GRID" ? "Read/select two suitable points on the supplied line and calculate its gradient." : "Calculate the gradient from the two supplied line points.", dependsOnSubgoalIds: [] },
      { id: `${q}_S2`, summary: "Use the gradient and one point to determine the intercept and state the straight-line model in the required variables.", dependsOnSubgoalIds: [`${q}_S1`] },
      { id: `${q}_S3`, summary: "Use the constructed model with the new input to obtain the requested follow-on value or estimate.", dependsOnSubgoalIds: [`${q}_S2`] },
    ];
  }
  return [
    { id: `${q}_S1`, summary: "Calculate the gradient from the two supplied points.", dependsOnSubgoalIds: [] },
    { id: `${q}_S2`, summary: "Substitute the gradient and one point into a valid straight-line form to determine the line position/intercept.", dependsOnSubgoalIds: [`${q}_S1`] },
    { id: `${q}_S3`, summary: "State the resulting straight-line equation in simplest form.", dependsOnSubgoalIds: [`${q}_S2`] },
  ];
};

const operationTypes = (config: G1QuestionConfig): QuestionOperationType[] => {
  if (config.candidateMustFindGradientExpressionOnly) return ["SUBTRACT", "DIVIDE", "FACTORISE", "SIMPLIFY"];
  const operations: QuestionOperationType[] = ["SUBTRACT", "DIVIDE", "SUBSTITUTE", "REARRANGE", "MODEL"];
  if (config.totalMarks === 4) operations.push("EVALUATE");
  return operations;
};

const reasoningTypes = (config: G1QuestionConfig): QuestionReasoningType[] => {
  const types: QuestionReasoningType[] = ["DIRECT_PROCEDURE"];
  if (config.totalMarks === 4 || config.candidateMustFindGradientExpressionOnly) types.push("MULTI_STAGE");
  if (config.visual) types.push("VISUAL_INTERPRETATION", "REPRESENTATION_TRANSLATION");
  if (config.context.contextualised) types.push("CONTEXT_INTERPRETATION");
  if (config.candidateMustFindGradientExpressionOnly) types.push("STRUCTURE_RECOGNITION");
  return types;
};

export const createG1GradientQuestionCatalogEntry = (config: G1QuestionConfig): QuestionCatalogEntry => {
  const q = `Q${config.questionNumber}`;
  const evidence = sourceEvidence(config);
  const parts = buildParts(config);
  const embeddedS2 = config.embeddedS2Marks === 1;
  const visualEvidenceChecked = config.visual != null ? true : true;

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
      sourcePages: config.sourcePages,
      printedPageLabels: config.printedPageLabels,
      continuesAcrossPages: config.sourcePages.length > 1,
      answerSpace: {
        category: config.answerSpaceCategory,
        estimatedWritingLines: config.estimatedWritingLines,
        responseSurfaceVisualIds: [],
        separateFinalAnswerAreaPresent: false,
        measurementMethod: "PDF_NATIVE",
        sourceMeasurements: config.responseRegions.map(nativeMeasurement),
        notes: "Response-space boundaries are retained as source-page evidence only; later authored layouts must be independently composed.",
      },
      sourceEvidence: [evidence],
    },
    structure: {
      structureType: config.totalMarks === 4 ? "MULTIPART" : "SINGLE",
      totalMarks: config.totalMarks,
      parts,
      dependencyType: config.totalMarks === 4 ? "FOLLOW_ON" : "INDEPENDENT",
      sharedStimulus: config.totalMarks === 4,
      sharedVisuals: config.totalMarks === 4 && config.visual != null,
      sharedGivenData: config.totalMarks === 4,
      requiredResultProvided: false,
    },
    curriculum: {
      primaryTopic: "GEO",
      primarySkillId: G1_SKILL_ID,
      secondarySkillIds: embeddedS2 ? [S2_SKILL_ID] : [],
      primaryConceptId: G1_CONCEPT_ID,
      conceptIds: embeddedS2 ? [G1_CONCEPT_ID, S2_CONCEPT_ID] : [G1_CONCEPT_ID],
      paperSuitability: config.paper,
      standardProfile: config.standardProfile,
      thinkingProfile: config.thinkingProfile,
      crossSkillQuestion: embeddedS2,
      skillMarkDistribution: embeddedS2
        ? { [G1_SKILL_ID]: config.g1Marks, [S2_SKILL_ID]: config.embeddedS2Marks }
        : { [G1_SKILL_ID]: config.g1Marks },
      conceptMarkDistribution: embeddedS2
        ? { [G1_CONCEPT_ID]: config.g1Marks, [S2_CONCEPT_ID]: config.embeddedS2Marks }
        : { [G1_CONCEPT_ID]: config.g1Marks },
    },
    task: {
      commandTypes: config.totalMarks === 4
        ? ["FIND", embeddedS2 ? "ESTIMATE" : "CALCULATE"]
        : ["FIND"],
      responseTypes: config.totalMarks === 4
        ? ["EQUATION", "NUMBER"]
        : [config.candidateMustFindGradientExpressionOnly ? "EXPRESSION" : "EQUATION"],
      responseCount: config.totalMarks === 4 ? 2 : 1,
      explicitMethodCue: config.totalMarks === 4,
      methodRestricted: false,
      workingRequestedInPrompt: config.workingExplicitlyRequested,
      justificationRequested: false,
      contextualConclusionRequested: false,
      visualResponseRequired: false,
    },
    mathematics: {
      primaryGoal: config.candidateMustFindGradientExpressionOnly
        ? "Determine the gradient from two points when one coordinate pair is algebraic, then simplify the resulting expression."
        : config.mode.includes("BEST_FIT")
          ? "Use two points on a supplied best-fit line to construct a linear model, with a follow-on estimate where present."
          : config.context.contextualised
            ? "Use two geometrically presented points to construct and apply a contextual straight-line model."
            : "Determine the equation of the unique straight line through two geometrically supplied points.",
      subgoals: mathematicalSubgoals(config),
      operationTypes: operationTypes(config),
      requiredFormulaIds: config.candidateMustFindGradientExpressionOnly
        ? ["GRADIENT_TWO_POINTS"]
        : ["GRADIENT_TWO_POINTS", "STRAIGHT_LINE_EQUATION"],
      requiredTheoremIds: config.candidateMustFindGradientExpressionOnly ? ["DIFFERENCE_OF_TWO_SQUARES"] : [],
      stageCount: 3,
      intermediateQuantityTypes: config.candidateMustFindGradientExpressionOnly
        ? ["gradient quotient", "factorised numerator and denominator"]
        : config.totalMarks === 4
          ? ["gradient", "line intercept/model", "follow-on model value"]
          : ["gradient", "line intercept/model"],
      methodSelectionRequired: false,
      solutionCountExpected: config.totalMarks === 4 ? 2 : 1,
      validitySelectionRequired: false,
      representationTransitions: config.representationTransitions,
    },
    information: buildInformation(config),
    reasoning: {
      reasoningTypes: reasoningTypes(config),
      difficulty: {
        overallDifficulty: config.difficulty.overall,
        methodSelectionLoad: config.difficulty.methodSelection,
        arithmeticLoad: config.difficulty.arithmetic,
        algebraicLoad: config.difficulty.algebraic,
        representationLoad: config.difficulty.representation,
        languageLoad: config.difficulty.language,
        contextInterpretationLoad: config.difficulty.contextInterpretation,
        reasoningDepth: config.difficulty.reasoningDepth,
        dependencyCount: 2,
        difficultyDrivers: config.difficulty.difficultyDrivers,
      },
    },
    numbers: {
      numberTypes: config.numberTypes,
      nonCalculatorFriendly: config.paper === "P1" || config.candidateMustFindGradientExpressionOnly,
      exactAndApproximateMixed: embeddedS2,
      simplificationVisibility: config.simplestFormExplicit ? "EXPLICIT_INSTRUCTION" : "NOT_EXPLICITLY_STATED",
      expectedFinalValueForm: "ALGEBRAIC_EXPRESSION",
      intermediateValueSize: config.mode === "CONTEXT_LINE_GRAPH" || config.mode === "BEST_FIT_READ_FROM_GRID" ? "MEDIUM" : "SMALL",
      finalValueSize: "SMALL",
      dominantInputFormat: config.candidateMustFindGradientExpressionOnly ? "ALGEBRAIC" : config.numberTypes.includes("DECIMAL") ? "DECIMAL" : "INTEGER",
      dominantOutputFormat: "ALGEBRAIC",
      magnitudeNotes: config.mode === "CONTEXT_LINE_GRAPH" || config.mode === "BEST_FIT_READ_FROM_GRID"
        ? "Some contextual coordinates are numerically large, but ratios are deliberately manageable and the mathematical demand remains gradient/model construction rather than large-number arithmetic."
        : null,
    },
    calculator: {
      status: config.paper === "P1" ? "NON_CALCULATOR" : "CALCULATOR_ALLOWED",
      burden: config.paper === "P1" ? "WRITTEN_NON_CALCULATOR" : "CALCULATOR_OPTIONAL",
      requiredFunctions: [],
      modeSensitive: false,
      modeRequirements: [],
      notes: config.paper === "P2"
        ? "A calculator is available on the source paper, but the assessed gradient/algebra structure is exact and calculator-independent."
        : "The source instance is designed for exact written coordinate-gradient work without calculator dependence.",
    },
    constraints: {
      mathematicalDomainConstraints: [
        "The two x-coordinates defining the gradient must be distinct so the line is not vertical.",
        ...(config.candidateMustFindGradientExpressionOnly ? ["Parameter values that make the two symbolic x-coordinates equal are outside the valid gradient domain."] : []),
        ...(config.mode === "BEST_FIT_READ_FROM_GRID" ? ["At least two exact, unambiguous grid-readable points must lie on the supplied best-fit line."] : []),
      ],
      contextValidityConstraints: config.context.contextualised
        ? ["Authored contextual values must preserve the stated direction and plausible interpretation of the linear relationship."]
        : [],
      calculatorModeConstraints: [],
      methodConstraints: [],
      presentationConstraints: config.simplestFormExplicit ? ["The requested equation/expression is explicitly required in simplest form."] : [],
    },
    answerSpecification: {
      answerForm: config.totalMarks === 4 ? "MIXED" : "SYMBOLIC",
      simplestFormRequired: config.simplestFormExplicit,
      rationalDenominatorRequired: false,
      positivePowersRequired: false,
      scientificNotationRequired: false,
      precisionType: "NONE",
      precisionValue: null,
      units: { dimension: null, unitSymbol: null, conversionRequired: false, unitsExplicitlyRequested: false },
      multipleAnswersRequired: config.totalMarks === 4 ? 2 : 1,
      domainRestriction: config.candidateMustFindGradientExpressionOnly ? "The two x-coordinates must be unequal." : null,
      contextualWordsRequired: false,
      coordinateOrderRelevant: true,
      bracketsRelevant: config.candidateMustFindGradientExpressionOnly,
      visualAnswerRequired: false,
    },
    context: {
      contextualised: config.context.contextualised,
      contextDomain: config.context.domain,
      contextRole: config.context.role,
      namedPeoplePresent: config.context.contextualised && (config.year === 2019 || config.year === 2021),
      currencyPresent: config.axis.xUnit === "pounds" || config.axis.yUnit === "pounds",
      realWorldUnitsPresent: config.context.realWorldUnitsPresent,
      realismConstrainsAnswer: false,
      contextObjects: config.context.objects,
      contextCanBeSafelyReplaced: config.context.contextCanBeSafelyReplaced,
    },
    language: {
      informationDensity: config.language.informationDensity,
      scaffoldingLevel: config.language.scaffoldingLevel,
      bulletStructureUsed: false,
      naturalLanguageInterpretationRequired: config.context.contextualised,
      promptSummary: config.sourceRelationship,
      promptStructure: {
        sentenceCount: config.language.sentenceCount,
        promptWordCount: config.language.promptWordCount,
        introductionStyle: config.language.introductionStyle,
        relationshipStatementStyle: config.language.relationshipStatementStyle,
        commandStyle: config.language.commandStyle,
        temporalStructure: "NONE",
        informationOrder: config.language.informationOrder,
        normalisedPromptStructure: config.language.normalisedPromptStructure,
        usesPronounReference: config.language.usesPronounReference,
        lexicalFeatureTags: config.language.lexicalFeatureTags,
      },
      styleNotes: "Historical wording is intentionally not stored. The catalogue retains command sequence, information order, visual/text dependency and mathematical surface characteristics in normalised language.",
    },
    visuals: buildVisuals(config),
    mathematicalModel: config.candidateMustFindGradientExpressionOnly
      ? notApplicable("The source task asks only for a gradient expression; no line model is requested.")
      : catalogValue({
          modelFamily: config.mode.includes("BEST_FIT") ? "linear best-fit model" : config.context.contextualised ? "contextual straight-line model" : "straight-line equation",
          normalisedModel: `${config.axis.yVariable}=m${config.axis.xVariable}+c`,
          independentVariable: config.axis.xVariable,
          dependentVariable: config.axis.yVariable,
          physicalOrContextDomain: config.context.domain,
          modelProvidedToCandidate: false,
          candidateMustConstructModel: true,
          candidateMustInterpretModel: config.totalMarks === 4,
          solveForIndependentVariable: false,
          targetDependentValueProvided: false,
          modelParameters: { sourcePointCount: config.points.length, visualOrigin: config.mode, embeddedStatisticalFollowUp: embeddedS2 ? 1 : 0 },
        }, [evidence], "CATALOGUE_CLASSIFICATION", "HIGH", "The model is stored generically rather than as the historical final answer."),
    specialisedProfiles: {
      arithmetic: catalogValue({
        arithmeticComplexity: config.difficulty.arithmetic,
        commonDenominatorRequired: false,
        cancellationAvailable: config.candidateMustFindGradientExpressionOnly,
        simplificationRequired: config.simplestFormExplicit,
        simplificationVisibility: config.simplestFormExplicit ? "EXPLICIT_INSTRUCTION" as const : "NOT_EXPLICITLY_STATED" as const,
        cancellationStyle: config.candidateMustFindGradientExpressionOnly ? "FINAL_SIMPLIFICATION_ONLY" as const : "NONE" as const,
      }, [evidence], "CATALOGUE_CLASSIFICATION", "HIGH", null),
      percentage: notApplicable(),
      powersSurdsScientific: config.candidateMustFindGradientExpressionOnly
        ? catalogValue({ powersPresent: true, surdsPresent: false, scientificNotationPresent: false, rationalisationRequired: false, exactSimplificationRequired: true }, [evidence], "CATALOGUE_CLASSIFICATION", "HIGH", "A squared parameter occurs inside one coordinate and creates a difference-of-squares numerator after gradient substitution.")
        : notApplicable(),
      algebra: catalogValue({
        expansionRequired: false,
        factorisationRequired: config.candidateMustFindGradientExpressionOnly,
        completingSquareRequired: false,
        rationalExpressionPresent: config.candidateMustFindGradientExpressionOnly,
        changeOfSubjectRequired: false,
      }, [evidence], "CATALOGUE_CLASSIFICATION", "HIGH", "Algebra is subordinate to geometric origin for G1 ownership; this profile records the actual manipulation without reclassifying the Skill."),
      equationsInequalities: notApplicable(),
      functionsGraphs: config.visual
        ? catalogValue({ functionFamily: "LINEAR", functionNotationUsed: false, transformationParametersPresent: false, rootsRelevant: false, turningPointsRelevant: false, graphInterpretationRequired: true }, [sourceEvidence(config, "VISUAL", [config.visual.sourcePageNumber], [config.printedPageLabels[config.sourcePages.indexOf(config.visual.sourcePageNumber)] ?? `PDF page ${config.visual.sourcePageNumber}`])], "CATALOGUE_CLASSIFICATION", "HIGH", null)
        : notApplicable(),
      statistics: config.visual?.scatterPresent
        ? catalogValue({ rawDataProvided: true, summaryStatisticsProvided: false, sampleSize: null, statisticsRequired: ["line of best fit"], comparisonRequired: false, interpretationRequired: embeddedS2 }, [sourceEvidence(config, "VISUAL", [config.visual.sourcePageNumber], [config.printedPageLabels[config.sourcePages.indexOf(config.visual.sourcePageNumber)] ?? `PDF page ${config.visual.sourcePageNumber}`])], "CATALOGUE_CLASSIFICATION", "HIGH", embeddedS2 ? "The one-mark follow-on statistical estimate is recorded as embedded S2 ownership; this G1 pass does not create a standalone S2 generation design." : null)
        : notApplicable(),
      geometryMeasureCircleSimilarity: catalogValue({ geometryFamilies: ["coordinate geometry", "straight line"], dimensions: ["2D"], compoundShapeOrSolid: false, similarityUsed: false, circleGeometryUsed: false, pythagorasUsed: false, areaRequired: false, volumeRequired: false, surfaceAreaRequired: false }, [evidence], "CATALOGUE_CLASSIFICATION", "HIGH", null),
      trigonometry: notApplicable(),
      bearings: notApplicable(),
      coordinateGeometry: catalogValue({ coordinateDimension: "2D", midpointRequired: false, gradientRequired: true, distanceRequired: false, lineEquationRequired: config.candidateMustConstructLineEquation, perpendicularGradientRequired: false, coordinateVectorReasoningRequired: false }, [evidence], "CATALOGUE_CLASSIFICATION", "HIGH", "G1 ownership follows geometric/coordinate origin even when later algebra is required to state a line equation."),
      vectors: notApplicable(),
    },
    family: {
      familyId: config.familyId,
      subFamilyId: config.subFamilyId,
      familyConfidence: "HIGH",
      structuralSignature: config.structuralSignature,
      surfaceStyleIds: [config.surfaceStyleId],
      relatedFamilyIds: [
        "GEO_G1_LINE_EQUATION_FROM_TWO_POINTS",
        "GEO_G1_CONTEXTUAL_LINEAR_MODEL",
        "GEO_G1_BEST_FIT_LINEAR_MODEL",
        "GEO_G1_SYMBOLIC_GRADIENT_FROM_TWO_POINTS",
      ].filter((id) => id !== config.familyId),
    },
    surface: {
      abstractOrContextual: config.context.contextualised ? "CONTEXTUAL" : "ABSTRACT",
      proseAmount: config.language.informationDensity === "HIGH" ? "HIGH" : config.language.informationDensity === "MEDIUM" ? "MEDIUM" : "LOW",
      visualAmount: config.visual ? (config.visual.scatterPresent || config.visual.candidateMustReadValues ? "HIGH" : "MEDIUM") : "NONE",
      layoutComplexity: config.sourcePages.length > 1 || config.visual?.candidateMustReadValues ? "MEDIUM" : "LOW",
      informationOrderCanVarySafely: !config.visual?.candidateMustReadValues,
      visualPlacementCanVarySafely: config.visual == null ? true : !config.visual.candidateMustReadValues,
    },
    review: {
      status: "IN_PROGRESS",
      sourceFactsComplete: true,
      classificationComplete: true,
      counterpartCrossChecked: false,
      visualEvidenceCrossChecked: visualEvidenceChecked,
      unresolvedIssues: [
        "The paired Answer Catalogue entry has not yet been migrated/cross-checked in the G1 answer-evidence pass.",
        ...(embeddedS2 ? ["The one-mark statistical follow-up is recorded for cross-skill mark ownership only; standalone S2 generation design is intentionally deferred."] : []),
      ],
      validationNotes: [
        `High-fidelity G1 question-evidence pass completed for ${config.year} ${config.paper} Q${config.questionNumber}.`,
        `Canonical ownership: ${config.g1Marks} mark(s) G1${embeddedS2 ? ` + ${config.embeddedS2Marks} embedded S2 mark` : ""}.`,
        `Standard/thinking classification retained as ${config.standardProfile}/${config.thinkingProfile}.`,
        `Historical family: ${config.familyId} / ${config.subFamilyId}.`,
      ],
      reviewedAt: null,
    },
  });
};
