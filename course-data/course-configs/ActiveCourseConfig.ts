import { N5_MATH_COURSE_CONFIG } from "./N5MathsCourseConfig";

import type { CourseAssessmentConfig } from "./CourseConfigTypes";

/**
 * Temporary active-course bridge.
 *
 * Version 1 currently ships with National 5 Maths as the first complete course.
 * The rest of the app should start reading from this active course config
 * instead of hardcoding National 5 rules directly into setup/builder files.
 *
 * Later, this can be replaced by:
 * - selected classroom course
 * - selected assessment course
 * - route/search-param course selection
 * - user/session course selection
 */
export const ACTIVE_COURSE_CONFIG: CourseAssessmentConfig = N5_MATH_COURSE_CONFIG;

export function getActiveCourseConfig(): CourseAssessmentConfig {
  return ACTIVE_COURSE_CONFIG;
}