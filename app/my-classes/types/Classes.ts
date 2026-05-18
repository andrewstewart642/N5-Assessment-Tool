import {
  COURSE_CATALOG,
  type CourseCatalogEntry,
  type CourseClassCourseLabel,
} from "@/course-data/course-configs/CourseCatalog";
import type { CourseId } from "@/shared-types/AssessmentTypes";

export type CourseOption = CourseClassCourseLabel;

export type LevelOption = "S3" | "S4" | "S5" | "S6" | "Mixed" | "";

export type SchoolClass = {
  id: string;
  name: string;

  /**
   * Internal course identity.
   */
  courseId: CourseId;

  /**
   * User-facing course label.
   */
  course: CourseOption;

  level: LevelOption;
  teacher: string;
  createdAt: number;
  updatedAt: number;
  completedSkillIds: string[];
};

export const COURSE_OPTIONS: CourseOption[] = COURSE_CATALOG.map(
  (course) => course.classCourseLabel
);

export const COURSE_OPTION_ENTRIES: CourseCatalogEntry[] = COURSE_CATALOG;

export const LEVEL_OPTIONS: LevelOption[] = [
  "",
  "S3",
  "S4",
  "S5",
  "S6",
  "Mixed",
];