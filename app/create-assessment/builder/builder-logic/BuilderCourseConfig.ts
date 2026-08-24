import { getActiveCourseConfig } from "@/course-data/course-configs/ActiveCourseConfig";
import { getCourseConfigById } from "@/course-data/course-configs/CourseConfigRegistry";
import type { CourseAssessmentConfig } from "@/course-data/course-configs/CourseConfigTypes";
import type { CourseId } from "@/shared-types/AssessmentTypes";

export const BUILDER_ACTIVE_COURSE_ID_KEY =
  "assessment_builder_active_course_id_v1";

function normaliseBuilderCourseId(value: unknown): CourseId | null {
  if (value === "N5_MATH") return "N5_MATH";
  if (value === "N5_APPLICATIONS_MATH") return "N5_APPLICATIONS_MATH";
  if (value === "HIGHER_MATH") return "HIGHER_MATH";

  if (value === "N5_MATHS") return "N5_MATH";
  if (value === "N5_APPS") return "N5_APPLICATIONS_MATH";
  if (value === "HIGHER_MATHS") return "HIGHER_MATH";

  return null;
}

export function setBuilderActiveCourseId(courseId: CourseId): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(BUILDER_ACTIVE_COURSE_ID_KEY, courseId);
}

export function getBuilderCourseConfig(): CourseAssessmentConfig {
  if (typeof window !== "undefined") {
    const storedCourseId = normaliseBuilderCourseId(
      window.localStorage.getItem(BUILDER_ACTIVE_COURSE_ID_KEY)
    );

    if (storedCourseId) {
      return getCourseConfigById(storedCourseId);
    }
  }

  return getActiveCourseConfig();
}

export function getBuilderCourseId(
  courseConfig: CourseAssessmentConfig = getBuilderCourseConfig()
): CourseId {
  return courseConfig.courseId;
}