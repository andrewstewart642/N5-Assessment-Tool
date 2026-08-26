import {
  getDefaultCourseAssessmentConfig,
  getCourseAssessmentConfigById,
} from "@/app/Courses/CourseRegistry";

import {
  normaliseCourseId,
} from "@/app/Courses/CourseCatalog";

import type {
  CourseAssessmentConfig,
} from "@/app/Courses/CourseAssessmentConfig";

import type {
  CourseId,
} from "@/app/Assessments/AssessmentTypes";

/**
 * Historical persisted key.
 *
 * Keep this exact string for backwards compatibility even though
 * Course selection is no longer owned specifically by Assessment Creation.
 */
export const ACTIVE_COURSE_ID_STORAGE_KEY =
  "assessment_builder_active_course_id_v1";

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
      return getCourseAssessmentConfigById(
        storedCourseId
      );
    }
  }

  return getDefaultCourseAssessmentConfig();
}

export function getSelectedCourseId(
  courseConfig:
    CourseAssessmentConfig =
      getSelectedCourseConfig()
): CourseId {
  return courseConfig.courseId;
}