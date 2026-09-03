import { createN2IndexQuestionCatalogEntry } from "../../N2IndicesCatalogFactory";

export const N5_MATHS_2016_P2_Q10 = createN2IndexQuestionCatalogEntry(
{
  "year": 2016,
  "paper": "P2",
  "questionNumber": "10",
  "pdfPage": 26,
  "printedPageLabel": "Page 10",
  "marks": 3,
  "family": "MULTI_LAW_SIMPLIFICATION",
  "subFamilyId": "POWER_OF_POWER_TIMES_NEGATIVE_POWER",
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
  "normalisedExpression": "(n^2)^3 * n^(-10)",
  "expressionDescription": "A power of a power is multiplied by a negative power of the same algebraic base, with a positive-power final form required.",
  "targetFormDescription": "Final expression must use a positive power.",
  "operationTypes": [
    "MULTIPLY",
    "SIMPLIFY"
  ],
  "theoremIds": [
    "INDEX_POWER_OF_POWER",
    "INDEX_MULTIPLY_SAME_BASE",
    "INDEX_NEGATIVE_POWER_RECIPROCAL"
  ],
  "subgoals": [
    "Multiply the nested exponents to remove the power-of-a-power structure.",
    "Combine the resulting power with the negative power of the same base.",
    "Rewrite a negative final exponent using a positive power."
  ],
  "representationTransitions": [
    {
      "from": "negative final exponent",
      "to": "reciprocal with positive exponent",
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
  "bracketedExpressionPresent": true,
  "algebraicFractionPresent": false,
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
    "power-of-a-power followed by same-base multiplication",
    "maintaining negative exponents correctly",
    "converting the result to positive-power form"
  ],
  "structuralSignature": [
    "nested power",
    "multiplication by same-base negative power",
    "three-stage simplification",
    "explicit positive-power output constraint"
  ],
  "surfaceStyleId": "NESTED_POWER_TIMES_NEGATIVE_POWER",
  "promptSentenceCount": 2,
  "promptWordCount": 8,
  "introductionStyle": "BARE_SYMBOLIC_EXPRESSION",
  "commandStyle": "SIMPLIFY_THEN_OUTPUT_CONSTRAINT",
  "informationOrder": [
    "SIMPLIFY_COMMAND",
    "NESTED_INDEX_EXPRESSION",
    "POSITIVE_POWER_REQUIREMENT"
  ],
  "normalisedPromptStructure": [
    "Present a compact indexed product for simplification.",
    "Add a separate output-form instruction requiring a positive power."
  ],
  "lexicalFeatureTags": [
    "abstract mathematics",
    "negative index",
    "power of a power",
    "positive-power instruction"
  ],
  "answerSpaceCategory": "LARGE",
  "estimatedWritingLines": 9,
  "responseTopPt": 442.8,
  "responseBottomPt": 774.8,
  "responseBoundaryConvention": "Bottom of the positive-power instruction to the top of the printed footer/barcode region."
}
);
