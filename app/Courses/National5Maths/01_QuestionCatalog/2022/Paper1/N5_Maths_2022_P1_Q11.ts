import { createN2IndexQuestionCatalogEntry } from "../../N2IndicesCatalogFactory";

export const N5_MATHS_2022_P1_Q11 = createN2IndexQuestionCatalogEntry(
{
  "year": 2022,
  "paper": "P1",
  "questionNumber": "11",
  "pdfPage": 9,
  "printedPageLabel": "Page 09",
  "marks": 3,
  "family": "MULTI_LAW_SIMPLIFICATION",
  "subFamilyId": "POWER_OF_NEGATIVE_POWER_TIMES_NEGATIVE_POWER",
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
  "normalisedExpression": "(m^(-2))^4 * m^(-5)",
  "expressionDescription": "A negative power of an algebraic base is raised to an outer positive power and then multiplied by another negative power of the same base.",
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
    "Multiply the nested exponents to simplify the power of a negative power.",
    "Add exponents when multiplying the same base.",
    "Rewrite the negative final exponent using a reciprocal positive power."
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
    "multiplying nested signed exponents",
    "combining two negative exponents",
    "converting a negative final exponent to positive-power form"
  ],
  "structuralSignature": [
    "negative inner exponent",
    "outer positive power",
    "multiplication by second negative power",
    "three-stage simplification",
    "explicit positive-power output constraint"
  ],
  "surfaceStyleId": "POWERED_NEGATIVE_POWER_PRODUCT",
  "promptSentenceCount": 2,
  "promptWordCount": 8,
  "introductionStyle": "BARE_SYMBOLIC_EXPRESSION",
  "commandStyle": "SIMPLIFY_THEN_OUTPUT_CONSTRAINT",
  "informationOrder": [
    "SIMPLIFY_COMMAND",
    "POWERED_NEGATIVE_INDEX_PRODUCT",
    "POSITIVE_POWER_REQUIREMENT"
  ],
  "normalisedPromptStructure": [
    "Present a compact indexed product containing a powered negative index.",
    "Add a separate output-form instruction requiring a positive power."
  ],
  "lexicalFeatureTags": [
    "abstract mathematics",
    "negative index",
    "power of a power",
    "positive-power instruction"
  ],
  "answerSpaceCategory": "LARGE",
  "estimatedWritingLines": 8,
  "responseTopPt": 472.2,
  "responseBottomPt": 774.8,
  "responseBoundaryConvention": "Bottom of the positive-power instruction to the top of the printed footer/barcode region."
}
);
