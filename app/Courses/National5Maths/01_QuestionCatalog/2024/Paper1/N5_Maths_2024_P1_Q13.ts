import { createN2IndexQuestionCatalogEntry } from "../../N2IndicesCatalogFactory";

export const N5_MATHS_2024_P1_Q13 = createN2IndexQuestionCatalogEntry(
{
  "year": 2024,
  "paper": "P1",
  "questionNumber": "13",
  "pdfPage": 13,
  "printedPageLabel": "Page 13",
  "marks": 2,
  "family": "BRACKETED_INDEX_LAWS",
  "subFamilyId": "DISTRIBUTE_MONOMIAL_OVER_INDEXED_SUM",
  "primaryConceptId": "num-n2-1",
  "conceptIds": [
    "num-n2-1",
    "num-n2-4"
  ],
  "projectStandardProfile": "C",
  "commandTypes": [
    "EXPAND",
    "SIMPLIFY"
  ],
  "responseType": "EXPRESSION",
  "answerForm": "SYMBOLIC",
  "expectedFinalValueForm": "ALGEBRAIC_EXPRESSION",
  "normalisedExpression": "x * (x^(1/2) + x^(-1))",
  "expressionDescription": "A single outside power of x multiplies a two-term bracket containing one fractional power and one negative power of the same base.",
  "targetFormDescription": "Final expression must be expanded and fully simplified.",
  "operationTypes": [
    "EXPAND",
    "MULTIPLY",
    "SIMPLIFY"
  ],
  "theoremIds": [
    "ALGEBRA_DISTRIBUTIVE_EXPANSION",
    "INDEX_MULTIPLY_SAME_BASE"
  ],
  "subgoals": [
    "Distribute the outside factor across both indexed terms in the bracket.",
    "Add exponents separately in each product and simplify any zero power to a constant term."
  ],
  "representationTransitions": [
    {
      "from": "factor multiplied by a two-term bracket",
      "to": "sum of two simplified terms",
      "purpose": "expand the bracket and simplify each indexed product"
    }
  ],
  "stageCount": 2,
  "numberTypes": [
    "FRACTION",
    "POWER",
    "NEGATIVE",
    "ALGEBRAIC"
  ],
  "fractionalIndicesPresent": true,
  "negativeIndicesPresent": true,
  "rootNotationPresent": false,
  "bracketedExpressionPresent": true,
  "algebraicFractionPresent": false,
  "additiveTermsPresent": true,
  "coefficientSimplificationRequired": false,
  "positivePowerOutputExplicit": false,
  "simplestFormExplicit": true,
  "reasoningTypes": [
    "DIRECT_PROCEDURE",
    "MULTI_STAGE",
    "STRUCTURE_RECOGNITION"
  ],
  "overallDifficulty": "MEDIUM",
  "algebraicLoad": "MEDIUM",
  "representationLoad": "LOW",
  "difficultyDrivers": [
    "distributing over two unlike indexed terms",
    "adding an integer exponent to a fractional exponent",
    "recognising that adding 1 and -1 produces a zero power/constant term"
  ],
  "structuralSignature": [
    "outside monomial factor",
    "two-term bracket",
    "fractional power term",
    "negative power term",
    "distribution followed by same-base multiplication law"
  ],
  "surfaceStyleId": "MONOMIAL_TIMES_INDEXED_BINOMIAL",
  "promptSentenceCount": 1,
  "promptWordCount": 5,
  "introductionStyle": "BARE_BRACKETED_EXPRESSION",
  "commandStyle": "EXPAND_AND_SIMPLIFY_FULLY",
  "informationOrder": [
    "EXPAND_SIMPLIFY_COMMAND",
    "OUTSIDE_FACTOR",
    "TWO_TERM_INDEXED_BRACKET"
  ],
  "normalisedPromptStructure": [
    "Ask for an outside same-base factor to be distributed over a bracket containing two indexed terms and then simplified."
  ],
  "lexicalFeatureTags": [
    "abstract mathematics",
    "brackets",
    "fractional index",
    "negative index",
    "expansion",
    "fully simplified"
  ],
  "answerSpaceCategory": "LARGE",
  "estimatedWritingLines": 7,
  "responseTopPt": 100.0,
  "responseBottomPt": 342.0,
  "responseBoundaryConvention": "Bottom of the Q13 bracketed expression to the top of the turn-over footer."
}
);
