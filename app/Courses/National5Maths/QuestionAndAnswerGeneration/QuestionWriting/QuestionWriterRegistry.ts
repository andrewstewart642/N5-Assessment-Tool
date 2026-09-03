import type {
  DifficultyLevel,
  Skill,
} from "@/app/Assessments/AssessmentTypes";
import {
  isVariantEligibleForFilters,
  type QuestionSelectionFilters,
  type QuestionVariantSelectionMeta,
} from "@/app/Assessments/Questions/Selection/QuestionSelectionTypes";
import type {
  GeneratedQuestionData,
  GeneratorContext,
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";

import {
  buildGenerated as buildGeneratedClean,
  buildSkillLinks,
  conceptSelectionText,
  getAvailableDifficultiesForConcept as getAvailableDifficultiesClean,
  getConceptFromSelection,
  getEligibleDifficultiesForConcept as getEligibleDifficultiesClean,
  isDifficultyEligibleForConcept as isDifficultyEligibleClean,
} from "../../04_QuestionGeneration/Registry";
import {
  buildA7BuilderGenerated,
} from "../../04_QuestionGeneration/02-Algebraic/ALG-A7-LinearEquations/BuilderBridge";

export {
  buildSkillLinks,
  conceptSelectionText,
  getConceptFromSelection,
};

const A7_GENERAL_CONCEPT_ID = "alg-a7-linear-general";
const A7_FRACTIONAL_CONCEPT_ID = "alg-a7-fractional";
const A7_FORM_AND_SOLVE_CONCEPT_ID = "alg-a7-area-equality";

const isA7Skill = (skill: Skill) =>
  skill.id === "alg-a07-linear-equations";

const a7FractionalVariantProfiles = (): QuestionVariantSelectionMeta[] =>
  [1, 2].map((level) => ({
    level,
    templateId: `A7_LINEAR_EQUATIONS_V1:FRACTIONAL_COEFFICIENT:${level === 1 ? "LOWER_VALID" : "UPPER_VALID"}`,
    marks: {
      totalMarks: 3,
      cMarks: 0,
      aMarks: 3,
      reasoningMarks: 0,
    },
    standardProfile: "A" as const,
    paperSuitability: "BOTH",
    calculatorStatus: "CalculatorAllowed" as const,
  }));

const a7FormAndSolveVariantProfiles = (): QuestionVariantSelectionMeta[] => [
  {
    level: 2,
    templateId: "A7_LINEAR_EQUATIONS_V1:CONTEXT_AREA_EQUALITY:UPPER_VALID",
    marks: {
      totalMarks: 5,
      cMarks: 0,
      aMarks: 5,
      reasoningMarks: 5,
    },
    standardProfile: "A",
    paperSuitability: "P1",
    calculatorStatus: "CalculatorAllowed",
  },
];

const a7VariantProfiles = (
  skill: Skill,
  selectedConcept: string,
): QuestionVariantSelectionMeta[] => {
  const concept = getConceptFromSelection(skill, selectedConcept);

  if (concept?.id === A7_FRACTIONAL_CONCEPT_ID) {
    return a7FractionalVariantProfiles();
  }

  if (concept?.id === A7_FORM_AND_SOLVE_CONCEPT_ID) {
    return a7FormAndSolveVariantProfiles();
  }

  if (concept?.id === A7_GENERAL_CONCEPT_ID) {
    return [
      ...a7FractionalVariantProfiles(),
      ...a7FormAndSolveVariantProfiles(),
    ];
  }

  // A generic/restored A7 selection should behave like the parent selector,
  // rather than silently collapsing to only one of its child families.
  return [
    ...a7FractionalVariantProfiles(),
    ...a7FormAndSolveVariantProfiles(),
  ];
};

export function getAvailableDifficultiesForConcept(
  skill: Skill,
  selectedConcept: string,
): DifficultyLevel[] {
  if (!isA7Skill(skill)) {
    return getAvailableDifficultiesClean(skill, selectedConcept);
  }

  return [
    ...new Set(
      a7VariantProfiles(skill, selectedConcept)
        .map((profile) => profile.level)
        .filter((level): level is DifficultyLevel =>
          level >= 1 && level <= 5
        )
    ),
  ];
}

export function isDifficultyEligibleForConcept(
  skill: Skill,
  selectedConcept: string,
  difficulty: DifficultyLevel,
  selectionFilters?: QuestionSelectionFilters,
): boolean {
  if (!isA7Skill(skill)) {
    return isDifficultyEligibleClean(
      skill,
      selectedConcept,
      difficulty,
      selectionFilters,
    );
  }

  const profiles = a7VariantProfiles(skill, selectedConcept)
    .filter((profile) => profile.level === difficulty);

  if (profiles.length === 0) {
    return false;
  }

  if (!selectionFilters) {
    return true;
  }

  return profiles.some((profile) =>
    isVariantEligibleForFilters(profile, selectionFilters)
  );
}

export function getEligibleDifficultiesForConcept(
  skill: Skill,
  selectedConcept: string,
  selectionFilters?: QuestionSelectionFilters,
): DifficultyLevel[] {
  if (!isA7Skill(skill)) {
    return getEligibleDifficultiesClean(
      skill,
      selectedConcept,
      selectionFilters,
    );
  }

  return getAvailableDifficultiesForConcept(skill, selectedConcept)
    .filter((difficulty) =>
      isDifficultyEligibleForConcept(
        skill,
        selectedConcept,
        difficulty,
        selectionFilters,
      )
    );
}

/**
 * Compatibility entry point for the Builder while the old QuestionWriting
 * namespace is being retired. A7 is routed to the fully catalogued paired
 * question/answer generator; every other skill continues through the clean
 * registry unchanged.
 */
export function buildGenerated(
  skill: Skill,
  selectedConcept: string,
  difficulty: DifficultyLevel,
  selectionFilters?: QuestionSelectionFilters,
): GeneratedQuestionData {
  if (!isA7Skill(skill)) {
    return buildGeneratedClean(
      skill,
      selectedConcept,
      difficulty,
      selectionFilters,
    );
  }

  const context: GeneratorContext = {
    skill,
    concept: getConceptFromSelection(skill, selectedConcept),
    difficulty,
    selectedConceptText: selectedConcept,
    paper: selectionFilters?.targetPaper,
    selectionFilters,
  };

  return buildA7BuilderGenerated(context);
}
