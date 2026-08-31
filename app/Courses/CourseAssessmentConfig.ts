import type { CourseId } from "@/app/Courses/CourseTypes";

import type {
  AssessmentTopicCode,
  Paper,
  SkillPaperSuitability,
  SkillsData,
} from "@/app/Assessments/AssessmentTypes";

export type CourseSubjectArea =
  "Mathematics";

export type CourseAwardingBody =
  "SQA";

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
   * Calculator suitability used by the current
   * assessment/question metadata model.
   */
  calculatorPolicy: SkillPaperSuitability;

  /**
   * Used to estimate assessment time from marks.
   */
  minutesPerMark: number;

  defaultTargetMarks: number;

  /**
   * Historical default values that may appear in unversioned saved
   * assessments after an older/transitional Course configuration was used.
   *
   * Generic persistence can migrate a complete matching legacy paper set to
   * the current defaults without hard-wiring any Course-specific mark values.
   */
  historicalDefaultTargetMarks?: number[];

  description?: string;

  /**
   * Compatibility tags used by historical
   * skill/question metadata.
   */
  suitabilityAliases?: string[];

  /**
   * Label used on printable assessment cover pages.
   */
  printTitle: string;

  /**
   * Instruction displayed on the assessment cover.
   */
  coverInstructionText: string;

  /**
   * Whether the printable cover should display the
   * crossed-out calculator icon.
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

  guidanceStrictness:
    | "strict"
    | "medium"
    | "light";
};

/**
 * Identifier for a Course-supported assessment
 * structure.
 *
 * Current maths Courses use values such as:
 *
 * BOTH
 * P1_ONLY
 * P2_ONLY
 *
 * but generic Course architecture is not restricted
 * to those identifiers.
 */
export type CourseAssessmentStructureId =
  string;

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

/**
 * Course-owned balance rule consumed by the generic assessment Metrics layer.
 *
 * The right-hand percentage is the quoted target for the second label, while
 * tolerancePct describes the permitted percentage-point movement either side.
 */
export type CourseAssessmentBalanceMetric = {
  id: string;
  label: string;
  leftLabel: string;
  rightLabel: string;
  rightTargetPct: number;
  tolerancePct: number;
};

export type CourseAssessmentCoverageMetric = {
  label: string;
  thresholdPct: number;
  thresholdLabel?: string;
};

/**
 * Course-supplied policy only. The actual Metrics calculations and UI remain
 * under app/Assessments/Creation/Metrics.
 */
export type CourseAssessmentMetricsConfig = {
  standardBalance: CourseAssessmentBalanceMetric;
  thinkingBalance: CourseAssessmentBalanceMetric;
  coverage: CourseAssessmentCoverageMetric;
};

/**
 * Generic Assessment-facing configuration supplied
 * by a Course.
 *
 * This does not represent the whole Course domain.
 * Course-owned documents, skills, generators and
 * source evidence remain separate concerns.
 */
export type CourseAssessmentConfig = {
  courseId: CourseId;

  displayName: string;
  shortName: string;

  subjectArea: CourseSubjectArea;
  awardingBody: CourseAwardingBody;
  levelLabel: CourseLevelLabel;

  printSubjectName: string;
  printQualificationBadge: string;
  printQualificationLabelLines: string[];

  papers: CoursePaperConfig[];

  assessmentModes: CourseAssessmentMode[];

  visibleSetupAssessmentModeIds?:
    CourseAssessmentModeId[];

  assessmentStructures:
    CourseAssessmentStructure[];

  visibleSetupAssessmentStructureIds?:
    CourseAssessmentStructureId[];

  topicTargets: CourseTopicTarget[];

  /**
   * Optional course policy for the generic Builder Metrics feature.
   * Courses which do not define this continue to build normally without the
   * Metrics panel.
   */
  assessmentMetrics?:
    CourseAssessmentMetricsConfig;

  /**
   * Transitional optional curriculum contract.
   *
   * Course-specific skills ownership is being
   * migrated independently.
   */
  skillTree?: SkillsData;
};

export function getCoursePaperConfig(
  courseConfig: CourseAssessmentConfig,
  paper: Paper
): CoursePaperConfig {
  const found =
    courseConfig.papers.find(
      (item) =>
        item.id === paper
    );

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
  const found =
    courseConfig.assessmentStructures.find(
      (item) =>
        item.id === structureId
    );

  if (!found) {
    throw new Error(
      `Assessment structure "${structureId}" is not defined for ${courseConfig.displayName}.`
    );
  }

  return found;
}

export function getCoursePaperSuitabilityTags(
  paperConfig: CoursePaperConfig
): string[] {
  return [
    paperConfig.id,
    paperConfig.calculatorPolicy,
    ...(paperConfig.suitabilityAliases ?? []),
  ].filter(
    (tag, index, tags) =>
      tags.indexOf(tag) === index
  );
}

export function coursePaperMatchesSuitability({
  paperConfig,
  paperSuitability,
}: {
  paperConfig: CoursePaperConfig;
  paperSuitability: SkillPaperSuitability;
}): boolean {
  if (paperSuitability === "BOTH") {
    return true;
  }

  return getCoursePaperSuitabilityTags(
    paperConfig
  ).includes(
    paperSuitability
  );
}

export function findCoursePaperConfigForSuitability(
  courseConfig: CourseAssessmentConfig,
  paperSuitability: SkillPaperSuitability
): CoursePaperConfig | null {
  if (paperSuitability === "BOTH") {
    return null;
  }

  return (
    courseConfig.papers.find(
      (paperConfig) =>
        coursePaperMatchesSuitability({
          paperConfig,
          paperSuitability,
        })
    ) ?? null
  );
}
