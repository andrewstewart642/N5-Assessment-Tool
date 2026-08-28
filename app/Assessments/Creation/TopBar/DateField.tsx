import {
  useState,
} from "react";

import CalendarPicker from "@/app/UI/Application/Components/CalendarPicker";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import AssessmentTopBarField from "./FieldWithLabel";

import {
  TOP_BAR_CONTROL_HEIGHT,
  TOP_BAR_CONTROL_RADIUS,
} from "./Dimensions";

type AssessmentDateFieldProps = {
  theme:
    AppTheme;

  assessmentDate:
    string;

  setAssessmentDate:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  builderCalendarOpen:
    boolean;

  setBuilderCalendarOpen:
    React.Dispatch<
      React.SetStateAction<boolean>
    >;

  builderDateFieldRef:
    React.RefObject<
      HTMLDivElement | null
    >;
};

function formatAssessmentDateDisplay(
  value: string
): string {
  if (!value) {
    return "";
  }

  const isoMatch =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      value
    );

  if (!isoMatch) {
    return value;
  }

  const [
    ,
    year,
    month,
    day,
  ] =
    isoMatch;

  return `${day}/${month}/${year}`;
}

function CalendarIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      aria-hidden="true"
      style={{
        display:
          "block",
      }}
    >
      <rect
        x="2.25"
        y="3.5"
        width="11.5"
        height="10"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="M2.5 6.25H13.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="M5 2.25V4.5M11 2.25V4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M5 8.5H6M7.5 8.5H8.5M10 8.5H11M5 11H6M7.5 11H8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AssessmentDateField({
  theme,
  assessmentDate,
  setAssessmentDate,
  builderCalendarOpen,
  setBuilderCalendarOpen,
  builderDateFieldRef,
}: AssessmentDateFieldProps) {
  const [
    hovered,
    setHovered,
  ] =
    useState(false);

  const [
    focused,
    setFocused,
  ] =
    useState(false);

  const [
    calendarButtonHovered,
    setCalendarButtonHovered,
  ] =
    useState(false);

  const formattedDate =
    formatAssessmentDateDisplay(
      assessmentDate
    );

  const active =
    hovered ||
    focused ||
    builderCalendarOpen;

  return (
    <div
      ref={
        builderDateFieldRef
      }
      style={{
        width:
          150,

        minWidth:
          0,

        position:
          "relative",
      }}
    >
      <AssessmentTopBarField
        label="Assessment Date"
        theme={
          theme
        }
      >
        <div
          onMouseEnter={() =>
            setHovered(
              true
            )
          }
          onMouseLeave={() =>
            setHovered(
              false
            )
          }
          style={{
            position:
              "relative",

            width:
              "100%",
          }}
        >
          <input
            type="text"
            aria-label="Assessment Date"
            value={
              formattedDate
            }
            readOnly
            onFocus={() => {
              setFocused(
                true
              );

              setBuilderCalendarOpen(
                true
              );
            }}
            onBlur={() =>
              setFocused(
                false
              )
            }
            onClick={() =>
              setBuilderCalendarOpen(
                true
              )
            }
            style={{
              width:
                "100%",

              height:
                TOP_BAR_CONTROL_HEIGHT,

              boxSizing:
                "border-box",

              borderRadius:
                TOP_BAR_CONTROL_RADIUS,

              border:
                `1px solid ${
                  active
                    ? theme.controlSelectedBorder
                    : theme.borderStandard
                }`,

              background:
                active
                  ? theme.controlBgHover
                  : theme.controlBg,

              color:
                theme.textPrimary,

              padding:
                "0 30px 0 8px",

              outline:
                "none",

              cursor:
                "pointer",

              ...UI_TEXT.controlText,

              transition:
                "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
            }}
          />

          <button
            type="button"
            aria-label="Open calendar"
            onClick={() =>
              setBuilderCalendarOpen(
                (
                  previous
                ) =>
                  !previous
              )
            }
            onMouseEnter={() =>
              setCalendarButtonHovered(
                true
              )
            }
            onMouseLeave={() =>
              setCalendarButtonHovered(
                false
              )
            }
            style={{
              position:
                "absolute",

              right:
                3,

              top:
                "50%",

              transform:
                "translateY(-50%)",

              width:
                26,

              height:
                26,

              padding:
                0,

              border:
                "none",

              borderRadius:
                4,

              background:
                calendarButtonHovered
                  ? theme.controlBgHover
                  : "transparent",

              color:
                calendarButtonHovered
                  ? theme.textSecondary
                  : theme.textMuted,

              cursor:
                "pointer",

              display:
                "grid",

              placeItems:
                "center",

              transition:
                "background 0.15s ease, color 0.15s ease",
            }}
          >
            <CalendarIcon />
          </button>
        </div>
      </AssessmentTopBarField>

      {builderCalendarOpen ? (
        <div
          style={{
            position:
              "absolute",

            top:
              "calc(100% + 6px)",

            right:
              0,

            zIndex:
              300,

            width:
              260,
          }}
        >
          <CalendarPicker
            theme={
              theme
            }
            value={
              assessmentDate
            }
            onCancel={() =>
              setBuilderCalendarOpen(
                false
              )
            }
            onApply={(
              next
            ) => {
              setAssessmentDate(
                next
              );

              setBuilderCalendarOpen(
                false
              );
            }}
          />
        </div>
      ) : null}
    </div>
  );
}