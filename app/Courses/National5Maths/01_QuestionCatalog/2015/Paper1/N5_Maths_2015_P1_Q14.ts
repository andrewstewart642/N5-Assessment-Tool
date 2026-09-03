import { createN2IndexQuestionCatalogEntry } from "../../N2IndicesCatalogFactory";

export const N5_MATHS_2015_P1_Q14 = createN2IndexQuestionCatalogEntry(
{
  "year": 2015,
  "paper": "P1",
  "questionNumber": "14",
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
  "normalisedExpression": "8^(5/3)",
  "expressionDescription": "A positive integer base is raised to a proper fractional exponent with a small root denominator and integer numerator.",
  "targetFormDescription": null,
  "operationTypes": [
    "EVALUATE"
  ],
  "theoremIds": [
    "INDEX_FRACTIONAL_POWER"
  ],
  "subgoals": [
    "Interpret the denominator of the fractional exponent as the root index.",
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
    "interpreting a fractional exponent correctly",
    "choosing an efficient root-then-power or power-then-root route"
  ],
  "structuralSignature": [
    "numeric evaluation",
    "integer base",
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
  "estimatedWritingLines": 10,
  "responseTopPt": 322.2,
  "responseBottomPt": 703.2,
  "responseBoundaryConvention": "Bottom of the Q14 fractional-power expression to the top of the end-of-paper footer."
}
);
