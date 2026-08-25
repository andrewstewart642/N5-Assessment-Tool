"use client";

import type {
  ReactNode,
} from "react";

import type {
  Paper,
} from "@/shared-types/AssessmentTypes";

import type {
  AppTheme,
} from "@/src/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
  UI_TYPO,
} from "@/src/UI/Application/Typography/Typography";

import {
  DEFAULT_ASSESSMENT_QUALITY_NOTE_LIMITS,
  limitAssessmentQualityNotes,
  toAssessmentQualityNote,
  type AssessmentQualityNote,
  type AssessmentQualityNoteSeverity,
} from "../Analysis/AssessmentQualityNotes";

import type {
  AssessmentPreviewViewMode,
} from "../PaperWorkspace/PreviewViewMode";

export type AssessmentProgressPanelPaperRow = {
  paper:
    Paper;

  paperLabel:
    string;

  marks:
    number;

  targetMarks:
    number;

  timeMinutes:
    number;
};

type AssessmentProgressPanelProps = {
  viewPaper?:
    Paper;

  paperRows:
    AssessmentProgressPanelPaperRow[];

  notes:
    Array<
      string |
      AssessmentQualityNote
    >;

  theme:
    AppTheme;

  previewViewMode:
    AssessmentPreviewViewMode;

  onCyclePreviewViewMode:
    () => void;
};

function clampInteger(
  value: number
): number {
  if (
    !Number.isFinite(
      value
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.round(
      value
    )
  );
}

function formatMinutes(
  totalMinutes: number
): string {
  const minutes =
    clampInteger(
      totalMinutes
    );

  if (
    minutes < 60
  ) {
    return `${minutes} min`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  const remainder =
    minutes % 60;

  return (
    remainder === 0
      ? `${hours} h`
      : `${hours} h ${remainder} min`
  );
}

function WarningTriangleIcon({
  color,
  fill,
}: {
  color: string;
  fill: string;
}) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M12 3.6L21 19.5c.35.62-.08 1.4-.79 1.4H3.79c-.71 0-1.14-.78-.79-1.4L12 3.6z"
        fill={
          fill
        }
        stroke={
          color
        }
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M12 8.2v6.6"
        stroke={
          color
        }
        strokeWidth="2"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="17.4"
        r="1.2"
        fill={
          color
        }
      />
    </svg>
  );
}

function WarningDiamondIcon({
  color,
  fill,
}: {
  color: string;
  fill: string;
}) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M12 2.8L20.8 12 12 21.2 3.2 12 12 2.8z"
        fill={
          fill
        }
        stroke={
          color
        }
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M12 7.8v6.2"
        stroke={
          color
        }
        strokeWidth="2"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="16.8"
        r="1.2"
        fill={
          color
        }
      />
    </svg>
  );
}

function LightbulbIcon({
  color,
}: {
  color:
    string;
}) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M8 14.2c-1.3-1-2.1-2.6-2.1-4.4A6.1 6.1 0 0 1 12 3.8a6.1 6.1 0 0 1 6.1 6.1c0 1.8-.8 3.4-2.1 4.4-.5.4-.9.9-1.2 1.5H9.2c-.3-.6-.7-1.1-1.2-1.6Z"
        fill="none"
        stroke={
          color
        }
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M9.4 18.1h5.2"
        stroke={
          color
        }
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M10 20.3h4"
        stroke={
          color
        }
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getNotePalette(
  severity:
    AssessmentQualityNoteSeverity,

  theme:
    AppTheme
): {
  icon:
    ReactNode;

  textColor:
    string;
} {
  if (
    severity ===
    "essential"
  ) {
    return {
      icon: (
        <WarningTriangleIcon
          color={
            theme.accentPrimary
          }
          fill={
            theme.accentSoft
          }
        />
      ),

      textColor:
        theme.textPrimary,
    };
  }

  if (
    severity ===
    "advised"
  ) {
    return {
      icon: (
        <WarningDiamondIcon
          color={
            theme.textSecondary
          }
          fill={
            theme.controlBg
          }
        />
      ),

      textColor:
        theme.textSecondary,
    };
  }

  return {
    icon: (
      <LightbulbIcon
        color={
          theme.textSecondary
        }
      />
    ),

    textColor:
      theme.textSecondary,
  };
}

