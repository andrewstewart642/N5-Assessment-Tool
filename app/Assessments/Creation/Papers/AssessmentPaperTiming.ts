import type {
  CourseAssessmentConfig,
} from "@/app/Courses/CourseAssessmentConfig";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import {
  getAssessmentPaperConfig,
} from "./AssessmentPaperRules";


type ParsedAssessmentTime = {
  hour24:
    number;

  minute:
    number;

  format:
    "12H" | "24H";
};


function parseAssessmentTimeText(
  timeText:
    string
): ParsedAssessmentTime | null {
  const trimmed =
    timeText.trim();

  /*
   * Modern tray format:
   *
   * 09:00
   * 9:00
   * 13:45
   */
  const twentyFourHourMatch =
    trimmed.match(
      /^(\d{1,2}):(\d{2})$/
    );

  if (
    twentyFourHourMatch
  ) {
    const hour =
      Number(
        twentyFourHourMatch[
          1
        ]
      );

    const minute =
      Number(
        twentyFourHourMatch[
          2
        ]
      );

    if (
      hour >= 0 &&
      hour <= 23 &&
      minute >= 0 &&
      minute <= 59
    ) {
      return {
        hour24:
          hour,

        minute,

        format:
          "24H",
      };
    }

    return null;
  }

  /*
   * Historical Settings format:
   *
   * 9:00 AM
   * 12:30 PM
   */
  const twelveHourMatch =
    trimmed.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );

  if (
    !twelveHourMatch
  ) {
    return null;
  }

  let hour =
    Number(
      twelveHourMatch[
        1
      ]
    );

  const minute =
    Number(
      twelveHourMatch[
        2
      ]
    );

  const meridiem =
    twelveHourMatch[
      3
    ].toUpperCase();

  if (
    hour < 1 ||
    hour > 12 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  if (
    meridiem ===
      "PM" &&
    hour !== 12
  ) {
    hour += 12;
  }

  if (
    meridiem ===
      "AM" &&
    hour === 12
  ) {
    hour = 0;
  }

  return {
    hour24:
      hour,

    minute,

    format:
      "12H",
  };
}


function formatAssessmentTime({
  totalMinutes,
  format,
}: {
  totalMinutes:
    number;

  format:
    ParsedAssessmentTime[
      "format"
    ];
}): string {
  const minutesInDay =
    24 * 60;

  const normalisedMinutes =
    (
      (
        totalMinutes %
        minutesInDay
      ) +
      minutesInDay
    ) %
    minutesInDay;

  const hour24 =
    Math.floor(
      normalisedMinutes /
        60
    );

  const minute =
    normalisedMinutes %
    60;

  if (
    format ===
    "24H"
  ) {
    return `${String(
      hour24
    ).padStart(
      2,
      "0"
    )}:${String(
      minute
    ).padStart(
      2,
      "0"
    )}`;
  }

  const meridiem =
    hour24 >= 12
      ? "PM"
      : "AM";

  let hour12 =
    hour24 %
    12;

  if (
    hour12 === 0
  ) {
    hour12 = 12;
  }

  return `${hour12}:${String(
    minute
  ).padStart(
    2,
    "0"
  )} ${meridiem}`;
}


export function calculateAssessmentPaperDurationMinutes({
  paper,
  marks,
  courseConfig,
}: {
  paper:
    Paper;

  marks:
    number;

  courseConfig:
    CourseAssessmentConfig;
}): number {
  const paperConfig =
    getAssessmentPaperConfig(
      paper,
      courseConfig
    );

  return Math.round(
    marks *
      paperConfig.minutesPerMark
  );
}


export function addMinutesToAssessmentTime({
  timeText,
  minutesToAdd,
}: {
  timeText:
    string;

  minutesToAdd:
    number;
}): string {
  const parsed =
    parseAssessmentTimeText(
      timeText
    );

  if (
    !parsed
  ) {
    return timeText;
  }

  const startMinutes =
    parsed.hour24 *
      60 +
    parsed.minute;

  return formatAssessmentTime({
    totalMinutes:
      startMinutes +
      Math.round(
        minutesToAdd
      ),

    format:
      parsed.format,
  });
}


export function calculateAssessmentPaperEndTimeFromDuration({
  startTime,
  durationMinutes,
}: {
  startTime:
    string;

  durationMinutes:
    number;
}): string {
  return addMinutesToAssessmentTime({
    timeText:
      startTime,

    minutesToAdd:
      durationMinutes,
  });
}