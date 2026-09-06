import type { G1Rational } from "./Types";
import {
  buildG1LineEquation as buildG1LineEquationV2,
  g1RationalLatex,
  g1RationalPlain,
  reduceG1Rational,
} from "./PromptGrammarV2";

export {
  buildG1BestFitPrompt,
  buildG1ContextPrompt,
  buildG1DiagramLinePrompt,
  buildG1DirectLinePrompt,
  buildG1SymbolicPrompt,
  g1BestFitFollowUp,
  g1RationalLatex,
  g1RationalPlain,
  reduceG1Rational,
} from "./PromptGrammarV2";
export type { G1PromptBuild } from "./PromptGrammarV2";

const exactCoefficientLatex = (coefficient: G1Rational, variable: string) => {
  const reduced = reduceG1Rational(coefficient);
  if (reduced.denominator === 1) {
    if (reduced.numerator === 1) return variable;
    if (reduced.numerator === -1) return `-${variable}`;
    return `${reduced.numerator}${variable}`;
  }
  return `${g1RationalLatex(reduced)}${variable}`;
};

const exactCoefficientPlain = (coefficient: G1Rational, variable: string) => {
  const reduced = reduceG1Rational(coefficient);
  if (reduced.denominator === 1) {
    if (reduced.numerator === 1) return variable;
    if (reduced.numerator === -1) return `-${variable}`;
    return `${reduced.numerator}${variable}`;
  }
  return `${g1RationalPlain(reduced)}${variable}`;
};

const exactInterceptLatex = (body: string, intercept: G1Rational) => {
  const reduced = reduceG1Rational(intercept);
  if (reduced.numerator === 0) return body;
  const sign = reduced.numerator > 0 ? "+" : "-";
  return `${body}${sign}${g1RationalLatex({ numerator: Math.abs(reduced.numerator), denominator: reduced.denominator })}`;
};

const exactInterceptPlain = (body: string, intercept: G1Rational) => {
  const reduced = reduceG1Rational(intercept);
  if (reduced.numerator === 0) return body;
  const sign = reduced.numerator > 0 ? " + " : " - ";
  return `${body}${sign}${g1RationalPlain({ numerator: Math.abs(reduced.numerator), denominator: reduced.denominator })}`;
};

/**
 * Contextual and best-fit models may deliberately expose a terminating decimal
 * intercept. The symbolic gradient family is the exception: its narrow source-
 * calibrated answer form remains exact fractional algebra rather than decimal
 * presentation.
 */
export const buildG1LineEquation = (
  xVariable: string,
  yVariable: string,
  gradient: G1Rational,
  intercept: G1Rational,
) => {
  if (yVariable !== "m") {
    return buildG1LineEquationV2(xVariable, yVariable, gradient, intercept);
  }
  return {
    latex: `${yVariable}=${exactInterceptLatex(exactCoefficientLatex(gradient, xVariable), intercept)}`,
    plain: `${yVariable} = ${exactInterceptPlain(exactCoefficientPlain(gradient, xVariable), intercept)}`,
  };
};