function ProgressDataRow({
  paperLabel,
  marksValue,
  timeValue,
  theme,
}: {
  paperLabel:
    string;

  marksValue:
    string;

  timeValue:
    string;

  theme:
    AppTheme;
}) {
  return (
    <div
      style={{
        display:
          "grid",

        gridTemplateColumns:
          "34px 58px 68px",

        columnGap:
          8,

        alignItems:
          "center",
      }}
    >
      <div
        style={{
          ...UI_TEXT.controlTextStrong,

          color:
            theme.textSecondary,

          overflow:
            "hidden",

          textOverflow:
            "ellipsis",

          whiteSpace:
            "nowrap",
        }}
        title={
          paperLabel
        }
      >
        {paperLabel}
      </div>

      <div
        style={{
          ...UI_TEXT.controlTextStrong,

          color:
            theme.textSecondary,

          textAlign:
            "right",

          fontVariantNumeric:
            "tabular-nums",

          fontFeatureSettings:
            '"tnum" 1',

          whiteSpace:
            "nowrap",
        }}
      >
        {marksValue}
      </div>

      <div
        style={{
          ...UI_TEXT.controlTextStrong,

          color:
            theme.textSecondary,

          textAlign:
            "right",

          fontVariantNumeric:
            "tabular-nums",

          fontFeatureSettings:
            '"tnum" 1',

          whiteSpace:
            "nowrap",
        }}
      >
        {timeValue}
      </div>
    </div>
  );
}

