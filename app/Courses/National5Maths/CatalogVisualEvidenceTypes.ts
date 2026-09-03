// ============================================================================
// NATIONAL 5 MATHS — SHARED HISTORICAL VISUAL-EVIDENCE CONTRACT
// ============================================================================
//
// This file is shared catalogue infrastructure, not a visual renderer. It owns
// the semantic/source-evidence vocabulary used by historical Question and Answer
// catalogue records. 06_VisualAssets may consume these semantics when building
// original generated visuals, but 01_QuestionCatalog and 02_AnswerCatalog must
// never depend on 06_VisualAssets to describe historical evidence.
//
// TRANSITION NOTE
// The 2014 pilot stored a few generator-facing fields inside its visual records.
// Those legacy fields remain typed here temporarily so the historical bank can
// migrate without a destructive rewrite. New generation/rendering contracts
// belong in 06_VisualAssets/VisualGenerationTypes.ts.
// ============================================================================

import type {
  CatalogConfidence,
  CatalogEvidenceRef,
  CatalogGenerationReadiness,
  CatalogProvenance,
  CatalogSourceIsolationProfile,
  CatalogValue,
  MediaAssetId,
  RendererFamilyId,
} from "./CatalogCoreTypes";

export type VisualElementId = string;
export type VisualEntityId = string;
export type VisualRelationId = string;
export type VisualFactId = string;
export type VisualSetRelationshipId = string;

export type VisualType =
  | "MATHEMATICAL_DIAGRAM" | "GEOMETRIC_DIAGRAM" | "CIRCLE_DIAGRAM" | "COORDINATE_DIAGRAM"
  | "GRAPH" | "SCATTERGRAPH" | "DATA_DISPLAY" | "TABLE" | "NUMBER_LINE" | "COORDINATE_GRID"
  | "RESPONSE_GRID" | "AXES" | "VECTOR_DIAGRAM" | "BEARING_DIAGRAM" | "SOLID_3D" | "COMPOSITE_SOLID"
  | "MECHANISM" | "CONTEXT_SCHEMATIC" | "CONTEXT_IMAGE" | "ICON_OR_SYMBOL" | "RESPONSE_SURFACE" | "HYBRID";

export type VisualRole =
  | "ESSENTIAL_DATA" | "STRUCTURAL_MODEL" | "CONTEXT_MODEL" | "ORIENTATION_REFERENCE" | "SUPPORTIVE"
  | "CONTEXTUAL" | "DECORATIVE" | "RESPONSE_SURFACE" | "CANDIDATE_OUTPUT_TARGET";

export type VisualDependency =
  | "REQUIRED_TO_SOLVE" | "REQUIRED_TO_INTERPRET_CONTEXT" | "PARTIALLY_REQUIRED" | "REDUNDANT_WITH_TEXT"
  | "SUPPORTIVE_ONLY" | "NOT_REQUIRED";

export type VisualTextRelationship =
  | "VISUAL_ONLY" | "PARTLY_DUPLICATED" | "FULLY_DUPLICATED" | "CONTEXT_ONLY" | "TEXT_EXPLAINS_VISUAL" | "VISUAL_EXPLAINS_TEXT";

export type VisualCandidateInteraction =
  | "READ_ONLY" | "READ_VALUES" | "ANNOTATE" | "COMPLETE" | "DRAW" | "SKETCH" | "PLOT" | "EXTEND"
  | "SHADE" | "CONSTRUCT" | "SELECT" | "MIXED";

export type VisualScaleMode = "TO_SCALE" | "SCHEMATIC" | "NOT_TO_SCALE_EXPLICIT" | "NOT_TO_SCALE_IMPLICIT" | "SCALE_DRAWING_PROHIBITED" | "NOT_RELEVANT";
export type VisualScaleProfile = {
  mode: VisualScaleMode;
  measurementFromDrawingPermitted: boolean;
  proportionalAppearanceDesirable: boolean;
  exactGeometryRequiredForRenderer: boolean;
  notes: string | null;
};

