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
import { GENERATOR_TEST_TARGET } from "./GeneratorTestTarget";


type GeneratedTestSample = {
  id: string;
  seed: number;
  generated?: GeneratedQuestionData;
  error?: string;
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

function Chip({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 22,
        padding: "2px 8px",
        border: "1px solid rgba(148,163,184,0.22)",
        borderRadius: 999,
        background: "rgba(255,255,255,0.045)",
        color: "#cbd5e1",
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
  const items = [
    `${totalMarks} marks`,
    classification?.standard ?? null,
    classification?.paperSuitability ?? null,
    classification?.calculatorStatus ?? null,
    classification?.structureType ?? null,
    classification ? (classification.isReasoning ? "Reasoning" : "Operational") : null,
    marks ? `C${marks.cMarks} / A${marks.aMarks} / R${marks.reasoningMarks}` : null,
  ].filter(Boolean);

  return (
    <div style={{ color: "#64748b", fontSize: 9, lineHeight: 1.4 }}>
      {items.join("  •  ")}
    </div>
  );
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
                {method.methodFamilyId}{isDefault ? "  •  DEFAULT" : ""}
              </strong>
              <span style={{ color: "#64748b", fontSize: 9 }}>
                score {method.evidenceScore.toFixed(2)}
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
            <PaperContent parts={displayParts(generated.promptParts, generated.prompt)} />
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
          <section>
            <SectionLabel>Worked answers</SectionLabel>
            <WorkedAnswers generated={generated} />
          </section>
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
  const [showWorkedAnswers, setShowWorkedAnswers] = useState(false);
  const [samples, setSamples] = useState<GeneratedTestSample[]>([]);

  const selectedConcept = concepts.find((concept) => concept.code === selectedConceptCode) ?? concepts[0];
  const selectedTarget = GENERATOR_TEST_TARGET.concepts.find((concept) => concept.code === selectedConceptCode);
  const supportedPapers = selectedTarget?.papers?.length ? selectedTarget.papers : (["P1", "P2"] as Paper[]);

  useEffect(() => {
    if (!supportedPapers.includes(paper)) setPaper(supportedPapers[0] ?? "P1");
  }, [paper, supportedPapers]);

  function generateSamples() {
    if (!selectedConcept) {
      setSamples([{ id: "missing-concept", seed: baseSeed, error: "No test concept has been configured." }]);
      return;
    }

    const nextSamples = Array.from({ length: sampleCount }, (_, index): GeneratedTestSample => {
      const sampleSeed = baseSeed + index;
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

    setSamples(nextSamples);
  }

  useEffect(() => {
    generateSamples();
    // Initial generation only; subsequent runs are explicit so a reviewed batch
    // does not change underneath the teacher while controls are adjusted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const failedCount = samples.filter((sample) => Boolean(sample.error)).length;
  const workedAnswerCount = samples.filter(
    (sample) => (sample.generated?.workedAnswers?.methods.length ?? 0) > 0,
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
              onChange={(event) => setSelectedConceptCode(event.target.value)}
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
              onChange={(event) => setDifficulty(Number(event.target.value) as DifficultyLevel)}
              style={controlStyle}
            >
              {availableDifficulties.map((level) => (
                <option key={level} value={level}>Level {level}</option>
              ))}
            </select>
          </ControlLabel>

          <ControlLabel>
            Paper
            <select value={paper} onChange={(event) => setPaper(event.target.value)} style={controlStyle}>
              {supportedPapers.map((paperOption) => (
                <option key={paperOption} value={paperOption}>{paperOption}</option>
              ))}
            </select>
          </ControlLabel>

          <ControlLabel>
            Samples
            <select
              value={sampleCount}
              onChange={(event) => setSampleCount(Number(event.target.value))}
              style={controlStyle}
            >
              {SAMPLE_COUNT_OPTIONS.map((count) => (
                <option key={count} value={count}>{count}</option>
              ))}
            </select>
          </ControlLabel>

          {GENERATOR_TEST_TARGET.supportsSeed ? (
            <ControlLabel>
              Base seed
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
            onClick={generateSamples}
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
            Generate
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
            {showWorkedAnswers ? "Hide worked answers" : "Show worked answers"}
          </button>

          <div style={{ marginLeft: "auto", display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
            <Chip>{samples.length} generated</Chip>
            <Chip>{failedCount} errors</Chip>
            <Chip>{workedAnswerCount}/{samples.length} worked</Chip>
            <Chip>L{difficulty}</Chip>
          </div>
        </section>

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
