"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import PaperContent from "@/app/UI/Documents/Components/PaperContent";
import {
  getN2MechanismProfile,
} from "../../Courses/National5Maths/04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Calibration";
import {
  N2_GENERATOR_DIFFICULTY_BANDS,
} from "../../Courses/National5Maths/04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Evidence";
import {
  generateN2Question,
} from "../../Courses/National5Maths/04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Generator";
import type {
  N2GeneratedQuestion,
  N2GeneratorDifficulty,
  N2GeneratorMechanism,
  N2GeneratorPaper,
} from "../../Courses/National5Maths/04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";
import {
  generateN2Answer,
} from "../../Courses/National5Maths/05_AnswerGeneration/01-Numerical/NUM-N2-Indices/Generator";
import type {
  N2GeneratedMarkingScheme,
} from "../../Courses/National5Maths/05_AnswerGeneration/01-Numerical/NUM-N2-Indices/Types";

type SelectedMechanism = "CALIBRATED_MIX" | N2GeneratorMechanism;

type GeneratedN2Sample = {
  id: string;
  seed: number;
  question?: N2GeneratedQuestion;
  answer?: N2GeneratedMarkingScheme;
  error?: string;
};

const SAMPLE_COUNT_OPTIONS = [1, 5, 10, 20, 50] as const;

const MECHANISM_OPTIONS: readonly {
  value: SelectedMechanism;
  label: string;
}[] = [
  { value: "CALIBRATED_MIX", label: "Calibrated mix" },
  { value: "FRACTIONAL_NUMERIC_EVALUATION", label: "Fractional index evaluation" },
  { value: "SQUARED_FRACTIONAL_MONOMIAL", label: "Squared fractional monomial" },
  { value: "DISTRIBUTIVE_INDEX_EXPANSION", label: "Distributive index expansion" },
  { value: "PRODUCT_QUOTIENT_WITH_COEFFICIENT", label: "Product/quotient with coefficient" },
  { value: "POWER_OF_POWER_WITH_NEGATIVE_INDEX", label: "Power of a power with negative index" },
  { value: "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX", label: "Reciprocal root to negative fractional index" },
  { value: "PRODUCT_OVER_ROOT", label: "Product over root" },
  { value: "NEGATIVE_INDEX_QUOTIENT", label: "Negative-index quotient" },
  { value: "POSITIVE_POWER_PRODUCT_QUOTIENT", label: "Positive power/product/quotient" },
] as const;

const formatToken = (value: string) => value.replaceAll("_", " ");

const asMathParts = (latex: string): PaperPart[] => [{
  kind: "math",
  latex,
  displayMode: false,
}];

