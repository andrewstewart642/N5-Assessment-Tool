import type { CatalogEvidenceRef } from "../CatalogCoreTypes";
import type { HistoricalVisualEvidenceProfile } from "./QuestionCatalogHistoricalView";
import { catalogValue, notApplicable } from "./QuestionCatalogHelpers";
import type { A8QuestionConfig } from "./A8SimultaneousEquationsCatalogTypes";
import { equationText } from "./A8SimultaneousEquationsCatalogSource";

export const buildGraphVisual = (
  config: A8QuestionConfig,
  visualEvidence: CatalogEvidenceRef,
): HistoricalVisualEvidenceProfile => {
  const [xSymbol, ySymbol] = config.variableSymbols;
  const [xValue, yValue] = config.solution;
  return {
    elements: [{
      id: `VIS_Q${config.questionNumber}_GRAPH`,
      sourceOrder: 1,
      visualType: "GRAPH",
      roles: ["STRUCTURAL_MODEL", "SUPPORTIVE"],
      dependency: "REDUNDANT_WITH_TEXT",
      candidateInteraction: "READ_ONLY",
      textRelationship: "FULLY_DUPLICATED",
      scale: {
        mode: "SCHEMATIC",
        measurementFromDrawingPermitted: false,
        proportionalAppearanceDesirable: true,
        exactGeometryRequiredForRenderer: true,
        notes: "The graph illustrates the two supplied equations and their intersection; the candidate is required to solve algebraically rather than read the point from scale.",
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
      labels: [
        { entityId: `Q${config.questionNumber}_X_AXIS`, role: "AXIS", normalisedValue: xSymbol, placementMathematicallyConstrained: true, collisionPriority: "HIGH" },
        { entityId: `Q${config.questionNumber}_Y_AXIS`, role: "AXIS", normalisedValue: ySymbol, placementMathematicallyConstrained: true, collisionPriority: "HIGH" },
        { entityId: `Q${config.questionNumber}_P`, role: "POINT_NAME", normalisedValue: "P", placementMathematicallyConstrained: true, collisionPriority: "HIGH" },
      ],
      semanticModel: {
        entities: [
          { id: `Q${config.questionNumber}_X_AXIS`, entityType: "AXIS", semanticName: "horizontal coordinate axis", printedLabel: xSymbol, numericValue: null, symbolicValue: xSymbol, unit: null, mathematicallyEssential: false, orientationMeaningful: true, candidateEditable: false, attributes: {} },
          { id: `Q${config.questionNumber}_Y_AXIS`, entityType: "AXIS", semanticName: "vertical coordinate axis", printedLabel: ySymbol, numericValue: null, symbolicValue: ySymbol, unit: null, mathematicallyEssential: false, orientationMeaningful: true, candidateEditable: false, attributes: {} },
          { id: `Q${config.questionNumber}_L1`, entityType: "LINE", semanticName: "line represented by the first simultaneous equation", printedLabel: null, numericValue: null, symbolicValue: equationText(config.equations[0], config.variableSymbols), unit: null, mathematicallyEssential: true, orientationMeaningful: true, candidateEditable: false, attributes: {} },
          { id: `Q${config.questionNumber}_L2`, entityType: "LINE", semanticName: "line represented by the second simultaneous equation", printedLabel: null, numericValue: null, symbolicValue: equationText(config.equations[1], config.variableSymbols), unit: null, mathematicallyEssential: true, orientationMeaningful: true, candidateEditable: false, attributes: {} },
          { id: `Q${config.questionNumber}_P`, entityType: "POINT", semanticName: "intersection point of the two lines", printedLabel: "P", numericValue: null, symbolicValue: `(${xValue},${yValue})`, unit: null, mathematicallyEssential: true, orientationMeaningful: false, candidateEditable: false, attributes: { x: xValue, y: yValue } },
        ],
        relations: [{
          id: `Q${config.questionNumber}_R_INTERSECTION`,
          relationType: "INTERSECTS",
          fromEntityIds: [`Q${config.questionNumber}_L1`],
          toEntityIds: [`Q${config.questionNumber}_L2`, `Q${config.questionNumber}_P`],
          normalisedMeaning: "The two supplied straight lines intersect at the labelled point P.",
          essentialToSolution: false,
          sourceEvidence: [visualEvidence],
        }],
        facts: [{
          id: `Q${config.questionNumber}_F_GRAPH`,
          factType: "LINE_INTERSECTION",
          normalisedFact: "The labelled point is the common solution of the two displayed linear equations.",
          relatedEntityIds: [`Q${config.questionNumber}_L1`, `Q${config.questionNumber}_L2`, `Q${config.questionNumber}_P`],
          explicitness: "EXPLICIT_TEXT",
          essentialToSolution: false,
          sourceEvidence: [visualEvidence],
        }],
      },
      layout: {
        sourcePageNumber: config.pdfPage,
        sourcePagePosition: "TOP",
        sourceRelativeWidth: "MEDIUM",
        preferredGeneratedAspectRatio: "4:3",
        minimumReadableWidthMm: null,
        minimumReadableHeightMm: null,
        allowInlinePlacement: false,
        allowFullWidthPlacement: true,
        labelCollisionSensitive: true,
      },
      specialisedProfiles: {
        geometry: notApplicable(),
        circle: notApplicable(),
        graph: catalogValue({
          graphFamily: "STRAIGHT_LINE",
          xAxis: { variable: xSymbol, label: xSymbol, unit: null, numericScaleShown: false, tickInterval: null, minimumShown: null, maximumShown: null },
          yAxis: { variable: ySymbol, label: ySymbol, unit: null, numericScaleShown: false, tickInterval: null, minimumShown: null, maximumShown: null },
          originShown: true,
          gridShown: false,
          rootsRelevant: false,
          turningPointsRelevant: false,
          asymptotesRelevant: false,
          symmetryRelevant: false,
          labelledPointIds: [`Q${config.questionNumber}_P`],
          referenceLinesPresent: false,
          candidateMustReadValues: false,
          candidateMustProduceGraph: false,
          accuracyExpectation: "SCHEMATIC",
        }, [visualEvidence], "CATALOGUE_CLASSIFICATION", "HIGH", null),
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
      confidence: "HIGH",
    }],
    visualCount: 1,
    relationships: [],
    containsEssentialVisualData: false,
    containsContextImage: false,
    containsProcedurallyReproducibleDiagram: true,
    containsResponseSurface: false,
  };
};
