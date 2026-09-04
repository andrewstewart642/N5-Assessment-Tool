import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import type {
  N2Exponent,
  N2GeneratedMathState,
  N2PromptSection,
  N2RationalExponent,
} from "./Types";

const text = (value: string): PaperPart => ({ kind: "text", value });
const math = (latex: string, displayMode = false): PaperPart => ({ kind: "math", latex, displayMode });

const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);

export const reduceN2RationalExponent = (numerator: number, denominator: number): N2RationalExponent => {
  const divisor = gcd(Math.abs(numerator), Math.abs(denominator)) || 1;
  const sign = denominator < 0 ? -1 : 1;
  const reducedDenominator = Math.abs(denominator / divisor);
  if (reducedDenominator !== 1 && reducedDenominator !== 2 && reducedDenominator !== 3) {
    throw new Error(`N2 exponent denominator ${reducedDenominator} is outside the supported 1/2/3 range.`);
  }
  return {
    numerator: (numerator / divisor) * sign,
    denominator: reducedDenominator as 1 | 2 | 3,
  };
};

const asRational = (value: N2Exponent): N2RationalExponent =>
  typeof value === "number" ? { numerator: value, denominator: 1 } : value;

export const addN2Exponents = (first: N2Exponent, second: N2Exponent): N2RationalExponent => {
  const a = asRational(first);
  const b = asRational(second);
  return reduceN2RationalExponent(
    a.numerator * b.denominator + b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
};

/**
 * Fractional indices need a stronger visual hierarchy than ordinary inline
 * fractions. Script style keeps the exponent clearly subordinate to the base,
 * while the explicit rule thickness prevents the numerator/denominator from
 * visually swallowing the fraction bar at small sizes.
 */
export const rationalExponentLatex = (value: N2RationalExponent): string => {
  if (value.denominator === 1) return `${value.numerator}`;
  const sign = value.numerator < 0 ? "-" : "";
  return `${sign}\\genfrac{}{}{0.055em}{2}{${Math.abs(value.numerator)}}{${value.denominator}}`;
};

const rationalExponentPlain = (value: N2RationalExponent): string =>
  value.denominator === 1 ? `${value.numerator}` : `${value.numerator}/${value.denominator}`;

const powerLatex = (variable: string, exponent: N2Exponent) => {
  const body = typeof exponent === "number" ? `${exponent}` : rationalExponentLatex(exponent);
  return `${variable}^{${body}}`;
};

const powerPlain = (variable: string, exponent: N2Exponent) => {
  const body = typeof exponent === "number" ? `${exponent}` : rationalExponentPlain(exponent);
  return `${variable}^(${body})`;
};

const fractionLatex = (numerator: string, denominator: string) => `\\dfrac{${numerator}}{${denominator}}`;

const rationalPowerLatex = (variable: string, exponent: N2RationalExponent): string => {
  const reduced = reduceN2RationalExponent(exponent.numerator, exponent.denominator);
  if (reduced.numerator === 0) return "1";
  if (reduced.denominator === 1 && reduced.numerator === 1) return variable;
  return powerLatex(variable, reduced);
};

const rationalPowerPlain = (variable: string, exponent: N2RationalExponent): string => {
  const reduced = reduceN2RationalExponent(exponent.numerator, exponent.denominator);
  if (reduced.numerator === 0) return "1";
  if (reduced.denominator === 1 && reduced.numerator === 1) return variable;
  return powerPlain(variable, reduced);
};

const radicalLatex = (variable: string, exponent: number, rootIndex: 2 | 3) => {
  const radicand = exponent === 1 ? variable : powerLatex(variable, exponent);
  return rootIndex === 2 ? `\\sqrt{${radicand}}` : `\\sqrt[${rootIndex}]{${radicand}}`;
};

export const n2ExpressionLatex = (state: N2GeneratedMathState): string => {
  switch (state.mechanism) {
    case "FRACTIONAL_NUMERIC_EVALUATION":
      return `${state.base}^{${rationalExponentLatex({ numerator: state.exponentNumerator, denominator: state.rootIndex })}}`;
    case "PRODUCT_QUOTIENT_WITH_COEFFICIENT": {
      const first = powerLatex(state.variable, state.firstExponent);
      const second = `${state.coefficientNumerator}${powerLatex(state.variable, state.secondExponent)}`;
      const numerator = state.reverseNumeratorFactors ? `${second}\\,\\times\\,${first}` : `${first}\\,\\times\\,${second}`;
      const denominator = `${state.coefficientDenominator}${powerLatex(state.variable, state.denominatorExponent)}`;
      return fractionLatex(numerator, denominator);
    }
    case "POWER_OF_POWER_WITH_NEGATIVE_INDEX": {
      const powerFactor = `\\left(${powerLatex(state.variable, state.innerExponent)}\\right)^{${state.outerExponent}}`;
      const otherFactor = powerLatex(state.variable, state.secondExponent);
      return state.powerFactorFirst
        ? `${powerFactor}\\,\\times\\,${otherFactor}`
        : `${otherFactor}\\,\\times\\,${powerFactor}`;
    }
    case "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX":
      return fractionLatex("1", radicalLatex(state.variable, state.radicandExponent, state.rootIndex));
    case "SQUARED_FRACTIONAL_MONOMIAL":
      return `\\left(\\dfrac{${state.coefficientNumerator}}{${state.coefficientDenominator}}${powerLatex(state.variable, state.variableExponent)}\\right)^2`;
    case "PRODUCT_OVER_ROOT": {
      const numerator = `${powerLatex(state.variable, state.firstExponent)}\\,\\times\\,${state.coefficient}${powerLatex(state.variable, state.secondExponent)}`;
      return fractionLatex(numerator, radicalLatex(state.variable, 1, state.rootIndex));
    }
    case "NEGATIVE_INDEX_QUOTIENT": {
      const numerator = `${state.coefficient}${powerLatex(state.variable, state.numeratorExponent)}`;
      const denominator = `${powerLatex(state.variable, state.denominatorExponents[0])}\\,\\times\\,${powerLatex(state.variable, state.denominatorExponents[1])}`;
      return fractionLatex(numerator, denominator);
    }
    case "DISTRIBUTIVE_INDEX_EXPANSION":
      return `${powerLatex(state.variable, state.outsideExponent)}\\left(${powerLatex(state.variable, state.firstTermExponent)}+${powerLatex(state.variable, state.secondTermExponent)}\\right)`;
    case "POSITIVE_POWER_PRODUCT_QUOTIENT": {
      const numerator = `${powerLatex(state.variable, state.firstExponent)}\\,\\times\\,\\left(${powerLatex(state.variable, state.innerExponent)}\\right)^{${state.outerExponent}}`;
      return fractionLatex(numerator, powerLatex(state.variable, state.denominatorExponent));
    }
  }
};

export const n2ExpressionPlain = (state: N2GeneratedMathState): string => {
  switch (state.mechanism) {
    case "FRACTIONAL_NUMERIC_EVALUATION":
      return `${state.base}^(${state.exponentNumerator}/${state.rootIndex})`;
    case "PRODUCT_QUOTIENT_WITH_COEFFICIENT": {
      const first = powerPlain(state.variable, state.firstExponent);
      const second = `${state.coefficientNumerator}${powerPlain(state.variable, state.secondExponent)}`;
      const numerator = state.reverseNumeratorFactors ? `${second} × ${first}` : `${first} × ${second}`;
      return `(${numerator}) / (${state.coefficientDenominator}${powerPlain(state.variable, state.denominatorExponent)})`;
    }
    case "POWER_OF_POWER_WITH_NEGATIVE_INDEX": {
      const powerFactor = `(${powerPlain(state.variable, state.innerExponent)})^${state.outerExponent}`;
      const otherFactor = powerPlain(state.variable, state.secondExponent);
      return state.powerFactorFirst ? `${powerFactor} × ${otherFactor}` : `${otherFactor} × ${powerFactor}`;
    }
    case "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX":
      return `1 / ${state.rootIndex === 2 ? "sqrt" : `${state.rootIndex}th-root`}(${state.radicandExponent === 1 ? state.variable : powerPlain(state.variable, state.radicandExponent)})`;
    case "SQUARED_FRACTIONAL_MONOMIAL":
      return `((${state.coefficientNumerator}/${state.coefficientDenominator})${powerPlain(state.variable, state.variableExponent)})^2`;
    case "PRODUCT_OVER_ROOT":
      return `(${powerPlain(state.variable, state.firstExponent)} × ${state.coefficient}${powerPlain(state.variable, state.secondExponent)}) / ${state.rootIndex === 2 ? `sqrt(${state.variable})` : `${state.rootIndex}th-root(${state.variable})`}`;
    case "NEGATIVE_INDEX_QUOTIENT":
      return `(${state.coefficient}${powerPlain(state.variable, state.numeratorExponent)}) / (${powerPlain(state.variable, state.denominatorExponents[0])} × ${powerPlain(state.variable, state.denominatorExponents[1])})`;
    case "DISTRIBUTIVE_INDEX_EXPANSION":
      return `${powerPlain(state.variable, state.outsideExponent)}(${powerPlain(state.variable, state.firstTermExponent)} + ${powerPlain(state.variable, state.secondTermExponent)})`;
    case "POSITIVE_POWER_PRODUCT_QUOTIENT":
      return `(${powerPlain(state.variable, state.firstExponent)} × (${powerPlain(state.variable, state.innerExponent)})^${state.outerExponent}) / ${powerPlain(state.variable, state.denominatorExponent)}`;
  }
};

export const n2CanonicalAnswerLatex = (state: N2GeneratedMathState): string => {
  switch (state.mechanism) {
    case "FRACTIONAL_NUMERIC_EVALUATION":
      return `${state.exactResult}`;
    case "PRODUCT_QUOTIENT_WITH_COEFFICIENT":
      return `${state.coefficientResult}${powerLatex(state.variable, state.finalExponent)}`;
    case "POWER_OF_POWER_WITH_NEGATIVE_INDEX":
      return fractionLatex("1", powerLatex(state.variable, state.finalDenominatorExponent));
    case "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX":
      return powerLatex(state.variable, state.finalExponent);
    case "SQUARED_FRACTIONAL_MONOMIAL":
      return `\\dfrac{${state.resultCoefficientNumerator}}{${state.resultCoefficientDenominator}}${powerLatex(state.variable, state.resultExponent)}`;
    case "PRODUCT_OVER_ROOT":
      return `${state.coefficient}${powerLatex(state.variable, state.finalExponent)}`;
    case "NEGATIVE_INDEX_QUOTIENT":
      return fractionLatex(`${state.coefficient}`, powerLatex(state.variable, state.finalDenominatorExponent));
    case "DISTRIBUTIVE_INDEX_EXPANSION":
      return `${rationalPowerLatex(state.variable, state.firstResultExponent)}+${rationalPowerLatex(state.variable, state.secondResultExponent)}`;
    case "POSITIVE_POWER_PRODUCT_QUOTIENT":
      return powerLatex(state.variable, state.finalExponent);
  }
};

export const n2CanonicalAnswerPlain = (state: N2GeneratedMathState): string => {
  switch (state.mechanism) {
    case "FRACTIONAL_NUMERIC_EVALUATION":
      return `${state.exactResult}`;
    case "PRODUCT_QUOTIENT_WITH_COEFFICIENT":
      return `${state.coefficientResult}${powerPlain(state.variable, state.finalExponent)}`;
    case "POWER_OF_POWER_WITH_NEGATIVE_INDEX":
      return `1/${powerPlain(state.variable, state.finalDenominatorExponent)}`;
    case "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX":
      return powerPlain(state.variable, state.finalExponent);
    case "SQUARED_FRACTIONAL_MONOMIAL":
      return `(${state.resultCoefficientNumerator}/${state.resultCoefficientDenominator})${powerPlain(state.variable, state.resultExponent)}`;
    case "PRODUCT_OVER_ROOT":
      return `${state.coefficient}${powerPlain(state.variable, state.finalExponent)}`;
    case "NEGATIVE_INDEX_QUOTIENT":
      return `${state.coefficient}/${powerPlain(state.variable, state.finalDenominatorExponent)}`;
    case "DISTRIBUTIVE_INDEX_EXPANSION":
      return `${rationalPowerPlain(state.variable, state.firstResultExponent)} + ${rationalPowerPlain(state.variable, state.secondResultExponent)}`;
    case "POSITIVE_POWER_PRODUCT_QUOTIENT":
      return powerPlain(state.variable, state.finalExponent);
  }
};

export const buildN2Prompt = (state: N2GeneratedMathState): {
  prompt: string;
  promptParts: PaperPart[];
  promptSections: N2PromptSection[];
} => {
  const expressionLatex = n2ExpressionLatex(state);
  const expressionPlain = n2ExpressionPlain(state);
  const marks = state.mechanism === "FRACTIONAL_NUMERIC_EVALUATION"
    || state.mechanism === "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX"
    || state.mechanism === "SQUARED_FRACTIONAL_MONOMIAL"
    || state.mechanism === "DISTRIBUTIVE_INDEX_EXPANSION"
      ? 2
      : 3;

  if (state.mechanism === "FRACTIONAL_NUMERIC_EVALUATION") {
    const lead = "Evaluate";
    return {
      prompt: `${lead} ${expressionPlain}.`,
      promptParts: [text(`${lead} `), math(expressionLatex), text(".")],
      promptSections: [{ label: "", text: lead, marks }],
    };
  }

  if (state.mechanism === "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX") {
    const lead = "Express";
    const targetExponentSymbol = state.variable === "n" ? "k" : "n";
    const targetLatex = `${state.variable}^{${targetExponentSymbol}}`;
    const targetPlain = `${state.variable}^${targetExponentSymbol}`;
    return {
      prompt: `${lead} ${expressionPlain} in the form ${targetPlain}.`,
      promptParts: [text(`${lead} `), math(expressionLatex), text(" in the form "), math(targetLatex), text(".")],
      promptSections: [{ label: "", text: `${lead} the expression in the prescribed power form`, marks }],
    };
  }

  if (state.mechanism === "SQUARED_FRACTIONAL_MONOMIAL") {
    const lead = "Remove the brackets and simplify";
    return {
      prompt: `${lead} ${expressionPlain}.`,
      promptParts: [text(`${lead} `), math(expressionLatex), text(".")],
      promptSections: [{ label: "", text: lead, marks }],
    };
  }

  if (state.mechanism === "DISTRIBUTIVE_INDEX_EXPANSION") {
    const lead = "Expand and simplify fully";
    return {
      prompt: `${lead} ${expressionPlain}.`,
      promptParts: [text(`${lead} `), math(expressionLatex), text(".")],
      promptSections: [{ label: "", text: lead, marks }],
    };
  }

  const lead = "Simplify";
  const positivePower = state.mechanism === "POWER_OF_POWER_WITH_NEGATIVE_INDEX"
    || state.mechanism === "NEGATIVE_INDEX_QUOTIENT";
  const finish = positivePower ? "Give your answer with a positive power." : "";
  return {
    prompt: positivePower
      ? `${lead} ${expressionPlain}.\n${finish}`
      : `${lead} ${expressionPlain}.`,
    promptParts: positivePower
      ? [
          text(`${lead} `),
          math(expressionLatex),
          text(".\nGive your answer with a "),
          math("\\textbf{positive}"),
          text(" power."),
        ]
      : [text(`${lead} `), math(expressionLatex), text(".")],
    promptSections: [{ label: "", text: positivePower ? `${lead}. ${finish}` : lead, marks }],
  };
};

export const addRationalExponents = (
  integer: number,
  fractional: N2RationalExponent,
): N2RationalExponent => addN2Exponents(integer, fractional);
