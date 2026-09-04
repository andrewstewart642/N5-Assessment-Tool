import type { N2GeneratedQuestion } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";
import { resolveN2GeneratedAnswerProfile } from "./Calibration";
import type { N2AnswerValidationResult, N2GeneratedMarkingScheme } from "./Types";
import { validateN2AnswerIdentity, validateN2FinalAnswer } from "./ValidationCore";
import { validateN2MarksAndMethods } from "./ValidationMarks";
import { validateN2AnswerPolicies } from "./ValidationPolicy";

export const validateN2GeneratedAnswer = (
  question: N2GeneratedQuestion,
  answer: N2GeneratedMarkingScheme,
): N2AnswerValidationResult => {
  const profile = resolveN2GeneratedAnswerProfile(question);
  const issues = [
    ...validateN2AnswerIdentity(question, answer, profile),
    ...validateN2MarksAndMethods(question, answer, profile),
    ...validateN2AnswerPolicies(question, answer, profile),
    ...validateN2FinalAnswer(question, answer),
  ];
  return {
    valid: !issues.some((entry) => entry.severity === "ERROR"),
    issues,
  };
};
