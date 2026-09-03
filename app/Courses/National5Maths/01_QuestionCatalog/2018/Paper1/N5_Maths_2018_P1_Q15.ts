import { createN2IndexQuestionCatalogEntry } from "../../N2IndicesCatalogFactory";

export const N5_MATHS_2018_P1_Q15 = createN2IndexQuestionCatalogEntry(
{
  "year": 2018,
  "paper": "P1",
  "questionNumber": "15",
  "pdfPage": 12,
  "printedPageLabel": "Page 12",
  "marks": 2,
  "family": "BRACKETED_INDEX_LAWS",
  "subFamilyId": "OUTER_POWER_OVER_MONOMIAL_FRACTION",
  "primaryConceptId": "num-n2-2",
  "conceptIds": [
    "num-n2-2",
    "num-n2-3"
  ],
  "projectStandardProfile": "C+A",
  "commandTypes": [
    "EXPAND",
    "SIMPLIFY"
  ],
  "responseType": "EXPRESSION",
  "answerForm": "SYMBOLIC",
  "expectedFinalValueForm": "ALGEBRAIC_EXPRESSION",
  "normalisedExpression": "((2/3) * p^4)^2",
  "expressionDescription": "A bracketed monomial with a fractional numerical coefficient and an indexed variable is raised to an outer integer power.",
  "targetFormDescription": null,
  "operationTypes": [
    "EXPAND",
    "MULTIPLY",
    "SIMPLIFY"
  ],
  "theoremIds": [
    "INDEX_POWER_OF_PRODUCT_OR_QUOTIENT",
    "INDEX_POWER_OF_POWER"
  ],
  "subgoals": [
    "Apply the outer power to the numerical coefficient and the indexed variable.",
    "Multiply the nested variable exponents and write the unbracketed simplified monomial."
  ],
  "representationTransitions": [
    {
      "from": "powered bracketed monomial fraction",
      "to": "unbracketed monomial",
      "purpose": "remove the brackets and simplify the index structure"
    }
  ],
  "stageCount": 2,
  "numberTypes": [
    "INTEGER",
    "FRACTION",
    "POWER",
    "ALGEBRAIC"
  ],
  "fractionalIndicesPresent": false,
  "negativeIndicesPresent": false,
  "rootNotationPresent": false,
  "bracketedExpressionPresent": true,
  "algebraicFractionPresent": false,
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
  "representationLoad": "LOW",
  "difficultyDrivers": [
    "distributing an outer power across coefficient and variable factor",
    "multiplying nested exponents",
    "squaring a fractional coefficient exactly"
  ],
  "structuralSignature": [
    "single powered bracket",
    "monomial inside bracket",
    "fractional coefficient",
    "indexed variable",
    "power distributed across product/quotient",
    "nested exponent multiplication"
  ],
  "surfaceStyleId": "POWERED_MONOMIAL_FRACTION",
  "promptSentenceCount": 1,
  "promptWordCount": 6,
  "introductionStyle": "BARE_BRACKETED_EXPRESSION",
  "commandStyle": "REMOVE_BRACKETS_AND_SIMPLIFY",
  "informationOrder": [
    "EXPAND_SIMPLIFY_COMMAND",
    "POWERED_BRACKETED_MONOMIAL"
  ],
  "normalisedPromptStructure": [
    "Ask for one powered bracketed monomial to be unwrapped and simplified."
  ],
  "lexicalFeatureTags": [
    "abstract mathematics",
    "brackets",
    "fractional coefficient",
    "power of a product",
    "power of a power"
  ],
  "answerSpaceCategory": "LARGE",
  "estimatedWritingLines": 9,
  "responseTopPt": 441.4,
  "responseBottomPt": 774.8,
  "responseBoundaryConvention": "Bottom of the Q15 powered bracket expression to the top of the printed footer/barcode region."
}
);
