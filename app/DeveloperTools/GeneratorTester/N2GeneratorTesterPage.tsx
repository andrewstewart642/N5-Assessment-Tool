"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import PaperContent from "@/app/UI/Documents/Components/PaperContent";
import { getN2MechanismProfile } from "../../Courses/National5Maths/04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Calibration";
import { N2_GENERATOR_DIFFICULTY_BANDS } from "../../Courses/National5Maths/04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Evidence";
import { generateN2Question } from "../../Courses/National5Maths/04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Generator";
import {
  N2_MECHANISMS_BY_SKILL,
  N2_SKILL_PARENT_LABEL,
  N2_SKILLS,
} from "../../Courses/National5Maths/04_QuestionGeneration/01-Numerical/NUM-N2-Indices/SkillLabels";
import type {
  N2GeneratedQuestion,
  N2GeneratorDifficulty,
  N2GeneratorMechanism,
  N2GeneratorPaper,
  N2GeneratorSkillId,
} from "../../Courses/National5Maths/04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";
import { generateN2Answer } from "../../Courses/National5Maths/05_AnswerGeneration/01-Numerical/NUM-N2-Indices/Generator";
import type { N2GeneratedMarkingScheme } from "../../Courses/National5Maths/05_AnswerGeneration/01-Numerical/NUM-N2-Indices/Types";
import {
  N2ExamAnswer,
  N2ExamQuestionPrompt,
} from "../../Courses/National5Maths/06_VisualAssets/01-Numerical/NUM-N2-Indices/N2ExamMath";

type SelectedSkill = "ALL" | N2GeneratorSkillId;
type SelectedMechanism = "MIX" | N2GeneratorMechanism;

type GeneratedN2Sample = {
  id: string;
  seed: number;
  question?: N2GeneratedQuestion;
  answer?: N2GeneratedMarkingScheme;
  error?: string;
};

const SAMPLE_COUNT_OPTIONS = [1, 5, 10, 20, 50] as const;
const PAPERS = ["P1", "P2"] as const;

const MECHANISM_OPTIONS: readonly { value: N2GeneratorMechanism; label: string; skillId: N2GeneratorSkillId }[] = [
  { value: "PRODUCT_QUOTIENT_WITH_COEFFICIENT", label: "Product/quotient with coefficient", skillId: "N2.1" },
  { value: "POWER_OF_POWER_WITH_NEGATIVE_INDEX", label: "Power of a power with negative index", skillId: "N2.1" },
  { value: "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX", label: "Reciprocal root to fractional index", skillId: "N2.1" },
  { value: "SQUARED_FRACTIONAL_MONOMIAL", label: "Squared fractional monomial", skillId: "N2.1" },
  { value: "PRODUCT_OVER_ROOT", label: "Product over root", skillId: "N2.1" },
  { value: "NEGATIVE_INDEX_QUOTIENT", label: "Negative-index quotient", skillId: "N2.1" },
  { value: "POSITIVE_POWER_PRODUCT_QUOTIENT", label: "Positive power/product/quotient", skillId: "N2.1" },
  { value: "DISTRIBUTIVE_INDEX_EXPANSION", label: "Distributive index expansion", skillId: "N2.2" },
  { value: "FRACTIONAL_NUMERIC_EVALUATION", label: "Fractional index evaluation", skillId: "N2.3" },
] as const;

const formatToken = (value: string) => value.replaceAll("_", " ");
const asMathParts = (latex: string): PaperPart[] => [{ kind: "math", latex, displayMode: false }];

