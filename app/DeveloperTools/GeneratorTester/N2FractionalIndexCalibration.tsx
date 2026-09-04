"use client";

import katex from "katex";

type Candidate = {
  id: string;
  label: string;
  description: string;
  build: (base: string, numerator: number, denominator: number) => string;
};

const CANDIDATES: readonly Candidate[] = [
  {
    id: "A",
    label: "Native frac",
    description: "KaTeX default superscript fraction",
    build: (base, numerator, denominator) => `${base}^{\\frac{${numerator}}{${denominator}}}`,
  },
  {
    id: "B",
    label: "tfrac",
    description: "Text-style fraction inside the native superscript",
    build: (base, numerator, denominator) => `${base}^{\\tfrac{${numerator}}{${denominator}}}`,
  },
  {
    id: "C",
    label: "footnotesize tfrac",
    description: "Larger fraction geometry, scaled back as one unit",
    build: (base, numerator, denominator) => `${base}^{{\\footnotesize \\tfrac{${numerator}}{${denominator}}}}`,
  },
  {
    id: "D",
    label: "small tfrac",
    description: "Slightly larger than C while retaining native superscript placement",
    build: (base, numerator, denominator) => `${base}^{{\\small \\tfrac{${numerator}}{${denominator}}}}`,
  },
  {
    id: "E",
    label: "genfrac text",
    description: "Explicit text-style fraction with a controlled 0.055em rule",
    build: (base, numerator, denominator) => `${base}^{\\genfrac{}{}{0.055em}{1}{${numerator}}{${denominator}}}`,
  },
  {
    id: "F",
    label: "footnotesize genfrac",
    description: "Text-style genfrac scaled down while KaTeX owns the superscript",
    build: (base, numerator, denominator) => `${base}^{{\\footnotesize \\genfrac{}{}{0.055em}{1}{${numerator}}{${denominator}}}}`,
  },
  {
    id: "G",
    label: "scriptsize genfrac",
    description: "Text-style genfrac with a stronger overall size reduction",
    build: (base, numerator, denominator) => `${base}^{{\\scriptsize \\genfrac{}{}{0.055em}{1}{${numerator}}{${denominator}}}}`,
  },
  {
    id: "H",
    label: "genfrac script",
    description: "Native script-size fraction with only the rule strengthened",
    build: (base, numerator, denominator) => `${base}^{\\genfrac{}{}{0.055em}{2}{${numerator}}{${denominator}}}`,
  },
] as const;

function KaTeXSample({ latex }: { latex: string }) {
  const html = katex.renderToString(latex, {
    throwOnError: false,
    displayMode: false,
  });

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function N2FractionalIndexCalibration() {
  return (
    <section
      style={{
        marginBottom: 10,
        padding: 10,
        border: "1px solid rgba(251,191,36,0.30)",
        borderRadius: 9,
        background: "rgba(120,53,15,0.08)",
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <strong style={{ color: "#fde68a", fontSize: 11 }}>Fractional-index typography calibration — temporary</strong>
        <div style={{ marginTop: 3, color: "#94a3b8", fontSize: 9.5, lineHeight: 1.4 }}>
          These are all single KaTeX expressions. KaTeX therefore owns the superscript placement; only the fraction style/size changes. Compare A–H directly with the historical-paper crop and pick the closest candidate.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
        {CANDIDATES.map((candidate) => (
          <div
            key={candidate.id}
            style={{
              minWidth: 0,
              padding: "8px 9px",
              border: "1px solid rgba(148,163,184,0.18)",
              borderRadius: 7,
              background: "#ffffff",
              color: "#111111",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 7 }}>
              <strong style={{ color: "#111827", fontSize: 10 }}>{candidate.id} · {candidate.label}</strong>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 20,
                minHeight: 34,
                fontFamily: '"Trebuchet MS", Trebuchet, Arial, sans-serif',
                fontSize: "11pt",
                lineHeight: 1.7,
              }}
            >
              <span>Evaluate <span style={{ fontSize: "1.14em" }}><KaTeXSample latex={candidate.build("8", 5, 3)} /></span>.</span>
              <span><span style={{ fontSize: "1.14em" }}><KaTeXSample latex={candidate.build("25", 3, 2)} /></span></span>
            </div>
            <div style={{ marginTop: 5, color: "#64748b", fontSize: 8.5, lineHeight: 1.35 }}>{candidate.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
