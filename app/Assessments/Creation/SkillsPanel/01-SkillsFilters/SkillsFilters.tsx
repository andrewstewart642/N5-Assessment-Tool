import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";

import {
  getAssessmentPaperConfig,
  getAssessmentPapers,
} from "@/app/Assessments/Creation/Papers/PaperRules";

import type {
  Paper,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/app/Assessments/AssessmentTypes";

import type { AppTheme } from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
  UI_TYPO,
} from "@/app/UI/Application/Typography/Typography";

const CONTROL_HEIGHT = 32;

const SEGMENT_INSET = 3;

const SEGMENT_INNER_HEIGHT =
  CONTROL_HEIGHT -
  SEGMENT_INSET * 2;

export type ConstraintPillId =
  | "standard"
  | "targetMarks"
  | "thinkingType"
  | "paper";

function constraintFlashStyle(
  active: boolean
): CSSProperties {
  return {
    borderRadius: 8,

    outline: active
      ? "2px solid rgba(239, 68, 68, 0.95)"
      : "2px solid transparent",

    boxShadow: active
      ? "0 0 0 4px rgba(239, 68, 68, 0.22)"
      : "none",

    transform: active
      ? "scale(1.015)"
      : "scale(1)",

    animation: active
      ? "constraintPulseRed 5s ease-in-out"
      : "none",

    transition:
      "box-shadow 0.16s ease, outline-color 0.16s ease, transform 0.16s ease",
  };
}

function SegmentedControl<
  Option extends string,
