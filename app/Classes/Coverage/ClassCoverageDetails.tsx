import {
  useMemo,
} from "react";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import ClassCoverageQuestionExamples from "./ClassCoverageQuestionExamples";

import type {
  ClassCoverageSelection,
} from "./ClassCoverageSelection";

import {
  getCoverageConceptById,
  getCoverageSkillById,
  getSkillCode,
  getSkillCoverage,
  getSkillTitle,
  getTrackableConcepts,
} from "./ClassCoverageHelpers";


type Props = {
  courseId:
    CourseId;

  selection:
    ClassCoverageSelection;

  onSelectionChange:
    (
      selection:
        ClassCoverageSelection
    ) => void;

  completedSkillIds:
    string[];

  completedConceptIds:
    string[];

  theme:
    AppTheme;

  courseAccent:
    string;
};


function ProgressBar({
  progressPct,
  accent,
  theme,
}: {
  progressPct:
    number;

  accent:
    string;

  theme:
    AppTheme;
}) {
  return (
    <div
      style={{
        width:
          "100%",

        height:
          4,

        overflow:
          "hidden",

        borderRadius:
          4,

        background:
          theme.borderStandard,
      }}
    >
      <div
        style={{
          width:
            `${progressPct}%`,

          height:
            "100%",

          borderRadius:
            4,

          background:
            accent,

          boxShadow:
            `0 0 7px color-mix(
              in srgb,
              ${accent} 55%,
              transparent
            )`,

          transition:
            "width 180ms ease",
        }}
      />
    </div>
  );
}


function CoverageStatus({
  covered,
  theme,
  courseAccent,
}: {
  covered:
    boolean;

  theme:
    AppTheme;

  courseAccent:
    string;
}) {
  return (
    <span
      style={{
        height:
          22,

        padding:
          "0 7px",

        display:
          "inline-flex",

        alignItems:
          "center",

        gap:
          5,

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          covered
            ? `color-mix(
                in srgb,
                ${courseAccent} 48%,
                ${theme.borderStandard}
              )`
            : theme.borderStandard,

        borderRadius:
          4,

        background:
          covered
            ? `color-mix(
                in srgb,
                ${courseAccent} 11%,
                ${theme.bgSection}
              )`
            : theme.bgSection,

        color:
          covered
            ? courseAccent
            : theme.textMuted,

        fontSize:
          9.5,

        fontWeight:
          650,

        whiteSpace:
          "nowrap",
      }}
    >
      <span
        style={{
          width:
            5,

          height:
            5,

          borderRadius:
            999,

          background:
            covered
              ? courseAccent
              : theme.textMuted,
        }}
      />

      {covered
        ? "Covered"
        : "Not covered"}
    </span>
  );
}


