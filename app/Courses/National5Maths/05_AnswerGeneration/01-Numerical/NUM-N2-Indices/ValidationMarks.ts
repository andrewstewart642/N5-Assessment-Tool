import type { N2GeneratedQuestion } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";
import type { N2GeneratedAnswerProfile, N2GeneratedMarkingScheme, N2AnswerValidationIssue } from "./Types";
import { N2_EXPECTED_MARK_ROLES, sameStrings, validationIssue as issue } from "./ValidationHelpers";

export const validateN2MarksAndMethods = (
  question: N2GeneratedQuestion,
  answer: N2GeneratedMarkingScheme,
  profile: N2GeneratedAnswerProfile,
): N2AnswerValidationIssue[] => {
  const issues: N2AnswerValidationIssue[] = [];
  const expectedNumbers = Array.from({ length: question.marks }, (_, index) => index + 1);
  const actualNumbers = answer.markPoints.map((mark) => mark.markNumber);
  if (!sameStrings(actualNumbers.map(String), expectedNumbers.map(String))) issues.push(issue("MARK_SEQUENCE", `Expected mark numbers ${expectedNumbers.join(", ")}, received ${actualNumbers.join(", ")}.`));
  if (!sameStrings(answer.markPoints.map((mark) => mark.role), N2_EXPECTED_MARK_ROLES[question.mechanism])) issues.push(issue("MARK_ROLE_SEQUENCE", `Mark roles do not match the calibrated ${question.mechanism} profile.`));

  for (const mark of answer.markPoints) {
    const expectedStandard = question.standardMarks[mark.markNumber - 1];
    if (mark.primarySkillId !== "num-n2-indices") issues.push(issue("MARK_SKILL", `Mark ${mark.markNumber} is not wholly owned by N2.`));
    if (mark.standard !== expectedStandard) issues.push(issue("MARK_STANDARD", `Mark ${mark.markNumber} does not match the question's mark-level Standard classification.`));
    if (mark.thinking !== "OPERATIONAL") issues.push(issue("MARK_THINKING", `Mark ${mark.markNumber} is not Operational.`));
    if (!sameStrings(mark.sourceAnchorIds, profile.sourceAnchorIds)) issues.push(issue("MARK_SOURCE_ANCHOR", `Mark ${mark.markNumber} source anchors do not match the resolved answer profile.`));
    for (const dependency of [...mark.dependsOnMarkNumbers, ...mark.followThroughFromMarkNumbers]) {
      if (!expectedNumbers.includes(dependency)) issues.push(issue("INVALID_MARK_DEPENDENCY", `Mark ${mark.markNumber} refers to unknown mark ${dependency}.`));
    }
  }

  const methodMarks = new Set(answer.methods.flatMap((method) => method.lines.flatMap((line) => line.markNumbers)));
  for (const markNumber of expectedNumbers) if (!methodMarks.has(markNumber)) issues.push(issue("METHOD_MARK_COVERAGE", `No generated method line demonstrates mark ${markNumber}.`));
  if (!answer.methods.some((method) => method.methodFamilyId === answer.defaultMethodFamilyId)) issues.push(issue("DEFAULT_METHOD_MISSING", "Default method family is not present in the generated methods."));
  for (const method of answer.methods) {
    if (!sameStrings(method.sourceEvidenceIds, profile.sourceAnchorIds)) issues.push(issue("METHOD_SOURCE_ANCHOR", `Method ${method.methodFamilyId} source anchors do not match the resolved answer profile.`));
    for (const line of method.lines) for (const markNumber of line.markNumbers) {
      if (!expectedNumbers.includes(markNumber)) issues.push(issue("METHOD_UNKNOWN_MARK", `Method line ${line.id} refers to unknown mark ${markNumber}.`));
    }
  }
  return issues;
};
