import { skillsData } from "@/course-data/N5-Skills";
import type { CourseAssessmentConfig } from "./CourseConfigTypes";

/**
 * Temporary smoke-test config.
 *
 * This is not intended to be a complete or accurate National 5 Applications
 * of Mathematics course model yet.
 *
 * Its purpose is to prove that the builder can support a second course config
 * without changing the UI or breaking National 5 Maths.
 */
export const N5_APPLICATIONS_MATH_COURSE_CONFIG: CourseAssessmentConfig = {
  courseId: "N5_APPLICATIONS_MATH",
  displayName: "National 5 Applications of Mathematics",
  shortName: "N5 Applications",

  subjectArea: "Mathematics",
  awardingBody: "SQA",
  levelLabel: "National 5",
  printSubjectName: "Applications of Mathematics",
  printQualificationBadge: "N5",
  printQualificationLabelLines: ["National", "Qualifications"],

  papers: [
    {
      id: "P1",
      label: "Paper 1",
      shortLabel: "P1",
      order: 1,
      calculatorPolicy: "P1",
      suitabilityAliases: ["P1"],
      minutesPerMark: 1.5,
      defaultTargetMarks: 35,
      description: "Temporary non-calculator-style paper config.",
      printTitle: "Paper 1 (Non-calculator)",
      coverInstructionText: "You must NOT use a calculator.",
      showNoCalculatorIcon: true,
    },
    {
      id: "P2",
      label: "Paper 2",
      shortLabel: "P2",
      order: 2,
      calculatorPolicy: "P2",
      suitabilityAliases: ["P2"],
      minutesPerMark: 1.8,
      defaultTargetMarks: 45,
      description: "Temporary calculator-style paper config.",
      printTitle: "Paper 2 (Calculator)",
      coverInstructionText: "You may use a calculator.",
      showNoCalculatorIcon: false,
    },
  ],

  assessmentModes: [
    {
      id: "PRELIM",
      label: "Prelim",
      shortLabel: "Prelim",
      description: "A full or partial prelim-style assessment.",
      guidanceStrictness: "strict",
    },
    {
      id: "CLASS_TEST",
      label: "Class test",
      shortLabel: "Class test",
      description: "A focused classroom assessment.",
      guidanceStrictness: "medium",
    },
    {
      id: "HOMEWORK",
      label: "Homework",
      shortLabel: "Homework",
      description: "A more flexible take-home assessment.",
      guidanceStrictness: "light",
    },
    {
      id: "CHECK_TEST",
      label: "Check test",
      shortLabel: "Check",
      description: "A short check-for-understanding assessment.",
      guidanceStrictness: "light",
    },
    {
      id: "CUSTOM",
      label: "Custom",
      shortLabel: "Custom",
      description: "A custom assessment structure.",
      guidanceStrictness: "medium",
    },
  ],

  visibleSetupAssessmentModeIds: [
    "PRELIM",
    "CLASS_TEST",
    "HOMEWORK",
    "CHECK_TEST",
    "CUSTOM",
  ],

  assessmentStructures: [
    {
      id: "BOTH",
      label: "Paper 1 and Paper 2",
      shortLabel: "Both papers",
      includedPapers: ["P1", "P2"],
      description: "Build an assessment using both papers.",
    },
    {
      id: "P1_ONLY",
      label: "Paper 1 only",
      shortLabel: "P1 only",
      includedPapers: ["P1"],
      description: "Build a Paper 1-only assessment.",
    },
    {
      id: "P2_ONLY",
      label: "Paper 2 only",
      shortLabel: "P2 only",
      includedPapers: ["P2"],
      description: "Build a Paper 2-only assessment.",
    },
  ],

  visibleSetupAssessmentStructureIds: ["BOTH", "P1_ONLY", "P2_ONLY"],

  topicTargets: [
    {
      topic: "NUM",
      label: "Numeracy",
      minPct: 30,
      maxPct: 55,
      targetPct: 42.5,
    },
    {
      topic: "ALG",
      label: "Algebra",
      minPct: 10,
      maxPct: 25,
      targetPct: 17.5,
    },
    {
      topic: "GEO",
      label: "Geometry and measure",
      minPct: 15,
      maxPct: 35,
      targetPct: 25,
    },
    {
      topic: "TRIG",
      label: "Trigonometry",
      minPct: 5,
      maxPct: 20,
      targetPct: 12.5,
    },
    {
      topic: "STAT",
      label: "Statistics",
      minPct: 10,
      maxPct: 30,
      targetPct: 20,
    },
  ],

  // Temporary only: this lets us smoke-test the course switch using the existing tree.
  skillTree: skillsData,
};