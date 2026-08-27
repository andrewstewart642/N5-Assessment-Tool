import type {
  Question,
} from "@/app/Assessments/AssessmentTypes";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import type {
  PaperPart,
} from "@/app/Assessments/Questions/Content/PaperParts";

import PaperContent from "@/app/UI/Documents/Components/PaperContent";

import {
  QUESTION_COLUMN_GAP_PX,
  QUESTION_MARKS_COLUMN_PX,
  QUESTION_NUMBER_COLUMN_PX,
} from "@/app/Assessments/Questions/Preview/QuestionPreviewLayout";

import {
  getAssessmentCompilationQuestionSpacingBasePx,
} from "../Pagination/AssessmentCompilationPagination";


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


function isPaperParts(
  value:
    unknown
): value is PaperPart[] {
  return (
    Array.isArray(
      value
    ) &&
    value.every(
      (
        part
      ) =>
        Boolean(
          part
        ) &&
        typeof part ===
          "object" &&
        "kind" in
          (
            part as object
          )
    )
  );
}


export default function AssessmentCompiledQuestion({
  index,
  question,
  courseId,
}: {
  index:
    number;

  question:
    Question;

  courseId:
    CourseId;
}) {
  const marks =
    getQuestionMarks(
      question
    );

  const promptParts =
    (
      question as Question & {
        promptParts?:
          unknown;
      }
    ).promptParts;

  const spacingBasePx =
    getAssessmentCompilationQuestionSpacingBasePx(
      question,
      courseId
    );


  return (
    <div>
      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            `${QUESTION_NUMBER_COLUMN_PX}px minmax(0, 1fr) ${QUESTION_MARKS_COLUMN_PX}px`,

          columnGap:
            QUESTION_COLUMN_GAP_PX,

          alignItems:
            "start",

          color:
            "#111",
        }}
      >
        <div
          style={{
            fontSize:
              14,

            fontWeight:
              600,

            lineHeight:
              1.25,
          }}
        >
          {index}.
        </div>

        <div
          style={{
            minWidth:
              0,

            fontSize:
              14,

            fontWeight:
              500,

            lineHeight:
              1.4,
          }}
        >
          {isPaperParts(
            promptParts
          ) ? (
            <PaperContent
              parts={
                promptParts
              }
            />
          ) : (
            <span>
              {question.prompt ??
                `${question.skillCode} — ${question.skillText}`}
            </span>
          )}
        </div>

        <div
          style={{
            textAlign:
              "right",

            fontSize:
              12,

            fontWeight:
              600,

            lineHeight:
              1.2,
          }}
        >
          {marks >
          0
            ? `(${marks})`
            : null}
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          height:
            spacingBasePx,
        }}
      />
    </div>
  );
}