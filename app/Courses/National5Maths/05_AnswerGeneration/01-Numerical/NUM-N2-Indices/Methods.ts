import {
  n2CanonicalAnswerLatex,
  n2CanonicalAnswerPlain,
  reduceN2RationalExponent,
} from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/PromptGrammar";
import type { N2GeneratedMathState, N2GeneratedQuestion } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";
import type { N2GeneratedAnswerMethod, N2GeneratedAnswerProfile, N2GeneratedMethodFamily } from "./Types";
import { fractionLatex, powerLatex, powerPlain } from "./Formatting";

const methodLine = (
  question: N2GeneratedQuestion,
  suffix: string,
  text: string,
  latex: string | null,
  markNumbers: number[],
) => ({
  id: `${question.instanceId}-${suffix}`,
  text,
  latex,
  markNumbers,
});

export const buildN2AnswerMethod = (
  question: N2GeneratedQuestion,
  profile: N2GeneratedAnswerProfile,
): N2GeneratedAnswerMethod => {
  const state: N2GeneratedMathState = question.mathState;
  let methodFamilyId: N2GeneratedMethodFamily;
  let lines: N2GeneratedAnswerMethod["lines"];

  switch (state.mechanism) {
    case "FRACTIONAL_NUMERIC_EVALUATION": {
      methodFamilyId = "FRACTIONAL_ROOT_THEN_POWER";
      const interpretedLatex = `${state.base}^{\\tfrac{${state.exponentNumerator}}{${state.rootIndex}}}=\\left(${state.rootIndex === 2 ? `\\sqrt{${state.base}}` : `\\sqrt[${state.rootIndex}]{${state.base}}`}\\right)^{${state.exponentNumerator}}=${state.rootValue}^{${state.exponentNumerator}}`;
      lines = [
        methodLine(question, "INTERPRET", `${state.base}^(${state.exponentNumerator}/${state.rootIndex}) = (${state.rootIndex}th-root(${state.base}))^${state.exponentNumerator} = ${state.rootValue}^${state.exponentNumerator}`, interpretedLatex, [1]),
        methodLine(question, "EVALUATE", `${state.rootValue}^${state.exponentNumerator} = ${state.exactResult}`, `${state.rootValue}^{${state.exponentNumerator}}=${state.exactResult}`, [2]),
      ];
      break;
    }
    case "PRODUCT_QUOTIENT_WITH_COEFFICIENT":
      methodFamilyId = "COEFFICIENT_PRODUCT_QUOTIENT";
      lines = [
        methodLine(question, "PRODUCT", `Combine the numerator powers: ${state.coefficientNumerator}${powerPlain(state.variable, state.numeratorExponent)}.`, `${state.coefficientNumerator}${powerLatex(state.variable, state.numeratorExponent)}`, [1]),
        methodLine(question, "COEFFICIENT", `Reduce ${state.coefficientNumerator}/${state.coefficientDenominator} to ${state.coefficientResult}.`, `${fractionLatex(`${state.coefficientNumerator}`, `${state.coefficientDenominator}`)}=${state.coefficientResult}`, [2]),
        methodLine(question, "QUOTIENT", n2CanonicalAnswerPlain(state), n2CanonicalAnswerLatex(state), [3]),
      ];
      break;
    case "POWER_OF_POWER_WITH_NEGATIVE_INDEX":
      methodFamilyId = "SIGNED_EXPONENT_ROUTE";
      lines = [
        methodLine(question, "POWER", `${powerPlain(state.variable, state.poweredExponent)} × ${powerPlain(state.variable, state.secondExponent)}`, `${powerLatex(state.variable, state.poweredExponent)}\\,\\times\\,${powerLatex(state.variable, state.secondExponent)}`, [1]),
        methodLine(question, "COMBINE", powerPlain(state.variable, state.combinedExponent), powerLatex(state.variable, state.combinedExponent), [2]),
        methodLine(question, "POSITIVE-POWER", n2CanonicalAnswerPlain(state), n2CanonicalAnswerLatex(state), [3]),
      ];
      break;
    case "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX": {
      methodFamilyId = "ROOT_RECIPROCAL_CONVERSION";
      const positiveFractional = reduceN2RationalExponent(state.radicandExponent, state.rootIndex);
      lines = [
        methodLine(question, "ROOT-INDEX", `1/${powerPlain(state.variable, positiveFractional)}`, fractionLatex("1", powerLatex(state.variable, positiveFractional)), [1]),
        methodLine(question, "NEGATIVE-INDEX", n2CanonicalAnswerPlain(state), n2CanonicalAnswerLatex(state), [2]),
      ];
      break;
    }
    case "SQUARED_FRACTIONAL_MONOMIAL":
      methodFamilyId = "POWERED_MONOMIAL";
      lines = [
        methodLine(question, "ONE-COMPONENT", `Square the coefficient: ${state.resultCoefficientNumerator}/${state.resultCoefficientDenominator}.`, fractionLatex(`${state.resultCoefficientNumerator}`, `${state.resultCoefficientDenominator}`), [1]),
        methodLine(question, "COMPLETE", n2CanonicalAnswerPlain(state), n2CanonicalAnswerLatex(state), [2]),
      ];
      break;
    case "PRODUCT_OVER_ROOT": {
      methodFamilyId = "PRODUCT_OVER_ROOT_ROUTE";
      const rootExponent = { numerator: 1, denominator: state.rootIndex } as const;
      lines = [
        methodLine(question, "NUMERATOR", `${state.coefficient}${powerPlain(state.variable, state.numeratorExponent)}`, `${state.coefficient}${powerLatex(state.variable, state.numeratorExponent)}`, [1]),
        methodLine(question, "ROOT-INDEX", `${state.coefficient}${powerPlain(state.variable, state.numeratorExponent)} / ${powerPlain(state.variable, rootExponent)}`, fractionLatex(`${state.coefficient}${powerLatex(state.variable, state.numeratorExponent)}`, powerLatex(state.variable, rootExponent)), [2]),
        methodLine(question, "QUOTIENT", n2CanonicalAnswerPlain(state), n2CanonicalAnswerLatex(state), [3]),
      ];
      break;
    }
    case "NEGATIVE_INDEX_QUOTIENT":
      methodFamilyId = "NEGATIVE_QUOTIENT_ROUTE";
      lines = [
        methodLine(question, "DENOMINATOR", `${state.coefficient}${powerPlain(state.variable, state.numeratorExponent)} / ${powerPlain(state.variable, state.denominatorExponent)}`, fractionLatex(`${state.coefficient}${powerLatex(state.variable, state.numeratorExponent)}`, powerLatex(state.variable, state.denominatorExponent)), [1]),
        methodLine(question, "SIGNED-QUOTIENT", `${state.coefficient}${powerPlain(state.variable, state.combinedExponent)}`, `${state.coefficient}${powerLatex(state.variable, state.combinedExponent)}`, [2]),
        methodLine(question, "POSITIVE-POWER", n2CanonicalAnswerPlain(state), n2CanonicalAnswerLatex(state), [3]),
      ];
      break;
    case "DISTRIBUTIVE_INDEX_EXPANSION":
      methodFamilyId = "DISTRIBUTIVE_EXPANSION_ROUTE";
      lines = [
        methodLine(
          question,
          "DISTRIBUTE",
          `${powerPlain(state.variable, state.firstResultExponent)} + ${powerPlain(state.variable, state.secondResultExponent)}`,
          `${powerLatex(state.variable, state.firstResultExponent)}+${powerLatex(state.variable, state.secondResultExponent)}`,
          [1],
        ),
        methodLine(question, "SIMPLIFY", n2CanonicalAnswerPlain(state), n2CanonicalAnswerLatex(state), [2]),
      ];
      break;
    case "POSITIVE_POWER_PRODUCT_QUOTIENT":
      methodFamilyId = "POSITIVE_THREE_LAW_ROUTE";
      lines = [
        methodLine(question, "POWER", `${powerPlain(state.variable, state.firstExponent)} × ${powerPlain(state.variable, state.poweredExponent)} / ${powerPlain(state.variable, state.denominatorExponent)}`, fractionLatex(`${powerLatex(state.variable, state.firstExponent)}\\,\\times\\,${powerLatex(state.variable, state.poweredExponent)}`, powerLatex(state.variable, state.denominatorExponent)), [1]),
        methodLine(question, "PRODUCT", `${powerPlain(state.variable, state.numeratorExponent)} / ${powerPlain(state.variable, state.denominatorExponent)}`, fractionLatex(powerLatex(state.variable, state.numeratorExponent), powerLatex(state.variable, state.denominatorExponent)), [2]),
        methodLine(question, "QUOTIENT", n2CanonicalAnswerPlain(state), n2CanonicalAnswerLatex(state), [3]),
      ];
      break;
  }

  return {
    methodFamilyId,
    lines,
    sourceEvidenceIds: [...profile.sourceAnchorIds],
  };
};
