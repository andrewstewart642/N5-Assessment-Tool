import type {
  DifficultyLevel,
  Skill,
} from "@/app/Assessments/AssessmentTypes";
import type {
  QuestionSelectionFilters,
} from "@/app/Assessments/Questions/Selection/QuestionSelectionTypes";
import type {
  GeneratedQuestionData,
  GeneratorContext,
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";

import {
  buildGenerated as buildGeneratedClean,
  getConceptFromSelection,
} from "../../03_QuestionGeneration/Registry";
import {
  buildA7BuilderGenerated,
} from "../../03_QuestionGeneration/02-Algebraic/ALG-A7-LinearEquations/BuilderBridge";

export {
  buildSkillLinks,
  conceptSelectionText,
  getAvailableDifficultiesForConcept,
  getConceptFromSelection,
  getEligibleDifficultiesForConcept,
  isDifficultyEligibleForConcept,
} from "../../03_QuestionGeneration/Registry";

/**
 * Compatibility entry point for the Builder while the old QuestionWriting
 * namespace is being retired. A7 is now routed to the fully catalogued V3
 * generator/answer pair; every other skill continues through the clean registry.
 */
export function buildGenerated(
  skill: Skill,
  selectedConcept: string,
  difficulty: DifficultyLevel,
  selectionFilters?: QuestionSelectionFilters,
): GeneratedQuestionData {
  if (skill.id !== "alg-a07-linear-equations") {
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