>({
  ariaLabel,
  options,
  value,
  onChange,
  theme,
  size = "md",
}: {
  ariaLabel: string;

  options: Array<{
    value: Option;
    label: string;
  }>;

  value: Option;

  onChange: (
    value: Option
  ) => void;

  theme: AppTheme;

  size?: "sm" | "md";
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      style={{
        display: "inline-flex",
        alignItems: "center",

        gap: 3,

        width: "fit-content",
        maxWidth: "100%",
        minWidth: 0,

        padding: SEGMENT_INSET,
        height: CONTROL_HEIGHT,

        borderRadius: 6,

        border:
          `1px solid ${theme.borderStandard}`,

        background:
          theme.controlBg,

        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.04)",

        boxSizing: "border-box",
      }}
    >
      {options.map((option) => {
        const selected =
          option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() =>
              onChange(option.value)
            }
            style={{
              flex: "0 0 auto",

              height:
                SEGMENT_INNER_HEIGHT,

              border: "none",
              borderRadius: 4,

              background:
                selected
                  ? theme.controlSelectedBg
                  : "transparent",

              color:
                selected
                  ? theme.textPrimary
                  : theme.textSecondary,

              cursor: "pointer",

              fontFamily:
                UI_TYPO.family,

              fontWeight:
                UI_TYPO.weightSemibold,

              fontSize:
                size === "sm"
                  ? UI_TYPO.sizeSm
                  : UI_TYPO.sizeMeta,

              lineHeight: 1,

              whiteSpace: "nowrap",

              padding: "0 8px",

              boxShadow:
                selected
                  ? "0 1px 3px rgba(0,0,0,0.14)"
                  : "none",

              transform:
                selected
                  ? "scale(1.01)"
                  : "scale(1)",

              transition:
                "background 0.16s ease, color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease",
            }}
            title={option.label}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function MiniStepButton({
  label,
  onClick,
  theme,
}: {
  label: "Up" | "Down";

  onClick: () => void;

  theme: AppTheme;
}) {
  const isUp =
    label === "Up";

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        width: 24,
        height: 14,

        padding: 0,

        border:
          `1px solid ${theme.borderStandard}`,

        borderRadius: 4,

        background:
          theme.controlBg,

        color:
          theme.textMuted,

        cursor: "pointer",

        display: "grid",
        placeItems: "center",

        boxSizing: "border-box",

        lineHeight: 1,

        transition:
          "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
      }}
      title={label}
    >
      <svg
        width="8"
        height="5"
        viewBox="0 0 8 5"
        aria-hidden="true"
        style={{
          display: "block",
        }}
      >
        <path
          d={
            isUp
              ? "M1 4 L4 1 L7 4"
              : "M1 1 L4 4 L7 1"
          }
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

type SkillsFiltersProps = {
  theme: AppTheme;

  totalSkillsCount: number;

  standardFilter:
    StandardFilter;

  setStandardFilter: (
    value: StandardFilter
  ) => void;

  thinkingTypeFilter:
    ThinkingTypeFilter;

  setThinkingTypeFilter: (
    value: ThinkingTypeFilter
  ) => void;

  targetMarks: number;

  setTargetMarks: (
    value: number
  ) => void;

  minTargetMarks: number;

  maxTargetMarks: number;

  activePaper: Paper;

  setActivePaper: (
    paper: Paper
  ) => void;

  flashingConstraint:
    ConstraintPillId | null;
};

export default function SkillsFilters({
  theme,

  totalSkillsCount,

  standardFilter,
  setStandardFilter,

  thinkingTypeFilter,
  setThinkingTypeFilter,

  targetMarks,
  setTargetMarks,

  minTargetMarks,
  maxTargetMarks,

  activePaper,
  setActivePaper,

  flashingConstraint,
}: SkillsFiltersProps) {
  const [
    helperHidden,
    setHelperHidden,
  ] = useState(false);

  const [
    targetMarksText,
    setTargetMarksText,
  ] = useState(
    `${targetMarks} marks`
  );

  useEffect(() => {
    setTargetMarksText(
      `${targetMarks} marks`
    );
  }, [targetMarks]);

  const paperOptions =
    useMemo(() => {
      return getAssessmentPapers().map(
        (paper) => {
          const paperConfig =
            getAssessmentPaperConfig(
              paper
            );

          return {
            value: paper,
            label:
              paperConfig.label,
          };
        }
      );
    }, []);

  function decreaseMarks() {
    setTargetMarks(
      Math.max(
        minTargetMarks,
        targetMarks - 1
      )
    );
  }

  function increaseMarks() {
    setTargetMarks(
      Math.min(
        maxTargetMarks,
        targetMarks + 1
      )
    );
  }

  function commitTargetMarksInput(
    rawValue: string
  ) {
    const digitsOnly =
      rawValue.replace(
        /\D/g,
        ""
      );

    if (!digitsOnly.length) {
      setTargetMarks(
        minTargetMarks
      );

      setTargetMarksText(
        `${minTargetMarks} marks`
      );

      return;
    }

    const parsed =
      Number(digitsOnly);

    if (
      !Number.isFinite(parsed)
    ) {
      setTargetMarksText(
        `${targetMarks} marks`
      );

      return;
    }

    const clamped =
      Math.max(
        minTargetMarks,
        Math.min(
          maxTargetMarks,
          parsed
        )
      );

    setTargetMarks(
      clamped
    );

    setTargetMarksText(
      `${clamped} marks`
    );
  }

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 2,

        background:
          theme.bgSurface,

        borderBottom:
          `1px solid ${theme.borderStandard}`,

        padding:
          "14px 14px 10px",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 8,

            paddingBottom: 10,

            borderBottom:
              `1px solid ${theme.borderStandard}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",

              minWidth: 0,
            }}
          >
            <div
              style={{
                display:
                  "inline-flex",

                alignItems:
                  "flex-end",

                gap: 30,

                flexShrink: 0,
              }}
            >
              <div
                style={{
                  ...UI_TEXT.pageTitle,

                  margin: 0,

                  letterSpacing:
                    0.2,

                  whiteSpace:
                    "nowrap",

                  color:
                    theme.textPrimary,
                }}
              >
                Skills Tree
              </div>

              <button
                type="button"
                onClick={() =>
                  setHelperHidden(
                    !helperHidden
                  )
                }
                style={{
  border:
    "none",

  background:
    "transparent",

  color:
    theme.textMuted,

  cursor:
    "pointer",

  padding: 0,

  fontFamily:
    UI_TYPO.family,

  fontSize: 8,

  fontWeight:
    UI_TYPO.weightRegular,

  lineHeight: 1,

  whiteSpace:
    "nowrap",

  textDecoration:
    "underline",

  textUnderlineOffset: 2,

  textDecorationThickness:
    "1px",

  marginBottom: 1,

  transition:
    "color 0.12s ease",
}}
                onMouseEnter={(
                  event
                ) => {
                  event.currentTarget.style.color =
                    theme.textSecondary;
                }}
                onMouseLeave={(
                  event
                ) => {
                  event.currentTarget.style.color =
                    theme.textMuted;
                }}
              >
                {helperHidden
                  ? "Show guidance"
                  : "Hide guidance"}
              </button>
            </div>

            <div
              style={{
                ...UI_TEXT.metadata,

                color:
                  theme.textMuted,

                textAlign:
                  "right",

                whiteSpace:
                  "nowrap",

                marginLeft:
                  "auto",

                paddingLeft: 14,

                minWidth: 0,

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",
              }}
            >
              {totalSkillsCount} skills • concepts filtered by Standard
            </div>
          </div>

          {!helperHidden ? (
            <div
              style={{
                ...UI_TEXT.helper,

                color:
                  theme.textMuted,

                textAlign:
                  "left",

                maxWidth: 520,
              }}
            >
              Filter by standard, choose a thinking type, select a paper to add to,
              and generate questions for your assessment. View them in the PDF builder
              in the right pane.
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "minmax(0, 1fr) auto",

            columnGap: 14,
            rowGap: 12,

            alignItems: "end",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: 6,

              justifyItems:
                "start",

              minWidth: 0,

              padding: 4,

              ...constraintFlashStyle(
                flashingConstraint ===
                  "standard"
              ),
            }}
          >
            <div
              style={{
                ...UI_TEXT.sectionLabel,

                color:
                  theme.textMuted,
              }}
            >
              Standard
            </div>

            <div
              style={{
                minWidth: 0,

                maxWidth:
                  "100%",

                overflow:
                  "hidden",
              }}
            >
              <SegmentedControl<StandardFilter>
                ariaLabel="Standard filter"
                value={
                  standardFilter
                }
                onChange={
                  setStandardFilter
                }
                theme={theme}
                size="sm"
                options={[
                  {
                    value: "C",
                    label:
                      "C-standard",
                  },
                  {
                    value: "A",
                    label:
                      "A-standard",
                  },
                  {
                    value: "C+A",
                    label:
                      "A+C-standard",
                  },
                ]}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 6,

              justifyItems:
                "start",

              padding: 4,

              ...constraintFlashStyle(
                flashingConstraint ===
                  "targetMarks"
              ),
            }}
          >
            <div
              style={{
                ...UI_TEXT.sectionLabel,

                color:
                  theme.textMuted,
              }}
            >
              Target marks
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",

                gap: 6,

                minHeight:
                  CONTROL_HEIGHT,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",

                  borderRadius: 6,

                  border:
                    `1px solid ${theme.borderStandard}`,

                  background:
                    theme.controlBg,

                  height:
                    CONTROL_HEIGHT,

                  width: 88,

                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.04)",

                  overflow:
                    "hidden",

                  boxSizing:
                    "border-box",
                }}
                title={`Target marks: ${targetMarks}`}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  value={
                    targetMarksText
                  }
                  onChange={(
                    event
                  ) =>
                    setTargetMarksText(
                      event.target
                        .value
                    )
                  }
                  onFocus={(
                    event
                  ) =>
                    event.currentTarget.select()
                  }
                  onBlur={(
                    event
                  ) =>
                    commitTargetMarksInput(
                      event.target
                        .value
                    )
                  }
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      commitTargetMarksInput(
                        targetMarksText
                      );

                      event.currentTarget.blur();
                    }
                  }}
                  style={{
                    width: "100%",
                    height: "100%",

                    border: "none",
                    outline: "none",

                    background:
                      "transparent",

                    color:
                      theme.textPrimary,

                    fontFamily:
                      UI_TYPO.family,

                    fontWeight:
                      UI_TYPO.weightSemibold,

                    fontSize:
                      UI_TYPO.sizeMeta,

                    textAlign:
                      "left",

                    lineHeight: 1,

                    padding:
                      "0 10px",

                    boxSizing:
                      "border-box",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",

                  gap: 2,

                  justifyItems:
                    "center",

                  alignItems:
                    "center",
                }}
              >
                <MiniStepButton
                  label="Up"
                  onClick={
                    increaseMarks
                  }
                  theme={theme}
                />

                <MiniStepButton
                  label="Down"
                  onClick={
                    decreaseMarks
                  }
                  theme={theme}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 6,

              justifyItems:
                "start",

              minWidth: 0,

              padding: 4,

              ...constraintFlashStyle(
                flashingConstraint ===
                  "thinkingType"
              ),
            }}
          >
            <div
              style={{
                ...UI_TEXT.sectionLabel,

                color:
                  theme.textMuted,
              }}
            >
              Thinking type
            </div>

            <SegmentedControl<ThinkingTypeFilter>
              ariaLabel="Thinking type filter"
              value={
                thinkingTypeFilter
              }
              onChange={
                setThinkingTypeFilter
              }
              theme={theme}
              size="sm"
              options={[
                {
                  value:
                    "OPERATIONAL",

                  label:
                    "Operational",
                },
                {
                  value:
                    "REASONING",

                  label:
                    "Reasoning",
                },
                {
                  value: "ANY",

                  label: "Any",
                },
              ]}
            />
          </div>

          <div
            style={{
              display: "grid",
              gap: 6,

              justifyItems:
                "start",

              alignSelf:
                "end",

              minWidth: 0,

              padding: 4,

              ...constraintFlashStyle(
                flashingConstraint ===
                  "paper"
              ),
            }}
          >
            <div
              style={{
                ...UI_TEXT.sectionLabel,

                color:
                  theme.textMuted,
              }}
            >
              Add questions to
            </div>

            <SegmentedControl<Paper>
              ariaLabel="Active paper"
              value={
                activePaper
              }
              onChange={
                setActivePaper
              }
              theme={theme}
              size="sm"
              options={
                paperOptions
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}