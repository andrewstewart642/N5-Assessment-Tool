// course-data/course-configs/N5MathCourseConfig.ts

import type { AssessmentTopicCode, CourseId } from "@/shared-types/AssessmentTypes";

export type CourseTopicTarget = {
  topic: AssessmentTopicCode;
  label: string;
  minPct: number;
  maxPct: number;
  targetPct: number;
};

export type CourseAssessmentConfig = {
  courseId: CourseId;
  displayName: string;
  topicTargets: CourseTopicTarget[];
};

export const N5_MATH_COURSE_CONFIG: CourseAssessmentConfig = {
  courseId: "N5_MATH",
  displayName: "National 5 Mathematics",
  topicTargets: [
    {
      topic: "ALG",
      label: "Algebra",
      minPct: 30,
      maxPct: 45,
      targetPct: 37.5,
    },
    {
      topic: "GEO",
      label: "Geometry",
      minPct: 15,
      maxPct: 35,
      targetPct: 25,
    },
    {
      topic: "TRIG",
      label: "Trigonometry",
      minPct: 10,
      maxPct: 25,
      targetPct: 17.5,
    },
    {
      topic: "NUM",
      label: "Numerical skills",
      minPct: 10,
      maxPct: 25,
      targetPct: 17.5,
    },
    {
      topic: "STAT",
      label: "Statistics",
      minPct: 5,
      maxPct: 15,
      targetPct: 10,
    },
  ],
};