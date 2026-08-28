import {
  useMemo,
  useState,
} from "react";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import type {
  ClassCoverageSelection,
} from "./ClassCoverageSelection";

import {
  getCategoryAccent,
  getCategoryCoverage,
  getCoverageCategoryEntries,
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

  onToggleSkillId:
    (
      skillId:
        string
    ) => void;

  onToggleConceptId:
    (
      conceptId:
        string
    ) => void;

  theme:
    AppTheme;

  courseAccent:
    string;
};


function CoverageCheckbox({
  checked,
  partial = false,
  accent,
  onClick,
}: {
  checked:
    boolean;

  partial?:
    boolean;

  accent:
    string;

  onClick:
    () => void;
}) {
  return (
    <button
      type="button"
      aria-label={
        checked
          ? "Mark as not covered"
          : "Mark as covered"
      }
      aria-pressed={
        checked
      }
      onClick={(
        event
      ) => {
        event.stopPropagation();

        onClick();
      }}
      style={{
        width:
          18,

        height:
          18,

        padding:
          0,

        flexShrink:
          0,

        display:
          "grid",

        placeItems:
          "center",

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          checked ||
          partial
            ? accent
            : "rgba(148,163,184,0.48)",

        borderRadius:
          4,

        background:
          checked
            ? accent
            : partial
              ? `color-mix(
                  in srgb,
                  ${accent} 24%,
                  transparent
                )`
              : "transparent",

        color:
          checked
            ? "#111111"
            : accent,

        cursor:
          "pointer",

        boxSizing:
          "border-box",

        fontSize:
          12,

        fontWeight:
          800,

        lineHeight:
          1,
      }}
    >
      {checked
        ? "✓"
        : partial
          ? "–"
          : ""}
    </button>
  );
}


function Chevron({
  open,
}: {
  open:
    boolean;
}) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 10 10"
      aria-hidden="true"
      style={{
        display:
          "block",

        transform:
          open
            ? "rotate(90deg)"
            : "rotate(0deg)",

        transition:
          "transform 120ms ease",
      }}
    >
      <path
        d="M3.4 2 6.6 5 3.4 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function InspectArrow() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 10 10"
      aria-hidden="true"
    >
      <path
        d="M3.4 2 6.6 5 3.4 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


