import type {
  CourseAssessmentConfig,
  CourseAssessmentStructureId,
  CoursePaperConfig,
} from "@/app/Courses/CourseAssessmentConfig";

import type {
  Paper,
  SkillPaperSuitability,
} from "@/app/Assessments/AssessmentTypes";

import {
  formatCoursePaperSuitability,
  getCourseAssessmentStructure,
  getCoursePapers,
  getDefaultCoursePaper,
  getDefaultTargetMarksForCoursePaper,
  getCoursePaperLabel,
  isCoursePaperSuitable,
  resolveCoursePaperConfig,
  type CourseAssessmentStructure,
} from "@/app/Courses/Papers/CoursePaperRules";

import {
  getAssessmentCreationCourseConfig,
} from "../Persistence/CourseSelection";

export function getAssessmentPapers(
  courseConfig:
    CourseAssessmentConfig =
      getAssessmentCreationCourseConfig()
): Paper[] {
  return getCoursePapers(
    courseConfig
  );
}

export function getAssessmentPaperConfig(
  paper: Paper,
  courseConfig:
    CourseAssessmentConfig =
      getAssessmentCreationCourseConfig()
): CoursePaperConfig {
  return resolveCoursePaperConfig(
    paper,
    courseConfig
  );
}

export function getAssessmentStructure(
  paperStructure:
    CourseAssessmentStructureId,
  courseConfig:
    CourseAssessmentConfig =
      getAssessmentCreationCourseConfig()
): CourseAssessmentStructure | null {
  return getCourseAssessmentStructure(
    paperStructure,
    courseConfig
  );
}

export function getDefaultAssessmentPaper(
  courseConfig:
    CourseAssessmentConfig =
      getAssessmentCreationCourseConfig()
): Paper {
  return getDefaultCoursePaper(
    courseConfig
  );
}

export function getDefaultTargetMarksForAssessmentPaper(
  paper: Paper,
  courseConfig:
    CourseAssessmentConfig =
      getAssessmentCreationCourseConfig()
): number {
  return getDefaultTargetMarksForCoursePaper(
    paper,
    courseConfig
  );
}

export function getAssessmentPaperLabel(
  paper: Paper,
  courseConfig:
    CourseAssessmentConfig =
      getAssessmentCreationCourseConfig()
): string {
  return getCoursePaperLabel(
    paper,
    courseConfig
  );
}

export function formatAssessmentPaperSuitability(
  paperSuitability:
    SkillPaperSuitability,
  courseConfig:
    CourseAssessmentConfig =
      getAssessmentCreationCourseConfig()
): string {
  return formatCoursePaperSuitability(
    paperSuitability,
    courseConfig
  );
}

export function isAssessmentPaperSuitable({
  paper,
  paperSuitability,
  courseConfig = getAssessmentCreationCourseConfig(),
}: {
  paper: Paper;

  paperSuitability:
    SkillPaperSuitability;

  courseConfig?:
    CourseAssessmentConfig;
}): boolean {
  return isCoursePaperSuitable({
    paper,
    paperSuitability,
    courseConfig,
  });
}