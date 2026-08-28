import type {
  CourseAssessmentConfig,
} from "@/app/Courses/CourseAssessmentConfig";

import {
  findCourseAssessmentConfigById,
} from "@/app/Courses/CourseRegistry";

import {
  getSelectedCourseConfig,
  saveSelectedCourseId,
} from "@/app/Courses/Selection/CourseSelectionStorage";

import {
  getCurrentSavedAssessmentId,
  loadSavedAssessmentById,
} from "@/app/Assessments/SavedAssessments/SavedAssessmentsStorage";

import {
  resolveSavedAssessmentCourseIdentity,
} from "@/app/Assessments/SavedAssessments/CourseIdentity";

export {
  saveSelectedCourseId as saveAssessmentCreationCourseId,
};

/**
 * Resolve the Course context for the Assessment Creator.
 *
 * Existing saved assessments own their Course identity. The globally stored
 * setup Course is only a fallback for a new/unsaved Creation session and must
 * never reinterpret an existing assessment.
 */
export function getAssessmentCreationCourseConfig():
  CourseAssessmentConfig {
  const currentAssessmentId =
    getCurrentSavedAssessmentId();

  if (
    currentAssessmentId
  ) {
    const savedAssessment =
      loadSavedAssessmentById(
        currentAssessmentId
      );

    if (
      savedAssessment
    ) {
      const courseIdentity =
        resolveSavedAssessmentCourseIdentity({
          courseId:
            savedAssessment.setup.courseId,

          courseIdentityVersion:
            savedAssessment.setup.courseIdentityVersion,
        });

      const courseConfig =
        findCourseAssessmentConfigById(
          courseIdentity.courseId
        );

      if (
        !courseConfig
      ) {
        throw new Error(
          `The saved assessment belongs to Course "${courseIdentity.courseId}", but its assessment configuration is not registered.`
        );
      }

      return courseConfig;
    }
  }

  return getSelectedCourseConfig();
}
