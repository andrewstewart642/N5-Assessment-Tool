"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import PaperContent from "@/app/UI/Documents/Components/PaperContent";
import {
  G1_SURFACES_BY_FAMILY,
  g1FamilyFrequency,
  getG1FamilyProfile,
} from "../../Courses/National5Maths/04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Calibration";
import { assessG1Difficulty } from "../../Courses/National5Maths/04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Difficulty";
import { generateG1Question } from "../../Courses/National5Maths/04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Generator";
import type {
  G1GeneratedQuestion,
  G1GeneratorDifficulty,
  G1GeneratorFamily,
  G1GeneratorPaper,
  G1GeneratorSurfaceStyle,
  G1ValidationIssue,
} from "../../Courses/National5Maths/04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Types";
import { validateG1GeneratedQuestion } from "../../Courses/National5Maths/04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Validation";
import { generateG1Answer } from "../../Courses/National5Maths/05_AnswerGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Generator";
import type {
  G1AnswerValidationIssue,
  G1GeneratedMarkingScheme,
} from "../../Courses/National5Maths/05_AnswerGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Types";
import { validateG1GeneratedAnswer } from "../../Courses/National5Maths/05_AnswerGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Validation";
import G1GraphPreview from "./G1GraphPreview";

type SelectedFamily = "MIX" | G1GeneratorFamily;
type SelectedSurface = "AUTO" | G1GeneratorSurfaceStyle;
type SelectedDifficulty = "AUTO" | G1GeneratorDifficulty;

type GeneratedG1Sample = {
  id: string;
  seed: number;
  question?: G1GeneratedQuestion;
  answer?: G1GeneratedMarkingScheme;
  questionIssues?: G1ValidationIssue[];
  answerIssues?: G1AnswerValidationIssue[];
  error?: string;
};

const SAMPLE_COUNT_OPTIONS = [1, 5, 10, 20, 50] as const;
const PAPERS: readonly G1GeneratorPaper[] = ["P1", "P2"];
const FAMILIES: readonly G1GeneratorFamily[] = [
  "LINE_EQUATION_FROM_TWO_POINTS",
  "CONTEXTUAL_LINEAR_MODEL",
  "BEST_FIT_LINEAR_MODEL",
  "SYMBOLIC_GRADIENT_FROM_TWO_POINTS",
];

const FAMILY_DIFFICULTIES: Record<G1GeneratorFamily, readonly G1GeneratorDifficulty[]> = {
  LINE_EQUATION_FROM_TWO_POINTS: [1, 2],
  CONTEXTUAL_LINEAR_MODEL: [2],
  BEST_FIT_LINEAR_MODEL: [1, 2],
  SYMBOLIC_GRADIENT_FROM_TWO_POINTS: [2],
};

const FAMILY_LABELS: Record<G1GeneratorFamily, string> = {
  LINE_EQUATION_FROM_TWO_POINTS: "Line equation from two points",
  CONTEXTUAL_LINEAR_MODEL: "Deterministic contextual model",
  BEST_FIT_LINEAR_MODEL: "Best-fit model · 3 G1 marks only",
  SYMBOLIC_GRADIENT_FROM_TWO_POINTS: "Symbolic coordinate gradient",
};

const SURFACE_LABELS: Record<G1GeneratorSurfaceStyle, string> = {
  DIRECT_COORDINATES_LINE_EQUATION: "Direct coordinates",
  COORDINATE_DIAGRAM_LINE_EQUATION: "Coordinate diagram",
  CONTEXT_LINE_GRAPH_LABELLED_POINTS: "Context graph with labelled points",
  BEST_FIT_LABELLED_POINTS_CONTEXT: "Best-fit graph · labelled points",
  BEST_FIT_GRID_READ_POINTS: "Best-fit graph · read points from grid",
  SYMBOLIC_COORDINATE_GRADIENT: "Symbolic coordinates",
};

const formatToken = (value: string) => value.replaceAll("_", " ");
const asMathParts = (latex: string): PaperPart[] => [{ kind: "math", latex, displayMode: false }];
const positiveModulo = (value: number, modulus: number) => ((value % modulus) + modulus) % modulus;

