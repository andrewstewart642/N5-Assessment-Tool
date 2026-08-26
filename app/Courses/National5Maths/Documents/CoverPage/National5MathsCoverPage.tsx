import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import NationalQualificationsCoverPage from "@/app/UI/Documents/Templates/NationalQualifications/NationalQualificationsCoverPage";

export type National5MathsCoverPageProps = {
  pageNumber:
    number;

  paper:
    Paper;

  totalMarks:
    number;

  showDateTime:
    boolean;

  dateText:
    string;

  timeText:
    string;

  subjectName?:
    string;

  qualificationBadge?:
    string;

  qualificationLabelLines?:
    string[];

  paperTitle?:
    string;

  coverInstructionText?:
    string;

  showNoCalculatorIcon?:
    boolean;

  showScottishCandidateNumberBox:
    boolean;

  viewerScale?:
    number;

  outerPaddingPx?:
    number;
};

export default function National5MathsCoverPage({
  paper,
  totalMarks,
  showDateTime,
  dateText,
  timeText,
  subjectName = "Mathematics",
  qualificationBadge = "N5",
  qualificationLabelLines = [
    "National",
    "Qualifications",
  ],
  paperTitle,
  coverInstructionText,
  showNoCalculatorIcon,
  showScottishCandidateNumberBox,
  viewerScale = 1,
  outerPaddingPx = 18,
}: National5MathsCoverPageProps) {
  const isPaperOne =
    paper === "P1";

  const resolvedPaperTitle =
    paperTitle ??
    (
      isPaperOne
        ? "Paper 1 (Non-calculator)"
        : "Paper 2 (Calculator)"
    );

  const resolvedCoverInstructionText =
    coverInstructionText ??
    (
      isPaperOne
        ? "You must NOT use a calculator."
        : "You may use a calculator."
    );

  const resolvedShowNoCalculatorIcon =
    showNoCalculatorIcon ??
    isPaperOne;

  return (
    <NationalQualificationsCoverPage
      totalMarks={
        totalMarks
      }
      showDateTime={
        showDateTime
      }
      dateText={
        dateText
      }
      timeText={
        timeText
      }
      subjectName={
        subjectName
      }
      qualificationBadge={
        qualificationBadge
      }
      qualificationLabelLines={
        qualificationLabelLines
      }
      paperTitle={
        resolvedPaperTitle
      }
      coverInstructionText={
        resolvedCoverInstructionText
      }
      showNoCalculatorIcon={
        resolvedShowNoCalculatorIcon
      }
      showScottishCandidateNumberBox={
        showScottishCandidateNumberBox
      }
      viewerScale={
        viewerScale
      }
      outerPaddingPx={
        outerPaddingPx
      }
    />
  );
}