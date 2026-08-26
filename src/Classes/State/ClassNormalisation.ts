import {
  getCourseCatalogEntry,
  getCourseCatalogEntryByClassCourseLabel,
  getCourseIdForClassCourseLabel,
  getDefaultCourseId,
} from "@/src/Courses/CourseCatalog";
import type { CourseId } from "@/src/Assessments/AssessmentTypes";
import type { CourseOption, LevelOption, SchoolClass } from "../ClassTypes";

export function isCourseOption(value: unknown): value is CourseOption {
  return (
    value === "National 5 Maths" ||
    value === "National 5 Applications" ||
    value === "Higher Maths"
  );
}

export function isLevelOption(value: unknown): value is LevelOption {
  return (
    value === "" ||
    value === "S3" ||
    value === "S4" ||
    value === "S5" ||
    value === "S6" ||
    value === "Mixed"
  );
}

export function resolveClassCourse(args: {
  courseId: unknown;
  course: unknown;
}): { courseId: CourseId; course: CourseOption } {
  if (typeof args.courseId === "string") {
    const courseEntry = getCourseCatalogEntry(args.courseId);

    if (courseEntry && isCourseOption(courseEntry.classCourseLabel)) {
      return {
        courseId: courseEntry.id,
        course: courseEntry.classCourseLabel,
      };
    }
  }

  if (isCourseOption(args.course)) {
    return {
      courseId:
        getCourseIdForClassCourseLabel(args.course) ?? getDefaultCourseId(),
      course: args.course,
    };
  }

  const defaultCourseId = getDefaultCourseId();
  const defaultCourseEntry = getCourseCatalogEntry(defaultCourseId);

  return {
    courseId: defaultCourseEntry?.id ?? defaultCourseId,
    course: isCourseOption(defaultCourseEntry?.classCourseLabel)
      ? defaultCourseEntry.classCourseLabel
      : "National 5 Maths",
  };
}

export function normaliseClass(candidate: unknown): SchoolClass | null {
  if (!candidate || typeof candidate !== "object") return null;

  const item = candidate as Partial<SchoolClass>;

  if (
    typeof item.id !== "string" ||
    typeof item.name !== "string" ||
    typeof item.teacher !== "string" ||
    typeof item.createdAt !== "number"
  ) {
    return null;
  }

  const resolvedCourse = resolveClassCourse({
    courseId: item.courseId,
    course: item.course,
  });

  return {
    id: item.id,
    name: item.name,
    courseId: resolvedCourse.courseId,
    course: resolvedCourse.course,
    level: isLevelOption(item.level) ? item.level : "",
    teacher: item.teacher,
    createdAt: item.createdAt,
    updatedAt:
      typeof item.updatedAt === "number" ? item.updatedAt : item.createdAt,
    completedSkillIds: Array.isArray(item.completedSkillIds)
      ? item.completedSkillIds.filter(
          (skillId): skillId is string => typeof skillId === "string"
        )
      : [],
  };
}

export function buildNewSchoolClass(args: {
  id: string;
  name: string;
  course: CourseOption;
  level: LevelOption;
  teacher: string;
  createdAt: number;
}): SchoolClass {
  const courseEntry = getCourseCatalogEntryByClassCourseLabel(args.course);

  return {
    id: args.id,
    name: args.name,
    courseId: courseEntry?.id ?? getDefaultCourseId(),
    course: args.course,
    level: args.level,
    teacher: args.teacher,
    createdAt: args.createdAt,
    updatedAt: args.createdAt,
    completedSkillIds: [],
  };
}