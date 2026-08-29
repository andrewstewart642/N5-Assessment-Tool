import { N5_MATHS_2022_P2_Q4 as question } from "../../../01_QuestionCatalog/2022/Paper2/N5_Maths_2022_P2_Q4";
import { createA8AnswerCatalogEntry } from "../../A8SimultaneousEquationsCatalogFactory";

export const N5_MATHS_2022_P2_Q4_MS = createA8AnswerCatalogEntry({
  question,
  msPages: [25, 26],
  printedPageLabels: ["page 08", "page 09"],
  solution: [0.8, 0.35],
  variableSymbols: ["m", "a"],
  surfaceFamily: "CONTEXT_FORM_AND_SOLVE",
  markProfile: "FORM_FORM_SCALE_VALUE_VALUE_COMMUNICATE",
  detailedAnswerOnly: "NO_CREDIT",
  rejectedMethod: "GUESS_AND_CHECK",
  context: {
    equationAnswers: ["4m+3a=4.25", "5m+2a=4.70"],
    objectLabels: ["mango", "apple"],
    unitDimension: "currency",
    unitSymbol: "£",
    communicationRequired: true,
    communicationConditions: ["both words mango and apple are stated", "each value is written in an accepted pound or pence form to the nearest penny"],
    negativeValuesBlockFinalMark: true,
    equationBadFormAccepted: ["equivalent equation totals expressed consistently in pence", "a currency symbol or pence suffix attached to an equation total as source-defined bad form"],
    earlierPartEvidenceCanAppearLater: true,
    currencyNearestPennyForFinalCommunication: true,
    invalidCommunicationForms: ["£0.8 for the mango final communication", "£0.80p", "£0.35p"],
  },
});
