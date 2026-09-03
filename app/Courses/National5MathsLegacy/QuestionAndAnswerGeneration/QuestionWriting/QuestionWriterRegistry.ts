/**
 * Temporary Legacy compatibility entry point.
 *
 * Builder-facing National 5 imports still resolve through the historical
 * tsconfig alias into National5MathsLegacy. Forward that seam to the clean
 * compatibility entry point, which now re-exports the single canonical
 * 04_QuestionGeneration Registry with no skill-specific dispatch logic.
 */
export {
  buildGenerated,
  buildSkillLinks,
  conceptSelectionText,
  getAvailableDifficultiesForConcept,
  getConceptFromSelection,
  getEligibleDifficultiesForConcept,
  isDifficultyEligibleForConcept,
} from "../../../National5Maths/QuestionAndAnswerGeneration/QuestionWriting/QuestionWriterRegistry";
