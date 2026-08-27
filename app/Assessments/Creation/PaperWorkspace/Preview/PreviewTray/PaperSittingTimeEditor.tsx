import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import PaperSittingClock from "./PaperSittingClock";

import {
  formatPaperSittingTimeDraft,
  getPaperSittingTimeDraft,
} from "./PaperSittingTimeUtils";


type ActiveTimeField =
  | "start"
  | "end";


type PaperSittingTimeEditorProps = {
  startTime:
    string;

  endTime:
    string;

  onStartTimeChange: (
    next:
      string
  ) => void;

  onEndTimeChange: (
    next:
      string
  ) => void;

  theme:
    AppTheme;
};


function TimeInputGroup({
  label,
  value,
  selected,
  onSelect,
  onCommit,
  theme,
}: {
  label:
    string;

  value:
    string;

  selected:
    boolean;

  onSelect:
    () => void;

  onCommit: (
    next:
      string
  ) => void;

  theme:
    AppTheme;
}) {
  const initialDraft =
    getPaperSittingTimeDraft(
      value
    );

  const [
    hour,
    setHour,
  ] =
    useState(
      initialDraft.hour
    );

  const [
    minute,
    setMinute,
  ] =
    useState(
      initialDraft.minute
    );

  const [
    editing,
    setEditing,
  ] =
    useState(
      false
    );

  const minuteRef =
    useRef<HTMLInputElement | null>(
      null
    );


  useEffect(() => {
    if (
      editing
    ) {
      return;
    }

    const next =
      getPaperSittingTimeDraft(
        value
      );

    setHour(
      next.hour
    );

    setMinute(
      next.minute
    );
  }, [
    value,
    editing,
  ]);


  function restoreFromValue() {
    const restored =
      getPaperSittingTimeDraft(
        value
      );

    setHour(
      restored.hour
    );

    setMinute(
      restored.minute
    );
  }


  function commitDraft() {
    const next =
      formatPaperSittingTimeDraft({
        hour,
        minute,
      });

    if (
      !next
    ) {
      restoreFromValue();

      return;
    }

    setHour(
      next.slice(
        0,
        2
      )
    );

    setMinute(
      next.slice(
        3,
        5
      )
    );

    onCommit(
      next
    );
  }


  function handleContainerBlur(
    event:
      FocusEvent<HTMLDivElement>
  ) {
    const nextFocused =
      event.relatedTarget as
        | Node
        | null;

    if (
      nextFocused &&
      event.currentTarget.contains(
        nextFocused
      )
    ) {
      return;
    }

    setEditing(
      false
    );

    commitDraft();
  }


  function handleKeyDown(
    event:
      KeyboardEvent<HTMLInputElement>
  ) {
    if (
      event.key !==
      "Enter"
    ) {
      return;
    }

    event.preventDefault();

    commitDraft();

    event.currentTarget.blur();
  }


  return (
    <div
      onFocusCapture={() => {
        setEditing(
          true
        );

        onSelect();
      }}
      onBlur={
        handleContainerBlur
      }
      onClick={
        onSelect
      }
      style={{
        minWidth:
          0,

        padding:
          7,

        boxSizing:
          "border-box",

        display:
          "grid",

        gap:
          5,

        border:
          `1px solid ${
            selected
              ? theme.controlSelectedBorder
              : theme.borderStandard
          }`,

        borderRadius:
          6,

        background:
          selected
            ? theme.controlSelectedBg
            : theme.controlBg,

        transition:
          "background 150ms ease, border-color 150ms ease",
      }}
    >
      <div
        style={{
          ...UI_TEXT.sectionLabel,

          color:
            selected
              ? theme.textSecondary
              : theme.textMuted,
        }}
      >
        {label}
      </div>

      <div
        style={{
          minWidth:
            0,

          display:
            "grid",

          gridTemplateColumns:
            "1fr 9px 1fr",

          alignItems:
            "center",

          gap:
            3,
        }}
      >
        <input
          type="text"
          inputMode="numeric"
          aria-label={`${label} hour`}
          value={
            hour
          }
          maxLength={
            2
          }
          placeholder="HH"
          onChange={(
            event
          ) => {
            const next =
              event.target.value
                .replace(
                  /\D/g,
                  ""
                )
                .slice(
                  0,
                  2
                );

            setHour(
              next
            );

            if (
              next.length ===
              2
            ) {
              minuteRef.current
                ?.focus();

              minuteRef.current
                ?.select();
            }
          }}
          onKeyDown={
            handleKeyDown
          }
          style={{
            width:
              "100%",

            minWidth:
              0,

            height:
              30,

            padding:
              0,

            boxSizing:
              "border-box",

            border:
              `1px solid ${theme.borderStandard}`,

            borderRadius:
              4,

            background:
              theme.bgElevated,

            color:
              theme.textPrimary,

            textAlign:
              "center",

            outline:
              "none",

            ...UI_TEXT.controlTextStrong,
          }}
        />

        <div
          aria-hidden="true"
          style={{
            textAlign:
              "center",

            color:
              theme.textMuted,

            ...UI_TEXT.controlTextStrong,
          }}
        >
          :
        </div>

        <input
          ref={
            minuteRef
          }
          type="text"
          inputMode="numeric"
          aria-label={`${label} minute`}
          value={
            minute
          }
          maxLength={
            2
          }
          placeholder="MM"
          onChange={(
            event
          ) => {
            const next =
              event.target.value
                .replace(
                  /\D/g,
                  ""
                )
                .slice(
                  0,
                  2
                );

            setMinute(
              next
            );

            const completed =
              formatPaperSittingTimeDraft({
                hour,
                minute:
                  next,
              });

            if (
              next.length ===
                2 &&
              completed
            ) {
              onCommit(
                completed
              );
            }
          }}
          onKeyDown={
            handleKeyDown
          }
          style={{
            width:
              "100%",

            minWidth:
              0,

            height:
              30,

            padding:
              0,

            boxSizing:
              "border-box",

            border:
              `1px solid ${theme.borderStandard}`,

            borderRadius:
              4,

            background:
              theme.bgElevated,

            color:
              theme.textPrimary,

            textAlign:
              "center",

            outline:
              "none",

            ...UI_TEXT.controlTextStrong,
          }}
        />
      </div>
    </div>
  );
}


