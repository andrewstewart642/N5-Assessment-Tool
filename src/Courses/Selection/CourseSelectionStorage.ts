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

/**
 * Historical persisted key.
 *
 * Keep this exact string for backwards compatibility even though
 * course selection is no longer owned specifically by Assessment Creation.
 */
export const ACTIVE_COURSE_ID_STORAGE_KEY =
  "assessment_builder_active_course_id_v1";

function normaliseCourseId(
  value: unknown
): CourseId | null {
  if (
    value ===
    "N5_MATH"
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
    value ===
    "HIGHER_MATH"
  ) {
    return "HIGHER_MATH";
  }

  /*
   * Preserve historical persisted aliases.
   */
  if (
    value ===
    "N5_MATHS"
  ) {
    return "N5_MATH";
  }

  if (
    value ===
    "N5_APPS"
  ) {
    return "N5_APPLICATIONS_MATH";
  }

  if (
    value ===
    "HIGHER_MATHS"
  ) {
    return "HIGHER_MATH";
  }

  return null;
}

export function saveSelectedCourseId(
  courseId: CourseId
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.localStorage.setItem(
    ACTIVE_COURSE_ID_STORAGE_KEY,
    courseId
  );
}

export function getSelectedCourseConfig():
  CourseAssessmentConfig {
  if (
    typeof window !==
    "undefined"
  ) {
    const storedCourseId =
      normaliseCourseId(
        window.localStorage.getItem(
          ACTIVE_COURSE_ID_STORAGE_KEY
        )
      );

    if (
      storedCourseId
    ) {
      return getCourseConfigById(
        storedCourseId
      );
    }
  }

  return getActiveCourseConfig();
}

export function getSelectedCourseId(
  courseConfig:
    CourseAssessmentConfig =
      getSelectedCourseConfig()
): CourseId {
  return courseConfig.courseId;
}