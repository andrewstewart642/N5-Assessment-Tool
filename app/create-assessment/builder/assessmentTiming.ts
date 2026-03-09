export type CourseId = "N5" | "Higher" | "AdvancedHigher";
export type PaperId = "paper1" | "paper2";

type TimingRule = {
  minutesPerMark: number;
};

type CourseTiming = {
  [paper in PaperId]: TimingRule;
};

const TIMING_RULES: Record<CourseId, CourseTiming> = {
  N5: {
    paper1: { minutesPerMark: 1.5 },
    paper2: { minutesPerMark: 1.8 },
  },
  Higher: {
    paper1: { minutesPerMark: 1.5 },
    paper2: { minutesPerMark: 1.8 },
  },
  AdvancedHigher: {
    paper1: { minutesPerMark: 1.5 },
    paper2: { minutesPerMark: 1.8 },
  },
};

export function getMinutesPerMark(course: CourseId, paper: PaperId): number {
  const courseRules = TIMING_RULES[course];

  if (!courseRules) {
    throw new Error(`Unknown course timing: ${course}`);
  }

  return courseRules[paper].minutesPerMark;
}

export function calculatePaperDurationMinutes(
  course: CourseId,
  paper: PaperId,
  marks: number,
): number {
  const minutesPerMark = getMinutesPerMark(course, paper);
  return Math.round(marks * minutesPerMark);
}

export function addMinutesToTimeString(
  timeText: string,
  minutesToAdd: number,
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
  course: CourseId,
  paper: PaperId,
  marks: number,
  startTime: string,
): string {
  const duration = calculatePaperDurationMinutes(course, paper, marks);
  return addMinutesToTimeString(startTime, duration);
}