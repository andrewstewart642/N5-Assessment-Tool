/**
 * Transitional compatibility entry point.
 *
 * Builder-facing imports still reach this historical namespace through the
 * National5MathsLegacy tsconfig alias. All actual dispatch now belongs to the
 * canonical 04_QuestionGeneration Registry; there are no per-skill exceptions
 * in this compatibility layer.
 */
export {
  buildGenerated,
  buildSkillLinks,
  conceptSelectionText,
  getAvailableDifficultiesForConcept,
  getConceptFromSelection,
  getEligibleDifficultiesForConcept,
  isDifficultyEligibleForConcept,
} from "../../04_QuestionGeneration/Registry";
