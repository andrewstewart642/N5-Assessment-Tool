/**
 * Preservation bridge for the existing N5 fractions generator.
 *
 * The legacy fraction generator and worked-answer writer are deliberately kept
 * as the authoritative implementation because their current behaviour and
 * question feel are already trusted. The clean architecture owns the route
 * into the Builder; it does not rewrite the generator.
 *
 * When this skill is eventually migrated away from Legacy, preserve output
 * parity first and only improve the generator in a separate, explicit pass.
 */
export {
  FractionsConceptModule,
  default,
} from "../../../../National5MathsLegacy/QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/Numerical/NQ_N5_NUM_N05_1_Fractions";
