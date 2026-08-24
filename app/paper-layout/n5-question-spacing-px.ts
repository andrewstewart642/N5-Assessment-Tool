/**
 * Central baseline spacing rules (A4 baseline) keyed by questionCode.
 *
 * These values represent the working space placed beneath a question
 * in the assessment-paper layout.
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
   */
  NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE: 320,

  NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE: 360,

  NUM_REVERSE_PERCENTAGE_INCREASE_GIVEN_FINAL_VALUE: 340,

  NUM_REVERSE_PERCENTAGE_INCREASE_FIND_DIFFERENCE: 400,

  /*
   * Fractions
   *
   * Two-mark Paper 1 numerical-fluency questions.
   *
   * Values are based on the measured working space in the
   * catalogued SQA source questions.
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