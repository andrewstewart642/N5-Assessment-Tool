"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import type {
  Concept,
  DifficultyLevel,
  Paper,
  Skill,
  StandardFilter,
} from "@/app/Assessments/AssessmentTypes";
import type {
  GeneratedQuestionData,
  GeneratorContext,
  StandardClassification,
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";
import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import PaperContent from "@/app/UI/Documents/Components/PaperContent";
import type {
  A8GenerationQualityProfile,
  A8GeneratorDifficulty,
  A8GeneratorFamily,
  A8GeneratorPaper,
  A8GraphVisualSpec,
} from "../../Courses/National5Maths/03_QuestionGeneration/02-Algebraic/ALG-A8-SimultaneousEquations";
import type {
  A8GeneratedAnswerProfileId,
  A8GeneratedMarkPoint,
  A8GeneratedMarkProfile,
  A8GeneratedPresentationPolicy,
  A8GeneratedWorkingPolicy,
} from "../../Courses/National5Maths/04_AnswerGeneration/02-Algebraic/ALG-A8-SimultaneousEquations";
import A8GraphPreview from "./A8GraphPreview";
import { GENERATOR_TEST_TARGET } from "./GeneratorTestTarget";

type GeneratedTestSample = {
  id: string;
  seed: number;
  generated?: GeneratedQuestionData;
  error?: string;
};

type A8Diagnostics = {
  family: A8GeneratorFamily;
  difficulty: A8GeneratorDifficulty;
  paper: A8GeneratorPaper;
  quality: A8GenerationQualityProfile;
  visual: A8GraphVisualSpec | null;
  answerGeneratorId: string;
  answerProfileId: A8GeneratedAnswerProfileId;
  markProfile: A8GeneratedMarkProfile;
  profileSourceAnchorIds: string[];
  markPoints: A8GeneratedMarkPoint[];
  workingPolicy: A8GeneratedWorkingPolicy;
  presentationPolicy: A8GeneratedPresentationPolicy;
  answerGenerationNotes: string[];
};

const SAMPLE_COUNT_OPTIONS = [1, 5, 10, 20, 50] as const;

function standardFilterFromClassification(
  standard: StandardClassification | undefined,
): StandardFilter {
  if (standard === "A") return "A";
  if (standard === "Mixed") return "C+A";
  return "C";
}

function buildTestConcepts(): Concept[] {
  const questionModule = GENERATOR_TEST_TARGET.module;
  const standard = standardFilterFromClassification(
    questionModule.metadata.capabilities.standardCoverage[0],
  );

  return GENERATOR_TEST_TARGET.concepts.map((concept) => ({
    id: `dev-${concept.code}`,
    code: concept.code,
    label: concept.label,
    standard,
  }));
}

function buildTestSkill(concepts: Concept[]): Skill {
  const questionModule = GENERATOR_TEST_TARGET.module;
  return {
    id: `dev-${questionModule.metadata.moduleId}`,
    code: questionModule.metadata.skillCode,
    text: questionModule.metadata.conceptLabel,
    domain: questionModule.metadata.domain,
    concepts,
    paperSuitability: questionModule.metadata.capabilities.paperSuitability,
  };
}

function createGeneratorContext(args: {
  concept: Concept;
  skill: Skill;
  difficulty: DifficultyLevel;
  paper: Paper;
  developerSeed: number;
}): GeneratorContext & { developerSeed: number } {
  return {
    difficulty: args.difficulty,
    skill: args.skill,
    concept: args.concept,
    selectedConceptText: args.concept.label,
    paper: args.paper,
    developerSeed: args.developerSeed,
  };
}

function displayParts(parts: PaperPart[] | undefined, fallback: string | undefined): PaperPart[] {
  if (parts && parts.length > 0) return parts;
  return [{ kind: "text", value: fallback ?? "—" }];
}

function a8Diagnostics(generated: GeneratedQuestionData): A8Diagnostics | null {
  return (
    generated as GeneratedQuestionData & { a8Diagnostics?: A8Diagnostics }
  ).a8Diagnostics ?? null;
}

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

function CompactClassification({ generated }: { generated: GeneratedQuestionData }) {
  const classification = generated.classification;
  const marks = generated.markBreakdown;
  const totalMarks = generated.marks ?? marks?.totalMarks ?? "—";
  const diagnostics = a8Diagnostics(generated);
  const items = [
    `${totalMarks} marks`,
    classification?.standard ?? null,
    classification?.paperSuitability ?? null,
    classification?.calculatorStatus ?? null,
    classification?.structureType ?? null,
    classification ? (classification.isReasoning ? "Reasoning" : "Operational") : null,
    diagnostics?.family?.replaceAll("_", " ") ?? null,
    diagnostics?.markProfile?.replaceAll("_", " ") ?? null,
    diagnostics ? `${diagnostics.quality.difficultyBandId.replaceAll("_", " ")} · score ${diagnostics.quality.difficultyScore}` : null,
    marks ? `C${marks.cMarks} / A${marks.aMarks} / R${marks.reasoningMarks}` : null,
  ].filter(Boolean);

  return (
    <div style={{ color: "#64748b", fontSize: 9, lineHeight: 1.4 }}>
      {items.join("  •  ")}
    </div>
  );
}

function MarkingSchemePreview({ generated }: { generated: GeneratedQuestionData }) {
  const diagnostics = a8Diagnostics(generated);
  if (!diagnostics || diagnostics.markPoints.length === 0) return null;

  const policyNotes = [
    `Answer only: ${diagnostics.workingPolicy.unsupportedCorrectAnswerTreatment.replaceAll("_", " ")}`,
    diagnostics.workingPolicy.excludedPrototypeMethods.length
      ? `Excluded method: ${diagnostics.workingPolicy.excludedPrototypeMethods.join(", ").replaceAll("_", " ")}`
      : null,
    diagnostics.workingPolicy.followThroughRoundedAtLeastDp !== null
      ? `Follow-through rounding: at least ${diagnostics.workingPolicy.followThroughRoundedAtLeastDp} d.p.`
      : null,
    diagnostics.workingPolicy.equationEvidenceCanAppearLater
      ? "Equation evidence may appear later"
      : null,
    diagnostics.presentationPolicy.currencyNearestPennyRequired
      ? "Nearest-penny communication required"
      : null,
    diagnostics.presentationPolicy.reversedCoordinatePairFullCreditWithValidWorking
      ? "Reversed final coordinate pair can retain full credit with valid working"
      : null,
  ].filter((note): note is string => Boolean(note));

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
        <Chip emphasis>{diagnostics.answerProfileId.replaceAll("_", " ")}</Chip>
        <Chip>{diagnostics.markProfile.replaceAll("_", " ")}</Chip>
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
        {diagnostics.markPoints.map((mark, index) => (
          <div
            key={`${mark.markNumber}-${mark.role}`}
            style={{
              display: "grid",
              gridTemplateColumns: "58px 132px minmax(0, 1fr)",
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
            </div>
          </div>
        ))}
      </div>

      <div style={{ color: "#64748b", fontSize: 9, lineHeight: 1.4 }}>
        Historical profile anchors: {diagnostics.profileSourceAnchorIds.join(", ")}
      </div>
    </div>
  );
}

function workedMethodLabel(methodFamilyId: string, isDefault: boolean): string {
  const direction = methodFamilyId === "ELIMINATE_FIRST_VARIABLE"
    ? "Eliminate the first variable"
    : methodFamilyId === "ELIMINATE_SECOND_VARIABLE"
      ? "Eliminate the second variable"
      : methodFamilyId.replaceAll("_", " ");
  return isDefault ? `Preferred route — ${direction}` : `Alternative valid route — ${direction}`;
}

function WorkedAnswers({ generated }: { generated: GeneratedQuestionData }) {
  const answerSet = generated.workedAnswers;
  if (!answerSet || answerSet.methods.length === 0) {
    return (
      <div
        style={{
          padding: 9,
          border: "1px dashed rgba(148,163,184,0.24)",
          borderRadius: 8,
          color: "#94a3b8",
          fontSize: 10,
        }}
      >
        No worked-answer generator attached.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {answerSet.methods.map((method, methodIndex) => {
        const isDefault = method.methodFamilyId === answerSet.defaultMethodFamilyId;
        return (
          <div
            key={`${method.methodFamilyId}-${method.methodVariantId ?? "default"}-${methodIndex}`}
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
                {workedMethodLabel(method.methodFamilyId, isDefault)}
              </strong>
              <span style={{ color: "#64748b", fontSize: 9 }}>
                validated route
              </span>
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
              <div style={{ display: "grid", gap: 6 }}>
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
                    <PaperContent parts={line.parts} />
                    {line.markNumbers && line.markNumbers.length > 0 ? (
                      <span style={{ color: "#64748b", fontSize: 9, whiteSpace: "nowrap" }}>
                        m{line.markNumbers.join(",")}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QuestionPreview({ generated }: { generated: GeneratedQuestionData }) {
  const parts = displayParts(generated.promptParts, generated.prompt);
  const visual = a8Diagnostics(generated)?.visual ?? null;

  if (visual && parts.length >= 3) {
    return (
      <>
        <PaperContent parts={parts.slice(0, 2)} />
        <A8GraphPreview visual={visual} />
        <PaperContent parts={parts.slice(2)} />
      </>
    );
  }

  return <PaperContent parts={parts} />;
}

function SampleCard({
  sample,
  index,
  showWorkedAnswers,
}: {
  sample: GeneratedTestSample;
  index: number;
  showWorkedAnswers: boolean;
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

  const generated = sample.generated;
  if (!generated) return null;

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
        <CompactClassification generated={generated} />
      </div>

      <div style={{ display: "grid", gap: 12, padding: 10 }}>
        <section>
          <SectionLabel>Question</SectionLabel>
          <div
            className="a8-question-preview"
            style={{
              padding: "14px 16px",
              borderRadius: 7,
              background: "#ffffff",
              color: "#111111",
              fontFamily: '"Trebuchet MS", Trebuchet, Arial, sans-serif',
              fontSize: "11pt",
              fontWeight: 400,
              lineHeight: 1.42,
              letterSpacing: 0,
            }}
          >
            <QuestionPreview generated={generated} />
          </div>
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
            <PaperContent parts={displayParts(generated.answerParts, generated.answer)} />
          </div>
        </section>

        {showWorkedAnswers ? (
          <>
            <section>
              <SectionLabel>Marking scheme</SectionLabel>
              <MarkingSchemePreview generated={generated} />
            </section>
            <section>
              <SectionLabel>Worked answer routes</SectionLabel>
              <WorkedAnswers generated={generated} />
            </section>
          </>
        ) : null}

        <details style={{ borderTop: "1px solid rgba(148,163,184,0.10)", paddingTop: 5 }}>
          <summary style={{ cursor: "pointer", color: "#64748b", fontSize: 9, fontWeight: 700 }}>
            Raw output
          </summary>
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
            {JSON.stringify(generated, null, 2)}
          </pre>
        </details>
      </div>
    </article>
  );
}

export default function GeneratorTesterPage() {
  const questionModule = GENERATOR_TEST_TARGET.module;
  const concepts = useMemo(() => buildTestConcepts(), []);
  const skill = useMemo(() => buildTestSkill(concepts), [concepts]);
  const availableDifficulties = questionModule.metadata.difficultyProfile.availableLevels;
  const initialConceptCode = GENERATOR_TEST_TARGET.concepts[0]?.code ?? questionModule.metadata.conceptCode;
  const defaultDifficulty = questionModule.metadata.difficultyProfile.defaultLevel;

  const [selectedConceptCode, setSelectedConceptCode] = useState(initialConceptCode);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(defaultDifficulty);
  const [paper, setPaper] = useState<Paper>("P1");
  const [sampleCount, setSampleCount] = useState<number>(10);
  const [baseSeed, setBaseSeed] = useState<number>(24001);
  const [lastBatchStartSeed, setLastBatchStartSeed] = useState<number | null>(null);
  const [showWorkedAnswers, setShowWorkedAnswers] = useState(false);
  const [samples, setSamples] = useState<GeneratedTestSample[]>([]);
  const [controlsDirty, setControlsDirty] = useState(false);

  const selectedConcept = concepts.find((concept) => concept.code === selectedConceptCode) ?? concepts[0];
  const selectedTarget = GENERATOR_TEST_TARGET.concepts.find((concept) => concept.code === selectedConceptCode);
  const supportedPapers = selectedTarget?.papers?.length ? selectedTarget.papers : (["P1", "P2"] as Paper[]);
  const currentDifficultyDescription = questionModule.metadata.difficultyProfile.levelDescriptions?.[difficulty];

  useEffect(() => {
    if (!supportedPapers.includes(paper)) {
      setPaper(supportedPapers[0] ?? "P1");
      setControlsDirty(true);
    }
  }, [paper, supportedPapers]);

  function buildSamples(startSeed: number): GeneratedTestSample[] {
    if (!selectedConcept) {
      return [{ id: "missing-concept", seed: startSeed, error: "No test concept has been configured." }];
    }

    return Array.from({ length: sampleCount }, (_, index): GeneratedTestSample => {
      const sampleSeed = startSeed + index;
      try {
        const context = createGeneratorContext({
          concept: selectedConcept,
          skill,
          difficulty,
          paper,
          developerSeed: sampleSeed,
        });
        const generated = questionModule.generate(context);
        return { id: `${sampleSeed}-${index}`, seed: sampleSeed, generated };
      } catch (error) {
        return {
          id: `error-${sampleSeed}-${index}`,
          seed: sampleSeed,
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
    // Initial generation only; subsequent runs deliberately advance to a new
    // seed range each time the Generate button is pressed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const failedCount = samples.filter((sample) => Boolean(sample.error)).length;
  const workedAnswerCount = samples.filter(
    (sample) => (sample.generated?.workedAnswers?.methods.length ?? 0) > 0,
  ).length;
  const graphCount = samples.filter(
    (sample) => Boolean(sample.generated && a8Diagnostics(sample.generated)?.visual),
  ).length;

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
        .a8-question-preview .katex-display {
          margin: 10px 0 12px 30px !important;
          text-align: left !important;
        }
        .a8-question-preview .katex-display > .katex {
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
            {GENERATOR_TEST_TARGET.conceptControlLabel ?? "Concept"}
            <select
              value={selectedConceptCode}
              onChange={(event) => {
                setSelectedConceptCode(event.target.value);
                setControlsDirty(true);
              }}
              style={{ ...controlStyle, minWidth: 290 }}
            >
              {GENERATOR_TEST_TARGET.concepts.map((concept) => (
                <option key={concept.code} value={concept.code}>
                  {concept.code} — {concept.label}
                </option>
              ))}
            </select>
          </ControlLabel>

          <ControlLabel>
            Difficulty
            <select
              value={difficulty}
              onChange={(event) => {
                setDifficulty(Number(event.target.value) as DifficultyLevel);
                setControlsDirty(true);
              }}
              style={{ ...controlStyle, minWidth: 130 }}
            >
              {availableDifficulties.map((level) => (
                <option key={level} value={level}>
                  {GENERATOR_TEST_TARGET.difficultyLabels?.[level] ?? `Level ${level}`} (L{level})
                </option>
              ))}
            </select>
          </ControlLabel>

          <ControlLabel>
            Paper
            <select
              value={paper}
              onChange={(event) => {
                setPaper(event.target.value as Paper);
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

          {GENERATOR_TEST_TARGET.supportsSeed ? (
            <ControlLabel>
              Next batch seed
              <input
                type="number"
                value={baseSeed}
                onChange={(event) => setBaseSeed(Number(event.target.value) || 1)}
                style={{ ...controlStyle, width: 110 }}
              />
            </ControlLabel>
          ) : null}

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
            onClick={() => setShowWorkedAnswers((current) => !current)}
            style={{
              height: 32,
              padding: "0 13px",
              border: "1px solid rgba(148,163,184,0.28)",
              borderRadius: 7,
              background: showWorkedAnswers ? "rgba(255,255,255,0.055)" : "rgba(16,185,129,0.10)",
              color: showWorkedAnswers ? "#cbd5e1" : "#a7f3d0",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {showWorkedAnswers ? "Hide answer detail" : "Show marking + worked answers"}
          </button>

          <div style={{ marginLeft: "auto", display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
            {controlsDirty ? <Chip emphasis>Controls changed — generate</Chip> : null}
            {lastBatchStartSeed !== null ? <Chip>batch {lastBatchStartSeed}–{lastBatchStartSeed + Math.max(samples.length - 1, 0)}</Chip> : null}
            <Chip>{samples.length} generated</Chip>
            <Chip>{failedCount} errors</Chip>
            <Chip>{workedAnswerCount}/{samples.length} worked</Chip>
            <Chip>{graphCount} graphs</Chip>
            <Chip>L{difficulty}</Chip>
          </div>
        </section>

        {currentDifficultyDescription ? (
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
            <strong>{GENERATOR_TEST_TARGET.difficultyLabels?.[difficulty] ?? `Level ${difficulty}`}:</strong>{" "}
            {currentDifficultyDescription}
          </section>
        ) : null}

        {GENERATOR_TEST_TARGET.notes?.length ? (
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
            {GENERATOR_TEST_TARGET.notes.map((note) => <div key={note}>• {note}</div>)}
          </section>
        ) : null}

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
              showWorkedAnswers={showWorkedAnswers}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
