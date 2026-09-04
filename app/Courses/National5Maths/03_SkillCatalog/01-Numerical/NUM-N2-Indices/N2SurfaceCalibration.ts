import type { N2CorpusFamily, N2HistoricalMechanism } from "./N2CrossCorpusAnalysis";

export type N2HistoricalSurfacePattern =
  | "NUMERIC_FRACTIONAL_POWER"
  | "INDEX_FRACTION_PRODUCT_QUOTIENT"
  | "NESTED_POWER_TIMES_NEGATIVE_POWER"
  | "RECIPROCAL_ROOT_TO_SINGLE_POWER"
  | "POWERED_MONOMIAL_FRACTION"
  | "INDEX_FRACTION_WITH_ROOT_DENOMINATOR"
  | "POWERED_NEGATIVE_POWER_PRODUCT"
  | "NEGATIVE_POWER_OVER_POWER_PRODUCT"
  | "MONOMIAL_TIMES_INDEXED_BINOMIAL"
  | "NESTED_POWER_PRODUCT_OVER_POWER";

export type N2SurfaceEvidence = {
  sourceQuestionId: string;
  family: N2CorpusFamily;
  mechanism: N2HistoricalMechanism;
  pattern: N2HistoricalSurfacePattern;
  paper: "P1" | "P2";
  sentenceCount: 1 | 2;
  usesAlgebraicFraction: boolean;
  usesBracket: boolean;
  usesRootNotation: boolean;
  usesAdditiveTerms: boolean;
  separateOutputConstraint: boolean;
};

export const N2_SURFACE_EVIDENCE: readonly N2SurfaceEvidence[] = [
  {
    sourceQuestionId: "N5_MATH_2014_P2_Q8",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "PRODUCT_QUOTIENT_WITH_COEFFICIENT",
    pattern: "INDEX_FRACTION_PRODUCT_QUOTIENT",
    paper: "P2",
    sentenceCount: 1,
    usesAlgebraicFraction: true,
    usesBracket: false,
    usesRootNotation: false,
    usesAdditiveTerms: false,
    separateOutputConstraint: false,
  },
  {
    sourceQuestionId: "N5_MATH_2015_P1_Q14",
    family: "FRACTIONAL_INDEX_EVALUATION",
    mechanism: "FRACTIONAL_NUMERIC_EVALUATION",
    pattern: "NUMERIC_FRACTIONAL_POWER",
    paper: "P1",
    sentenceCount: 1,
    usesAlgebraicFraction: false,
    usesBracket: false,
    usesRootNotation: false,
    usesAdditiveTerms: false,
    separateOutputConstraint: false,
  },
  {
    sourceQuestionId: "N5_MATH_2016_P2_Q10",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "POWER_OF_POWER_WITH_NEGATIVE_INDEX",
    pattern: "NESTED_POWER_TIMES_NEGATIVE_POWER",
    paper: "P2",
    sentenceCount: 2,
    usesAlgebraicFraction: false,
    usesBracket: true,
    usesRootNotation: false,
    usesAdditiveTerms: false,
    separateOutputConstraint: true,
  },
  {
    sourceQuestionId: "N5_MATH_2017_P2_Q12",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX",
    pattern: "RECIPROCAL_ROOT_TO_SINGLE_POWER",
    paper: "P2",
    sentenceCount: 1,
    usesAlgebraicFraction: true,
    usesBracket: false,
    usesRootNotation: true,
    usesAdditiveTerms: false,
    separateOutputConstraint: false,
  },
  {
    sourceQuestionId: "N5_MATH_2018_P1_Q15",
    family: "BRACKETED_INDEX_LAWS",
    mechanism: "SQUARED_FRACTIONAL_MONOMIAL",
    pattern: "POWERED_MONOMIAL_FRACTION",
    paper: "P1",
    sentenceCount: 1,
    usesAlgebraicFraction: false,
    usesBracket: true,
    usesRootNotation: false,
    usesAdditiveTerms: false,
    separateOutputConstraint: false,
  },
  {
    sourceQuestionId: "N5_MATH_2019_P2_Q16",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "PRODUCT_OVER_ROOT",
    pattern: "INDEX_FRACTION_WITH_ROOT_DENOMINATOR",
    paper: "P2",
    sentenceCount: 1,
    usesAlgebraicFraction: true,
    usesBracket: false,
    usesRootNotation: true,
    usesAdditiveTerms: false,
    separateOutputConstraint: false,
  },
  {
    sourceQuestionId: "N5_MATH_2021_P1_Q15",
    family: "FRACTIONAL_INDEX_EVALUATION",
    mechanism: "FRACTIONAL_NUMERIC_EVALUATION",
    pattern: "NUMERIC_FRACTIONAL_POWER",
    paper: "P1",
    sentenceCount: 1,
    usesAlgebraicFraction: false,
    usesBracket: false,
    usesRootNotation: false,
    usesAdditiveTerms: false,
    separateOutputConstraint: false,
  },
  {
    sourceQuestionId: "N5_MATH_2022_P1_Q11",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "POWER_OF_POWER_WITH_NEGATIVE_INDEX",
    pattern: "POWERED_NEGATIVE_POWER_PRODUCT",
    paper: "P1",
    sentenceCount: 2,
    usesAlgebraicFraction: false,
    usesBracket: true,
    usesRootNotation: false,
    usesAdditiveTerms: false,
    separateOutputConstraint: true,
  },
  {
    sourceQuestionId: "N5_MATH_2023_P1_Q12",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "NEGATIVE_INDEX_QUOTIENT",
    pattern: "NEGATIVE_POWER_OVER_POWER_PRODUCT",
    paper: "P1",
    sentenceCount: 2,
    usesAlgebraicFraction: true,
    usesBracket: false,
    usesRootNotation: false,
    usesAdditiveTerms: false,
    separateOutputConstraint: true,
  },
  {
    sourceQuestionId: "N5_MATH_2024_P1_Q13",
    family: "BRACKETED_INDEX_LAWS",
    mechanism: "DISTRIBUTIVE_INDEX_EXPANSION",
    pattern: "MONOMIAL_TIMES_INDEXED_BINOMIAL",
    paper: "P1",
    sentenceCount: 1,
    usesAlgebraicFraction: false,
    usesBracket: true,
    usesRootNotation: false,
    usesAdditiveTerms: true,
    separateOutputConstraint: false,
  },
  {
    sourceQuestionId: "N5_MATH_2025_P1_Q10",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "POSITIVE_POWER_PRODUCT_QUOTIENT",
    pattern: "NESTED_POWER_PRODUCT_OVER_POWER",
    paper: "P1",
    sentenceCount: 1,
    usesAlgebraicFraction: true,
    usesBracket: true,
    usesRootNotation: false,
    usesAdditiveTerms: false,
    separateOutputConstraint: false,
  },
] as const;

