"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { formatHistoricalQuestionReferenceLabel } from "../../Courses/National5Maths/CatalogCoreTypes";
import type {
  A7GeneratedQuestion,
  A7GeneratorDifficulty,
  A7GeneratorFamily,
  A7GeneratorPaper,
} from "../../Courses/National5Maths/03_QuestionGeneration/02-Algebraic/ALG-A7-LinearEquations";
import {
  generateA7AssessmentBatch,
  type A7GeneratedMarkingScheme,
} from "../../Courses/National5Maths/04_AnswerGeneration/02-Algebraic/ALG-A7-LinearEquations";
import A7SqaQuestionPreview from "./A7SqaQuestionPreview";

type FamilyControl = "MIX" | A7GeneratorFamily;
type DifficultyControl = "MIX" | A7GeneratorDifficulty;

type Sample = {
  id: string;
  seed: number;
  question?: A7GeneratedQuestion;
  markingScheme?: A7GeneratedMarkingScheme;
  error?: string;
};

const SAMPLE_COUNTS = [1, 5, 10, 20] as const;

const FAMILY_OPTIONS: { value: FamilyControl; label: string; papers: A7GeneratorPaper[] }[] = [
  { value: "MIX", label: "Calibrated mix", papers: ["P1", "P2"] },
  { value: "FRACTIONAL_COEFFICIENT", label: "Fractional equation", papers: ["P1", "P2"] },
  { value: "CONTEXT_AREA_EQUALITY", label: "Equal-area context", papers: ["P1"] },
];

function Chip({ children, emphasis = false }: { children: ReactNode; emphasis?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 22,
        padding: "2px 8px",
        border: emphasis ? "1px solid rgba(96,165,250,0.50)" : "1px solid rgba(148,163,184,0.24)",
        borderRadius: 999,
        background: emphasis ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.04)",
        color: emphasis ? "#bfdbfe" : "#cbd5e1",
        fontSize: 10,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 4, color: "#cbd5e1", fontSize: 11, fontWeight: 700 }}>
      {children}
    </label>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        marginBottom: 6,
        color: "#94a3b8",
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function sourceReference(question: A7GeneratedQuestion) {
  const id = question.sourceBasis.historicalReference.primaryQuestionCatalogId;
  return id ? formatHistoricalQuestionReferenceLabel(id) : null;
}

