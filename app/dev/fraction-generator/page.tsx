"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  generateN5MathsFractionSamples,
  type GeneratedFractionQuestion,
} from "@/course-data/question-generators/fractions/N5MathsFractionGenerator";

function FractionDisplay({
  numerator,
  denominator,
}: {
  numerator: string;
  denominator: string;
}) {
  return (
    <span
      style={{
        display: "inline-grid",
        gridTemplateRows: "auto auto",
        alignItems: "center",
        justifyItems: "center",
        verticalAlign: "middle",
        lineHeight: 1,
        margin: "0 2px",
        transform: "translateY(-1px)",
      }}
    >
      <span
        style={{
          fontSize: "0.72em",
          padding: "0 3px 1px",
          borderBottom: "1px solid currentColor",
        }}
      >
        {numerator}
      </span>

      <span
        style={{
          fontSize: "0.72em",
          padding: "1px 3px 0",
        }}
      >
        {denominator}
      </span>
    </span>
  );
}

function BracketDisplay({ side }: { side: "left" | "right" }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        verticalAlign: "middle",
        fontSize: "1.85em",
        lineHeight: 0.75,
        transform: "translateY(0.04em) scaleY(1.18)",
        marginLeft: side === "left" ? 5 : 3,
        marginRight: side === "left" ? 3 : 5,
        fontFamily: "Cambria Math, Cambria, Georgia, Times New Roman, serif",
      }}
    >
      {side === "left" ? "(" : ")"}
    </span>
  );
}

function renderMathText(text: string): ReactNode[] {
  const tokens = text.split(
    /(\d+\s+\d+\/\d+|\d+\/\d+|[()+−+\u00D7\u00F7])/g
  );

  return tokens.map((token, index) => {
    const mixedMatch = token.match(/^(\d+)\s+(\d+)\/(\d+)$/);

    if (mixedMatch) {
      const [, whole, numerator, denominator] = mixedMatch;

      return (
        <span key={`${token}-${index}`} style={{ whiteSpace: "nowrap" }}>
          <span>{whole}</span>
          <span style={{ display: "inline-block", width: 1 }} />
          <FractionDisplay numerator={numerator} denominator={denominator} />
        </span>
      );
    }

    const fractionMatch = token.match(/^(\d+)\/(\d+)$/);

    if (fractionMatch) {
      const [, numerator, denominator] = fractionMatch;

      return (
        <FractionDisplay
          key={`${token}-${index}`}
          numerator={numerator}
          denominator={denominator}
        />
      );
    }

    if (["+", "−", "×", "÷"].includes(token)) {
      return (
        <span
          key={`${token}-${index}`}
          style={{
            display: "inline-block",
            padding: "0 8px",
            fontWeight: 700,
          }}
        >
          {token}
        </span>
      );
    }

    if (token === "(") {
      return <BracketDisplay key={`${token}-${index}`} side="left" />;
    }

    if (token === ")") {
      return <BracketDisplay key={`${token}-${index}`} side="right" />;
    }

    if (/^Evaluate\s+$/.test(token)) {
      return (
        <span key={`${token}-${index}`}>
          Evaluate
          <span style={{ display: "inline-block", width: 14 }} />
        </span>
      );
    }

    return <span key={`${token}-${index}`}>{token}</span>;
  });
}

function MathLine({ children }: { children: string }) {
  const instruction = "Give your answer in its simplest form.";
  const hasInstruction = children.includes(instruction);

  const expressionText = hasInstruction
    ? children.replace(instruction, "").trim()
    : children;

  return (
    <span
      style={{
        display: "block",
        fontSize: 22,
        lineHeight: 1.85,
        letterSpacing: "0.01em",
      }}
    >
      <span style={{ display: "block" }}>{renderMathText(expressionText)}</span>

      {hasInstruction && (
        <span
          style={{
            display: "block",
            marginTop: 8,
          }}
        >
          {instruction}
        </span>
      )}
    </span>
  );
}

