import type { DifficultyLevel, Paper, Question } from "@/shared-types/assessmentTypes";
import { getSpacingBasePx } from "@/app/paper-layout/n5-question-spacing-px";

export type DraftByPaper = Record<Paper, Question | null>;

export type EditDraftByPaper = Record<
  Paper,
  | null
  | {
      questionIndex: number;
      original: Question;
      draft: Question;
    }
>;

export type PreviewPage =
  | {
      kind: "cover";
      pageNumber: number;
    }
  | {
      kind: "formula";
      pageNumber: number;
    }
  | {
      kind: "questions";
      pageNumber: number;
      questionPageIndex: number;
      questionStartIndex: number;
      pageQuestions: Question[];
    }
  | {
      kind: "empty";
      pageNumber: number;
    };

export function estimateMinutes(paper: Paper, marks: number) {
  const minsPerMark = paper === "P1" ? 1.5 : 1.8;
  return Math.max(0, Math.round(marks * minsPerMark));
}

export function sumMarks(list: Question[]) {
  return list.reduce((acc, q) => {
    const m =
      typeof q.marks === "number"
        ? q.marks
        : typeof (q as any).targetMarks === "number"
          ? (q as any).targetMarks
          : 0;
    return acc + (Number.isFinite(m) ? m : 0);
  }, 0);
}

export function sumActualQuestionMarks(list: Question[]) {
  return list.reduce((acc, q) => {
    const m = typeof q.marks === "number" ? q.marks : 0;
    return acc + (Number.isFinite(m) ? m : 0);
  }, 0);
}

export function spacingBasePxFor(q: Question): number {
  if (
    typeof (q as any).spacingBasePx === "number" &&
    Number.isFinite((q as any).spacingBasePx)
  ) {
    return (q as any).spacingBasePx;
  }

  const code = (q as any).questionCode as string | undefined;
  if (!code) return 48;

  return getSpacingBasePx(code);
}

export const pxPerMm = 96 / 25.4;
export const A4_W_PX = Math.round(210 * pxPerMm);

export function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function isDifficultyLevel(value: number): value is DifficultyLevel {
  return value >= 1 && value <= 5;
}