// ============================================================================
// NATIONAL 5 MATHS — GENERATED VISUAL CONTRACT
// ============================================================================
//
// 06_VisualAssets owns how new visuals are specified, rendered and validated.
// It consumes reviewed semantic evidence from CatalogVisualEvidenceTypes but it
// does not own historical source facts. Historical catalogue layers must not
// import this module.
// ============================================================================

import type {
  CatalogGenerationReadiness,
  CatalogProvenance,
  MediaAssetId,
  RendererFamilyId,
} from "../CatalogCoreTypes";
import type {
  VisualElementId,
  VisualOrientationProfile,
  VisualSemanticModel,
  VisualSpecialisedProfiles,
  VisualType,
} from "../CatalogVisualEvidenceTypes";

export type GeneratedVisualStrategy =
  | "PROCEDURAL_SVG"
  | "PROCEDURAL_GRAPH"
  | "PROCEDURAL_GRID"
  | "LICENSED_MEDIA_ASSET"
  | "CONTEXT_ASSET_PLUS_PROCEDURAL_SCHEMATIC"
  | "AUTHORED_PARAMETERISED_SVG_TEMPLATE"
  | "NO_GENERATED_VISUAL_REQUIRED";

export type GeneratedVisualSourceBasis = {
  /** Historical IDs are evidence anchors only; they are never drawable assets. */
  historicalVisualElementIds: VisualElementId[];
  semanticInvariants: string[];
  permittedVariationAxes: string[];
  prohibitedSourceFeatures: string[];
};

export type GeneratedVisualBlueprint = {
  id: string;
  visualType: VisualType;
  readiness: CatalogGenerationReadiness;
  strategy: GeneratedVisualStrategy;
  rendererFamilyId: RendererFamilyId | null;
  allowedMediaAssetIds: MediaAssetId[];
  requiredAssetTags: string[];
  semanticModel: VisualSemanticModel;
  specialisedProfiles: VisualSpecialisedProfiles;
  orientation: VisualOrientationProfile;
  sourceBasis: GeneratedVisualSourceBasis;
  requiredRendererCapabilities: string[];
  provenance: CatalogProvenance;
};

export type GeneratedVisualOriginalityPolicy = {
  sourceArtworkReuseAllowed: false;
  sourceVectorGeometryReuseAllowed: false;
  sourceLayoutCoordinateReuseAllowed: false;
  semanticRegenerationRequired: true;
};

export type GeneratedVisualValidationPolicy = {
  semanticTopologyCheckRequired: boolean;
  valueLabelConsistencyCheckRequired: boolean;
  orientationCheckRequired: boolean;
  clippingCheckRequired: boolean;
  labelCollisionCheckRequired: boolean;
  printReadabilityCheckRequired: boolean;
  responseSurfaceCheckRequired: boolean;
  scaleMisinterpretationCheckRequired: boolean;
};

export type GeneratedVisualRequest = {
  blueprint: GeneratedVisualBlueprint;
  originality: GeneratedVisualOriginalityPolicy;
  validation: GeneratedVisualValidationPolicy;
};
