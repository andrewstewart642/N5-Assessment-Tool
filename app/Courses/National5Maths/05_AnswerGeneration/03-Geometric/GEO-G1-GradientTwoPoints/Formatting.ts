import type {
  G1LineModelState,
  G1NumericPoint,
  G1Rational,
  G1SymbolicGradientState,
} from "../../../04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Types";
import { reduceG1Rational } from "../../../04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/PromptGrammar";

export const g1AnswerRationalPlain = (value: G1Rational): string => {
  const reduced = reduceG1Rational(value);
  return reduced.denominator === 1
    ? `${reduced.numerator}`
    : `${reduced.numerator}/${reduced.denominator}`;
};

export const g1AnswerRationalLatex = (value: G1Rational): string => {
  const reduced = reduceG1Rational(value);
  if (reduced.denominator === 1) return `${reduced.numerator}`;
  const sign = reduced.numerator < 0 ? "-" : "";
  return `${sign}\\frac{${Math.abs(reduced.numerator)}}{${reduced.denominator}}`;
};

export const g1CoordinatePlain = (point: G1NumericPoint) => `(${point.x}, ${point.y})`;
export const g1CoordinateLatex = (point: G1NumericPoint) => `\\left(${point.x},${point.y}\\right)`;

const plainDifferenceTerm = (value: number) => value < 0 ? `(${value})` : `${value}`;
const latexDifferenceTerm = (value: number) => value < 0 ? `\\left(${value}\\right)` : `${value}`;

export const g1GradientCalculationPlain = (
  first: G1NumericPoint,
  second: G1NumericPoint,
  gradient: G1Rational,
) => `m = (${second.y} - ${plainDifferenceTerm(first.y)})/(${second.x} - ${plainDifferenceTerm(first.x)}) = ${g1AnswerRationalPlain(gradient)}`;

export const g1GradientCalculationLatex = (
  first: G1NumericPoint,
  second: G1NumericPoint,
  gradient: G1Rational,
) => `m=\\frac{${second.y}-${latexDifferenceTerm(first.y)}}{${second.x}-${latexDifferenceTerm(first.x)}}=${g1AnswerRationalLatex(gradient)}`;

const rationalProductLatex = (value: G1Rational, factor: number) =>
  `\\left(${g1AnswerRationalLatex(value)}\\right)\\left(${factor}\\right)`;

const appendRationalConstantLatex = (body: string, value: G1Rational) => {
  const reduced = reduceG1Rational(value);
  if (reduced.numerator === 0) return body;
  const magnitude = g1AnswerRationalLatex({
    numerator: Math.abs(reduced.numerator),
    denominator: reduced.denominator,
  });
  return `${body}${reduced.numerator < 0 ? "-" : "+"}${magnitude}`;
};

const appendRationalConstantPlain = (body: string, value: G1Rational) => {
  const reduced = reduceG1Rational(value);
  if (reduced.numerator === 0) return body;
  const magnitude = g1AnswerRationalPlain({
    numerator: Math.abs(reduced.numerator),
    denominator: reduced.denominator,
  });
  return `${body}${reduced.numerator < 0 ? " - " : " + "}${magnitude}`;
};

export const g1SlopeInterceptSubstitutionLatex = (
  state: G1LineModelState,
  point: G1NumericPoint = state.points[0],
) => `${point.y}=${rationalProductLatex(state.gradient, point.x)}+c\\quad\\Rightarrow\\quad c=${g1AnswerRationalLatex(state.intercept)}`;

export const g1SlopeInterceptSubstitutionPlain = (
  state: G1LineModelState,
  point: G1NumericPoint = state.points[0],
) => `${point.y} = (${g1AnswerRationalPlain(state.gradient)})(${point.x}) + c, so c = ${g1AnswerRationalPlain(state.intercept)}`;

export const g1PointSlopeLatex = (
  state: G1LineModelState,
  point: G1NumericPoint = state.points[0],
) => {
  const left = point.y < 0
    ? `${state.yVariable}+${Math.abs(point.y)}`
    : `${state.yVariable}-${point.y}`;
  const rightBracket = point.x < 0
    ? `${state.xVariable}+${Math.abs(point.x)}`
    : `${state.xVariable}-${point.x}`;
  return `${left}=${g1AnswerRationalLatex(state.gradient)}\\left(${rightBracket}\\right)`;
};

export const g1PointSlopePlain = (
  state: G1LineModelState,
  point: G1NumericPoint = state.points[0],
) => {
  const left = point.y < 0
    ? `${state.yVariable} + ${Math.abs(point.y)}`
    : `${state.yVariable} - ${point.y}`;
  const rightBracket = point.x < 0
    ? `${state.xVariable} + ${Math.abs(point.x)}`
    : `${state.xVariable} - ${point.x}`;
  return `${left} = ${g1AnswerRationalPlain(state.gradient)}(${rightBracket})`;
};

export const g1ModelApplicationLatex = (
  state: G1LineModelState,
  input: number,
  output: G1Rational,
) => `${state.yVariable}=${appendRationalConstantLatex(rationalProductLatex(state.gradient, input), state.intercept)}=${g1AnswerRationalLatex(output)}`;

export const g1ModelApplicationPlain = (
  state: G1LineModelState,
  input: number,
  output: G1Rational,
) => `${state.yVariable} = ${appendRationalConstantPlain(`(${g1AnswerRationalPlain(state.gradient)})(${input})`, state.intercept)} = ${g1AnswerRationalPlain(output)}`;

const symbolicTermPlain = (coefficient: G1Rational, parameter: string) => {
  const reduced = reduceG1Rational(coefficient);
  if (reduced.denominator === 1 && reduced.numerator === 1) return parameter;
  if (reduced.denominator === 1 && reduced.numerator === -1) return `-${parameter}`;
  return `${g1AnswerRationalPlain(reduced)}${parameter}`;
};

export const g1SymbolicFinalPlain = (state: G1SymbolicGradientState) => {
  const first = symbolicTermPlain(state.finalGradientCoefficient, state.parameter);
  return appendRationalConstantPlain(first, state.finalGradientConstant);
};

export const g1SymbolicFactorCancelLatex = (state: G1SymbolicGradientState) =>
  `m=\\frac{${state.numeratorFactorisationLatex}}{${state.denominatorFactorisationLatex}}=${state.finalGradientLatex}`;
