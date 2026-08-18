import type {
  AssessmentTopicCode,
  CourseId,
  Paper,
  SkillPaperSuitability,
  SkillsData,
} from "@/shared-types/AssessmentTypes";

/**
 * The course configuration layer is the bridge between:
 *
 * - the generic assessment builder
 * - the specific rules of a course such as National 5 Maths
 *
 * The generic app should eventually ask the active course config:
 *
 * - What course is active?
 * - What papers or sections exist?
 * - What timing rules apply?
 * - What assessment structures are allowed?
 * - What skills can be assessed?
 * - What balance rules should be used?
 *
 * This file should stay course-neutral.
 * National 5-specific detail belongs inside N5MathsCourseConfig.ts.
 */

export type CourseSubjectArea = "Mathematics";

export type CourseAwardingBody = "SQA";

export type CourseLevelLabel =
  | "National 5"
  | "Higher"
  | "Advanced Higher"
  | "Unknown";

export type CoursePaperConfig = {
  id: Paper;
  label: string;
  shortLabel: string;
  order: number;

  /**
   * This currently uses the existing N5-style calculator suitability language.
   * Later, this can be widened if another course needs a different model.
   */
  calculatorPolicy: SkillPaperSuitability;

  /**
   * Used to estimate time from marks.
   */
  minutesPerMark: number;

  defaultTargetMarks: number;
  description?: string;

  /**
   * Label used on the printable cover page.
   *
   * Example:
   * - Paper 1 (Non-calculator)
   * - Paper 2 (Calculator)
   */
  printTitle: string;

  /**
   * Instruction shown on the cover page.
   *
   * Example:
   * - You must NOT use a calculator.
   * - You may use a calculator.
   */
  coverInstructionText: string;

  /**
   * Whether to show the crossed-out calculator icon on the cover page.
   */
  showNoCalculatorIcon: boolean;
};

export type CourseAssessmentModeId =
  | "PRELIM"
  | "CLASS_TEST"
  | "HOMEWORK"
  | "CHECK_TEST"
  | "CUSTOM";

export type CourseAssessmentMode = {
  id: CourseAssessmentModeId;
  label: string;
  shortLabel: string;
  description: string;
  guidanceStrictness: "strict" | "medium" | "light";
};

export type CourseAssessmentStructureId = "BOTH" | "P1_ONLY" | "P2_ONLY";

export type CourseAssessmentStructure = {
  id: CourseAssessmentStructureId;
  label: string;
  shortLabel: string;
  includedPapers: Paper[];
  description: string;
};

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
  shortName: string;

  subjectArea: CourseSubjectArea;
  awardingBody: CourseAwardingBody;
  levelLabel: CourseLevelLabel;

  /**
   * Label used on printable assessment cover pages.
   *
   * Example:
   * - Mathematics
   * - Applications of Mathematics
   */
  printSubjectName: string;

  /**
   * Badge shown on the printable cover page.
   *
   * Example:
   * - N5
   * - Higher
   */
  printQualificationBadge: string;

  /**
   * Qualification label lines shown beside the badge.
   *
   * Example:
   * - ["National", "Qualifications"]
   */
  printQualificationLabelLines: string[];

  papers: CoursePaperConfig[];
  assessmentModes: CourseAssessmentMode[];

  visibleSetupAssessmentModeIds?: CourseAssessmentModeId[];

  assessmentStructures: CourseAssessmentStructure[];

  visibleSetupAssessmentStructureIds?: CourseAssessmentStructureId[];

  topicTargets: CourseTopicTarget[];

  /**
   * This is optional for now so we can introduce the config safely.
   * Eventually, the builder should render its skills tree from this.
   */
  skillTree?: SkillsData;
};

export function getCoursePaperConfig(
  courseConfig: CourseAssessmentConfig,
  paper: Paper
): CoursePaperConfig {
  const found = courseConfig.papers.find((item) => item.id === paper);

  if (!found) {
    throw new Error(
      `Paper "${paper}" is not defined for ${courseConfig.displayName}.`
    );
  }

  return found;
}

export function getCourseAssessmentStructure(
  courseConfig: CourseAssessmentConfig,
  structureId: CourseAssessmentStructureId
): CourseAssessmentStructure {
  const found = courseConfig.assessmentStructures.find(
    (item) => item.id === structureId
  );

  if (!found) {
    throw new Error(
      `Assessment structure "${structureId}" is not defined for ${courseConfig.displayName}.`
    );
  }

  return found;
}