export type VisualFactExplicitness = "EXPLICIT_LABEL" | "EXPLICIT_SYMBOL" | "EXPLICIT_TEXT" | "VISUALLY_IMPLIED" | "MATHEMATICALLY_DERIVED";
export type VisualSemanticFact = {
  id: VisualFactId;
  factType: string;
  normalisedFact: string;
  relatedEntityIds: VisualEntityId[];
  explicitness: VisualFactExplicitness;
  essentialToSolution: boolean;
  sourceEvidence: CatalogEvidenceRef[];
};

export type VisualEntityType =
  | "POINT" | "VERTEX" | "LINE" | "SEGMENT" | "RAY" | "VECTOR" | "ARROW" | "ARC" | "CIRCLE" | "ELLIPSE"
  | "POLYGON" | "TRIANGLE" | "QUADRILATERAL" | "RECTANGLE" | "SQUARE" | "REGION" | "CURVE" | "AXIS" | "GRID"
  | "TICK" | "ANGLE" | "RIGHT_ANGLE_MARKER" | "PARALLEL_MARKER" | "EQUAL_LENGTH_MARKER" | "TEXT_LABEL"
  | "MEASUREMENT_LABEL" | "SOLID" | "FACE" | "EDGE" | "PIVOT" | "MECHANICAL_ARM" | "PATH" | "CONTEXT_OBJECT" | "IMAGE" | "OTHER";

export type VisualEntity = {
  id: VisualEntityId;
  entityType: VisualEntityType;
  semanticName: string;
  printedLabel: string | null;
  numericValue: number | null;
  symbolicValue: string | null;
  unit: string | null;
  mathematicallyEssential: boolean;
  orientationMeaningful: boolean;
  candidateEditable: boolean;
  attributes: Record<string, string | number | boolean | null | undefined>;
};

export type VisualRelationType =
  | "CONNECTED_TO" | "INTERSECTS" | "PARALLEL_TO" | "PERPENDICULAR_TO" | "TANGENT_TO" | "COLLINEAR_WITH"
  | "EQUAL_LENGTH_TO" | "SIMILAR_TO" | "CONGRUENT_TO" | "MIDPOINT_OF" | "BISECTS" | "DIAMETER_OF" | "RADIUS_OF"
  | "CHORD_OF" | "ARC_OF" | "CENTRE_OF" | "INSIDE" | "OUTSIDE" | "OVERLAPS" | "SHARES_EDGE_WITH" | "ATTACHED_TO"
  | "ROTATES_ABOUT" | "MOVES_ALONG" | "STARTS_AT" | "ENDS_AT" | "DIRECTLY_ABOVE" | "DIRECTLY_BELOW" | "LEFT_OF"
  | "RIGHT_OF" | "NORTH_OF" | "SOUTH_OF" | "EAST_OF" | "WEST_OF" | "REPRESENTS" | "PROJECTS_TO" | "PART_OF" | "OTHER";

export type VisualRelation = {
  id: VisualRelationId;
  relationType: VisualRelationType;
  fromEntityIds: VisualEntityId[];
  toEntityIds: VisualEntityId[];
  normalisedMeaning: string;
  essentialToSolution: boolean;
  sourceEvidence: CatalogEvidenceRef[];
};

export type VisualSemanticModel = { entities: VisualEntity[]; relations: VisualRelation[]; facts: VisualSemanticFact[] };

export type VisualOrientationProfile = {
  verticalDirectionMeaningful: boolean;
  horizontalDirectionMeaningful: boolean;
  northReferenceMeaningful: boolean;
  groundReferenceMeaningful: boolean;
  startPositionMeaningful: boolean;
  rotationDirectionMeaningful: boolean;
  viewpointMeaningful: boolean;
  mirroringSafe: boolean;
  rotationSafe: boolean;
};

