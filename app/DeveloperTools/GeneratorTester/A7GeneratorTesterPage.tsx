"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import PaperContent from "@/app/UI/Documents/Components/PaperContent";
import {
  formatHistoricalQuestionReferenceLabel,
} from "../../Courses/National5Maths/CatalogCoreTypes";
import {
  type A7GeneratedQuestion,
  type A7GeneratorFamily,
  type A7GeneratorPaper,
} from "../../Courses/National5Maths/03_QuestionGeneration/02-Algebraic/ALG-A7-LinearEquations";
import {
  generateA7AssessmentPair,
  type A7GeneratedMarkingScheme,
} from "../../Courses/National5Maths/04_AnswerGeneration/02-Algebraic/ALG-A7-LinearEquations";
import A7AreaPreview from "./A7AreaPreview";

type FamilyControl = "MIX" | A7GeneratorFamily;

type A7DeveloperSample = {
  id: string;
  seed: number;
  question?: A7GeneratedQuestion;
  markingScheme?: A7GeneratedMarkingScheme;
  error?: string;
};

const SAMPLE_COUNTS = [1, 5, 10, 20, 50] as const;

const FAMILY_OPTIONS: { value: FamilyControl; label: string; papers: A7GeneratorPaper[] }[] = [
  {
    value: "MIX",
    label: "Calibrated mix — observed family distribution",
    papers: ["P1", "P2"],
  },
  {
    value: "FRACTIONAL_COEFFICIENT",
    label: "Fractional-coefficient equation — core",
    papers: ["P1", "P2"],
  },
  {
    value: "CONTEXT_AREA_EQUALITY",
    label: "Equal-area contextual equation — experimental",
    papers: ["P1"],
  },
];

function Chip({ children, emphasis = false }: { children: ReactNode; emphasis?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 22,
        padding: "2px 8px",
        border: emphasis
          ? "1px solid rgba(96,165,250,0.46)"
          : "1px solid rgba(148,163,184,0.24)",
        borderRadius: 999,
        background: emphasis ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.045)",
        color: emphasis ? "#bfdbfe" : "#cbd5e1",
        fontSize: 10,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
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

function ControlLabel({ children }: { children: ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 4, color: "#cbd5e1", fontSize: 11, fontWeight: 700 }}>
      {children}
    </label>
  );
}

function asTextParts(text: string): PaperPart[] {
  return [{ kind: "text", value: text }];
}

function sourceReference(question: A7GeneratedQuestion) {
  const id = question.sourceBasis.historicalReference.primaryQuestionCatalogId;
  return id ? formatHistoricalQuestionReferenceLabel(id) : null;
}

function QuestionPreview({ question }: { question: A7GeneratedQuestion }) {
  if (question.family === "CONTEXT_AREA_EQUALITY") {
    return (
      <div style={{ display: "grid", gap: 10 }}>
        <PaperContent parts={[question.promptParts[0]]} />
        <A7AreaPreview visual={question.visual} />
        {question.promptSections.map((section) => (
          <div
            key={section.label}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 34px",
              gap: 12,
              alignItems: "start",
            }}
          >
            <div>
              <strong>({section.label})</strong> {section.text}
            </div>
            <div style={{ textAlign: "right", fontWeight: 700 }}>{section.marks}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 34px",
        gap: 12,
        alignItems: "start",
      }}
    >
      <PaperContent parts={question.promptParts} />
      <div style={{ textAlign: "right", fontWeight: 700 }}>{question.marks}</div>
    </div>
  );
}

