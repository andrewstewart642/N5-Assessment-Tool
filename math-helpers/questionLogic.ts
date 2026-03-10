// math-helpers/questionLogic.ts
// Reusable logic helpers shared across components.

import type { Concept, DifficultyLevel, Skill, StandardFilter } from "@/shared-types/AssessmentTypes";

export function conceptMatchesFilter(concept: Concept, filter: StandardFilter) {
  if (filter === "C+A") return true;
  if (concept.standard === "C+A") return true;
  return concept.standard === filter;
}

export function getFilteredConcepts(skill: Skill, filter: StandardFilter): Concept[] {
  const filtered = skill.concepts.filter((c) => conceptMatchesFilter(c, filter));
  return filtered.length ? filtered : [{ label: "No concepts match this filter", standard: "C+A" }];
}

/**
 * Prioritise concepts that match targetMarks, but NEVER remove concepts.
 * Sorting rule:
 *  1) Closest marks to target first (exact match first)
 *  2) Concepts with no marks metadata go to the end
 *  3) Stable tie-break (original order)
 */
export function rankConceptsByTargetMarks(concepts: Concept[], targetMarks: number): Concept[] {
  const withIndex = concepts.map((c, i) => ({ c, i }));

  withIndex.sort((a, b) => {
    const aMarks = a.c.marks ?? Number.POSITIVE_INFINITY;
    const bMarks = b.c.marks ?? Number.POSITIVE_INFINITY;

    const aDiff = Math.abs(aMarks - targetMarks);
    const bDiff = Math.abs(bMarks - targetMarks);

    if (aDiff !== bDiff) return aDiff - bDiff;

    return a.i - b.i;
  });

  return withIndex.map((x) => x.c);
}

/**
 * Hard-stop cycling:
 * - does NOT loop
 * - clamps at [0, total-1]
 */
export function cycleIndex(currentIndex: number, total: number, direction: "prev" | "next") {
  if (total <= 1) return 0;

  const safe = Math.max(0, Math.min(currentIndex, total - 1));

  if (direction === "next") return Math.min(safe + 1, total - 1);
  return Math.max(safe - 1, 0);
}

export const DIFFICULTY_OPTIONS: DifficultyLevel[] = [1, 2, 3, 4, 5];

/**
 * Hard-stop difficulty:
 * - 1 stays at 1 when you go "up"
 * - 5 stays at 5 when you go "down"
 * (No ferris-wheel wraparound)
 */
export function cycleDifficulty(current: DifficultyLevel, direction: "prev" | "next"): DifficultyLevel {
  const idx = DIFFICULTY_OPTIONS.indexOf(current);
  const safe = idx === -1 ? 0 : idx;

  if (direction === "next") {
    return DIFFICULTY_OPTIONS[Math.min(safe + 1, DIFFICULTY_OPTIONS.length - 1)];
  }

  return DIFFICULTY_OPTIONS[Math.max(safe - 1, 0)];
}

export function makeId() {
  // Avoid crypto.randomUUID compatibility issues in some environments
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}