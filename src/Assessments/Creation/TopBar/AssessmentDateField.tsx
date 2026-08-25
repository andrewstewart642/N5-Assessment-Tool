import {
  useState,
} from "react";

import CalendarPicker from "@/src/UI/Application/Components/CalendarPicker";

import {
  INTERACTION,
} from "@/src/UI/Application/Motion/InteractionTokens";

import type {
  AppTheme,
} from "@/src/UI/Application/Theme/AppTheme";

import {
  UI_TYPO,
} from "@/src/UI/Application/Typography/Typography";

type AssessmentDateFieldProps = {
  theme: AppTheme;

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

const CONTROL_HEIGHT =
  32;

const LABEL_GAP =
  4;

const CONTROL_RADIUS =
  10;

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

  const utcDate =
    new Date(
      Date.UTC(
        Number(
          year
        ),
        Number(
          month
        ) - 1,
        Number(
          day
        )
      )
    );

  if (
    Number.isNaN(
      utcDate.getTime()
    )
  ) {
    return value;
  }

  return utcDate.toLocaleDateString(
    "en-GB",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",

      timeZone:
        "UTC",
    }
  );
}

function fieldLabelStyle(
  theme: AppTheme
): React.CSSProperties {
  return {
    fontSize:
      12,

    fontWeight:
      UI_TYPO.weightMedium,

    color:
      theme.textMuted,

    lineHeight:
      1.2,

    whiteSpace:
      "nowrap",
  };
}

function getDateShellStyle(
  hovered: boolean,
  focused: boolean
): React.CSSProperties {
  const active =
    hovered ||
    focused;

  return {
    width:
      "100%",

    borderRadius:
      CONTROL_RADIUS,

    transform:
      active
        ? INTERACTION.lift.subtle.transform
        : "scale(1)",

    boxShadow:
      active
        ? INTERACTION.lift.subtle.shadow
        : "0 0 0 rgba(0,0,0,0)",

    transition:
      INTERACTION.transition.smooth,
  };
}

function inputStyle(
  theme: AppTheme,
  hovered: boolean,
  focused: boolean
): React.CSSProperties {
  const active =
    hovered ||
    focused;

  return {
    height:
      CONTROL_HEIGHT,

    borderRadius:
      CONTROL_RADIUS,

    border:
      `1px solid ${
        active
          ? theme.controlSelectedBorder
          : theme.borderStandard
      }`,

    background:
      active
        ? theme.controlBgHover
        : theme.bgSurface,

    color:
      theme.textPrimary,

    padding:
      "0 34px 0 10px",

    fontSize:
      13,

    fontFamily:
      UI_TYPO.family,

    fontWeight:
      UI_TYPO.weightSemibold,

    minWidth:
      0,

    width:
      "100%",

    boxSizing:
      "border-box",

    outline:
      "none",

    boxShadow:
      active
        ? "inset 0 1px 0 rgba(255,255,255,0.06)"
        : "inset 0 1px 0 rgba(255,255,255,0.04)",

    transition:
      INTERACTION.transition.smooth,

    cursor:
      "pointer",
  };
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

  return (
    <div
      ref={
        builderDateFieldRef
      }
      style={{
        display:
          "grid",

        gap:
          LABEL_GAP,

        minWidth:
          0,

        width:
          150,

        fontFamily:
          UI_TYPO.family,

        flex:
          "0 0 auto",

        position:
          "relative",

        zIndex:
          builderCalendarOpen
            ? 200
            : "auto",
      }}
    >
      <span
        style={
          fieldLabelStyle(
            theme
          )
        }
      >
        Assessment Date
      </span>

      <div
        style={
          getDateShellStyle(
            hovered,
            focused
          )
        }
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
      >
        <div
          style={{
            position:
              "relative",
          }}
        >
          <input
            type="text"
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
            style={
              inputStyle(
                theme,
                hovered,
                focused
              )
            }
          />

          <button
            type="button"
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
                5,

              top:
                "50%",

              transform:
                calendarButtonHovered
                  ? "translateY(-50%) scale(1.04)"
                  : "translateY(-50%) scale(1)",

              width:
                22,

              height:
                22,

              borderRadius:
                7,

              border:
                `1px solid ${
                  calendarButtonHovered
                    ? theme.controlSelectedBorder
                    : theme.borderStandard
                }`,

              background:
                calendarButtonHovered
                  ? theme.controlBgHover
                  : theme.controlBg,

              color:
                theme.textMuted,

              cursor:
                "pointer",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              fontSize:
                12,

              transition:
                INTERACTION.transition.smooth,

              boxShadow:
                calendarButtonHovered
                  ? INTERACTION.lift.subtle.shadow
                  : "0 0 0 rgba(0,0,0,0)",
            }}
          >
            🗓️
          </button>
        </div>
      </div>

      {builderCalendarOpen ? (
        <div
          style={{
            position:
              "absolute",

            top:
              "calc(100% + 10px)",

            left:
              0,

            zIndex:
              300,

            width:
              320,
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