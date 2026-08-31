export {
  calculateAssessmentMetrics,
} from "./MetricsEngine";

export {
  useAssessmentMetrics,
} from "./AssessmentMetricsState";

export {
  buildTopicMetricPolicies,
  percentageToMarks,
  sumAssessmentTargetMarks,
  toAchievableTopicMarkRange,
} from "./MetricsTargets";

export {
  getCoverageUnitIdsFromSkillsData,
  getCoverageUnitLabelMap,
  getQuestionCoverageUnitIds,
  getRepresentedCoverageUnitIds,
  getSkillCoverageUnitId,
  isSkillRepresentedInAssessment,
} from "./CourseSpecificationCoverage";

export {
  ASSESSMENT_TOPIC_CODES,
  getQuestionMetricTotalMarks,
  resolveQuestionMetricProfile,
} from "./MetricsValidation";

export {
  default as MetricGauge,
} from "./MetricGauge";

export {
  default as MetricsPanel,
} from "./MetricsPanel";

export type {
  AssessmentMetricValidationIssue,
  AssessmentMetricsPolicy,
  AssessmentMetricsSnapshot,
  BalanceMetricPolicy,
  BalanceMetricSnapshot,
  CoverageMetricPolicy,
  CoverageMetricSnapshot,
  MetricAvailability,
  MetricRangeStatus,
  TopicMetricPolicy,
  TopicMetricSnapshot,
} from "./MetricsTypes";
