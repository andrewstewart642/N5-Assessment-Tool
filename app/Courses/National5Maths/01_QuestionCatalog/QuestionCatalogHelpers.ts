import type {
  CatalogConfidence,
  CatalogEvidenceRef,
  CatalogProvenance,
  CatalogReviewProfile,
  CatalogSourceIsolationProfile,
  CatalogValue,
} from "../CatalogCoreTypes";

export const qpEvidence = (
  questionNumber: string,
  pdfPage: number,
  evidenceType: "QUESTION" | "VISUAL" = "QUESTION",
  paper: "P1" | "P2" = "P1",
  printedPage: number = pdfPage,
): CatalogEvidenceRef => ({
  documentId: "N5_MATH_2014_QP",
  pdfPages: [pdfPage],
  printedPageLabels: [`Page ${printedPage}`],
  paper,
  questionLocator: `Q${questionNumber}`,
  evidenceType,
  locatorNote: null,
});

export const catalogValue = <T>(
  value: T,
  evidence: CatalogEvidenceRef[] = [],
  provenance: CatalogProvenance = "CATALOGUE_CLASSIFICATION",
  confidence: CatalogConfidence = "HIGH",
  notes: string | null = null,
): CatalogValue<T> => ({ state: "VALUE", value, confidence, provenance, evidence, notes });

export const notApplicable = <T>(notes: string | null = null): CatalogValue<T> => ({
  state: "NOT_APPLICABLE",
  value: null,
  confidence: "HIGH",
  provenance: "CATALOGUE_CLASSIFICATION",
  evidence: [],
  notes,
});

export const questionReviewInProgress = (
  visualChecked = true,
  paper: "P1" | "P2" = "P1",
): CatalogReviewProfile => ({
  status: "IN_PROGRESS",
  sourceFactsComplete: true,
  classificationComplete: true,
  generationAnalysisComplete: false,
  counterpartCrossChecked: false,
  visualEvidenceCrossChecked: visualChecked,
  unresolvedIssues: ["Matching Answer/Marking Scheme catalogue pass has not yet been completed."],
  validationNotes: [`Question-paper evidence and catalogue classification completed for the 2014 ${paper === "P1" ? "Paper 1" : "Paper 2"} pilot pass.`],
  reviewedAt: null,
});

export const sourceIsolation = (): CatalogSourceIsolationProfile & {
  generatorMayConsumeSourceLayoutCoordinates: false;
  generatorMayConsumeHistoricalPromptWording: false;
  generatorMayConsumeSemanticStructure: true;
} => ({
  historicalPromptWordingStored: false,
  historicalMarkingWordingStored: false,
  historicalPixelArtworkStored: false,
  historicalVectorGeometryStored: false,
  exactSourceCoordinatesReusable: false,
  semanticFactsMayBeUsedForGeneration: true,
  generatorMayConsumeSourceLayoutCoordinates: false,
  generatorMayConsumeHistoricalPromptWording: false,
  generatorMayConsumeSemanticStructure: true,
});

export const visualOriginality = () => ({
  historicalPromptWordingStored: false as const,
  historicalMarkingWordingStored: false as const,
  historicalPixelArtworkStored: false as const,
  historicalVectorGeometryStored: false as const,
  exactSourceCoordinatesReusable: false as const,
  semanticFactsMayBeUsedForGeneration: true as const,
  generationMustUseSemanticRegeneration: true as const,
  sourceArtworkReuseAllowed: false as const,
  sourceLayoutReproductionAllowed: false as const,
});

export const visualValidation = (orientation = false, scale = false) => ({
  semanticTopologyCheckRequired: true,
  valueLabelConsistencyCheckRequired: true,
  orientationCheckRequired: orientation,
  clippingCheckRequired: true,
  labelCollisionCheckRequired: true,
  printReadabilityCheckRequired: true,
  responseSurfaceCheckRequired: false,
  scaleMisinterpretationCheckRequired: scale,
});
