import type { QuestionResponseType } from "../01_QuestionCatalog/QuestionCatalogTypes";
import type { CrossCorpusConsistencyAnalysis, SourceMarkingDirective } from "./AnswerCatalogTypes";
import { answerReviewInProgress, comparisonKey, msEvidence } from "./AnswerCatalogHelpers";
import { A8_CORPUS_ENTRIES, A8_FAMILY_COMPARISONS } from "./A8_SimultaneousEquations/A8CrossCorpusAnalysis";
import { a8GeneralPolicyId, a8GeneralPolicyRuleIds } from "./A8_SimultaneousEquations/A8RelevantGeneralPolicies";
import { GENERAL_2024_RULE_IDS } from "./2024/N5_Maths_2024_GeneralMarkingPolicy";
import type { A8AnswerConfig } from "./A8SimultaneousEquationsAnswerTypes";


export const SKILL_ID = "alg-a08-simultaneous-equations";
export const CONCEPT_ID = "alg-a8-1";

export const detailedEvidence = (config: A8AnswerConfig) => config.msPages.map((page, index) =>
  msEvidence(
    config.question.identity.questionNumber,
    page,
    "MARKING_SCHEME",
    config.question.identity.paper,
    config.question.identity.year,
    config.printedPageLabels[index] ?? `PDF page ${page}`,
  ),
);

export const policyIdsFor = (year: number): { policyId: string; ruleIds: string[] } => {
  if (year === 2024) {
    return { policyId: "N5_MATH_2024_GENERAL_MARKING_POLICY", ruleIds: [...GENERAL_2024_RULE_IDS] };
  }
  const ids = a8GeneralPolicyRuleIds(year);
  const ruleIds = [ids.positiveMarking, ids.validMethods, ids.followThrough, ids.units, ids.badForm, ids.repeatedError];
  if (year !== 2015) ruleIds.splice(3, 0, ids.workingRequired);
  return { policyId: a8GeneralPolicyId(year), ruleIds };
};

export const crossCorpusFor = (
  config: A8AnswerConfig,
  responseTypes: QuestionResponseType[],
): CrossCorpusConsistencyAnalysis => {
  const family = A8_FAMILY_COMPARISONS.find((item) => item.family === config.surfaceFamily);
  if (!family) throw new Error(`Missing A8 family comparison for ${config.surfaceFamily}`);
  return {
    classification: family.classification,
    comparisonKey: comparisonKey(
      `A8_${config.surfaceFamily}_COMPARISON`,
      config.question.family.familyId,
      [SKILL_ID],
      config.question.structure.totalMarks,
      responseTypes,
      ["mark decomposition", "answer-only treatment", "excluded methods", "follow-through", "communication/presentation"],
    ),
    comparedEntryIds: family.entryIds,
    supportingEntryIds: family.entryIds,
    contradictingEntryIds: [],
    sampleSize: family.entryIds.length,
    observedPattern: family.observedPattern,
    distinguishingConditions: family.variableFeatures,
    unresolvedQuestions: family.classification === "INSUFFICIENT_EVIDENCE" ? ["Only one supplied historical source currently represents this surface family."] : [],
    analysisMayAlterSourceFacts: false,
    provenance: "GENERATION_ANALYSIS",
  };
};

export const sourceEntrySummary = (config: A8AnswerConfig) => A8_CORPUS_ENTRIES.find((entry) => entry.id === config.question.identity.answerCatalogId);

export const reviewAfterA8Comparison = (config: A8AnswerConfig) => {
  const base = answerReviewInProgress(config.question.identity.questionNumber, config.question.identity.paper, config.question.identity.year);
  return {
    ...base,
    unresolvedIssues: ["Historical source evidence is complete for this A8 entry; generator behaviour remains a separate derived layer and must not overwrite these facts."],
    validationNotes: [...base.validationNotes, "This entry was included in the dedicated A8 simultaneous-equations cross-corpus comparison used by the prototype generators."],
  };
};

export const sourceDirective = (
  id: string,
  summary: string,
  effect: SourceMarkingDirective["effect"],
  partIds: string[],
  markIds: string[],
  evidence: ReturnType<typeof detailedEvidence>,
  options: Partial<SourceMarkingDirective> = {},
): SourceMarkingDirective => ({
  id,
  layer: "QUESTION_NOTE",
  scope: "QUESTION",
  effect,
  normalisedSummary: summary,
  appliesToPartIds: partIds,
  appliesToMarkIds: markIds,
  appliesToMethodIds: [],
  marksAwarded: null,
  maximumMarks: null,
  sourceEvidence: evidence,
  ...options,

});
