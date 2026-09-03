import { createN2IndexQuestionCatalogEntry } from "../../N2IndicesCatalogFactory";

export const N5_MATHS_2023_P1_Q12 = createN2IndexQuestionCatalogEntry(
{
  "year": 2023,
  "paper": "P1",
  "questionNumber": "12",
  "pdfPage": 12,
  "printedPageLabel": "Page 12",
  "marks": 3,
  "family": "MULTI_LAW_SIMPLIFICATION",
  "subFamilyId": "NEGATIVE_POWER_OVER_PRODUCT_OF_POWERS",
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
  "normalisedExpression": "(5c^(-2)) / (c^3 * c^4)",
  "expressionDescription": "A coefficient times a negative power is divided by a denominator product of two positive powers of the same algebraic base.",
  "targetFormDescription": "Final expression must use a positive power.",
  "operationTypes": [
    "MULTIPLY",
    "DIVIDE",
    "SIMPLIFY"
  ],
  "theoremIds": [
    "INDEX_MULTIPLY_SAME_BASE",
    "INDEX_DIVIDE_SAME_BASE",
    "INDEX_NEGATIVE_POWER_RECIPROCAL"
  ],
  "subgoals": [
    "Combine the two denominator powers of the common base.",
    "Apply the division law between the negative numerator exponent and the combined denominator exponent.",
    "Rewrite the negative final exponent using a reciprocal positive power while retaining the coefficient."
  ],
  "representationTransitions": [
    {
      "from": "negative final exponent",
      "to": "coefficient over a positive power",
      "purpose": "satisfy the required output form"
    }
  ],
  "stageCount": 3,
  "numberTypes": [
    "INTEGER",
    "POWER",
    "NEGATIVE",
    "ALGEBRAIC"
  ],
  "fractionalIndicesPresent": false,
  "negativeIndicesPresent": true,
  "rootNotationPresent": false,
  "bracketedExpressionPresent": false,
  "algebraicFractionPresent": true,
  "additiveTermsPresent": false,
  "coefficientSimplificationRequired": false,
  "positivePowerOutputExplicit": true,
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
    "combining denominator powers before division",
    "subtracting a positive denominator exponent from a negative numerator exponent",
    "retaining the coefficient while converting to positive-power form"
  ],
  "structuralSignature": [
    "single algebraic fraction",
    "negative power in numerator",
    "product of two same-base powers in denominator",
    "three-stage simplification",
    "explicit positive-power output constraint"
  ],
  "surfaceStyleId": "NEGATIVE_POWER_OVER_POWER_PRODUCT",
  "promptSentenceCount": 2,
  "promptWordCount": 8,
  "introductionStyle": "BARE_SYMBOLIC_EXPRESSION",
  "commandStyle": "SIMPLIFY_THEN_OUTPUT_CONSTRAINT",
  "informationOrder": [
    "SIMPLIFY_COMMAND",
    "INDEXED_FRACTION",
    "POSITIVE_POWER_REQUIREMENT"
  ],
  "normalisedPromptStructure": [
    "Present a coefficient times a negative power over a product of powers.",
    "Add a separate output-form instruction requiring a positive power."
  ],
  "lexicalFeatureTags": [
    "abstract mathematics",
    "negative index",
    "algebraic fraction",
    "positive-power instruction"
  ],
  "answerSpaceCategory": "FULL_PAGE",
  "estimatedWritingLines": 13,
  "responseTopPt": 275.3,
  "responseBottomPt": 774.8,
  "responseBoundaryConvention": "Bottom of the positive-power instruction to the top of the printed footer/barcode region."
}
);
