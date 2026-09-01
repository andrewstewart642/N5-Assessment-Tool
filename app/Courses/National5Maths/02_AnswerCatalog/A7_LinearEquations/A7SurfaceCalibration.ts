export type A7FractionalHistoricalSurfacePattern =
  | "FRACTION_MINUS_FRACTION_EQUALS_WHOLE_X"
  | "FRACTION_MINUS_WHOLE_EQUALS_BINOMIAL_FRACTION"
  | "BINOMIAL_FRACTION_EQUALS_FRACTION_PLUS_WHOLE";

export type A7FractionalSurfaceEvidence = {
  sourceQuestionId: string;
  pattern: A7FractionalHistoricalSurfacePattern;
  topLevelAlgebraicObjectCount: 3;
  displayedNonUnitDenominators: readonly [number, number];
  displayedDenominatorsAreDistinct: true;
  equationStartsWithNegativeTerm: false;
  rhsStartsWithNegativeTerm: false;
};

/**
 * Surface-level findings added after teacher visual moderation of the first A7
 * generator batch. These facts were re-checked against the supplied source
 * papers rather than inferred from generated output.
 */
export const A7_FRACTIONAL_SURFACE_EVIDENCE: readonly A7FractionalSurfaceEvidence[] = [
  {
    sourceQuestionId: "N5_MATH_2016_P1_Q8",
    pattern: "FRACTION_MINUS_FRACTION_EQUALS_WHOLE_X",
    topLevelAlgebraicObjectCount: 3,
    displayedNonUnitDenominators: [3, 6],
    displayedDenominatorsAreDistinct: true,
    equationStartsWithNegativeTerm: false,
    rhsStartsWithNegativeTerm: false,
  },
  {
    sourceQuestionId: "N5_MATH_2019_P1_Q14",
    pattern: "FRACTION_MINUS_WHOLE_EQUALS_BINOMIAL_FRACTION",
    topLevelAlgebraicObjectCount: 3,
    displayedNonUnitDenominators: [2, 5],
    displayedDenominatorsAreDistinct: true,
    equationStartsWithNegativeTerm: false,
    rhsStartsWithNegativeTerm: false,
  },
  {
    sourceQuestionId: "N5_MATH_2025_P2_Q13",
    pattern: "BINOMIAL_FRACTION_EQUALS_FRACTION_PLUS_WHOLE",
    topLevelAlgebraicObjectCount: 3,
    displayedNonUnitDenominators: [2, 3],
    displayedDenominatorsAreDistinct: true,
    equationStartsWithNegativeTerm: false,
    rhsStartsWithNegativeTerm: false,
  },
] as const;

export const A7_FRACTIONAL_SURFACE_GENERATION_GUARDRAILS = [
  "Keep the displayed equation to three top-level algebraic objects; do not turn the source family into a four-term rational-expression exercise.",
  "Begin both sides with a positive algebraic object. Internal subtraction is permitted where historically evidenced, but a leading negative term is not part of the reviewed A7 surface grammar.",
  "Use two distinct displayed non-unit denominators. Historical anchors use 2, 3, 5 and 6; teacher-moderated generation may interpolate to similarly natural pairings using displayed denominators no larger than 10 and LCD no larger than 15.",
  "Prefer recognisable lowest-common-denominator pairings such as 2-and-3, 3-and-6, 2-and-5, 3-and-4, 4-and-6, 3-and-5 and 4-and-8 rather than arbitrary fractions on every term.",
  "Treat the three reviewed source surfaces as separate prompt grammars: 2016-type split fractions, 2019-type right binomial fraction, and 2025-type left binomial fraction.",
  "Do not broaden surface complexity merely because the cleared equation remains numerically solvable; visual/algebraic cleanliness is itself part of fidelity.",
  "For every proposed extension ask the explicit moderation question: would this still look and feel at home on an SQA National 5 paper? Reject it when the answer is doubtful.",
] as const;

export const A7_CONTEXT_VISUAL_GENERATION_GUARDRAILS = [
  "Use a symmetric narrow triangle and a separate upright rectangle, following the relative visual arrangement of the reviewed 2022 source family.",
  "Place vertical dimension arrows immediately beside the relevant shapes, with algebraic labels centred beside those arrows.",
  "Render algebraic dimension labels using mathematical typesetting; plain UI text is not an acceptable final visual representation.",
  "Place fixed horizontal dimensions directly beneath the relevant shapes.",
] as const;
