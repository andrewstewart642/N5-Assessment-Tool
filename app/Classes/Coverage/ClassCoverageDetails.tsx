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


function CoverageStatus({
  covered,
  theme,
}: {
  covered:
    boolean;

  theme:
    AppTheme;
}) {
  const colour =
    covered
      ? theme.success
      : theme.danger;


  const softColour =
    covered
      ? theme.successSoft
      : theme.dangerSoft;


  const label =
    covered
      ? "Covered"
      : "Not yet covered";


  return (
    <div
      role="status"
      aria-label={
        label
      }
      style={{
        minHeight:
          26,

        padding:
          "5px 8px",

        boxSizing:
          "border-box",

        display:
          "inline-flex",

        alignItems:
          "center",

        gap:
          7,

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          theme.borderStandard,

        borderRadius:
          6,

        background:
          theme.bgElevated,

        color:
          colour,

        boxShadow:
          theme.shadow,

        fontSize:
          10,

        fontWeight:
          700,

        lineHeight:
          1,

        whiteSpace:
          "nowrap",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width:
            7,

          height:
            7,

          flexShrink:
            0,

          borderRadius:
            999,

          background:
            colour,

          boxShadow:
            `0 0 0 2px ${softColour}`,
        }}
      />

      <span>
        {label}
      </span>
    </div>
  );
}


