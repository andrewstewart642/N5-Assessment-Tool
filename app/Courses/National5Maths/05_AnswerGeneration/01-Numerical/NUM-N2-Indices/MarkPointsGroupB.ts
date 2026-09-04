import { n2CanonicalAnswerPlain } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/PromptGrammar";
import type { N2GeneratedQuestion } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";
import type { N2GeneratedAnswerProfile, N2GeneratedMarkPoint } from "./Types";
import { powerPlain } from "./Formatting";
import { classifiedN2Mark as classifiedMark } from "./MarkPointHelpers";

export const buildMarkPointsGroupB = (
  question: N2GeneratedQuestion,
  profile: N2GeneratedAnswerProfile,
): N2GeneratedMarkPoint[] | null => {
  const state = question.mathState;

  switch (state.mechanism) {
    case "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX":
      return [
        classifiedMark(question, profile, 1, {
          type: "REPRESENTATION",
          role: "ROOT_TO_FRACTIONAL_INDEX",
          requirement: "Rewrite the root as a fractional power of the same base.",
          evidenceExamples: [`${state.rootIndex}th-root(${state.variable}) = ${powerPlain(state.variable, { numerator: 1, denominator: state.rootIndex })}`],
          acceptanceNotes: ["The equivalent fractional exponent may be written directly inside the denominator."],
          dependsOnMarkNumbers: [],
          followThroughFromMarkNumbers: [],
          comparableDifficultyRequired: false,
          blockingConditions: [],
        }),
        classifiedMark(question, profile, 2, {
          type: "REPRESENTATION",
          role: "RECIPROCAL_TO_NEGATIVE_INDEX",
          requirement: "Use the reciprocal law to express the whole quantity as one negative fractional power.",
          evidenceExamples: [`1/${powerPlain(state.variable, { numerator: 1, denominator: state.rootIndex })} = ${powerPlain(state.variable, state.finalExponent)}`],
          acceptanceNotes: ["Stating the correct required exponent directly is acceptable."],
          dependsOnMarkNumbers: [1],
          followThroughFromMarkNumbers: [1],
          comparableDifficultyRequired: true,
          blockingConditions: [],
        }),
      ];
    case "SQUARED_FRACTIONAL_MONOMIAL":
      return [
        classifiedMark(question, profile, 1, {
          type: "PROCESS",
          role: "POWERED_MONOMIAL_COMPONENT",
          requirement: "Correctly apply the outer square to at least one component of the fractional monomial.",
          evidenceExamples: [
            `(${state.coefficientNumerator}/${state.coefficientDenominator})^2 = ${state.resultCoefficientNumerator}/${state.resultCoefficientDenominator}`,
            `(${powerPlain(state.variable, state.variableExponent)})^2 = ${powerPlain(state.variable, state.resultExponent)}`,
          ],
          acceptanceNotes: ["Either the coefficient component or the indexed-variable component can supply the first mark."],
          dependsOnMarkNumbers: [],
          followThroughFromMarkNumbers: [],
          comparableDifficultyRequired: false,
          blockingConditions: [],
        }),
        classifiedMark(question, profile, 2, {
          type: "ACCURACY",
          role: "POWERED_MONOMIAL_COMPLETION",
          requirement: "Complete both components and state one fully simplified monomial.",
          evidenceExamples: [n2CanonicalAnswerPlain(state)],
          acceptanceNotes: ["The coefficient fraction should remain in reduced exact form."],
          dependsOnMarkNumbers: [1],
          followThroughFromMarkNumbers: [1],
          comparableDifficultyRequired: true,
          blockingConditions: [],
        }),
      ];
    case "PRODUCT_OVER_ROOT":
      return [
        classifiedMark(question, profile, 1, {
          type: "PROCESS",
          role: "NUMERATOR_PRODUCT_LAW",
          requirement: "Combine the same-base powers in the numerator.",
          evidenceExamples: [`${state.coefficient}${powerPlain(state.variable, state.numeratorExponent)}`],
          acceptanceNotes: [],
          dependsOnMarkNumbers: [],
          followThroughFromMarkNumbers: [],
          comparableDifficultyRequired: false,
          blockingConditions: [],
        }),
        classifiedMark(question, profile, 2, {
          type: "REPRESENTATION",
          role: "ROOT_TO_FRACTIONAL_INDEX",
          requirement: "Rewrite the root denominator as a fractional power.",
          evidenceExamples: [`sqrt(${state.variable}) = ${powerPlain(state.variable, { numerator: 1, denominator: state.rootIndex })}`],
          acceptanceNotes: ["An equivalent exact root-to-index representation is acceptable."],
          dependsOnMarkNumbers: [],
          followThroughFromMarkNumbers: [],
          comparableDifficultyRequired: false,
          blockingConditions: [],
        }),
        classifiedMark(question, profile, 3, {
          type: "ACCURACY",
          role: "QUOTIENT_LAW",
          requirement: "Apply the quotient law between the integer and fractional exponents and simplify fully.",
          evidenceExamples: [n2CanonicalAnswerPlain(state)],
          acceptanceNotes: ["An equivalent exact fractional exponent is preferred; an exactly equivalent decimal exponent may also represent the same value."],
          dependsOnMarkNumbers: [1, 2],
          followThroughFromMarkNumbers: [1, 2],
          comparableDifficultyRequired: true,
          blockingConditions: [],
        }),
      ];
    default:
      return null;
  }
};
