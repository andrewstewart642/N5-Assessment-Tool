import { n2CanonicalAnswerPlain } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/PromptGrammar";
import type { N2GeneratedQuestion } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";
import type { N2GeneratedAnswerProfile, N2GeneratedMarkPoint } from "./Types";
import { powerPlain } from "./Formatting";
import { classifiedN2Mark as classifiedMark } from "./MarkPointHelpers";

export const buildMarkPointsGroupC = (
  question: N2GeneratedQuestion,
  profile: N2GeneratedAnswerProfile,
): N2GeneratedMarkPoint[] | null => {
  const state = question.mathState;

  switch (state.mechanism) {
    case "NEGATIVE_INDEX_QUOTIENT":
      return [
        classifiedMark(question, profile, 1, {
          type: "PROCESS",
          role: "DENOMINATOR_PRODUCT_LAW",
          requirement: "Combine the two same-base powers in the denominator.",
          evidenceExamples: [`${powerPlain(state.variable, state.denominatorExponents[0])} × ${powerPlain(state.variable, state.denominatorExponents[1])} = ${powerPlain(state.variable, state.denominatorExponent)}`],
          acceptanceNotes: ["A positive-powers-first route is acceptable when it preserves an equivalent three-stage solution."],
          dependsOnMarkNumbers: [],
          followThroughFromMarkNumbers: [],
          comparableDifficultyRequired: false,
          blockingConditions: [],
        }),
        classifiedMark(question, profile, 2, {
          type: "PROCESS",
          role: "QUOTIENT_LAW",
          requirement: "Apply the quotient law to obtain the correct signed final exponent before conversion.",
          evidenceExamples: [`${state.coefficient}${powerPlain(state.variable, state.numeratorExponent)} / ${powerPlain(state.variable, state.denominatorExponent)} = ${state.coefficient}${powerPlain(state.variable, state.combinedExponent)}`],
          acceptanceNotes: ["The numerical coefficient must remain correctly placed throughout."],
          dependsOnMarkNumbers: [1],
          followThroughFromMarkNumbers: [1],
          comparableDifficultyRequired: true,
          blockingConditions: [],
        }),
        classifiedMark(question, profile, 3, {
          type: "REPRESENTATION",
          role: "POSITIVE_POWER_CONVERSION",
          requirement: "Convert the negative power to reciprocal positive-power form while retaining the coefficient correctly.",
          evidenceExamples: [n2CanonicalAnswerPlain(state)],
          acceptanceNotes: ["The positive-power output instruction must be satisfied."],
          dependsOnMarkNumbers: [2],
          followThroughFromMarkNumbers: [1, 2],
          comparableDifficultyRequired: true,
          blockingConditions: ["A final negative exponent does not satisfy the required output form."],
        }),
      ];
    case "DISTRIBUTIVE_INDEX_EXPANSION":
      return [
        classifiedMark(question, profile, 1, {
          type: "PROCESS",
          role: "DISTRIBUTIVE_INDEX_PRODUCT",
          requirement: "Multiply the outside power into at least one bracket term and combine the corresponding exponents correctly.",
          evidenceExamples: [
            `${powerPlain(state.variable, state.outsideExponent)} × ${powerPlain(state.variable, state.firstTermExponent)} = ${powerPlain(state.variable, state.firstResultExponent)}`,
            `${powerPlain(state.variable, state.outsideExponent)} × ${powerPlain(state.variable, state.secondTermExponent)} = ${powerPlain(state.variable, state.secondResultExponent)}`,
          ],
          acceptanceNotes: ["Either bracket term can supply the first mark."],
          dependsOnMarkNumbers: [],
          followThroughFromMarkNumbers: [],
          comparableDifficultyRequired: false,
          blockingConditions: [],
        }),
        classifiedMark(question, profile, 2, {
          type: "ACCURACY",
          role: "DISTRIBUTIVE_COMPLETION",
          requirement: "Complete both distributed products and simplify the two-term result fully.",
          evidenceExamples: [n2CanonicalAnswerPlain(state)],
          acceptanceNotes: ["Both terms must be complete for the second mark; any zero-power term should be simplified to one."],
          dependsOnMarkNumbers: [1],
          followThroughFromMarkNumbers: [1],
          comparableDifficultyRequired: true,
          blockingConditions: [],
        }),
      ];
    case "POSITIVE_POWER_PRODUCT_QUOTIENT":
      return [
        classifiedMark(question, profile, 1, {
          type: "PROCESS",
          role: "POWER_OF_POWER",
          requirement: "Apply the power-of-a-power law to the bracketed indexed factor.",
          evidenceExamples: [`(${powerPlain(state.variable, state.innerExponent)})^${state.outerExponent} = ${powerPlain(state.variable, state.poweredExponent)}`],
          acceptanceNotes: [],
          dependsOnMarkNumbers: [],
          followThroughFromMarkNumbers: [],
          comparableDifficultyRequired: false,
          blockingConditions: ["A correct final answer without displayed process receives no credit for this generated profile."],
        }),
        classifiedMark(question, profile, 2, {
          type: "PROCESS",
          role: "NUMERATOR_PRODUCT_LAW",
          requirement: "Combine the two same-base powers in the numerator.",
          evidenceExamples: [`${powerPlain(state.variable, state.firstExponent)} × ${powerPlain(state.variable, state.poweredExponent)} = ${powerPlain(state.variable, state.numeratorExponent)}`],
          acceptanceNotes: [],
          dependsOnMarkNumbers: [1],
          followThroughFromMarkNumbers: [1],
          comparableDifficultyRequired: true,
          blockingConditions: [],
        }),
        classifiedMark(question, profile, 3, {
          type: "ACCURACY",
          role: "QUOTIENT_LAW",
          requirement: "Apply the quotient law to obtain the final simplified positive power.",
          evidenceExamples: [n2CanonicalAnswerPlain(state)],
          acceptanceNotes: [],
          dependsOnMarkNumbers: [2],
          followThroughFromMarkNumbers: [1, 2],
          comparableDifficultyRequired: true,
          blockingConditions: ["A correct final answer alone does not imply any of the three process marks."],
        }),
      ];
    default:
      return null;
  }
};
