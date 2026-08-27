import type {
  Paper,
  Question,
} from "@/app/Assessments/AssessmentTypes";

import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import {
  getCourseAssessmentConfigById,
} from "@/app/Courses/CourseRegistry";

import {
  normaliseCourseId,
} from "@/app/Courses/CourseCatalog";

import {
  getCourseAssessmentStructure,
  getCoursePaperConfig,
} from "@/app/Courses/CourseAssessmentConfig";

import {
  paginateAssessmentCompilationQuestions,
} from "../Pagination/AssessmentCompilationPagination";

import type {
  AssessmentCompilationDocument,
  AssessmentCompilationPage,
  AssessmentCompilationPaper,
} from "./AssessmentCompilationDocument";


function getQuestionMarks(
  question:
    Question
): number {
  if (
    typeof question.marks ===
      "number" &&
    Number.isFinite(
      question.marks
    )
  ) {
    return question.marks;
  }

  if (
    typeof question.targetMarks ===
      "number" &&
    Number.isFinite(
      question.targetMarks
    )
  ) {
    return question.targetMarks;
  }

  return 0;
}


function getPaperTotalMarks(
  questions:
    Question[]
): number {
  return questions.reduce(
    (
      total,
      question
    ) =>
      total +
      getQuestionMarks(
        question
      ),
    0
  );
}


function getPaperTargetMarks(
  savedAssessment:
    SavedAssessment,

  paper:
    Paper
): number {
  const modernTarget =
    savedAssessment.builder
      .targetMarksByPaper?.[
        paper
      ];

  if (
    typeof modernTarget ===
      "number" &&
    Number.isFinite(
      modernTarget
    )
  ) {
    return modernTarget;
  }

  return paper ===
    "P1"
    ? savedAssessment.builder
        .p1Target
    : savedAssessment.builder
        .p2Target;
}


function formatDateForDocument(
  value:
    string
): string {
  const trimmed =
    value.trim();

  if (
    !trimmed
  ) {
    return "";
  }


  const britishMatch =
    trimmed.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    );

  if (
    britishMatch
  ) {
    const [
      ,
      day,
      month,
      year,
    ] =
      britishMatch;

    return `${day.padStart(
      2,
      "0"
    )}/${month.padStart(
      2,
      "0"
    )}/${year}`;
  }


  const isoMatch =
    trimmed.match(
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/
    );

  if (
    isoMatch
  ) {
    const [
      ,
      year,
      month,
      day,
    ] =
      isoMatch;

    return `${day.padStart(
      2,
      "0"
    )}/${month.padStart(
      2,
      "0"
    )}/${year}`;
  }


  const parsed =
    Date.parse(
      trimmed
    );

  if (
    Number.isFinite(
      parsed
    )
  ) {
    const date =
      new Date(
        parsed
      );

    const day =
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      );

    const month =
      String(
        date.getMonth() +
          1
      ).padStart(
        2,
        "0"
      );

    return `${day}/${month}/${date.getFullYear()}`;
  }


  return trimmed;
}


function getPaperDateText(
  savedAssessment:
    SavedAssessment,

  paper:
    Paper
): string {
  const mappedDate =
    savedAssessment.builder
      .coverDateByPaper?.[
        paper
      ];

  if (
    mappedDate?.trim()
  ) {
    return formatDateForDocument(
      mappedDate
    );
  }


  if (
    paper ===
      "P2" &&
    savedAssessment.builder
      .p2CoverDate
      .trim()
  ) {
    return formatDateForDocument(
      savedAssessment.builder
        .p2CoverDate
    );
  }


  return formatDateForDocument(
    savedAssessment.builder
      .assessmentDate ||
      savedAssessment.setup
        .assessmentDate
  );
}


function getPaperStartTimeText(
  savedAssessment:
    SavedAssessment,

  paper:
    Paper
): string {
  const mapped =
    savedAssessment.builder
      .startTimeByPaper?.[
        paper
      ];

  if (
    mapped?.trim()
  ) {
    return mapped.trim();
  }

  return paper ===
    "P1"
    ? savedAssessment.builder
        .p1StartTime
        .trim()
    : savedAssessment.builder
        .p2StartTime
        .trim();
}


function getPaperEndTimeText(
  savedAssessment:
    SavedAssessment,

  paper:
    Paper
): string {
  const mapped =
    savedAssessment.builder
      .endTimeByPaper?.[
        paper
      ];

  if (
    mapped?.trim()
  ) {
    return mapped.trim();
  }

  return paper ===
    "P1"
    ? savedAssessment.builder
        .p1EndTime
        .trim()
    : savedAssessment.builder
        .p2EndTime
        .trim();
}


