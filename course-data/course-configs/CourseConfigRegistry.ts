import type { CourseId } from "@/shared-types/AssessmentTypes_TEMP";
import type { CourseAssessmentConfig } from "./CourseConfigTypes";
import { N5_APPLICATIONS_MATH_COURSE_CONFIG } from "./N5ApplicationsMathCourseConfig";
import { N5_MATH_COURSE_CONFIG } from "./N5MathsCourseConfig";

export const DEFAULT_COURSE_ID: CourseId = "N5_MATH";

export const COURSE_CONFIG_REGISTRY: Partial<
  Record<CourseId, CourseAssessmentConfig>
> = {
  N5_MATH: N5_MATH_COURSE_CONFIG,
  N5_APPLICATIONS_MATH: N5_APPLICATIONS_MATH_COURSE_CONFIG,
};

export function getCourseConfigById(courseId: CourseId): CourseAssessmentConfig {
  const courseConfig = COURSE_CONFIG_REGISTRY[courseId];

  if (!courseConfig) {
    throw new Error(`Course config "${courseId}" is not registered.`);
  }

  return courseConfig;
}

export function getDefaultCourseConfig(): CourseAssessmentConfig {
  return getCourseConfigById(DEFAULT_COURSE_ID);
}

export function getRegisteredCourseConfigs(): CourseAssessmentConfig[] {
  return Object.values(COURSE_CONFIG_REGISTRY).filter(
    (courseConfig): courseConfig is CourseAssessmentConfig =>
      courseConfig !== undefined
  );
}