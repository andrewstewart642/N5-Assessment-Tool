// app/question-bank/evidence-engine/compute-marks-weights.ts

import { EvidenceRow } from "./Evidence-Types";

export type MarksWeight = { marks: number; weight: number };

/**
 * Compute weighted marks distribution for a given skill (optionally concept).
 * Returns an array like: [{ marks: 2, weight: 60 }, { marks: 3, weight: 40 }]
 *
 * If there aren't enough samples, returns the provided fallback (or a sensible default).
 */
export function computeMarksWeights(
  rows: EvidenceRow[],
  args: {
    level: EvidenceRow["level"];
    umbrella: EvidenceRow["umbrella"];
    skillCode2: string;
    conceptCode2?: string;
    minSamples?: number;
    fallback?: MarksWeight[];
  }
): MarksWeight[] {
  const {
    level,
    umbrella,
    skillCode2,
    conceptCode2,
    minSamples = 20,
    fallback,
  } = args;

  const filtered = rows.filter((r) => {
    const matchesCore =
      r.level === level &&
      r.umbrella === umbrella &&
      r.skillCode2 === skillCode2;

    const matchesConcept = !conceptCode2 || r.conceptCode2 === conceptCode2;

    const hasMarks = typeof r.marks === "number";

    return matchesCore && matchesConcept && hasMarks;
  });

  if (filtered.length < minSamples) {
    return (
      fallback ?? [
        { marks: 2, weight: 60 },
        { marks: 3, weight: 40 },
      ]
    );
  }

  const counts = new Map<number, number>();
  for (const r of filtered) {
    const m = r.marks as number;
    counts.set(m, (counts.get(m) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => a[0] - b[0]) // stable ordering by marks
    .map(([marks, count]) => ({ marks, weight: count }));
}