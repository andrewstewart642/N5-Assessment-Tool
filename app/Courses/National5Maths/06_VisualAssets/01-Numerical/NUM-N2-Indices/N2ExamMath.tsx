import katex from "katex";
import type { CSSProperties, ReactNode } from "react";

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
  });

  return (
    <span
      style={atomStyle}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Browser-native fractional exponent renderer.
 *
 * This deliberately does NOT ask KaTeX to lay out the fractional exponent.
 * The numerator, rule, denominator and vertical lift are separate DOM boxes,
 * so the printed-exam hierarchy is stable regardless of KaTeX script metrics.
 */
function FractionalExponent({ value }: { value: N2RationalExponent }) {
  const negative = value.numerator < 0;
  const numerator = Math.abs(value.numerator);

  return (
    <span
      aria-label={`${value.numerator}/${value.denominator}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        verticalAlign: "0.88em",
        marginLeft: "0.035em",
        marginRight: "0.025em",
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: "0.64em",
        fontWeight: 400,
        lineHeight: 0.78,
        whiteSpace: "nowrap",
      }}
    >
      {negative ? (
        <span
          aria-hidden="true"
          style={{
            alignSelf: "center",
            marginRight: "0.08em",
            fontSize: "0.95em",
            lineHeight: 1,
          }}
        >
          −
        </span>
      ) : null}

      <span
        style={{
          display: "inline-grid",
          gridTemplateRows: "auto auto auto",
          justifyItems: "center",
          alignItems: "center",
          minWidth: numerator >= 10 ? "1.45em" : "1.08em",
          lineHeight: 0.76,
        }}
      >
        <span style={{ padding: "0 0.06em 0.13em" }}>{numerator}</span>
        <span
          aria-hidden="true"
          style={{
            display: "block",
            width: "100%",
            borderTop: "1.35px solid currentColor",
          }}
        />
        <span style={{ padding: "0.14em 0.06em 0" }}>{value.denominator}</span>
      </span>
    </span>
  );
}

function Power({ base, exponent }: { base: string; exponent: N2Exponent }) {
  if (typeof exponent === "number" || exponent.denominator === 1) {
    const value = typeof exponent === "number" ? exponent : exponent.numerator;
    if (value === 0) return <KatexAtom latex="1" />;
    if (value === 1) return <KatexAtom latex={base} />;
    return <KatexAtom latex={`${base}^{${value}}`} />;
  }

  return (
    <span
      style={{
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      <KatexAtom latex={base} />
      <FractionalExponent value={exponent} />
    </span>
  );
}

function RationalPower({ base, exponent }: { base: string; exponent: N2RationalExponent }) {
  if (exponent.numerator === 0) return <KatexAtom latex="1" />;
  if (exponent.denominator === 1 && exponent.numerator === 1) return <KatexAtom latex={base} />;
  return <Power base={base} exponent={exponent} />;
}

function InlineRun({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function N2ExamExpression({ state }: { state: N2GeneratedMathState }) {
  if (state.mechanism === "FRACTIONAL_NUMERIC_EVALUATION") {
    return (
      <Power
        base={`${state.base}`}
        exponent={{ numerator: state.exponentNumerator, denominator: state.rootIndex }}
      />
    );
  }

  if (state.mechanism === "DISTRIBUTIVE_INDEX_EXPANSION") {
    return (
      <InlineRun>
        <Power base={state.variable} exponent={state.outsideExponent} />
        <KatexAtom latex="(" />
        <Power base={state.variable} exponent={state.firstTermExponent} />
        <KatexAtom latex="+" />
        <Power base={state.variable} exponent={state.secondTermExponent} />
        <KatexAtom latex=")" />
      </InlineRun>
    );
  }

  return <KatexAtom latex={n2ExpressionLatex(state)} />;
}

export function N2ExamAnswer({ state }: { state: N2GeneratedMathState }) {
  switch (state.mechanism) {
    case "FRACTIONAL_NUMERIC_EVALUATION":
      return <KatexAtom latex={`${state.exactResult}`} />;

    case "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX":
      return <RationalPower base={state.variable} exponent={state.finalExponent} />;

    case "PRODUCT_OVER_ROOT":
      return (
        <InlineRun>
          {state.coefficient === 1 ? null : <KatexAtom latex={`${state.coefficient}`} />}
          <RationalPower base={state.variable} exponent={state.finalExponent} />
        </InlineRun>
      );

    case "DISTRIBUTIVE_INDEX_EXPANSION":
      return (
        <InlineRun>
          <RationalPower base={state.variable} exponent={state.firstResultExponent} />
          <KatexAtom latex="+" />
          <RationalPower base={state.variable} exponent={state.secondResultExponent} />
        </InlineRun>
      );

    default:
      return <KatexAtom latex={n2CanonicalAnswerLatex(state)} />;
  }
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
