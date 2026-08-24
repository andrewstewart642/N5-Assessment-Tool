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