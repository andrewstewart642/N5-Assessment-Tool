import {
  useMemo,
  useState,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import CalendarHeader from "./Calendar/CalendarHeader";

import CalendarMonthGrid from "./Calendar/CalendarMonthGrid";

import CalendarPickerActions from "./Calendar/CalendarPickerActions";

import {
  formatDateIso,
  getMonthMatrix,
  parseDateText,
} from "./Calendar/calendarUtils";

type CalendarPickerProps = {
  theme:
    AppTheme;

  value:
    string;

  onCancel:
    () => void;

  onApply: (
    next:
      string
  ) => void;
};

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
        width:
          "100%",

        boxSizing:
          "border-box",

        borderRadius:
          6,

        border:
          `1px solid ${theme.borderStandard}`,

        background:
          theme.bgElevated,

        padding:
          8,

        boxShadow:
          theme.shadow,

        position:
          "relative",
      }}
    >
      <CalendarHeader
        theme={
          theme
        }
        monthLabel={
          monthLabel
        }
        onPrevious={() =>
          setViewDate(
            new Date(
              viewDate.getFullYear(),
              viewDate.getMonth() -
                1,
              1
            )
          )
        }
        onNext={() =>
          setViewDate(
            new Date(
              viewDate.getFullYear(),
              viewDate.getMonth() +
                1,
              1
            )
          )
        }
      />

      <CalendarMonthGrid
        theme={
          theme
        }
        weeks={
          weeks
        }
        selectedDate={
          selectedDate
        }
        onSelect={
          setSelectedDate
        }
      />

      <CalendarPickerActions
        theme={
          theme
        }
        onCancel={
          onCancel
        }
        onApply={() =>
          onApply(
            formatDateIso(
              selectedDate
            )
          )
        }
      />
    </div>
  );
}