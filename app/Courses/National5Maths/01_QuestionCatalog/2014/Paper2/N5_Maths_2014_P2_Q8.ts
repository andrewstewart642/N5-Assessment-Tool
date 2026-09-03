import { createN2IndexQuestionCatalogEntry } from "../../N2IndicesCatalogFactory";

export const N5_MATHS_2014_P2_Q8 = createN2IndexQuestionCatalogEntry(
{
  "year": 2014,
  "paper": "P2",
  "questionNumber": "8",
  "pdfPage": 27,
  "printedPageLabel": "Page 11",
  "marks": 3,
  "family": "MULTI_LAW_SIMPLIFICATION",
  "subFamilyId": "PRODUCT_QUOTIENT_WITH_COEFFICIENT",
  "primaryConceptId": "num-n2-1",
  "conceptIds": [
    "num-n2-1"
  ],
  "projectStandardProfile": "C",
  "commandTypes": [
    "SIMPLIFY"
  ],
  "responseType": "EXPRESSION",
  "answerForm": "SYMBOLIC",
  "expectedFinalValueForm": "ALGEBRAIC_EXPRESSION",
  "normalisedExpression": "(n^5 * 10n) / (2n^2)",
  "expressionDescription": "A monomial fraction combines a numerical coefficient with same-base powers in a numerator product and a denominator power.",
  "targetFormDescription": null,
  "operationTypes": [
    "MULTIPLY",
    "DIVIDE",
    "SIMPLIFY"
  ],
  "theoremIds": [
    "INDEX_MULTIPLY_SAME_BASE",
    "INDEX_DIVIDE_SAME_BASE"
  ],
  "subgoals": [
    "Reduce the numerical coefficient independently of the powers.",
    "Combine the numerator powers of the common base.",
    "Divide by the denominator power to obtain one simplified monomial."
  ],
  "representationTransitions": [],
  "stageCount": 3,
  "numberTypes": [
    "INTEGER",
    "POWER",
    "ALGEBRAIC"
  ],
  "fractionalIndicesPresent": false,
  "negativeIndicesPresent": false,
  "rootNotationPresent": false,
  "bracketedExpressionPresent": false,
  "algebraicFractionPresent": true,
  "additiveTermsPresent": false,
  "coefficientSimplificationRequired": true,
  "positivePowerOutputExplicit": false,
  "simplestFormExplicit": true,
  "reasoningTypes": [
    "DIRECT_PROCEDURE",
    "MULTI_STAGE",
    "STRUCTURE_RECOGNITION"
  ],
  "overallDifficulty": "LOW",
  "algebraicLoad": "LOW",
  "representationLoad": "VERY_LOW",
  "difficultyDrivers": [
    "combining multiplication and division laws in one expression",
    "simplifying coefficient and exponent structure separately"
  ],
  "structuralSignature": [
    "single algebraic fraction",
    "numerator product of same-base powers",
    "denominator same-base power",
    "independent coefficient reduction",
    "at least two index-law operations"
  ],
  "surfaceStyleId": "INDEX_FRACTION_PRODUCT_QUOTIENT",
  "promptSentenceCount": 1,
  "promptWordCount": 7,
  "introductionStyle": "BARE_SYMBOLIC_EXPRESSION",
  "commandStyle": "SINGLE_SIMPLIFY_COMMAND",
  "informationOrder": [
    "SIMPLIFY_COMMAND",
    "INDEXED_FRACTION"
  ],
  "normalisedPromptStructure": [
    "Issue a direct simplification command for one compact indexed algebraic fraction."
  ],
  "lexicalFeatureTags": [
    "abstract mathematics",
    "indices",
    "minimal prose",
    "fraction layout"
  ],
  "answerSpaceCategory": "MEDIUM",
  "estimatedWritingLines": 5,
  "responseTopPt": 105.48,
  "responseBottomPt": 290.84,
  "responseBoundaryConvention": "Bottom of the displayed Q8 fraction to the top of Q9."
}
);