export type VisualLabelRole = "POINT_NAME" | "OBJECT_NAME" | "LENGTH" | "ANGLE" | "COORDINATE" | "VECTOR" | "VARIABLE" | "UNIT" | "DIRECTION" | "AXIS" | "VALUE" | "CONTEXT" | "OTHER";
export type VisualLabelProfile = {
  entityId: VisualEntityId | null;
  role: VisualLabelRole;
  normalisedValue: string;
  placementMathematicallyConstrained: boolean;
  collisionPriority: "LOW" | "MEDIUM" | "HIGH";
};

export type VisualLayoutProfile = {
  sourcePageNumber: number;
  sourcePagePosition: "TOP" | "MIDDLE" | "BOTTOM" | "FULL_PAGE";
  sourceRelativeWidth: "SMALL" | "MEDIUM" | "LARGE" | "FULL_WIDTH";
  preferredGeneratedAspectRatio: string | null;
  minimumReadableWidthMm: number | null;
  minimumReadableHeightMm: number | null;
  allowInlinePlacement: boolean;
  allowFullWidthPlacement: boolean;
  labelCollisionSensitive: boolean;
};

export type VisualGeometryProfile = {
  dimension: "2D";
  shapeFamilies: string[];
  labelledPointIds: VisualEntityId[];
  rightAnglesPresent: boolean;
  parallelRelationshipsPresent: boolean;
  equalLengthRelationshipsPresent: boolean;
  similarityPresent: boolean;
  congruencePresent: boolean;
  shadedRegionsPresent: boolean;
  auxiliaryLinesPresent: boolean;
  algebraicDimensionsPresent: boolean;
  compoundShapePresent: boolean;
};

export type VisualCircleProfile = {
  circleCount: number;
  centresExplicitlyShown: boolean;
  radiiPresent: boolean;
  diametersPresent: boolean;
  chordsPresent: boolean;
  tangentsPresent: boolean;
  secantsPresent: boolean;
  sectorsPresent: boolean;
  segmentsPresent: boolean;
  majorMinorArcDistinctionRelevant: boolean;
  intersectingCirclesPresent: boolean;
  commonChordPresent: boolean;
};

export type VisualGraphFamily = "STRAIGHT_LINE" | "PARABOLA" | "CUBIC" | "RECIPROCAL" | "EXPONENTIAL" | "SINE" | "COSINE" | "OTHER_FUNCTION" | "CONTEXTUAL_GRAPH";
export type VisualAxisProfile = { variable: string | null; label: string | null; unit: string | null; numericScaleShown: boolean; tickInterval: number | null; minimumShown: number | null; maximumShown: number | null };
export type VisualGraphProfile = {
  graphFamily: VisualGraphFamily;
  xAxis: VisualAxisProfile;
  yAxis: VisualAxisProfile;
  originShown: boolean;
  gridShown: boolean;
  rootsRelevant: boolean;
  turningPointsRelevant: boolean;
  asymptotesRelevant: boolean;
  symmetryRelevant: boolean;
  labelledPointIds: VisualEntityId[];
  referenceLinesPresent: boolean;
  candidateMustReadValues: boolean;
  candidateMustProduceGraph: boolean;
  accuracyExpectation: "SCHEMATIC" | "APPROXIMATE" | "ACCURATE";
};

export type VisualScatterProfile = {
  xVariable: string | null;
  yVariable: string | null;
  dataPointCount: number | null;
  lineOfBestFitPresent: boolean;
  candidateDrawsBestFitLine: boolean;
  correlationInterpretationRequired: boolean;
  interpolationRequired: boolean;
  extrapolationRequired: boolean;
  highlightedObservationIds: VisualEntityId[];
};

