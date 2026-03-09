import type { Question } from "@/shared-types/assessmentTypes";
import type { PageSizeConfig } from "@/app/paper-layout/page-sizes";
import { getSpacingBasePx } from "@/app/paper-layout/n5-question-spacing-px";

/**
 * Fallback heuristic ONLY (used when measured height isn't available yet).
 * Keep this simple; measured heights will do the real work.
 */
function estimateQuestionHeightBasePx(q: Question): number {
  const promptLen = (q.prompt ?? "").length;
  const answerLen = (q.answer ?? "").length;

  const promptLines = Math.max(1, Math.ceil(promptLen / 70));
  const answerLines = answerLen ? Math.max(1, Math.ceil(answerLen / 80)) : 0;

  const header = 34; // number + marks row etc.
  const promptBlock = 20 + promptLines * 18;
  const answerBlock = answerLines ? 18 + answerLines * 16 : 0;
  const meta = 14;

  return header + promptBlock + answerBlock + meta;
}

function getMeasuredHeightBasePx(q: Question): number | null {
  const h = (q as any).measuredHeightBasePx;
  if (typeof h === "number" && Number.isFinite(h) && h > 0) return h;
  return null;
}

/**
 * This is the WORKSPACE requirement (A4 baseline px).
 * We keep the name "gap" in code for now, but logically it's workspace.
 */
function getWorkspaceBasePx(q: Question): number {
  if (typeof q.spacingBasePx === "number" && Number.isFinite(q.spacingBasePx) && q.spacingBasePx >= 0) {
    return q.spacingBasePx;
  }

  const code = (q as any).questionCode as string | undefined;
  if (!code) return 48; // safe default workspace if missing metadata

  return getSpacingBasePx(code);
}

/**
 * Pagination rule:
 * Treat each question as an ATOMIC BLOCK:
 *   blockHeight = contentHeight + workspaceHeight
 *
 * A question block is never split across pages.
 * If it doesn't fit in the remaining space, it moves to the next page.
 *
 * Edge case:
 * If a single block is taller than an entire page, we still place it
 * (it will overflow visually), but we do NOT crash or infinite-loop.
 */
export function paginateQuestions(questions: Question[], page: PageSizeConfig): Question[][] {
  const pages: Question[][] = [];
  let current: Question[] = [];
  let usedPx = 0;

  // Optional safety buffer to reduce "barely fits" issues due to rounding/print margins.
  // Keep this small; you can tune later if needed.
  const SAFETY_PX = 2;

  for (const q of questions) {
    const measuredBase = getMeasuredHeightBasePx(q);
    const baseContent = measuredBase ?? estimateQuestionHeightBasePx(q);
    const baseWorkspace = getWorkspaceBasePx(q);

    // Scale for A3/A5 etc (A4 baseline = 1.0)
    // Important: scale first, then sum, then round ONCE to avoid rounding drift.
    const scaledContent = baseContent * page.scale;
    const scaledWorkspace = baseWorkspace * page.scale;

    const blockPx = Math.max(0, Math.round(scaledContent + scaledWorkspace));

    // If this block won't fit on the current page, start a new page first.
    // This enforces the "workspace never cut by a page break" rule.
    if (current.length > 0 && usedPx + blockPx + SAFETY_PX > page.contentHeightPx) {
      pages.push(current);
      current = [];
      usedPx = 0;
    }

    // Place the question (even if it overflows a fresh page).
    current.push(q);
    usedPx += blockPx;
  }

  if (current.length) pages.push(current);

  return pages;
}