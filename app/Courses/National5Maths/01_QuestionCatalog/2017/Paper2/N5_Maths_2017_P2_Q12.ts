import { createN2IndexQuestionCatalogEntry } from "../../N2IndicesCatalogFactory";

export const N5_MATHS_2017_P2_Q12 = createN2IndexQuestionCatalogEntry(
{
  "year": 2017,
  "paper": "P2",
  "questionNumber": "12",
  "pdfPage": 27,
  "printedPageLabel": "Page 11",
  "marks": 2,
  "family": "MULTI_LAW_SIMPLIFICATION",
  "subFamilyId": "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_POWER",
  "primaryConceptId": "num-n2-4",
  "conceptIds": [
    "num-n2-4"
  ],
  "projectStandardProfile": "A",
  "commandTypes": [
    "EXPRESS"
  ],
  "responseType": "EXPRESSION",
  "answerForm": "SYMBOLIC",
  "expectedFinalValueForm": "ALGEBRAIC_EXPRESSION",
  "normalisedExpression": "1 / cuberoot(x)",
  "expressionDescription": "A reciprocal containing a cube root of an algebraic base must be rewritten as one power of that base.",
  "targetFormDescription": "Final expression must be a single power of x of the form x^n.",
  "operationTypes": [
    "SIMPLIFY"
  ],
  "theoremIds": [
    "INDEX_ROOT_AS_FRACTIONAL_POWER",
    "INDEX_NEGATIVE_POWER_RECIPROCAL"
  ],
  "subgoals": [
    "Translate the cube root into a fractional power of the base.",
    "Use the reciprocal to change the fractional exponent to a negative fractional exponent."
  ],
  "representationTransitions": [
    {
      "from": "reciprocal cube-root notation",
      "to": "single negative fractional power",
      "purpose": "write the expression in the requested x^n form"
    }
  ],
  "stageCount": 2,
  "numberTypes": [
    "FRACTION",
    "SURD",
    "POWER",
    "NEGATIVE",
    "ALGEBRAIC"
  ],
  "fractionalIndicesPresent": true,
  "negativeIndicesPresent": true,
  "rootNotationPresent": true,
  "bracketedExpressionPresent": false,
  "algebraicFractionPresent": true,
  "additiveTermsPresent": false,
  "coefficientSimplificationRequired": false,
  "positivePowerOutputExplicit": false,
  "simplestFormExplicit": false,
  "reasoningTypes": [
    "DIRECT_PROCEDURE",
    "MULTI_STAGE",
    "REPRESENTATION_TRANSLATION",
    "STRUCTURE_RECOGNITION"
  ],
  "overallDifficulty": "MEDIUM",
  "algebraicLoad": "LOW",
  "representationLoad": "MEDIUM",
  "difficultyDrivers": [
    "translating root notation into a fractional index",
    "combining reciprocal structure with the fractional exponent",
    "meeting a prescribed single-power output form"
  ],
  "structuralSignature": [
    "reciprocal radical",
    "cube-root denominator",
    "single algebraic base",
    "root-to-fractional translation",
    "negative fractional final index"
  ],
  "surfaceStyleId": "RECIPROCAL_ROOT_TO_SINGLE_POWER",
  "promptSentenceCount": 1,
  "promptWordCount": 7,
  "introductionStyle": "BARE_SYMBOLIC_EXPRESSION",
  "commandStyle": "EXPRESS_IN_PRESCRIBED_POWER_FORM",
  "informationOrder": [
    "EXPRESS_COMMAND",
    "RECIPROCAL_ROOT_EXPRESSION",
    "TARGET_POWER_FORM"
  ],
  "normalisedPromptStructure": [
    "Ask for a reciprocal root expression to be represented as one power of the same base."
  ],
  "lexicalFeatureTags": [
    "abstract mathematics",
    "root notation",
    "fractional index",
    "negative index",
    "prescribed form"
  ],
  "answerSpaceCategory": "LARGE",
  "estimatedWritingLines": 8,
  "responseTopPt": 444.9,
  "responseBottomPt": 747.1,
  "responseBoundaryConvention": "Bottom of the Q12 mathematical expression to the top of the turn-over footer."
}
);
