import { N5_MATHS_2025_P2_Q10 as question } from "../../../01_QuestionCatalog/2025/Paper2/N5_Maths_2025_P2_Q10";
import { createA8AnswerCatalogEntry } from "../../A8SimultaneousEquationsCatalogFactory";

export const N5_MATHS_2025_P2_Q10_MS = createA8AnswerCatalogEntry({
  question,
  msPages: [40],
  printedPageLabels: ["page 18"],
  solution: [300, 100],
  variableSymbols: ["p", "e"],
  surfaceFamily: "CONTEXT_DERIVED_TOTAL",
  markProfile: "FORM_FORM_SCALE_VALUE_VALUE_DERIVED",
  detailedAnswerOnly: "NO_CREDIT",
  rejectedMethod: "REPEATED_SUBSTITUTION",
  context: {
    equationAnswers: ["7p+3e=2400", "3p+4e=1300"],
    objectLabels: ["paving-slab stack", "edging-block stack"],
    unitDimension: "mass",
    unitSymbol: "kg",
    communicationRequired: false,
    communicationConditions: [],
    negativeValuesBlockFinalMark: true,
    equationBadFormAccepted: ["equation totals with kg appended"],
    earlierPartEvidenceCanAppearLater: true,
    firstEquationRequiresSpecifiedVariables: true,
    derivedAnswer: 2300,
    derivedCoefficients: [6, 5],
    derivedUnit: "kg",
  },
});
