/**
 * National 5 Mathematics assessment-paper working-space baselines.
 *
 * Values are expressed as CSS pixels at the A4 baseline.
 *
 * Source-question measurements originate from 300 dpi SQA renders
 * and are converted to the approximate 96 dpi CSS-pixel baseline used
 * by the assessment document layout.
 */
export const NATIONAL5_MATHS_QUESTION_SPACING_BASE_PX: Record<
  string,
  number
> = {
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

/*
 * A8 simultaneous equations
 *
 * The clean A8 generator currently uses a unique instance id as questionCode:
 *   A8-P1-L2-ABSTRACT_SOLVE-...
 *   A8-P2-L2-CONTEXT_FORM_AND_SOLVE-...
 *
 * That means a simple exact-key lookup would fall back to the generic 40 px
 * workspace and collapse six-mark questions on top of the next question.
 * Resolve the A8 family from the stable part of the instance id instead.
 *
 * The contextual baseline is anchored to the catalogued 2014 P2 source,
 * whose three response regions total about 160 mm (roughly 605 CSS px).
 * The other values preserve the same evidence-led scale while allowing for
 * the smaller three-mark algebraic/graph families.
 */
const A8_ABSTRACT_SOLVE_SPACING_BASE_PX = 420;
const A8_CONTEXT_FORM_AND_SOLVE_SPACING_BASE_PX = 605;
const A8_GRAPH_INTERSECTION_SOLVE_SPACING_BASE_PX = 360;
const A8_CONTEXT_DERIVED_TOTAL_SPACING_BASE_PX = 605;

function getA8QuestionSpacingBasePx(
  questionCode: string
): number | null {
  if (!questionCode.startsWith("A8-")) {
    return null;
  }

  if (
    questionCode.includes(
      "-CONTEXT_DERIVED_TOTAL-"
    )
  ) {
    return A8_CONTEXT_DERIVED_TOTAL_SPACING_BASE_PX;
  }

  if (
    questionCode.includes(
      "-CONTEXT_FORM_AND_SOLVE-"
    )
  ) {
    return A8_CONTEXT_FORM_AND_SOLVE_SPACING_BASE_PX;
  }

  if (
    questionCode.includes(
      "-GRAPH_INTERSECTION_SOLVE-"
    )
  ) {
    return A8_GRAPH_INTERSECTION_SOLVE_SPACING_BASE_PX;
  }

  if (
    questionCode.includes(
      "-ABSTRACT_SOLVE-"
    )
  ) {
    return A8_ABSTRACT_SOLVE_SPACING_BASE_PX;
  }

  return null;
}

const DEFAULT_NATIONAL5_MATHS_QUESTION_SPACING_BASE_PX = 40;

export function getNational5MathsQuestionSpacingBasePx(
  questionCode?: string
): number {
  if (!questionCode) {
    return DEFAULT_NATIONAL5_MATHS_QUESTION_SPACING_BASE_PX;
  }

  const a8Spacing =
    getA8QuestionSpacingBasePx(
      questionCode
    );

  if (a8Spacing !== null) {
    return a8Spacing;
  }

  return (
    NATIONAL5_MATHS_QUESTION_SPACING_BASE_PX[questionCode] ??
    DEFAULT_NATIONAL5_MATHS_QUESTION_SPACING_BASE_PX
  );
}
