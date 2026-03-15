"use client";

import { UI_TYPO } from "@/app/ui/UiTypography";
import type { Question } from "@/shared-types/AssessmentTypes";
import type { PaperPart } from "@/shared-types/PaperParts";
import PaperContent from "@/app/create-assessment/builder/components/assessment-preview/PaperContent";
import {
  DRAFT_BOTTOM_CONTROLS_GAP_PX,
  DRAFT_BOTTOM_CONTROLS_HEIGHT_PX,
  DRAFT_EDIT_BUTTON_RIGHT_PX,
  QUESTION_COL_GAP_PX,
  QUESTION_MARKS_COL_PX,
  QUESTION_NUMBER_COL_PX,
  QUESTION_TEXT_COL_LEFT_PX,
} from "../../builder-definitions/BuilderConstants";

export type PaperQuestionDraftProps = {
  index: number;
  question: Question;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  primaryDisabled?: boolean;
  primaryDisabledReason?: string;
};

function getMarks(q: Question) {
  if (typeof q.marks === "number" && Number.isFinite(q.marks)) return q.marks;
  if (typeof q.targetMarks === "number" && Number.isFinite(q.targetMarks)) return q.targetMarks;
  return 0;
}

function isParts(value: unknown): value is PaperPart[] {
  return Array.isArray(value) && value.every((p) => p && typeof p === "object" && "kind" in (p as any));
}

export default function PaperQuestionDraft({
  index,
  question,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  primaryDisabled = false,
  primaryDisabledReason,
}: PaperQuestionDraftProps) {
  const marks = getMarks(question);

  const metaBits = [
    question.concept,
    `${question.standardFilter}-standard`,
    marks ? `${marks} marks` : null,
    `Diff ${question.difficulty}`,
  ].filter(Boolean);

  const promptParts = (question as any).promptParts;
  const answerParts = (question as any).answerParts;

  return (
    <div style={{ position: "relative", width: "100%", fontFamily: UI_TYPO.family }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 6,
          right: DRAFT_EDIT_BUTTON_RIGHT_PX,
          zIndex: 3,
          fontFamily: UI_TYPO.family,
          fontSize: 11,
          fontWeight: UI_TYPO.weightSemibold,
          color: "rgba(15,23,42,0.55)",
          background: "rgba(255,255,255,0.75)",
          border: "1px solid rgba(15,23,42,0.18)",
          borderRadius: 999,
          padding: "5px 9px",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
        title="Draft mode"
      >
        Draft
      </div>

      <div
        style={{
          outline: "2px solid rgba(147,197,253,0.28)",
          outlineOffset: 6,
          borderRadius: 8,
          paddingBottom: DRAFT_BOTTOM_CONTROLS_HEIGHT_PX + DRAFT_BOTTOM_CONTROLS_GAP_PX,
        }}
      >
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

      <div
        style={{
          position: "absolute",
          left: QUESTION_TEXT_COL_LEFT_PX,
          bottom: 6,
          display: "flex",
          gap: 8,
          alignItems: "center",
          zIndex: 3,
        }}
      >
        <button
          type="button"
          onClick={onPrimary}
          disabled={primaryDisabled}
          aria-disabled={primaryDisabled}
          style={{
            border: primaryDisabled
              ? "1px solid rgba(15,23,42,0.14)"
              : "1px solid rgba(255,255,255,0.18)",
            background: primaryDisabled
              ? "rgba(203,213,225,0.75)"
              : "rgba(147,197,253,0.92)",
            color: primaryDisabled
              ? "rgba(71,85,105,0.82)"
              : "rgba(30,58,138,0.95)",
            borderRadius: 10,
            padding: "6px 10px",
            cursor: primaryDisabled ? "not-allowed" : "pointer",
            fontFamily: UI_TYPO.family,
            fontWeight: UI_TYPO.weightSemibold,
            fontSize: 12,
            height: 32,
            opacity: primaryDisabled ? 0.82 : 1,
          }}
          title={primaryDisabled ? primaryDisabledReason ?? primaryLabel : primaryLabel}
        >
          {primaryLabel}
        </button>

        <button
          type="button"
          onClick={onSecondary}
          style={{
            border: "1px solid rgba(15,23,42,0.25)",
            background: "rgba(255,255,255,0.70)",
            color: "rgba(15,23,42,0.75)",
            borderRadius: 10,
            padding: "6px 10px",
            cursor: "pointer",
            fontFamily: UI_TYPO.family,
            fontWeight: UI_TYPO.weightMedium,
            fontSize: 12,
            height: 32,
          }}
          title={secondaryLabel}
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}