function Chip({ children, emphasis = false }: { children: ReactNode; emphasis?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 22,
        padding: "2px 8px",
        border: emphasis ? "1px solid rgba(251,191,36,0.42)" : "1px solid rgba(148,163,184,0.22)",
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
    <label style={{ display: "grid", gap: 4, color: "#cbd5e1", fontSize: 11, fontWeight: 700 }}>
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

function AnswerDetail({ answer }: { answer: N2GeneratedMarkingScheme }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <section>
        <SectionLabel>Marking scheme</SectionLabel>
        <div style={{ display: "grid", gap: 6 }}>
          {answer.markPoints.map((mark) => (
            <div
              key={`${mark.markNumber}-${mark.role}`}
              style={{
                display: "grid",
                gridTemplateColumns: "58px minmax(0, 1fr)",
                overflow: "hidden",
                border: "1px solid rgba(148,163,184,0.18)",
                borderRadius: 7,
                background: "#ffffff",
                color: "#111827",
              }}
            >
              <div style={{ padding: 8, borderRight: "1px solid #e5e7eb", textAlign: "center", fontWeight: 800, fontSize: 10 }}>
                m{mark.markNumber}
                <div style={{ marginTop: 3, color: "#64748b", fontSize: 8 }}>{mark.standard}</div>
              </div>
              <div style={{ padding: "8px 10px", fontSize: 10, lineHeight: 1.4 }}>
                <strong>{formatToken(mark.role)}</strong> — {mark.requirement}
                {mark.acceptanceNotes.length ? (
                  <div style={{ marginTop: 3, color: "#64748b", fontSize: 9 }}>
                    Accept: {mark.acceptanceNotes.join(" ")}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>Worked answer</SectionLabel>
        <div style={{ display: "grid", gap: 7 }}>
          {answer.methods.map((method) => (
            <div
              key={method.methodFamilyId}
              style={{ overflow: "hidden", border: "1px solid rgba(148,163,184,0.18)", borderRadius: 7 }}
            >
              <div style={{ padding: "6px 8px", background: "rgba(255,255,255,0.04)", color: "#cbd5e1", fontSize: 9.5, fontWeight: 700 }}>
                {method.methodFamilyId === answer.defaultMethodFamilyId ? "Preferred" : "Alternative"} — {formatToken(method.methodFamilyId)}
              </div>
              <div className="n2-math-surface" style={{ display: "grid", gap: 8, padding: 10, background: "#ffffff", color: "#111827" }}>
                {method.lines.map((line) => (
                  <div key={line.id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 10, alignItems: "center" }}>
                    <div>
                      {line.latex
                        ? <PaperContent parts={asMathParts(line.latex)} />
                        : <PaperContent parts={[{ kind: "text", value: line.text }]} />}
                      {line.latex && line.text ? (
                        <div style={{ marginTop: 3, color: "#64748b", fontSize: 8.5 }}>{line.text}</div>
                      ) : null}
                    </div>
                    <span style={{ color: "#64748b", fontSize: 9 }}>m{line.markNumbers.join(",")}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SampleCard({ sample, index, showAnswerDetail }: { sample: GeneratedN2Sample; index: number; showAnswerDetail: boolean }) {
  if (sample.error) {
    return (
      <article style={{ border: "1px solid rgba(248,113,113,0.42)", borderRadius: 10, padding: 10, background: "rgba(127,29,29,0.12)" }}>
        <strong style={{ color: "#fca5a5", fontSize: 11 }}>Sample {index + 1} failed — seed {sample.seed}</strong>
        <pre style={{ whiteSpace: "pre-wrap", color: "#fecaca", fontSize: 9 }}>{sample.error}</pre>
      </article>
    );
  }

  const question = sample.question;
  const answer = sample.answer;
  if (!question || !answer) return null;

  return (
    <article style={{ border: "1px solid rgba(148,163,184,0.18)", borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.03)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "7px 10px", borderBottom: "1px solid rgba(148,163,184,0.14)" }}>
        <strong style={{ fontSize: 11, color: "#e2e8f0" }}>Sample {index + 1} · seed {sample.seed}</strong>
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
            className="n2-question-preview n2-math-surface"
            style={{
              padding: "16px 18px",
              borderRadius: 7,
              background: "#ffffff",
              color: "#111111",
              fontFamily: '"Trebuchet MS", Trebuchet, Arial, sans-serif',
              fontSize: "11pt",
              fontWeight: 400,
              lineHeight: 1.7,
            }}
          >
            <N2ExamQuestionPrompt question={question} />
          </div>
        </section>

        <section>
          <SectionLabel>Generated profile</SectionLabel>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            <Chip emphasis>{question.skillId} {question.skillLabel}</Chip>
            <Chip>{formatToken(question.mechanism)}</Chip>
            <Chip>{formatToken(question.quality.difficultyBandId)}</Chip>
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
            className="n2-final-answer n2-math-surface"
            style={{ padding: "9px 11px", borderRadius: 7, background: "rgba(255,255,255,0.055)", color: "#f8fafc", lineHeight: 1.7 }}
          >
            {answer.finalAnswers.map((finalAnswer, answerIndex) => (
              <div key={`${finalAnswer.partLabel}-${answerIndex}`}>
                <N2ExamAnswer state={question.mathState} />
                <div style={{ marginTop: 4, color: "#94a3b8", fontSize: 8.5 }}>{finalAnswer.normalisedAnswer}</div>
              </div>
            ))}
          </div>
        </section>

        {showAnswerDetail ? <AnswerDetail answer={answer} /> : null}

        <details style={{ borderTop: "1px solid rgba(148,163,184,0.10)", paddingTop: 5 }}>
          <summary style={{ cursor: "pointer", color: "#64748b", fontSize: 9, fontWeight: 700 }}>Source basis + raw output</summary>
          <div style={{ marginTop: 6, color: "#94a3b8", fontSize: 8.5, lineHeight: 1.45 }}>
            Question anchors: {question.sourceBasis.questionCatalogIds.join(", ")}<br />
            Answer anchors: {question.sourceBasis.answerCatalogIds.join(", ")}<br />
            Calibration anchors: {question.quality.calibrationSourceAnchorIds.join(", ")}
          </div>
          <pre style={{ marginTop: 6, maxHeight: 420, overflow: "auto", padding: 8, borderRadius: 7, background: "rgba(0,0,0,0.28)", color: "#94a3b8", fontSize: 8, lineHeight: 1.35, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {JSON.stringify({ question, answer }, null, 2)}
          </pre>
        </details>
      </div>
    </article>
  );
}

export default function N2GeneratorTesterPage() {
  const [selectedSkill, setSelectedSkill] = useState<SelectedSkill>("ALL");
  const [selectedMechanism, setSelectedMechanism] = useState<SelectedMechanism>("MIX");
  const [difficulty, setDifficulty] = useState<N2GeneratorDifficulty>(1);
  const [paper, setPaper] = useState<N2GeneratorPaper>("P1");
  const [sampleCount, setSampleCount] = useState<number>(10);
  const [baseSeed, setBaseSeed] = useState<number>(25001);
  const [lastBatchStartSeed, setLastBatchStartSeed] = useState<number | null>(null);
  const [showAnswerDetail, setShowAnswerDetail] = useState(false);
  const [samples, setSamples] = useState<GeneratedN2Sample[]>([]);
  const [controlsDirty, setControlsDirty] = useState(false);

  const skillMechanisms = useMemo<readonly N2GeneratorMechanism[]>(() => {
    if (selectedSkill === "ALL") return MECHANISM_OPTIONS.map((option) => option.value);
    return N2_MECHANISMS_BY_SKILL[selectedSkill];
  }, [selectedSkill]);

  const availableMechanismOptions = useMemo(
    () => MECHANISM_OPTIONS.filter((option) => selectedSkill === "ALL" || option.skillId === selectedSkill),
    [selectedSkill],
  );

  const selectedProfile = useMemo(
    () => selectedMechanism === "MIX" ? null : getN2MechanismProfile(selectedMechanism),
    [selectedMechanism],
  );

  const candidateMechanisms = useMemo<readonly N2GeneratorMechanism[]>(
    () => selectedMechanism === "MIX" ? skillMechanisms : [selectedMechanism],
    [selectedMechanism, skillMechanisms],
  );

  const supportedPapers = useMemo<readonly N2GeneratorPaper[]>(() =>
    PAPERS.filter((paperOption) => candidateMechanisms.some((mechanism) =>
      getN2MechanismProfile(mechanism).supportedPapers.includes(paperOption),
    )),
  [candidateMechanisms]);

  const currentDifficultyBand = N2_GENERATOR_DIFFICULTY_BANDS.find((entry) => entry.difficulty === difficulty);
  const effectivePaper = supportedPapers.includes(paper) ? paper : supportedPapers[0] ?? "P1";

  useEffect(() => {
    if (!supportedPapers.includes(paper) && supportedPapers[0]) setPaper(supportedPapers[0]);
  }, [paper, supportedPapers]);

  function mechanismForSeed(seed: number, paperForSample: N2GeneratorPaper): N2GeneratorMechanism {
    if (selectedMechanism !== "MIX") return selectedMechanism;
    const eligible = candidateMechanisms.filter((mechanism) =>
      getN2MechanismProfile(mechanism).supportedPapers.includes(paperForSample),
    );
    if (!eligible.length) throw new Error(`No N2 variant is available for ${paperForSample} in the selected skill.`);
    const slot = Math.abs((seed * 31 + 7) % eligible.length);
    return eligible[slot];
  }

  function buildSamples(startSeed: number): GeneratedN2Sample[] {
    return Array.from({ length: sampleCount }, (_, index): GeneratedN2Sample => {
      const seed = startSeed + index;
      try {
        const mechanism = mechanismForSeed(seed, effectivePaper);
        const question = generateN2Question({ seed, difficulty, paper: effectivePaper, mechanism });
        const answer = generateN2Answer(question);
        return { id: `${question.instanceId}-${index}`, seed, question, answer };
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
    const startSeed = 25001;
    setSamples(buildSamples(startSeed));
    setLastBatchStartSeed(startSeed);
    setBaseSeed(startSeed + 10);
    // Initial generation only; subsequent batches deliberately use new seeds and current controls.
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
    <main style={{ minHeight: "100vh", padding: 16, background: "#070a10", color: "#f8fafc", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        .n2-math-surface .katex { font-size: 1.14em; }
        .n2-question-preview .katex { line-height: 1.45; }
        .n2-final-answer .katex { font-size: 1.22em; }
      `}</style>

      <div style={{ width: "min(1600px, 100%)", margin: "0 auto" }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 850 }}>{N2_SKILL_PARENT_LABEL}</div>
          <div style={{ marginTop: 3, color: "#64748b", fontSize: 10 }}>
            Public skill labels are N2.1–N2.3; the detailed mechanisms below are generator variants for developer inspection.
          </div>
        </div>

        <section style={{ display: "flex", alignItems: "end", gap: 8, flexWrap: "wrap", padding: 10, marginBottom: 8, border: "1px solid rgba(148,163,184,0.18)", borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
          <ControlLabel>
            N2 skill
            <select
              value={selectedSkill}
              onChange={(event) => {
                setSelectedSkill(event.target.value as SelectedSkill);
                setSelectedMechanism("MIX");
                setControlsDirty(true);
              }}
              style={{ ...controlStyle, minWidth: 220 }}
            >
              <option value="ALL">All N2 skills</option>
              {N2_SKILLS.map((skill) => <option key={skill.id} value={skill.id}>{skill.id} {skill.label}</option>)}
            </select>
          </ControlLabel>

          <ControlLabel>
            Variant
            <select
              value={selectedMechanism}
              onChange={(event) => {
                setSelectedMechanism(event.target.value as SelectedMechanism);
                setControlsDirty(true);
              }}
              style={{ ...controlStyle, minWidth: 300 }}
            >
              <option value="MIX">All variants in selected skill</option>
              {availableMechanismOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </ControlLabel>

          <ControlLabel>
            Difficulty
            <select
              value={difficulty}
              onChange={(event) => {
                setDifficulty(Number(event.target.value) as N2GeneratorDifficulty);
                setControlsDirty(true);
              }}
              style={{ ...controlStyle, minWidth: 145 }}
            >
              <option value={1}>Lower band (L1)</option>
              <option value={2}>Upper band (L2)</option>
            </select>
          </ControlLabel>

          <ControlLabel>
            Paper
            <select
              value={effectivePaper}
              onChange={(event) => {
                setPaper(event.target.value as N2GeneratorPaper);
                setControlsDirty(true);
              }}
              style={controlStyle}
            >
              {supportedPapers.map((paperOption) => <option key={paperOption} value={paperOption}>{paperOption}</option>)}
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
              {SAMPLE_COUNT_OPTIONS.map((count) => <option key={count} value={count}>{count}</option>)}
            </select>
          </ControlLabel>

          <ControlLabel>
            Next batch seed
            <input type="number" value={baseSeed} onChange={(event) => setBaseSeed(Number(event.target.value) || 1)} style={{ ...controlStyle, width: 110 }} />
          </ControlLabel>

          <button type="button" onClick={generateNextBatch} style={{ height: 32, padding: "0 14px", border: "1px solid rgba(96,165,250,0.52)", borderRadius: 7, background: "rgba(59,130,246,0.18)", color: "#dbeafe", cursor: "pointer", fontSize: 11, fontWeight: 800 }}>
            Generate next batch
          </button>

          <button type="button" onClick={() => setShowAnswerDetail((current) => !current)} style={{ height: 32, padding: "0 13px", border: "1px solid rgba(148,163,184,0.28)", borderRadius: 7, background: "rgba(16,185,129,0.10)", color: "#a7f3d0", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>
            {showAnswerDetail ? "Hide marking + worked answer" : "Show marking + worked answer"}
          </button>

          <div style={{ marginLeft: "auto", display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
            {controlsDirty ? <Chip emphasis>Controls changed — generate</Chip> : null}
            {lastBatchStartSeed !== null ? <Chip>batch {lastBatchStartSeed}–{lastBatchStartSeed + Math.max(samples.length - 1, 0)}</Chip> : null}
            <Chip>{failedCount} errors</Chip>
            <Chip>{successfulSamples.length}/{samples.length} validated</Chip>
            <Chip>L{difficulty}</Chip>
            {selectedProfile ? <Chip>historical anchor L{selectedProfile.difficulty}</Chip> : null}
          </div>
        </section>

        {currentDifficultyBand ? (
          <section style={{ marginBottom: 8, padding: "7px 10px", border: "1px solid rgba(96,165,250,0.22)", borderRadius: 8, background: "rgba(30,64,175,0.07)", color: "#bfdbfe", fontSize: 10, lineHeight: 1.45 }}>
            <strong>{formatToken(currentDifficultyBand.bandId)}:</strong> {currentDifficultyBand.description}
          </section>
        ) : null}

        <section style={{ marginBottom: 10, padding: "7px 10px", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 8, color: "#94a3b8", fontSize: 9.5 }}>
          <strong style={{ color: "#cbd5e1" }}>Batch variants:</strong>{" "}
          {Object.entries(mechanismCounts).map(([mechanism, count]) => `${formatToken(mechanism)} · ${count}`).join("   |   ") || "none"}
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          {samples.map((sample, index) => <SampleCard key={sample.id} sample={sample} index={index} showAnswerDetail={showAnswerDetail} />)}
        </div>
      </div>
    </main>
  );
}