export type VisualTableProfile = { rowCount: number | null; columnCount: number | null; headingsPresent: boolean; unitsPresent: boolean; rowOrderMatters: boolean; columnOrderMatters: boolean; candidateReadsDataDirectly: boolean; candidateCompletesTable: boolean };
export type VisualVectorProfile = { coordinateGridPresent: boolean; originShown: boolean; vectorEntityIds: VisualEntityId[]; arrowDirectionEssential: boolean; noseToTailStructureRelevant: boolean; resultantRelevant: boolean; candidateDrawsVectors: boolean; endpointAccuracyRelevant: boolean };
export type VisualBearingProfile = { locationEntityIds: VisualEntityId[]; northReferenceEntityIds: VisualEntityId[]; bearingsClockwiseFromNorth: boolean; routeSegmentsPresent: boolean; distancesLabelled: boolean; dueDirectionRelationshipsPresent: boolean; scaleDrawingProhibited: boolean };
export type VisualSolid3DProfile = { solidFamilies: string[]; compositeSolid: boolean; visibleEdgeEntityIds: VisualEntityId[]; hiddenEdgeEntityIds: VisualEntityId[]; transparencyUsed: boolean; cutawayUsed: boolean; coordinateAxesPresent: boolean; perspectiveProjectionRequired: boolean; faceRelationshipsRelevant: boolean };
export type VisualMechanismProfile = { mechanismFamily: string; pivotEntityIds: VisualEntityId[]; movingEntityIds: VisualEntityId[]; armEntityIds: VisualEntityId[]; pathEntityIds: VisualEntityId[]; rotationPresent: boolean; rotationDirection: "CLOCKWISE" | "ANTICLOCKWISE" | "BOTH" | null; startPositionRequired: boolean; alternativePositionsShown: boolean; periodicMotionRepresented: boolean; verticalHeightInterpretationRelevant: boolean };

export type VisualContextImageReplaceability = "ORIGINAL_EQUIVALENT_REQUIRED" | "GENERIC_CONTEXT_ASSET_ACCEPTABLE" | "SCHEMATIC_REPLACEMENT_ACCEPTABLE" | "VISUAL_CAN_BE_OMITTED";
export type VisualContextImageProfile = { subjectTags: string[]; sceneTags: string[]; primaryObject: string | null; viewpointRequirement: string | null; recognisableFeaturesRequired: string[]; orientationRelevant: boolean; relativePositionRelevant: boolean; overlaysRequired: boolean; replaceability: VisualContextImageReplaceability; assetSearchTags: string[] };

export type VisualResponseSurfaceType = "GRID" | "AXES" | "COORDINATE_PLANE" | "DIAGRAM" | "TABLE" | "VECTOR_GRID" | "CONSTRUCTION_SPACE" | "OTHER";
export type VisualResponseSurfaceProfile = { surfaceType: VisualResponseSurfaceType; candidateAction: VisualCandidateInteraction; accuracyRequired: boolean; toleranceDescription: string | null; rulerExpected: boolean; compassExpected: boolean; arrowheadsRequired: boolean; annotationsRequired: boolean; candidateWorkMayEarnMarksDirectly: boolean };

export type VisualSetRelationshipType = "CONTEXT_TO_MATHEMATICAL_MODEL" | "OBJECT_TO_GEOMETRIC_DECOMPOSITION" | "OVERVIEW_TO_DETAIL" | "CONTEXT_TO_GRAPH" | "BEFORE_TO_AFTER" | "SEPARATE_COMPONENTS_TO_COMPOSITE" | "SAME_OBJECT_DIFFERENT_REPRESENTATION" | "SUPPLIED_DIAGRAM_TO_RESPONSE_SURFACE" | "SHARED_STIMULUS" | "OTHER";
export type VisualSetRelationship = { id: VisualSetRelationshipId; relationshipType: VisualSetRelationshipType; fromVisualIds: VisualElementId[]; toVisualIds: VisualElementId[]; semanticMeaning: string; essentialToQuestionInterpretation: boolean };