function Chip({ children, emphasis = false, warning = false }: { children: ReactNode; emphasis?: boolean; warning?: boolean }) {
  const border = warning
    ? "1px solid rgba(251,191,36,0.42)"
    : emphasis
      ? "1px solid rgba(52,211,153,0.42)"
      : "1px solid rgba(148,163,184,0.22)";
  const background = warning
    ? "rgba(245,158,11,0.10)"
    : emphasis
      ? "rgba(16,185,129,0.10)"
      : "rgba(255,255,255,0.045)";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", minHeight: 24, padding: "2px 9px", border, borderRadius: 999, background, color: warning ? "#fde68a" : emphasis ? "#a7f3d0" : "#cbd5e1", fontSize: 11, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function ControlLabel({ children }: { children: ReactNode }) {
  return <label style={{ display: "grid", gap: 4, color: "#cbd5e1", fontSize: 12, fontWeight: 750 }}>{children}</label>;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <div style={{ marginBottom: 7, color: "#94a3b8", fontSize: 11, fontWeight: 850, letterSpacing: "0.045em", textTransform: "uppercase" }}>{children}</div>;
}

function AnswerDetail({ answer }: { answer: G1GeneratedMarkingScheme }) {
  return (
    <section style={{ display: "grid", gap: 12 }}>
      <div>
        <SectionLabel>Marking scheme</SectionLabel>
        <div style={{ display: "grid", gap: 7 }}>
          {answer.markPoints.map((mark) => (
            <div key={`${mark.markNumber}-${mark.role}`} style={{ display: "grid", gridTemplateColumns: "72px minmax(0,1fr)", overflow: "hidden", border: "1px solid rgba(148,163,184,0.18)", borderRadius: 8, background: "#ffffff", color: "#111827" }}>
              <div style={{ padding: 9, borderRight: "1px solid #e5e7eb", textAlign: "center", fontWeight: 800, fontSize: 11 }}>
                m{mark.markNumber}{mark.partLabel ? ` (${mark.partLabel})` : ""}
                <div style={{ marginTop: 3, color: "#64748b", fontSize: 9 }}>{mark.standard} · {mark.thinking}</div>
              </div>
              <div style={{ padding: "9px 11px", fontSize: 10.5, lineHeight: 1.5 }}>
                <strong>{formatToken(mark.role)}</strong> — {mark.requirement}
                {mark.acceptanceNotes.length ? <div style={{ marginTop: 4, color: "#64748b" }}>Accept: {mark.acceptanceNotes.join(" ")}</div> : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Worked answer routes</SectionLabel>
        <div style={{ display: "grid", gap: 8 }}>
          {answer.methods.map((method) => (
            <div key={method.methodFamilyId} style={{ overflow: "hidden", border: "1px solid rgba(148,163,184,0.18)", borderRadius: 8 }}>
              <div style={{ padding: "7px 9px", background: "rgba(255,255,255,0.04)", color: "#cbd5e1", fontSize: 10, fontWeight: 700 }}>
                {method.methodFamilyId === answer.defaultMethodFamilyId ? "Preferred route" : "Supported route"} — {formatToken(method.methodFamilyId)}
              </div>
              <div className="g1-math-surface" style={{ display: "grid", gap: 9, padding: 11, background: "#ffffff", color: "#111827" }}>
                {method.lines.map((line) => (
                  <div key={line.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 12, alignItems: "center" }}>
                    <div>
                      {line.latex ? <PaperContent parts={asMathParts(line.latex)} /> : <span>{line.text}</span>}
                      {line.latex && line.text ? <div style={{ marginTop: 3, color: "#64748b", fontSize: 9 }}>{line.text}</div> : null}
                    </div>
                    <span style={{ color: "#64748b", fontSize: 9.5 }}>m{line.markNumbers.join(",")}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SampleCard({ sample, index, showAnswerDetail, showVisualOverlay }: { sample: GeneratedG1Sample; index: number; showAnswerDetail: boolean; showVisualOverlay: boolean }) {
  if (sample.error) {
    return (
      <article style={{ border: "1px solid rgba(248,113,113,0.42)", borderRadius: 10, padding: 12, background: "rgba(127,29,29,0.12)" }}>
        <strong style={{ color: "#fca5a5", fontSize: 12 }}>Sample {index + 1} failed — seed {sample.seed}</strong>
        <pre style={{ whiteSpace: "pre-wrap", color: "#fecaca", fontSize: 9 }}>{sample.error}</pre>
      </article>
    );
  }

  const question = sample.question;
  const answer = sample.answer;
  if (!question || !answer) return null;
  const difficulty = assessG1Difficulty(question.family, question.surfaceStyleId, question.mathState);
  const warningCount = [
    ...(sample.questionIssues ?? []),
    ...(sample.answerIssues ?? []),
  ].filter((issue) => issue.severity === "WARNING").length;

  return (
    <article style={{ border: "1px solid rgba(148,163,184,0.18)", borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.03)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "8px 11px", borderBottom: "1px solid rgba(148,163,184,0.14)" }}>
        <strong style={{ fontSize: 12, color: "#e2e8f0" }}>Sample {index + 1} · seed {sample.seed}</strong>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "end" }}>
          <Chip emphasis>question PASS · answer PASS</Chip>
          {warningCount ? <Chip warning>{warningCount} expected warning{warningCount === 1 ? "" : "s"}</Chip> : null}
          <Chip>{question.paper}</Chip>
          <Chip>{question.marks} G1 marks</Chip>
          <Chip>{question.standard}</Chip>
          <Chip>L{question.difficulty}</Chip>
        </div>
      </div>

      <div style={{ display: "grid", gap: 13, padding: 11 }}>
        <section>
          <SectionLabel>Question</SectionLabel>
          <div className="g1-question-preview g1-math-surface" style={{ padding: "16px 18px", borderRadius: 7, background: "#ffffff", color: "#111111", fontFamily: '"Trebuchet MS", Trebuchet, Arial, sans-serif', fontSize: "11pt", fontWeight: 400, lineHeight: 1.65, whiteSpace: "pre-line" }}>
            <PaperContent parts={question.promptParts} />
            {question.visual ? <G1GraphPreview visual={question.visual} showDeveloperOverlay={showVisualOverlay} /> : null}
          </div>
        </section>

        <section>
          <SectionLabel>Generated profile</SectionLabel>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            <Chip emphasis>{FAMILY_LABELS[question.family]}</Chip>
            <Chip>{SURFACE_LABELS[question.surfaceStyleId]}</Chip>
            <Chip>{formatToken(question.familyReadiness)}</Chip>
            <Chip>{formatToken(question.quality.difficultyBandId)} · score {question.quality.difficultyScore}</Chip>
            <Chip>{question.quality.familyObservedCount}/{question.quality.familyObservedTotal} observed on {question.paper}</Chip>
          </div>
          {difficulty.signalLabels.length ? <div style={{ marginTop: 7, color: "#94a3b8", fontSize: 10, lineHeight: 1.45 }}>Difficulty signals: {difficulty.signalLabels.join("; ")}</div> : null}
          {question.family === "BEST_FIT_LINEAR_MODEL" ? <div style={{ marginTop: 7, color: "#fde68a", fontSize: 10, lineHeight: 1.45 }}>Composite boundary: {question.deferredComposite.g1MarksGenerated} G1 marks are generated here; the adjacent {question.deferredComposite.embeddedMarksDeferred}-mark statistical component remains deferred.</div> : null}
        </section>

        <section>
          <SectionLabel>Final answer</SectionLabel>
          <div className="g1-final-answer g1-math-surface" style={{ padding: "10px 12px", borderRadius: 7, background: "rgba(255,255,255,0.055)", color: "#f8fafc", lineHeight: 1.7 }}>
            {answer.finalAnswers.map((finalAnswer, answerIndex) => (
              <div key={`${finalAnswer.partLabel}-${answerIndex}`} style={{ marginBottom: answerIndex < answer.finalAnswers.length - 1 ? 9 : 0 }}>
                {finalAnswer.partLabel ? <strong style={{ marginRight: 7, color: "#cbd5e1", fontSize: 10 }}>({finalAnswer.partLabel})</strong> : null}
                <PaperContent parts={asMathParts(finalAnswer.latex)} />
                <div style={{ marginTop: 3, color: "#94a3b8", fontSize: 9 }}>{finalAnswer.normalisedAnswer}{finalAnswer.unit ? ` ${finalAnswer.unit}` : ""}</div>
              </div>
            ))}
          </div>
        </section>

        {showAnswerDetail ? <AnswerDetail answer={answer} /> : null}

        <details style={{ borderTop: "1px solid rgba(148,163,184,0.10)", paddingTop: 6 }}>
          <summary style={{ cursor: "pointer", color: "#64748b", fontSize: 10, fontWeight: 700 }}>Source basis + raw output</summary>
          <pre style={{ marginTop: 7, maxHeight: 420, overflow: "auto", padding: 9, borderRadius: 7, background: "rgba(0,0,0,0.28)", color: "#94a3b8", fontSize: 8.5, lineHeight: 1.35, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {JSON.stringify({ question, answer, questionIssues: sample.questionIssues, answerIssues: sample.answerIssues }, null, 2)}
          </pre>
        </details>
      </div>
    </article>
  );
}

export default function G1GeneratorTesterPage() {
  const [selectedFamily, setSelectedFamily] = useState<SelectedFamily>("MIX");
  const [selectedSurface, setSelectedSurface] = useState<SelectedSurface>("AUTO");
  const [difficulty, setDifficulty] = useState<SelectedDifficulty>("AUTO");
  const [paper, setPaper] = useState<G1GeneratorPaper>("P1");
  const [sampleCount, setSampleCount] = useState<number>(10);
  const [baseSeed, setBaseSeed] = useState<number>(61181);
  const [lastBatchStartSeed, setLastBatchStartSeed] = useState<number | null>(null);
  const [showAnswerDetail, setShowAnswerDetail] = useState(false);
  const [showVisualOverlay, setShowVisualOverlay] = useState(false);
  const [samples, setSamples] = useState<GeneratedG1Sample[]>([]);
  const [controlsDirty, setControlsDirty] = useState(false);

  const selectedFamilyProfile = useMemo(() => selectedFamily === "MIX" ? null : getG1FamilyProfile(selectedFamily), [selectedFamily]);
  const supportedPapers = useMemo<readonly G1GeneratorPaper[]>(() => selectedFamilyProfile ? selectedFamilyProfile.supportedPapers as readonly G1GeneratorPaper[] : PAPERS, [selectedFamilyProfile]);
  const effectivePaper = supportedPapers.includes(paper) ? paper : supportedPapers[0] ?? "P1";
  const surfaceOptions = useMemo<readonly G1GeneratorSurfaceStyle[]>(() => selectedFamily === "MIX" ? [] : G1_SURFACES_BY_FAMILY[selectedFamily], [selectedFamily]);
  const difficultyOptions = useMemo<readonly G1GeneratorDifficulty[]>(() => selectedFamily === "MIX" ? [1, 2] : FAMILY_DIFFICULTIES[selectedFamily], [selectedFamily]);

  const candidateFamilies = useMemo(() => {
    if (selectedFamily !== "MIX") return [selectedFamily];
    return FAMILIES.filter((family) => {
      const profile = getG1FamilyProfile(family);
      if (!profile.supportedPapers.includes(effectivePaper as never)) return false;
      if (difficulty !== "AUTO" && !FAMILY_DIFFICULTIES[family].includes(difficulty)) return false;
      return g1FamilyFrequency(family, effectivePaper).count > 0;
    });
  }, [difficulty, effectivePaper, selectedFamily]);

  function familyForSeed(seed: number): G1GeneratorFamily {
    if (selectedFamily !== "MIX") return selectedFamily;
    const weighted = candidateFamilies.flatMap((family) =>
      Array.from({ length: g1FamilyFrequency(family, effectivePaper).count }, () => family),
    );
    if (!weighted.length) throw new Error("No historically calibrated G1 family is enabled for the selected paper/difficulty controls.");
    return weighted[positiveModulo(seed, weighted.length)];
  }

  function buildSamples(startSeed: number): GeneratedG1Sample[] {
    return Array.from({ length: sampleCount }, (_, index): GeneratedG1Sample => {
      const seed = startSeed + index;
      try {
        const family = familyForSeed(seed);
        const question = generateG1Question({
          seed,
          family,
          paper: effectivePaper,
          difficulty: difficulty === "AUTO" ? undefined : difficulty,
          surfaceStyleId: selectedFamily === "MIX" || selectedSurface === "AUTO" ? undefined : selectedSurface,
          includeExperimentalFamilies: true,
          includeDeferredCompositeFamilies: true,
        });
        const answer = generateG1Answer(question);
        const questionValidation = validateG1GeneratedQuestion(question);
        const answerValidation = validateG1GeneratedAnswer(question, answer);
        if (!questionValidation.valid || !answerValidation.valid) {
          const validationErrors = [
            ...questionValidation.issues.filter((issue) => issue.severity === "ERROR"),
            ...answerValidation.issues.filter((issue) => issue.severity === "ERROR"),
          ];
          throw new Error(validationErrors.map((issue) => `${issue.code}: ${issue.message}`).join(" | "));
        }
        return { id: `${question.instanceId}-${index}`, seed, question, answer, questionIssues: questionValidation.issues, answerIssues: answerValidation.issues };
      } catch (error) {
        return { id: `error-${seed}-${index}`, seed, error: error instanceof Error ? error.stack ?? error.message : String(error) };
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
    const startSeed = 61181;
    setSamples(buildSamples(startSeed));
    setLastBatchStartSeed(startSeed);
    setBaseSeed(startSeed + 10);
    // Initial generation only; later batches deliberately use the live controls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const failedCount = samples.filter((sample) => Boolean(sample.error)).length;
  const successfulSamples = samples.filter((sample): sample is GeneratedG1Sample & { question: G1GeneratedQuestion; answer: G1GeneratedMarkingScheme } => Boolean(sample.question && sample.answer));
  const familyCounts = successfulSamples.reduce<Record<string, number>>((counts, sample) => {
    counts[sample.question.family] = (counts[sample.question.family] ?? 0) + 1;
    return counts;
  }, {});
  const surfaceCounts = successfulSamples.reduce<Record<string, number>>((counts, sample) => {
    counts[sample.question.surfaceStyleId] = (counts[sample.question.surfaceStyleId] ?? 0) + 1;
    return counts;
  }, {});
  const warningCount = samples.reduce((total, sample) => total
    + (sample.questionIssues ?? []).filter((issue) => issue.severity === "WARNING").length
    + (sample.answerIssues ?? []).filter((issue) => issue.severity === "WARNING").length, 0);

  const controlStyle = { height: 35, padding: "0 9px", border: "1px solid rgba(148,163,184,0.26)", borderRadius: 7, background: "#111827", color: "#f8fafc", fontSize: 12 } as const;

  return (
    <main style={{ minHeight: "100vh", padding: 14, background: "#070a10", color: "#f8fafc", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        .g1-math-surface .katex { font-size: 1.1em; }
        .g1-question-preview .katex { line-height: 1.45; }
        .g1-final-answer .katex { font-size: 1.18em; }
      `}</style>

      <div style={{ width: "min(1760px, 100%)", margin: "0 auto" }}>
        <div style={{ marginBottom: 11 }}>
          <div style={{ color: "#e2e8f0", fontSize: 16, fontWeight: 850 }}>G1 · Gradient and equation of a straight line</div>
          <div style={{ marginTop: 3, color: "#64748b", fontSize: 10.5 }}>Canonical G1 question + answer stress tester. Mixed-family selection now uses reviewed historical occurrence counts rather than hand-tuned developer weights.</div>
        </div>

        <section style={{ display: "flex", alignItems: "end", gap: 9, flexWrap: "wrap", padding: 11, marginBottom: 9, border: "1px solid rgba(148,163,184,0.18)", borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
          <ControlLabel>G1 family<select value={selectedFamily} onChange={(event) => { setSelectedFamily(event.target.value as SelectedFamily); setSelectedSurface("AUTO"); setDifficulty("AUTO"); setControlsDirty(true); }} style={{ ...controlStyle, minWidth: 300 }}><option value="MIX">Historically weighted mixed bag</option>{FAMILIES.map((family) => <option key={family} value={family}>{FAMILY_LABELS[family]}</option>)}</select></ControlLabel>
          <ControlLabel>Surface<select value={selectedSurface} disabled={selectedFamily === "MIX"} onChange={(event) => { setSelectedSurface(event.target.value as SelectedSurface); setControlsDirty(true); }} style={{ ...controlStyle, minWidth: 280, opacity: selectedFamily === "MIX" ? 0.55 : 1 }}><option value="AUTO">Auto surface</option>{surfaceOptions.map((surface) => <option key={surface} value={surface}>{SURFACE_LABELS[surface]}</option>)}</select></ControlLabel>
          <ControlLabel>Difficulty<select value={difficulty} onChange={(event) => { setDifficulty(event.target.value === "AUTO" ? "AUTO" : Number(event.target.value) as G1GeneratorDifficulty); setSelectedSurface("AUTO"); setControlsDirty(true); }} style={{ ...controlStyle, minWidth: 180 }}><option value="AUTO">Auto calibrated</option>{difficultyOptions.map((level) => <option key={level} value={level}>L{level} · {level === 1 ? "baseline" : "higher band"}</option>)}</select></ControlLabel>
          <ControlLabel>Paper<select value={effectivePaper} onChange={(event) => { setPaper(event.target.value as G1GeneratorPaper); setSelectedSurface("AUTO"); setDifficulty("AUTO"); setControlsDirty(true); }} style={{ ...controlStyle, minWidth: 80 }}>{supportedPapers.map((value) => <option key={value} value={value}>{value}</option>)}</select></ControlLabel>
          <ControlLabel>Samples<select value={sampleCount} onChange={(event) => { setSampleCount(Number(event.target.value)); setControlsDirty(true); }} style={{ ...controlStyle, minWidth: 85 }}>{SAMPLE_COUNT_OPTIONS.map((count) => <option key={count} value={count}>{count}</option>)}</select></ControlLabel>
          <ControlLabel>Next batch seed<input value={baseSeed} onChange={(event) => { setBaseSeed(Number(event.target.value) || 1); setControlsDirty(true); }} style={{ ...controlStyle, width: 150 }} /></ControlLabel>
          <button type="button" onClick={generateNextBatch} style={{ ...controlStyle, height: 36, padding: "0 18px", borderColor: "rgba(96,165,250,0.55)", background: "rgba(30,64,175,0.32)", fontWeight: 800, cursor: "pointer" }}>Generate next batch</button>
          <button type="button" onClick={() => setShowAnswerDetail((value) => !value)} style={{ ...controlStyle, height: 36, padding: "0 16px", borderColor: "rgba(52,211,153,0.35)", background: "rgba(6,78,59,0.28)", color: "#a7f3d0", fontWeight: 750, cursor: "pointer" }}>{showAnswerDetail ? "Hide" : "Show"} marking + worked answer</button>
          <button type="button" onClick={() => setShowVisualOverlay((value) => !value)} style={{ ...controlStyle, height: 36, padding: "0 14px", cursor: "pointer" }}>{showVisualOverlay ? "Hide" : "Show"} graph diagnostics</button>
        </section>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 9 }}>
          {lastBatchStartSeed != null ? <Chip>batch {lastBatchStartSeed}–{lastBatchStartSeed + samples.length - 1}</Chip> : null}
          {controlsDirty ? <Chip warning>Controls changed — generate</Chip> : null}
          <Chip>{failedCount} errors</Chip>
          <Chip emphasis>{successfulSamples.length}/{samples.length} validated</Chip>
          <Chip>{warningCount} validator warnings</Chip>
        </div>

        <div style={{ marginBottom: 10, padding: "8px 11px", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 8, color: "#94a3b8", fontSize: 10.5, lineHeight: 1.55 }}>
          <strong style={{ color: "#cbd5e1" }}>Batch families:</strong> {Object.entries(familyCounts).map(([family, count]) => `${formatToken(family)} · ${count}`).join(" | ") || "—"}<br />
          <strong style={{ color: "#cbd5e1" }}>Batch surfaces:</strong> {Object.entries(surfaceCounts).map(([surface, count]) => `${formatToken(surface)} · ${count}`).join(" | ") || "—"}
        </div>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
          {samples.map((sample, index) => <SampleCard key={sample.id} sample={sample} index={index} showAnswerDetail={showAnswerDetail} showVisualOverlay={showVisualOverlay} />)}
        </section>
      </div>
    </main>
  );
}
