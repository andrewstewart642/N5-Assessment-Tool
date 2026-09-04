import {
  n2CanonicalAnswerLatex,
  n2CanonicalAnswerPlain,
} from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/PromptGrammar";
import type { N2GeneratedQuestion } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";
import type { N2GeneratedAnswerProfile, N2GeneratedMarkingScheme, N2AnswerValidationIssue } from "./Types";
import { sameStrings, validationIssue as issue } from "./ValidationHelpers";

export const validateN2AnswerIdentity = (
  question: N2GeneratedQuestion,
  answer: N2GeneratedMarkingScheme,
  profile: N2GeneratedAnswerProfile,
): N2AnswerValidationIssue[] => {
  const issues: N2AnswerValidationIssue[] = [];
  if (answer.questionInstanceId !== question.instanceId) issues.push(issue("INSTANCE_MISMATCH", "Answer instance ID does not match the generated question."));
  if (answer.family !== question.family || answer.mechanism !== question.mechanism) issues.push(issue("MECHANISM_MISMATCH", "Answer family/mechanism does not match the generated question."));
  if (answer.totalMarks !== question.marks) issues.push(issue("MARK_TOTAL_MISMATCH", "Answer mark total does not match the generated question."));
  if (answer.standardProfile !== question.standardProfile || !sameStrings(answer.standardMarks, question.standardMarks)) issues.push(issue("STANDARD_MISMATCH", "Answer Standard profile or mark-level Standard sequence does not match the generated question."));
  if (answer.thinking !== "OPERATIONAL" || answer.thinking !== question.thinking) issues.push(issue("THINKING_MISMATCH", "N2 answer generation must remain Operational and match the generated question."));
  if (answer.profileId !== profile.id || answer.markProfile !== profile.markProfile) issues.push(issue("PROFILE_MISMATCH", "Resolved N2 answer profile does not match the generated marking scheme."));
  if (!sameStrings(answer.profileSourceAnchorIds, profile.sourceAnchorIds)) issues.push(issue("PROFILE_ANCHOR_MISMATCH", "Answer profile source anchors have drifted from the calibrated profile."));
  if (!sameStrings(answer.sourceBasis.questionCatalogIds, question.sourceBasis.questionCatalogIds)
      || !sameStrings(answer.sourceBasis.answerCatalogIds, question.sourceBasis.answerCatalogIds)
      || answer.sourceBasis.historicalReference.primaryQuestionCatalogId !== question.sourceBasis.historicalReference.primaryQuestionCatalogId) {
    issues.push(issue("SOURCE_BASIS_MISMATCH", "Question and answer source-basis evidence has drifted apart."));
  }
  if (profile.sourceAnchorIds.some((id) => !question.sourceBasis.answerCatalogIds.includes(id))) issues.push(issue("PROFILE_SOURCE_OUTSIDE_QUESTION", "The answer profile uses a source anchor outside the question mechanism's reviewed evidence set."));
  return issues;
};

export const validateN2FinalAnswer = (
  question: N2GeneratedQuestion,
  answer: N2GeneratedMarkingScheme,
): N2AnswerValidationIssue[] => {
  const issues: N2AnswerValidationIssue[] = [];
  if (answer.finalAnswers.length !== 1 || answer.finalAnswers[0].partLabel !== "") {
    issues.push(issue("FINAL_ANSWER_COUNT", "N2 generated marking must expose exactly one unlabelled final answer."));
    return issues;
  }
  const final = answer.finalAnswers[0];
  if (final.normalisedAnswer !== n2CanonicalAnswerPlain(question.mathState)
      || final.latex !== n2CanonicalAnswerLatex(question.mathState)) {
    issues.push(issue("FINAL_ANSWER_DRIFT", "Generated final answer does not match the canonical question-state answer."));
  }
  if (question.mathState.mechanism === "FRACTIONAL_NUMERIC_EVALUATION") {
    if (final.numericValue !== question.mathState.exactResult || !answer.presentationPolicy.exactIntegerRequired) issues.push(issue("FRACTIONAL_EXACT_VALUE", "Fractional-index evaluation must expose the exact generated integer result."));
  } else if (final.numericValue !== null) {
    issues.push(issue("NON_NUMERIC_FINAL_VALUE", "Symbolic N2 mechanisms should not expose a standalone numeric final value."));
  }
  return issues;
};
