import type {
  AssessmentLevelId,
} from "@/app/Assessments/Creation/Setup/AssessmentClassCoverageStorage";

import type {
  AssessmentType,
  BuildPriority,
  PaperStructure,
} from "@/app/Assessments/Creation/Setup/SavedChoices";

import type {
  AssessmentPaperBooleanMap,
  AssessmentPaperStringMap,
} from "@/app/Assessments/Creation/Papers/PaperSpecificValues";

import type {
  AssessmentTargetMarksByPaper,
} from "@/app/Assessments/Creation/Papers/MarkTargetCalculations";

import type {
  AssessmentEditQuestionDraftByPaper,
  AssessmentQuestionDraftByPaper,
} from "@/app/Assessments/Creation/Questions/DraftTypes";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import type {
  Paper,
  Question,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/app/Assessments/AssessmentTypes";


export type SavedAssessmentStatus =
  | "DRAFT"
  | "COMPLETE";


export type SavedAssessmentSetup = {
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

  coverDateByPaper?:
    AssessmentPaperStringMap;

  startTimeByPaper?:
    AssessmentPaperStringMap;

  endTimeByPaper?:
    AssessmentPaperStringMap;

  coverDateCustomByPaper?:
    AssessmentPaperBooleanMap;


  /*
   * Paper-sitting link state.
   *
   * Optional so historical saved assessments
   * remain valid.
   */

  datesUnlinked?:
    boolean;

  dateLinkOwnerPaper?:
    Paper | null;

  startTimesUnlinked?:
    boolean;

  startTimeLinkOwnerPaper?:
    Paper | null;


  /*
   * Distinguishes an automatically calculated
   * End value from a teacher override.
   */

  endTimeManuallyEditedByPaper?:
    AssessmentPaperBooleanMap;


  /*
   * Transitional historical P1/P2 fields.
   */

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