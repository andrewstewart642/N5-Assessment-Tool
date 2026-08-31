import type {
  AssessmentTopicCode,
} from "@/app/Assessments/AssessmentTypes";

export type MetricRangeStatus =
  | "below"
  | "valid"
  | "above"
  | "unavailable";

export type MetricAvailability =
  | "ready"
  | "empty"
  | "invalid";

export type BalanceMetricPolicy = {
  id: string;
  label: string;
  leftLabel: string;
  rightLabel: string;

  /** Percentage target for the right-hand side of the balance. */
  rightTargetPct: number;

  /** Symmetric permitted tolerance around rightTargetPct. */
  tolerancePct: number;
};

export type TopicMetricPolicy = {
  topic: AssessmentTopicCode;
  label: string;
  minPct: number;
  targetPct: number;
  maxPct: number;
};

export type CoverageMetricPolicy = {
  label: string;
  thresholdPct: number;
  thresholdLabel?: string;
};

/**
 * Course-supplied policy consumed by the generic Metrics engine.
 *
 * The engine deliberately owns no course-specific percentages or mark totals.
 */
export type AssessmentMetricsPolicy = {
  standardBalance: BalanceMetricPolicy;
  thinkingBalance: BalanceMetricPolicy;
  topicTargets: TopicMetricPolicy[];
  coverage: CoverageMetricPolicy;
};

export type AssessmentMetricValidationIssue = {
  questionId?: string;
  dimension:
    | "standard"
    | "thinking"
    | "topic"
    | "coverage"
    | "target";
  message: string;
};

export type BalanceMetricSnapshot = {
  policy: BalanceMetricPolicy;
  availability: MetricAvailability;
  status: MetricRangeStatus;

  leftMarks: number;
  rightMarks: number;
  totalMarks: number;

  leftPct: number | null;
  rightPct: number | null;

  minRightPct: number;
  targetRightPct: number;
  maxRightPct: number;
};

export type TopicMetricSnapshot = {
  policy: TopicMetricPolicy;
  availability: MetricAvailability;
  status: MetricRangeStatus;

  marks: number;
  currentPct: number | null;

  minMarksExact: number;
  targetMarksExact: number;
  maxMarksExact: number;

  minMarksAchievable: number;
  targetMarksAchievable: number;
  maxMarksAchievable: number;
};

export type CoverageMetricSnapshot = {
  policy: CoverageMetricPolicy;
  availability: MetricAvailability;

  representedUnits: number;
  totalUnits: number;
  requiredUnits: number;
  percentage: number;
  thresholdMet: boolean;

  representedUnitIds: string[];
};

export type AssessmentMetricsSnapshot = {
  assignedMarks: number;
  finalTargetMarks: number;

  standard: BalanceMetricSnapshot;
  thinking: BalanceMetricSnapshot;
  topics: TopicMetricSnapshot[];
  coverage: CoverageMetricSnapshot;

  validationIssues: AssessmentMetricValidationIssue[];
};
