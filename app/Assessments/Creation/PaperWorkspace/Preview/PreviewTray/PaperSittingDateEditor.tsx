import {
  useEffect,
  useMemo,
  useState,
} from "react";

import CalendarHeader from "@/app/UI/Application/Components/Calendar/CalendarHeader";

import CalendarMonthGrid from "@/app/UI/Application/Components/Calendar/CalendarMonthGrid";

import {
  formatDateIso,
  getMonthMatrix,
  parseDateText,
} from "@/app/UI/Application/Components/Calendar/calendarUtils";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
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


export default function PaperSittingDateEditor({
  value,
  onChange,
  onComplete,
  theme,
}: PaperSittingDateEditorProps) {
  const parsedValue =
    parseDateText(
      value
    ) ??
    new Date();

  const [
    viewDate,
    setViewDate,
  ] =
    useState(
      () =>
        new Date(
          parsedValue.getFullYear(),
          parsedValue.getMonth(),
          1
        )
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
    ) ??
    parsedValue;


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
          8,
      }}
    >
      <div
        style={{
          height:
            32,

          padding:
            "0 9px",

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
            6,

          background:
            theme.controlBg,

          color:
            theme.textSecondary,
        }}
      >
        <span
          style={{
            ...UI_TEXT.controlTextStrong,

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
          width="13"
          height="13"
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
            7,

          border:
            `1px solid ${theme.borderStandard}`,

          borderRadius:
            6,

          background:
            theme.controlBg,
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
          onSelect={(
            date
          ) => {
            onChange(
              formatDateIso(
                date
              )
            );

            onComplete();
          }}
        />
      </div>
    </div>
  );
}