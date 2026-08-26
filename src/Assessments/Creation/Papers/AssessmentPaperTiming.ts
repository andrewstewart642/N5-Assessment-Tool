import type {
  CourseAssessmentConfig,
} from "@/src/Courses/CourseAssessmentConfig";

import type {
  Paper,
} from "@/shared-types/AssessmentTypes";

import {
  getAssessmentPaperConfig,
} from "./AssessmentPaperRules";

export function calculateAssessmentPaperDurationMinutes({
  paper,
  marks,
  courseConfig,
}: {
  paper: Paper;
  marks: number;
  courseConfig: CourseAssessmentConfig;
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
  timeText: string;
  minutesToAdd: number;
}): string {
  const match =
    timeText.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );

  if (!match) {
    return timeText;
  }

  let hour =
    Number(match[1]);

  const minute =
    Number(match[2]);

  const meridiem =
    match[3].toUpperCase();

  if (
    meridiem === "PM" &&
    hour !== 12
  ) {
    hour += 12;
  }

  if (
    meridiem === "AM" &&
    hour === 12
  ) {
    hour = 0;
  }

  const date =
    new Date();

  date.setHours(
    hour
  );

  date.setMinutes(
    minute +
      minutesToAdd
  );

  let newHour =
    date.getHours();

  const newMinute =
    date.getMinutes();

  const newMeridiem =
    newHour >= 12
      ? "PM"
      : "AM";

  newHour =
    newHour % 12;

  if (
    newHour === 0
  ) {
    newHour = 12;
  }

  return `${newHour}:${newMinute
    .toString()
    .padStart(
      2,
      "0"
    )} ${newMeridiem}`;
}

export function calculateAssessmentPaperEndTime({
  paper,
  marks,
  startTime,
  courseConfig,
}: {
  paper: Paper;
  marks: number;
  startTime: string;
  courseConfig: CourseAssessmentConfig;
}): string {
  const duration =
    calculateAssessmentPaperDurationMinutes({
      paper,
      marks,
      courseConfig,
    });

  return addMinutesToAssessmentTime({
    timeText:
      startTime,

    minutesToAdd:
      duration,
  });
}