import type {
  CourseId,
} from "@/src/Assessments/AssessmentTypes";

import {
  DEFAULT_COURSE_ID,
} from "@/src/Courses/CourseRegistry";

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

  isAvailable: boolean;
};

const SUPPORTED_COURSE_IDS:
  CourseId[] = [
    "N5_MATH",
    "N5_APPLICATIONS_MATH",
  ];

export const COURSE_CATALOG:
  CourseCatalogEntry[] = [
    {
      id:
        "N5_MATH",

      label:
        "National 5 Maths",

      shortLabel:
        "N5 Maths",

      classCourseLabel:
        "National 5 Maths",

      isAvailable:
        SUPPORTED_COURSE_IDS.includes(
          "N5_MATH"
        ),
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

      isAvailable:
        SUPPORTED_COURSE_IDS.includes(
          "N5_APPLICATIONS_MATH"
        ),
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

      isAvailable:
        SUPPORTED_COURSE_IDS.includes(
          "HIGHER_MATH"
        ),
    },
  ];

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
  return (
    getCourseCatalogEntry(
      value
    )?.isAvailable ??
    false
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