function MarkingScheme({ scheme }: { scheme: A7GeneratedMarkingScheme }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <Chip emphasis>{scheme.profileId.replaceAll("_", " ")}</Chip>
        <Chip>{scheme.markProfile.replaceAll("_", " ")}</Chip>
        <Chip>{scheme.workingPolicy.unsupportedCorrectAnswerTreatment.replaceAll("_", " ")}</Chip>
        {scheme.workingPolicy.excludedPrototypeMethods.map((method) => (
          <Chip key={method}>exclude {method.replaceAll("_", " ")}</Chip>
        ))}
      </div>

      <div
        style={{
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          background: "#ffffff",
          color: "#111827",
          fontFamily: '"Trebuchet MS", Trebuchet, Arial, sans-serif',
        }}
      >
        {scheme.markPoints.map((mark, index) => (
          <div
            key={`${mark.markNumber}-${mark.role}`}
            style={{
              display: "grid",
              gridTemplateColumns: "58px 148px minmax(0, 1fr)",
              borderTop: index === 0 ? "none" : "1px solid #e5e7eb",
              minHeight: 58,
            }}
          >
            <div
              style={{
                padding: "9px 8px",
                borderRight: "1px solid #e5e7eb",
                fontSize: 10,
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              {mark.partLabel ? `(${mark.partLabel}) ` : ""}m{mark.markNumber}
            </div>
            <div
              style={{
                padding: "9px 8px",
                borderRight: "1px solid #e5e7eb",
                fontSize: 9,
                fontWeight: 800,
                lineHeight: 1.3,
              }}
            >
              {mark.role.replaceAll("_", " ")}
              <div style={{ marginTop: 4, color: "#64748b", fontWeight: 600 }}>
                {mark.standard} · {mark.thinking === "REASONING" ? "Reasoning" : "Operational"}
              </div>
            </div>
            <div style={{ padding: "9px 10px", fontSize: 10, lineHeight: 1.42 }}>
              <div style={{ fontWeight: 700 }}>{mark.requirement}</div>
              {mark.evidenceExamples.length ? (
                <div style={{ marginTop: 4 }}><strong>Evidence:</strong> {mark.evidenceExamples.join("; ")}</div>
              ) : null}
              {mark.acceptanceNotes.length ? (
                <div style={{ marginTop: 4, color: "#475569" }}><strong>Accept:</strong> {mark.acceptanceNotes.join(" ")}</div>
              ) : null}
              {mark.blockingConditions.length ? (
                <div style={{ marginTop: 4, color: "#991b1b" }}><strong>Do not award when:</strong> {mark.blockingConditions.join(" ")}</div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkedAnswers({ scheme }: { scheme: A7GeneratedMarkingScheme }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {scheme.methods.map((method) => (
        <div
          key={method.methodFamilyId}
          style={{
            overflow: "hidden",
            border: "1px solid rgba(96,165,250,0.36)",
            borderRadius: 8,
            background: "rgba(59,130,246,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              padding: "6px 8px",
              borderBottom: "1px solid rgba(148,163,184,0.14)",
            }}
          >
            <strong style={{ color: "#e2e8f0", fontSize: 10 }}>
              {method.methodFamilyId.replaceAll("_", " ")}
            </strong>
            <span style={{ color: "#64748b", fontSize: 9 }}>validated route</span>
          </div>
          <div
            style={{
              display: "grid",
              gap: 6,
              padding: 10,
              background: "#ffffff",
              color: "#111827",
              fontFamily: '"Trebuchet MS", Trebuchet, Arial, sans-serif',
              fontSize: "10.5pt",
              lineHeight: 1.45,
            }}
          >
            {method.lines.map((line) => (
              <div
                key={line.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) auto",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <PaperContent parts={asTextParts(line.text)} />
                {line.markNumbers.length ? (
                  <span style={{ color: "#64748b", fontSize: 9 }}>m{line.markNumbers.join(",")}</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SampleCard({
  sample,
  index,
  showAnswerDetail,
}: {
  sample: A7DeveloperSample;
  index: number;
  showAnswerDetail: boolean;
}) {
  if (sample.error) {
    return (
      <article style={{ border: "1px solid rgba(248,113,113,0.42)", borderRadius: 10, padding: 10, background: "rgba(127,29,29,0.12)" }}>
        <strong style={{ color: "#fca5a5", fontSize: 11 }}>Sample {index + 1} failed — seed {sample.seed}</strong>
        <pre style={{ whiteSpace: "pre-wrap", color: "#fecaca", fontSize: 9 }}>{sample.error}</pre>
      </article>
    );
  }

  if (!sample.question || !sample.markingScheme) return null;
  const { question, markingScheme } = sample;
  const reference = sourceReference(question);

  return (
    <article
      style={{
        overflow: "hidden",
        border: "1px solid rgba(148,163,184,0.18)",
        borderRadius: 10,
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: "7px 10px",
          borderBottom: "1px solid rgba(148,163,184,0.14)",
        }}
      >
        <strong style={{ fontSize: 11, color: "#e2e8f0" }}>Sample {index + 1} · seed {sample.seed}</strong>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Chip>{question.marks} marks</Chip>
          <Chip>{question.standard}</Chip>
          <Chip>{question.thinking === "REASONING" ? "Reasoning" : "Operational"}</Chip>
          <Chip>{question.paper}</Chip>
          <Chip>{question.family.replaceAll("_", " ")}</Chip>
          <Chip>{question.familyReadiness}</Chip>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12, padding: 10 }}>
        <section>
          <SectionLabel>Question preview</SectionLabel>
          <div
            className="a7-question-preview"
            style={{
              padding: "16px 18px",
              borderRadius: 7,
              background: "#ffffff",
              color: "#111111",
              fontFamily: '"Trebuchet MS", Trebuchet, Arial, sans-serif',
              fontSize: "11pt",
              lineHeight: 1.45,
            }}
          >
            <QuestionPreview question={question} />
          </div>
        </section>

        <section>
          <SectionLabel>Teacher trust reference</SectionLabel>
          <div
            style={{
              display: "flex",
              gap: 7,
              flexWrap: "wrap",
              alignItems: "center",
              padding: "8px 10px",
              border: "1px solid rgba(96,165,250,0.22)",
              borderRadius: 7,
              background: "rgba(59,130,246,0.055)",
              color: "#dbeafe",
              fontSize: 10,
            }}
          >
            <strong>{reference ? `See ${reference}` : "No primary historical reference"}</strong>
            {question.sourceBasis.historicalReference.matchReasons.map((reason) => (
              <Chip key={reason}>{reason.replaceAll("_", " ").toLowerCase()}</Chip>
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>Final answer</SectionLabel>
          <div
            style={{
              display: "grid",
              gap: 3,
              padding: "8px 10px",
              borderRadius: 7,
              background: "rgba(255,255,255,0.055)",
              color: "#f8fafc",
              fontSize: "10.5pt",
            }}
          >
            {markingScheme.finalAnswers.map((answer) => (
              <div key={`${answer.partLabel}-${answer.normalisedAnswer}`}>
                {answer.partLabel ? `(${answer.partLabel}) ` : ""}{answer.normalisedAnswer}
              </div>
            ))}
          </div>
        </section>

        {showAnswerDetail ? (
          <>
            <section>
              <SectionLabel>Marking scheme</SectionLabel>
              <MarkingScheme scheme={markingScheme} />
            </section>
            <section>
              <SectionLabel>Worked answer</SectionLabel>
              <WorkedAnswers scheme={markingScheme} />
            </section>
          </>
        ) : null}

        <details style={{ borderTop: "1px solid rgba(148,163,184,0.10)", paddingTop: 5 }}>
          <summary style={{ cursor: "pointer", color: "#64748b", fontSize: 9, fontWeight: 700 }}>Raw generated pair</summary>
          <pre
            style={{
              marginTop: 6,
              marginBottom: 0,
              maxHeight: 440,
              overflow: "auto",
              padding: 8,
              borderRadius: 7,
              background: "rgba(0,0,0,0.28)",
              color: "#94a3b8",
              fontSize: 8,
              lineHeight: 1.35,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {JSON.stringify({ question, markingScheme }, null, 2)}
          </pre>
        </details>
      </div>
    </article>
  );
}

export default function A7GeneratorTesterPage() {
  const [family, setFamily] = useState<FamilyControl>("MIX");
  const [paper, setPaper] = useState<A7GeneratorPaper>("P1");
  const [sampleCount, setSampleCount] = useState<number>(10);
  const [nextSeed, setNextSeed] = useState<number>(27001);
  const [lastStartSeed, setLastStartSeed] = useState<number | null>(null);
  const [showAnswerDetail, setShowAnswerDetail] = useState(false);
  const [samples, setSamples] = useState<A7DeveloperSample[]>([]);
  const [controlsDirty, setControlsDirty] = useState(false);

  const selectedFamilyOption = useMemo(
    () => FAMILY_OPTIONS.find((option) => option.value === family) ?? FAMILY_OPTIONS[0],
    [family],
  );
  const supportedPapers = selectedFamilyOption.papers;

  useEffect(() => {
    if (!supportedPapers.includes(paper)) {
      setPaper(supportedPapers[0] ?? "P1");
      setControlsDirty(true);
    }
  }, [paper, supportedPapers]);

  function buildSamples(startSeed: number, count = sampleCount): A7DeveloperSample[] {
    return Array.from({ length: count }, (_, index) => {
      const seed = startSeed + index;
      try {
        const pair = generateA7AssessmentPair({
          seed,
          paper,
          ...(family === "MIX" ? {} : { family }),
          includeExperimentalFamilies: true,
        });
        return {
          id: `${pair.question.instanceId}-${index}`,
          seed,
          question: pair.question,
          markingScheme: pair.markingScheme,
        };
      } catch (error) {
        return {
          id: `A7-error-${seed}-${index}`,
          seed,
          error: error instanceof Error ? error.stack ?? error.message : String(error),
        };
      }
    });
  }

  function generateNextBatch() {
    const startSeed = nextSeed;
    setSamples(buildSamples(startSeed));
    setLastStartSeed(startSeed);
    setNextSeed(startSeed + sampleCount);
    setControlsDirty(false);
  }

  useEffect(() => {
    const startSeed = 27001;
    setSamples(buildSamples(startSeed, 10));
    setLastStartSeed(startSeed);
    setNextSeed(startSeed + 10);
    // Generate the initial review set once. Later batches are explicit so seed
    // ranges remain easy to reproduce during teacher moderation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const failedCount = samples.filter((sample) => Boolean(sample.error)).length;
  const fractionalCount = samples.filter((sample) => sample.question?.family === "FRACTIONAL_COEFFICIENT").length;
  const contextCount = samples.filter((sample) => sample.question?.family === "CONTEXT_AREA_EQUALITY").length;

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
    <main
      style={{
        minHeight: "100vh",
        padding: 16,
        background: "#070a10",
        color: "#f8fafc",
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      <style>{`
        .a7-question-preview .katex-display {
          margin: 10px 0 12px 30px !important;
          text-align: left !important;
        }
        .a7-question-preview .katex-display > .katex {
          text-align: left !important;
        }
      `}</style>

      <div style={{ width: "min(1600px, 100%)", margin: "0 auto" }}>
        <section
          style={{
            display: "flex",
            alignItems: "end",
            gap: 8,
            flexWrap: "wrap",
            padding: 10,
            marginBottom: 8,
            border: "1px solid rgba(148,163,184,0.18)",
            borderRadius: 10,
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <ControlLabel>
            A7 family
            <select
              value={family}
              onChange={(event) => {
                setFamily(event.target.value as FamilyControl);
                setControlsDirty(true);
              }}
              style={{ ...controlStyle, minWidth: 330 }}
            >
              {FAMILY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </ControlLabel>

          <ControlLabel>
            Paper
            <select
              value={paper}
              onChange={(event) => {
                setPaper(event.target.value as A7GeneratorPaper);
                setControlsDirty(true);
              }}
              style={controlStyle}
            >
              {supportedPapers.map((paperOption) => (
                <option key={paperOption} value={paperOption}>{paperOption}</option>
              ))}
            </select>
          </ControlLabel>

          <ControlLabel>
            Samples
            <select
              value={sampleCount}
              onChange={(event) => {
                setSampleCount(Number(event.target.value));
                setControlsDirty(true);
              }}
              style={controlStyle}
            >
              {SAMPLE_COUNTS.map((count) => <option key={count} value={count}>{count}</option>)}
            </select>
          </ControlLabel>

          <ControlLabel>
            Next batch seed
            <input
              type="number"
              value={nextSeed}
              onChange={(event) => {
                setNextSeed(Number(event.target.value) || 1);
                setControlsDirty(true);
              }}
              style={{ ...controlStyle, width: 110 }}
            />
          </ControlLabel>

          <button
            type="button"
            onClick={generateNextBatch}
            style={{
              height: 32,
              padding: "0 14px",
              border: "1px solid rgba(96,165,250,0.52)",
              borderRadius: 7,
              background: "rgba(59,130,246,0.18)",
              color: "#dbeafe",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            Generate next batch
          </button>

          <button
            type="button"
            onClick={() => setShowAnswerDetail((value) => !value)}
            style={{
              height: 32,
              padding: "0 13px",
              border: "1px solid rgba(148,163,184,0.28)",
              borderRadius: 7,
              background: showAnswerDetail ? "rgba(255,255,255,0.055)" : "rgba(16,185,129,0.10)",
              color: showAnswerDetail ? "#cbd5e1" : "#a7f3d0",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {showAnswerDetail ? "Hide answer detail" : "Show marking + worked answer"}
          </button>

          <div style={{ marginLeft: "auto", display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
            {controlsDirty ? <Chip emphasis>Controls changed — generate</Chip> : null}
            {lastStartSeed !== null ? <Chip>batch {lastStartSeed}–{lastStartSeed + Math.max(samples.length - 1, 0)}</Chip> : null}
            <Chip>{samples.length} generated</Chip>
            <Chip>{failedCount} errors</Chip>
            <Chip>{fractionalCount} fractional</Chip>
            <Chip>{contextCount} context</Chip>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gap: 3,
            marginBottom: 10,
            padding: "8px 10px",
            border: "1px solid rgba(148,163,184,0.12)",
            borderRadius: 8,
            color: "#94a3b8",
            fontSize: 10,
            lineHeight: 1.4,
          }}
        >
          <div>• This page calls the real A7 Question Generator and Answer Generator together; a visible sample has passed both validators.</div>
          <div>• No artificial difficulty slider is shown because the reviewed A7 corpus does not yet support a defensible numeric difficulty ladder.</div>
          <div>• P1 calibrated mix follows the observed weak prior; P2 currently generates only the historically supported fractional family.</div>
          <div>• Equal-area questions are still experimental and remain restricted to the reviewed triangle-versus-rectangle structure.</div>
          <div>• The historical-reference strip previews the future teacher-facing “See N5 Maths …” confidence feature before Builder wiring.</div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 560px), 1fr))",
            gap: 10,
          }}
        >
          {samples.map((sample, index) => (
            <SampleCard key={sample.id} sample={sample} index={index} showAnswerDetail={showAnswerDetail} />
          ))}
        </section>
      </div>
    </main>
  );
}
