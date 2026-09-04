import type { N2GeneratedQuestion } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";
import type { N2GeneratedAnswerProfile, N2GeneratedMarkingScheme, N2AnswerValidationIssue } from "./Types";
import { validationIssue as issue } from "./ValidationHelpers";

export const validateN2AnswerPolicies = (
  question: N2GeneratedQuestion,
  answer: N2GeneratedMarkingScheme,
  profile: N2GeneratedAnswerProfile,
): N2AnswerValidationIssue[] => {
  const issues: N2AnswerValidationIssue[] = [];
  if (answer.workingPolicy.correctAnswerWithoutWorking !== profile.correctAnswerWithoutWorking
      || answer.workingPolicy.workingRequired !== profile.workingRequired
      || answer.workingPolicy.equivalentRoutesAccepted !== profile.equivalentRoutesAccepted) {
    issues.push(issue("WORKING_POLICY", "Generated working policy does not match the resolved mechanism profile."));
  }
  if (profile.workingRequired && profile.correctAnswerWithoutWorking !== "NO_CREDIT") issues.push(issue("WORKING_POLICY_CONTRADICTION", "A working-required profile cannot award full credit to an unsupported final answer."));
  if (!profile.workingRequired && profile.correctAnswerWithoutWorking === "NO_CREDIT") issues.push(issue("ANSWER_ONLY_POLICY_CONTRADICTION", "A no-working-required profile cannot simultaneously reject every unsupported correct answer."));

  if (answer.presentationPolicy.positivePowerOutputRequired !== profile.positivePowerOutputRequired) issues.push(issue("POSITIVE_POWER_POLICY", "Positive-power output policy does not match the calibrated mechanism."));
  const positivePowerMechanism = question.mechanism === "POWER_OF_POWER_WITH_NEGATIVE_INDEX" || question.mechanism === "NEGATIVE_INDEX_QUOTIENT";
  if (answer.presentationPolicy.positivePowerOutputRequired !== positivePowerMechanism) issues.push(issue("POSITIVE_POWER_MECHANISM", "Positive-power output is attached to the wrong N2 mechanism."));

  if (question.mechanism === "POSITIVE_POWER_PRODUCT_QUOTIENT") {
    if (!answer.workingPolicy.workingRequired || answer.workingPolicy.correctAnswerWithoutWorking !== "NO_CREDIT") issues.push(issue("2025_WORKING_REGIME", "The positive three-law mechanism must preserve the source-confirmed working-required/no-answer-only regime."));
  } else if (answer.workingPolicy.correctAnswerWithoutWorking !== "FULL_CREDIT") {
    issues.push(issue("ANSWER_ONLY_REGIME", `${question.mechanism} should use the calibrated generated full-credit answer-only regime.`));
  }
  return issues;
};