// ---------------------------------------------------------------------------
// LEGACY 2014 TRANSITION FIELDS
// ---------------------------------------------------------------------------
// These describe derived generator policy and are retained only so the pilot
// files remain readable while they are normalised. Canonical generation code
// should import its contract from 06_VisualAssets/VisualGenerationTypes.ts.
export type VisualGenerationStrategy = "PROCEDURAL_SVG" | "PROCEDURAL_GRAPH" | "PROCEDURAL_GRID" | "LICENSED_MEDIA_ASSET" | "CONTEXT_ASSET_PLUS_PROCEDURAL_SCHEMATIC" | "AUTHORED_PARAMETERISED_SVG_TEMPLATE" | "NO_GENERATED_VISUAL_REQUIRED";
export type VisualGenerationProfile = {
  readiness: CatalogGenerationReadiness;
  strategy: VisualGenerationStrategy;
  rendererFamilyId: RendererFamilyId | null;
  allowedMediaAssetIds: MediaAssetId[];
  requiredAssetTags: string[];
  semanticInvariants: string[];
  safeVariationAxes: string[];
  unsafeVariations: string[];
  permittedOrientationChanges: string[];
  permittedStyleChanges: string[];
  requiredRendererCapabilities: string[];
  requiredValidationChecks: string[];
  provenance: CatalogProvenance;
};

export type VisualOriginalityProfile = CatalogSourceIsolationProfile & { generationMustUseSemanticRegeneration: true; sourceArtworkReuseAllowed: false; sourceLayoutReproductionAllowed: false };
export type VisualValidationProfile = { semanticTopologyCheckRequired: boolean; valueLabelConsistencyCheckRequired: boolean; orientationCheckRequired: boolean; clippingCheckRequired: boolean; labelCollisionCheckRequired: boolean; printReadabilityCheckRequired: boolean; responseSurfaceCheckRequired: boolean; scaleMisinterpretationCheckRequired: boolean };

export type VisualSpecialisedProfiles = {
  geometry: CatalogValue<VisualGeometryProfile>;
  circle: CatalogValue<VisualCircleProfile>;
  graph: CatalogValue<VisualGraphProfile>;
  scatter: CatalogValue<VisualScatterProfile>;
  table: CatalogValue<VisualTableProfile>;
  vector: CatalogValue<VisualVectorProfile>;
  bearing: CatalogValue<VisualBearingProfile>;
  solid3D: CatalogValue<VisualSolid3DProfile>;
  mechanism: CatalogValue<VisualMechanismProfile>;
  contextImage: CatalogValue<VisualContextImageProfile>;
  responseSurface: CatalogValue<VisualResponseSurfaceProfile>;
};

export type VisualCatalogElement = {
  id: VisualElementId;
  sourceOrder: number;
  visualType: VisualType;
  roles: VisualRole[];
  dependency: VisualDependency;
  candidateInteraction: VisualCandidateInteraction;
  textRelationship: VisualTextRelationship;
  scale: VisualScaleProfile;
  orientation: VisualOrientationProfile;
  labels: VisualLabelProfile[];
  semanticModel: VisualSemanticModel;
  layout: VisualLayoutProfile;
  specialisedProfiles: VisualSpecialisedProfiles;
  /** @deprecated Derived generation policy belongs in 06_VisualAssets. */
  generation: VisualGenerationProfile;
  /** @deprecated Source-isolation generation policy belongs outside historical evidence. */
  originality: VisualOriginalityProfile;
  /** @deprecated Generated-visual validation policy belongs in 06_VisualAssets. */
  validation: VisualValidationProfile;
  sourceEvidence: CatalogEvidenceRef[];
  confidence: CatalogConfidence;
};

export type VisualEvidenceProfile = {
  elements: VisualCatalogElement[];
  visualCount: number;
  relationships: VisualSetRelationship[];
  containsEssentialVisualData: boolean;
  containsContextImage: boolean;
  containsProcedurallyReproducibleDiagram: boolean;
  containsResponseSurface: boolean;
  generationRequiresMultipleVisuals: boolean;
};

export const VISUAL_CATALOG_VALIDATION_INVARIANTS = [
  "Every semantic relation references existing VisualEntity IDs.",
  "Essential visual facts are represented semantically rather than only through source layout.",
  "Historical artwork and exact coordinates never become generated artwork or geometry.",
  "Scale and orientation are explicit whenever they can affect candidate interpretation.",
  "Candidate-produced visual work identifies the response surface and interaction type.",
  "Generated visuals preserve semantic invariants while allowing original composition.",
] as const;
