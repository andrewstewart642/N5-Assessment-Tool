import { rationalExponentLatex } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/PromptGrammar";
import type { N2Exponent, N2RationalExponent } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";

export const rationalExponentPlain = (value: N2RationalExponent) =>
  value.denominator === 1 ? `${value.numerator}` : `${value.numerator}/${value.denominator}`;

export const powerPlain = (variable: string, exponent: N2Exponent) => {
  const body = typeof exponent === "number" ? `${exponent}` : rationalExponentPlain(exponent);
  return `${variable}^(${body})`;
};

export const powerLatex = (variable: string, exponent: N2Exponent) => {
  const body = typeof exponent === "number" ? `${exponent}` : rationalExponentLatex(exponent);
  return `${variable}^{${body}}`;
};

export const fractionLatex = (numerator: string, denominator: string) => `\\dfrac{${numerator}}{${denominator}}`;
