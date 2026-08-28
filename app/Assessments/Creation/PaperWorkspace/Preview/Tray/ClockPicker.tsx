import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import PreviewTraySegmentedControl from "./SegmentedControl";

import {
  buildHour24FromClock,
  formatPaperSittingTime,
  getClockHour12,
  getClockMeridiem,
  parsePaperSittingTime,
  type PaperSittingTimeParts,
} from "./TimeParsingAndFormatting";


type ClockHand =
  | "hour"
  | "minute";


type PaperSittingClockProps = {
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


const CLOCK_SIZE =
  176;

const CLOCK_CENTRE =
  CLOCK_SIZE /
  2;

const FACE_RADIUS =
  82;

const NUMBER_RADIUS =
  66;

const HOUR_HAND_LENGTH =
  39;

const MINUTE_HAND_LENGTH =
  58;


function getDefaultClockTime(): PaperSittingTimeParts {
  return {
    hour24:
      9,

    minute:
      0,
  };
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


export default function PaperSittingClock({
  value,
  onChange,
  onComplete,
  theme,
}: PaperSittingClockProps) {
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

  const touchedHandsRef =
    useRef({
      hour:
        false,

      minute:
        false,
    });

  const completionSentRef =
    useRef(
      false
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
      PointerEvent<SVGSVGElement>
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


  function updateFromPointer({
    hand,
    event,
  }: {
    hand:
      ClockHand;

    event:
      PointerEvent<SVGSVGElement>;
  }) {
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

    updateFromPointer({
      hand,
      event,
    });
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

    updateFromPointer({
      hand,
      event,
    });

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


    const finalTime =
      draftRef.current;

    onChange(
      formatPaperSittingTime(
        finalTime
      )
    );


    touchedHandsRef.current = {
      ...touchedHandsRef.current,

      [hand]:
        true,
    };


    if (
      touchedHandsRef.current
        .hour &&
      touchedHandsRef.current
        .minute &&
      !completionSentRef.current
    ) {
      completionSentRef.current =
        true;

      window.setTimeout(
        onComplete,
        140
      );
    }
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
          8,
      }}
    >
      <div
        style={{
          width:
            104,
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
                  77,
              });

            const inner =
              getPointOnClock({
                angleDegrees:
                  angle,

                radius:
                  major
                    ? 72
                    : 74,
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
                    ? 1.2
                    : 0.7
                }
                opacity={
                  major
                    ? 0.62
                    : 0.28
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
                fontSize="10"
                fontWeight="500"
                pointerEvents="none"
              >
                {value12}
              </text>
            );
          }
        )}


        {/*
         * Hour hand — shorter and heavier.
         */}

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
          strokeWidth="5"
          strokeLinecap="round"
          opacity={
            activeDragHand ===
            "hour"
              ? 1
              : 0.82
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
          r="6"
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


        {/*
         * Minute hand — longer and lighter.
         */}

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
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={
            activeDragHand ===
            "minute"
              ? 1
              : 0.68
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
          r="4"
          fill={
            theme.accentPrimary
          }
          pointerEvents="none"
        />
      </svg>
    </div>
  );
}