export default function AssessmentProgressPanel({
  paperRows,
  notes,
  theme,
  previewViewMode,
  onCyclePreviewViewMode,
}: AssessmentProgressPanelProps) {
  const previewViewLabel =
    previewViewMode ===
    "EXAM"
      ? "Exam"
      : previewViewMode ===
          "COMPACT"
        ? "Compact"
        : "Answers";

  const structuredNotes =
    limitAssessmentQualityNotes(
      notes.map(
        (
          note,
          index
        ) =>
          toAssessmentQualityNote(
            note,
            index
          )
      ),

      DEFAULT_ASSESSMENT_QUALITY_NOTE_LIMITS
    );

  return (
    <div
      style={{
        width:
          "100%",

        height:
          "100%",

        borderTop:
          `1px solid ${theme.borderStandard}`,

        background:
          theme.bgSurface,

        display:
          "grid",

        gridTemplateColumns:
          "196px minmax(0, 1fr)",

        minHeight:
          0,

        overflow:
          "hidden",

        fontFamily:
          UI_TYPO.family,
      }}
    >
      <div
        style={{
          minWidth:
            0,

          padding:
            "10px 12px",

          borderRight:
            `1px solid ${theme.borderStandard}`,

          display:
            "grid",

          gridTemplateRows:
            "auto 1fr",

          gap:
            10,
        }}
      >
        <div
          style={{
            ...UI_TEXT.sectionTitle,

            color:
              theme.textSecondary,
          }}
        >
          Marks & Timings
        </div>

        <div
          style={{
            display:
              "grid",

            gap:
              8,

            alignContent:
              "start",
          }}
        >
          {paperRows.map(
            (
              row
            ) => {
              const marks =
                clampInteger(
                  row.marks
                );

              const targetMarks =
                clampInteger(
                  row.targetMarks
                );

              return (
                <ProgressDataRow
                  key={
                    row.paper
                  }
                  paperLabel={
                    row.paperLabel
                  }
                  marksValue={`${marks}/${targetMarks}`}
                  timeValue={`~${formatMinutes(
                    row.timeMinutes
                  )}`}
                  theme={
                    theme
                  }
                />
              );
            }
          )}
        </div>
      </div>

      <div
        style={{
          minWidth:
            0,

          padding:
            "10px 12px 10px 10px",

          display:
            "grid",

          gridTemplateRows:
            "auto minmax(0, 1fr)",

          gap:
            8,

          position:
            "relative",
        }}
      >
        <div
          style={{
            ...UI_TEXT.sectionTitle,

            color:
              theme.textSecondary,
          }}
        >
          Notes
        </div>

        <div
          style={{
            position:
              "absolute",

            top:
              6,

            right:
              12,

            display:
              "inline-flex",

            alignItems:
              "center",

            gap:
              7,

            zIndex:
              2,
          }}
        >
          <span
            style={{
              ...UI_TEXT.sectionTitle,

              color:
                theme.textSecondary,

              whiteSpace:
                "nowrap",
            }}
          >
            View
          </span>

          <button
            type="button"
            onClick={
              onCyclePreviewViewMode
            }
            title="Cycle preview view"
            aria-label={`Preview view: ${previewViewLabel}. Click to change view.`}
            style={{
              ...UI_TEXT.controlTextStrong,

              minWidth:
                78,

              height:
                24,

              padding:
                "0 9px",

              display:
                "inline-flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              border:
                `1px solid ${theme.controlSelectedBorder}`,

              borderRadius:
                8,

              background:
                theme.controlSelectedBg,

              color:
                theme.textOnAccent,

              cursor:
                "pointer",

              lineHeight:
                1,

              whiteSpace:
                "nowrap",

              boxShadow:
                "0 1px 2px rgba(0,0,0,0.12)",

              transition:
                "filter 0.15s ease, transform 0.1s ease",
            }}
            onMouseDown={(
              event
            ) => {
              event.currentTarget.style.transform =
                "scale(0.97)";
            }}
            onMouseUp={(
              event
            ) => {
              event.currentTarget.style.transform =
                "scale(1)";
            }}
            onMouseLeave={(
              event
            ) => {
              event.currentTarget.style.transform =
                "scale(1)";
            }}
          >
            {previewViewLabel}
          </button>
        </div>

        <div
          className="hover-scroll"
          style={{
            minHeight:
              0,

            height:
              "100%",

            border:
              `1px solid ${theme.borderStandard}`,

            background:
              theme.bgElevated,

            borderRadius:
              12,

            padding:
              "10px 12px",

            overflowY:
              "auto",

            color:
              structuredNotes.length
                ? theme.textSecondary
                : theme.textMuted,

            lineHeight:
              1.35,

            fontFamily:
              UI_TYPO.family,

            fontSize:
              UI_TYPO.sizeBase,
          }}
        >
          {structuredNotes.length ? (
            <div
              style={{
                display:
                  "grid",

                gap:
                  10,
              }}
            >
              {structuredNotes.map(
                (
                  note
                ) => {
                  const palette =
                    getNotePalette(
                      note.severity,
                      theme
                    );

                  return (
                    <div
                      key={
                        note.id
                      }
                      title={
                        note.message
                      }
                      style={{
                        display:
                          "grid",

                        gridTemplateColumns:
                          "20px minmax(0, 1fr)",

                        columnGap:
                          10,

                        alignItems:
                          "start",
                      }}
                    >
                      <div
                        style={{
                          width:
                            20,

                          height:
                            20,

                          display:
                            "grid",

                          placeItems:
                            "center",

                          marginTop:
                            1,
                        }}
                      >
                        {
                          palette.icon
                        }
                      </div>

                      <div
                        style={{
                          ...UI_TEXT.controlText,

                          whiteSpace:
                            "normal",

                          overflowWrap:
                            "anywhere",

                          color:
                            note.severity ===
                            "suggestion"
                              ? theme.textSecondary
                              : palette.textColor,

                          fontWeight:
                            note.severity ===
                            "essential"
                              ? UI_TYPO.weightSemibold
                              : UI_TYPO.weightMedium,
                        }}
                      >
                        {
                          note.message
                        }
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <div
              style={{
                ...UI_TEXT.controlTextStrong,

                color:
                  theme.textSecondary,
              }}
            >
              No notes yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}