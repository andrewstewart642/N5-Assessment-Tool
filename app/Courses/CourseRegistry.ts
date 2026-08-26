import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import type {
  CourseAssessmentConfig,
} from "@/app/Courses/CourseAssessmentConfig";

import {
  NATIONAL5_MATHS_ASSESSMENT_CONFIG,
} from "@/app/Courses/National5Maths/AssessmentConfig";

import {
  NATIONAL5_APPLICATIONS_OF_MATHS_ASSESSMENT_CONFIG,
} from "@/app/Courses/National5ApplicationsOfMaths/AssessmentConfig";

export const DEFAULT_COURSE_ID:
  CourseId =
    "N5_MATH";

export const COURSE_REGISTRY:
  Partial<
    Record<
      CourseId,
      CourseAssessmentConfig
    >
  > = {
    N5_MATH:
      NATIONAL5_MATHS_ASSESSMENT_CONFIG,

    N5_APPLICATIONS_MATH:
      NATIONAL5_APPLICATIONS_OF_MATHS_ASSESSMENT_CONFIG,
  };

export function getCourseAssessmentConfigById(
  courseId: CourseId
): CourseAssessmentConfig {
  const courseConfig =
    COURSE_REGISTRY[
      courseId
    ];

  if (!courseConfig) {
    throw new Error(
      `Course assessment config "${courseId}" is not registered.`
    );
  }

  return courseConfig;
}

export function getDefaultCourseAssessmentConfig():
  CourseAssessmentConfig {
  return getCourseAssessmentConfigById(
    DEFAULT_COURSE_ID
  );
}

export function getRegisteredCourseAssessmentConfigs():
  CourseAssessmentConfig[] {
  return Object.values(
    COURSE_REGISTRY
  ).filter(
    (
      courseConfig
    ): courseConfig is
      CourseAssessmentConfig =>
        courseConfig !== undefined
  );
}

/**
 * Transitional compatibility API.
 *
 * Historical consumers still use the shorter
 * "CourseConfig" terminology.
 */
export const COURSE_CONFIG_REGISTRY =
  COURSE_REGISTRY;

export const getCourseConfigById =
  getCourseAssessmentConfigById;

export const getDefaultCourseConfig =
  getDefaultCourseAssessmentConfig;

export const getRegisteredCourseConfigs =
  getRegisteredCourseAssessmentConfigs;