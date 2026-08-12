import type { CourseAssessmentConfig } from "./CourseConfigTypes";
import {
  DEFAULT_COURSE_ID,
  getCourseConfigById,
} from "./CourseConfigRegistry";

export const ACTIVE_COURSE_CONFIG: CourseAssessmentConfig =
  getCourseConfigById(DEFAULT_COURSE_ID);

export function getActiveCourseConfig(): CourseAssessmentConfig {
  return ACTIVE_COURSE_CONFIG;
}