import {
  useMemo,
  useState,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

type CalendarPickerProps = {
  theme: AppTheme;

  value: string;

  onCancel: () => void;

  onApply: (
    next: string
  ) => void;
};

function pad2(
  value: number
): string {
  return value
    .toString()
    .padStart(
      2,
      "0"
    );
}

function parseDateText(
  text: string
): Date | null {
  const trimmed =
    text.trim();

  if (!trimmed) {
    return null;
  }

  const isoMatch =
    trimmed.match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

  if (isoMatch) {
    const year =
      Number(
        isoMatch[1]
      );

    const month =
      Number(
        isoMatch[2]
      );

    const day =
      Number(
        isoMatch[3]
      );

    const date =
      new Date(
        year,
        month - 1,
        day
      );

    if (
      date.getFullYear() ===
        year &&
      date.getMonth() ===
        month - 1 &&
      date.getDate() ===
        day
    ) {
      return date;
    }

    return null;
  }

  const slashMatch =
    trimmed.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    );

  if (slashMatch) {
    const day =
      Number(
        slashMatch[1]
      );

    const month =
      Number(
        slashMatch[2]
      );

    const year =
      Number(
        slashMatch[3]
      );

    const date =
      new Date(
        year,
        month - 1,
        day
      );

    if (
      date.getFullYear() ===
        year &&
      date.getMonth() ===
        month - 1 &&
      date.getDate() ===
        day
    ) {
      return date;
    }
  }

  return null;
}

function formatDateIso(
  date: Date
): string {
  return `${date.getFullYear()}-${pad2(
    date.getMonth() + 1
  )}-${pad2(
    date.getDate()
  )}`;
}

function getMonthMatrix(
  viewDate: Date
) {
  const year =
    viewDate.getFullYear();

  const month =
    viewDate.getMonth();

  const firstDay =
    new Date(
      year,
      month,
      1
    );

  const startWeekday =
    (
      firstDay.getDay() +
      6
    ) % 7;

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const previousMonthDays =
    new Date(
      year,
      month,
      0
    ).getDate();

  const cells: Array<{
    date: Date;

    inCurrentMonth:
      boolean;
  }> = [];

  for (
    let index = 0;
    index < startWeekday;
    index += 1
  ) {
    const day =
      previousMonthDays -
      startWeekday +
      index +
      1;

    cells.push({
      date:
        new Date(
          year,
          month - 1,
          day
        ),

      inCurrentMonth:
        false,
    });
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day += 1
  ) {
    cells.push({
      date:
        new Date(
          year,
          month,
          day
        ),

      inCurrentMonth:
        true,
    });
  }

  while (
    cells.length < 42
  ) {
    const day =
      cells.length -
      (
        startWeekday +
        daysInMonth
      ) +
      1;

    cells.push({
      date:
        new Date(
          year,
          month + 1,
          day
        ),

      inCurrentMonth:
        false,
    });
  }

  const weeks:
    typeof cells[] = [];

  for (
    let index = 0;
    index < cells.length;
    index += 7
  ) {
    weeks.push(
      cells.slice(
        index,
        index + 7
      )
    );
  }

  return weeks;
}

function isSameDate(
  first: Date | null,
  second: Date | null
): boolean {
  if (
    !first ||
    !second
  ) {
    return false;
  }

  return (
    first.getFullYear() ===
      second.getFullYear() &&
    first.getMonth() ===
      second.getMonth() &&
    first.getDate() ===
      second.getDate()
  );
}

function ghostButtonStyle(
  theme: AppTheme
): React.CSSProperties {
  return {
    height: 36,
    minWidth: 84,
    padding:
      "0 16px",

    borderRadius: 12,

    border:
      `1px solid ${theme.borderStandard}`,

    background:
      theme.controlBg,

    color:
      theme.textPrimary,

    fontSize: 14,
    fontWeight: 700,

    cursor:
      "pointer",
  };
}

