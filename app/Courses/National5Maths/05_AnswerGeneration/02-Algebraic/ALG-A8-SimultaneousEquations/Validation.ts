import type { A8GeneratedQuestion } from "../../../03_QuestionGeneration/02-Algebraic/ALG-A8-SimultaneousEquations/Types";
import { resolveA8GeneratedAnswerProfile } from "./Calibration";
import type {
  A8AnswerValidationResult,
  A8GeneratedMarkRole,
  A8GeneratedMarkingScheme,
} from "./Types";

const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;

const expectedRoles = (question: A8GeneratedQuestion, answer: A8GeneratedMarkingScheme): A8GeneratedMarkRole[] => {
  if (!question.context) {
    return answer.markProfile === "SCALE_STRATEGY_CORRECT"
      ? ["SCALE", "STRATEGY", "CORRECT_PAIR"]
      : ["SCALE", "FIRST_VALUE", "SECOND_VALUE"];
  }

  if (answer.markProfile === "FORM_FORM_SCALE_STRATEGY_CORRECT_COMMUNICATE") {
    return ["FORM_EQUATION_1", "FORM_EQUATION_2", "SCALE", "STRATEGY", "CORRECT_PAIR", "COMMUNICATE"];
  }

  return [
    "FORM_EQUATION_1",
    "FORM_EQUATION_2",
    "SCALE",
    "FIRST_VALUE",
    "SECOND_VALUE",
    question.family === "CONTEXT_DERIVED_TOTAL" ? "DERIVED_TOTAL" : "COMMUNICATE",
  ];
};