export const N2_GENERAL_SURFACE_GUARDRAILS = [
  "Keep N2 prompts abstract, compact and notation-led. The reviewed corpus contains no contextual or visual N2 item.",
  "Use the shortest established mathematical command that fits the selected mechanism; do not add explanatory prose around a routine index-law item.",
  "Use a separate short output-form instruction only where the selected mechanism genuinely requires a prescribed final representation.",
  "Use one algebraic base per same-base law chain. Change the symbol freely, but keep the expression visually compact.",
  "Preserve a strong visual hierarchy between ordinary symbols, superscripts and fractional superscripts; ambiguity in the exponent is a generation defect, not acceptable surface variety.",
  "Top-level algebraic fractions must keep a clearly visible rule with comfortable numerator/denominator separation.",
  "Avoid reproducing any historical expression exactly or by trivial symbol substitution. Generated variation must change meaningful parameters or structure without leaving the reviewed mechanism.",
  "Surface variation must not change the intended number of independently mark-bearing transformations.",
] as const;

export const N2_FRACTIONAL_SURFACE_GUARDRAILS = [
  "Present one positive integer base raised to one fractional exponent and ask for an exact evaluation.",
  "Choose the base so the relevant root is exact and recognisable by written mathematics without approximation.",
  "Keep the surface to a single power; extra products, sums or nested powers move the item into another family.",
  "Lower-band items should look immediately familiar in scale and representation. Upper-band items may use a less routine exact perfect power or fractional numerator, but should still look like a normal two-mark examination item rather than a numerical stunt.",
  "Very large exact answers are stretch variants only; ordinary upper-band generation should stay centred on modest exact values.",
] as const;

export const N2_BRACKETED_SURFACE_GUARDRAILS = [
  "Powered-monomial mode uses one bracket containing a coefficient and one indexed variable, followed by one outer integer power.",
  "Distributive mode uses one outside same-base factor and a two-term bracket; each term must create a meaningful exponent calculation after expansion.",
  "Lower-band distributive items should normally use an integer outside power with one positive fractional term and one negative integer term, retaining the clean source-centred silhouette.",
  "Upper-band distributive items may add one controlled representation lever: a negative fractional term, two fractional bracket terms or a fractional outside power. Do not routinely combine all three.",
  "Do not mix the two bracketed mechanisms into a nested multi-bracket expression in the first generator version.",
  "Keep coefficient fractions simple enough for exact hand arithmetic when the powered-monomial mechanism is selected.",
  "A zero-power result may appear naturally in distributive mode, but it should be occasional rather than mechanically forced.",
] as const;

export const N2_MULTI_LAW_SURFACE_GUARDRAILS = [
  "Select a reviewed multi-law mechanism before sampling exponents or coefficients.",
  "Use algebraic-fraction layout only for mechanisms calibrated with a genuine numerator/denominator relationship.",
  "Use root notation only for the reciprocal-root or product-over-root mechanisms; do not sprinkle radicals into unrelated law chains.",
  "Use negative indices only when they create the intended signed-exponent or reciprocal-conversion stage.",
  "For the repeated power-of-a-power/negative-index mechanism, keep one powered indexed factor and one second same-base factor, then require positive-power form when that is part of the chosen grammar.",
  "For reciprocal-root conversion, prescribe a compact same-base power form rather than adding explanatory wording.",
  "For the all-positive three-law mechanism, keep one nested power, one numerator product and one denominator power so the three process stages remain distinct.",
  "For coefficient/product/quotient mode, coefficient reduction must remain independently visible and not collapse automatically into another mark step.",
  "Where a historical mechanism has a distinctive parameter tuple, generation must vary more than the algebraic letter so the new item is not a trivial relabelling.",
] as const;
