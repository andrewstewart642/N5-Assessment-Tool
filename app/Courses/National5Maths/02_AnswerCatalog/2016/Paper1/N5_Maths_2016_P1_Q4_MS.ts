import { N5_MATHS_2016_P1_Q4 as question } from "../../../01_QuestionCatalog/2016/Paper1/N5_Maths_2016_P1_Q4";
import { createA8AnswerCatalogEntry } from "../../A8SimultaneousEquationsCatalogFactory";

export const N5_MATHS_2016_P1_Q4_MS = createA8AnswerCatalogEntry({
  question,
  msPages: [8],
  printedPageLabels: ["Page 08"],
  solution: [1.5, 2.2],
  variableSymbols: ["c", "d"],
  surfaceFamily: "CONTEXT_FORM_AND_SOLVE",
  markProfile: "FORM_FORM_SCALE_STRATEGY_CORRECT_COMMUNICATE",
  detailedAnswerOnly: "NO_CREDIT",
  rejectedMethod: null,
  context: {
    equationAnswers: ["2c+3d=9.6", "3c+4d=13.3"],
    objectLabels: ["cloak", "dress"],
    unitDimension: "area",
    unitSymbol: "m^2",
    communicationRequired: true,
    communicationConditions: ["both contextual object labels are stated", "correct square-metre units are attached to both values"],
    negativeValuesBlockFinalMark: true,
  },
});
