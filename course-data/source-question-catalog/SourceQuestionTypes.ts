import type {
  AssessmentTopicCode,
  CourseId,
  Paper,
  SkillPaperSuitability,
} from "@/shared-types/AssessmentTypes";

export type SourceQuestionId = string;

export type SourceQuestionKind =
  | "SQA_PAST_PAPER"
  | "SQA_SPECIMEN"
  | "TEACHER_AUTHORED"
  | "SQA_STYLE";

export type SourceQuestionReviewStatus =
  | "DRAFT"
  | "CATALOGUED"
  | "REVIEWED"
  | "APPROVED"
  | "DEPRECATED";

export type SourceQuestionStandardProfile = "C" | "A" | "C+A";

export type SourceQuestionThinkingProfile =
  | "OPERATIONAL"
  | "REASONING"
  | "MIXED";

export type SourceQuestionCalculatorStatus =
  | "NON_CALCULATOR"
  | "CALCULATOR_ALLOWED"
  | "CALCULATOR_REQUIRED";

export type SourceQuestionPart = {
  id: SourceQuestionId;
  label: string;
  marks: number;

  skillIds: string[];
  conceptIds: string[];

  topic: AssessmentTopicCode;
  standardProfile: SourceQuestionStandardProfile;
  thinkingProfile: SourceQuestionThinkingProfile;
};

export type SourceQuestionCatalogEntry = {
  id: SourceQuestionId;

  courseId: CourseId;
  sourceKind: SourceQuestionKind;

  year?: number;
  paper: Paper;
  questionNumber: string;

  totalMarks: number;

  paperSuitability: SkillPaperSuitability;
  calculatorStatus: SourceQuestionCalculatorStatus;

  primaryTopic: AssessmentTopicCode;
  skillIds: string[];
  conceptIds: string[];

  standardProfile: SourceQuestionStandardProfile;
  thinkingProfile: SourceQuestionThinkingProfile;

  promptSummary: string;
  privateNotes?: string;

  parts?: SourceQuestionPart[];

  linkedGeneratorFamilyIds: string[];

  reviewStatus: SourceQuestionReviewStatus;
};