export default function ClassCoverageDetails({
  courseId,
  selection,
  onSelectionChange,
  completedSkillIds,
  completedConceptIds,
  theme,
  courseAccent,
}: Props) {
  const selectedSkill =
    useMemo(
      () =>
        selection
          ? getCoverageSkillById(
              courseId,
              selection.skillId
            )
          : null,
      [
        courseId,
        selection,
      ]
    );


  const selectedConcept =
    useMemo(
      () =>
        selection?.kind ===
        "concept"
          ? getCoverageConceptById(
              courseId,
              selection.conceptId
            )
          : null,
      [
        courseId,
        selection,
      ]
    );


  if (
    !selection ||
    !selectedSkill
  ) {
    return (
      <aside
        style={{
          minWidth:
            0,

          minHeight:
            330,

          padding:
            16,

          boxSizing:
            "border-box",

          display:
            "grid",

          alignContent:
            "center",

          justifyItems:
            "center",

          gap:
            8,

          borderWidth:
            1,

          borderStyle:
            "solid",

          borderColor:
            theme.borderStandard,

          borderRadius:
            6,

          background:
            `linear-gradient(
              145deg,
              color-mix(
                in srgb,
                ${courseAccent} 7%,
                ${theme.bgSurface}
              ) 0%,
              ${theme.bgSurface} 55%
            )`,

          textAlign:
            "center",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width:
              34,

            height:
              34,

            display:
              "grid",

            placeItems:
              "center",

            borderWidth:
              1,

            borderStyle:
              "solid",

            borderColor:
              `color-mix(
                in srgb,
                ${courseAccent} 38%,
                ${theme.borderStandard}
              )`,

            borderRadius:
              6,

            background:
              `color-mix(
                in srgb,
                ${courseAccent} 10%,
                ${theme.bgSection}
              )`,

            color:
              courseAccent,
          }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 18 18"
          >
            <path
              d="M3 3.5h12v11H3zM5.5 6h7M5.5 8.8h7M5.5 11.6h4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>


        <div
          style={{
            color:
              theme.textPrimary,

            fontSize:
              13,

            fontWeight:
              650,
          }}
        >
          Course specification details
        </div>


        <div
          style={{
            maxWidth:
              330,

            color:
              theme.textMuted,

            fontSize:
              10.5,

            lineHeight:
              1.45,
          }}
        >
          Select a skill or individual subskill to inspect the specification and real generated question range.
        </div>
      </aside>
    );
  }


  const {
    skill,
  } =
    selectedSkill;


  const skillCode =
    getSkillCode(
      skill
    );


  const skillTitle =
    getSkillTitle(
      skill
    );


  const trackableConcepts =
    getTrackableConcepts(
      skill
    );


  const skillProgress =
    getSkillCoverage(
      skill,
      completedConceptIds,
      completedSkillIds
    );


  /**
   * Individual subskill inspector.
   */
  if (
    selection.kind ===
      "concept" &&
    selectedConcept
  ) {
    const {
      concept,
    } =
      selectedConcept;


    const covered =
      completedConceptIds.includes(
        concept.id
      );


    return (
      <aside
        style={{
          minWidth:
            0,

          padding:
            14,

          boxSizing:
            "border-box",

          display:
            "grid",

          alignContent:
            "start",

          gap:
            14,

          borderWidth:
            1,

          borderStyle:
            "solid",

          borderColor:
            `color-mix(
              in srgb,
              ${courseAccent} 28%,
              ${theme.borderStandard}
            )`,

          borderRadius:
            6,

          background:
            `linear-gradient(
              145deg,
              color-mix(
                in srgb,
                ${courseAccent} 7%,
                ${theme.bgSurface}
              ) 0%,
              ${theme.bgSurface} 48%
            )`,
        }}
      >
        <button
          type="button"
          onClick={() =>
            onSelectionChange({
              kind:
                "skill",

              skillId:
                skill.id,
            })
          }
          style={{
            width:
              "fit-content",

            padding:
              0,

            display:
              "inline-flex",

            alignItems:
              "center",

            gap:
              5,

            borderWidth:
              0,

            background:
              "transparent",

            color:
              theme.textMuted,

            cursor:
              "pointer",

            fontFamily:
              "inherit",

            fontSize:
              9.5,

            fontWeight:
              600,
          }}
        >
          ← {skillCode} {skillTitle}
        </button>


        <div
          style={{
            display:
              "grid",

            gap:
              8,

            paddingBottom:
              12,

            borderBottomWidth:
              1,

            borderBottomStyle:
              "solid",

            borderBottomColor:
              theme.borderStandard,
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
                10,
            }}
          >
            <span
              style={{
                color:
                  theme.textMuted,

                fontSize:
                  9.5,

                fontWeight:
                  700,

                letterSpacing:
                  "0.05em",

                textTransform:
                  "uppercase",
              }}
            >
              Subskill details
            </span>


            <CoverageStatus
              covered={
                covered
              }
              theme={
                theme
              }
              courseAccent={
                courseAccent
              }
            />
          </div>


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
            <span
              style={{
                color:
                  courseAccent,

                fontSize:
                  14,

                fontWeight:
                  750,

                fontVariantNumeric:
                  "tabular-nums",
              }}
            >
              {concept.code}
            </span>


            <span
              style={{
                color:
                  theme.textPrimary,

                fontSize:
                  17,

                fontWeight:
                  700,

                lineHeight:
                  1.25,
              }}
            >
              {concept.shortLabel ||
                concept.label}
            </span>
          </div>
        </div>


        <div
          style={{
            display:
              "grid",

            gap:
              7,
          }}
        >
          <div
            style={{
              color:
                theme.textSecondary,

              fontSize:
                11,

              fontWeight:
                650,
            }}
          >
            What pupils should be able to do
          </div>


          <div
            style={{
              padding:
                "10px 11px",

              borderWidth:
                1,

              borderStyle:
                "solid",

              borderColor:
                theme.borderStandard,

              borderRadius:
                5,

              background:
                theme.bgSection,

              color:
                theme.textSecondary,

              fontSize:
                11,

              lineHeight:
                1.45,
            }}
          >
            {concept.fullDescription ||
              concept.label}
          </div>
        </div>


        <ClassCoverageQuestionExamples
          courseId={
            courseId
          }
          skill={
            skill
          }
          concept={
            concept
          }
          theme={
            theme
          }
          courseAccent={
            courseAccent
          }
          displayMode="FULL_RANGE"
          heading="Representative question range"
        />


        <div
          style={{
            paddingTop:
              2,

            color:
              theme.textMuted,

            fontSize:
              9.5,

            lineHeight:
              1.4,
          }}
        >
          The examples above represent the available generated range for this subskill. Refresh any example to see another question at the same underlying generator level.
        </div>
      </aside>
    );
  }


  /**
   * Parent skill overview.
   */
  return (
    <aside
      style={{
        minWidth:
          0,

        padding:
          14,

        boxSizing:
          "border-box",

        display:
          "grid",

        alignContent:
          "start",

        gap:
          14,

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          `color-mix(
            in srgb,
            ${courseAccent} 28%,
            ${theme.borderStandard}
          )`,

        borderRadius:
          6,

        background:
          `linear-gradient(
            145deg,
            color-mix(
              in srgb,
              ${courseAccent} 7%,
              ${theme.bgSurface}
            ) 0%,
            ${theme.bgSurface} 48%
          )`,
      }}
    >
      <div
        style={{
          display:
            "grid",

          gap:
            7,

          paddingBottom:
            12,

          borderBottomWidth:
            1,

          borderBottomStyle:
            "solid",

          borderBottomColor:
            theme.borderStandard,
        }}
      >
        <span
          style={{
            color:
              theme.textMuted,

            fontSize:
              9.5,

            fontWeight:
              700,

            letterSpacing:
              "0.05em",

            textTransform:
              "uppercase",
          }}
        >
          Skill details
        </span>


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
          {skillCode ? (
            <span
              style={{
                color:
                  courseAccent,

                fontSize:
                  14,

                fontWeight:
                  750,
              }}
            >
              {skillCode}
            </span>
          ) : null}


          <span
            style={{
              color:
                theme.textPrimary,

              fontSize:
                17,

              fontWeight:
                700,

              lineHeight:
                1.25,
            }}
          >
            {skillTitle}
          </span>
        </div>


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
          }}
        >
          <span
            style={{
              color:
                theme.textMuted,

              fontSize:
                10,

              fontVariantNumeric:
                "tabular-nums",
            }}
          >
            {skillProgress.completed}
            {" / "}
            {skillProgress.total}
            {" "}
            {skillProgress.total ===
            1
              ? "subskill covered"
              : "subskills covered"}
          </span>


          <span
            style={{
              color:
                theme.textSecondary,

              fontSize:
                10,

              fontWeight:
                650,

              fontVariantNumeric:
                "tabular-nums",
            }}
          >
            {Math.round(
              skillProgress.progressPct
            )}
            %
          </span>
        </div>


        <ProgressBar
          progressPct={
            skillProgress.progressPct
          }
          accent={
            courseAccent
          }
          theme={
            theme
          }
        />
      </div>


      <div
        style={{
          display:
            "grid",

          gap:
            7,
        }}
      >
        <div
          style={{
            color:
              theme.textSecondary,

            fontSize:
              11,

            fontWeight:
              650,
          }}
        >
          Course specification subskills
        </div>


        {trackableConcepts.length >
        0 ? (
          <div
            style={{
              display:
                "grid",

              gap:
                5,
            }}
          >
            {trackableConcepts.map(
              (
                concept
              ) => {
                const covered =
                  completedConceptIds.includes(
                    concept.id
                  );


                return (
                  <button
                    key={
                      concept.id
                    }
                    type="button"
                    onClick={() =>
                      onSelectionChange({
                        kind:
                          "concept",

                        skillId:
                          skill.id,

                        conceptId:
                          concept.id,
                      })
                    }
                    style={{
                      width:
                        "100%",

                      minHeight:
                        38,

                      padding:
                        "7px 9px",

                      boxSizing:
                        "border-box",

                      display:
                        "grid",

                      gridTemplateColumns:
                        "minmax(0, 1fr) auto",

                      alignItems:
                        "center",

                      gap:
                        10,

                      borderWidth:
                        1,

                      borderStyle:
                        "solid",

                      borderColor:
                        theme.borderStandard,

                      borderRadius:
                        5,

                      background:
                        theme.bgSection,

                      color:
                        "inherit",

                      cursor:
                        "pointer",

                      fontFamily:
                        "inherit",

                      textAlign:
                        "left",
                    }}
                  >
                    <div
                      style={{
                        minWidth:
                          0,

                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap:
                          7,
                      }}
                    >
                      <span
                        style={{
                          flexShrink:
                            0,

                          color:
                            courseAccent,

                          fontSize:
                            10,

                          fontWeight:
                            750,
                        }}
                      >
                        {concept.code}
                      </span>


                      <span
                        style={{
                          minWidth:
                            0,

                          overflow:
                            "hidden",

                          color:
                            theme.textSecondary,

                          fontSize:
                            10.5,

                          whiteSpace:
                            "nowrap",

                          textOverflow:
                            "ellipsis",
                        }}
                      >
                        {concept.shortLabel ||
                          concept.label}
                      </span>
                    </div>


                    <span
                      style={{
                        width:
                          7,

                        height:
                          7,

                        borderRadius:
                          999,

                        background:
                          covered
                            ? courseAccent
                            : theme.borderStandard,

                        boxShadow:
                          covered
                            ? `0 0 6px ${courseAccent}`
                            : "none",
                      }}
                    />
                  </button>
                );
              }
            )}
          </div>
        ) : null}
      </div>


      {trackableConcepts.length >
      0 ? (
        <div
          style={{
            display:
              "grid",

            gap:
              14,
          }}
        >
          <div
            style={{
              paddingTop:
                2,

              color:
                theme.textSecondary,

              fontSize:
                11,

              fontWeight:
                650,
            }}
          >
            Representative questions across this skill
          </div>


          {trackableConcepts.map(
            (
              concept,
              index
            ) => (
              <section
                key={
                  concept.id
                }
                style={{
                  minWidth:
                    0,

                  paddingTop:
                    index ===
                    0
                      ? 0
                      : 12,

                  display:
                    "grid",

                  gap:
                    7,

                  borderTopWidth:
                    index ===
                    0
                      ? 0
                      : 1,

                  borderTopStyle:
                    "solid",

                  borderTopColor:
                    theme.borderStandard,
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    onSelectionChange({
                      kind:
                        "concept",

                      skillId:
                        skill.id,

                      conceptId:
                        concept.id,
                    })
                  }
                  style={{
                    width:
                      "fit-content",

                    padding:
                      0,

                    borderWidth:
                      0,

                    background:
                      "transparent",

                    color:
                      "inherit",

                    cursor:
                      "pointer",

                    fontFamily:
                      "inherit",

                    textAlign:
                      "left",
                  }}
                >
                  <span
                    style={{
                      color:
                        courseAccent,

                      fontSize:
                        10.5,

                      fontWeight:
                        750,
                    }}
                  >
                    {concept.code}
                  </span>

                  <span
                    style={{
                      marginLeft:
                        7,

                      color:
                        theme.textPrimary,

                      fontSize:
                        10.5,

                      fontWeight:
                        650,
                    }}
                  >
                    {concept.shortLabel ||
                      concept.label}
                  </span>
                </button>


                <ClassCoverageQuestionExamples
                  courseId={
                    courseId
                  }
                  skill={
                    skill
                  }
                  concept={
                    concept
                  }
                  theme={
                    theme
                  }
                  courseAccent={
                    courseAccent
                  }
                  displayMode="REPRESENTATIVE"
                  heading=""
                  questionNumberOffset={
                    index
                  }
                />
              </section>
            )
          )}
        </div>
      ) : (
        <div
          style={{
            color:
              theme.textMuted,

            fontSize:
              10.5,
          }}
        >
          No specification subskills are currently recorded for this skill.
        </div>
      )}
    </aside>
  );
}