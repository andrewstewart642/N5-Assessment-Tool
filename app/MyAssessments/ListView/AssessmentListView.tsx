import Link from "next/link";

import type {
  ReactNode,
} from "react";

import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import {
  setCurrentSavedAssessmentId,
} from "@/app/Assessments/SavedAssessments/SavedAssessmentsStorage";

import {
  getCourseAccentTextColour,
} from "@/app/UI/Application/Colours/CourseAccent";

import {
  useCourseColourPreferences,
} from "@/app/UI/Application/Colours/useCourseColourPreferences";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  formatAssessmentDate,
  formatDate,
  formatTime,
  getAssessmentCourseId,
  getAssessmentCourseLabel,
  getAssessmentCoverageLabel,
  getAssessmentStatusLabel,
  getAssessmentTypeLabel,
} from "../Display/AssessmentDisplayMetadata";

import {
  getAssessmentPaperProgress,
  getOverallProgressPct,
} from "../Display/AssessmentProgressDisplay";

import AssessmentListPreviewButton from "./AssessmentListPreviewButton";


const LIST_GRID_COLUMNS =
  [
    "minmax(235px, 1.55fr)",
    "minmax(185px, 1fr)",
    "118px",
    "176px",
    "90px",
    "100px",
    "310px",
  ].join(
    " "
  );


const LIST_COLUMN_GAP =
  10;


type AssessmentListViewProps = {
  savedAssessments:
    SavedAssessment[];

  theme:
    AppTheme;

  onDuplicate:
    (
      assessment:
        SavedAssessment
    ) => void;

  onDelete:
    (
      assessment:
        SavedAssessment
    ) => void;

  onTogglePinned:
    (
      assessment:
        SavedAssessment
    ) => void;
};


type CompactActionButtonProps = {
  label:
    string;

  theme:
    AppTheme;

  danger?:
    boolean;

  active?:
    boolean;

  onClick:
    () => void;

  icon:
    ReactNode;
};


function CompactActionButton({
  label,
  theme,
  danger =
    false,
  active =
    false,
  onClick,
  icon,
}: CompactActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={
        label
      }
      title={
        label
      }
      onClick={
        onClick
      }
      style={{
        height:
          30,

        padding:
          "0 8px",

        boxSizing:
          "border-box",

        flexShrink:
          0,

        display:
          "inline-flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        gap:
          5,

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          active
            ? theme.controlSelectedBorder
            : theme.borderStandard,

        borderRadius:
          5,

        background:
          active
            ? theme.controlSelectedBg
            : theme.controlBg,

        color:
          danger
            ? theme.danger
            : active
              ? theme.textPrimary
              : theme.textSecondary,

        cursor:
          "pointer",

        fontFamily:
          "inherit",

        fontSize:
          10.5,

        fontWeight:
          600,

        whiteSpace:
          "nowrap",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display:
            "grid",

          placeItems:
            "center",

          flexShrink:
            0,
        }}
      >
        {icon}
      </span>

      {label}
    </button>
  );
}


function StatusBadge({
  assessment,
  theme,
}: {
  assessment:
    SavedAssessment;

  theme:
    AppTheme;
}) {
  const complete =
    assessment.status ===
    "COMPLETE";


  return (
    <span
      style={{
        width:
          "fit-content",

        height:
          22,

        padding:
          "0 6px",

        boxSizing:
          "border-box",

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
          theme.borderStandard,

        borderRadius:
          4,

        background:
          theme.bgSection,

        color:
          theme.textSecondary,

        fontSize:
          10.5,

        whiteSpace:
          "nowrap",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width:
            5,

          height:
            5,

          flexShrink:
            0,

          borderRadius:
            999,

          background:
            complete
              ? theme.success
              : theme.accentPrimary,

          boxShadow:
            complete
              ? `0 0 0 2px ${theme.successSoft}`
              : "none",
        }}
      />

      {getAssessmentStatusLabel(
        assessment
      )}
    </span>
  );
}


