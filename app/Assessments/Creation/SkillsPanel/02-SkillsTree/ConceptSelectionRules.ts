import {
  getAvailableDifficultiesForConcept,
  getEligibleDifficultiesForConcept,
} from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/QuestionWriterRegistry";

import {
  formatAssessmentPaperSuitability,
  isAssessmentPaperSuitable,
} from "@/app/Assessments/Creation/Papers/AssessmentPaperRules";

import {
  conceptMatchesThinkingTypeFilter,
} from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/ConceptSelection";

import type {
  Concept,
  DifficultyLevel,
  Paper,
  Skill,
  SkillPaperSuitability,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/app/Assessments/AssessmentTypes";

import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";

import type { QuestionSelectionFilters } from "@/app/Assessments/Questions/Selection/QuestionSelectionTypes";

import type {
  ConstraintPillId,
} from "../01-SkillsFilters/SkillsFilters";

export type ConceptRestriction = {
  tag: string;
  constraint: ConstraintPillId;
};

function textPart(
  value: string
): PaperPart {
  return {
    kind: "text",
    value,
  };
}

function mathPart(
  latex: string
): PaperPart {
  return {
    kind: "math",
    latex,
  };
}

export function conceptSelectionText(
  concept: Concept
): string {
  const short =
    concept.shortLabel?.trim();

  if (short) {
    return `${concept.code} ${short}`;
  }

  return concept.label.trim();
}

export function conceptInlineParts(
  concept: Concept
): PaperPart[] {
  const short =
    concept.shortLabel?.trim();

  const fallbackLabel =
    concept.label
      .replace(
        new RegExp(
          `^${concept.code}\\s*`
        ),
        ""
      )
      .trim();

  const labelText =
    short ||
    fallbackLabel ||
    concept.label;

  const parts: PaperPart[] = [
    textPart(
      `${concept.code}\u2003${labelText}`
    ),
  ];

  if (
    concept.badge?.trim()
  ) {
    parts.push(
      textPart(" · ")
    );

    parts.push(
      mathPart(
        concept.badge.trim()
      )
    );
  }

  return parts;
}

export function getOrderedDifficultyLevels(
  availableLevels:
    DifficultyLevel[]
): DifficultyLevel[] {
  return [
    ...availableLevels,
  ].sort(
    (first, second) =>
      first - second
  );
}

export function canStepDifficulty(
  availableLevels:
    DifficultyLevel[],
  current:
    DifficultyLevel,
  direction:
    "prev" | "next"
): boolean {
  const orderedLevels =
    getOrderedDifficultyLevels(
      availableLevels
    );

  if (
    orderedLevels.length <= 1
  ) {
    return false;
  }

  const currentIndex =
    orderedLevels.indexOf(
      current
    );

  if (
    currentIndex === -1
  ) {
    return true;
  }

  if (
    direction === "prev"
  ) {
    return currentIndex > 0;
  }

  return (
    currentIndex <
    orderedLevels.length - 1
  );
}

export function stepDifficulty(
  availableLevels:
    DifficultyLevel[],
  current:
    DifficultyLevel,
  direction:
    "prev" | "next"
): DifficultyLevel {
  const orderedLevels =
    getOrderedDifficultyLevels(
      availableLevels
    );

  if (
    orderedLevels.length === 0
  ) {
    return current;
  }

  const currentIndex =
    orderedLevels.indexOf(
      current
    );

  const safeIndex =
    currentIndex === -1
      ? 0
      : currentIndex;

  if (
    direction === "prev"
  ) {
    return orderedLevels[
      Math.max(
        0,
        safeIndex - 1
      )
    ];
  }

  return orderedLevels[
    Math.min(
      orderedLevels.length - 1,
      safeIndex + 1
    )
  ];
}

export function getPaperSuitabilityForConcept(
  skill: Skill,
  concept: Concept
): SkillPaperSuitability {
  return (
    concept.metadata
      ?.paperSuitability ??
    skill.paperSuitability
  );
}

function conceptMatchesPaper(
  skill: Skill,
  concept: Concept,
  targetPaper: Paper
): boolean {
  const suitability =
    getPaperSuitabilityForConcept(
      skill,
      concept
    );

  return isAssessmentPaperSuitable({
    paper: targetPaper,
    paperSuitability:
      suitability,
  });
}

function formatPaperSuitabilityOnlyText(
  suitability:
    SkillPaperSuitability
): string {
  if (
    suitability === "BOTH"
  ) {
    return "both papers";
  }

  return `${formatAssessmentPaperSuitability(
    suitability
  )} only`;
}

function conceptMatchesStandardFilter(
  concept: Concept,
  standardFilter:
    StandardFilter
): boolean {
  if (
    standardFilter === "C+A"
  ) {
    return true;
  }

  if (
    concept.standard === "C+A"
  ) {
    return true;
  }

  return (
    concept.standard ===
    standardFilter
  );
}

function buildStandardMismatchTag(
  concept: Concept
): string {
  if (
    concept.standard === "C"
  ) {
    return "C-standard only";
  }

  if (
    concept.standard === "A"
  ) {
    return "A-standard only";
  }

  if (
    concept.standard === "C+A"
  ) {
    return "A+C-standard";
  }

  return "Wrong standard";
}

function buildTargetMarksMismatchTag(
  concept: Concept
): string {
  if (
    typeof concept.marks ===
      "number" &&
    Number.isFinite(
      concept.marks
    )
  ) {
    return `${concept.marks} marks only`;
  }

  return "Wrong mark target";
}

function buildThinkingTypeMismatchMessage(
  filter:
    ThinkingTypeFilter
): string {
  if (
    filter === "REASONING"
  ) {
    return "Operational only — choose Any or Operational.";
  }

  if (
    filter === "OPERATIONAL"
  ) {
    return "Reasoning only — choose Any or Reasoning.";
  }

  return "This concept does not match the current thinking type.";
}

function buildPaperMismatchMessage(
  suitability:
    SkillPaperSuitability
): string {
  return `${formatPaperSuitabilityOnlyText(
    suitability
  )} — switch paper.`;
}

export function getConceptRestriction({
  skill,
  concept,
  standardFilter,
  thinkingTypeFilter,
  selectionFilters,
}: {
  skill: Skill;

  concept: Concept;

  standardFilter:
    StandardFilter;

  thinkingTypeFilter:
    ThinkingTypeFilter;

  targetMarks: number;

  selectionFilters:
    QuestionSelectionFilters;
}): ConceptRestriction | null {
  if (
    !conceptMatchesStandardFilter(
      concept,
      standardFilter
    )
  ) {
    return {
      tag:
        buildStandardMismatchTag(
          concept
        ),

      constraint:
        "standard",
    };
  }

  const suitability =
    getPaperSuitabilityForConcept(
      skill,
      concept
    );

  if (
    !conceptMatchesPaper(
      skill,
      concept,
      selectionFilters.targetPaper
    )
  ) {
    return {
      tag:
        formatPaperSuitabilityOnlyText(
          suitability
        ),

      constraint:
        "paper",
    };
  }

  if (
    !conceptMatchesThinkingTypeFilter(
      concept,
      thinkingTypeFilter
    )
  ) {
    return {
      tag:
        thinkingTypeFilter ===
        "REASONING"
          ? "Operational only"
          : "Reasoning only",

      constraint:
        "thinkingType",
    };
  }

  const conceptText =
    conceptSelectionText(
      concept
    );

  const eligibleLevels =
    getEligibleDifficultiesForConcept(
      skill,
      conceptText,
      selectionFilters
    );

  if (
    eligibleLevels.length === 0
  ) {
    return {
      tag:
        buildTargetMarksMismatchTag(
          concept
        ),

      constraint:
        "targetMarks",
    };
  }

  return null;
}

export function buildPrimaryBlockReason({
  selected,
  skill,
  standardFilter,
  targetMarks,
  selectionFilters,
  thinkingTypeFilter,
  currentDifficulty,
  availableLevels,
  currentDifficultyIsEligible,
}: {
  selected:
    Concept | undefined;

  skill: Skill;

  standardFilter:
    StandardFilter;

  targetMarks: number;

  selectionFilters:
    QuestionSelectionFilters;

  thinkingTypeFilter:
    ThinkingTypeFilter;

  currentDifficulty:
    DifficultyLevel;

  availableLevels:
    DifficultyLevel[];

  currentDifficultyIsEligible:
    boolean;
}): string {
  if (!selected) {
    return "Select a concept first.";
  }

  const restriction =
    getConceptRestriction({
      skill,
      concept: selected,

      standardFilter,
      thinkingTypeFilter,

      targetMarks,
      selectionFilters,
    });

  if (
    restriction?.constraint ===
    "standard"
  ) {
    return `${restriction.tag} — change Standard.`;
  }

  if (
    restriction?.constraint ===
    "paper"
  ) {
    return buildPaperMismatchMessage(
      getPaperSuitabilityForConcept(
        skill,
        selected
      )
    );
  }

  if (
    restriction?.constraint ===
    "thinkingType"
  ) {
    return buildThinkingTypeMismatchMessage(
      thinkingTypeFilter
    );
  }

  if (
    restriction?.constraint ===
    "targetMarks"
  ) {
    return `${restriction.tag} — change Target marks.`;
  }

  if (
    availableLevels.length === 0
  ) {
    return "No selectable difficulty for this concept.";
  }

  if (
    !availableLevels.includes(
      currentDifficulty
    )
  ) {
    return "This difficulty is not available for this concept.";
  }

  if (
    !currentDifficultyIsEligible
  ) {
    return "This difficulty does not match the current marks filter.";
  }

  return "This concept is not available under the current filters.";
}

export function getAvailableConceptDifficulties(
  skill: Skill,
  conceptText: string
): DifficultyLevel[] {
  return getAvailableDifficultiesForConcept(
    skill,
    conceptText
  );
}

export function getEligibleConceptDifficulties(
  skill: Skill,
  conceptText: string,
  selectionFilters:
    QuestionSelectionFilters
): DifficultyLevel[] {
  return getEligibleDifficultiesForConcept(
    skill,
    conceptText,
    selectionFilters
  );
}