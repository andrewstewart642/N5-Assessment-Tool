import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import {
  DEFAULT_COURSE_ID,
} from "@/app/Courses/CourseRegistry";

import {
  normaliseCourseId,
} from "@/app/Courses/CourseCatalog";

export const CURRENT_SAVED_ASSESSMENT_COURSE_IDENTITY_VERSION =
  1;

export type SavedAssessmentCourseIdentity = {
  courseId:
    CourseId;

  courseIdentityVersion:
    number;
};

type PersistedCourseIdentity = {
  courseId?:
    unknown;

  courseIdentityVersion?:
    unknown;
};

function readIdentityVersion(
  value:
    unknown
): number | null {
  if (
    typeof value !==
      "number" ||
    !Number.isInteger(
      value
    ) ||
    value < 1
  ) {
    return null;
  }

  return value;
}

/**
 * Resolve the Course owned by a saved assessment.
 *
 * Course identity is deliberately versioned because historical assessment
 * records pre-date reliable multi-Course persistence. During that period,
 * secondary Course configurations existed as architecture scaffolding and
 * could leak into persisted metadata even though National 5 Maths was the
 * only complete production Course.
 *
 * Therefore unversioned historical records are migrated to the historical
 * production Course rather than trusting an unverified Course ID or old
 * level/coverage field. Once an assessment has a versioned identity, its
 * explicit valid Course ID is preserved even if that Course later becomes
 * unavailable for creating new assessments.
 */
export function resolveSavedAssessmentCourseIdentity(
  persisted:
    PersistedCourseIdentity
): SavedAssessmentCourseIdentity {
  const identityVersion =
    readIdentityVersion(
      persisted.courseIdentityVersion
    );

  const explicitCourseId =
    normaliseCourseId(
      persisted.courseId
    );

  if (
    identityVersion !==
      null &&
    explicitCourseId
  ) {
    return {
      courseId:
        explicitCourseId,

      courseIdentityVersion:
        identityVersion,
    };
  }

  return {
    courseId:
      DEFAULT_COURSE_ID,

    courseIdentityVersion:
      CURRENT_SAVED_ASSESSMENT_COURSE_IDENTITY_VERSION,
  };
}

/**
 * Stamp a newly-created saved assessment with a trustworthy Course identity.
 */
export function createSavedAssessmentCourseIdentity(
  courseId:
    CourseId
): SavedAssessmentCourseIdentity {
  const normalisedCourseId =
    normaliseCourseId(
      courseId
    );

  if (
    !normalisedCourseId
  ) {
    throw new Error(
      `Cannot create a saved assessment for unknown Course "${courseId}".`
    );
  }

  return {
    courseId:
      normalisedCourseId,

    courseIdentityVersion:
      CURRENT_SAVED_ASSESSMENT_COURSE_IDENTITY_VERSION,
  };
}
