/**
 * Temporary Legacy compatibility entry point.
 *
 * Builder-facing National 5 imports still resolve through the historical
 * tsconfig alias into National5MathsLegacy. Forward that seam directly to the
 * single canonical 04_QuestionGeneration Registry; the clean workspace no
 * longer needs an intermediate QuestionAndAnswerGeneration namespace.
 */
export {
  buildGenerated,
  buildSkillLinks,
  conceptSelectionText,
  getAvailableDifficultiesForConcept,
  getConceptFromSelection,
  getEligibleDifficultiesForConcept,
  isDifficultyEligibleForConcept,
} from "../../../National5Maths/04_QuestionGeneration/Registry";