export default function ClassCoverageTree({
  courseId,
  selection,
  onSelectionChange,
  completedSkillIds,
  completedConceptIds,
  onToggleSkillId,
  onToggleConceptId,
  theme,
  courseAccent,
}: Props) {
  const categoryEntries =
    useMemo(
      () =>
        getCoverageCategoryEntries(
          courseId
        ),
      [
        courseId,
      ]
    );


  const [
    expandedCategories,
    setExpandedCategories,
  ] =
    useState<
      Set<string>
    >(
      () =>
        new Set()
    );


  const [
    expandedSkills,
    setExpandedSkills,
  ] =
    useState<
      Set<string>
    >(
      () =>
        new Set()
    );


  function toggleCategory(
    categoryName:
      string
  ) {
    setExpandedCategories(
      (
        current
      ) => {
        const next =
          new Set(
            current
          );


        if (
          next.has(
            categoryName
          )
        ) {
          next.delete(
            categoryName
          );
        } else {
          next.add(
            categoryName
          );
        }


        return next;
      }
    );
  }


  function toggleSkillExpansion(
    skillId:
      string
  ) {
    setExpandedSkills(
      (
        current
      ) => {
        const next =
          new Set(
            current
          );


        if (
          next.has(
            skillId
          )
        ) {
          next.delete(
            skillId
          );
        } else {
          next.add(
            skillId
          );
        }


        return next;
      }
    );
  }


  function selectSkill({
    skillId,
    hasNestedConcepts,
  }: {
    skillId:
      string;

    hasNestedConcepts:
      boolean;
  }) {
    const alreadySelected =
      selection?.kind ===
        "skill" &&
      selection.skillId ===
        skillId;


    /*
     * Selection and expansion are deliberately
     * separate states.
     *
     * Clicking the selected skill again clears the
     * inspector without collapsing its subskills.
     */
    if (
      alreadySelected
    ) {
      onSelectionChange(
        null
      );

      return;
    }


    onSelectionChange({
      kind:
        "skill",

      skillId,
    });


    if (
      hasNestedConcepts &&
      !expandedSkills.has(
        skillId
      )
    ) {
      setExpandedSkills(
        (
          current
        ) => {
          const next =
            new Set(
              current
            );


          next.add(
            skillId
          );


          return next;
        }
      );
    }
  }


  function selectConcept({
    skillId,
    conceptId,
  }: {
    skillId:
      string;

    conceptId:
      string;
  }) {
    const alreadySelected =
      selection?.kind ===
        "concept" &&
      selection.conceptId ===
        conceptId;


    if (
      alreadySelected
    ) {
      onSelectionChange(
        null
      );

      return;
    }


    onSelectionChange({
      kind:
        "concept",

      skillId,

      conceptId,
    });
  }


  return (
    <div
      style={{
        minWidth:
          0,

        display:
          "grid",

        gap:
          8,

        alignContent:
          "start",
      }}
    >
      {categoryEntries.map(
        ([
          categoryName,
          categorySkills,
        ]) => {
          const categoryOpen =
            expandedCategories.has(
              categoryName
            );


          const categoryAccent =
            getCategoryAccent(
              categoryName
            );


          const categoryProgress =
            getCategoryCoverage(
              categorySkills,
              completedConceptIds,
              completedSkillIds
            );


          return (
            <section
              key={
                categoryName
              }
              style={{
                minWidth:
                  0,

                overflow:
                  "hidden",

                borderWidth:
                  1,

                borderStyle:
                  "solid",

                borderColor:
                  categoryOpen
                    ? `color-mix(
                        in srgb,
                        ${categoryAccent} 38%,
                        ${theme.borderStandard}
                      )`
                    : theme.borderStandard,

                borderRadius:
                  6,

                background:
                  theme.bgSurface,

                boxShadow:
                  categoryOpen
                    ? theme.shadow
                    : "none",

                transition:
                  [
                    "border-color 140ms ease",
                    "box-shadow 140ms ease",
                  ].join(
                    ", "
                  ),
              }}
            >
              <button
                type="button"
                onClick={() =>
                  toggleCategory(
                    categoryName
                  )
                }
                aria-expanded={
                  categoryOpen
                }
                style={{
                  width:
                    "100%",

                  minHeight:
                    50,

                  padding:
                    "8px 10px 10px",

                  boxSizing:
                    "border-box",

                  position:
                    "relative",

                  overflow:
                    "hidden",

                  display:
                    "grid",

                  gridTemplateColumns:
                    "minmax(0, 1fr) auto",

                  alignItems:
                    "center",

                  gap:
                    12,

                  borderWidth:
                    0,

                  background:
                    `linear-gradient(
                      90deg,
                      color-mix(
                        in srgb,
                        ${categoryAccent} 8%,
                        ${theme.bgSection}
                      ) 0%,
                      ${theme.bgSection} 72%
                    )`,

                  color:
                    theme.textPrimary,

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
                      8,
                  }}
                >
                  <span
                    style={{
                      display:
                        "grid",

                      placeItems:
                        "center",

                      color:
                        categoryAccent,
                    }}
                  >
                    <Chevron
                      open={
                        categoryOpen
                      }
                    />
                  </span>


                  <span
                    style={{
                      minWidth:
                        0,

                      overflow:
                        "hidden",

                      color:
                        theme.textPrimary,

                      fontSize:
                        13,

                      fontWeight:
                        700,

                      whiteSpace:
                        "nowrap",

                      textOverflow:
                        "ellipsis",
                    }}
                  >
                    {categoryName}
                  </span>
                </div>


                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "baseline",

                    gap:
                      5,

                    color:
                      theme.textSecondary,

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  <span
                    style={{
                      fontSize:
                        10,

                      fontWeight:
                        650,

                      fontVariantNumeric:
                        "tabular-nums",
                    }}
                  >
                    {categoryProgress.completed}
                    {" / "}
                    {categoryProgress.total}
                    {" outcomes"}
                  </span>


                  <span
                    aria-hidden="true"
                    style={{
                      color:
                        theme.textMuted,

                      fontSize:
                        9,
                    }}
                  >
                    ·
                  </span>


                  <span
                    style={{
                      color:
                        theme.textMuted,

                      fontSize:
                        9.5,

                      fontVariantNumeric:
                        "tabular-nums",
                    }}
                  >
                    {Math.round(
                      categoryProgress.progressPct
                    )}
                    %
                  </span>
                </div>


                <div
                  aria-hidden="true"
                  style={{
                    position:
                      "absolute",

                    left:
                      0,

                    right:
                      0,

                    bottom:
                      0,

                    height:
                      3,

                    background:
                      theme.borderStandard,
                  }}
                >
                  <div
                    style={{
                      width:
                        `${categoryProgress.progressPct}%`,

                      height:
                        "100%",

                      background:
                        categoryAccent,

                      boxShadow:
                        `0 0 7px color-mix(
                          in srgb,
                          ${categoryAccent} 55%,
                          transparent
                        )`,

                      transition:
                        "width 180ms ease",
                    }}
                  />
                </div>
              </button>


              {categoryOpen ? (
                <div
                  style={{
                    borderTopWidth:
                      1,

                    borderTopStyle:
                      "solid",

                    borderTopColor:
                      theme.borderStandard,
                  }}
                >
                  {categorySkills.map(
                    (
                      skill,
                      skillIndex
                    ) => {
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


                      const hasNestedConcepts =
                        trackableConcepts.length >
                        1;


                      const skillOpen =
                        expandedSkills.has(
                          skill.id
                        );


                      const skillProgress =
                        getSkillCoverage(
                          skill,
                          completedConceptIds,
                          completedSkillIds
                        );


                      const skillSelected =
                        selection?.kind ===
                          "skill" &&
                        selection.skillId ===
                          skill.id;


                      const skillPartial =
                        skillProgress.completed >
                          0 &&
                        !skillProgress.isComplete;


                      return (
                        <div
                          key={
                            skill.id
                          }
                          style={{
                            borderTopWidth:
                              skillIndex ===
                              0
                                ? 0
                                : 1,

                            borderTopStyle:
                              "solid",

                            borderTopColor:
                              theme.borderStandard,

                            background:
                              skillSelected
                                ? `color-mix(
                                    in srgb,
                                    ${courseAccent} 10%,
                                    ${theme.bgSurface}
                                  )`
                                : theme.bgSurface,
                          }}
                        >
                          <div
                            style={{
                              minHeight:
                                52,

                              padding:
                                "0 9px",

                              boxSizing:
                                "border-box",

                              display:
                                "grid",

                              gridTemplateColumns:
                                "20px minmax(0, 1fr) 58px 26px",

                              alignItems:
                                "center",

                              gap:
                                8,
                            }}
                          >
                            <CoverageCheckbox
                              checked={
                                skillProgress.isComplete
                              }
                              partial={
                                skillPartial
                              }
                              accent={
                                categoryAccent
                              }
                              onClick={() =>
                                onToggleSkillId(
                                  skill.id
                                )
                              }
                            />


                            <button
                              type="button"
                              onClick={() =>
                                selectSkill({
                                  skillId:
                                    skill.id,

                                  hasNestedConcepts,
                                })
                              }
                              style={{
                                minWidth:
                                  0,

                                minHeight:
                                  50,

                                padding:
                                  "6px 0",

                                display:
                                  "grid",

                                alignContent:
                                  "center",

                                gap:
                                  3,

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
                                {skillCode ? (
                                  <span
                                    style={{
                                      flexShrink:
                                        0,

                                      color:
                                        categoryAccent,

                                      fontSize:
                                        10.5,

                                      fontWeight:
                                        750,

                                      lineHeight:
                                        1.2,
                                    }}
                                  >
                                    {skillCode}
                                  </span>
                                ) : null}


                                <span
                                  style={{
                                    minWidth:
                                      0,

                                    overflow:
                                      "hidden",

                                    color:
                                      theme.textPrimary,

                                    fontSize:
                                      11.5,

                                    fontWeight:
                                      skillSelected
                                        ? 700
                                        : 600,

                                    lineHeight:
                                      1.2,

                                    whiteSpace:
                                      "nowrap",

                                    textOverflow:
                                      "ellipsis",
                                  }}
                                >
                                  {skillTitle}
                                </span>
                              </div>


                              <span
                                style={{
                                  color:
                                    theme.textMuted,

                                  fontSize:
                                    9.5,

                                  lineHeight:
                                    1.2,
                                }}
                              >
                                {skillProgress.completed}
                                {" / "}
                                {skillProgress.total}
                                {" "}
                                {skillProgress.total ===
                                1
                                  ? "outcome"
                                  : "outcomes"}
                              </span>
                            </button>


                            <div
                              style={{
                                width:
                                  58,

                                display:
                                  "grid",

                                gap:
                                  3,
                              }}
                            >
                              <div
                                style={{
                                  height:
                                    3,

                                  overflow:
                                    "hidden",

                                  borderRadius:
                                    3,

                                  background:
                                    theme.borderStandard,
                                }}
                              >
                                <div
                                  style={{
                                    width:
                                      `${skillProgress.progressPct}%`,

                                    height:
                                      "100%",

                                    background:
                                      categoryAccent,
                                  }}
                                />
                              </div>


                              {hasNestedConcepts ? (
                                <span
                                  style={{
                                    color:
                                      theme.textMuted,

                                    fontSize:
                                      8.5,

                                    lineHeight:
                                      1,

                                    textAlign:
                                      "right",
                                  }}
                                >
                                  subskills
                                </span>
                              ) : null}
                            </div>


                            {hasNestedConcepts ? (
                              <button
                                type="button"
                                aria-expanded={
                                  skillOpen
                                }
                                title={
                                  skillOpen
                                    ? "Hide subskills"
                                    : "Show subskills"
                                }
                                onClick={() =>
                                  toggleSkillExpansion(
                                    skill.id
                                  )
                                }
                                style={{
                                  width:
                                    26,

                                  height:
                                    26,

                                  padding:
                                    0,

                                  display:
                                    "grid",

                                  placeItems:
                                    "center",

                                  borderWidth:
                                    1,

                                  borderStyle:
                                    "solid",

                                  borderColor:
                                    skillOpen
                                      ? `color-mix(
                                          in srgb,
                                          ${categoryAccent} 40%,
                                          ${theme.borderStandard}
                                        )`
                                      : "transparent",

                                  borderRadius:
                                    4,

                                  background:
                                    skillOpen
                                      ? `color-mix(
                                          in srgb,
                                          ${categoryAccent} 8%,
                                          ${theme.bgSection}
                                        )`
                                      : "transparent",

                                  color:
                                    skillOpen
                                      ? categoryAccent
                                      : theme.textMuted,

                                  cursor:
                                    "pointer",
                                }}
                              >
                                <Chevron
                                  open={
                                    skillOpen
                                  }
                                />
                              </button>
                            ) : (
                              <span
                                style={{
                                  width:
                                    26,

                                  height:
                                    26,

                                  display:
                                    "grid",

                                  placeItems:
                                    "center",

                                  color:
                                    theme.textMuted,
                                }}
                              >
                                <InspectArrow />
                              </span>
                            )}
                          </div>


                          {hasNestedConcepts &&
                          skillOpen ? (
                            <div
                              style={{
                                padding:
                                  "0 8px 8px 36px",

                                display:
                                  "grid",

                                gap:
                                  3,
                              }}
                            >
                              <div
                                style={{
                                  padding:
                                    "5px 8px 4px",

                                  color:
                                    theme.textMuted,

                                  fontSize:
                                    8.5,

                                  fontWeight:
                                    650,

                                  letterSpacing:
                                    "0.04em",

                                  textTransform:
                                    "uppercase",
                                }}
                              >
                                Specification subskills
                              </div>


                              {trackableConcepts.map(
                                (
                                  concept
                                ) => {
                                  const conceptSelected =
                                    selection?.kind ===
                                      "concept" &&
                                    selection.conceptId ===
                                      concept.id;


                                  const conceptCompleted =
                                    completedConceptIds.includes(
                                      concept.id
                                    );


                                  return (
                                    <div
                                      key={
                                        concept.id
                                      }
                                      style={{
                                        minHeight:
                                          38,

                                        padding:
                                          "0 7px",

                                        boxSizing:
                                          "border-box",

                                        display:
                                          "grid",

                                        gridTemplateColumns:
                                          "20px minmax(0, 1fr) 18px",

                                        alignItems:
                                          "center",

                                        gap:
                                          7,

                                        borderWidth:
                                          1,

                                        borderStyle:
                                          "solid",

                                        borderColor:
                                          conceptSelected
                                            ? `color-mix(
                                                in srgb,
                                                ${categoryAccent} 52%,
                                                ${theme.borderStandard}
                                              )`
                                            : theme.borderStandard,

                                        borderRadius:
                                          5,

                                        background:
                                          conceptSelected
                                            ? `color-mix(
                                                in srgb,
                                                ${categoryAccent} 10%,
                                                ${theme.bgSection}
                                              )`
                                            : theme.bgSection,
                                      }}
                                    >
                                      <CoverageCheckbox
                                        checked={
                                          conceptCompleted
                                        }
                                        accent={
                                          categoryAccent
                                        }
                                        onClick={() =>
                                          onToggleConceptId(
                                            concept.id
                                          )
                                        }
                                      />


                                      <button
                                        type="button"
                                        onClick={() =>
                                          selectConcept({
                                            skillId:
                                              skill.id,

                                            conceptId:
                                              concept.id,
                                          })
                                        }
                                        style={{
                                          minWidth:
                                            0,

                                          height:
                                            36,

                                          padding:
                                            0,

                                          display:
                                            "grid",

                                          gridTemplateColumns:
                                            "54px minmax(0, 1fr)",

                                          alignItems:
                                            "center",

                                          gap:
                                            7,

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
                                              categoryAccent,

                                            fontSize:
                                              10,

                                            fontWeight:
                                              750,

                                            lineHeight:
                                              1,

                                            fontVariantNumeric:
                                              "tabular-nums",

                                            whiteSpace:
                                              "nowrap",
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
                                              conceptCompleted
                                                ? theme.textPrimary
                                                : theme.textSecondary,

                                            fontSize:
                                              10.5,

                                            fontWeight:
                                              conceptSelected
                                                ? 650
                                                : 500,

                                            lineHeight:
                                              1,

                                            whiteSpace:
                                              "nowrap",

                                            textOverflow:
                                              "ellipsis",
                                          }}
                                        >
                                          {concept.shortLabel ||
                                            concept.label}
                                        </span>
                                      </button>


                                      <span
                                        style={{
                                          display:
                                            "grid",

                                          placeItems:
                                            "center",

                                          color:
                                            conceptSelected
                                              ? categoryAccent
                                              : theme.textMuted,
                                        }}
                                      >
                                        <InspectArrow />
                                      </span>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          ) : null}
                        </div>
                      );
                    }
                  )}
                </div>
              ) : null}
            </section>
          );
        }
      )}
    </div>
  );
}