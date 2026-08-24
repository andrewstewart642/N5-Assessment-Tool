import {
  ACTIVE_COURSE_CONFIG,
  getActiveCourseConfig,
} from "@/course-data/course-configs/ActiveCourseConfig";

import {
  getCoursePaperConfig,
  type CourseAssessmentConfig,
} from "@/course-data/course-configs/CourseConfigTypes";

import type { CourseId, Paper } from "@/shared-types/AssessmentTypes_TEMP";

/**
 * Legacy IDs kept temporarily so existing code can keep working while the
 * app moves towards course-config-driven timing.
 */
export type LegacyCourseId = "N5" | "Higher" | "AdvancedHigher";
export type CourseTimingId = CourseId | LegacyCourseId;

export type LegacyPaperId = "paper1" | "paper2";
export type PaperTimingId = Paper | LegacyPaperId;

function normalisePaperId(paper: PaperTimingId): Paper {
  if (paper === "paper1") return "P1";
  if (paper === "paper2") return "P2";
  return paper;
}

function resolveTimingCourseConfig(course: CourseTimingId): CourseAssessmentConfig {
  const activeConfig = getActiveCourseConfig();

  /**
   * Current bridge behaviour:
   *
   * - N5_MATH and legacy N5 both resolve to the active N5 config.
   * - Higher / AdvancedHigher are not real configs yet, so they temporarily
   *   resolve to the active config to preserve old behaviour while we refactor.
   *
   * Once Higher has its own config, this function should become a proper
   * course-config lookup.
   */
  if (course === activeConfig.courseId || course === "N5") {
    return activeConfig;
  }

  return activeConfig;
}

export function getMinutesPerMark(
  course: CourseTimingId,
  paper: PaperTimingId
): number {
  const courseConfig = resolveTimingCourseConfig(course);
  const paperConfig = getCoursePaperConfig(courseConfig, normalisePaperId(paper));

  return paperConfig.minutesPerMark;
}

export function getActiveCourseMinutesPerMark(paper: Paper): number {
  const paperConfig = getCoursePaperConfig(ACTIVE_COURSE_CONFIG, paper);
  return paperConfig.minutesPerMark;
}

export function calculatePaperDurationMinutes(
  course: CourseTimingId,
  paper: PaperTimingId,
  marks: number
): number {
  const minutesPerMark = getMinutesPerMark(course, paper);
  return Math.round(marks * minutesPerMark);
}

export function calculateActiveCoursePaperDurationMinutes(
  paper: Paper,
  marks: number
): number {
  const minutesPerMark = getActiveCourseMinutesPerMark(paper);
  return Math.round(marks * minutesPerMark);
}

export function addMinutesToTimeString(
  timeText: string,
  minutesToAdd: number
): string {
  const match = timeText.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    return timeText;
  }

  let hour = Number(match[1]);
  let minute = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;

  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute + minutesToAdd);

  let newHour = date.getHours();
  const newMinute = date.getMinutes();
  const newMeridiem = newHour >= 12 ? "PM" : "AM";

  newHour = newHour % 12;
  if (newHour === 0) newHour = 12;

  return `${newHour}:${newMinute.toString().padStart(2, "0")} ${newMeridiem}`;
}

export function calculateEndTime(
  course: CourseTimingId,
  paper: PaperTimingId,
  marks: number,
  startTime: string
): string {
  const duration = calculatePaperDurationMinutes(course, paper, marks);
  return addMinutesToTimeString(startTime, duration);
}

export function calculateActiveCourseEndTime(
  paper: Paper,
  marks: number,
  startTime: string
): string {
  const duration = calculateActiveCoursePaperDurationMinutes(paper, marks);
  return addMinutesToTimeString(startTime, duration);
}