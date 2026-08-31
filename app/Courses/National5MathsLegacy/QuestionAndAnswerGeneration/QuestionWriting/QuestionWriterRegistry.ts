/**
 * Temporary Legacy compatibility entry point.
 *
 * Builder-facing National 5 question dispatch is now owned by the clean
 * National5Maths generation registry. Existing imports which still resolve
 * through the historical tsconfig alias are forwarded here until that alias
 * can be retired safely in a later repo-wide migration.
 */
export {
  buildGenerated,
  buildSkillLinks,
  conceptSelectionText,
  getAvailableDifficultiesForConcept,
  getConceptFromSelection,
  getEligibleDifficultiesForConcept,
  isDifficultyEligibleForConcept,
} from "../../../National5Maths/03_QuestionGeneration/Registry";
