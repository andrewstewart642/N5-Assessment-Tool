// app/create-assessment/builder/builder-logic/BuilderNotes.ts

export type BuilderNoteSeverity = "essential" | "advised" | "suggestion";

export type BuilderNote = {
  id: string;
  severity: BuilderNoteSeverity;
  message: string;
  source?: string;
  rank?: number;
};

export type BuilderNoteLimits = {
  essential: number;
  advised: number;
  suggestion: number;
};

export const DEFAULT_BUILDER_NOTE_LIMITS: BuilderNoteLimits = {
  essential: 2,
  advised: 3,
  suggestion: 2,
};

const SEVERITY_ORDER: Record<BuilderNoteSeverity, number> = {
  essential: 0,
  advised: 1,
  suggestion: 2,
};

export function toBuilderNote(
  note: string | BuilderNote,
  fallbackIndex = 0
): BuilderNote {
  if (typeof note !== "string") return note;

  return {
    id: `legacy-${fallbackIndex}`,
    severity: "suggestion",
    message: note,
    source: "legacy",
    rank: 0,
  };
}

export function sortBuilderNotes(notes: BuilderNote[]): BuilderNote[] {
  return [...notes].sort((a, b) => {
    const severityDiff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    if (severityDiff !== 0) return severityDiff;

    const rankA = a.rank ?? 0;
    const rankB = b.rank ?? 0;
    return rankB - rankA;
  });
}

export function limitBuilderNotes(
  notes: BuilderNote[],
  limits: BuilderNoteLimits = DEFAULT_BUILDER_NOTE_LIMITS
): BuilderNote[] {
  const grouped: Record<BuilderNoteSeverity, BuilderNote[]> = {
    essential: [],
    advised: [],
    suggestion: [],
  };

  for (const note of sortBuilderNotes(notes)) {
    grouped[note.severity].push(note);
  }

  return [
    ...grouped.essential.slice(0, limits.essential),
    ...grouped.advised.slice(0, limits.advised),
    ...grouped.suggestion.slice(0, limits.suggestion),
  ];
}