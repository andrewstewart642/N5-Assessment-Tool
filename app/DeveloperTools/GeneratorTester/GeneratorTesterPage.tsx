"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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

import type {
  PaperPart,
} from "@/app/Assessments/Questions/Content/PaperParts";

import PaperContent from "@/app/UI/Documents/Components/PaperContent";

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
    ReactNode;
}) {
  return (
    <span
      style={{
        display:
          "inline-flex",

        alignItems:
          "center",

        minHeight:
          20,

        padding:
          "2px 7px",

        border:
          "1px solid rgba(148,163,184,0.22)",

        borderRadius:
          999,

        background:
          "rgba(255,255,255,0.045)",

        color:
          "#cbd5e1",

        fontSize:
          10,

        lineHeight:
          1.15,

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
    ReactNode;
}) {
  return (
    <label
      style={{
        display:
          "grid",

        gap:
          4,

        color:
          "#cbd5e1",

        fontSize:
          11,

        fontWeight:
          700,
      }}
    >
      {children}
    </label>
  );
}


function SectionLabel({
  children,
}: {
  children:
    ReactNode;
}) {
  return (
    <div
      style={{
        marginBottom:
          5,

        color:
          "#94a3b8",

        fontSize:
          9,

        fontWeight:
          800,

        letterSpacing:
          "0.06em",

        textTransform:
          "uppercase",
      }}
    >
      {children}
    </div>
  );
}


function CompactClassification({
  generated,
}: {
  generated:
    GeneratedQuestionData;
}) {
  const classification =
    generated.classification;

  const marks =
    generated.markBreakdown;

  const totalMarks =
    generated.marks ??
    marks?.totalMarks ??
    "—";

  const items = [
    `${totalMarks} marks`,

    classification?.standard
      ? classification.standard
      : null,

    classification
      ?.paperSuitability
      ? classification
          .paperSuitability
      : null,

    classification
      ?.calculatorStatus
      ? classification
          .calculatorStatus
      : null,

    classification
      ?.structureType
      ? classification
          .structureType
      : null,

    classification
      ? (
          classification.isReasoning
            ? "Reasoning"
            : "Operational"
        )
      : null,

    marks
      ? (
          `C${marks.cMarks}`
          + ` / A${marks.aMarks}`
          + ` / R${marks.reasoningMarks}`
        )
      : null,
  ].filter(
    Boolean
  );

  return (
    <div
      style={{
        color:
          "#64748b",

        fontSize:
          9,

        lineHeight:
          1.35,
      }}
    >
      {items.join(
        "  •  "
      )}
    </div>
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
            8,

          border:
            "1px dashed rgba(148,163,184,0.24)",

          borderRadius:
            8,

          color:
            "#94a3b8",

          fontSize:
            10,
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
          8,
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
                    ? "1px solid rgba(96,165,250,0.46)"
                    : "1px solid rgba(148,163,184,0.18)",

                borderRadius:
                  8,

                overflow:
                  "hidden",

                background:
                  isDefault
                    ? "rgba(59,130,246,0.045)"
                    : "rgba(255,255,255,0.02)",
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
                    8,

                  padding:
                    "6px 8px",

                  borderBottom:
                    "1px solid rgba(148,163,184,0.14)",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      5,

                    minWidth:
                      0,
                  }}
                >
                  <strong
                    style={{
                      color:
                        "#e2e8f0",

                      fontSize:
                        10,

                      lineHeight:
                        1.2,

                      overflow:
                        "hidden",

                      textOverflow:
                        "ellipsis",

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {method.methodFamilyId}
                  </strong>

                  {isDefault ? (
                    <span
                      style={{
                        padding:
                          "2px 5px",

                        borderRadius:
                          999,

                        background:
                          "rgba(59,130,246,0.18)",

                        color:
                          "#93c5fd",

                        fontSize:
                          8,

                        fontWeight:
                          800,
                      }}
                    >
                      DEFAULT
                    </span>
                  ) : null}
                </div>

                <span
                  style={{
                    color:
                      "#64748b",

                    fontSize:
                      9,

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  score{" "}
                  {method.evidenceScore.toFixed(
                    2
                  )}
                </span>
              </div>


              <div
                style={{
                  padding:
                    8,

                  background:
                    "#ffffff",

                  color:
                    "#111827",

                  fontFamily:
                    "Cambria Math, Cambria, Georgia, Times New Roman, serif",

                  fontSize:
                    14,
                }}
              >
                <div
                  style={{
                    display:
                      "grid",

                    gap:
                      5,
                  }}
                >
                  {method.lines.map(
                    (line) => (
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
                            8,

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
                                8,

                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            m
                            {line.markNumbers.join(
                              ","
                            )}
                          </span>
                        ) : null}
                      </div>
                    )
                  )}
                </div>
              </div>


              <details>
                <summary
                  style={{
                    cursor:
                      "pointer",

                    padding:
                      "5px 8px",

                    color:
                      "#64748b",

                    fontSize:
                      8,

                    lineHeight:
                      1.2,
                  }}
                >
                  Evidence sources
                </summary>

                <div
                  style={{
                    padding:
                      "0 8px 6px",

                    color:
                      "#64748b",

                    fontSize:
                      8,

                    lineHeight:
                      1.35,

                    wordBreak:
                      "break-word",
                  }}
                >
                  {method
                    .sourceEvidenceIds
                    .length > 0
                    ? method.sourceEvidenceIds.join(
                        ", "
                      )
                    : "none"}
                </div>
              </details>
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
  showWorkedAnswers,
}: {
  sample:
    GeneratedTestSample;

  index:
    number;

  showWorkedAnswers:
    boolean;
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
            10,

          padding:
            10,

          background:
            "rgba(127,29,29,0.12)",
        }}
      >
        <strong
          style={{
            color:
              "#fca5a5",

            fontSize:
              11,
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
              9,
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


  return (
    <article
      style={{
        border:
          "1px solid rgba(148,163,184,0.18)",

        borderRadius:
          10,

        overflow:
          "hidden",

        background:
          "rgba(255,255,255,0.03)",
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
            8,

          padding:
            "7px 10px",

          borderBottom:
            "1px solid rgba(148,163,184,0.14)",
        }}
      >
        <strong
          style={{
            fontSize:
              11,

            color:
              "#e2e8f0",
          }}
        >
          Sample {index + 1}
        </strong>

        <CompactClassification
          generated={
            generated
          }
        />
      </div>


      <div
        style={{
          display:
            "grid",

          gap:
            10,

          padding:
            10,
        }}
      >
        <section>
          <SectionLabel>
            Question
          </SectionLabel>

          <div
            style={{
              padding:
                "10px 12px",

              borderRadius:
                8,

              background:
                "#ffffff",

              color:
                "#111827",

              fontFamily:
                "Cambria Math, Cambria, Georgia, Times New Roman, serif",

              fontSize:
                14,

              lineHeight:
                1.45,
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
          <SectionLabel>
            Final answer
          </SectionLabel>

          <div
            style={{
              padding:
                "7px 10px",

              borderRadius:
                8,

              background:
                "rgba(255,255,255,0.05)",

              color:
                "#f8fafc",

              fontFamily:
                "Cambria Math, Cambria, Georgia, Times New Roman, serif",

              fontSize:
                14,
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


        {showWorkedAnswers ? (
          <section>
            <SectionLabel>
              Worked answers
            </SectionLabel>

            <WorkedAnswers
              generated={
                generated
              }
            />
          </section>
        ) : null}


        <details
          style={{
            borderTop:
              "1px solid rgba(148,163,184,0.10)",

            paddingTop:
              5,
          }}
        >
          <summary
            style={{
              cursor:
                "pointer",

              color:
                "#64748b",

              fontSize:
                9,

              fontWeight:
                700,
            }}
          >
            Raw output
          </summary>

          <pre
            style={{
              marginBottom:
                0,

              marginTop:
                6,

              maxHeight:
                360,

              overflow:
                "auto",

              padding:
                8,

              borderRadius:
                7,

              background:
                "rgba(0,0,0,0.28)",

              color:
                "#94a3b8",

              fontSize:
                8,

              lineHeight:
                1.35,

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
    showWorkedAnswers,
    setShowWorkedAnswers,
  ] =
    useState(
      true
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


  const controlStyle = {
    height:
      32,

    padding:
      "0 8px",

    border:
      "1px solid rgba(148,163,184,0.26)",

    borderRadius:
      7,

    background:
      "#111827",

    color:
      "#f8fafc",

    fontSize:
      11,
  } as const;


  return (
    <main
      style={{
        minHeight:
          "100vh",

        padding:
          16,

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
            "min(1600px, 100%)",

          margin:
            "0 auto",
        }}
      >
        <section
          style={{
            display:
              "flex",

            alignItems:
              "end",

            gap:
              8,

            flexWrap:
              "wrap",

            padding:
              10,

            marginBottom:
              10,

            border:
              "1px solid rgba(148,163,184,0.18)",

            borderRadius:
              10,

            background:
              "rgba(255,255,255,0.03)",
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
                ...controlStyle,

                minWidth:
                  220,
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
              style={
                controlStyle
              }
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
              style={
                controlStyle
              }
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
              style={
                controlStyle
              }
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
                32,

              padding:
                "0 13px",

              border:
                "1px solid rgba(96,165,250,0.52)",

              borderRadius:
                7,

              background:
                "rgba(59,130,246,0.18)",

              color:
                "#dbeafe",

              cursor:
                "pointer",

              fontSize:
                11,

              fontWeight:
                800,
            }}
          >
            Generate
          </button>


          <button
            type="button"
            onClick={
              () =>
                setShowWorkedAnswers(
                  (current) =>
                    !current
                )
            }
            style={{
              height:
                32,

              padding:
                "0 13px",

              border:
                "1px solid rgba(148,163,184,0.28)",

              borderRadius:
                7,

              background:
                showWorkedAnswers
                  ? "rgba(255,255,255,0.055)"
                  : "rgba(16,185,129,0.10)",

              color:
                showWorkedAnswers
                  ? "#cbd5e1"
                  : "#a7f3d0",

              cursor:
                "pointer",

              fontSize:
                11,

              fontWeight:
                700,
            }}
          >
            {showWorkedAnswers
              ? "Hide worked answers"
              : "Show worked answers"}
          </button>


          <div
            style={{
              marginLeft:
                "auto",

              display:
                "flex",

              gap:
                5,

              flexWrap:
                "wrap",

              alignItems:
                "center",
            }}
          >
            <Chip>
              {samples.length} generated
            </Chip>

            <Chip>
              {failedCount} errors
            </Chip>

            <Chip>
              {workedAnswerCount}/
              {samples.length} worked
            </Chip>

            <Chip>
              L{difficulty}
            </Chip>
          </div>
        </section>


        <section
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",

            gap:
              10,
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
                showWorkedAnswers={
                  showWorkedAnswers
                }
              />
            )
          )}
        </section>
      </div>
    </main>
  );
}