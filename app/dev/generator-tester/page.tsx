"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  Concept,
  DifficultyLevel,
  Paper,
  Skill,
  StandardFilter,
} from "@/shared-types/AssessmentTypes";

import type {
  GeneratedQuestionData,
  GeneratorContext,
  StandardClassification,
} from "@/shared-types/QuestionGenerationTypes";

import type {
  PaperPart,
} from "@/shared-types/PaperParts";

import PaperContent from "@/app/create-assessment/builder/components/assessment-preview/PaperContent";

import {
  GENERATOR_TEST_TARGET,
} from "./GeneratorTestTarget";


type GeneratedTestSample = {
  id: string;

  generated?: GeneratedQuestionData;

  error?: string;
};


const SAMPLE_COUNT_OPTIONS = [
  1,
  5,
  10,
  20,
  50,
] as const;


function standardFilterFromClassification(
  standard:
    StandardClassification | undefined
): StandardFilter {
  if (
    standard === "A"
  ) {
    return "A";
  }

  if (
    standard === "Mixed"
  ) {
    return "C+A";
  }

  return "C";
}


function buildTestConcepts():
  Concept[] {
  const module =
    GENERATOR_TEST_TARGET.module;

  const standard =
    standardFilterFromClassification(
      module.metadata.capabilities
        .standardCoverage[0]
    );

  return (
    GENERATOR_TEST_TARGET.concepts
      .map(
        (concept) => ({
          id:
            `dev-${concept.code}`,

          code:
            concept.code,

          label:
            concept.label,

          standard,
        })
      )
  );
}


function buildTestSkill(
  concepts:
    Concept[]
): Skill {
  const module =
    GENERATOR_TEST_TARGET.module;

  return {
    id:
      `dev-${module.metadata.moduleId}`,

    code:
      module.metadata.skillCode,

    text:
      module.metadata.conceptLabel,

    domain:
      module.metadata.domain,

    concepts,

    paperSuitability:
      module.metadata.capabilities
        .paperSuitability,
  };
}


function createGeneratorContext(args: {
  concept:
    Concept;

  skill:
    Skill;

  difficulty:
    DifficultyLevel;

  paper:
    Paper;
}): GeneratorContext {
  return {
    difficulty:
      args.difficulty,

    skill:
      args.skill,

    concept:
      args.concept,

    selectedConceptText:
      args.concept.label,

    paper:
      args.paper,
  };
}