function ProgressCell({
  assessment,
  theme,
  courseAccent,
}: {
  assessment:
    SavedAssessment;

  theme:
    AppTheme;

  courseAccent:
    string;
}) {
  const papers =
    getAssessmentPaperProgress(
      assessment
    );


  const overall =
    getOverallProgressPct(
      assessment
    );


  return (
    <div
      style={{
        minWidth:
          0,

        display:
          "grid",

        gap:
          6,
      }}
    >
      <div
        title={`${Math.round(
          overall
        )}% total progress`}
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
              `${overall}%`,

            height:
              "100%",

            background:
              theme.success,

            boxShadow:
              overall >
              0
                ? `0 0 6px ${theme.successSoft}`
                : "none",

            transition:
              "width 180ms ease",
          }}
        />
      </div>


      <div
        style={{
          display:
            "grid",

          gap:
            4,
        }}
      >
        {papers.map(
          (
            paper
          ) => (
            <div
              key={
                paper.paper
              }
              style={{
                minWidth:
                  0,

                display:
                  "grid",

                gridTemplateColumns:
                  "18px 48px minmax(0, 1fr)",

                alignItems:
                  "center",

                gap:
                  5,
              }}
            >
              <span
                style={{
                  color:
                    theme.textMuted,

                  fontSize:
                    10,

                  fontWeight:
                    600,

                  whiteSpace:
                    "nowrap",
                }}
              >
                {paper.paper}
              </span>


              <span
                style={{
                  color:
                    theme.textSecondary,

                  fontSize:
                    10,

                  fontVariantNumeric:
                    "tabular-nums",

                  whiteSpace:
                    "nowrap",
                }}
              >
                {paper.assignedMarks}
                {" / "}
                {paper.targetMarks}
              </span>


              <div
                style={{
                  minWidth:
                    0,

                  height:
                    2,

                  overflow:
                    "hidden",

                  borderRadius:
                    2,

                  background:
                    `color-mix(
                      in srgb,
                      ${courseAccent} 12%,
                      ${theme.borderStandard}
                    )`,
                }}
              >
                <div
                  style={{
                    width:
                      `${paper.progressPct}%`,

                    height:
                      "100%",

                    borderRadius:
                      2,

                    background:
                      courseAccent,

                    transition:
                      "width 180ms ease",
                  }}
                />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}


function LastEditedCell({
  assessment,
  theme,
}: {
  assessment:
    SavedAssessment;

  theme:
    AppTheme;
}) {
  const editedTime =
    formatTime(
      assessment.updatedAt
    );

  const editedDate =
    formatDate(
      assessment.updatedAt
    );

  const createdDate =
    formatDate(
      assessment.createdAt
    );


  return (
    <div
      style={{
        width:
          "100%",

        display:
          "grid",

        justifyItems:
          "end",

        gap:
          3,

        fontVariantNumeric:
          "tabular-nums",
      }}
    >
      <div
        style={{
          display:
            "flex",

          alignItems:
            "baseline",

          justifyContent:
            "flex-end",

          gap:
            12,

          color:
            theme.textSecondary,

          fontSize:
            11,

          whiteSpace:
            "nowrap",
        }}
      >
        <span>
          {editedTime}
        </span>

        <span>
          {editedDate}
        </span>
      </div>


      <div
        style={{
          display:
            "flex",

          alignItems:
            "baseline",

          justifyContent:
            "flex-end",

          gap:
            10,

          color:
            theme.textMuted,

          fontSize:
            10,

          whiteSpace:
            "nowrap",
        }}
      >
        <span>
          Created
        </span>

        <span>
          {createdDate}
        </span>
      </div>
    </div>
  );
}


export default function AssessmentListView({
  savedAssessments,
  theme,
  onDuplicate,
  onDelete,
  onTogglePinned,
}: AssessmentListViewProps) {
  const {
    getColour,
  } =
    useCourseColourPreferences();


  return (
    <section
      aria-label="Assessment list"
      style={{
        minWidth:
          0,

        width:
          "100%",

        overflow:
          "hidden",

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          theme.borderStandard,

        borderRadius:
          6,

        background:
          theme.bgSurface,

        boxShadow:
          theme.shadow,
      }}
    >
      <div
        style={{
          width:
            "100%",

          minWidth:
            0,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            minHeight:
              36,

            padding:
              "0 8px",

            boxSizing:
              "border-box",

            display:
              "grid",

            gridTemplateColumns:
              LIST_GRID_COLUMNS,

            alignItems:
              "center",

            gap:
              LIST_COLUMN_GAP,

            borderBottomWidth:
              1,

            borderBottomStyle:
              "solid",

            borderBottomColor:
              theme.borderStandard,

            background:
              `linear-gradient(
                180deg,
                ${theme.bgSection} 0%,
                ${theme.bgSurface} 130%
              )`,

            color:
              theme.textMuted,

            fontSize:
              10,

            fontWeight:
              600,

            textTransform:
              "uppercase",

            letterSpacing:
              "0.04em",
          }}
        >
          <span>
            Assessment
          </span>

          <span>
            Progress
          </span>

          <span
            style={{
              textAlign:
                "center",
            }}
          >
            Assessment date
          </span>

          <span
            style={{
              textAlign:
                "right",
            }}
          >
            Last edited
          </span>

          <span
            style={{
              textAlign:
                "center",
            }}
          >
            Status
          </span>

          <span
            style={{
              textAlign:
                "center",
            }}
          >
            Preview
          </span>

          <span
            style={{
              textAlign:
                "right",
            }}
          >
            Actions
          </span>
        </div>


        {savedAssessments.map(
          (
            assessment,
            index
          ) => {
            const title =
              assessment.setup
                .assessmentName
                .trim() ||
              "[Untitled file]";


            const courseId =
              getAssessmentCourseId(
                assessment
              );


            const courseAccent =
              courseId
                ? getColour(
                    courseId
                  )
                : theme.accentPrimary;


            const courseAccentText =
              getCourseAccentTextColour(
                courseAccent,
                theme
              );


            return (
              <article
                key={
                  assessment.id
                }
                style={{
                  minHeight:
                    76,

                  padding:
                    "8px 8px 8px 11px",

                  boxSizing:
                    "border-box",

                  display:
                    "grid",

                  gridTemplateColumns:
                    LIST_GRID_COLUMNS,

                  alignItems:
                    "center",

                  gap:
                    LIST_COLUMN_GAP,

                  borderBottomWidth:
                    index ===
                    savedAssessments.length -
                      1
                      ? 0
                      : 1,

                  borderBottomStyle:
                    "solid",

                  borderBottomColor:
                    theme.borderStandard,

                  background:
                    `linear-gradient(
                      90deg,
                      color-mix(
                        in srgb,
                        ${courseAccent} 8%,
                        ${theme.bgSurface}
                      ) 0%,
                      color-mix(
                        in srgb,
                        ${courseAccent} 3%,
                        ${theme.bgSurface}
                      ) 22%,
                      ${theme.bgSurface} 58%
                    )`,

                  boxShadow:
                    `inset 3px 0 0 ${courseAccent}`,
                }}
              >
                <div
                  style={{
                    minWidth:
                      0,

                    display:
                      "grid",

                    gap:
                      3,
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
                        6,
                    }}
                  >
                    <span
                      title={
                        title
                      }
                      style={{
                        minWidth:
                          0,

                        overflow:
                          "hidden",

                        whiteSpace:
                          "nowrap",

                        textOverflow:
                          "ellipsis",

                        color:
                          theme.textPrimary,

                        fontSize:
                          13,

                        fontWeight:
                          700,

                        lineHeight:
                          1.2,
                      }}
                    >
                      {title}
                    </span>


                    {assessment.isPinned ? (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 16 16"
                        aria-label="Pinned"
                        style={{
                          flexShrink:
                            0,

                          color:
                            courseAccent,
                        }}
                      >
                        <path
                          d="M5.1 2.2h5.8l-.9 3.2 2.1 2.1v1H8.7v4.8L8 14l-.7-.7V8.5H3.9v-1L6 5.4l-.9-3.2Z"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </div>


                  <div
                    style={{
                      minWidth:
                        0,

                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap:
                        5,

                      overflow:
                        "hidden",

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width:
                          6,

                        height:
                          6,

                        flexShrink:
                          0,

                        borderRadius:
                          999,

                        background:
                          courseAccent,

                        boxShadow:
                          `0 0 6px ${courseAccent}`,
                      }}
                    />


                    <span
                      style={{
                        overflow:
                          "hidden",

                        color:
                          courseAccentText,

                        fontSize:
                          11,

                        fontWeight:
                          600,

                        whiteSpace:
                          "nowrap",

                        textOverflow:
                          "ellipsis",
                      }}
                    >
                      {getAssessmentCourseLabel(
                        assessment
                      )}
                    </span>


                    <span
                      style={{
                        flexShrink:
                          0,

                        color:
                          theme.textMuted,

                        fontSize:
                          11,
                      }}
                    >
                      ·
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
                          11,

                        whiteSpace:
                          "nowrap",

                        textOverflow:
                          "ellipsis",
                      }}
                    >
                      {getAssessmentTypeLabel(
                        assessment
                      )}
                    </span>
                  </div>


                  <div
                    style={{
                      minWidth:
                        0,

                      overflow:
                        "hidden",

                      whiteSpace:
                        "nowrap",

                      textOverflow:
                        "ellipsis",

                      color:
                        theme.textMuted,

                      fontSize:
                        10,
                    }}
                  >
                    {getAssessmentCoverageLabel(
                      assessment
                    )}
                  </div>
                </div>


                <ProgressCell
                  assessment={
                    assessment
                  }
                  theme={
                    theme
                  }
                  courseAccent={
                    courseAccent
                  }
                />


                <span
                  style={{
                    color:
                      theme.textSecondary,

                    fontSize:
                      11,

                    fontVariantNumeric:
                      "tabular-nums",

                    textAlign:
                      "center",

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {formatAssessmentDate(
                    assessment.setup
                      .assessmentDate
                  )}
                </span>


                <LastEditedCell
                  assessment={
                    assessment
                  }
                  theme={
                    theme
                  }
                />


                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",
                  }}
                >
                  <StatusBadge
                    assessment={
                      assessment
                    }
                    theme={
                      theme
                    }
                  />
                </div>


                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",
                  }}
                >
                  <AssessmentListPreviewButton
                    savedAssessment={
                      assessment
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
                      "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "flex-end",

                    gap:
                      5,

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  <CompactActionButton
                    label={
                      assessment.isPinned
                        ? "Unpin"
                        : "Pin"
                    }
                    theme={
                      theme
                    }
                    active={
                      assessment.isPinned
                    }
                    onClick={() =>
                      onTogglePinned(
                        assessment
                      )
                    }
                    icon={
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M5.1 2.2h5.8l-.9 3.2 2.1 2.1v1H8.7v4.8L8 14l-.7-.7V8.5H3.9v-1L6 5.4l-.9-3.2Z"
                          fill={
                            assessment.isPinned
                              ? "currentColor"
                              : "none"
                          }
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />


                  <CompactActionButton
                    label="Duplicate"
                    theme={
                      theme
                    }
                    onClick={() =>
                      onDuplicate(
                        assessment
                      )
                    }
                    icon={
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 16 16"
                      >
                        <rect
                          x="5"
                          y="5"
                          width="8"
                          height="8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />

                        <path
                          d="M3 10H2.5V2.5H10V3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                      </svg>
                    }
                  />


                  <CompactActionButton
                    label="Delete"
                    theme={
                      theme
                    }
                    danger
                    onClick={() =>
                      onDelete(
                        assessment
                      )
                    }
                    icon={
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M4.5 5v7.5h7V5M3.5 3.5h9M6 3.5V2h4v1.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />


                  <Link
                    href="/create-assessment/builder"
                    title="Open assessment"
                    onClick={() =>
                      setCurrentSavedAssessmentId(
                        assessment.id
                      )
                    }
                    style={{
                      height:
                        30,

                      padding:
                        "0 9px",

                      boxSizing:
                        "border-box",

                      flexShrink:
                        0,

                      display:
                        "inline-flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      gap:
                        5,

                      borderWidth:
                        1,

                      borderStyle:
                        "solid",

                      borderColor:
                        theme.controlSelectedBorder,

                      borderRadius:
                        5,

                      background:
                        theme.controlSelectedBg,

                      color:
                        theme.textPrimary,

                      textDecoration:
                        "none",

                      fontSize:
                        11,

                      fontWeight:
                        600,

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    Open

                    <svg
                      width="9"
                      height="9"
                      viewBox="0 0 10 10"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 5h5M5 2.5 7.5 5 5 7.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            );
          }
        )}
      </div>
    </section>
  );
}