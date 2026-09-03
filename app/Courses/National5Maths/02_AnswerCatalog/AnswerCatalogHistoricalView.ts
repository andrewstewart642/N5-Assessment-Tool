import type { CatalogReviewProfile } from "../CatalogCoreTypes";
import type {
  AnswerCatalogEntry,
  ConsistencyFeatureObservation,
} from "./AnswerCatalogTypes";

export type HistoricalAnswerReviewProfile = Omit<
  CatalogReviewProfile,
  "generationAnalysisComplete"
>;

/**
 * Canonical read-model for historical marking evidence.
 *
 * Cross-corpus consistency judgements and answer-generation profiles are
 * intentionally absent. The per-entry factual fingerprint is retained because
 * it is a normalised observation of the historical source, not synthesis.
 */
export type HistoricalAnswerCatalogView = Pick<
  AnswerCatalogEntry,
  | "identity"
  | "sourceContext"
  | "expectedResponse"
  | "sourceDirectives"
  | "markNodes"
  | "methodPathways"
  | "methodEquivalence"
  | "workingPolicy"
  | "presentationPolicy"
  | "visualMarking"
  | "commonResponses"
  | "generalPolicy"
  | "relationship"
  | "sourcePresentation"
> & {
  factualFingerprint: ConsistencyFeatureObservation[];
  review: HistoricalAnswerReviewProfile;
};

const historicalReview = (
  review: AnswerCatalogEntry["review"],
): HistoricalAnswerReviewProfile => {
  const {
    generationAnalysisComplete: _generationAnalysisComplete,
    ...historical
  } = review;
  return historical;
};

/**
 * Projects a transitional full AnswerCatalogEntry into the only shape that
 * SkillCatalog is allowed to consume as historical marking evidence.
 */
export const toHistoricalAnswerCatalogView = (
  entry: AnswerCatalogEntry,
): HistoricalAnswerCatalogView => ({
  identity: entry.identity,
  sourceContext: entry.sourceContext,
  expectedResponse: entry.expectedResponse,
  sourceDirectives: entry.sourceDirectives,
  markNodes: entry.markNodes,
  methodPathways: entry.methodPathways,
  methodEquivalence: entry.methodEquivalence,
  workingPolicy: entry.workingPolicy,
  presentationPolicy: entry.presentationPolicy,
  visualMarking: entry.visualMarking,
  commonResponses: entry.commonResponses,
  generalPolicy: entry.generalPolicy,
  relationship: entry.relationship,
  sourcePresentation: entry.sourcePresentation,
  factualFingerprint: entry.consistency.factualFingerprint,
  review: historicalReview(entry.review),
});
