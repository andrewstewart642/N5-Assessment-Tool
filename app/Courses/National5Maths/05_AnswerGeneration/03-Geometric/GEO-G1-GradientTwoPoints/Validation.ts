import type { G1GeneratedQuestion } from "../../../04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Types";
import { resolveG1GeneratedAnswerProfile } from "./Calibration";
import { g1AnswerRationalPlain, g1SymbolicFinalPlain } from "./Formatting";
import type {
  G1AnswerValidationIssue,
  G1AnswerValidationResult,
  G1GeneratedMarkingScheme,
} from "./Types";

const error = (issues: G1AnswerValidationIssue[], code: string, message: string) =>
  issues.push({ severity: "ERROR", code, message });
const warning = (issues: G1AnswerValidationIssue[], code: string, message: string) =>
  issues.push({ severity: "WARNING", code, message });

export const validateG1GeneratedAnswer = (
  question: G1GeneratedQuestion,
  answer: G1GeneratedMarkingScheme,
): G1AnswerValidationResult => {
  const issues: G1AnswerValidationIssue[] = [];
  const profile = resolveG1GeneratedAnswerProfile(question);

  if (answer.generatorId !== "G1_GRADIENT_TWO_POINTS_ANSWER_V1") {
    error(issues, "G1_ANSWER_GENERATOR_ID", "Unexpected G1 answer generator ID.");
  }
  if (answer.questionInstanceId !== question.instanceId) {
    error(issues, "G1_ANSWER_PAIRING", "G1 answer does not reference the supplied generated-question instance.");
  }
  if (answer.family !== question.family || answer.surfaceStyleId !== question.surfaceStyleId) {
    error(issues, "G1_ANSWER_IDENTITY", "G1 answer family/surface metadata does not match the question.");
  }
  if (answer.profileId !== profile.id || answer.markProfile !== profile.markProfile) {
    error(issues, "G1_ANSWER_PROFILE", "G1 answer profile metadata does not match the calibrated profile.");
  }
  if (answer.totalMarks !== question.marks || answer.markPoints.length !== question.marks) {
    error(issues, "G1_ANSWER_MARK_TOTAL", "Generated G1 answer mark count does not match the generated question tariff.");
  }
  if (answer.standard !== question.standard || answer.thinking !== question.thinking) {
    error(issues, "G1_ANSWER_CLASSIFICATION", "Generated G1 answer standard/thinking metadata has drifted from the question.");
  }

  const expectedNumbers = Array.from({ length: question.marks }, (_, index) => index + 1);
  const actualNumbers = answer.markPoints.map((mark) => mark.markNumber);
  if (expectedNumbers.some((value, index) => actualNumbers[index] !== value)) {
    error(issues, "G1_ANSWER_MARK_SEQUENCE", "Generated G1 mark points must be numbered consecutively from 1.");
  }
  for (const mark of answer.markPoints) {
    if (mark.primarySkillId !== "geo-g01-gradient-two-points") {
      error(issues, "G1_ANSWER_MARK_OWNER", "Every emitted answer mark must remain G1-owned; deferred S2 marks must not be generated here.");
    }
    if (mark.standard !== question.standard || mark.thinking !== question.thinking) {
      error(issues, "G1_ANSWER_MARK_CLASSIFICATION", `Mark ${mark.markNumber} does not match the question classification.`);
    }
    if (!mark.sourceAnchorIds.length) {
      error(issues, "G1_ANSWER_MARK_ANCHOR", `Mark ${mark.markNumber} has no answer-calibration source anchors.`);
    }
  }

  const methodFamilies = answer.methods.map((method) => method.methodFamilyId);
  if (!methodFamilies.includes(answer.defaultMethodFamilyId)) {
    error(issues, "G1_ANSWER_DEFAULT_METHOD", "Default G1 answer method is not present in the generated method set.");
  }
  const coveredMarks = new Set(answer.methods.flatMap((method) => method.lines.flatMap((line) => line.markNumbers)));
  for (let mark = 1; mark <= question.marks; mark += 1) {
    if (!coveredMarks.has(mark)) {
      error(issues, "G1_ANSWER_METHOD_COVERAGE", `No generated method line demonstrates mark ${mark}.`);
    }
  }

  if (!answer.workingPolicy.workingRequired || answer.workingPolicy.correctAnswerWithoutWorking !== "NO_CREDIT") {
    error(issues, "G1_ANSWER_WORKING_POLICY", "G1 generated answers must use the deliberate working-required generated regime.");
  }
  if (!answer.workingPolicy.coordinateSubtractionMustBeConsistent) {
    error(issues, "G1_ANSWER_COORDINATE_ORDER", "G1 generated marking must preserve consistent coordinate subtraction order.");
  }
  if (!answer.presentationPolicy.simplestFormRequired || !answer.presentationPolicy.exactGradientRequired) {
    error(issues, "G1_ANSWER_PRESENTATION", "G1 final equations/gradients must remain exact and simplified.");
  }

  if (question.family === "SYMBOLIC_GRADIENT_FROM_TWO_POINTS") {
    const final = answer.finalAnswers[0];
    if (
      answer.finalAnswers.length !== 1
      || !final
      || final.partLabel !== ""
      || final.latex !== question.mathState.finalGradientLatex
      || final.normalisedAnswer !== g1SymbolicFinalPlain(question.mathState)
    ) {
      error(issues, "G1_ANSWER_SYMBOLIC_FINAL", "Symbolic G1 final answer does not match the generated exact gradient state.");
    }
    if (answer.defaultMethodFamilyId !== "SYMBOLIC_FACTOR_CANCEL" || answer.methods.length !== 1) {
      error(issues, "G1_ANSWER_SYMBOLIC_METHOD", "Symbolic G1 answer must use the factor-and-cancel method family.");
    }
    if (answer.deferredComposite !== null) {
      error(issues, "G1_ANSWER_SYMBOLIC_DEFERRED", "Symbolic G1 answers must not carry deferred composite metadata.");
    }
  } else {
    const equation = answer.finalAnswers.find((entry) => entry.partLabel !== "b");
    if (!equation || equation.normalisedAnswer !== question.mathState.equationPlain || equation.latex !== question.mathState.equationLatex) {
      error(issues, "G1_ANSWER_EQUATION_FINAL", "Generated final equation does not match the exact question line state.");
    }
    if (!methodFamilies.includes("SLOPE_INTERCEPT") || !methodFamilies.includes("POINT_SLOPE")) {
      error(issues, "G1_ANSWER_LINE_METHODS", "Numeric G1 line answers must expose slope-intercept and point-slope routes.");
    }

    if (question.family === "CONTEXTUAL_LINEAR_MODEL") {
      const follow = answer.finalAnswers.find((entry) => entry.partLabel === "b");
      if (!follow || follow.normalisedAnswer !== g1AnswerRationalPlain(question.mathState.followUp.exactOutput)) {
        error(issues, "G1_ANSWER_CONTEXT_FOLLOW_UP", "Deterministic G1 follow-up answer does not match the generated model state.");
      }
      if (!methodFamilies.includes("MODEL_APPLICATION") || answer.markPoints[3]?.role !== "MODEL_APPLICATION") {
        error(issues, "G1_ANSWER_CONTEXT_MARK4", "Deterministic contextual G1 answers require an explicit fourth model-application mark.");
      }
      if (answer.deferredComposite !== null) {
        error(issues, "G1_ANSWER_CONTEXT_DEFERRED", "Deterministic contextual G1 follow-up is G1-owned and must not be deferred.");
      }
    } else if (question.family === "BEST_FIT_LINEAR_MODEL") {
      if (
        !answer.deferredComposite
        || answer.deferredComposite.embeddedSkillId !== "stat-s02-linear-model"
        || answer.deferredComposite.embeddedMarksDeferred !== 1
        || answer.deferredComposite.generatedG1Marks !== 3
      ) {
        error(issues, "G1_ANSWER_BEST_FIT_DEFERRED", "Best-fit G1 answer must preserve the explicit one-mark deferred statistical boundary.");
      }
      if (answer.finalAnswers.length !== 1 || answer.totalMarks !== 3 || !answer.presentationPolicy.deferredCrossSkillMarksExcluded) {
        error(issues, "G1_ANSWER_BEST_FIT_TARIFF", "Best-fit G1 answer must emit exactly three G1 marks and no statistical follow-up answer.");
      }
      warning(issues, "G1_ANSWER_BEST_FIT_WARNING", "The adjacent statistical follow-up remains deliberately deferred and is not part of this generated answer.");
    } else if (answer.deferredComposite !== null) {
      error(issues, "G1_ANSWER_LINE_DEFERRED", "Standalone line-equation answers must not carry deferred composite metadata.");
    }
  }

  if (answer.profileSourceAnchorIds.length === 0) {
    error(issues, "G1_ANSWER_PROFILE_ANCHORS", "Generated G1 answer profile has no historical answer anchors.");
  }
  if (answer.sourceBasis.answerCatalogIds.length === 0) {
    error(issues, "G1_ANSWER_SOURCE_BASIS", "Generated G1 answer has no answer-catalogue source basis.");
  }

  return {
    valid: !issues.some((issue) => issue.severity === "ERROR"),
    issues,
  };
};
