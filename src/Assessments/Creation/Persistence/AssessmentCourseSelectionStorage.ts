import {
  getActiveCourseConfig,
} from "@/course-data/course-configs/ActiveCourseConfig";

import {
  getCourseConfigById,
} from "@/course-data/course-configs/CourseConfigRegistry";

import type {
  CourseAssessmentConfig,
} from "@/course-data/course-configs/CourseConfigTypes";

import type {
  CourseId,
} from "@/shared-types/AssessmentTypes";

export const ASSESSMENT_CREATION_ACTIVE_COURSE_ID_KEY =
  "assessment_builder_active_course_id_v1";

function normaliseAssessmentCreationCourseId(
  value: unknown
): CourseId | null {
  if (
    value === "N5_MATH"
  ) {
    return "N5_MATH";
  }

  if (
    value ===
    "N5_APPLICATIONS_MATH"
  ) {
    return "N5_APPLICATIONS_MATH";
  }

  if (
    value === "HIGHER_MATH"
  ) {
    return "HIGHER_MATH";
  }

  /*
   * Preserve historical persisted aliases.
   */
  if (
    value === "N5_MATHS"
  ) {
    return "N5_MATH";
  }

  if (
    value === "N5_APPS"
  ) {
    return "N5_APPLICATIONS_MATH";
  }

  if (
    value === "HIGHER_MATHS"
  ) {
    return "HIGHER_MATH";
  }

  return null;
}

export function saveAssessmentCreationCourseId(
  courseId: CourseId
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.localStorage.setItem(
    ASSESSMENT_CREATION_ACTIVE_COURSE_ID_KEY,
    courseId
  );
}

export function getAssessmentCreationCourseConfig():
  CourseAssessmentConfig {
  if (
    typeof window !==
    "undefined"
  ) {
    const storedCourseId =
      normaliseAssessmentCreationCourseId(
        window.localStorage.getItem(
          ASSESSMENT_CREATION_ACTIVE_COURSE_ID_KEY
        )
      );

    if (storedCourseId) {
      return getCourseConfigById(
        storedCourseId
      );
    }
  }

  return getActiveCourseConfig();
}

export function getAssessmentCreationCourseId(
  courseConfig:
    CourseAssessmentConfig =
      getAssessmentCreationCourseConfig()
): CourseId {
  return courseConfig.courseId;
}