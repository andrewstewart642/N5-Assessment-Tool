/**
 * Central baseline spacing rules (A4 baseline) keyed by questionCode.
 *
 * These values represent the working space placed beneath a question
 * in the assessment-paper layout.
 *
 * Source-question measurements are recorded from 300 dpi SQA renders.
 * Builder values here are the equivalent CSS-pixel working-space
 * baselines at approximately 96 dpi.
 */
export const N5_QUESTION_SPACING_BASE_PX: Record<string, number> = {
  /*
   * Surds
   */
  NQ_N5_NUM_N01_C01_SimplifySurds_CollectLikeTerms: 110,

  NQ_N5_NUM_N01_C02_SimplifySurds_CollectMultipleTerms: 50,

  NQ_N5_NUM_N01_C03_SimplifySurds_ExpandAndSimplify: 70,


  /*
   * Reverse percentages
   *
   * Three-mark contextual problems.
   *
   * These retain their existing working-space
   * baselines pending any later whole-course
   * spacing normalisation.
   */
  NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE: 320,

  NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE: 360,

  NUM_REVERSE_PERCENTAGE_INCREASE_GIVEN_FINAL_VALUE: 340,

  NUM_REVERSE_PERCENTAGE_INCREASE_FIND_DIFFERENCE: 400,


  /*
   * Compound percentages
   *
   * Three-mark Paper 2 calculator questions.
   *
   * These values are derived from the exact
   * response-space measurements in the hardened
   * SQA source-question catalogue.
   *
   * FIXED-RATE INCREASE
   * Historical source working spaces cluster
   * around approximately 305–491 CSS px,
   * with a central value just under 400 px.
   *
   * FIXED-RATE DECREASE
   * Most historical examples cluster around
   * approximately 249–340 CSS px. The unusually
   * large 2018 response area is treated as a
   * page-layout outlier rather than the baseline.
   *
   * MULTI-RATE DECREASE
   * The confirmed 2023 source example provides
   * approximately 302 CSS px of response space.
   */
  NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE: 395,

  NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE: 320,

  NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE: 305,


  /*
   * Fractions
   *
   * Two-mark Paper 1 numerical-fluency questions.
   *
   * Values are based on the measured working space
   * in the catalogued SQA source questions.
   */

  // Mixed number with a proper fraction.
  // Historical median working space is approximately 100 mm.
  NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION: 380,

  // Mixed number with another mixed number.
  // Historical median working space is approximately 100 mm.
  NUM_FRACTIONS_MIXED_NUMBER_WITH_MIXED_NUMBER: 380,

  // Fraction multiplied by a bracketed fraction sum.
  // Historical mean/median evidence is approximately 88 mm.
  NUM_FRACTIONS_BRACKETED_SUM_WITH_FRACTION_MULTIPLIER: 335,
};


export function getSpacingBasePx(
  questionCode?: string
): number {
  if (!questionCode) {
    return 40;
  }

  return (
    N5_QUESTION_SPACING_BASE_PX[
      questionCode
    ] ?? 40
  );
}