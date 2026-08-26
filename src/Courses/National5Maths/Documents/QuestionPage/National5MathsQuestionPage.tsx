import type {
  ReactNode,
} from "react";

import type {
  Paper,
} from "@/src/Assessments/AssessmentTypes";

import NationalQualificationsQuestionPageFrame from "@/src/UI/Documents/Templates/NationalQualifications/NationalQualificationsQuestionPageFrame";

type National5MathsQuestionPageProps = {
  children?: ReactNode;

  paper:
    Paper;

  pageNumber:
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
  isFirstQuestionPage = false,
  showTurnOver = true,
  viewerScale = 1,
  outerPaddingPx = 18,
}: National5MathsQuestionPageProps) {
  const totalMarks =
    paper === "P1"
      ? 40
      : 50;

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
            {totalMarks}
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