export type AssessmentQualityNoteSeverity =
  | "essential"
  | "advised"
  | "suggestion";

export type AssessmentQualityNote = {
  id: string;

  severity:
    AssessmentQualityNoteSeverity;

  message:
    string;

  source?:
    string;

  rank?:
    number;
};

export type AssessmentQualityNoteLimits = {
  essential: number;
  advised: number;
  suggestion: number;
};

export const DEFAULT_ASSESSMENT_QUALITY_NOTE_LIMITS: AssessmentQualityNoteLimits =
  {
    essential: 2,
    advised: 3,
    suggestion: 2,
  };

const SEVERITY_ORDER: Record<
  AssessmentQualityNoteSeverity,
  number
> = {
  essential: 0,
  advised: 1,
  suggestion: 2,
};

export function toAssessmentQualityNote(
  note:
    | string
    | AssessmentQualityNote,

  fallbackIndex = 0
): AssessmentQualityNote {
  if (
    typeof note !==
    "string"
  ) {
    return note;
  }

  return {
    id:
      `legacy-${fallbackIndex}`,

    severity:
      "suggestion",

    message:
      note,

    source:
      "legacy",

    rank:
      0,
  };
}

export function sortAssessmentQualityNotes(
  notes:
    AssessmentQualityNote[]
): AssessmentQualityNote[] {
  return [
    ...notes,
  ].sort(
    (
      first,
      second
    ) => {
      const severityDifference =
        SEVERITY_ORDER[
          first.severity
        ] -
        SEVERITY_ORDER[
          second.severity
        ];

      if (
        severityDifference !==
        0
      ) {
        return severityDifference;
      }

      const firstRank =
        first.rank ??
        0;

      const secondRank =
        second.rank ??
        0;

      return (
        secondRank -
        firstRank
      );
    }
  );
}

export function limitAssessmentQualityNotes(
  notes:
    AssessmentQualityNote[],

  limits:
    AssessmentQualityNoteLimits =
      DEFAULT_ASSESSMENT_QUALITY_NOTE_LIMITS
): AssessmentQualityNote[] {
  const grouped: Record<
    AssessmentQualityNoteSeverity,
    AssessmentQualityNote[]
  > = {
    essential: [],
    advised: [],
    suggestion: [],
  };

  for (
    const note of
    sortAssessmentQualityNotes(
      notes
    )
  ) {
    grouped[
      note.severity
    ].push(
      note
    );
  }

  return [
    ...grouped.essential.slice(
      0,
      limits.essential
    ),

    ...grouped.advised.slice(
      0,
      limits.advised
    ),

    ...grouped.suggestion.slice(
      0,
      limits.suggestion
    ),
  ];
}