function Chip({ children, emphasis = false }: { children: ReactNode; emphasis?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 22,
        padding: "2px 8px",
        border: emphasis
          ? "1px solid rgba(251,191,36,0.42)"
          : "1px solid rgba(148,163,184,0.22)",
        borderRadius: 999,
        background: emphasis ? "rgba(245,158,11,0.10)" : "rgba(255,255,255,0.045)",
        color: emphasis ? "#fde68a" : "#cbd5e1",
        fontSize: 10,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function ControlLabel({ children }: { children: ReactNode }) {
  return (
    <label
      style={{
        display: "grid",
        gap: 4,
        color: "#cbd5e1",
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {children}
    </label>
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

function MarkingSchemePreview({ answer }: { answer: N2GeneratedMarkingScheme }) {
  const policyNotes = [
    `Answer only: ${formatToken(answer.workingPolicy.correctAnswerWithoutWorking)}`,
    answer.workingPolicy.workingRequired ? "Working required" : "Working not required",
    answer.workingPolicy.equivalentRoutesAccepted ? "Equivalent routes accepted" : "Profile route only",
    answer.presentationPolicy.positivePowerOutputRequired ? "Positive-power output required" : null,
    answer.presentationPolicy.exactIntegerRequired ? "Exact integer required" : null,
    answer.presentationPolicy.exactFormRequired ? "Exact form required" : null,
    answer.presentationPolicy.singlePowerOfBaseRequired ? "Single power of base required" : null,
    answer.presentationPolicy.coefficientFractionReduced ? "Coefficient fraction must be reduced" : null,
    answer.presentationPolicy.fullSimplificationRequired ? "Full simplification required" : null,
  ].filter((entry): entry is string => Boolean(entry));

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          alignItems: "center",
          padding: "7px 8px",
          border: "1px solid rgba(148,163,184,0.18)",
          borderRadius: 8,
          background: "rgba(255,255,255,0.025)",
        }}
      >
        <Chip emphasis>{formatToken(answer.profileId)}</Chip>
        <Chip>{formatToken(answer.markProfile)}</Chip>
        {policyNotes.map((note) => <Chip key={note}>{note}</Chip>)}
      </div>

      <div
        style={{
          overflow: "hidden",
          border: "1px solid rgba(148,163,184,0.18)",
          borderRadius: 8,
          background: "#ffffff",
          color: "#111827",
          fontFamily: '"Trebuchet MS", Trebuchet, Arial, sans-serif',
        }}
      >
        {answer.markPoints.map((mark, index) => (
          <div
            key={`${mark.markNumber}-${mark.role}`}
            style={{
              display: "grid",
              gridTemplateColumns: "58px 136px minmax(0, 1fr)",
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
              m{mark.markNumber}
              <div style={{ marginTop: 3, color: "#64748b", fontSize: 8 }}>
                {mark.standard}
              </div>
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
              {formatToken(mark.role)}
              <div style={{ marginTop: 4, color: "#64748b", fontSize: 8 }}>
                {formatToken(mark.type)}
              </div>
            </div>
            <div style={{ padding: "9px 10px", fontSize: 10, lineHeight: 1.42 }}>
              <div style={{ fontWeight: 700 }}>{mark.requirement}</div>
              {mark.evidenceExamples.length ? (
                <div style={{ marginTop: 4 }}>
                  <strong>Evidence:</strong> {mark.evidenceExamples.join("; ")}
                </div>
              ) : null}
              {mark.acceptanceNotes.length ? (
                <div style={{ marginTop: 4, color: "#475569" }}>
                  <strong>Accept:</strong> {mark.acceptanceNotes.join(" ")}
                </div>
              ) : null}
              {mark.blockingConditions.length ? (
                <div style={{ marginTop: 4, color: "#991b1b" }}>
                  <strong>Do not award when:</strong> {mark.blockingConditions.join(" ")}
                </div>
              ) : null}
              {mark.dependsOnMarkNumbers.length || mark.followThroughFromMarkNumbers.length ? (
                <div style={{ marginTop: 4, color: "#64748b" }}>
                  {mark.dependsOnMarkNumbers.length
                    ? `Depends on m${mark.dependsOnMarkNumbers.join(", m")}. `
                    : ""}
                  {mark.followThroughFromMarkNumbers.length
                    ? `Follow-through from m${mark.followThroughFromMarkNumbers.join(", m")}.`
                    : ""}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div style={{ color: "#64748b", fontSize: 9, lineHeight: 1.4 }}>
        Profile anchors: {answer.profileSourceAnchorIds.join(", ")}
      </div>
    </div>
  );
}

function WorkedAnswers({ answer }: { answer: N2GeneratedMarkingScheme }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {answer.methods.map((method, methodIndex) => {
        const isDefault = method.methodFamilyId === answer.defaultMethodFamilyId;
        return (
          <div
            key={`${method.methodFamilyId}-${methodIndex}`}
            style={{
              border: isDefault
                ? "1px solid rgba(96,165,250,0.46)"
                : "1px solid rgba(148,163,184,0.18)",
              borderRadius: 8,
              overflow: "hidden",
              background: isDefault ? "rgba(59,130,246,0.045)" : "rgba(255,255,255,0.02)",
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
                {isDefault ? "Preferred route" : "Alternative route"} — {formatToken(method.methodFamilyId)}
              </strong>
              <span style={{ color: "#64748b", fontSize: 9 }}>validated route</span>
            </div>

            <div
              style={{
                padding: 10,
                background: "#ffffff",
                color: "#111827",
                fontFamily: '"Trebuchet MS", Trebuchet, Arial, sans-serif',
                fontSize: "10.5pt",
                lineHeight: 1.45,
              }}
            >
              <div style={{ display: "grid", gap: 8 }}>
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
                    <div>
                      {line.latex
                        ? <PaperContent parts={asMathParts(line.latex)} />
                        : <PaperContent parts={[{ kind: "text", value: line.text }]} />}
                      {line.latex && line.text ? (
                        <div style={{ marginTop: 2, color: "#64748b", fontSize: 8.5 }}>
                          {line.text}
                        </div>
                      ) : null}
                    </div>
                    <span style={{ color: "#64748b", fontSize: 9, whiteSpace: "nowrap" }}>
                      m{line.markNumbers.join(",")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "5px 8px", color: "#64748b", fontSize: 8.5 }}>
              Evidence anchors: {method.sourceEvidenceIds.join(", ")}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SampleCard({
  sample,
  index,
  showAnswerDetail,
}: {
  sample: GeneratedN2Sample;
  index: number;
  showAnswerDetail: boolean;
}) {
  if (sample.error) {
    return (
      <article
        style={{
          border: "1px solid rgba(248,113,113,0.42)",
          borderRadius: 10,
          padding: 10,
          background: "rgba(127,29,29,0.12)",
        }}
      >
        <strong style={{ color: "#fca5a5", fontSize: 11 }}>
          Sample {index + 1} failed — seed {sample.seed}
        </strong>
        <pre style={{ whiteSpace: "pre-wrap", color: "#fecaca", fontSize: 9 }}>
          {sample.error}
        </pre>
      </article>
    );
  }

  const question = sample.question;
  const answer = sample.answer;
  if (!question || !answer) return null;

  return (
    <article
      style={{
        border: "1px solid rgba(148,163,184,0.18)",
        borderRadius: 10,
        overflow: "hidden",
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
        <strong style={{ fontSize: 11, color: "#e2e8f0" }}>
          Sample {index + 1} · seed {sample.seed}
        </strong>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "end" }}>
          <Chip emphasis>question PASS · answer PASS</Chip>
          <Chip>{question.paper}</Chip>
          <Chip>{question.marks} marks</Chip>
          <Chip>{question.standardProfile}</Chip>
          <Chip>L{question.difficulty}</Chip>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12, padding: 10 }}>
        <section>
          <SectionLabel>Question</SectionLabel>
          <div
            className="n2-question-preview"
            style={{
              padding: "14px 16px",
              borderRadius: 7,
              background: "#ffffff",
              color: "#111111",
              fontFamily: '"Trebuchet MS", Trebuchet, Arial, sans-serif',
              fontSize: "11pt",
              fontWeight: 400,
              lineHeight: 1.42,
            }}
          >
            <PaperContent parts={question.promptParts} />
          </div>
        </section>

        <section>
          <SectionLabel>Generated profile</SectionLabel>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            <Chip>{formatToken(question.family)}</Chip>
            <Chip>{formatToken(question.mechanism)}</Chip>
            <Chip>{formatToken(question.quality.difficultyBandId)}</Chip>
            <Chip>{formatToken(question.familyReadiness)} family</Chip>
            <Chip>{formatToken(question.mechanismReadiness)} mechanism</Chip>
            <Chip>{formatToken(question.quality.paperArithmeticProfile)}</Chip>
          </div>
          {question.quality.difficultySignals.length ? (
            <div style={{ marginTop: 6, color: "#94a3b8", fontSize: 9, lineHeight: 1.4 }}>
              Difficulty signals: {question.quality.difficultySignals.join("; ")}
            </div>
          ) : null}
        </section>

        <section>
          <SectionLabel>Final answer</SectionLabel>
          <div
            style={{
              padding: "8px 10px",
              borderRadius: 7,
              background: "rgba(255,255,255,0.055)",
              color: "#f8fafc",
              fontFamily: '"Trebuchet MS", Trebuchet, Arial, sans-serif',
              fontSize: "10.5pt",
              lineHeight: 1.4,
            }}
          >
            {answer.finalAnswers.map((finalAnswer, answerIndex) => (
              <div key={`${finalAnswer.partLabel}-${answerIndex}`}>
                <PaperContent parts={asMathParts(finalAnswer.latex)} />
                <div style={{ marginTop: 3, color: "#94a3b8", fontSize: 8.5 }}>
                  {finalAnswer.normalisedAnswer}
                </div>
              </div>
            ))}
          </div>
        </section>

        {showAnswerDetail ? (
          <>
            <section>
              <SectionLabel>Marking scheme</SectionLabel>
              <MarkingSchemePreview answer={answer} />
            </section>
            <section>
              <SectionLabel>Worked answer</SectionLabel>
              <WorkedAnswers answer={answer} />
            </section>
          </>
        ) : null}

        <details style={{ borderTop: "1px solid rgba(148,163,184,0.10)", paddingTop: 5 }}>
          <summary style={{ cursor: "pointer", color: "#64748b", fontSize: 9, fontWeight: 700 }}>
            Source basis + raw output
          </summary>
          <div style={{ marginTop: 6, color: "#94a3b8", fontSize: 8.5, lineHeight: 1.45 }}>
            Question anchors: {question.sourceBasis.questionCatalogIds.join(", ")}<br />
            Answer anchors: {question.sourceBasis.answerCatalogIds.join(", ")}<br />
            Calibration anchors: {question.quality.calibrationSourceAnchorIds.join(", ")}
          </div>
          <pre
            style={{
              marginTop: 6,
              marginBottom: 0,
              maxHeight: 420,
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
            {JSON.stringify({ question, answer }, null, 2)}
          </pre>
        </details>
      </div>
    </article>
  );
}

export default function N2GeneratorTesterPage() {
  const [selectedMechanism, setSelectedMechanism] = useState<SelectedMechanism>("CALIBRATED_MIX");
  const [difficulty, setDifficulty] = useState<N2GeneratorDifficulty>(1);
  const [paper, setPaper] = useState<N2GeneratorPaper>("P1");
  const [sampleCount, setSampleCount] = useState<number>(10);
  const [baseSeed, setBaseSeed] = useState<number>(24001);
  const [lastBatchStartSeed, setLastBatchStartSeed] = useState<number | null>(null);
  const [showAnswerDetail, setShowAnswerDetail] = useState(false);
  const [samples, setSamples] = useState<GeneratedN2Sample[]>([]);
  const [controlsDirty, setControlsDirty] = useState(false);

  const selectedProfile = useMemo(
    () => selectedMechanism === "CALIBRATED_MIX"
      ? null
      : getN2MechanismProfile(selectedMechanism),
    [selectedMechanism],
  );

  const supportedPapers = useMemo<readonly N2GeneratorPaper[]>(
    () => selectedProfile?.supportedPapers ?? (["P1", "P2"] as const),
    [selectedProfile],
  );

  const currentDifficulty = selectedProfile?.difficulty ?? difficulty;
  const currentDifficultyBand = N2_GENERATOR_DIFFICULTY_BANDS.find(
    (entry) => entry.difficulty === currentDifficulty,
  );

  useEffect(() => {
    if (!selectedProfile) return;
    setDifficulty(selectedProfile.difficulty);
    setPaper((currentPaper) => selectedProfile.supportedPapers.includes(currentPaper)
      ? currentPaper
      : selectedProfile.supportedPapers[0]);
  }, [selectedProfile]);

  function buildSamples(startSeed: number): GeneratedN2Sample[] {
    const effectiveDifficulty = selectedProfile?.difficulty ?? difficulty;
    const effectivePaper = supportedPapers.includes(paper) ? paper : supportedPapers[0];

    return Array.from({ length: sampleCount }, (_, index): GeneratedN2Sample => {
      const seed = startSeed + index;
      try {
        const question = generateN2Question({
          seed,
          difficulty: effectiveDifficulty,
          paper: effectivePaper,
          ...(selectedMechanism === "CALIBRATED_MIX"
            ? {}
            : { mechanism: selectedMechanism }),
        });
        const answer = generateN2Answer(question);
        return {
          id: `${question.instanceId}-${index}`,
          seed,
          question,
          answer,
        };
      } catch (error) {
        return {
          id: `error-${seed}-${index}`,
          seed,
          error: error instanceof Error ? error.stack ?? error.message : String(error),
        };
      }
    });
  }

  function generateNextBatch() {
    const startSeed = baseSeed;
    setSamples(buildSamples(startSeed));
    setLastBatchStartSeed(startSeed);
    setBaseSeed(startSeed + sampleCount);
    setControlsDirty(false);
  }

  useEffect(() => {
    const startSeed = 24001;
    setSamples(buildSamples(startSeed));
    setLastBatchStartSeed(startSeed);
    setBaseSeed(startSeed + 10);
    // Initial generation only; later batches deliberately move to new seeds.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const failedCount = samples.filter((sample) => Boolean(sample.error)).length;
  const successfulSamples = samples.filter(
    (sample): sample is GeneratedN2Sample & { question: N2GeneratedQuestion; answer: N2GeneratedMarkingScheme } =>
      Boolean(sample.question && sample.answer),
  );

  const mechanismCounts = successfulSamples.reduce<Record<string, number>>((counts, sample) => {
    counts[sample.question.mechanism] = (counts[sample.question.mechanism] ?? 0) + 1;
    return counts;
  }, {});

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
        .n2-question-preview .katex-display {
          margin: 10px 0 12px 30px !important;
          text-align: left !important;
        }
        .n2-question-preview .katex-display > .katex {
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
            N2 mechanism
            <select
              value={selectedMechanism}
              onChange={(event) => {
                setSelectedMechanism(event.target.value as SelectedMechanism);
                setControlsDirty(true);
              }}
              style={{ ...controlStyle, minWidth: 330 }}
            >
              {MECHANISM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </ControlLabel>

          <ControlLabel>
            Difficulty
            <select
              value={currentDifficulty}
              disabled={Boolean(selectedProfile)}
              onChange={(event) => {
                setDifficulty(Number(event.target.value) as N2GeneratorDifficulty);
                setControlsDirty(true);
              }}
              style={{ ...controlStyle, minWidth: 130, opacity: selectedProfile ? 0.62 : 1 }}
            >
              <option value={1}>Lower valid (L1)</option>
              <option value={2}>Upper valid (L2)</option>
            </select>
          </ControlLabel>

          <ControlLabel>
            Paper
            <select
              value={supportedPapers.includes(paper) ? paper : supportedPapers[0]}
              onChange={(event) => {
                setPaper(event.target.value as N2GeneratorPaper);
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
              {SAMPLE_COUNT_OPTIONS.map((count) => (
                <option key={count} value={count}>{count}</option>
              ))}
            </select>
          </ControlLabel>

          <ControlLabel>
            Next batch seed
            <input
              type="number"
              value={baseSeed}
              onChange={(event) => setBaseSeed(Number(event.target.value) || 1)}
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
            onClick={() => setShowAnswerDetail((current) => !current)}
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
            {lastBatchStartSeed !== null ? (
              <Chip>batch {lastBatchStartSeed}–{lastBatchStartSeed + Math.max(samples.length - 1, 0)}</Chip>
            ) : null}
            <Chip>{samples.length} generated</Chip>
            <Chip>{failedCount} errors</Chip>
            <Chip>{successfulSamples.length}/{samples.length} validated</Chip>
            <Chip>L{currentDifficulty}</Chip>
          </div>
        </section>

        {currentDifficultyBand ? (
          <section
            style={{
              marginBottom: 8,
              padding: "7px 10px",
              border: "1px solid rgba(96,165,250,0.18)",
              borderRadius: 8,
              background: "rgba(59,130,246,0.04)",
              color: "#bfdbfe",
              fontSize: 10,
              lineHeight: 1.4,
            }}
          >
            <strong>{formatToken(currentDifficultyBand.bandId)}:</strong>{" "}
            {currentDifficultyBand.description}
          </section>
        ) : null}

        <section
          style={{
            display: "flex",
            gap: 5,
            flexWrap: "wrap",
            marginBottom: 10,
            padding: "8px 10px",
            border: "1px solid rgba(148,163,184,0.12)",
            borderRadius: 8,
            color: "#94a3b8",
            fontSize: 10,
            lineHeight: 1.4,
          }}
        >
          <span style={{ marginRight: 3, fontWeight: 800 }}>Batch mechanisms:</span>
          {Object.entries(mechanismCounts).length
            ? Object.entries(mechanismCounts).map(([mechanism, count]) => (
                <Chip key={mechanism}>{formatToken(mechanism)} · {count}</Chip>
              ))
            : <span>none</span>}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 520px), 1fr))",
            gap: 10,
          }}
        >
          {samples.map((sample, index) => (
            <SampleCard
              key={sample.id}
              sample={sample}
              index={index}
              showAnswerDetail={showAnswerDetail}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
