"use client";

import type { Question } from "@/shared-types/AssessmentTypes";
import type { PaperPart } from "@/shared-types/PaperParts";
import PaperContent from "@/page-sections/PaperContent";

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
    <div style={{ position: "relative" }}>
      {/* SQA-style: number in left gutter, content in middle, marks on far right */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "26px 1fr 42px",
          columnGap: 10,
          alignItems: "start",
        }}
      >
        {/* Left gutter: Question number */}
        <div style={{ fontWeight: 900, fontSize: 14, lineHeight: 1.2 }}>{index}</div>

        {/* Main content */}
        <div style={{ display: "grid", gap: 6 }}>
          {/* Prompt */}
          <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.35 }}>
            {isParts(promptParts) ? (
              <PaperContent parts={promptParts} />
            ) : (
              <span>{question.prompt ?? `${question.skillCode} — ${question.skillText}`}</span>
            )}
          </div>

          {/* Answer */}
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.85 }}>
            Answer:{" "}
            <span style={{ fontWeight: 900, opacity: 1 }}>
              {isParts(answerParts) ? <PaperContent parts={answerParts} /> : <span>{question.answer ?? ""}</span>}
            </span>
          </div>

          {/* Meta */}
          <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.55 }}>{metaBits.join(" • ")}</div>
        </div>

        {/* Right gutter: Marks */}
        <div style={{ textAlign: "right", fontWeight: 800, fontSize: 12, opacity: 0.65, lineHeight: 1.2 }}>
          {marks ? `(${marks})` : null}
        </div>
      </div>
    </div>
  );
}