import Link from "next/link";

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
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import {
  formatAssessmentDate,
  formatDate,
  formatDateTime,
  formatTime,
  getAssessmentCourseId,
  getAssessmentCourseLabel,
  getAssessmentCoverageLabel,
  getAssessmentStatusLabel,
  getAssessmentTypeLabel,
} from "../Display/LabelsAndDates";

import AssessmentPreviewViewport from "./AssessmentPreviewViewport";

import AssessmentTileProgress, {
  AssessmentOverallProgressBar,
} from "./AssessmentTileProgress";


type AssessmentTileProps = {
  savedAssessment:
    SavedAssessment;

  onDuplicate: (
    savedAssessment:
      SavedAssessment
  ) => void;

  onDelete: (
    savedAssessment:
      SavedAssessment
  ) => void;

  onTogglePinned: (
    savedAssessment:
      SavedAssessment
  ) => void;

  theme:
    AppTheme;
};


function StatusBadge({
  savedAssessment,
  theme,
}: {
  savedAssessment:
    SavedAssessment;

  theme:
    AppTheme;
}) {
  const complete =
    savedAssessment.status ===
    "COMPLETE";


  return (
    <div
      style={{
        height:
          20,

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

        whiteSpace:
          "nowrap",

        ...UI_TEXT.chipTextSmall,
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
        savedAssessment
      )}
    </div>
  );
}