function DetailsIdentityRow({
  label,
  code,
  title,
  theme,
  courseAccent,
}: {
  label:
    string;

  code?:
    string;

  title:
    string;

  theme:
    AppTheme;

  courseAccent:
    string;
}) {
  return (
    <div
      style={{
        minWidth:
          0,

        display:
          "grid",

        gridTemplateColumns:
          "58px 8px minmax(0, 1fr)",

        alignItems:
          "baseline",

        columnGap:
          5,
      }}
    >
      <span
        style={{
          color:
            theme.textMuted,

          fontSize:
            10.5,

          fontWeight:
            600,

          textAlign:
            "right",

          whiteSpace:
            "nowrap",
        }}
      >
        {label}
      </span>


      <span
        aria-hidden="true"
        style={{
          color:
            theme.textMuted,

          fontSize:
            10.5,

          fontWeight:
            600,

          textAlign:
            "center",
        }}
      >
        :
      </span>


      <div
        style={{
          minWidth:
            0,

          display:
            "flex",

          alignItems:
            "baseline",

          gap:
            6,

          color:
            theme.textPrimary,

          fontSize:
            11.5,

          fontWeight:
            650,

          lineHeight:
            1.35,
        }}
      >
        {code ? (
          <span
            style={{
              flexShrink:
                0,

              color:
                courseAccent,

              fontWeight:
                750,

              fontVariantNumeric:
                "tabular-nums",
            }}
          >
            {code}
          </span>
        ) : null}


        <span
          style={{
            minWidth:
              0,

            overflow:
              "hidden",

            textOverflow:
              "ellipsis",
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}


function DetailsHeader({
  skillCode,
  skillTitle,
  subskillCode,
  subskillTitle,
  covered,
  onClear,
  theme,
  courseAccent,
}: {
  skillCode:
    string;

  skillTitle:
    string;

  subskillCode?:
    string;

  subskillTitle?:
    string;

  covered:
    boolean;

  onClear:
    () => void;

  theme:
    AppTheme;

  courseAccent:
    string;
}) {
  return (
    <div
      style={{
        minWidth:
          0,

        display:
          "grid",

        gap:
          11,

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
          minWidth:
            0,

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
        <button
          type="button"
          title="Clear selection"
          aria-label="Clear Skills Details selection"
          onClick={
            onClear
          }
          style={{
            padding:
              0,

            display:
              "inline-flex",

            alignItems:
              "center",

            gap:
              6,

            borderWidth:
              0,

            background:
              "transparent",

            color:
              theme.textSecondary,

            cursor:
              "pointer",

            fontFamily:
              "inherit",

            fontSize:
              11,

            fontWeight:
              700,

            lineHeight:
              1.2,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              color:
                theme.textMuted,

              fontSize:
                13,
            }}
          >
            ←
          </span>

          Skills Details
        </button>


        <CoverageStatus
          covered={
            covered
          }
          theme={
            theme
          }
        />
      </div>


      <div
        style={{
          minWidth:
            0,

          display:
            "grid",

          gap:
            5,
        }}
      >
        <DetailsIdentityRow
          label="Skill"
          code={
            skillCode
          }
          title={
            skillTitle
          }
          theme={
            theme
          }
          courseAccent={
            courseAccent
          }
        />


        <DetailsIdentityRow
          label="Subskill"
          code={
            subskillCode
          }
          title={
            subskillTitle ??
            "—"
          }
          theme={
            theme
          }
          courseAccent={
            courseAccent
          }
        />
      </div>
    </div>
  );
}


function EmptyDetails({
  theme,
  courseAccent,
}: {
  theme:
    AppTheme;

  courseAccent:
    string;
}) {
  return (
    <aside
      style={{
        minWidth:
          0,

        minHeight:
          280,

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
            ${courseAccent} 24%,
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
            ${theme.bgSurface} 52%
          )`,
      }}
    >
      <div
        style={{
          paddingBottom:
            11,

          borderBottomWidth:
            1,

          borderBottomStyle:
            "solid",

          borderBottomColor:
            theme.borderStandard,

          color:
            theme.textSecondary,

          fontSize:
            11,

          fontWeight:
            700,
        }}
      >
        Skills Details
      </div>


      <div
        style={{
          minHeight:
            190,

          display:
            "grid",

          placeItems:
            "center",

          textAlign:
            "center",
        }}
      >
        <span
          style={{
            maxWidth:
              300,

            color:
              theme.textMuted,

            fontSize:
              10.5,

            lineHeight:
              1.5,
          }}
        >
          Select a skill or subskill to inspect its representative generated question range.
        </span>
      </div>
    </aside>
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
      <EmptyDetails
        theme={
          theme
        }
        courseAccent={
          courseAccent
        }
      />
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


  /*
   * Individual subskill view.
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
        <DetailsHeader
          skillCode={
            skillCode
          }
          skillTitle={
            skillTitle
          }
          subskillCode={
            concept.code
          }
          subskillTitle={
            concept.shortLabel ||
            concept.label
          }
          covered={
            covered
          }
          onClear={() =>
            onSelectionChange(
              null
            )
          }
          theme={
            theme
          }
          courseAccent={
            courseAccent
          }
        />


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
            color:
              theme.textMuted,

            fontSize:
              9.5,

            lineHeight:
              1.45,
          }}
        >
          The examples above represent the available generated range for this subskill. Refresh any example to see another question at the same underlying generator level.
        </div>
      </aside>
    );
  }


  /*
   * Parent skill view.
   *
   * The tree already communicates specification
   * structure and coverage. The inspector therefore
   * focuses on what the actual generated assessment
   * questions look like across the skill.
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
      <DetailsHeader
        skillCode={
          skillCode
        }
        skillTitle={
          skillTitle
        }
        subskillTitle="—"
        covered={
          skillProgress.isComplete
        }
        onClear={() =>
          onSelectionChange(
            null
          )
        }
        theme={
          theme
        }
        courseAccent={
          courseAccent
        }
      />


      {trackableConcepts.length >
      0 ? (
        <div
          style={{
            minWidth:
              0,

            display:
              "grid",

            gap:
              14,
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
            Representative question range
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

                      fontVariantNumeric:
                        "tabular-nums",
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


          <div
            style={{
              color:
                theme.textMuted,

              fontSize:
                9.5,

              lineHeight:
                1.45,
            }}
          >
            Select an individual subskill to inspect its full generated question range.
          </div>
        </div>
      ) : (
        <div
          style={{
            color:
              theme.textMuted,

            fontSize:
              10.5,

            lineHeight:
              1.45,
          }}
        >
          Generated examples are not currently available for this skill.
        </div>
      )}
    </aside>
  );
}