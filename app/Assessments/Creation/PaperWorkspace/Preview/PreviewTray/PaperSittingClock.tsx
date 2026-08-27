import {
  useEffect,
  useState,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import PreviewTraySegmentedControl from "./PreviewTraySegmentedControl";

import {
  buildHour24FromClock,
  formatPaperSittingTime,
  getClockHour12,
  getClockMeridiem,
  parsePaperSittingTime,
} from "./PaperSittingTimeUtils";


type ClockMode =
  | "hour"
  | "minute";


type PaperSittingClockProps = {
  value:
    string;

  onChange: (
    next:
      string
  ) => void;

  theme:
    AppTheme;
};


const CLOCK_SIZE =
  162;

const CLOCK_CENTRE =
  CLOCK_SIZE /
  2;

const MARKER_SIZE =
  25;

const MARKER_RADIUS =
  61;

const HAND_LENGTH =
  48;


function ClockMarker({
  label,
  angleDegrees,
  selected,
  onClick,
  theme,
}: {
  label:
    string;

  angleDegrees:
    number;

  selected:
    boolean;

  onClick:
    () => void;

  theme:
    AppTheme;
}) {
  const [
    hovered,
    setHovered,
  ] =
    useState(
      false
    );

  const angleRadians =
    (
      angleDegrees -
      90
    ) *
    (
      Math.PI /
      180
    );

  const left =
    CLOCK_CENTRE +
    Math.cos(
      angleRadians
    ) *
      MARKER_RADIUS -
    MARKER_SIZE /
      2;

  const top =
    CLOCK_CENTRE +
    Math.sin(
      angleRadians
    ) *
      MARKER_RADIUS -
    MARKER_SIZE /
      2;


  return (
    <button
      type="button"
      onClick={
        onClick
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
      style={{
        position:
          "absolute",

        left,

        top,

        width:
          MARKER_SIZE,

        height:
          MARKER_SIZE,

        padding:
          0,

        border:
          `1px solid ${
            selected
              ? theme.controlSelectedBorder
              : "transparent"
          }`,

        borderRadius:
          999,

        background:
          selected
            ? theme.controlSelectedBg
            : hovered
              ? theme.controlBgHover
              : "transparent",

        color:
          selected
            ? theme.textPrimary
            : theme.textSecondary,

        cursor:
          "pointer",

        display:
          "grid",

        placeItems:
          "center",

        ...UI_TEXT.helper,

        fontWeight:
          selected
            ? 600
            : 500,

        transition:
          "background 120ms ease, border-color 120ms ease, color 120ms ease",
      }}
    >
      {label}
    </button>
  );
}


export default function PaperSittingClock({
  value,
  onChange,
  theme,
}: PaperSittingClockProps) {
  const [
    mode,
    setMode,
  ] =
    useState<ClockMode>(
      "hour"
    );


  const parsed =
    parsePaperSittingTime(
      value
    ) ?? {
      hour24:
        9,

      minute:
        0,
    };


  const hour12 =
    getClockHour12(
      parsed.hour24
    );

  const meridiem =
    getClockMeridiem(
      parsed.hour24
    );


  /*
   * Returning to another time field should
   * begin with hour selection again.
   */

  useEffect(() => {
    setMode(
      "hour"
    );
  }, [
    value,
  ]);


  const selectedAngle =
    mode ===
    "hour"
      ? (
          hour12 %
          12
        ) *
        30
      : parsed.minute *
        6;


  function applyHour(
    nextHour12:
      number
  ) {
    onChange(
      formatPaperSittingTime({
        hour24:
          buildHour24FromClock({
            hour12:
              nextHour12,

            meridiem,
          }),

        minute:
          parsed.minute,
      })
    );

    setMode(
      "minute"
    );
  }


  function applyMinute(
    nextMinute:
      number
  ) {
    onChange(
      formatPaperSittingTime({
        hour24:
          parsed.hour24,

        minute:
          nextMinute,
      })
    );
  }


  function applyMeridiem(
    nextMeridiem:
      "AM" | "PM"
  ) {
    onChange(
      formatPaperSittingTime({
        hour24:
          buildHour24FromClock({
            hour12,

            meridiem:
              nextMeridiem,
          }),

        minute:
          parsed.minute,
      })
    );
  }


  return (
    <div
      style={{
        width:
          "100%",

        display:
          "grid",

        justifyItems:
          "center",

        gap:
          8,
      }}
    >
      <div
        style={{
          width:
            "100%",

          display:
            "grid",

          gridTemplateColumns:
            "1fr 92px",

          gap:
            6,
        }}
      >
        <PreviewTraySegmentedControl
          value={
            mode
          }
          options={[
            {
              value:
                "hour",

              label:
                "Hour",
            },
            {
              value:
                "minute",

              label:
                "Minute",
            },
          ]}
          onChange={(
            next
          ) =>
            setMode(
              next as ClockMode
            )
          }
          ariaLabel="Clock selection mode"
          theme={
            theme
          }
        />

        <PreviewTraySegmentedControl
          value={
            meridiem
          }
          options={[
            {
              value:
                "AM",

              label:
                "AM",
            },
            {
              value:
                "PM",

              label:
                "PM",
            },
          ]}
          onChange={(
            next
          ) =>
            applyMeridiem(
              next as
                | "AM"
                | "PM"
            )
          }
          ariaLabel="AM or PM"
          theme={
            theme
          }
        />
      </div>

      <div
        style={{
          width:
            CLOCK_SIZE,

          height:
            CLOCK_SIZE,

          position:
            "relative",

          border:
            `1px solid ${theme.borderStandard}`,

          borderRadius:
            999,

          background:
            theme.controlBg,

          boxSizing:
            "border-box",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position:
              "absolute",

            left:
              "50%",

            top:
              "50%",

            width:
              2,

            height:
              HAND_LENGTH,

            marginLeft:
              -1,

            marginTop:
              -HAND_LENGTH,

            borderRadius:
              2,

            background:
              theme.accentPrimary,

            opacity:
              0.62,

            transformOrigin:
              "50% 100%",

            transform:
              `rotate(${selectedAngle}deg)`,

            pointerEvents:
              "none",

            transition:
              "transform 150ms ease",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position:
              "absolute",

            left:
              "50%",

            top:
              "50%",

            width:
              6,

            height:
              6,

            marginLeft:
              -3,

            marginTop:
              -3,

            borderRadius:
              999,

            background:
              theme.accentPrimary,

            pointerEvents:
              "none",
          }}
        />

        {mode ===
        "hour"
          ? Array.from(
              {
                length:
                  12,
              },
              (
                _,
                index
              ) => {
                const value12 =
                  index ===
                  0
                    ? 12
                    : index;

                const angle =
                  (
                    value12 %
                    12
                  ) *
                  30;

                return (
                  <ClockMarker
                    key={
                      value12
                    }
                    label={
                      String(
                        value12
                      )
                    }
                    angleDegrees={
                      angle
                    }
                    selected={
                      hour12 ===
                      value12
                    }
                    onClick={() =>
                      applyHour(
                        value12
                      )
                    }
                    theme={
                      theme
                    }
                  />
                );
              }
            )
          : Array.from(
              {
                length:
                  12,
              },
              (
                _,
                index
              ) => {
                const minute =
                  index *
                  5;

                const angle =
                  minute *
                  6;

                return (
                  <ClockMarker
                    key={
                      minute
                    }
                    label={String(
                      minute
                    ).padStart(
                      2,
                      "0"
                    )}
                    angleDegrees={
                      angle
                    }
                    selected={
                      parsed.minute ===
                      minute
                    }
                    onClick={() =>
                      applyMinute(
                        minute
                      )
                    }
                    theme={
                      theme
                    }
                  />
                );
              }
            )}
      </div>
    </div>
  );
}