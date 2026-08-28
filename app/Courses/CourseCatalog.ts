import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import {
  DEFAULT_COURSE_ID,
} from "@/app/Courses/CourseRegistry";

import {
  getCourseAvailability,
  isCourseAvailableForAssessmentCreation,
  type CourseReleaseStatus,
} from "@/app/Courses/CourseAvailability";

export type CourseClassCourseLabel =
  | "National 5 Maths"
  | "National 5 Applications"
  | "Higher Maths";

export type CourseCatalogEntry = {
  id: CourseId;
  label: string;
  shortLabel: string;

  classCourseLabel:
    CourseClassCourseLabel;

  releaseStatus:
    CourseReleaseStatus;

  isAvailable:
    boolean;
};

type CourseCatalogDefinition =
  Omit<
    CourseCatalogEntry,
    | "releaseStatus"
    | "isAvailable"
  >;

const COURSE_CATALOG_DEFINITIONS:
  CourseCatalogDefinition[] = [
    {
      id:
        "N5_MATH",

      label:
        "National 5 Maths",

      shortLabel:
        "N5 Maths",

      classCourseLabel:
        "National 5 Maths",
    },

    {
      id:
        "N5_APPLICATIONS_MATH",

      label:
        "National 5 Applications of Maths",

      shortLabel:
        "N5 Applications",

      classCourseLabel:
        "National 5 Applications",
    },

    {
      id:
        "HIGHER_MATH",

      label:
        "Higher Maths",

      shortLabel:
        "Higher Maths",

      classCourseLabel:
        "Higher Maths",
    },
  ];

export const COURSE_CATALOG:
  CourseCatalogEntry[] =
    COURSE_CATALOG_DEFINITIONS.map(
      (
        definition
      ) => {
        const availability =
          getCourseAvailability(
            definition.id
          );

        return {
          ...definition,

          releaseStatus:
            availability.releaseStatus,

          isAvailable:
            isCourseAvailableForAssessmentCreation(
              definition.id
            ),
        };
      }
    );

export function normaliseCourseId(
  value:
    unknown
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

  if (
    value ===
    "ADVANCED_HIGHER_MATH"
  ) {
    return "ADVANCED_HIGHER_MATH";
  }

  /**
   * Historical persisted/setup aliases.
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

  if (
    value ===
    "ADVANCED_HIGHER_MATHS"
  ) {
    return "ADVANCED_HIGHER_MATH";
  }

  return null;
}

export function getCourseCatalogEntry(
  value:
    unknown
): CourseCatalogEntry | null {
  const courseId =
    normaliseCourseId(
      value
    );

  if (!courseId) {
    return null;
  }

  return (
    COURSE_CATALOG.find(
      (
        entry
      ) =>
        entry.id ===
        courseId
    ) ??
    null
  );
}

export function getCourseCatalogEntryByClassCourseLabel(
  value:
    unknown
): CourseCatalogEntry | null {
  if (
    typeof value !==
      "string"
  ) {
    return null;
  }

  return (
    COURSE_CATALOG.find(
      (
        entry
      ) =>
        entry.classCourseLabel ===
        value
    ) ??
    null
  );
}

export function getCourseIdForClassCourseLabel(
  value:
    unknown
): CourseId | null {
  return (
    getCourseCatalogEntryByClassCourseLabel(
      value
    )?.id ??
    null
  );
}

export function isCourseAvailable(
  value:
    unknown
): boolean {
  const courseId =
    normaliseCourseId(
      value
    );

  return (
    courseId !== null &&
    isCourseAvailableForAssessmentCreation(
      courseId
    )
  );
}

export function getDefaultCourseId():
  CourseId {
  return DEFAULT_COURSE_ID;
}

export function getDefaultClassCourseLabel():
  CourseClassCourseLabel {
  return (
    getCourseCatalogEntry(
      getDefaultCourseId()
    )?.classCourseLabel ??
    "National 5 Maths"
  );
}
