import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  formatDateIso,
  getMonthMatrix,
  isSameDate,
  parseDateText,
} from "@/app/UI/Application/Components/Calendar/calendarUtils";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
  UI_TYPO,
} from "@/app/UI/Application/Typography/Typography";


type PaperSittingDateEditorProps = {
  value:
    string;

  onChange: (
    next:
      string
  ) => void;

  onComplete:
    () => void;

  theme:
    AppTheme;
};


function formatDateLabel(
  value:
    string
): string {
  const parsed =
    parseDateText(
      value
    );

  if (
    !parsed
  ) {
    return "Choose a date";
  }

  return parsed.toLocaleDateString(
    "en-GB",
    {
      weekday:
        "short",

      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",
    }
  );
}


function CalendarArrow({
  direction,
  onClick,
  theme,
}: {
  direction:
    "previous" |
    "next";

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

  const previous =
    direction ===
    "previous";

  return (
    <button
      type="button"
      aria-label={
        previous
          ? "Previous month"
          : "Next month"
      }
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
        width:
          22,

        height:
          22,

        padding:
          0,

        display:
          "grid",

        placeItems:
          "center",

        border:
          `1px solid ${theme.borderStandard}`,

        borderRadius:
          4,

        background:
          hovered
            ? theme.controlBgHover
            : theme.bgElevated,

        color:
          theme.textSecondary,

        cursor:
          "pointer",
      }}
    >
      <svg
        width="6"
        height="9"
        viewBox="0 0 6 9"
        aria-hidden="true"
      >
        <path
          d={
            previous
              ? "M4.75 1 L1.25 4.5 L4.75 8"
              : "M1.25 1 L4.75 4.5 L1.25 8"
          }
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}


