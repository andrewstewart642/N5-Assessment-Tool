import {
  useState,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TYPO,
} from "@/app/UI/Application/Typography/Typography";

import {
  isSameDate,
  type CalendarCell,
} from "./calendarUtils";

type CalendarMonthGridProps = {
  theme:
    AppTheme;

  weeks:
    CalendarCell[][];

  selectedDate:
    Date;

  onSelect:
    (
      date:
        Date
    ) => void;
};

export default function CalendarMonthGrid({
  theme,
  weeks,
  selectedDate,
  onSelect,
}: CalendarMonthGridProps) {
  const [
    hoveredKey,
    setHoveredKey,
  ] =
    useState<string | null>(
      null
    );

  const today =
    new Date();

  return (
    <div
      style={{
        display:
          "grid",

        gap:
          3,
      }}
    >
      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            "repeat(7, minmax(0, 1fr))",

          gap:
            3,
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
                  20,

                display:
                  "grid",

                placeItems:
                  "center",

                color:
                  theme.textMuted,

                fontFamily:
                  UI_TYPO.family,

                fontSize:
                  UI_TYPO.sizeSm,

                fontWeight:
                  UI_TYPO.weightMedium,
              }}
            >
              {label}
            </div>
          )
        )}
      </div>

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
                3,
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

                const hovered =
                  hoveredKey ===
                  key;

                const todayCell =
                  isSameDate(
                    cell.date,
                    today
                  );

                return (
                  <button
                    key={
                      key
                    }
                    type="button"
                    onClick={() =>
                      onSelect(
                        cell.date
                      )
                    }
                    onMouseEnter={() =>
                      setHoveredKey(
                        key
                      )
                    }
                    onMouseLeave={() =>
                      setHoveredKey(
                        null
                      )
                    }
                    style={{
                      height:
                        28,

                      minWidth:
                        0,

                      padding:
                        0,

                      borderRadius:
                        4,

                      border:
                        `1px solid ${
                          selected
                            ? theme.controlSelectedBorder
                            : todayCell
                              ? theme.borderStandard
                              : "transparent"
                        }`,

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

                      fontFamily:
                        UI_TYPO.family,

                      fontSize:
                        UI_TYPO.sizeMeta,

                      fontWeight:
                        selected
                          ? UI_TYPO.weightSemibold
                          : UI_TYPO.weightMedium,

                      cursor:
                        "pointer",

                      transition:
                        "background 0.12s ease, border-color 0.12s ease, color 0.12s ease",
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
  );
}