function PinButton({
  pinned,
  onClick,
  theme,
}: {
  pinned:
    boolean;

  onClick:
    () => void;

  theme:
    AppTheme;
}) {
  return (
    <button
      type="button"
      aria-label={
        pinned
          ? "Unpin assessment"
          : "Pin assessment"
      }
      aria-pressed={
        pinned
      }
      title={
        pinned
          ? "Unpin assessment"
          : "Pin assessment"
      }
      onClick={
        onClick
      }
      style={{
        width:
          24,

        height:
          24,

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
          pinned
            ? theme.controlSelectedBorder
            : "transparent",

        borderRadius:
          4,

        background:
          pinned
            ? theme.controlSelectedBg
            : "transparent",

        color:
          pinned
            ? theme.textPrimary
            : theme.textMuted,

        cursor:
          "pointer",
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path
          d="M5.1 2.2h5.8l-.9 3.2 2.1 2.1v1H8.7v4.8L8 14l-.7-.7V8.5H3.9v-1L6 5.4l-.9-3.2Z"
          fill={
            pinned
              ? "currentColor"
              : "none"
          }
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}


function AssessmentMetadata({
  savedAssessment,
  theme,
}: {
  savedAssessment:
    SavedAssessment;

  theme:
    AppTheme;
}) {
  const assessmentDate =
    formatAssessmentDate(
      savedAssessment.setup
        .assessmentDate
    );

  const editedTime =
    formatTime(
      savedAssessment.updatedAt
    );

  const editedDate =
    formatDate(
      savedAssessment.updatedAt
    );


  return (
    <div
      style={{
        minWidth:
          0,

        display:
          "grid",

        gridTemplateColumns:
          "max-content minmax(0, 1fr)",

        columnGap:
          8,

        rowGap:
          3,

        alignItems:
          "baseline",

        fontVariantNumeric:
          "tabular-nums",

        ...UI_TEXT.helper,
      }}
    >
      <span
        style={{
          color:
            theme.textMuted,

          whiteSpace:
            "nowrap",
        }}
      >
        Assessment:
      </span>

      <span
        title={
          assessmentDate
        }
        style={{
          minWidth:
            0,

          color:
            theme.textSecondary,

          textAlign:
            "right",

          whiteSpace:
            "nowrap",
        }}
      >
        {assessmentDate}
      </span>


      <span
        style={{
          color:
            theme.textMuted,

          whiteSpace:
            "nowrap",
        }}
      >
        Edited:
      </span>

      <span
        title={`${editedTime} ${editedDate}`}
        style={{
          minWidth:
            0,

          display:
            "flex",

          alignItems:
            "baseline",

          justifyContent:
            "flex-end",

          gap:
            7,

          color:
            theme.textSecondary,

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
      </span>
    </div>
  );
}


export default function AssessmentTile({
  savedAssessment,
  onDuplicate,
  onDelete,
  onTogglePinned,
  theme,
}: AssessmentTileProps) {
  const {
    getColour,
  } =
    useCourseColourPreferences();


  const assessmentName =
    savedAssessment.setup
      .assessmentName
      .trim() ||
    "[Untitled file]";


  const courseId =
    getAssessmentCourseId(
      savedAssessment
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


  const courseLabel =
    getAssessmentCourseLabel(
      savedAssessment
    );


  const assessmentType =
    getAssessmentTypeLabel(
      savedAssessment
    );


  const coverageLabel =
    getAssessmentCoverageLabel(
      savedAssessment
    );


  const createdDate =
    formatDate(
      savedAssessment.createdAt
    );


  const createdDateTime =
    formatDateTime(
      savedAssessment.createdAt
    );


  function handleOpenAssessment() {
    setCurrentSavedAssessmentId(
      savedAssessment.id
    );
  }


  return (
    <article
      style={{
        minWidth:
          0,

        height:
          310,

        minHeight:
          310,

        maxHeight:
          310,

        position:
          "relative",

        display:
          "grid",

        gridTemplateColumns:
          "48% minmax(0, 1fr)",

        gridTemplateRows:
          "minmax(0, 1fr)",

        alignItems:
          "stretch",

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          `color-mix(
            in srgb,
            ${courseAccent} 30%,
            ${theme.borderStandard}
          )`,

        borderRadius:
          6,

        background:
          theme.bgSurface,

        boxShadow:
          theme.shadow,

        overflow:
          "hidden",

        boxSizing:
          "border-box",
      }}
    >
      <AssessmentOverallProgressBar
        savedAssessment={
          savedAssessment
        }
        theme={
          theme
        }
      />


      <AssessmentPreviewViewport
        savedAssessment={
          savedAssessment
        }
        theme={
          theme
        }
      />


      <div
        style={{
          minWidth:
            0,

          minHeight:
            0,

          height:
            "100%",

          overflow:
            "hidden",

          padding:
            "10px 9px 6px 13px",

          boxSizing:
            "border-box",

          display:
            "flex",

          flexDirection:
            "column",

          gap:
            6,

          background:
            `linear-gradient(
              135deg,
              color-mix(
                in srgb,
                ${courseAccent} 10%,
                ${theme.bgSection}
              ) 0%,
              color-mix(
                in srgb,
                ${courseAccent} 5%,
                ${theme.bgSurface}
              ) 42%,
              ${theme.bgSurface} 100%
            )`,

          boxShadow:
            `inset 4px 0 0 ${courseAccent}`,
        }}
      >
        <div
          style={{
            minWidth:
              0,

            display:
              "grid",

            gap:
              4,
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
                5,
            }}
          >
            <div
              title={
                assessmentName
              }
              style={{
                minWidth:
                  0,

                flex:
                  "1 1 auto",

                overflow:
                  "hidden",

                whiteSpace:
                  "nowrap",

                textOverflow:
                  "ellipsis",

                color:
                  theme.textPrimary,

                fontSize:
                  16,

                fontWeight:
                  650,

                lineHeight:
                  1.15,
              }}
            >
              {assessmentName}
            </div>


            <PinButton
              pinned={
                savedAssessment.isPinned
              }
              onClick={() =>
                onTogglePinned(
                  savedAssessment
                )
              }
              theme={
                theme
              }
            />
          </div>


          <div
            title={`${courseLabel} · ${assessmentType}`}
            style={{
              minWidth:
                0,

              overflow:
                "hidden",

              display:
                "flex",

              alignItems:
                "center",

              gap:
                6,

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
                  courseAccent,

                boxShadow:
                  `0 0 7px ${courseAccent}`,
              }}
            />

            <span
              style={{
                minWidth:
                  0,

                overflow:
                  "hidden",

                color:
                  courseAccentText,

                whiteSpace:
                  "nowrap",

                textOverflow:
                  "ellipsis",

                ...UI_TEXT.controlTextStrong,
              }}
            >
              {courseLabel}
            </span>

            <span
              aria-hidden="true"
              style={{
                color:
                  theme.textMuted,
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

                whiteSpace:
                  "nowrap",

                textOverflow:
                  "ellipsis",

                ...UI_TEXT.controlTextStrong,
              }}
            >
              {assessmentType}
            </span>
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
                "space-between",

              gap:
                6,
            }}
          >
            <div
              title={
                coverageLabel
              }
              style={{
                minWidth:
                  0,

                flex:
                  "1 1 auto",

                overflow:
                  "hidden",

                whiteSpace:
                  "nowrap",

                textOverflow:
                  "ellipsis",

                color:
                  theme.textMuted,

                ...UI_TEXT.helper,
              }}
            >
              {coverageLabel}
            </div>


            <StatusBadge
              savedAssessment={
                savedAssessment
              }
              theme={
                theme
              }
            />
          </div>
        </div>


        <div
          style={{
            padding:
              "2px 0",
          }}
        >
          <AssessmentTileProgress
            savedAssessment={
              savedAssessment
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
            paddingTop:
              6,

            borderTopWidth:
              1,

            borderTopStyle:
              "solid",

            borderTopColor:
              `color-mix(
                in srgb,
                ${courseAccent} 14%,
                ${theme.borderStandard}
              )`,
          }}
        >
          <AssessmentMetadata
            savedAssessment={
              savedAssessment
            }
            theme={
              theme
            }
          />
        </div>


        <Link
          href="/create-assessment/builder"
          onClick={
            handleOpenAssessment
          }
          style={{
            width:
              "100%",

            height:
              30,

            flexShrink:
              0,

            boxSizing:
              "border-box",

            display:
              "inline-flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            gap:
              6,

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

            ...UI_TEXT.buttonText,
          }}
        >
          Open assessment

          <svg
            width="10"
            height="10"
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


        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "1fr 1fr",

            gap:
              5,
          }}
        >
          <button
            type="button"
            onClick={() =>
              onDuplicate(
                savedAssessment
              )
            }
            style={{
              height:
                26,

              padding:
                "0 7px",

              borderWidth:
                1,

              borderStyle:
                "solid",

              borderColor:
                theme.borderStandard,

              borderRadius:
                5,

              background:
                theme.controlBg,

              color:
                theme.textSecondary,

              cursor:
                "pointer",

              ...UI_TEXT.buttonTextSmall,
            }}
          >
            Duplicate
          </button>


          <button
            type="button"
            onClick={() =>
              onDelete(
                savedAssessment
              )
            }
            style={{
              height:
                26,

              padding:
                "0 7px",

              borderWidth:
                1,

              borderStyle:
                "solid",

              borderColor:
                theme.borderStandard,

              borderRadius:
                5,

              background:
                theme.controlBg,

              color:
                theme.danger,

              cursor:
                "pointer",

              ...UI_TEXT.buttonTextSmall,
            }}
          >
            Delete
          </button>
        </div>


        <div
          title={`Created ${createdDateTime}`}
          style={{
            marginTop:
              "auto",

            minWidth:
              0,

            minHeight:
              14,

            flexShrink:
              0,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap:
              8,

            color:
              theme.textMuted,

            fontVariantNumeric:
              "tabular-nums",

            ...UI_TEXT.helper,

            lineHeight:
              1.1,
          }}
        >
          <span>
            Created
          </span>

          <span
            style={{
              flexShrink:
                0,

              textAlign:
                "right",
            }}
          >
            {createdDate}
          </span>
        </div>
      </div>
    </article>
  );
}