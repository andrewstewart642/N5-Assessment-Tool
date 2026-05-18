// course-data/course-configs/N5MathsCourseConfig.ts

import { skillsData } from "@/course-data/N5-Skills";

import type {
  CourseAssessmentConfig,
  CourseAssessmentMode,
  CourseAssessmentStructure,
  CoursePaperConfig,
  CourseTopicTarget,
} from "./CourseConfigTypes";

export type {
  CourseAssessmentConfig,
  CourseAssessmentMode,
  CourseAssessmentStructure,
  CoursePaperConfig,
  CourseTopicTarget,
} from "./CourseConfigTypes";

const N5_MATH_PAPERS: CoursePaperConfig[] = [
  {
    id: "P1",
    label: "Paper 1",
    shortLabel: "P1",
    order: 1,
    calculatorPolicy: "P1",
    minutesPerMark: 1.5,
    defaultTargetMarks: 40,
    description: "Non-calculator paper.",
  },
  {
    id: "P2",
    label: "Paper 2",
    shortLabel: "P2",
    order: 2,
    calculatorPolicy: "P2",
    minutesPerMark: 1.8,
    defaultTargetMarks: 50,
    description: "Calculator-allowed paper.",
  },
];

const N5_MATH_ASSESSMENT_MODES: CourseAssessmentMode[] = [
  {
    id: "PRELIM",
    label: "Prelim-style assessment",
    shortLabel: "Prelim",
    description:
      "A more formal assessment designed to resemble the structure, balance, and standards of the final course exam.",
    guidanceStrictness: "strict",
  },
  {
    id: "CLASS_TEST",
    label: "In-class test",
    shortLabel: "Class test",
    description:
      "A flexible classroom assessment based on selected taught skills. Less strict than a prelim, but still course-appropriate.",
    guidanceStrictness: "medium",
  },
  {
    id: "HOMEWORK",
    label: "Homework task",
    shortLabel: "Homework",
    description:
      "A focused task for practice, consolidation, or evidence gathering.",
    guidanceStrictness: "light",
  },
  {
    id: "CHECK_TEST",
    label: "Check test",
    shortLabel: "Check test",
    description:
      "A short assessment designed to collect regular evidence on recently taught or previously taught skills.",
    guidanceStrictness: "medium",
  },
  {
    id: "CUSTOM",
    label: "Custom assessment",
    shortLabel: "Custom",
    description:
      "A teacher-controlled assessment where the teacher has maximum flexibility over structure and balance.",
    guidanceStrictness: "light",
  },
];

const N5_MATH_ASSESSMENT_STRUCTURES: CourseAssessmentStructure[] = [
  {
    id: "BOTH",
    label: "Paper 1 and Paper 2",
    shortLabel: "Both papers",
    includedPapers: ["P1", "P2"],
    description:
      "Build an assessment with both a non-calculator paper and a calculator-allowed paper.",
  },
  {
    id: "P1_ONLY",
    label: "Paper 1 only",
    shortLabel: "Paper 1",
    includedPapers: ["P1"],
    description: "Build only the non-calculator paper.",
  },
  {
    id: "P2_ONLY",
    label: "Paper 2 only",
    shortLabel: "Paper 2",
    includedPapers: ["P2"],
    description: "Build only the calculator-allowed paper.",
  },
];

const N5_MATH_TOPIC_TARGETS: CourseTopicTarget[] = [
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
];

export const N5_MATH_COURSE_CONFIG: CourseAssessmentConfig = {
  courseId: "N5_MATH",
  displayName: "National 5 Mathematics",
  shortName: "N5 Maths",

  subjectArea: "Mathematics",
  awardingBody: "SQA",
  levelLabel: "National 5",

    papers: N5_MATH_PAPERS,
  assessmentModes: N5_MATH_ASSESSMENT_MODES,
  visibleSetupAssessmentModeIds: ["PRELIM", "CLASS_TEST", "HOMEWORK"],
  assessmentStructures: N5_MATH_ASSESSMENT_STRUCTURES,
  visibleSetupAssessmentStructureIds: ["BOTH", "P1_ONLY", "P2_ONLY"],

  topicTargets: N5_MATH_TOPIC_TARGETS,
  skillTree: skillsData,
};