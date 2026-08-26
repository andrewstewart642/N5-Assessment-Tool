export const ANSWER_METHOD_FAMILY_IDS = {
  /**
   * Reverse percentages
   */
  REVERSE_PERCENT_UNITARY:
    "REVERSE_PERCENT_UNITARY",

  REVERSE_PERCENT_INVERSE_MULTIPLIER:
    "REVERSE_PERCENT_INVERSE_MULTIPLIER",


  /**
   * Fractions
   *
   * These are deliberately operation-specific.
   *
   * Several fraction operations share the same
   * generator family, so using one generic
   * "fraction method" identity would allow
   * historical multiplication evidence, for
   * example, to influence a division question.
   */

  FRACTION_ADD_IMPROPER:
    "FRACTION_ADD_IMPROPER",

  FRACTION_ADD_MIXED_COMPONENTS:
    "FRACTION_ADD_MIXED_COMPONENTS",

  FRACTION_SUBTRACT_IMPROPER:
    "FRACTION_SUBTRACT_IMPROPER",

  FRACTION_SUBTRACT_MIXED_COMPONENTS:
    "FRACTION_SUBTRACT_MIXED_COMPONENTS",

  FRACTION_MULTIPLY_IMPROPER:
    "FRACTION_MULTIPLY_IMPROPER",

  FRACTION_MULTIPLY_DISTRIBUTIVE:
    "FRACTION_MULTIPLY_DISTRIBUTIVE",

  FRACTION_DIVIDE_RECIPROCAL:
    "FRACTION_DIVIDE_RECIPROCAL",

  FRACTION_BRACKET_THEN_MULTIPLY:
    "FRACTION_BRACKET_THEN_MULTIPLY",

  FRACTION_DISTRIBUTE_THEN_ADD:
    "FRACTION_DISTRIBUTE_THEN_ADD",


  /**
   * Compound percentages
   *
   * The historical N5 evidence gives us three
   * useful solution structures.
   *
   * 1. MULTIPLIER_POWER
   *
   *    A single percentage multiplier is raised
   *    to the required number of periods:
   *
   *      1200 × 1.045^3
   *
   * 2. YEAR_BY_YEAR
   *
   *    The same multiplier is applied separately
   *    to each successive value.
   *
   *    This is mathematically equivalent to the
   *    power method but is kept as a distinct
   *    answer method because SQA explicitly
   *    accepts it in historical marking evidence.
   *
   * 3. MULTI_RATE_MULTIPLIER_POWER
   *
   *    Different multipliers apply to different
   *    stages, for example:
   *
   *      20000 × 0.89 × 0.94^2
   *
   *    This is kept separate from the ordinary
   *    fixed-rate method so evidence from the
   *    2023 multi-rate question does not
   *    incorrectly affect normal fixed-rate
   *    compound questions.
   */

  COMPOUND_PERCENT_MULTIPLIER_POWER:
    "COMPOUND_PERCENT_MULTIPLIER_POWER",

  COMPOUND_PERCENT_YEAR_BY_YEAR:
    "COMPOUND_PERCENT_YEAR_BY_YEAR",

  COMPOUND_PERCENT_MULTI_RATE_MULTIPLIER_POWER:
    "COMPOUND_PERCENT_MULTI_RATE_MULTIPLIER_POWER",
} as const;


export type AnswerMethodFamilyId =
  typeof ANSWER_METHOD_FAMILY_IDS[
    keyof typeof ANSWER_METHOD_FAMILY_IDS
  ];


export const ANSWER_METHOD_VARIANT_IDS = {
  /**
   * Reverse percentages
   */
  VIA_1_PERCENT:
    "VIA_1_PERCENT",

  VIA_10_PERCENT:
    "VIA_10_PERCENT",

  VIA_20_PERCENT:
    "VIA_20_PERCENT",

  VIA_25_PERCENT:
    "VIA_25_PERCENT",

  DIVIDE_BY_MULTIPLIER:
    "DIVIDE_BY_MULTIPLIER",
} as const;


export type AnswerMethodVariantId =
  typeof ANSWER_METHOD_VARIANT_IDS[
    keyof typeof ANSWER_METHOD_VARIANT_IDS
  ];