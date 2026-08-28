import type {
  ReactNode,
} from "react";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import NationalQualificationsQuestionPageFrame from "@/app/UI/Documents/Templates/NationalQualifications/NationalQualificationsQuestionPageFrame";


export type National5MathsQuestionPageProps = {
  children?:
    ReactNode;

  paper:
    Paper;

  pageNumber:
    number;

  totalMarks?:
    number;

  isFirstQuestionPage?:
    boolean;

  showTurnOver?:
    boolean;

  viewerScale?:
    number;

  outerPaddingPx?:
    number;
};


export default function National5MathsQuestionPage({
  children,
  paper,
  pageNumber,
  totalMarks,
  isFirstQuestionPage =
    false,
  showTurnOver =
    true,
  viewerScale =
    1,
  outerPaddingPx =
    18,
}: National5MathsQuestionPageProps) {
  const fallbackTotalMarks =
    paper ===
      "P1"
      ? 40
      : 50;

  const resolvedTotalMarks =
    typeof totalMarks ===
      "number" &&
    Number.isFinite(
      totalMarks
    )
      ? totalMarks
      : fallbackTotalMarks;


  const questionHeader =
    isFirstQuestionPage
      ? (
        <>
          <div
            style={{
              marginBottom:
                4,
            }}
          >
            Total marks —{" "}
            {resolvedTotalMarks}
          </div>

          <div
            style={{
              fontWeight:
                700,
            }}
          >
            Attempt ALL
            questions
          </div>
        </>
      )
      : undefined;


  return (
    <NationalQualificationsQuestionPageFrame
      pageNumber={
        pageNumber
      }
      questionHeader={
        questionHeader
      }
      showTurnOver={
        showTurnOver
      }
      viewerScale={
        viewerScale
      }
      outerPaddingPx={
        outerPaddingPx
      }
    >
      {children}
    </NationalQualificationsQuestionPageFrame>
  );
}