function plainArithmeticToLatex(
  expression:
    string
): string {
  const cleaned =
    expression
      .replace(
        /\.$/,
        ""
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  const tokens =
    cleaned
      .split(
        /(\d+\s+\d+\/\d+|\d+\/\d+|[=()+−+\-×÷])/g
      )
      .map(
        (token) =>
          token.trim()
      )
      .filter(
        Boolean
      );

  return tokens
    .map(
      (token) => {
        const mixedMatch =
          token.match(
            /^(\d+)\s+(\d+)\/(\d+)$/
          );

        if (
          mixedMatch
        ) {
          const [
            ,
            whole,
            numerator,
            denominator,
          ] =
            mixedMatch;

          return (
            `${whole}\\,\\dfrac{${numerator}}{${denominator}}`
          );
        }

        const fractionMatch =
          token.match(
            /^(\d+)\/(\d+)$/
          );

        if (
          fractionMatch
        ) {
          const [
            ,
            numerator,
            denominator,
          ] =
            fractionMatch;

          return (
            `\\dfrac{${numerator}}{${denominator}}`
          );
        }

        if (
          token === "×"
        ) {
          return "\\times";
        }

        if (
          token === "÷"
        ) {
          return "\\div";
        }

        if (
          token === "−" ||
          token === "-"
        ) {
          return "-";
        }

        if (
          token === "+"
        ) {
          return "+";
        }

        if (
          token === "="
        ) {
          return "=";
        }

        if (
          token === "("
        ) {
          return "\\left(";
        }

        if (
          token === ")"
        ) {
          return "\\right)";
        }

        return token;
      }
    )
    .join(
      " "
    );
}


function shouldRenderArithmeticTextAsMath(
  value:
    string
): boolean {
  /**
   * Temporary compatibility bridge for older
   * answer generators which store numerical
   * fraction working as text.
   *
   * New answer generators should ideally emit
   * proper PaperPart math objects themselves.
   */
  return (
    /\d+\s*\/\s*\d+/.test(
      value
    ) &&
    !/[A-Za-z£%]/.test(
      value
    )
  );
}


function displayParts(
  parts:
    PaperPart[] | undefined,

  fallback:
    string | undefined
): PaperPart[] {
  if (
    parts &&
    parts.length > 0
  ) {
    return parts;
  }

  if (
    fallback
  ) {
    return [
      {
        kind:
          "text",

        value:
          fallback,
      },
    ];
  }

  return [
    {
      kind:
        "text",

      value:
        "—",
    },
  ];
}


function workedLineDisplayParts(
  parts:
    PaperPart[]
): PaperPart[] {
  if (
    parts.length !== 1
  ) {
    return parts;
  }

  const first =
    parts[0];

  if (
    first.kind !== "text"
  ) {
    return parts;
  }

  if (
    !shouldRenderArithmeticTextAsMath(
      first.value
    )
  ) {
    return parts;
  }

  return [
    {
      kind:
        "math",

      latex:
        plainArithmeticToLatex(
          first.value
        ),
    },
  ];
}


function Chip({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <span
      style={{
        display:
          "inline-flex",

        alignItems:
          "center",

        minHeight:
          24,

        padding:
          "3px 8px",

        border:
          "1px solid rgba(148,163,184,0.25)",

        borderRadius:
          999,

        background:
          "rgba(255,255,255,0.055)",

        color:
          "#cbd5e1",

        fontSize:
          12,

        lineHeight:
          1.2,

        whiteSpace:
          "nowrap",
      }}
    >
      {children}
    </span>
  );
}


function ControlLabel({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <label
      style={{
        display:
          "grid",

        gap:
          6,

        color:
          "#cbd5e1",

        fontSize:
          12,

        fontWeight:
          700,
      }}
    >
      {children}
    </label>
  );
}


function WorkedAnswers({
  generated,
}: {
  generated:
    GeneratedQuestionData;
}) {
  const answerSet =
    generated.workedAnswers;

  if (
    !answerSet ||
    answerSet.methods.length === 0
  ) {
    return (
      <div
        style={{
          padding:
            14,

          border:
            "1px dashed rgba(148,163,184,0.28)",

          borderRadius:
            10,

          color:
            "#94a3b8",

          fontSize:
            13,
        }}
      >
        No worked-answer generator attached.
      </div>
    );
  }

  return (
    <div
      style={{
        display:
          "grid",

        gap:
          12,
      }}
    >
      {answerSet.methods.map(
        (
          method,
          methodIndex
        ) => {
          const isDefault =
            method.methodFamilyId ===
            answerSet
              .defaultMethodFamilyId;

          return (
            <div
              key={`${method.methodFamilyId}-${method.methodVariantId ?? "default"}-${methodIndex}`}
              style={{
                border:
                  isDefault
                    ? "1px solid rgba(96,165,250,0.52)"
                    : "1px solid rgba(148,163,184,0.20)",

                borderRadius:
                  12,

                overflow:
                  "hidden",

                background:
                  isDefault
                    ? "rgba(59,130,246,0.055)"
                    : "rgba(255,255,255,0.025)",
              }}
            >
              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "space-between",

                  gap:
                    12,

                  padding:
                    "10px 12px",

                  borderBottom:
                    "1px solid rgba(148,163,184,0.16)",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      8,

                    flexWrap:
                      "wrap",
                  }}
                >
                  <strong
                    style={{
                      color:
                        "#e2e8f0",

                      fontSize:
                        13,
                    }}
                  >
                    {method.methodFamilyId}
                  </strong>

                  {method.methodVariantId ? (
                    <Chip>
                      {method.methodVariantId}
                    </Chip>
                  ) : null}

                  {isDefault ? (
                    <span
                      style={{
                        padding:
                          "3px 7px",

                        borderRadius:
                          999,

                        background:
                          "rgba(59,130,246,0.18)",

                        color:
                          "#93c5fd",

                        fontSize:
                          10,

                        fontWeight:
                          800,

                        letterSpacing:
                          "0.05em",
                      }}
                    >
                      DEFAULT
                    </span>
                  ) : null}
                </div>

                <span
                  style={{
                    color:
                      "#94a3b8",

                    fontSize:
                      12,

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  Evidence score{" "}
                  <strong
                    style={{
                      color:
                        "#e2e8f0",
                    }}
                  >
                    {method.evidenceScore.toFixed(
                      2
                    )}
                  </strong>
                </span>
              </div>


              <div
                style={{
                  padding:
                    14,

                  background:
                    "#ffffff",

                  color:
                    "#111827",

                  fontFamily:
                    "Cambria Math, Cambria, Georgia, Times New Roman, serif",

                  fontSize:
                    18,
                }}
              >
                <div
                  style={{
                    display:
                      "grid",

                    gap:
                      10,
                  }}
                >
                  {method.lines.map(
                    (
                      line,
                      lineIndex
                    ) => (
                      <div
                        key={
                          line.id
                        }
                        style={{
                          display:
                            "grid",

                          gridTemplateColumns:
                            "minmax(0, 1fr) auto",

                          gap:
                            14,

                          alignItems:
                            "center",
                        }}
                      >
                        <div
                          style={{
                            minWidth:
                              0,
                          }}
                        >
                          <PaperContent
                            parts={
                              workedLineDisplayParts(
                                line.parts
                              )
                            }
                          />
                        </div>

                        {line.markNumbers &&
                        line.markNumbers
                          .length > 0 ? (
                          <span
                            style={{
                              color:
                                "#64748b",

                              fontFamily:
                                "Inter, ui-sans-serif, system-ui, sans-serif",

                              fontSize:
                                11,

                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            mark{" "}
                            {line.markNumbers.join(
                              ", "
                            )}
                          </span>
                        ) : null}

                        {lineIndex <
                        method.lines.length -
                          1 ? null : null}
                      </div>
                    )
                  )}
                </div>
              </div>


              <div
                style={{
                  padding:
                    "9px 12px",

                  color:
                    "#94a3b8",

                  fontSize:
                    11,

                  lineHeight:
                    1.5,
                }}
              >
                <strong
                  style={{
                    color:
                      "#cbd5e1",
                  }}
                >
                  Evidence:
                </strong>{" "}

                {method
                  .sourceEvidenceIds
                  .length > 0
                  ? method.sourceEvidenceIds.join(
                      ", "
                    )
                  : "none"}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}


function SampleCard({
  sample,
  index,
}: {
  sample:
    GeneratedTestSample;

  index:
    number;
}) {
  if (
    sample.error
  ) {
    return (
      <article
        style={{
          border:
            "1px solid rgba(248,113,113,0.42)",

          borderRadius:
            14,

          padding:
            16,

          background:
            "rgba(127,29,29,0.12)",
        }}
      >
        <strong
          style={{
            color:
              "#fca5a5",
          }}
        >
          Sample {index + 1} failed
        </strong>

        <pre
          style={{
            marginBottom:
              0,

            whiteSpace:
              "pre-wrap",

            color:
              "#fecaca",

            fontSize:
              12,
          }}
        >
          {sample.error}
        </pre>
      </article>
    );
  }


  const generated =
    sample.generated;

  if (
    !generated
  ) {
    return null;
  }


  const classification =
    generated.classification;

  const markBreakdown =
    generated.markBreakdown;


  return (
    <article
      style={{
        border:
          "1px solid rgba(148,163,184,0.20)",

        borderRadius:
          16,

        overflow:
          "hidden",

        background:
          "rgba(255,255,255,0.035)",
      }}
    >
      <div
        style={{
          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          gap:
            14,

          padding:
            "12px 16px",

          borderBottom:
            "1px solid rgba(148,163,184,0.16)",
        }}
      >
        <strong>
          Sample {index + 1}
        </strong>

        <div
          style={{
            display:
              "flex",

            flexWrap:
              "wrap",

            justifyContent:
              "flex-end",

            gap:
              6,
          }}
        >
          {generated.questionCode ? (
            <Chip>
              {generated.questionCode}
            </Chip>
          ) : null}

          {generated.templateId ? (
            <Chip>
              {generated.templateId}
            </Chip>
          ) : null}
        </div>
      </div>


      <div
        style={{
          display:
            "grid",

          gap:
            16,

          padding:
            16,
        }}
      >
        <section>
          <div
            style={{
              marginBottom:
                7,

              color:
                "#94a3b8",

              fontSize:
                11,

              fontWeight:
                800,

              letterSpacing:
                "0.07em",

              textTransform:
                "uppercase",
            }}
          >
            Question
          </div>

          <div
            style={{
              padding:
                18,

              borderRadius:
                12,

              background:
                "#ffffff",

              color:
                "#111827",

              fontFamily:
                "Cambria Math, Cambria, Georgia, Times New Roman, serif",

              fontSize:
                18,

              lineHeight:
                1.75,
            }}
          >
            <PaperContent
              parts={
                displayParts(
                  generated.promptParts,
                  generated.prompt
                )
              }
            />
          </div>
        </section>


        <section>
          <div
            style={{
              marginBottom:
                7,

              color:
                "#94a3b8",

              fontSize:
                11,

              fontWeight:
                800,

              letterSpacing:
                "0.07em",

              textTransform:
                "uppercase",
            }}
          >
            Final answer
          </div>

          <div
            style={{
              padding:
                14,

              borderRadius:
                12,

              background:
                "rgba(255,255,255,0.055)",

              color:
                "#f8fafc",

              fontFamily:
                "Cambria Math, Cambria, Georgia, Times New Roman, serif",

              fontSize:
                18,
            }}
          >
            <PaperContent
              parts={
                displayParts(
                  generated.answerParts,
                  generated.answer
                )
              }
            />
          </div>
        </section>


        <section>
          <div
            style={{
              marginBottom:
                7,

              color:
                "#94a3b8",

              fontSize:
                11,

              fontWeight:
                800,

              letterSpacing:
                "0.07em",

              textTransform:
                "uppercase",
            }}
          >
            Worked answers
          </div>

          <WorkedAnswers
            generated={
              generated
            }
          />
        </section>


        <section>
          <div
            style={{
              marginBottom:
                7,

              color:
                "#94a3b8",

              fontSize:
                11,

              fontWeight:
                800,

              letterSpacing:
                "0.07em",

              textTransform:
                "uppercase",
            }}
          >
            Classification
          </div>

          <div
            style={{
              display:
                "flex",

              gap:
                6,

              flexWrap:
                "wrap",
            }}
          >
            <Chip>
              Marks:{" "}
              {generated.marks ??
                markBreakdown?.totalMarks ??
                "—"}
            </Chip>

            {classification?.standard ? (
              <Chip>
                Standard:{" "}
                {classification.standard}
              </Chip>
            ) : null}

            {classification
              ?.calculatorStatus ? (
              <Chip>
                {
                  classification
                    .calculatorStatus
                }
              </Chip>
            ) : null}

            {classification
              ?.paperSuitability ? (
              <Chip>
                Paper:{" "}
                {
                  classification
                    .paperSuitability
                }
              </Chip>
            ) : null}

            {classification
              ?.structureType ? (
              <Chip>
                {
                  classification
                    .structureType
                }
              </Chip>
            ) : null}

            {classification ? (
              <Chip>
                {classification
                  .isReasoning
                  ? "Reasoning"
                  : "Operational"}
              </Chip>
            ) : null}

            {markBreakdown ? (
              <>
                <Chip>
                  C:{" "}
                  {
                    markBreakdown
                      .cMarks
                  }
                </Chip>

                <Chip>
                  A:{" "}
                  {
                    markBreakdown
                      .aMarks
                  }
                </Chip>

                <Chip>
                  R:{" "}
                  {
                    markBreakdown
                      .reasoningMarks
                  }
                </Chip>
              </>
            ) : null}
          </div>
        </section>


        <details
          style={{
            borderTop:
              "1px solid rgba(148,163,184,0.14)",

            paddingTop:
              12,
          }}
        >
          <summary
            style={{
              cursor:
                "pointer",

              color:
                "#cbd5e1",

              fontSize:
                12,

              fontWeight:
                700,
            }}
          >
            Raw generated output
          </summary>

          <pre
            style={{
              marginBottom:
                0,

              marginTop:
                12,

              maxHeight:
                460,

              overflow:
                "auto",

              padding:
                14,

              borderRadius:
                10,

              background:
                "rgba(0,0,0,0.28)",

              color:
                "#94a3b8",

              fontSize:
                11,

              lineHeight:
                1.5,

              whiteSpace:
                "pre-wrap",

              wordBreak:
                "break-word",
            }}
          >
            {JSON.stringify(
              generated,
              null,
              2
            )}
          </pre>
        </details>
      </div>
    </article>
  );
}


export default function GeneratorTesterPage() {
  const module =
    GENERATOR_TEST_TARGET.module;


  const concepts =
    useMemo(
      () =>
        buildTestConcepts(),
      []
    );


  const skill =
    useMemo(
      () =>
        buildTestSkill(
          concepts
        ),
      [
        concepts,
      ]
    );


  const availableDifficulties =
    module.metadata
      .difficultyProfile
      .availableLevels;


  const initialConceptCode =
    GENERATOR_TEST_TARGET
      .concepts[0]?.code ??
    module.metadata.conceptCode;


  const defaultDifficulty =
    module.metadata
      .difficultyProfile
      .defaultLevel;


  const defaultPaper =
    module.metadata.capabilities
      .paperSuitability === "P2"
      ? "P2"
      : "P1";


  const [
    selectedConceptCode,
    setSelectedConceptCode,
  ] =
    useState(
      initialConceptCode
    );


  const [
    difficulty,
    setDifficulty,
  ] =
    useState<DifficultyLevel>(
      defaultDifficulty
    );


  const [
    paper,
    setPaper,
  ] =
    useState<Paper>(
      defaultPaper
    );


  const [
    sampleCount,
    setSampleCount,
  ] =
    useState<number>(
      10
    );


  const [
    samples,
    setSamples,
  ] =
    useState<
      GeneratedTestSample[]
    >(
      []
    );


  const selectedConcept =
    concepts.find(
      (concept) =>
        concept.code ===
        selectedConceptCode
    ) ??
    concepts[0];


  function generateSamples() {
    if (
      !selectedConcept
    ) {
      setSamples([
        {
          id:
            "missing-concept",

          error:
            "No test concept has been configured.",
        },
      ]);

      return;
    }


    const nextSamples =
      Array.from(
        {
          length:
            sampleCount,
        },

        (
          _,
          index
        ): GeneratedTestSample => {
          try {
            const context =
              createGeneratorContext({
                concept:
                  selectedConcept,

                skill,

                difficulty,

                paper,
              });


            const generated =
              module.generate(
                context
              );


            return {
              id:
                `${Date.now()}-${index}-${Math.random()
                  .toString(36)
                  .slice(2, 8)}`,

              generated,
            };
          } catch (
            error
          ) {
            return {
              id:
                `error-${Date.now()}-${index}`,

              error:
                error instanceof Error
                  ? error.stack ??
                    error.message
                  : String(
                      error
                    ),
            };
          }
        }
      );


    setSamples(
      nextSamples
    );
  }


  useEffect(
    () => {
      generateSamples();

      // Initial generation only.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []
  );


  const failedCount =
    samples.filter(
      (sample) =>
        Boolean(
          sample.error
        )
    ).length;


  const workedAnswerCount =
    samples.filter(
      (sample) =>
        (
          sample.generated
            ?.workedAnswers
            ?.methods.length ??
          0
        ) > 0
    ).length;


  return (
    <main
      style={{
        minHeight:
          "100vh",

        padding:
          28,

        background:
          "#070a10",

        color:
          "#f8fafc",

        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          width:
            "min(1500px, 100%)",

          margin:
            "0 auto",
        }}
      >
        <header
          style={{
            display:
              "grid",

            gap:
              12,

            marginBottom:
              22,
          }}
        >
          <div>
            <div
              style={{
                marginBottom:
                  5,

                color:
                  "#60a5fa",

                fontSize:
                  12,

                fontWeight:
                  800,

                letterSpacing:
                  "0.08em",

                textTransform:
                  "uppercase",
              }}
            >
              Development tool
            </div>

            <h1
              style={{
                margin:
                  0,

                fontSize:
                  30,
              }}
            >
              Generator Tester
            </h1>

            <p
              style={{
                marginBottom:
                  0,

                maxWidth:
                  900,

                color:
                  "#94a3b8",

                lineHeight:
                  1.6,
              }}
            >
              Test a production
              ConceptGeneratorModule
              before registering it in
              the assessment builder.
              Change the active module in
              GeneratorTestTarget.ts;
              this page should not need
              rewriting for each skill.
            </p>
          </div>


          <div
            style={{
              display:
                "flex",

              gap:
                6,

              flexWrap:
                "wrap",
            }}
          >
            <Chip>
              {
                module.metadata
                  .moduleId
              }
            </Chip>

            <Chip>
              {
                module.metadata
                  .domain
              }
            </Chip>

            <Chip>
              Skill{" "}
              {
                module.metadata
                  .skillCode
              }
            </Chip>

            <Chip>
              {
                module.metadata
                  .capabilities
                  .calculatorStatus
              }
            </Chip>

            <Chip>
              {
                module.metadata
                  .capabilities
                  .paperSuitability
              }
            </Chip>
          </div>


          {GENERATOR_TEST_TARGET
            .notes &&
          GENERATOR_TEST_TARGET
            .notes.length > 0 ? (
            <div
              style={{
                padding:
                  "10px 12px",

                border:
                  "1px solid rgba(96,165,250,0.20)",

                borderRadius:
                  10,

                background:
                  "rgba(59,130,246,0.06)",

                color:
                  "#bfdbfe",

                fontSize:
                  12,

                lineHeight:
                  1.5,
              }}
            >
              {GENERATOR_TEST_TARGET
                .notes.map(
                  (
                    note,
                    index
                  ) => (
                    <div
                      key={`${note}-${index}`}
                    >
                      {note}
                    </div>
                  )
                )}
            </div>
          ) : null}
        </header>


        <section
          style={{
            display:
              "flex",

            alignItems:
              "end",

            gap:
              12,

            flexWrap:
              "wrap",

            padding:
              14,

            marginBottom:
              18,

            border:
              "1px solid rgba(148,163,184,0.20)",

            borderRadius:
              14,

            background:
              "rgba(255,255,255,0.035)",
          }}
        >
          <ControlLabel>
            Concept

            <select
              value={
                selectedConceptCode
              }
              onChange={
                (event) =>
                  setSelectedConceptCode(
                    event.target.value
                  )
              }
              style={{
                minWidth:
                  230,

                height:
                  38,

                padding:
                  "0 10px",

                border:
                  "1px solid rgba(148,163,184,0.28)",

                borderRadius:
                  8,

                background:
                  "#111827",

                color:
                  "#f8fafc",
              }}
            >
              {GENERATOR_TEST_TARGET
                .concepts.map(
                  (
                    concept
                  ) => (
                    <option
                      key={
                        concept.code
                      }
                      value={
                        concept.code
                      }
                    >
                      {concept.code} —{" "}
                      {concept.label}
                    </option>
                  )
                )}
            </select>
          </ControlLabel>


          <ControlLabel>
            Difficulty

            <select
              value={
                difficulty
              }
              onChange={
                (event) =>
                  setDifficulty(
                    Number(
                      event.target
                        .value
                    ) as DifficultyLevel
                  )
              }
              style={{
                height:
                  38,

                padding:
                  "0 10px",

                border:
                  "1px solid rgba(148,163,184,0.28)",

                borderRadius:
                  8,

                background:
                  "#111827",

                color:
                  "#f8fafc",
              }}
            >
              {availableDifficulties.map(
                (
                  level
                ) => (
                  <option
                    key={
                      level
                    }
                    value={
                      level
                    }
                  >
                    Level {level}
                  </option>
                )
              )}
            </select>
          </ControlLabel>


          <ControlLabel>
            Paper

            <select
              value={
                paper
              }
              onChange={
                (event) =>
                  setPaper(
                    event.target.value
                  )
              }
              style={{
                height:
                  38,

                padding:
                  "0 10px",

                border:
                  "1px solid rgba(148,163,184,0.28)",

                borderRadius:
                  8,

                background:
                  "#111827",

                color:
                  "#f8fafc",
              }}
            >
              <option value="P1">
                P1
              </option>

              <option value="P2">
                P2
              </option>
            </select>
          </ControlLabel>


          <ControlLabel>
            Samples

            <select
              value={
                sampleCount
              }
              onChange={
                (event) =>
                  setSampleCount(
                    Number(
                      event.target
                        .value
                    )
                  )
              }
              style={{
                height:
                  38,

                padding:
                  "0 10px",

                border:
                  "1px solid rgba(148,163,184,0.28)",

                borderRadius:
                  8,

                background:
                  "#111827",

                color:
                  "#f8fafc",
              }}
            >
              {SAMPLE_COUNT_OPTIONS.map(
                (
                  count
                ) => (
                  <option
                    key={
                      count
                    }
                    value={
                      count
                    }
                  >
                    {count}
                  </option>
                )
              )}
            </select>
          </ControlLabel>


          <button
            type="button"
            onClick={
              generateSamples
            }
            style={{
              height:
                38,

              padding:
                "0 16px",

              border:
                "1px solid rgba(96,165,250,0.52)",

              borderRadius:
                8,

              background:
                "rgba(59,130,246,0.18)",

              color:
                "#dbeafe",

              cursor:
                "pointer",

              fontWeight:
                800,
            }}
          >
            Generate
          </button>
        </section>


        <section
          style={{
            display:
              "flex",

            gap:
              8,

            flexWrap:
              "wrap",

            marginBottom:
              18,
          }}
        >
          <Chip>
            Generated:{" "}
            {samples.length}
          </Chip>

          <Chip>
            Errors:{" "}
            {failedCount}
          </Chip>

          <Chip>
            Worked answers:{" "}
            {workedAnswerCount}/
            {samples.length}
          </Chip>

          <Chip>
            Concept:{" "}
            {selectedConceptCode}
          </Chip>

          <Chip>
            Difficulty:{" "}
            {difficulty}
          </Chip>
        </section>


        <section
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 560px), 1fr))",

            gap:
              18,
          }}
        >
          {samples.map(
            (
              sample,
              index
            ) => (
              <SampleCard
                key={
                  sample.id
                }
                sample={
                  sample
                }
                index={
                  index
                }
              />
            )
          )}
        </section>
      </div>
    </main>
  );
}