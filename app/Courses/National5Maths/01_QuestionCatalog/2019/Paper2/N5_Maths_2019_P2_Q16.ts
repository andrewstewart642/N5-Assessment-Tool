import { createN2IndexQuestionCatalogEntry } from "../../N2IndicesCatalogFactory";

export const N5_MATHS_2019_P2_Q16 = createN2IndexQuestionCatalogEntry(
{
  "year": 2019,
  "paper": "P2",
  "questionNumber": "16",
  "pdfPage": 33,
  "printedPageLabel": "Page 13",
  "marks": 3,
  "family": "MULTI_LAW_SIMPLIFICATION",
  "subFamilyId": "PRODUCT_QUOTIENT_WITH_ROOT_DENOMINATOR",
  "primaryConceptId": "num-n2-1",
  "conceptIds": [
    "num-n2-1",
    "num-n2-4"
  ],
  "projectStandardProfile": "C",
  "commandTypes": [
    "SIMPLIFY"
  ],
  "responseType": "EXPRESSION",
  "answerForm": "SYMBOLIC",
  "expectedFinalValueForm": "ALGEBRAIC_EXPRESSION",
  "normalisedExpression": "(a^4 * 3a) / sqrt(a)",
  "expressionDescription": "A monomial numerator product is divided by a square-root power of the same algebraic base.",
  "targetFormDescription": null,
  "operationTypes": [
    "MULTIPLY",
    "DIVIDE",
    "SIMPLIFY"
  ],
  "theoremIds": [
    "INDEX_MULTIPLY_SAME_BASE",
    "INDEX_ROOT_AS_FRACTIONAL_POWER",
    "INDEX_DIVIDE_SAME_BASE"
  ],
  "subgoals": [
    "Combine the powers of the common base in the numerator while retaining the numerical coefficient.",
    "Interpret the square root in the denominator as a fractional power of the same base.",
    "Subtract the denominator exponent from the numerator exponent to obtain one monomial."
  ],
  "representationTransitions": [
    {
      "from": "square-root denominator",
      "to": "fractional-power denominator",
      "purpose": "apply the division law to a common base"
    }
  ],
  "stageCount": 3,
  "numberTypes": [
    "INTEGER",
    "FRACTION",
    "SURD",
    "POWER",
    "ALGEBRAIC"
  ],
  "fractionalIndicesPresent": true,
  "negativeIndicesPresent": false,
  "rootNotationPresent": true,
  "bracketedExpressionPresent": false,
  "algebraicFractionPresent": true,
  "additiveTermsPresent": false,
  "coefficientSimplificationRequired": false,
  "positivePowerOutputExplicit": false,
  "simplestFormExplicit": true,
  "reasoningTypes": [
    "DIRECT_PROCEDURE",
    "MULTI_STAGE",
    "REPRESENTATION_TRANSLATION",
    "STRUCTURE_RECOGNITION"
  ],
  "overallDifficulty": "MEDIUM",
  "algebraicLoad": "MEDIUM",
  "representationLoad": "MEDIUM",
  "difficultyDrivers": [
    "combining a numerator product before division",
    "translating root notation to a fractional exponent",
    "subtracting an integer and fractional exponent correctly"
  ],
  "structuralSignature": [
    "single algebraic fraction",
    "numerator product of same-base powers",
    "radical denominator of same base",
    "root-to-fractional translation",
    "at least two index-law operations"
  ],
  "surfaceStyleId": "INDEX_FRACTION_WITH_ROOT_DENOMINATOR",
  "promptSentenceCount": 1,
  "promptWordCount": 2,
  "introductionStyle": "BARE_SYMBOLIC_EXPRESSION",
  "commandStyle": "SINGLE_SIMPLIFY_COMMAND",
  "informationOrder": [
    "SIMPLIFY_COMMAND",
    "PRODUCT_OVER_ROOT_EXPRESSION"
  ],
  "normalisedPromptStructure": [
    "Issue a direct simplification command for an indexed product divided by a root of the same base."
  ],
  "lexicalFeatureTags": [
    "abstract mathematics",
    "indices",
    "root notation",
    "algebraic fraction",
    "minimal prose"
  ],
  "answerSpaceCategory": "LARGE",
  "estimatedWritingLines": 10,
  "responseTopPt": 384.8,
  "responseBottomPt": 774.8,
  "responseBoundaryConvention": "Bottom of the Q16 fraction to the top of the printed footer/barcode region."
}
);
