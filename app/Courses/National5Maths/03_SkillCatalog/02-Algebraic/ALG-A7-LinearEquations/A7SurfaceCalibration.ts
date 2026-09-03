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

/** Historical source facts. Generation may interpolate modestly beyond them. */
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
  "Use the three reviewed source surfaces as the default prompt grammars; moderate interpolation is allowed only where the result still looks and feels like an SQA National 5 question.",
  "Begin both sides with a positive algebraic object. Internal subtraction is permitted where historically evidenced, but avoid ugly leading-negative architecture.",
  "Use two distinct displayed non-unit denominators. Historical anchors use 2, 3, 5 and 6; moderated generation may use similarly natural pairings with displayed denominators no larger than 10 and LCD no larger than 15.",
  "Prefer recognisable lowest-common-denominator pairings rather than arbitrary fractions on every term.",
  "A moderated upper-band extension may place a compact binomial fraction on each side, but it must remain a linear-equation task rather than drift into rational-expression manipulation.",
  "Do not broaden surface complexity merely because the cleared equation remains numerically solvable; visual/algebraic cleanliness is itself part of fidelity.",
  "For every proposed extension ask: would this still look and feel at home on an SQA National 5 paper? Reject it when the answer is doubtful.",
] as const;

export const A7_CONTEXT_VISUAL_GENERATION_GUARDRAILS = [
  "Keep the triangle isosceles or equilateral in appearance, with its apex centred over its base; its proportions may vary with the generated dimensions rather than being forced into one narrow silhouette.",
  "Make the displayed shape proportions broadly agree with the dimensions obtained at the intended value of x. A candidate substituting their answer as a sense-check should not be visually contradicted by the diagram.",
  "Use a common qualitative scale for the triangle and rectangle where practical so the equal-area relationship remains visually plausible; clamp only for legibility rather than drawing every item to an identical template.",
  "Allow the rectangle to be square-like, tall and narrow, or short and wide where the resolved dimensions support that aspect ratio.",
  "The algebraic dimension may appear horizontally or vertically on either shape, while the other dimension stays fixed so the equal-area model remains linear.",
  "Permit restrained linear forms such as x+c, c-x and occasional 2x+c or c-2x; a non-unit x coefficient is an upper-texture variant rather than the default.",
  "Place vertical dimension arrows immediately beside the relevant shapes and horizontal dimensions directly beneath them.",
  "Render algebraic dimension labels using mathematical typesetting; plain UI text is not an acceptable final visual representation.",
  "Keep the visual recognisably SQA-like even when the parameter layout is moderately broader than the single historical source example.",
] as const;
