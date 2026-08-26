import type { CourseAssessmentConfig } from "@/src/Courses/CourseAssessmentConfig";

import type {
  BuildPriority,
  PaperStructure,
} from "./AssessmentSetupStorage";

import {
  estimateMarksFromTime,
  estimateTimeFromMarks,
  getIncludedPapers,
  getPaperLabel,
  structureIncludesPaper,
} from "./AssessmentSetupCourseRules";

export function parsePositiveInteger(value: string): number | null {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  if (number <= 0) {
    return null;
  }

  return Math.round(number);
}

type TargetValidationArgs = {
  buildPriority: BuildPriority | null;
  paperStructure: PaperStructure | null;
  parsedMarksP1: number | null;
  parsedMarksP2: number | null;
  parsedTimeP1: number | null;
  parsedTimeP2: number | null;
  courseConfig: CourseAssessmentConfig;
};

export function areAssessmentTargetsValid({
  buildPriority,
  paperStructure,
  parsedMarksP1,
  parsedMarksP2,
  parsedTimeP1,
  parsedTimeP2,
  courseConfig,
}: TargetValidationArgs): boolean {
  if (!buildPriority || !paperStructure) {
    return false;
  }

  const includesP1 = structureIncludesPaper(
    paperStructure,
    "P1",
    courseConfig
  );

  const includesP2 = structureIncludesPaper(
    paperStructure,
    "P2",
    courseConfig
  );

  if (buildPriority === "MARKS") {
    const p1Valid = !includesP1 || parsedMarksP1 !== null;
    const p2Valid = !includesP2 || parsedMarksP2 !== null;

    return p1Valid && p2Valid;
  }

  const p1Valid = !includesP1 || parsedTimeP1 !== null;
  const p2Valid = !includesP2 || parsedTimeP2 !== null;

  return p1Valid && p2Valid;
}

type TargetSummaryArgs = {
  buildPriority: BuildPriority | null;
  paperStructure: PaperStructure | null;
  parsedMarksP1: number | null;
  parsedMarksP2: number | null;
  parsedTimeP1: number | null;
  parsedTimeP2: number | null;
  courseConfig: CourseAssessmentConfig;
};

export function buildAssessmentTargetSummary({
  buildPriority,
  paperStructure,
  parsedMarksP1,
  parsedMarksP2,
  parsedTimeP1,
  parsedTimeP2,
  courseConfig,
}: TargetSummaryArgs): string[] {
  if (!buildPriority || !paperStructure) {
    return [];
  }

  const rows: string[] = [];
  const includedPapers = getIncludedPapers(
    paperStructure,
    courseConfig
  );

  if (buildPriority === "MARKS") {
    if (includedPapers.includes("P1") && parsedMarksP1 !== null) {
      rows.push(
        `${getPaperLabel(
          "P1",
          courseConfig
        )} estimated time: ${estimateTimeFromMarks(
          "P1",
          parsedMarksP1,
          courseConfig
        )} mins`
      );
    }

    if (includedPapers.includes("P2") && parsedMarksP2 !== null) {
      rows.push(
        `${getPaperLabel(
          "P2",
          courseConfig
        )} estimated time: ${estimateTimeFromMarks(
          "P2",
          parsedMarksP2,
          courseConfig
        )} mins`
      );
    }

    return rows;
  }

  if (includedPapers.includes("P1") && parsedTimeP1 !== null) {
    rows.push(
      `${getPaperLabel(
        "P1",
        courseConfig
      )} estimated marks: ${estimateMarksFromTime(
        "P1",
        parsedTimeP1,
        courseConfig
      )}`
    );
  }

  if (includedPapers.includes("P2") && parsedTimeP2 !== null) {
    rows.push(
      `${getPaperLabel(
        "P2",
        courseConfig
      )} estimated marks: ${estimateMarksFromTime(
        "P2",
        parsedTimeP2,
        courseConfig
      )}`
    );
  }

  return rows;
}