export default function PaperSittingTimeEditor({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  theme,
}: PaperSittingTimeEditorProps) {
  const [
    activeField,
    setActiveField,
  ] =
    useState<ActiveTimeField>(
      "start"
    );


  const activeValue =
    activeField ===
    "start"
      ? startTime
      : endTime;


  function handleClockChange(
    next:
      string
  ) {
    if (
      activeField ===
      "start"
    ) {
      onStartTimeChange(
        next
      );

      return;
    }

    onEndTimeChange(
      next
    );
  }


  return (
    <div
      style={{
        width:
          "100%",

        display:
          "grid",

        gap:
          10,
      }}
    >
      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            "1fr 1fr",

          gap:
            7,
        }}
      >
        <TimeInputGroup
          label="Start"
          value={
            startTime
          }
          selected={
            activeField ===
            "start"
          }
          onSelect={() =>
            setActiveField(
              "start"
            )
          }
          onCommit={
            onStartTimeChange
          }
          theme={
            theme
          }
        />

        <TimeInputGroup
          label="End"
          value={
            endTime
          }
          selected={
            activeField ===
            "end"
          }
          onSelect={() =>
            setActiveField(
              "end"
            )
          }
          onCommit={
            onEndTimeChange
          }
          theme={
            theme
          }
        />
      </div>

      <PaperSittingClock
        key={
          activeField
        }
        value={
          activeValue
        }
        onChange={
          handleClockChange
        }
        theme={
          theme
        }
      />
    </div>
  );
}