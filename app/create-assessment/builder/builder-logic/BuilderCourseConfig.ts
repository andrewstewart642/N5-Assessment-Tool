import {
  getActiveCourseConfig,
} from "@/course-data/course-configs/ActiveCourseConfig";
import type { CourseAssessmentConfig } from "@/course-data/course-configs/CourseConfigTypes";
import type { CourseId } from "@/shared-types/AssessmentTypes";

export function getBuilderCourseConfig(): CourseAssessmentConfig {
  return getActiveCourseConfig();
}

export function getBuilderCourseId(
  courseConfig: CourseAssessmentConfig = getBuilderCourseConfig()
): CourseId {
  return courseConfig.courseId;
}