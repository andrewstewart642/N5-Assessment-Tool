import type {
  Concept,
  Skill,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/shared-types/AssessmentTypes";

export function conceptMatchesStandardFilter(
  concept: Concept,
  filter: StandardFilter
): boolean {
  if (filter === "C+A") {
    return true;
  }

  if (concept.standard === "C+A") {
    return true;
  }

  return concept.standard === filter;
}

export function conceptMatchesThinkingTypeFilter(
  concept: Concept,
  filter: ThinkingTypeFilter
): boolean {
  if (filter === "ANY") {
    return true;
  }

  const thinkingType =
    concept.metadata?.thinkingType;

  if (!thinkingType) {
    return true;
  }

  if (filter === "OPERATIONAL") {
    return (
      thinkingType === "operational" ||
      thinkingType === "mixed"
    );
  }

  return (
    thinkingType === "reasoning" ||
    thinkingType === "mixed"
  );
}

export function getFilteredConcepts(
  skill: Skill,
  filter: StandardFilter
): Concept[] {
  const filtered =
    skill.concepts.filter(
      (concept) =>
        conceptMatchesStandardFilter(
          concept,
          filter
        )
    );

  if (filtered.length > 0) {
    return filtered;
  }

  return [
    {
      label:
        "No concepts match this filter",

      standard:
        "C+A",
    },
  ] as Concept[];
}

export function rankConceptsByTargetMarks(
  concepts: Concept[],
  targetMarks: number
): Concept[] {
  const indexedConcepts =
    concepts.map(
      (concept, index) => ({
        concept,
        index,
      })
    );

  indexedConcepts.sort(
    (first, second) => {
      const firstMarks =
        first.concept.marks ??
        Number.POSITIVE_INFINITY;

      const secondMarks =
        second.concept.marks ??
        Number.POSITIVE_INFINITY;

      const firstDifference =
        Math.abs(
          firstMarks -
            targetMarks
        );

      const secondDifference =
        Math.abs(
          secondMarks -
            targetMarks
        );

      if (
        firstDifference !==
        secondDifference
      ) {
        return (
          firstDifference -
          secondDifference
        );
      }

      return (
        first.index -
        second.index
      );
    }
  );

  return indexedConcepts.map(
    ({ concept }) =>
      concept
  );
}