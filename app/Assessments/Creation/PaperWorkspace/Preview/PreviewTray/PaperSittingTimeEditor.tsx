import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
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
  formatPaperSittingTimeDraft,
  getClockHour12,
  getClockMeridiem,
  getPaperSittingTimeDraft,
  parsePaperSittingTime,
  type PaperSittingTimeParts,
} from "./PaperSittingTimeUtils";


type ActiveTimeField =
  | "start"
  | "end";


type ClockHand =
  | "hour"
  | "minute";


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


const CLOCK_SIZE =
  140;

const CLOCK_CENTRE =
  CLOCK_SIZE /
  2;

const FACE_RADIUS =
  65;

const NUMBER_RADIUS =
  50;

const HOUR_HAND_LENGTH =
  30;

const MINUTE_HAND_LENGTH =
  46;


function getNormalisedTimeValue(
  value:
    string
): string {
  const draft =
    getPaperSittingTimeDraft(
      value
    );

  return (
    formatPaperSittingTimeDraft(
      draft
    ) ??
    ""
  );
}


function focusAndSelect(
  inputRef:
    RefObject<HTMLInputElement | null>
) {
  const input =
    inputRef.current;

  if (
    !input
  ) {
    return;
  }

  input.focus();
  input.select();
}


function TimeInputGroup({
  label,
  value,
  selected,

  hourInputRef,
  minuteInputRef,
  nextInputRef,

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

  hourInputRef:
    RefObject<HTMLInputElement | null>;

  minuteInputRef:
    RefObject<HTMLInputElement | null>;

  nextInputRef?:
    RefObject<HTMLInputElement | null>;

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

  const lastCommittedRef =
    useRef(
      getNormalisedTimeValue(
        value
      )
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

    lastCommittedRef.current =
      getNormalisedTimeValue(
        value
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

    lastCommittedRef.current =
      getNormalisedTimeValue(
        value
      );
  }


  function commitDraft({
    nextHour =
      hour,

    nextMinute =
      minute,
  }: {
    nextHour?:
      string;

    nextMinute?:
      string;
  } = {}): boolean {
    const next =
      formatPaperSittingTimeDraft({
        hour:
          nextHour,

        minute:
          nextMinute,
      });

    if (
      !next
    ) {
      return false;
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

    if (
      next !==
      lastCommittedRef.current
    ) {
      lastCommittedRef.current =
        next;

      onCommit(
        next
      );
    }

    return true;
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

    const committed =
      commitDraft();

    if (
      !committed
    ) {
      restoreFromValue();
    }
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

    const committed =
      commitDraft();

    if (
      committed
    ) {
      event.currentTarget.blur();
    }
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
          5,

        boxSizing:
          "border-box",

        display:
          "grid",

        gap:
          3,

        border:
          `1px solid ${
            selected
              ? theme.controlSelectedBorder
              : theme.borderStandard
          }`,

        borderRadius:
          5,

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
            "1fr 7px 1fr",

          alignItems:
            "center",

          gap:
            2,
        }}
      >
        <input
          ref={
            hourInputRef
          }
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
          onFocus={(
            event
          ) =>
            event.currentTarget.select()
          }
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
              next.length !==
              2
            ) {
              return;
            }

            const numericHour =
              Number(
                next
              );

            if (
              numericHour < 0 ||
              numericHour > 23
            ) {
              return;
            }

            requestAnimationFrame(
              () =>
                focusAndSelect(
                  minuteInputRef
                )
            );
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
              27,

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
            minuteInputRef
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
          onFocus={(
            event
          ) =>
            event.currentTarget.select()
          }
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

            if (
              next.length !==
              2
            ) {
              return;
            }

            const numericMinute =
              Number(
                next
              );

            if (
              numericMinute < 0 ||
              numericMinute > 59
            ) {
              return;
            }

            const committed =
              commitDraft({
                nextMinute:
                  next,
              });

            if (
              !committed
            ) {
              return;
            }

            if (
              nextInputRef
            ) {
              window.setTimeout(
                () =>
                  focusAndSelect(
                    nextInputRef
                  ),
                60
              );

              return;
            }

            const input =
              event.currentTarget;

            window.setTimeout(
              () =>
                input.blur(),
              40
            );
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
              27,

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


function getDefaultClockTime(): PaperSittingTimeParts {
  return {
    hour24:
      9,

    minute:
      0,
  };
}


function normaliseAngle(
  angle:
    number
): number {
  return (
    (
      angle %
      360
    ) +
    360
  ) %
  360;
}


function getPointOnClock({
  angleDegrees,
  radius,
}: {
  angleDegrees:
    number;

  radius:
    number;
}) {
  const radians =
    (
      angleDegrees -
      90
    ) *
    (
      Math.PI /
      180
    );

  return {
    x:
      CLOCK_CENTRE +
      Math.cos(
        radians
      ) *
        radius,

    y:
      CLOCK_CENTRE +
      Math.sin(
        radians
      ) *
        radius,
  };
}


function CompactClock({
  value,
  onChange,
  theme,
}: {
  value:
    string;

  onChange: (
    next:
      string
  ) => void;

  theme:
    AppTheme;
}) {
  const svgRef =
    useRef<SVGSVGElement | null>(
      null
    );

  const dragHandRef =
    useRef<ClockHand | null>(
      null
    );

  const draftRef =
    useRef<PaperSittingTimeParts>(
      parsePaperSittingTime(
        value
      ) ??
        getDefaultClockTime()
    );

  const [
    draft,
    setDraft,
  ] =
    useState<PaperSittingTimeParts>(
      draftRef.current
    );

  const [
    activeDragHand,
    setActiveDragHand,
  ] =
    useState<ClockHand | null>(
      null
    );


  useEffect(() => {
    if (
      dragHandRef.current
    ) {
      return;
    }

    const parsed =
      parsePaperSittingTime(
        value
      );

    if (
      !parsed
    ) {
      return;
    }

    draftRef.current =
      parsed;

    setDraft(
      parsed
    );
  }, [
    value,
  ]);


  const hour12 =
    getClockHour12(
      draft.hour24
    );

  const meridiem =
    getClockMeridiem(
      draft.hour24
    );

  const hourAngle =
    (
      hour12 %
      12
    ) *
    30;

  const minuteAngle =
    draft.minute *
    6;


  const hourTip =
    getPointOnClock({
      angleDegrees:
        hourAngle,

      radius:
        HOUR_HAND_LENGTH,
    });

  const minuteTip =
    getPointOnClock({
      angleDegrees:
        minuteAngle,

      radius:
        MINUTE_HAND_LENGTH,
    });


  function updateDraft(
    next:
      PaperSittingTimeParts
  ) {
    draftRef.current =
      next;

    setDraft(
      next
    );
  }


  function getPointerAngle(
    event:
      PointerEvent<SVGElement>
  ): number | null {
    const svg =
      svgRef.current;

    if (
      !svg
    ) {
      return null;
    }

    const rect =
      svg.getBoundingClientRect();

    const centreX =
      rect.left +
      rect.width /
        2;

    const centreY =
      rect.top +
      rect.height /
        2;

    const deltaX =
      event.clientX -
      centreX;

    const deltaY =
      event.clientY -
      centreY;

    const angle =
      (
        Math.atan2(
          deltaY,
          deltaX
        ) *
        180
      ) /
        Math.PI +
      90;

    return normaliseAngle(
      angle
    );
  }


  function updateFromPointer(
    hand:
      ClockHand,

    event:
      PointerEvent<SVGElement>
  ) {
    const angle =
      getPointerAngle(
        event
      );

    if (
      angle ===
      null
    ) {
      return;
    }

    const current =
      draftRef.current;


    if (
      hand ===
      "hour"
    ) {
      const clockIndex =
        Math.round(
          angle /
            30
        ) %
        12;

      const nextHour12 =
        clockIndex ===
        0
          ? 12
          : clockIndex;

      updateDraft({
        ...current,

        hour24:
          buildHour24FromClock({
            hour12:
              nextHour12,

            meridiem:
              getClockMeridiem(
                current.hour24
              ),
          }),
      });

      return;
    }


    const nextMinute =
      Math.round(
        angle /
          6
      ) %
      60;

    updateDraft({
      ...current,

      minute:
        nextMinute,
    });
  }


  function startDragging(
    hand:
      ClockHand,

    event:
      PointerEvent<SVGElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    const svg =
      svgRef.current;

    if (
      !svg
    ) {
      return;
    }

    dragHandRef.current =
      hand;

    setActiveDragHand(
      hand
    );

    updateFromPointer(
      hand,
      event
    );

    svg.setPointerCapture(
      event.pointerId
    );
  }


  function handlePointerMove(
    event:
      PointerEvent<SVGSVGElement>
  ) {
    const hand =
      dragHandRef.current;

    if (
      !hand
    ) {
      return;
    }

    event.preventDefault();

    updateFromPointer(
      hand,
      event
    );
  }


  function finishDragging(
    event:
      PointerEvent<SVGSVGElement>
  ) {
    const hand =
      dragHandRef.current;

    if (
      !hand
    ) {
      return;
    }

    updateFromPointer(
      hand,
      event
    );

    dragHandRef.current =
      null;

    setActiveDragHand(
      null
    );


    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }

    onChange(
      formatPaperSittingTime(
        draftRef.current
      )
    );
  }


  function cancelDragging(
    event:
      PointerEvent<SVGSVGElement>
  ) {
    dragHandRef.current =
      null;

    setActiveDragHand(
      null
    );

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }

    const restored =
      parsePaperSittingTime(
        value
      );

    if (
      restored
    ) {
      updateDraft(
        restored
      );
    }
  }


  function applyMeridiem(
    nextMeridiem:
      "AM" | "PM"
  ) {
    const current =
      draftRef.current;

    const next = {
      ...current,

      hour24:
        buildHour24FromClock({
          hour12:
            getClockHour12(
              current.hour24
            ),

          meridiem:
            nextMeridiem,
        }),
    };

    updateDraft(
      next
    );

    onChange(
      formatPaperSittingTime(
        next
      )
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
          6,
      }}
    >
      <div
        style={{
          width:
            96,
        }}
      >
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
          height={
            28
          }
        />
      </div>

      <svg
        ref={
          svgRef
        }
        width={
          CLOCK_SIZE
        }
        height={
          CLOCK_SIZE
        }
        viewBox={`0 0 ${CLOCK_SIZE} ${CLOCK_SIZE}`}
        aria-label="Time clock"
        onPointerMove={
          handlePointerMove
        }
        onPointerUp={
          finishDragging
        }
        onPointerCancel={
          cancelDragging
        }
        style={{
          display:
            "block",

          overflow:
            "visible",

          touchAction:
            "none",

          userSelect:
            "none",
        }}
      >
        <circle
          cx={
            CLOCK_CENTRE
          }
          cy={
            CLOCK_CENTRE
          }
          r={
            FACE_RADIUS
          }
          fill={
            theme.controlBg
          }
          stroke={
            theme.borderStandard
          }
          strokeWidth="1"
        />


        {Array.from(
          {
            length:
              60,
          },
          (
            _,
            index
          ) => {
            const major =
              index %
                5 ===
              0;

            const angle =
              index *
              6;

            const outer =
              getPointOnClock({
                angleDegrees:
                  angle,

                radius:
                  62,
              });

            const inner =
              getPointOnClock({
                angleDegrees:
                  angle,

                radius:
                  major
                    ? 57
                    : 59,
              });

            return (
              <line
                key={
                  index
                }
                x1={
                  inner.x
                }
                y1={
                  inner.y
                }
                x2={
                  outer.x
                }
                y2={
                  outer.y
                }
                stroke={
                  theme.textMuted
                }
                strokeWidth={
                  major
                    ? 1.1
                    : 0.65
                }
                opacity={
                  major
                    ? 0.58
                    : 0.25
                }
              />
            );
          }
        )}


        {Array.from(
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

            const point =
              getPointOnClock({
                angleDegrees:
                  angle,

                radius:
                  NUMBER_RADIUS,
              });

            return (
              <text
                key={
                  value12
                }
                x={
                  point.x
                }
                y={
                  point.y
                }
                textAnchor="middle"
                dominantBaseline="central"
                fill={
                  theme.textSecondary
                }
                fontSize="9"
                fontWeight="500"
                pointerEvents="none"
              >
                {value12}
              </text>
            );
          }
        )}


        <line
          x1={
            CLOCK_CENTRE
          }
          y1={
            CLOCK_CENTRE
          }
          x2={
            hourTip.x
          }
          y2={
            hourTip.y
          }
          stroke={
            theme.accentPrimary
          }
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity={
            activeDragHand ===
            "hour"
              ? 1
              : 0.88
          }
          pointerEvents="none"
        />

        <line
          x1={
            CLOCK_CENTRE
          }
          y1={
            CLOCK_CENTRE
          }
          x2={
            hourTip.x
          }
          y2={
            hourTip.y
          }
          stroke="transparent"
          strokeWidth="18"
          strokeLinecap="round"
          onPointerDown={(
            event
          ) =>
            startDragging(
              "hour",
              event
            )
          }
          style={{
            cursor:
              "grab",
          }}
        />

        <circle
          cx={
            hourTip.x
          }
          cy={
            hourTip.y
          }
          r="5"
          fill={
            theme.accentPrimary
          }
          stroke={
            theme.bgElevated
          }
          strokeWidth="2"
          onPointerDown={(
            event
          ) =>
            startDragging(
              "hour",
              event
            )
          }
          style={{
            cursor:
              "grab",
          }}
        />


        <line
          x1={
            CLOCK_CENTRE
          }
          y1={
            CLOCK_CENTRE
          }
          x2={
            minuteTip.x
          }
          y2={
            minuteTip.y
          }
          stroke={
            theme.accentPrimary
          }
          strokeWidth="2.3"
          strokeLinecap="round"
          opacity={
            activeDragHand ===
            "minute"
              ? 1
              : 0.62
          }
          pointerEvents="none"
        />

        <line
          x1={
            CLOCK_CENTRE
          }
          y1={
            CLOCK_CENTRE
          }
          x2={
            minuteTip.x
          }
          y2={
            minuteTip.y
          }
          stroke="transparent"
          strokeWidth="15"
          strokeLinecap="round"
          onPointerDown={(
            event
          ) =>
            startDragging(
              "minute",
              event
            )
          }
          style={{
            cursor:
              "grab",
          }}
        />

        <circle
          cx={
            minuteTip.x
          }
          cy={
            minuteTip.y
          }
          r="4.5"
          fill={
            theme.accentPrimary
          }
          stroke={
            theme.bgElevated
          }
          strokeWidth="2"
          onPointerDown={(
            event
          ) =>
            startDragging(
              "minute",
              event
            )
          }
          style={{
            cursor:
              "grab",
          }}
        />


        <circle
          cx={
            CLOCK_CENTRE
          }
          cy={
            CLOCK_CENTRE
          }
          r="3.5"
          fill={
            theme.accentPrimary
          }
          pointerEvents="none"
        />
      </svg>
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


  const startHourRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const startMinuteRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const endHourRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const endMinuteRef =
    useRef<HTMLInputElement | null>(
      null
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
          6,
      }}
    >
      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            "1fr 1fr",

          gap:
            6,
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
          hourInputRef={
            startHourRef
          }
          minuteInputRef={
            startMinuteRef
          }
          nextInputRef={
            endHourRef
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
          hourInputRef={
            endHourRef
          }
          minuteInputRef={
            endMinuteRef
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

      <CompactClock
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