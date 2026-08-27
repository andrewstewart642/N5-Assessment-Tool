import type {
  Paper,
  Question,
} from "@/app/Assessments/AssessmentTypes";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";


export type AssessmentCompilationCoverPage = {
  kind:
    "cover";

  pageNumber:
    number;
};


export type AssessmentCompilationFormulaPage = {
  kind:
    "formula";

  pageNumber:
    number;
};


export type AssessmentCompilationQuestionPage = {
  kind:
    "questions";

  pageNumber:
    number;

  questionPageIndex:
    number;

  questionStartIndex:
    number;

  questions:
    Question[];
};


export type AssessmentCompilationEmptyPage = {
  kind:
    "empty";

  pageNumber:
    number;
};


export type AssessmentCompilationPage =
  | AssessmentCompilationCoverPage
  | AssessmentCompilationFormulaPage
  | AssessmentCompilationQuestionPage
  | AssessmentCompilationEmptyPage;


export type AssessmentCompilationPaper = {
  paper:
    Paper;

  order:
    number;

  label:
    string;

  printTitle:
    string;

  coverInstructionText:
    string;

  showNoCalculatorIcon:
    boolean;

  targetMarks:
    number;

  totalMarks:
    number;

  includeCoverSheet:
    boolean;

  includeFormulaSheet:
    boolean;

  showDateTime:
    boolean;

  dateText:
    string;

  startTimeText:
    string;

  endTimeText:
    string;

  timeText:
    string;

  pages:
    AssessmentCompilationPage[];
};


export type AssessmentCompilationDocument = {
  assessmentId:
    string;

  sourceUpdatedAt:
    number;

  assessmentName:
    string;

  courseId:
    CourseId;

  courseDisplayName:
    string;

  printSubjectName:
    string;

  printQualificationBadge:
    string;

  printQualificationLabelLines:
    string[];

  showScottishCandidateNumberBox:
    boolean;

  papers:
    AssessmentCompilationPaper[];
};