import {
  findCoursePaperConfigForSuitability,
  getCourseAssessmentStructure,
  getCoursePaperConfig,
  type CourseAssessmentConfig,
  type CoursePaperConfig,
} from "@/app/Courses/CourseAssessmentConfig";

import type { Paper } from "@/app/Assessments/AssessmentTypes";

import type {
  AssessmentType,
  PaperStructure,
} from "./SavedChoices";

export function isSetupAssessmentType(
  value: AssessmentType,
  courseConfig: CourseAssessmentConfig
): boolean {
  const visibleModeIds =
    courseConfig.visibleSetupAssessmentModeIds ??
    courseConfig.assessmentModes.map((mode) => mode.id);

  return visibleModeIds.includes(value);
}

export function isSetupPaperStructure(
  value: PaperStructure,
  courseConfig: CourseAssessmentConfig
): boolean {
  const visibleStructureIds =
    courseConfig.visibleSetupAssessmentStructureIds ??
    courseConfig.assessmentStructures.map((structure) => structure.id);

  return visibleStructureIds.includes(value);
}

export function getIncludedPapers(
  structure: PaperStructure,
  courseConfig: CourseAssessmentConfig
): Paper[] {
  return getCourseAssessmentStructure(courseConfig, structure).includedPapers;
}

export function getSetupPaperConfig(
  paper: Paper,
  courseConfig: CourseAssessmentConfig
): CoursePaperConfig {
  const exactPaperConfig = courseConfig.papers.find(
    (paperConfig) => paperConfig.id === paper
  );

  if (exactPaperConfig) {
    return exactPaperConfig;
  }

  const aliasPaperConfig = findCoursePaperConfigForSuitability(
    courseConfig,
    paper
  );

  if (aliasPaperConfig) {
    return aliasPaperConfig;
  }

  return getCoursePaperConfig(courseConfig, paper);
}

export function structureIncludesPaper(
  structure: PaperStructure | null,
  paper: Paper,
  courseConfig: CourseAssessmentConfig
): boolean {
  if (!structure) return false;

  const includedPapers = getIncludedPapers(structure, courseConfig);

  if (includedPapers.includes(paper)) {
    return true;
  }

  const targetPaperConfig = getSetupPaperConfig(paper, courseConfig);

  return includedPapers.some((includedPaper) => {
    const includedPaperConfig = getSetupPaperConfig(
      includedPaper,
      courseConfig
    );

    return includedPaperConfig.id === targetPaperConfig.id;
  });
}

export function getPaperLabel(
  paper: Paper,
  courseConfig: CourseAssessmentConfig
): string {
  return getSetupPaperConfig(paper, courseConfig).label;
}

export function getDefaultTargetMarks(
  paper: Paper,
  courseConfig: CourseAssessmentConfig
): number {
  return getSetupPaperConfig(paper, courseConfig).defaultTargetMarks;
}

export function getDefaultTargetMarksText(
  paper: Paper,
  courseConfig: CourseAssessmentConfig
): string {
  return String(getDefaultTargetMarks(paper, courseConfig));
}

export function getDefaultTargetTime(
  paper: Paper,
  courseConfig: CourseAssessmentConfig
): number {
  const paperConfig = getSetupPaperConfig(paper, courseConfig);

  return Math.round(
    paperConfig.defaultTargetMarks * paperConfig.minutesPerMark
  );
}

export function getDefaultTargetTimeText(
  paper: Paper,
  courseConfig: CourseAssessmentConfig
): string {
  return String(getDefaultTargetTime(paper, courseConfig));
}

export function estimateTimeFromMarks(
  paper: Paper,
  marks: number,
  courseConfig: CourseAssessmentConfig
): number {
  const paperConfig = getSetupPaperConfig(paper, courseConfig);

  return Math.round(marks * paperConfig.minutesPerMark);
}

export function estimateMarksFromTime(
  paper: Paper,
  minutes: number,
  courseConfig: CourseAssessmentConfig
): number {
  const paperConfig = getSetupPaperConfig(paper, courseConfig);

  return Math.max(
    1,
    Math.floor(minutes / paperConfig.minutesPerMark)
  );
}