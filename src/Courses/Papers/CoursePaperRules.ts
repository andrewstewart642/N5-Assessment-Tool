import {
  coursePaperMatchesSuitability,
  findCoursePaperConfigForSuitability,
  getCoursePaperConfig,
  type CourseAssessmentConfig,
  type CourseAssessmentStructureId,
  type CoursePaperConfig,
} from "@/src/Courses/CourseAssessmentConfig";

import type {
  Paper,
  SkillPaperSuitability,
} from "@/shared-types/AssessmentTypes";

const FALLBACK_PAPER_ID: Paper =
  "P1";

export type CourseAssessmentStructure =
  CourseAssessmentConfig["assessmentStructures"][number];

export function getCoursePapers(
  courseConfig: CourseAssessmentConfig
): Paper[] {
  return [...courseConfig.papers]
    .sort(
      (first, second) =>
        first.order -
        second.order
    )
    .map(
      (paper) =>
        paper.id
    );
}

export function resolveCoursePaperConfig(
  paper: Paper,
  courseConfig: CourseAssessmentConfig
): CoursePaperConfig {
  const exactPaperConfig =
    courseConfig.papers.find(
      (paperConfig) =>
        paperConfig.id ===
        paper
    );

  if (exactPaperConfig) {
    return exactPaperConfig;
  }

  const aliasPaperConfig =
    findCoursePaperConfigForSuitability(
      courseConfig,
      paper
    );

  if (aliasPaperConfig) {
    return aliasPaperConfig;
  }

  return getCoursePaperConfig(
    courseConfig,
    paper
  );
}

export function getCourseAssessmentStructure(
  paperStructure:
    CourseAssessmentStructureId,
  courseConfig:
    CourseAssessmentConfig
): CourseAssessmentStructure | null {
  return (
    courseConfig.assessmentStructures.find(
      (structure) =>
        structure.id ===
        paperStructure
    ) ?? null
  );
}

export function getDefaultCoursePaper(
  courseConfig: CourseAssessmentConfig
): Paper {
  return (
    getCoursePapers(
      courseConfig
    )[0] ??
    FALLBACK_PAPER_ID
  );
}

export function getDefaultTargetMarksForCoursePaper(
  paper: Paper,
  courseConfig: CourseAssessmentConfig
): number {
  return resolveCoursePaperConfig(
    paper,
    courseConfig
  ).defaultTargetMarks;
}

export function getCoursePaperLabel(
  paper: Paper,
  courseConfig: CourseAssessmentConfig
): string {
  return resolveCoursePaperConfig(
    paper,
    courseConfig
  ).label;
}

export function formatCoursePaperSuitability(
  paperSuitability:
    SkillPaperSuitability,
  courseConfig:
    CourseAssessmentConfig
): string {
  if (
    paperSuitability ===
    "BOTH"
  ) {
    return "both papers";
  }

  const paperConfig =
    findCoursePaperConfigForSuitability(
      courseConfig,
      paperSuitability
    );

  return (
    paperConfig?.label ??
    paperSuitability
  );
}

export function isCoursePaperSuitable({
  paper,
  paperSuitability,
  courseConfig,
}: {
  paper: Paper;

  paperSuitability:
    SkillPaperSuitability;

  courseConfig:
    CourseAssessmentConfig;
}): boolean {
  if (
    paperSuitability ===
    "BOTH"
  ) {
    return true;
  }

  const paperConfig =
    resolveCoursePaperConfig(
      paper,
      courseConfig
    );

  return coursePaperMatchesSuitability({
    paperConfig,
    paperSuitability,
  });
}