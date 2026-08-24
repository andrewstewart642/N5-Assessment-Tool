import type { Paper } from "@/shared-types/AssessmentTypes";
import {
  calculateActiveCourseEndTime,
  calculateActiveCoursePaperDurationMinutes,
} from "../AssessmentTiming";

export function calculateBuilderPaperDurationMinutes({
  paper,
  marks,
}: {
  paper: Paper;
  marks: number;
}): number {
  return calculateActiveCoursePaperDurationMinutes(paper, marks);
}

export function calculateBuilderEndTimeForPaper({
  paper,
  marks,
  startTime,
}: {
  paper: Paper;
  marks: number;
  startTime: string;
}): string {
  return calculateActiveCourseEndTime(paper, marks, startTime);
}