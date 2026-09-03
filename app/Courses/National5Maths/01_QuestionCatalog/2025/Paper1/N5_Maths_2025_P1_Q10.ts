import { createN2IndexQuestionCatalogEntry } from "../../N2IndicesCatalogFactory";

export const N5_MATHS_2025_P1_Q10 = createN2IndexQuestionCatalogEntry(
{
  "year": 2025,
  "paper": "P1",
  "questionNumber": "10",
  "pdfPage": 8,
  "printedPageLabel": "Page 08",
  "marks": 3,
  "family": "MULTI_LAW_SIMPLIFICATION",
  "subFamilyId": "PRODUCT_WITH_NESTED_POWER_OVER_POWER",
  "primaryConceptId": "num-n2-3",
  "conceptIds": [
    "num-n2-3",
    "num-n2-1"
  ],
  "projectStandardProfile": "C",
  "commandTypes": [
    "SIMPLIFY"
  ],
  "responseType": "EXPRESSION",
  "answerForm": "SYMBOLIC",
  "expectedFinalValueForm": "ALGEBRAIC_EXPRESSION",
  "normalisedExpression": "(n^7 * (n^3)^2) / n^4",
  "expressionDescription": "A same-base product containing a nested power is divided by another power of that base in a single algebraic fraction.",
  "targetFormDescription": null,
  "operationTypes": [
    "MULTIPLY",
    "DIVIDE",
    "SIMPLIFY"
  ],
  "theoremIds": [
    "INDEX_POWER_OF_POWER",
    "INDEX_MULTIPLY_SAME_BASE",
    "INDEX_DIVIDE_SAME_BASE"
  ],
  "subgoals": [
    "Multiply the nested exponents to simplify the power of a power.",
    "Add exponents across the numerator product.",
    "Subtract the denominator exponent to obtain one final power."
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
  "bracketedExpressionPresent": true,
  "algebraicFractionPresent": true,
  "additiveTermsPresent": false,
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
    "power-of-a-power inside a larger product",
    "combining numerator powers before division",
    "maintaining the correct exponent operation order"
  ],
  "structuralSignature": [
    "single algebraic fraction",
    "numerator product",
    "nested power in numerator",
    "denominator same-base power",
    "three distinct index-law stages"
  ],
  "surfaceStyleId": "NESTED_POWER_PRODUCT_OVER_POWER",
  "promptSentenceCount": 1,
  "promptWordCount": 2,
  "introductionStyle": "BARE_SYMBOLIC_EXPRESSION",
  "commandStyle": "SINGLE_SIMPLIFY_COMMAND",
  "informationOrder": [
    "SIMPLIFY_COMMAND",
    "NESTED_POWER_FRACTION"
  ],
  "normalisedPromptStructure": [
    "Issue a direct simplification command for a same-base product with a nested power divided by another power."
  ],
  "lexicalFeatureTags": [
    "abstract mathematics",
    "indices",
    "power of a power",
    "algebraic fraction",
    "minimal prose"
  ],
  "answerSpaceCategory": "LARGE",
  "estimatedWritingLines": 7,
  "responseTopPt": 517.6,
  "responseBottomPt": 774.8,
  "responseBoundaryConvention": "Bottom of the Q10 fraction to the top of the printed footer/barcode region."
}
);
