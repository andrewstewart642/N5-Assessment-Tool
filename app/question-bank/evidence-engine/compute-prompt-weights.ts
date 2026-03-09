import { EvidenceRow, PromptStyleId } from "./evidence-types";

export type PromptWeight = { id: PromptStyleId; weight: number };

export function computePromptWeights(rows: EvidenceRow[], args: {
  level: EvidenceRow["level"];
  umbrella: EvidenceRow["umbrella"];
  skillCode2: string;
  conceptCode2?: string;
  minSamples?: number;
  fallback?: PromptWeight[];
}): PromptWeight[] {
  const { level, umbrella, skillCode2, conceptCode2, minSamples = 20, fallback } = args;

  const filtered = rows.filter(r =>
    r.level === level &&
    r.umbrella === umbrella &&
    r.skillCode2 === skillCode2 &&
    (!conceptCode2 || r.conceptCode2 === conceptCode2) &&
    !!r.promptStyle
  );

  if (filtered.length < minSamples) {
    return fallback ?? [
      { id: "B", weight: 90 },
      { id: "A", weight: 10 },
    ];
  }

  const counts: Record<PromptStyleId, number> = { A: 0, B: 0, C: 0 };
  for (const r of filtered) counts[r.promptStyle as PromptStyleId]++;

  return Object.entries(counts)
    .filter(([, c]) => c > 0)
    .map(([id, c]) => ({ id: id as PromptStyleId, weight: c }));
}