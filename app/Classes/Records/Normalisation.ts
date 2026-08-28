import {
  getCourseCatalogEntry,
  getCourseCatalogEntryByClassCourseLabel,
  getCourseIdForClassCourseLabel,
  getDefaultCourseId,
} from "@/app/Courses/CourseCatalog";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import {
  deriveCompletedSkillIdsFromConcepts,
  getCompletedConceptIdsForSkillIds,
  normaliseCompletedConceptIdsForCourse,
} from "../Coverage/SkillsAndProgress";

import type {
  CourseOption,
  LevelOption,
  SchoolClass,
} from "../ClassData";


export function isCourseOption(
  value:
    unknown
): value is CourseOption {
  return (
    value ===
      "National 5 Maths" ||
    value ===
      "National 5 Applications" ||
    value ===
      "Higher Maths"
  );
}


export function isLevelOption(
  value:
    unknown
): value is LevelOption {
  return (
    value ===
      "" ||
    value ===
      "S3" ||
    value ===
      "S4" ||
    value ===
      "S5" ||
    value ===
      "S6" ||
    value ===
      "Mixed"
  );
}


export function resolveClassCourse({
  courseId,
  course,
}: {
  courseId:
    unknown;

  course:
    unknown;
}): {
  courseId:
    CourseId;

  course:
    CourseOption;
} {
  if (
    typeof courseId ===
    "string"
  ) {
    const courseEntry =
      getCourseCatalogEntry(
        courseId
      );


    if (
      courseEntry &&
      isCourseOption(
        courseEntry.classCourseLabel
      )
    ) {
      return {
        courseId:
          courseEntry.id,

        course:
          courseEntry.classCourseLabel,
      };
    }
  }


  if (
    isCourseOption(
      course
    )
  ) {
    return {
      courseId:
        getCourseIdForClassCourseLabel(
          course
        ) ??
        getDefaultCourseId(),

      course,
    };
  }


  const defaultCourseId =
    getDefaultCourseId();


  const defaultCourseEntry =
    getCourseCatalogEntry(
      defaultCourseId
    );


  return {
    courseId:
      defaultCourseEntry
        ?.id ??
      defaultCourseId,

    course:
      isCourseOption(
        defaultCourseEntry
          ?.classCourseLabel
      )
        ? defaultCourseEntry.classCourseLabel
        : "National 5 Maths",
  };
}


function cleanStringArray(
  value:
    unknown
): string[] {
  if (
    !Array.isArray(
      value
    )
  ) {
    return [];
  }


  return Array.from(
    new Set(
      value.filter(
        (
          item
        ): item is string =>
          typeof item ===
            "string" &&
          item.trim()
            .length >
            0
      )
    )
  );
}


export function normaliseClass(
  candidate:
    unknown
): SchoolClass | null {
  if (
    !candidate ||
    typeof candidate !==
      "object"
  ) {
    return null;
  }


  const item =
    candidate as
      Partial<SchoolClass>;


  if (
    typeof item.id !==
      "string" ||
    typeof item.name !==
      "string" ||
    typeof item.teacher !==
      "string" ||
    typeof item.createdAt !==
      "number"
  ) {
    return null;
  }


  const resolvedCourse =
    resolveClassCourse({
      courseId:
        item.courseId,

      course:
        item.course,
    });


  const legacyCompletedSkillIds =
    cleanStringArray(
      item.completedSkillIds
    );


  /**
   * Historical records do not have
   * completedConceptIds.
   *
   * In that case every previously completed parent
   * skill is expanded to its trackable leaf
   * concepts, preserving the old coverage state.
   */
  const hasPersistedConceptCoverage =
    Array.isArray(
      item.completedConceptIds
    );


  const completedConceptIds =
    hasPersistedConceptCoverage
      ? normaliseCompletedConceptIdsForCourse(
          resolvedCourse.courseId,
          cleanStringArray(
            item.completedConceptIds
          )
        )
      : getCompletedConceptIdsForSkillIds(
          resolvedCourse.courseId,
          legacyCompletedSkillIds
        );


  /**
   * Rebuild the high-level completed skill list so
   * the stored 36 / 47-style metric and the new
   * concept-level state cannot drift apart.
   */
  const completedSkillIds =
    deriveCompletedSkillIdsFromConcepts(
      resolvedCourse.courseId,
      completedConceptIds,
      legacyCompletedSkillIds
    );


  return {
    id:
      item.id,

    name:
      item.name,

    courseId:
      resolvedCourse.courseId,

    course:
      resolvedCourse.course,

    level:
      isLevelOption(
        item.level
      )
        ? item.level
        : "",

    teacher:
      item.teacher,

    createdAt:
      item.createdAt,

    updatedAt:
      typeof item.updatedAt ===
        "number"
        ? item.updatedAt
        : item.createdAt,

    completedSkillIds,

    completedConceptIds,
  };
}


export function buildNewSchoolClass({
  id,
  name,
  course,
  level,
  teacher,
  createdAt,
}: {
  id:
    string;

  name:
    string;

  course:
    CourseOption;

  level:
    LevelOption;

  teacher:
    string;

  createdAt:
    number;
}): SchoolClass {
  const courseEntry =
    getCourseCatalogEntryByClassCourseLabel(
      course
    );


  return {
    id,

    name,

    courseId:
      courseEntry?.id ??
      getDefaultCourseId(),

    course,

    level,

    teacher,

    createdAt,

    updatedAt:
      createdAt,

    completedSkillIds:
      [],

    completedConceptIds:
      [],
  };
}