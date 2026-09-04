import { n2CanonicalAnswerPlain } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/PromptGrammar";
import type { N2GeneratedQuestion } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";
import type { N2GeneratedAnswerProfile, N2GeneratedMarkPoint } from "./Types";
import { powerPlain } from "./Formatting";
import { classifiedN2Mark as classifiedMark } from "./MarkPointHelpers";

export const buildMarkPointsGroupA = (
  question: N2GeneratedQuestion,
  profile: N2GeneratedAnswerProfile,
): N2GeneratedMarkPoint[] | null => {
  const state = question.mathState;

  switch (state.mechanism) {
    case "FRACTIONAL_NUMERIC_EVALUATION":
      return [
        classifiedMark(question, profile, 1, {
          type: "REPRESENTATION",
          role: "FRACTIONAL_INDEX_INTERPRETATION",
          requirement: "Interpret the fractional exponent as the corresponding root and integer power.",
          evidenceExamples: [
            `${state.base}^(${state.exponentNumerator}/${state.rootIndex}) = (${state.rootIndex}th-root(${state.base}))^${state.exponentNumerator}`,
            `${state.rootIndex}th-root(${state.base}) = ${state.rootValue}`,
          ],
          acceptanceNotes: ["The root may be taken before or after the integer power when the route remains exact and mathematically equivalent."],
          dependsOnMarkNumbers: [],
          followThroughFromMarkNumbers: [],
          comparableDifficultyRequired: false,
          blockingConditions: [],
        }),
        classifiedMark(question, profile, 2, {
          type: "ACCURACY",
          role: "EXACT_NUMERICAL_EVALUATION",
          requirement: "Complete the exact numerical evaluation.",
          evidenceExamples: [`${state.rootValue}^${state.exponentNumerator} = ${state.exactResult}`],
          acceptanceNotes: ["The final value must be exact; a rounded decimal is not an alternative target."],
          dependsOnMarkNumbers: [1],
          followThroughFromMarkNumbers: [1],
          comparableDifficultyRequired: true,
          blockingConditions: [],
        }),
      ];
    case "PRODUCT_QUOTIENT_WITH_COEFFICIENT":
      return [
        classifiedMark(question, profile, 1, {
          type: "PROCESS",
          role: "NUMERATOR_PRODUCT_LAW",
          requirement: "Combine the same-base powers in the numerator using the product law.",
          evidenceExamples: [`${state.coefficientNumerator}${powerPlain(state.variable, state.numeratorExponent)}`],
          acceptanceNotes: ["Equivalent ordering of the coefficient and exponent simplification is acceptable."],
          dependsOnMarkNumbers: [],
          followThroughFromMarkNumbers: [],
          comparableDifficultyRequired: false,
          blockingConditions: [],
        }),
        classifiedMark(question, profile, 2, {
          type: "PROCESS",
          role: "COEFFICIENT_SIMPLIFICATION",
          requirement: "Reduce the numerical coefficient in the algebraic fraction correctly.",
          evidenceExamples: [`${state.coefficientNumerator}/${state.coefficientDenominator} = ${state.coefficientResult}`],
          acceptanceNotes: ["This mark is independent of whether the quotient-law exponent step is performed before or after the coefficient reduction."],
          dependsOnMarkNumbers: [],
          followThroughFromMarkNumbers: [],
          comparableDifficultyRequired: false,
          blockingConditions: [],
        }),
        classifiedMark(question, profile, 3, {
          type: "ACCURACY",
          role: "QUOTIENT_LAW",
          requirement: "Apply the quotient law to obtain the fully simplified final power.",
          evidenceExamples: [`${state.coefficientResult}${powerPlain(state.variable, state.finalExponent)}`],
          acceptanceNotes: ["Equivalent same-base quotient working is acceptable."],
          dependsOnMarkNumbers: [1],
          followThroughFromMarkNumbers: [1, 2],
          comparableDifficultyRequired: true,
          blockingConditions: [],
        }),
      ];
    case "POWER_OF_POWER_WITH_NEGATIVE_INDEX":
      return [
        classifiedMark(question, profile, 1, {
          type: "PROCESS",
          role: "POWER_OF_POWER",
          requirement: "Apply the power-of-a-power law to the bracketed indexed factor.",
          evidenceExamples: [`(${powerPlain(state.variable, state.innerExponent)})^${state.outerExponent} = ${powerPlain(state.variable, state.poweredExponent)}`],
          acceptanceNotes: ["Equivalent reciprocal notation may be introduced at this stage."],
          dependsOnMarkNumbers: [],
          followThroughFromMarkNumbers: [],
          comparableDifficultyRequired: false,
          blockingConditions: [],
        }),
        classifiedMark(question, profile, 2, {
          type: "PROCESS",
          role: "SIGNED_EXPONENT_COMBINATION",
          requirement: "Combine the same-base signed exponents correctly.",
          evidenceExamples: [`${powerPlain(state.variable, state.poweredExponent)} × ${powerPlain(state.variable, state.secondExponent)} = ${powerPlain(state.variable, state.combinedExponent)}`],
          acceptanceNotes: ["A reciprocal-first route is acceptable when it produces the same signed-exponent result."],
          dependsOnMarkNumbers: [1],
          followThroughFromMarkNumbers: [1],
          comparableDifficultyRequired: true,
          blockingConditions: [],
        }),
        classifiedMark(question, profile, 3, {
          type: "REPRESENTATION",
          role: "POSITIVE_POWER_CONVERSION",
          requirement: "Rewrite the negative final power as a reciprocal containing a positive power.",
          evidenceExamples: [`${powerPlain(state.variable, state.combinedExponent)} = 1/${powerPlain(state.variable, state.finalDenominatorExponent)}`],
          acceptanceNotes: ["The positive-power output instruction is mark-bearing and must be satisfied."],
          dependsOnMarkNumbers: [2],
          followThroughFromMarkNumbers: [1, 2],
          comparableDifficultyRequired: true,
          blockingConditions: ["Leaving the final answer with a negative exponent does not earn this mark."],
        }),
      ];
    default:
      return null;
  }
};
