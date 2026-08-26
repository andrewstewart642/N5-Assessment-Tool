import type {
  AssessmentLevelId,
} from "@/app/Assessments/Creation/Setup/AssessmentClassCoverageStorage";

import type {
  AssessmentType,
  BuildPriority,
  PaperStructure,
} from "@/app/Assessments/Creation/Setup/AssessmentSetupStorage";

import type {
  AssessmentPaperBooleanMap,
  AssessmentPaperStringMap,
} from "@/app/Assessments/Creation/Papers/AssessmentPaperValueMaps";

import type {
  AssessmentTargetMarksByPaper,
} from "@/app/Assessments/Creation/Papers/AssessmentPaperTargets";

import type {
  AssessmentEditQuestionDraftByPaper,
  AssessmentQuestionDraftByPaper,
} from "@/app/Assessments/Creation/Questions/AssessmentQuestionDraftTypes";

import type {
  CourseId,
  Paper,
  Question,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/app/Assessments/AssessmentTypes";

export type SavedAssessmentStatus =
  | "DRAFT"
  | "COMPLETE";

export type SavedAssessmentSetup = {
  /**
   * Course-aware foundation field.
   *
   * Optional for now so older saved assessments in localStorage do not
   * immediately become invalid while the app transitions from N5-only to
   * course-config-driven.
   */
  courseId?:
    CourseId;

  assessmentType:
    AssessmentType;

  buildPriority:
    BuildPriority;

  paperStructure:
    PaperStructure;

  includeCoverSheet:
    boolean;

  includeFormulaSheet:
    boolean;

  marksTargetP1:
    number | null;

  marksTargetP2:
    number | null;

  timeTargetP1:
    number | null;

  timeTargetP2:
    number | null;

  assessmentName:
    string;

  className:
    string;

  assessmentDate:
    string;

  levelId:
    AssessmentLevelId | null;

  selectedClassIds:
    string[];

  useCompleteCourseCoverage:
    boolean;
};

export type SavedAssessmentBuilder = {
  standardFilter:
    StandardFilter;

  thinkingTypeFilter:
    ThinkingTypeFilter;

  targetMarks:
    number;

  activePaper:
    Paper;

  viewPaper:
    Paper;

  /**
   * Generic target map used by the course-config-driven assessment creator.
   *
   * The legacy p1Target/p2Target fields remain during the transition so older
   * saved assessments and older UI paths keep working.
   */
  targetMarksByPaper?:
    AssessmentTargetMarksByPaper;

  p1Target:
    number;

  p2Target:
    number;

  questions:
    Question[];

  draftByPaper:
    AssessmentQuestionDraftByPaper;

  editDraftByPaper:
    AssessmentEditQuestionDraftByPaper;

  includeCoverSheet:
    boolean;

  includeFormulaSheet:
    boolean;

  showCoverDateTime:
    boolean;

  showScottishCandidateNumberBox:
    boolean;

  assessmentName:
    string;

  className:
    string;

  assessmentDate:
    string;

  /**
   * Generic paper sitting metadata used by the course-config-driven
   * assessment creator.
   *
   * The legacy fields below remain during the transition so old saved
   * assessments can still be loaded safely.
   */
  coverDateByPaper?:
    AssessmentPaperStringMap;

  startTimeByPaper?:
    AssessmentPaperStringMap;

  endTimeByPaper?:
    AssessmentPaperStringMap;

  coverDateCustomByPaper?:
    AssessmentPaperBooleanMap;

  p1StartTime:
    string;

  p1EndTime:
    string;

  p2CoverDate:
    string;

  p2StartTime:
    string;

  p2EndTime:
    string;

  p2DateCustom:
    boolean;
};

export type SavedAssessment = {
  id:
    string;

  status:
    SavedAssessmentStatus;

  isPinned:
    boolean;

  createdAt:
    number;

  updatedAt:
    number;

  setup:
    SavedAssessmentSetup;

  builder:
    SavedAssessmentBuilder;
};