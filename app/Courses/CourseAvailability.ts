import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import {
  hasCourseAssessmentConfig,
} from "@/app/Courses/CourseRegistry";

export type CourseReleaseStatus =
  | "AVAILABLE"
  | "COMING_SOON";

export type CourseAvailability = {
  releaseStatus:
    CourseReleaseStatus;

  assessmentCreationReady:
    boolean;

  printableDocumentsReady:
    boolean;
};

/**
 * Product-readiness gate for each known Course.
 *
 * Registration and availability are deliberately different concepts:
 * a Course may have partial configuration in the repository while it is
 * still being developed. It must not become selectable in production until
 * all capabilities required by Assessment Creation are explicitly ready.
 *
 * When a new Course is added:
 * 1. register its assessment configuration;
 * 2. implement its Course-owned curriculum/generation behaviour;
 * 3. register its printable document templates;
 * 4. mark the corresponding readiness flags true;
 * 5. only then change releaseStatus to AVAILABLE.
 */
const COURSE_AVAILABILITY:
  Record<
    CourseId,
    CourseAvailability
  > = {
    N5_MATH: {
      releaseStatus:
        "AVAILABLE",

      assessmentCreationReady:
        true,

      printableDocumentsReady:
        true,
    },

    N5_APPLICATIONS_MATH: {
      releaseStatus:
        "COMING_SOON",

      assessmentCreationReady:
        false,

      printableDocumentsReady:
        false,
    },

    HIGHER_MATH: {
      releaseStatus:
        "COMING_SOON",

      assessmentCreationReady:
        false,

      printableDocumentsReady:
        false,
    },

    ADVANCED_HIGHER_MATH: {
      releaseStatus:
        "COMING_SOON",

      assessmentCreationReady:
        false,

      printableDocumentsReady:
        false,
    },
  };

export function getCourseAvailability(
  courseId:
    CourseId
): CourseAvailability {
  return COURSE_AVAILABILITY[
    courseId
  ];
}

export function isCourseAvailableForAssessmentCreation(
  courseId:
    CourseId
): boolean {
  const availability =
    getCourseAvailability(
      courseId
    );

  return (
    availability.releaseStatus ===
      "AVAILABLE" &&
    availability.assessmentCreationReady &&
    availability.printableDocumentsReady &&
    hasCourseAssessmentConfig(
      courseId
    )
  );
}
