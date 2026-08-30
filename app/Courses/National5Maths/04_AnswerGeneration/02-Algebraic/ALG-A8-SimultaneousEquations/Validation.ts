import type { A8GeneratedQuestion } from "../../../03_QuestionGeneration/02-Algebraic/ALG-A8-SimultaneousEquations/Types";
import type { A8AnswerValidationResult, A8GeneratedMarkingScheme } from "./Types";

const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;

export const validateA8GeneratedAnswer = (
  question: A8GeneratedQuestion,
  answer: A8GeneratedMarkingScheme,
): A8AnswerValidationResult => {
  const issues: A8AnswerValidationResult["issues"] = [];

  if (answer.questionInstanceId !== question.instanceId) {
    issues.push({ severity: "ERROR", code: "QUESTION_ID_MISMATCH", message: "Answer generation is not attached to the question instance it was derived from." });
  }
  if (answer.totalMarks !== question.marks) {
    issues.push({ severity: "ERROR", code: "MARK_TOTAL_MISMATCH", message: "Generated answer mark total differs from the generated question." });
  }
  if (answer.markPoints.length !== question.marks) {
    issues.push({ severity: "ERROR", code: "MARK_POINT_COUNT", message: "The prototype expects one one-mark MarkPoint for every available mark." });
  }

  const markNumbers = answer.markPoints.map((mark) => mark.markNumber);
  const expected = Array.from({ length: question.marks }, (_, index) => index + 1);
  if (markNumbers.length !== expected.length || markNumbers.some((value, index) => value !== expected[index])) {
    issues.push({ severity: "ERROR", code: "MARK_NUMBER_SEQUENCE", message: "Generated MarkPoints must form a complete 1-based sequence." });
  }

  if (answer.methods.length < 2) {
    issues.push({ severity: "ERROR", code: "METHOD_COVERAGE", message: "A8 answer generation must expose both coefficient-elimination directions." });
  }
  for (const method of answer.methods) {
    if (!close(method.solvedValues[0], question.solution[0]) || !close(method.solvedValues[1], question.solution[1])) {
      issues.push({ severity: "ERROR", code: "METHOD_SOLUTION_MISMATCH", message: `${method.methodFamilyId} does not finish at the generated question solution.` });
    }
    const coveredMarks = new Set(method.lines.flatMap((line) => line.markNumbers));
    for (const mark of expected) {
      if (!coveredMarks.has(mark)) {
        issues.push({ severity: "ERROR", code: "METHOD_MARK_MAPPING", message: `${method.methodFamilyId} has no displayed line mapped to mark ${mark}.` });
      }
    }
  }

  const contextual = question.family === "CONTEXT_FORM_AND_SOLVE" || question.family === "CONTEXT_DERIVED_TOTAL";
  if (contextual && !question.context) {
    issues.push({ severity: "ERROR", code: "CONTEXT_MISSING", message: "Contextual answer generation requires the shared generated context state." });
  }
  if (question.family === "CONTEXT_DERIVED_TOTAL" && question.context) {
    if (question.context.derivedCounts === undefined || question.context.derivedTotal === undefined) {
      issues.push({ severity: "ERROR", code: "DERIVED_TARGET_MISSING", message: "Derived-total answer generation requires the generated third combination." });
    } else {
      const expectedTotal = question.context.derivedCounts[0] * question.solution[0] + question.context.derivedCounts[1] * question.solution[1];
      if (!close(expectedTotal, question.context.derivedTotal)) {
        issues.push({ severity: "ERROR", code: "DERIVED_TARGET_MISMATCH", message: "The generated answer target does not agree with the shared mathematical state." });
      }
    }
  }

  if (!answer.sourceBasis.answerCatalogIds.length || !answer.sourceBasis.questionCatalogIds.length) {
    issues.push({ severity: "ERROR", code: "SOURCE_BASIS_MISSING", message: "Generated A8 answers must retain the cross-corpus catalogue basis used to design the family." });
  }

  return { valid: !issues.some((issue) => issue.severity === "ERROR"), issues };
};