function MarkingDetail({ scheme }: { scheme: A7GeneratedMarkingScheme }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <Chip emphasis>{scheme.profileId.replaceAll("_", " ")}</Chip>
        <Chip>{scheme.markProfile.replaceAll("_", " ")}</Chip>
        <Chip>{scheme.workingPolicy.unsupportedCorrectAnswerTreatment.replaceAll("_", " ")}</Chip>
      </div>

      <div style={{ overflow: "hidden", border: "1px solid #d1d5db", background: "#ffffff", color: "#111827" }}>
        {scheme.markPoints.map((mark, index) => (
          <div
            key={`${mark.markNumber}-${mark.role}`}
            style={{
              display: "grid",
              gridTemplateColumns: "60px 150px minmax(0, 1fr)",
              borderTop: index ? "1px solid #e5e7eb" : "none",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            <div style={{ padding: 9, borderRight: "1px solid #e5e7eb", textAlign: "center", fontWeight: 700, fontSize: 10 }}>
              {mark.partLabel ? `(${mark.partLabel}) ` : ""}m{mark.markNumber}
            </div>
            <div style={{ padding: 9, borderRight: "1px solid #e5e7eb", fontWeight: 700, fontSize: 9, lineHeight: 1.35 }}>
              {mark.role.replaceAll("_", " ")}
              <div style={{ marginTop: 3, color: "#64748b", fontWeight: 600 }}>
                {mark.standard} · {mark.thinking === "REASONING" ? "Reasoning" : "Operational"}
              </div>
            </div>
            <div style={{ padding: 9, fontSize: 10, lineHeight: 1.4 }}>
              <div style={{ fontWeight: 700 }}>{mark.requirement}</div>
              {mark.evidenceExamples.length ? <div style={{ marginTop: 4 }}><strong>Evidence:</strong> {mark.evidenceExamples.join("; ")}</div> : null}
              {mark.acceptanceNotes.length ? <div style={{ marginTop: 4, color: "#475569" }}><strong>Accept:</strong> {mark.acceptanceNotes.join(" ")}</div> : null}
              {mark.blockingConditions.length ? <div style={{ marginTop: 4, color: "#991b1b" }}><strong>Do not award:</strong> {mark.blockingConditions.join(" ")}</div> : null}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        {scheme.methods.map((method) => (
          <div key={method.methodFamilyId} style={{ border: "1px solid rgba(148,163,184,0.18)", borderRadius: 7, overflow: "hidden" }}>
            <div style={{ padding: "6px 8px", color: "#cbd5e1", fontSize: 10, fontWeight: 700 }}>
              {method.methodFamilyId.replaceAll("_", " ")}
            </div>
            <div style={{ display: "grid", gap: 4, padding: 9, background: "#ffffff", color: "#111827", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 10 }}>
              {method.lines.map((line) => (
                <div key={line.id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 8 }}>
                  <span>{line.text}</span>
                  {line.markNumbers.length ? <span style={{ color: "#64748b" }}>m{line.markNumbers.join(",")}</span> : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DifficultyDetail({ question }: { question: A7GeneratedQuestion }) {
  const metrics = question.quality.difficultyMetrics;
  return (
    <div style={{ display: "grid", gap: 6, padding: "8px 10px", border: "1px solid rgba(167,139,250,0.22)", borderRadius: 7, background: "rgba(124,58,237,0.055)", color: "#ddd6fe", fontSize: 10 }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        <Chip emphasis>Difficulty {question.difficulty}</Chip>
        <Chip>{question.quality.difficultyBandId.replaceAll("_", " ").toLowerCase()}</Chip>
        <Chip>score {question.quality.difficultyScore}</Chip>
        {metrics.denominatorLcm !== null ? <Chip>LCD {metrics.denominatorLcm}</Chip> : null}
        <Chip>surface {metrics.surfaceComplexity}</Chip>
        <Chip>max coeff {metrics.largestWorkingCoefficient}</Chip>
        <Chip>max constant {metrics.largestWorkingConstant}</Chip>
        <Chip>final coeff {metrics.rearrangedCoefficientMagnitude}</Chip>
        {metrics.solutionDenominator !== null ? <Chip>answer denom {metrics.solutionDenominator}</Chip> : null}
      </div>
      <div style={{ color: "#c4b5fd", lineHeight: 1.45 }}>
        {question.quality.difficultySignals.join(" ")}
      </div>
    </div>
  );
}

function SampleCard({ sample, index, showDetail }: { sample: Sample; index: number; showDetail: boolean }) {
  if (sample.error) {
    return (
      <article style={{ border: "1px solid rgba(248,113,113,0.42)", borderRadius: 10, padding: 12, background: "rgba(127,29,29,0.12)" }}>
        <strong style={{ color: "#fca5a5" }}>Sample {index + 1} failed · seed {sample.seed}</strong>
        <pre style={{ whiteSpace: "pre-wrap", color: "#fecaca", fontSize: 9 }}>{sample.error}</pre>
      </article>
    );
  }

  if (!sample.question || !sample.markingScheme) return null;
  const question = sample.question;
  const scheme = sample.markingScheme;
  const reference = sourceReference(question);

  return (
    <article style={{ overflow: "hidden", border: "1px solid rgba(148,163,184,0.18)", borderRadius: 10, background: "rgba(255,255,255,0.025)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: "8px 10px",
          borderBottom: "1px solid rgba(148,163,184,0.14)",
        }}
      >
        <strong style={{ color: "#e2e8f0", fontSize: 11 }}>Sample {index + 1} · seed {sample.seed}</strong>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Chip emphasis>D{question.difficulty} · {question.quality.difficultyBandId.replaceAll("_", " ")}</Chip>
          <Chip>{question.marks} marks</Chip>
          <Chip>{question.standard}</Chip>
          <Chip>{question.thinking === "REASONING" ? "Reasoning" : "Operational"}</Chip>
          <Chip>{question.paper}</Chip>
          <Chip>{question.family.replaceAll("_", " ")}</Chip>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12, padding: 10 }}>
        <section>
          <SectionTitle>SQA-style question preview</SectionTitle>
          <A7SqaQuestionPreview question={question} questionNumber={index + 1} />
        </section>

        <section>
          <SectionTitle>Historical reference</SectionTitle>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", padding: "8px 10px", border: "1px solid rgba(96,165,250,0.22)", borderRadius: 7, background: "rgba(59,130,246,0.055)", color: "#dbeafe", fontSize: 10 }}>
            <strong>{reference ? `See ${reference}` : "No primary historical reference"}</strong>
            {question.sourceBasis.historicalReference.matchReasons.map((reason) => (
              <Chip key={reason}>{reason.replaceAll("_", " ").toLowerCase()}</Chip>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>Difficulty calibration</SectionTitle>
          <DifficultyDetail question={question} />
        </section>

        <section>
          <SectionTitle>Final answer</SectionTitle>
          <div style={{ display: "grid", gap: 3, padding: "8px 10px", borderRadius: 7, background: "rgba(255,255,255,0.055)", color: "#f8fafc", fontSize: "10.5pt" }}>
            {scheme.finalAnswers.map((answer) => (
              <div key={`${answer.partLabel}-${answer.normalisedAnswer}`}>
                {answer.partLabel ? `(${answer.partLabel}) ` : ""}{answer.normalisedAnswer}
              </div>
            ))}
          </div>
        </section>

        {showDetail ? (
          <section>
            <SectionTitle>Marking + worked answer</SectionTitle>
            <MarkingDetail scheme={scheme} />
          </section>
        ) : null}

        <details style={{ borderTop: "1px solid rgba(148,163,184,0.10)", paddingTop: 5 }}>
          <summary style={{ cursor: "pointer", color: "#64748b", fontSize: 9, fontWeight: 700 }}>Raw generated pair</summary>
          <pre style={{ marginTop: 6, maxHeight: 420, overflow: "auto", padding: 8, borderRadius: 7, background: "rgba(0,0,0,0.28)", color: "#94a3b8", fontSize: 8, lineHeight: 1.35, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {JSON.stringify({ question, markingScheme: scheme }, null, 2)}
          </pre>
        </details>
      </div>
    </article>
  );
}

export default function A7SqaGeneratorTesterPage() {
  const [family, setFamily] = useState<FamilyControl>("MIX");
  const [paper, setPaper] = useState<A7GeneratorPaper>("P1");
  const [difficulty, setDifficulty] = useState<DifficultyControl>("MIX");
  const [sampleCount, setSampleCount] = useState<number>(10);
  const [nextSeed, setNextSeed] = useState<number>(29001);
  const [lastStartSeed, setLastStartSeed] = useState<number | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [dirty, setDirty] = useState(false);

  const selectedFamily = useMemo(
    () => FAMILY_OPTIONS.find((option) => option.value === family) ?? FAMILY_OPTIONS[0],
    [family],
  );
  const supportedPapers = selectedFamily.papers;

  useEffect(() => {
    if (!supportedPapers.includes(paper)) {
      setPaper(supportedPapers[0] ?? "P1");
      setDirty(true);
    }
    if (family === "CONTEXT_AREA_EQUALITY" && difficulty === 1) {
      setDifficulty(2);
      setDirty(true);
    }
  }, [difficulty, family, paper, supportedPapers]);

  function generateSamples(startSeed: number, count = sampleCount): Sample[] {
    try {
      const pairs = generateA7AssessmentBatch(count, {
        seed: startSeed,
        paper,
        ...(family === "MIX" ? {} : { family }),
        ...(difficulty === "MIX" ? {} : { difficulty }),
        includeExperimentalFamilies: true,
      });
      return pairs.map((pair, index) => ({
        id: `${pair.question.instanceId}-${index}`,
        seed: pair.question.seed,
        question: pair.question,
        markingScheme: pair.markingScheme,
      }));
    } catch (error) {
      return [{
        id: `A7-error-${startSeed}`,
        seed: startSeed,
        error: error instanceof Error ? error.stack ?? error.message : String(error),
      }];
    }
  }

  function generateNextBatch() {
    const startSeed = nextSeed;
    setSamples(generateSamples(startSeed));
    setLastStartSeed(startSeed);
    setNextSeed(startSeed + sampleCount);
    setDirty(false);
  }

  useEffect(() => {
    const startSeed = 29001;
    setSamples(generateSamples(startSeed, 10));
    setLastStartSeed(startSeed);
    setNextSeed(startSeed + 10);
    // Initial visual QA set only. Later batches are explicit and reproducible.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const failed = samples.filter((sample) => Boolean(sample.error)).length;
  const fractional = samples.filter((sample) => sample.question?.family === "FRACTIONAL_COEFFICIENT").length;
  const contextual = samples.filter((sample) => sample.question?.family === "CONTEXT_AREA_EQUALITY").length;
  const difficulty1 = samples.filter((sample) => sample.question?.difficulty === 1).length;
  const difficulty2 = samples.filter((sample) => sample.question?.difficulty === 2).length;

  const controlStyle = {
    height: 32,
    padding: "0 8px",
    border: "1px solid rgba(148,163,184,0.26)",
    borderRadius: 7,
    background: "#111827",
    color: "#f8fafc",
    fontSize: 11,
  } as const;

  return (
    <main style={{ minHeight: "100vh", padding: 16, background: "#070a10", color: "#f8fafc", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        .a7-sqa-preview .katex-display {
          margin: 0 !important;
          text-align: center !important;
          overflow: visible !important;
        }
        .a7-sqa-preview .katex-display > .katex {
          text-align: center !important;
        }
        .a7-sqa-preview .katex {
          font-size: 1.08em;
        }
      `}</style>

      <div style={{ width: "min(1780px, 100%)", margin: "0 auto" }}>
        <section style={{ display: "flex", alignItems: "end", gap: 8, flexWrap: "wrap", padding: 10, marginBottom: 8, border: "1px solid rgba(148,163,184,0.18)", borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
          <Label>
            A7 family
            <select value={family} onChange={(event) => { setFamily(event.target.value as FamilyControl); setDirty(true); }} style={{ ...controlStyle, minWidth: 220 }}>
              {FAMILY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </Label>

          <Label>
            Paper
            <select value={paper} onChange={(event) => { setPaper(event.target.value as A7GeneratorPaper); setDirty(true); }} style={controlStyle}>
              {supportedPapers.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </Label>

          <Label>
            Difficulty
            <select
              value={difficulty}
              onChange={(event) => {
                const value = event.target.value;
                setDifficulty(value === "MIX" ? "MIX" : Number(value) as A7GeneratorDifficulty);
                setDirty(true);
              }}
              style={{ ...controlStyle, minWidth: 150 }}
            >
              <option value="MIX">Calibrated mix</option>
              <option value="1">Band 1 · lower</option>
              <option value="2">Band 2 · upper</option>
            </select>
          </Label>

          <Label>
            Samples
            <select value={sampleCount} onChange={(event) => { setSampleCount(Number(event.target.value)); setDirty(true); }} style={controlStyle}>
              {SAMPLE_COUNTS.map((count) => <option key={count} value={count}>{count}</option>)}
            </select>
          </Label>

          <Label>
            Next batch seed
            <input type="number" value={nextSeed} onChange={(event) => { setNextSeed(Number(event.target.value) || 1); setDirty(true); }} style={{ ...controlStyle, width: 110 }} />
          </Label>

          <button type="button" onClick={generateNextBatch} style={{ height: 32, padding: "0 14px", border: "1px solid rgba(96,165,250,0.52)", borderRadius: 7, background: "rgba(59,130,246,0.18)", color: "#dbeafe", cursor: "pointer", fontSize: 11, fontWeight: 800 }}>
            Generate next batch
          </button>

          <button type="button" onClick={() => setShowDetail((value) => !value)} style={{ height: 32, padding: "0 13px", border: "1px solid rgba(148,163,184,0.28)", borderRadius: 7, background: showDetail ? "rgba(255,255,255,0.055)" : "rgba(16,185,129,0.10)", color: showDetail ? "#cbd5e1" : "#a7f3d0", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>
            {showDetail ? "Hide answer detail" : "Show marking + worked answer"}
          </button>

          <div style={{ marginLeft: "auto", display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
            {dirty ? <Chip emphasis>Controls changed · generate</Chip> : null}
            {lastStartSeed !== null ? <Chip>batch source {lastStartSeed}</Chip> : null}
            <Chip>{samples.length} generated</Chip>
            <Chip>{failed} errors</Chip>
            <Chip>{fractional} fractional</Chip>
            <Chip>{contextual} context</Chip>
            <Chip>{difficulty1} D1</Chip>
            <Chip>{difficulty2} D2</Chip>
          </div>
        </section>

        <section style={{ marginBottom: 10, padding: "8px 10px", border: "1px solid rgba(96,165,250,0.18)", borderRadius: 8, background: "rgba(59,130,246,0.04)", color: "#bfdbfe", fontSize: 10, lineHeight: 1.45 }}>
          A7 QA now tests two separate things at once: SQA-like surface fidelity and route-based difficulty. Band 1 keeps the written arithmetic compact; Band 2 permits more LCD/bracket/coefficient work, but displayed denominators remain at most 10 and LCD at most 15. Batch generation rejects duplicate displayed questions.
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 760px), 1fr))", gap: 12 }}>
          {samples.map((sample, index) => (
            <SampleCard key={sample.id} sample={sample} index={index} showDetail={showDetail} />
          ))}
        </section>
      </div>
    </main>
  );
}
