import {
  COURSE_CATALOG,
  type CourseCatalogEntry,
  type CourseClassCourseLabel,
} from "@/app/Courses/CourseCatalog";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";


export type CourseOption =
  CourseClassCourseLabel;


export type LevelOption =
  | "S3"
  | "S4"
  | "S5"
  | "S6"
  | "Mixed"
  | "";


export type SchoolClass = {
  id:
    string;

  name:
    string;


  /**
   * Internal Course identity.
   */
  courseId:
    CourseId;


  /**
   * User-facing Course label.
   */
  course:
    CourseOption;


  level:
    LevelOption;

  teacher:
    string;

  createdAt:
    number;

  updatedAt:
    number;


  /**
   * Fully covered parent skills.
   *
   * This remains part of the persisted Class model
   * because it is a useful high-level metric and is
   * required for backwards compatibility with older
   * saved Class records.
   *
   * Going forward this array is synchronised from
   * completedConceptIds whenever concept-level
   * coverage changes.
   */
  completedSkillIds:
    string[];


  /**
   * Leaf Course-specification concepts that have
   * been taught / covered by this Class.
   *
   * Example:
   *
   * N5.1.3  Fractions multiply
   * N5.1.4  Fractions divide
   *
   * A parent skill becomes fully covered only when
   * all of its trackable leaf concepts are covered.
   */
  completedConceptIds:
    string[];
};


export const COURSE_OPTIONS:
  CourseOption[] =
    COURSE_CATALOG.map(
      (
        course
      ) =>
        course.classCourseLabel
    );


export const COURSE_OPTION_ENTRIES:
  CourseCatalogEntry[] =
    COURSE_CATALOG;


export const LEVEL_OPTIONS:
  LevelOption[] = [
    "",
    "S3",
    "S4",
    "S5",
    "S6",
    "Mixed",
  ];