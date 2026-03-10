"use client";

import { useMemo, useState } from "react";
import type { AppTheme as Theme } from "@/app/ui/AppTheme";

type Props = {
  theme: Theme;
  value: string;
  onCancel: () => void;
  onApply: (next: string) => void;
};

function pad2(value: number) {
  return value.toString().padStart(2, "0");
}

function parseDateText(text: string): Date | null {
  const match = text.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatDateText(date: Date) {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function getMonthMatrix(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: Array<{
    date: Date;
    inCurrentMonth: boolean;
  }> = [];

  for (let i = 0; i < startWeekday; i += 1) {
    const day = prevMonthDays - startWeekday + i + 1;
    cells.push({
      date: new Date(year, month - 1, day),
      inCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      date: new Date(year, month, day),
      inCurrentMonth: true,
    });
  }

  while (cells.length < 42) {
    const day = cells.length - (startWeekday + daysInMonth) + 1;
    cells.push({
      date: new Date(year, month + 1, day),
      inCurrentMonth: false,
    });
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return weeks;
}

function isSameDate(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function pickerGhostButtonStyle(theme: Theme): React.CSSProperties {
  return {
    height: 36,
    minWidth: 84,
    padding: "0 16px",
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: theme.buttonGhostBg,
    color: theme.text,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  };
}

function pickerPrimaryButtonStyle(theme: Theme): React.CSSProperties {
  return {
    height: 36,
    minWidth: 72,
    padding: "0 16px",
    borderRadius: 12,
    border: `1px solid ${theme.accent}`,
    background: theme.accentSoft,
    color: theme.text,
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  };
}

function pickerNavButtonStyle(theme: Theme): React.CSSProperties {
  return {
    width: 36,
    height: 36,
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: theme.buttonGhostBg,
    color: theme.text,
    fontSize: 18,
    fontWeight: 800,
    cursor: "pointer",
  };
}

export default function SharedCalendarPicker({
  theme,
  value,
  onCancel,
  onApply,
}: Props) {
  const parsed = parseDateText(value) ?? new Date();
  const [viewDate, setViewDate] = useState(
    new Date(parsed.getFullYear(), parsed.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(parsed);

  const weeks = useMemo(() => getMonthMatrix(viewDate), [viewDate]);

  const monthLabel = viewDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      style={{
        marginTop: 10,
        borderRadius: 18,
        border: `1px solid ${theme.border}`,
        background: theme.panelBg,
        padding: 14,
        boxShadow: theme.shadow,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "36px 1fr 36px",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <button
          type="button"
          onClick={() =>
            setViewDate(
              new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1),
            )
          }
          style={pickerNavButtonStyle(theme)}
        >
          ‹
        </button>

        <div
          style={{
            textAlign: "center",
            color: theme.text,
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
              new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1),
            )
          }
          style={pickerNavButtonStyle(theme)}
        >
          ›
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0,1fr))",
          gap: 6,
          marginBottom: 8,
        }}
      >
        {["M", "T", "W", "T", "F", "S", "S"].map((label, index) => (
          <div
            key={`${label}-${index}`}
            style={{
              textAlign: "center",
              color: theme.subtleText,
              fontSize: 12,
              fontWeight: 700,
              paddingBottom: 4,
            }}
          >
            {label}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(0,1fr))",
              gap: 6,
            }}
          >
            {week.map((cell, cellIndex) => {
              const selected = isSameDate(cell.date, selectedDate);

              return (
                <button
                  key={cellIndex}
                  type="button"
                  onClick={() => setSelectedDate(cell.date)}
                  style={{
                    height: 34,
                    borderRadius: 10,
                    border: `1px solid ${selected ? theme.accent : theme.border}`,
                    background: selected ? theme.accentSoft : theme.buttonGhostBg,
                    color: cell.inCurrentMonth ? theme.text : theme.mutedText,
                    fontSize: 13,
                    fontWeight: selected ? 800 : 600,
                    cursor: "pointer",
                  }}
                >
                  {cell.date.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          marginTop: 14,
        }}
      >
        <button type="button" onClick={onCancel} style={pickerGhostButtonStyle(theme)}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onApply(formatDateText(selectedDate))}
          style={pickerPrimaryButtonStyle(theme)}
        >
          OK
        </button>
      </div>
    </div>
  );
}