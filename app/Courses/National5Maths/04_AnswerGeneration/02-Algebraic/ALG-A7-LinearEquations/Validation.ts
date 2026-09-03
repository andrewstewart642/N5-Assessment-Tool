import type { A7GeneratedQuestion } from "../../../04_QuestionGeneration/02-Algebraic/ALG-A7-LinearEquations/Types";
import type {
  A7AnswerValidationIssue,
  A7AnswerValidationResult,
  A7GeneratedMarkingScheme,
} from "./Types";

const issue = (
  code: string,
  message: string,
  severity: A7AnswerValidationIssue["severity"] = "ERROR",
): A7AnswerValidationIssue => ({ code, message, severity });

const sameStrings = (first: readonly string[], second: readonly string[]) =>
  first.length === second.length && first.every((value, index) => value === second[index]);

export const validateA7GeneratedAnswer = (
  question: A7GeneratedQuestion,
  answer: A7GeneratedMarkingScheme,
): A7AnswerValidationResult => {
  const issues: A7AnswerValidationIssue[] = [];

  if (answer.questionInstanceId !== question.instanceId) {
    issues.push(issue("INSTANCE_MISMATCH", "Answer instance ID does not match the generated question."));
  }
  if (answer.family !== question.family) {
    issues.push(issue("FAMILY_MISMATCH", "Answer family does not match the generated question family."));
  }
  if (answer.totalMarks !== question.marks) {
    issues.push(issue("MARK_TOTAL_MISMATCH", "Answer mark total does not match the generated question."));
  }
  if (answer.standard !== question.standard || answer.thinking !== question.thinking) {
    issues.push(issue("CLASSIFICATION_MISMATCH", "Answer Standard/Thinking profile does not match the generated question."));
  }
  if (answer.sourceBasis.historicalReference.primaryQuestionCatalogId !== question.sourceBasis.historicalReference.primaryQuestionCatalogId) {
    issues.push(issue("HISTORICAL_REFERENCE_MISMATCH", "Answer and question do not expose the same primary historical reference."));
  }
  if (!sameStrings(answer.sourceBasis.questionCatalogIds, question.sourceBasis.questionCatalogIds) ||
      !sameStrings(answer.sourceBasis.answerCatalogIds, question.sourceBasis.answerCatalogIds)) {
    issues.push(issue("SOURCE_BASIS_MISMATCH", "Answer and question source-basis catalogue IDs have drifted apart."));
  }

  const expectedMarks = Array.from({ length: question.marks }, (_, index) => index + 1);
  const actualMarks = answer.markPoints.map((mark) => mark.markNumber);
  if (!sameStrings(actualMarks.map(String), expectedMarks.map(String))) {
    issues.push(issue("MARK_SEQUENCE", `Expected mark numbers ${expectedMarks.join(", ")}, received ${actualMarks.join(", ")}.`));
  }

  for (const mark of answer.markPoints) {
    if (mark.primarySkillId !== "alg-a07-linear-equations") {
      issues.push(issue("MARK_SKILL", `Mark ${mark.markNumber} is not wholly owned by A7.`));
    }
    if (mark.standard !== "A" || mark.standard !== question.standard) {
      issues.push(issue("MARK_STANDARD", `Mark ${mark.markNumber} does not carry the question's A-standard classification.`));
    }
    if (mark.thinking !== question.thinking) {
      issues.push(issue("MARK_THINKING", `Mark ${mark.markNumber} does not carry the question's thinking classification.`));
    }
    if (!mark.sourceAnchorIds.length) {
      issues.push(issue("MARK_SOURCE_ANCHOR", `Mark ${mark.markNumber} has no calibration source anchor.`));
    }
    for (const dependency of [...mark.dependsOnMarkNumbers, ...mark.followThroughFromMarkNumbers]) {
      if (!expectedMarks.includes(dependency)) {
        issues.push(issue("INVALID_MARK_DEPENDENCY", `Mark ${mark.markNumber} refers to unknown mark ${dependency}.`));
      }
    }
  }

  const methodMarks = new Set(answer.methods.flatMap((method) => method.lines.flatMap((line) => line.markNumbers)));
  for (const markNumber of expectedMarks) {
    if (!methodMarks.has(markNumber)) {
      issues.push(issue("METHOD_MARK_COVERAGE", `No generated worked-method line demonstrates mark ${markNumber}.`));
    }
  }
  for (const method of answer.methods) {
    if (!method.sourceEvidenceIds.length) {
      issues.push(issue("METHOD_SOURCE_ANCHOR", `Method ${method.methodFamilyId} has no calibration source anchor.`));
    }
    for (const line of method.lines) {
      for (const markNumber of line.markNumbers) {
        if (!expectedMarks.includes(markNumber)) {
          issues.push(issue("METHOD_UNKNOWN_MARK", `Method line ${line.id} refers to unknown mark ${markNumber}.`));
        }
      }
    }
  }

  if (!answer.workingPolicy.algebraicWorkingRequired || answer.workingPolicy.unsupportedCorrectAnswerTreatment !== "NO_CREDIT") {
    issues.push(issue("WORKING_POLICY", "A7 generated marking must require algebraic working and must not award answer-only credit."));
  }
  if (!answer.workingPolicy.equivalentAlgebraicRoutesAccepted) {
    issues.push(issue("EQUIVALENT_METHODS", "Mathematically equivalent algebraic routes must remain acceptable."));
  }

  if (question.family === "FRACTIONAL_COEFFICIENT") {
    const solution = question.mathState.solution;
    const answerSolution = answer.intendedSolution;
    if (typeof answerSolution === "number" ||
        answerSolution.numerator !== solution.numerator ||
        answerSolution.denominator !== solution.denominator) {
      issues.push(issue("FRACTIONAL_SOLUTION_MISMATCH", "Answer exact rational solution does not match question generation state."));
    }
    if (solution.denominator === 1) {
      issues.push(issue("INTEGER_FRACTIONAL_SOLUTION", "The fractional A7 family must retain a non-integer exact solution."));
    }
    if (!answer.presentationPolicy.exactFractionRequired ||
        !answer.presentationPolicy.decimalApproximationDoesNotReplaceExactFraction ||
        !answer.presentationPolicy.simplestFormRequired) {
      issues.push(issue("EXACT_FRACTION_POLICY", "Fractional A7 generated marking must require the reduced exact fraction rather than a decimal approximation."));
    }
    if (answer.markProfile !== "EQUIVALENT_REARRANGE_EXACT" || answer.totalMarks !== 3) {
      issues.push(issue("FRACTIONAL_MARK_PROFILE", "Fractional A7 must use the three-mark equivalent/rearrange/exact profile."));
    }
    if (answer.markPoints.some((mark) => mark.partLabel !== "")) {
      issues.push(issue("FRACTIONAL_PART_LABEL", "Fractional A7 marks must belong to the single unlabelled question part."));
    }
    if (answer.finalAnswers.length !== 1 || answer.finalAnswers[0].exactRational === null) {
      issues.push(issue("FRACTIONAL_FINAL_ANSWER", "Fractional A7 must expose one exact rational final answer."));
    }
  } else {
    const state = question.mathState;
    if (typeof answer.intendedSolution !== "number" || answer.intendedSolution !== state.solution) {
      issues.push(issue("CONTEXT_SOLUTION_MISMATCH", "Context answer solution does not match question generation state."));
    }
    if (answer.markProfile !== "AREA_EQUATE_START_REARRANGE_SOLVE" || answer.totalMarks !== 5) {
      issues.push(issue("CONTEXT_MARK_PROFILE", "Equal-area A7 must use the reviewed five-mark area/equate/start/rearrange/solve profile."));
    }
    const expectedPartLabels = ["a", "b", "b", "b", "b"];
    if (answer.markPoints.some((mark, index) => mark.partLabel !== expectedPartLabels[index])) {
      issues.push(issue("CONTEXT_PART_MARKS", "Equal-area A7 must preserve the reviewed 1+4 part allocation."));
    }
    if (!answer.presentationPolicy.triangleHalfFactorMustSurviveFirstSolveStep ||
        !answer.presentationPolicy.trivialIntegerFinalDivisionBlocked) {
      issues.push(issue("CONTEXT_EASING_POLICY", "Equal-area marking must preserve both the one-half solving constraint and the non-trivial final-division constraint."));
    }
    if (!answer.workingPolicy.excludedPrototypeMethods.includes("GUESS_AND_CHECK")) {
      issues.push(issue("CONTEXT_GUESS_CHECK", "Equal-area generated marking must explicitly exclude guess-and-check."));
    }
    if (state.rearrangedEquation.xCoefficient < 10) {
      issues.push(issue("CONTEXT_FINAL_DIVISION_EASED", "Generated equal-area final x coefficient must remain two-digit."));
    }
    const dimensionsAtSolution = [
      state.triangle.fixedDimension,
      state.triangle.linearDimension.xCoefficient * state.solution + state.triangle.linearDimension.constant,
      state.rectangle.fixedDimension,
      state.rectangle.linearDimension.xCoefficient * state.solution + state.rectangle.linearDimension.constant,
    ];
    if (dimensionsAtSolution.some((value) => value <= 0)) {
      issues.push(issue("CONTEXT_INVALID_DIMENSION", "Generated equal-area answer state contains a non-positive physical dimension."));
    }
    if (answer.finalAnswers.length !== 2 || answer.finalAnswers[0].partLabel !== "a" || answer.finalAnswers[1].partLabel !== "b") {
      issues.push(issue("CONTEXT_FINAL_ANSWERS", "Equal-area generated marking must expose the part (a) area expression and part (b) x value."));
    }
  }

  return {
    valid: !issues.some((entry) => entry.severity === "ERROR"),
    issues,
  };
};