function buildTimeText(
  startTime:
    string,

  endTime:
    string
): string {
  if (
    startTime &&
    endTime
  ) {
    return `${startTime} – ${endTime}`;
  }

  return (
    startTime ||
    endTime
  );
}


function buildPages({
  questions,
  includeCoverSheet,
  includeFormulaSheet,
  courseId,
}: {
  questions:
    Question[];

  includeCoverSheet:
    boolean;

  includeFormulaSheet:
    boolean;

  courseId:
    AssessmentCompilationDocument["courseId"];
}): AssessmentCompilationPage[] {
  const questionPages =
    paginateAssessmentCompilationQuestions({
      questions,
      courseId,
    });

  const pages:
    AssessmentCompilationPage[] =
      [];

  let pageNumber =
    1;


  if (
    includeCoverSheet
  ) {
    pages.push({
      kind:
        "cover",

      pageNumber,
    });

    pageNumber +=
      1;
  }


  if (
    includeFormulaSheet
  ) {
    pages.push({
      kind:
        "formula",

      pageNumber,
    });

    pageNumber +=
      1;
  }


  if (
    questionPages.length ===
    0
  ) {
    pages.push({
      kind:
        "empty",

      pageNumber,
    });

    return pages;
  }


  let questionStartIndex =
    1;


  questionPages.forEach(
    (
      pageQuestions,
      questionPageIndex
    ) => {
      pages.push({
        kind:
          "questions",

        pageNumber,

        questionPageIndex,

        questionStartIndex,

        questions:
          pageQuestions,
      });

      pageNumber +=
        1;

      questionStartIndex +=
        pageQuestions.length;
    }
  );


  return pages;
}


export function buildAssessmentCompilationDocument(
  savedAssessment:
    SavedAssessment
): AssessmentCompilationDocument {
  const courseId =
    normaliseCourseId(
      savedAssessment.setup
        .courseId ??
        savedAssessment.setup
          .levelId
    );

  if (
    !courseId
  ) {
    throw new Error(
      "The saved assessment does not contain a valid course."
    );
  }


  const courseConfig =
    getCourseAssessmentConfigById(
      courseId
    );


  const structure =
    getCourseAssessmentStructure(
      courseConfig,
      savedAssessment.setup
        .paperStructure
    );


  const includeCoverSheet =
    Boolean(
      savedAssessment.builder
        .includeCoverSheet
    );

  const includeFormulaSheet =
    Boolean(
      savedAssessment.builder
        .includeFormulaSheet
    );


  const papers:
    AssessmentCompilationPaper[] =
      structure.includedPapers
        .map(
          (
            paper
          ) => {
            const paperConfig =
              getCoursePaperConfig(
                courseConfig,
                paper
              );

            const questions =
              savedAssessment.builder
                .questions
                .filter(
                  (
                    question
                  ) =>
                    question.paper ===
                    paper
                );

            const startTimeText =
              getPaperStartTimeText(
                savedAssessment,
                paper
              );

            const endTimeText =
              getPaperEndTimeText(
                savedAssessment,
                paper
              );


            return {
              paper,

              order:
                paperConfig.order,

              label:
                paperConfig.label,

              printTitle:
                paperConfig.printTitle,

              coverInstructionText:
                paperConfig.coverInstructionText,

              showNoCalculatorIcon:
                paperConfig.showNoCalculatorIcon,

              targetMarks:
                getPaperTargetMarks(
                  savedAssessment,
                  paper
                ),

              totalMarks:
                getPaperTotalMarks(
                  questions
                ),

              includeCoverSheet,

              includeFormulaSheet,

              showDateTime:
                savedAssessment.builder
                  .showCoverDateTime,

              dateText:
                getPaperDateText(
                  savedAssessment,
                  paper
                ),

              startTimeText,

              endTimeText,

              timeText:
                buildTimeText(
                  startTimeText,
                  endTimeText
                ),

              pages:
                buildPages({
                  questions,

                  includeCoverSheet,

                  includeFormulaSheet,

                  courseId,
                }),
            };
          }
        )
        .sort(
          (
            first,
            second
          ) =>
            first.order -
            second.order
        );


  return {
    assessmentId:
      savedAssessment.id,

    sourceUpdatedAt:
      savedAssessment.updatedAt,

    assessmentName:
      savedAssessment.setup
        .assessmentName ||
      savedAssessment.builder
        .assessmentName ||
      "[Untitled file]",

    courseId,

    courseDisplayName:
      courseConfig.displayName,

    printSubjectName:
      courseConfig.printSubjectName,

    printQualificationBadge:
      courseConfig.printQualificationBadge,

    printQualificationLabelLines:
      courseConfig.printQualificationLabelLines,

    showScottishCandidateNumberBox:
      savedAssessment.builder
        .showScottishCandidateNumberBox,

    papers,
  };
}