function primaryButtonStyle(
  theme: AppTheme
): React.CSSProperties {
  return {
    height: 36,
    minWidth: 72,
    padding:
      "0 16px",

    borderRadius: 12,

    border:
      `1px solid ${theme.controlSelectedBorder}`,

    background:
      theme.controlSelectedBg,

    color:
      theme.textPrimary,

    fontSize: 14,
    fontWeight: 800,

    cursor:
      "pointer",
  };
}

function navigationButtonStyle(
  theme: AppTheme
): React.CSSProperties {
  return {
    width: 36,
    height: 36,

    borderRadius: 12,

    border:
      `1px solid ${theme.borderStandard}`,

    background:
      theme.controlBg,

    color:
      theme.textPrimary,

    fontSize: 18,
    fontWeight: 800,

    cursor:
      "pointer",
  };
}

export default function CalendarPicker({
  theme,
  value,
  onCancel,
  onApply,
}: CalendarPickerProps) {
  const parsed =
    parseDateText(
      value
    ) ??
    new Date();

  const [
    viewDate,
    setViewDate,
  ] =
    useState(
      new Date(
        parsed.getFullYear(),
        parsed.getMonth(),
        1
      )
    );

  const [
    selectedDate,
    setSelectedDate,
  ] =
    useState<Date>(
      parsed
    );

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
        marginTop: 10,

        borderRadius: 18,

        border:
          `1px solid ${theme.borderStandard}`,

        background:
          theme.bgSurface,

        padding: 14,

        boxShadow:
          theme.shadow,

        position:
          "relative",

        zIndex: 200,
      }}
    >
      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            "36px 1fr 36px",

          alignItems:
            "center",

          gap: 8,

          marginBottom: 12,
        }}
      >
        <button
          type="button"
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
          style={
            navigationButtonStyle(
              theme
            )
          }
        >
          ‹
        </button>

        <div
          style={{
            textAlign:
              "center",

            color:
              theme.textPrimary,

            fontWeight: 800,

            fontSize: 15,
          }}
        >
          {monthLabel}
        </div>

        <button
          type="button"
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
          style={
            navigationButtonStyle(
              theme
            )
          }
        >
          ›
        </button>
      </div>

      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            "repeat(7, minmax(0,1fr))",

          gap: 6,

          marginBottom: 8,
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
                textAlign:
                  "center",

                color:
                  theme.textMuted,

                fontSize:
                  12,

                fontWeight:
                  700,

                paddingBottom:
                  4,
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

          gap: 6,
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
                  "repeat(7, minmax(0,1fr))",

                gap: 6,
              }}
            >
              {week.map(
                (
                  cell,
                  cellIndex
                ) => {
                  const selected =
                    isSameDate(
                      cell.date,
                      selectedDate
                    );

                  return (
                    <button
                      key={
                        cellIndex
                      }
                      type="button"
                      onClick={() =>
                        setSelectedDate(
                          cell.date
                        )
                      }
                      style={{
                        height:
                          34,

                        borderRadius:
                          10,

                        border:
                          `1px solid ${
                            selected
                              ? theme.controlSelectedBorder
                              : theme.borderStandard
                          }`,

                        background:
                          selected
                            ? theme.controlSelectedBg
                            : theme.controlBg,

                        color:
                          cell.inCurrentMonth
                            ? theme.textPrimary
                            : theme.textMuted,

                        fontSize:
                          13,

                        fontWeight:
                          selected
                            ? 800
                            : 600,

                        cursor:
                          "pointer",
                      }}
                    >
                      {cell.date.getDate()}
                    </button>
                  );
                }
              )}
            </div>
          )
        )}
      </div>

      <div
        style={{
          display:
            "flex",

          justifyContent:
            "space-between",

          gap: 10,

          marginTop: 14,
        }}
      >
        <button
          type="button"
          onClick={
            onCancel
          }
          style={
            ghostButtonStyle(
              theme
            )
          }
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() =>
            onApply(
              formatDateIso(
                selectedDate
              )
            )
          }
          style={
            primaryButtonStyle(
              theme
            )
          }
        >
          OK
        </button>
      </div>
    </div>
  );
}