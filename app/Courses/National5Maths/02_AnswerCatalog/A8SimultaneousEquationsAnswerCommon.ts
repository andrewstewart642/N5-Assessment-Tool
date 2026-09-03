import type { SourceMarkingDirective } from "./AnswerCatalogTypes";
import { answerReviewInProgress, msEvidence } from "./AnswerCatalogHelpers";
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

/** Historical review metadata only; cross-corpus/generation status belongs downstream. */
export const historicalA8Review = (config: A8AnswerConfig) => {
  const base = answerReviewInProgress(
    config.question.identity.questionNumber,
    config.question.identity.paper,
    config.question.identity.year,
  );
  const {
    generationAnalysisComplete: _generationAnalysisComplete,
    ...historical
  } = base;
  return {
    ...historical,
    unresolvedIssues: [],
    validationNotes: [
      ...base.validationNotes,
      "A8 historical marking evidence is stored independently from SkillCatalog cross-corpus synthesis and answer-generation policy.",
    ],
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