export default function FractionGeneratorDevPage() {
  const [samples, setSamples] = useState<GeneratedFractionQuestion[]>([]);

  function regenerateSamples() {
    setSamples(generateN5MathsFractionSamples(20));
  }

  useEffect(() => {
    regenerateSamples();
  }, []);

  const passCount = samples.filter((sample) =>
    sample.checks.every((check) => check.passed)
  ).length;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background: "#070a10",
        color: "#f5f7fb",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 24,
          alignItems: "flex-start",
          marginBottom: 28,
        }}
      >
        <div>
          <h1 style={{ marginTop: 0 }}>N5 Maths Fraction Generator</h1>

          <p style={{ color: "#aab3c5", maxWidth: 900 }}>
            Dev-only test harness. This generates candidate early Paper 1
            fraction questions using catalogue-derived family patterns, then
            renders them in a more exam-like mathematical format.
          </p>

          <p style={{ color: "#aab3c5" }}>
            Passing samples: {passCount}/{samples.length}
          </p>
        </div>

        <button
          type="button"
          onClick={regenerateSamples}
          style={{
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 10,
            padding: "10px 14px",
            background: "rgba(255,255,255,0.08)",
            color: "#f5f7fb",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Generate new samples
        </button>
      </div>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))",
          gap: 18,
        }}
      >
        {samples.map((sample, index) => {
          const allPassed = sample.checks.every((check) => check.passed);

          return (
            <article
              key={sample.id}
              style={{
                border: `1px solid ${
                  allPassed
                    ? "rgba(82, 196, 116, 0.45)"
                    : "rgba(255, 180, 80, 0.45)"
                }`,
                borderRadius: 14,
                padding: 18,
                background: "rgba(255,255,255,0.045)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <strong>Sample {index + 1}</strong>

                <span
                  style={{
                    color: allPassed ? "#8ff0a4" : "#ffd27a",
                    fontWeight: 700,
                  }}
                >
                  {allPassed ? "PASS" : "CHECK"}
                </span>
              </div>

              <div
                style={{
                  marginBottom: 12,
                  padding: 18,
                  borderRadius: 10,
                  background: "#ffffff",
                  color: "#111827",
                  fontFamily:
                    "Cambria Math, Cambria, Georgia, Times New Roman, serif",
                  boxShadow: "0 8px 18px rgba(0,0,0,0.22)",
                }}
              >
                <MathLine>{sample.questionText}</MathLine>
              </div>

              <p>
                <strong>Answer:</strong>{" "}
                <span
                  style={{
                    fontFamily:
                      "Cambria Math, Cambria, Georgia, Times New Roman, serif",
                    fontSize: 20,
                    lineHeight: 1.8,
                  }}
                >
                  {renderMathText(sample.answerText)}
                </span>
              </p>

              <p style={{ color: "#aab3c5" }}>
                <strong>Family:</strong> {sample.familyId}
              </p>

              <p style={{ color: "#aab3c5" }}>
                <strong>Operation:</strong> {sample.operationType}
              </p>

              <p style={{ color: "#aab3c5" }}>
                <strong>Evidence:</strong> {sample.sourceEvidenceSummary}
              </p>

              <p style={{ color: "#d7dce8" }}>
                <strong>Working profile:</strong> {sample.workingSummary}
              </p>

              <details>
                <summary
                  style={{
                    cursor: "pointer",
                    color: "#f5f7fb",
                    fontWeight: 700,
                    marginBottom: 10,
                  }}
                >
                  N5-style checks
                </summary>

                <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                  {sample.checks.map((check) => (
                    <div
                      key={check.label}
                      style={{
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 10,
                        padding: 10,
                        background: "rgba(255,255,255,0.035)",
                      }}
                    >
                      <strong
                        style={{
                          color: check.passed ? "#8ff0a4" : "#ffd27a",
                        }}
                      >
                        {check.passed ? "✓" : "!"} {check.label}
                      </strong>

                      <div style={{ color: "#aab3c5", marginTop: 4 }}>
                        {check.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </details>

              <details style={{ marginTop: 12 }}>
                <summary
                  style={{
                    cursor: "pointer",
                    color: "#f5f7fb",
                    fontWeight: 700,
                  }}
                >
                  Metrics
                </summary>

                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    color: "#aab3c5",
                    background: "rgba(0,0,0,0.22)",
                    padding: 12,
                    borderRadius: 10,
                    overflowX: "auto",
                  }}
                >
                  {JSON.stringify(sample.metrics, null, 2)}
                </pre>
              </details>
            </article>
          );
        })}
      </section>
    </main>
  );
}