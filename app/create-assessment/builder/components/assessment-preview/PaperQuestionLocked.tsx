"use client";

import { UI_TYPO } from "@/app/ui/UiTypography";
import type { Question } from "@/shared-types/AssessmentTypes";
import type { PaperPart } from "@/shared-types/PaperParts";
import PaperContent from "@/app/create-assessment/builder/components/assessment-preview/PaperContent";
import {
  QUESTION_COL_GAP_PX,
  QUESTION_MARKS_COL_PX,
  QUESTION_NUMBER_COL_PX,
} from "../../builder-definitions/BuilderConstants";

type Props = {
  index: number; // 1-based
  question: Question;
};

function marksFor(q: Question) {
  if (typeof q.marks === "number" && Number.isFinite(q.marks)) return q.marks;
  if (typeof q.targetMarks === "number" && Number.isFinite(q.targetMarks)) return q.targetMarks;
  return 0;
}

function isParts(value: unknown): value is PaperPart[] {
  return Array.isArray(value) && value.every((p) => p && typeof p === "object" && "kind" in (p as any));
}

export default function PaperQuestionLocked({ index, question }: Props) {
  const marks = marksFor(question);

  const metaBits = [
    question.concept,
    `${question.standardFilter}-standard`,
    marks ? `${marks} marks` : null,
    `Diff ${question.difficulty}`,
  ].filter(Boolean);

  const promptParts = (question as any).promptParts;
  const answerParts = (question as any).answerParts;

  return (
    <div style={{ position: "relative", fontFamily: UI_TYPO.family }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `${QUESTION_NUMBER_COL_PX}px 1fr ${QUESTION_MARKS_COL_PX}px`,
          columnGap: QUESTION_COL_GAP_PX,
          alignItems: "start",
        }}
      >
        <div
          style={{
            fontFamily: UI_TYPO.family,
            fontWeight: UI_TYPO.weightSemibold,
            fontSize: 14,
            lineHeight: 1.25,
          }}
        >
          {index}.
        </div>

        <div
          style={{
            display: "grid",
            gap: 6,
            fontFamily: UI_TYPO.family,
          }}
        >
          <div
            style={{
              fontFamily: UI_TYPO.family,
              fontSize: 14,
              fontWeight: UI_TYPO.weightMedium,
              lineHeight: 1.4,
            }}
          >
            {isParts(promptParts) ? (
              <PaperContent parts={promptParts} />
            ) : (
              <span>{question.prompt ?? `${question.skillCode} — ${question.skillText}`}</span>
            )}
          </div>

          <div
            style={{
              fontFamily: UI_TYPO.family,
              fontSize: 13,
              fontWeight: UI_TYPO.weightMedium,
              opacity: 0.85,
              lineHeight: 1.35,
            }}
          >
            Answer:{" "}
            <span
              style={{
                fontWeight: UI_TYPO.weightSemibold,
                opacity: 1,
              }}
            >
              {isParts(answerParts) ? (
                <PaperContent parts={answerParts} />
              ) : (
                <span>{question.answer ?? ""}</span>
              )}
            </span>
          </div>

          <div
            style={{
              fontFamily: UI_TYPO.family,
              fontSize: 10,
              fontWeight: UI_TYPO.weightMedium,
              opacity: 0.55,
              lineHeight: 1.3,
            }}
          >
            {metaBits.join(" • ")}
          </div>
        </div>

        <div
          style={{
            textAlign: "right",
            fontFamily: UI_TYPO.family,
            fontWeight: UI_TYPO.weightSemibold,
            fontSize: 12,
            opacity: 0.65,
            lineHeight: 1.2,
          }}
        >
          {marks ? `(${marks})` : null}
        </div>
      </div>
    </div>
  );
}