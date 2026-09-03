import { createN2IndexQuestionCatalogEntry } from "../../N2IndicesCatalogFactory";

export const N5_MATHS_2021_P1_Q15 = createN2IndexQuestionCatalogEntry(
{
  "year": 2021,
  "paper": "P1",
  "questionNumber": "15",
  "pdfPage": 12,
  "printedPageLabel": "Page 12",
  "marks": 2,
  "family": "FRACTIONAL_INDEX_EVALUATION",
  "subFamilyId": "INTEGER_BASE_PROPER_FRACTIONAL_EXPONENT",
  "primaryConceptId": "num-n2-4",
  "conceptIds": [
    "num-n2-4"
  ],
  "projectStandardProfile": "A",
  "commandTypes": [
    "EVALUATE"
  ],
  "responseType": "NUMBER",
  "answerForm": "EXACT",
  "expectedFinalValueForm": "INTEGER",
  "normalisedExpression": "16^(3/2)",
  "expressionDescription": "A positive perfect-power integer is raised to a proper fractional exponent with denominator two and integer numerator.",
  "targetFormDescription": null,
  "operationTypes": [
    "EVALUATE"
  ],
  "theoremIds": [
    "INDEX_FRACTIONAL_POWER"
  ],
  "subgoals": [
    "Interpret the denominator of the fractional exponent as a square root.",
    "Apply the numerator of the exponent as an integer power to obtain an exact integer."
  ],
  "representationTransitions": [
    {
      "from": "fractional-index notation",
      "to": "root-and-integer-power interpretation",
      "purpose": "evaluate the exact numerical value"
    }
  ],
  "stageCount": 2,
  "numberTypes": [
    "INTEGER",
    "FRACTION",
    "POWER"
  ],
  "fractionalIndicesPresent": true,
  "negativeIndicesPresent": false,
  "rootNotationPresent": false,
  "bracketedExpressionPresent": false,
  "algebraicFractionPresent": false,
  "additiveTermsPresent": false,
  "coefficientSimplificationRequired": false,
  "positivePowerOutputExplicit": false,
  "simplestFormExplicit": false,
  "reasoningTypes": [
    "DIRECT_PROCEDURE",
    "REPRESENTATION_TRANSLATION"
  ],
  "overallDifficulty": "LOW",
  "algebraicLoad": "VERY_LOW",
  "representationLoad": "LOW",
  "difficultyDrivers": [
    "interpreting a denominator-two fractional exponent correctly",
    "using a perfect-square base to keep the result exact"
  ],
  "structuralSignature": [
    "numeric evaluation",
    "perfect-power integer base",
    "fractional exponent",
    "exact integer result",
    "no algebraic variable"
  ],
  "surfaceStyleId": "NUMERIC_FRACTIONAL_POWER",
  "promptSentenceCount": 1,
  "promptWordCount": 2,
  "introductionStyle": "BARE_NUMERIC_POWER",
  "commandStyle": "SINGLE_EVALUATE_COMMAND",
  "informationOrder": [
    "EVALUATE_COMMAND",
    "FRACTIONAL_POWER"
  ],
  "normalisedPromptStructure": [
    "Issue a direct evaluation command for one integer raised to a fractional power."
  ],
  "lexicalFeatureTags": [
    "abstract mathematics",
    "fractional index",
    "minimal prose",
    "exact evaluation"
  ],
  "answerSpaceCategory": "LARGE",
  "estimatedWritingLines": 7,
  "responseTopPt": 95.2,
  "responseBottomPt": 346.0,
  "responseBoundaryConvention": "Bottom of the Q15 fractional-power expression to the top of Q16."
}
);