export default function PaperSittingDateEditor({
  value,
  onChange,
  onComplete,
  theme,
}: PaperSittingDateEditorProps) {
  const parsedValue =
    parseDateText(
      value
    );

  const initialDate =
    parsedValue ??
    new Date();

  const [
    viewDate,
    setViewDate,
  ] =
    useState(
      () =>
        new Date(
          initialDate.getFullYear(),
          initialDate.getMonth(),
          1
        )
    );

  const [
    hoveredDateKey,
    setHoveredDateKey,
  ] =
    useState<string | null>(
      null
    );


  useEffect(() => {
    const next =
      parseDateText(
        value
      );

    if (
      !next
    ) {
      return;
    }

    setViewDate(
      new Date(
        next.getFullYear(),
        next.getMonth(),
        1
      )
    );
  }, [
    value,
  ]);


  const weeks =
    useMemo(
      () =>
        getMonthMatrix(
          viewDate
        ),
      [
        viewDate,
      ]
    );


  const selectedDate =
    parseDateText(
      value
    );

  const today =
    new Date();


  const monthLabel =
    viewDate.toLocaleDateString(
      "en-GB",
      {
        month:
          "long",

        year:
          "numeric",
      }
    );


  return (
    <div
      style={{
        width:
          "100%",

        display:
          "grid",

        gap:
          6,
      }}
    >
      <div
        style={{
          height:
            26,

          padding:
            "0 8px",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          gap:
            8,

          boxSizing:
            "border-box",

          border:
            `1px solid ${theme.borderStandard}`,

          borderRadius:
            5,

          background:
            theme.controlBg,

          color:
            theme.textSecondary,
        }}
      >
        <span
          style={{
            ...UI_TEXT.controlText,

            fontWeight:
              600,

            overflow:
              "hidden",

            whiteSpace:
              "nowrap",

            textOverflow:
              "ellipsis",
          }}
        >
          {formatDateLabel(
            value
          )}
        </span>

        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          aria-hidden="true"
          style={{
            flexShrink:
              0,

            color:
              theme.textMuted,
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
        </svg>
      </div>

      <div
        style={{
          width:
            "100%",

          boxSizing:
            "border-box",

          padding:
            6,

          border:
            `1px solid ${theme.borderStandard}`,

          borderRadius:
            6,

          background:
            theme.controlBg,
        }}
      >
        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "22px minmax(0, 1fr) 22px",

            alignItems:
              "center",

            gap:
              5,

            marginBottom:
              5,
          }}
        >
          <CalendarArrow
            direction="previous"
            onClick={() =>
              setViewDate(
                new Date(
                  viewDate.getFullYear(),
                  viewDate.getMonth() -
                    1,
                  1
                )
              )
            }
            theme={
              theme
            }
          />

          <div
            style={{
              minWidth:
                0,

              textAlign:
                "center",

              color:
                theme.textPrimary,

              fontFamily:
                UI_TYPO.family,

              fontSize:
                UI_TYPO.sizeSm,

              fontWeight:
                UI_TYPO.weightSemibold,

              lineHeight:
                1.1,

              whiteSpace:
                "nowrap",
            }}
          >
            {monthLabel}
          </div>

          <CalendarArrow
            direction="next"
            onClick={() =>
              setViewDate(
                new Date(
                  viewDate.getFullYear(),
                  viewDate.getMonth() +
                    1,
                  1
                )
              )
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

            gridTemplateColumns:
              "repeat(7, minmax(0, 1fr))",

            gap:
              2,

            marginBottom:
              2,
          }}
        >
          {[
            "M",
            "T",
            "W",
            "T",
            "F",
            "S",
            "S",
          ].map(
            (
              label,
              index
            ) => (
              <div
                key={`${label}-${index}`}
                style={{
                  height:
                    14,

                  display:
                    "grid",

                  placeItems:
                    "center",

                  color:
                    theme.textMuted,

                  fontFamily:
                    UI_TYPO.family,

                  fontSize:
                    10,

                  fontWeight:
                    UI_TYPO.weightMedium,
                }}
              >
                {label}
              </div>
            )
          )}
        </div>

        <div
          style={{
            display:
              "grid",

            gap:
              2,
          }}
        >
          {weeks.map(
            (
              week,
              weekIndex
            ) => (
              <div
                key={
                  weekIndex
                }
                style={{
                  display:
                    "grid",

                  gridTemplateColumns:
                    "repeat(7, minmax(0, 1fr))",

                  gap:
                    2,
                }}
              >
                {week.map(
                  (
                    cell
                  ) => {
                    const key =
                      `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`;

                    const selected =
                      isSameDate(
                        cell.date,
                        selectedDate
                      );

                    const todayCell =
                      isSameDate(
                        cell.date,
                        today
                      );

                    const hovered =
                      hoveredDateKey ===
                      key;

                    return (
                      <button
                        key={
                          key
                        }
                        type="button"
                        onClick={() => {
                          onChange(
                            formatDateIso(
                              cell.date
                            )
                          );

                          onComplete();
                        }}
                        onMouseEnter={() =>
                          setHoveredDateKey(
                            key
                          )
                        }
                        onMouseLeave={() =>
                          setHoveredDateKey(
                            null
                          )
                        }
                        style={{
                          height:
                            21,

                          minWidth:
                            0,

                          padding:
                            0,

                          border:
                            `1px solid ${
                              selected
                                ? theme.controlSelectedBorder
                                : todayCell
                                  ? theme.borderStandard
                                  : "transparent"
                            }`,

                          borderRadius:
                            4,

                          background:
                            selected
                              ? theme.controlSelectedBg
                              : hovered
                                ? theme.controlBgHover
                                : "transparent",

                          color:
                            cell.inCurrentMonth
                              ? theme.textPrimary
                              : theme.textMuted,

                          cursor:
                            "pointer",

                          fontFamily:
                            UI_TYPO.family,

                          fontSize:
                            10,

                          fontWeight:
                            selected
                              ? UI_TYPO.weightSemibold
                              : UI_TYPO.weightMedium,

                          transition:
                            "background 120ms ease, border-color 120ms ease",
                        }}
                      >
                        {
                          cell.date.getDate()
                        }
                      </button>
                    );
                  }
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}