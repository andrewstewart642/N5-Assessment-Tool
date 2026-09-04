import katex from "katex";
import type { CSSProperties } from "react";

import {
  n2CanonicalAnswerLatex,
  n2ExpressionLatex,
} from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/PromptGrammar";
import type {
  N2Exponent,
  N2GeneratedMathState,
  N2GeneratedQuestion,
  N2RationalExponent,
} from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";

const atomStyle: CSSProperties = {
  display: "inline-block",
  whiteSpace: "nowrap",
};

function KatexAtom({ latex }: { latex: string }) {
  const html = katex.renderToString(latex, {
    throwOnError: false,
    displayMode: false,
    strict: false,
    trust: true,
  });

  return (
    <span
      style={atomStyle}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Exam-style rational exponent body.
 *
 * The entire power remains one KaTeX expression so KaTeX owns the true
 * superscript baseline. genfrac style 1 preserves the clear stacked fraction
 * that matched the examination reference, while htmlStyle trims only the
 * fractional exponent face to 90% of that accepted size. This deliberately
 * leaves the superscript position, base size and fraction geometry unchanged.
 */
function rationalExponentBodyLatex(value: N2RationalExponent): string {
  if (value.denominator === 1) return `${value.numerator}`;
  const sign = value.numerator < 0 ? "-" : "";
  return `${sign}\\htmlStyle{font-size:90%;}{\\genfrac{}{}{0.055em}{1}{${Math.abs(value.numerator)}}{${value.denominator}}}`;
}

function powerLatex(base: string, exponent: N2Exponent): string {
  if (typeof exponent === "number") {
    if (exponent === 0) return "1";
    if (exponent === 1) return base;
    return `${base}^{${exponent}}`;
  }

  if (exponent.numerator === 0) return "1";
  if (exponent.denominator === 1 && exponent.numerator === 1) return base;
  return `${base}^{${rationalExponentBodyLatex(exponent)}}`;
}

function examExpressionLatex(state: N2GeneratedMathState): string {
  switch (state.mechanism) {
    case "FRACTIONAL_NUMERIC_EVALUATION":
      return powerLatex(`${state.base}`, {
        numerator: state.exponentNumerator,
        denominator: state.rootIndex,
      });

    case "DISTRIBUTIVE_INDEX_EXPANSION":
      return `${powerLatex(state.variable, state.outsideExponent)}\\left(${powerLatex(state.variable, state.firstTermExponent)}+${powerLatex(state.variable, state.secondTermExponent)}\\right)`;

    default:
      return n2ExpressionLatex(state);
  }
}

function examAnswerLatex(state: N2GeneratedMathState): string {
  switch (state.mechanism) {
    case "FRACTIONAL_NUMERIC_EVALUATION":
      return `${state.exactResult}`;

    case "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX":
      return powerLatex(state.variable, state.finalExponent);

    case "PRODUCT_OVER_ROOT":
      return `${state.coefficient === 1 ? "" : state.coefficient}${powerLatex(state.variable, state.finalExponent)}`;

    case "DISTRIBUTIVE_INDEX_EXPANSION":
      return `${powerLatex(state.variable, state.firstResultExponent)}+${powerLatex(state.variable, state.secondResultExponent)}`;

    default:
      return n2CanonicalAnswerLatex(state);
  }
}

export function N2ExamExpression({ state }: { state: N2GeneratedMathState }) {
  return <KatexAtom latex={examExpressionLatex(state)} />;
}

export function N2ExamAnswer({ state }: { state: N2GeneratedMathState }) {
  return <KatexAtom latex={examAnswerLatex(state)} />;
}

export function N2ExamQuestionPrompt({ question }: { question: N2GeneratedQuestion }) {
  const state = question.mathState;

  if (state.mechanism === "FRACTIONAL_NUMERIC_EVALUATION") {
    return (
      <>
        Evaluate <N2ExamExpression state={state} />.
      </>
    );
  }

  if (state.mechanism === "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX") {
    const targetExponentSymbol = state.variable === "n" ? "k" : "n";
    return (
      <>
        Express <N2ExamExpression state={state} /> in the form <KatexAtom latex={`${state.variable}^{${targetExponentSymbol}}`} />.
      </>
    );
  }

  if (state.mechanism === "SQUARED_FRACTIONAL_MONOMIAL") {
    return (
      <>
        Remove the brackets and simplify <N2ExamExpression state={state} />.
      </>
    );
  }

  if (state.mechanism === "DISTRIBUTIVE_INDEX_EXPANSION") {
    return (
      <>
        Expand and simplify fully <N2ExamExpression state={state} />.
      </>
    );
  }

  const positivePower = state.mechanism === "POWER_OF_POWER_WITH_NEGATIVE_INDEX"
    || state.mechanism === "NEGATIVE_INDEX_QUOTIENT";

  return (
    <>
      Simplify <N2ExamExpression state={state} />.
      {positivePower ? (
        <>
          <br />
          Give your answer with a <strong>positive</strong> power.
        </>
      ) : null}
    </>
  );
}
