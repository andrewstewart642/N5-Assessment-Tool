import { N5_MATHS_2019_P1_Q8 as question } from "../../../01_QuestionCatalog/2019/Paper1/N5_Maths_2019_P1_Q8";
import { createA8AnswerCatalogEntry } from "../../A8SimultaneousEquationsCatalogFactory";

export const N5_MATHS_2019_P1_Q8_MS = createA8AnswerCatalogEntry({
  question,
  msPages: [12],
  printedPageLabels: ["page 12"],
  solution: [20, 25],
  variableSymbols: ["c", "g"],
  surfaceFamily: "CONTEXT_FORM_AND_SOLVE",
  markProfile: "FORM_FORM_SCALE_VALUE_VALUE_COMMUNICATE",
  detailedAnswerOnly: "NO_CREDIT",
  rejectedMethod: "GUESS_AND_CHECK",
  context: {
    equationAnswers: ["7c+3g=215", "5c+4g=200"],
    objectLabels: ["cement", "gravel"],
    unitDimension: "mass",
    unitSymbol: "kg",
    communicationRequired: true,
    communicationConditions: ["both words cement and gravel are stated", "correct kilogram units are attached to both values"],
    negativeValuesBlockFinalMark: true,
    equationBadFormAccepted: ["7c+3g=215 kg", "5c+4g=200 kg"],
  },
});
