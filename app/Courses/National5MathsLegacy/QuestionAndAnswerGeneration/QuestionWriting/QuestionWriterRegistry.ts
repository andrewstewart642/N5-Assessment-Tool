/**
 * Temporary Legacy compatibility entry point.
 *
 * Builder-facing National 5 imports still resolve through the historical
 * tsconfig alias into National5MathsLegacy. Forward that seam to the clean
 * compatibility registry rather than directly to 03_QuestionGeneration.
 *
 * This matters for migrated skills such as A7: the compatibility registry owns
 * the skill-specific Builder bridge while all unaffected skills continue on to
 * the clean registry unchanged.
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