export const validateA8GeneratedAnswer = (
  question: A8GeneratedQuestion,
  answer: A8GeneratedMarkingScheme,
): A8AnswerValidationResult => {
  const issues: A8AnswerValidationResult["issues"] = [];
  const expectedProfile = resolveA8GeneratedAnswerProfile(question);

  if (answer.questionInstanceId !== question.instanceId) {
    issues.push({ severity: "ERROR", code: "QUESTION_ID_MISMATCH", message: "Answer generation is not attached to the question instance it was derived from." });
  }
  if (answer.family !== question.family) {
    issues.push({ severity: "ERROR", code: "FAMILY_MISMATCH", message: "Generated answer family differs from the generated question family." });
  }
  if (answer.profileId !== expectedProfile.id || answer.markProfile !== expectedProfile.markProfile) {
    issues.push({ severity: "ERROR", code: "PROFILE_MISMATCH", message: `Expected answer profile ${expectedProfile.id}/${expectedProfile.markProfile}.` });
  }
  if (answer.totalMarks !== question.marks) {
    issues.push({ severity: "ERROR", code: "MARK_TOTAL_MISMATCH", message: "Generated answer mark total differs from the generated question." });
  }
  if (answer.markPoints.length !== question.marks) {
    issues.push({ severity: "ERROR", code: "MARK_POINT_COUNT", message: "A8 generation expects one one-mark MarkPoint for every available mark." });
  }

  const sourceBasis = new Set(question.sourceBasis.answerCatalogIds);
  if (!answer.profileSourceAnchorIds.length) {
    issues.push({ severity: "ERROR", code: "PROFILE_SOURCE_MISSING", message: "Generated answer profile has no historical Answer Catalogue anchors." });
  }
  for (const sourceId of answer.profileSourceAnchorIds) {
    if (!sourceBasis.has(sourceId)) {
      issues.push({ severity: "ERROR", code: "PROFILE_SOURCE_OUTSIDE_FAMILY", message: `${sourceId} is not part of the question family's Answer Catalogue source basis.` });
    }
  }

  const markNumbers = answer.markPoints.map((mark) => mark.markNumber);
  const expectedNumbers = Array.from({ length: question.marks }, (_, index) => index + 1);
  if (markNumbers.length !== expectedNumbers.length || markNumbers.some((value, index) => value !== expectedNumbers[index])) {
    issues.push({ severity: "ERROR", code: "MARK_NUMBER_SEQUENCE", message: "Generated MarkPoints must form a complete 1-based sequence." });
  }

  const roles = answer.markPoints.map((mark) => mark.role);
  const requiredRoles = expectedRoles(question, answer);
  if (roles.length !== requiredRoles.length || roles.some((role, index) => role !== requiredRoles[index])) {
    issues.push({ severity: "ERROR", code: "MARK_PROFILE_STRUCTURE", message: `Mark roles do not match ${answer.markProfile}.` });
  }
  for (const mark of answer.markPoints) {
    if (!mark.sourceAnchorIds.length) {
      issues.push({ severity: "ERROR", code: "MARK_SOURCE_MISSING", message: `Mark ${mark.markNumber} has no profile source anchors.` });
    }
  }

  if (answer.methods.length !== 2) {
    issues.push({ severity: "ERROR", code: "METHOD_COVERAGE", message: "A8 answer generation must expose both coefficient-elimination directions." });
  }
  const methodIds = new Set(answer.methods.map((method) => method.methodFamilyId));
  if (!methodIds.has("ELIMINATE_FIRST_VARIABLE") || !methodIds.has("ELIMINATE_SECOND_VARIABLE")) {
    issues.push({ severity: "ERROR", code: "METHOD_DIRECTION_COVERAGE", message: "Both elimination directions must be available." });
  }
  for (const method of answer.methods) {
    if (!close(method.solvedValues[0], question.solution[0]) || !close(method.solvedValues[1], question.solution[1])) {
      issues.push({ severity: "ERROR", code: "METHOD_SOLUTION_MISMATCH", message: `${method.methodFamilyId} does not finish at the generated question solution.` });
    }
    const coveredMarks = new Set(method.lines.flatMap((line) => line.markNumbers));
    for (const mark of expectedNumbers) {
      if (!coveredMarks.has(mark)) {
        issues.push({ severity: "ERROR", code: "METHOD_MARK_MAPPING", message: `${method.methodFamilyId} has no displayed line mapped to mark ${mark}.` });
      }
    }
  }

  const contextual = question.family === "CONTEXT_FORM_AND_SOLVE" || question.family === "CONTEXT_DERIVED_TOTAL";
  if (contextual && !question.context) {
    issues.push({ severity: "ERROR", code: "CONTEXT_MISSING", message: "Contextual answer generation requires the shared generated context state." });
  }
  if (!contextual && question.context) {
    issues.push({ severity: "ERROR", code: "UNEXPECTED_CONTEXT", message: "Bare A8 answer generation should not carry a contextual state." });
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
    if (!answer.presentationPolicy.derivedTargetRequired || answer.markPoints[5]?.role !== "DERIVED_TOTAL") {
      issues.push({ severity: "ERROR", code: "DERIVED_MARK_PROFILE", message: "Derived-total questions must reserve mark 6 for the further calculation." });
    }
  }

  if (question.family === "CONTEXT_FORM_AND_SOLVE" && question.context) {
    if (!answer.presentationPolicy.contextualLabelsRequiredForFinalMark || !answer.presentationPolicy.unitsRequiredForFinalMark) {
      issues.push({ severity: "ERROR", code: "COMMUNICATION_POLICY_MISSING", message: "Normal contextual A8 questions require the generated communication mark to enforce labels and units/presentation." });
    }
    const final = answer.finalAnswers.find((entry) => entry.partLabel === "c")?.normalisedAnswer ?? "";
    for (const label of question.context.itemLabels) {
      if (!final.includes(label)) {
        issues.push({ severity: "ERROR", code: "FINAL_CONTEXT_LABEL_MISSING", message: `Final contextual answer does not include ${label}.` });
      }
    }
    if (question.context.unitDimension === "currency") {
      for (const value of question.solution) {
        if (!final.includes(`£${value.toFixed(2)}`)) {
          issues.push({ severity: "ERROR", code: "CURRENCY_PRESENTATION", message: "P2 currency communication must show each generated value with a pound sign and two decimal figures." });
        }
      }
      if (!answer.presentationPolicy.currencyNearestPennyRequired) {
        issues.push({ severity: "ERROR", code: "CURRENCY_POLICY_MISSING", message: "Currency contexts must require nearest-penny presentation." });
      }
    } else if (!final.includes(question.context.unitSymbol)) {
      issues.push({ severity: "ERROR", code: "UNIT_PRESENTATION", message: "Contextual final answer does not show the generated unit." });
    }
  }

  if (question.family === "GRAPH_INTERSECTION_SOLVE") {
    const final = answer.finalAnswers[0]?.normalisedAnswer ?? "";
    if (!final.startsWith("P = (") || !answer.presentationPolicy.coordinatePairRequired) {
      issues.push({ severity: "ERROR", code: "GRAPH_COORDINATE_PRESENTATION", message: "Graph-intersection answer must expose the generated point P as a coordinate pair." });
    }
  }

  if (!answer.workingPolicy.algebraicWorkingRequired || answer.workingPolicy.unsupportedCorrectAnswerTreatment !== "NO_CREDIT") {
    issues.push({ severity: "ERROR", code: "ALGEBRAIC_WORKING_POLICY", message: "The generated A8 marking policy requires algebraic working and does not award an unsupported answer-only response." });
  }
  if (expectedProfile.explicitlyExcludedMethod) {
    if (!answer.workingPolicy.excludedPrototypeMethods.includes(expectedProfile.explicitlyExcludedMethod)) {
      issues.push({ severity: "ERROR", code: "EXCLUDED_METHOD_POLICY", message: `Profile must carry the source-anchored ${expectedProfile.explicitlyExcludedMethod} exclusion.` });
    }
  }

  if (!answer.sourceBasis.answerCatalogIds.length || !answer.sourceBasis.questionCatalogIds.length) {
    issues.push({ severity: "ERROR", code: "SOURCE_BASIS_MISSING", message: "Generated A8 answers must retain the cross-corpus catalogue basis used to design the family." });
  }

  return { valid: !issues.some((issue) => issue.severity === "ERROR"), issues };
};
