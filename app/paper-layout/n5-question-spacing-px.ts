/**
 * Central baseline spacing rules (A4 baseline) keyed by questionCode.
 *
 * These values represent the working space placed beneath a question
 * in the assessment-paper layout.
 */
export const N5_QUESTION_SPACING_BASE_PX: Record<string, number> = {
  NQ_N5_NUM_N01_C01_SimplifySurds_CollectLikeTerms: 110,

  NQ_N5_NUM_N01_C02_SimplifySurds_CollectMultipleTerms: 50,

  NQ_N5_NUM_N01_C03_SimplifySurds_ExpandAndSimplify: 70,

  /*
   * Reverse percentages
   *
   * These are three-mark contextual problems and need substantially
   * more working space than the default 40px used by short questions.
   *
   * The relative sizes follow the answer-space evidence collected
   * from the source-question catalogue.
   */

  NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE: 320,

  NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE: 360,

  NUM_REVERSE_PERCENTAGE_INCREASE_GIVEN_FINAL_VALUE: 340,

  NUM_REVERSE_PERCENTAGE_INCREASE_FIND_DIFFERENCE: 400,
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