/**
 * Central baseline spacing rules (A4 baseline) keyed by questionCode.
 * Keep it simple + tweakable.
 */
export const N5_QUESTION_SPACING_BASE_PX: Record<string, number> = {
  NQ_N5_NUM_N01_C01_SimplifySurds_CollectLikeTerms: 110,
  NQ_N5_NUM_N01_C02_SimplifySurds_CollectMultipleTerms: 50,
  NQ_N5_NUM_N01_C03_SimplifySurds_ExpandAndSimplify: 70,
};

export function getSpacingBasePx(questionCode?: string): number {
  if (!questionCode) return 40;
  return N5_QUESTION_SPACING_BASE_PX[questionCode] ?? 40;
}