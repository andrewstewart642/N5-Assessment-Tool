import { createA8QuestionCatalogEntry } from "../../A8SimultaneousEquationsCatalogFactory";

export const N5_MATHS_2021_P1_Q7 = createA8QuestionCatalogEntry({
  year: 2021,
  paper: "P1",
  questionNumber: "7",
  pdfPage: 6,
  printedPageLabel: "page 06",
  mode: "ABSTRACT_SOLVE",
  equations: [{ a: 5, b: 2, c: 4 }, { a: 4, b: -3, c: 17 }],
  variableSymbols: ["c", "d"],
  solution: [2, -3],
  numberTypes: ["INTEGER", "NEGATIVE", "ALGEBRAIC"],
  responseRegions: [
    { id: "Q7_SPACE_MAIN", partIds: ["Q7_MAIN"], topPt: 128.6, bottomPt: 774.8, boundaryConvention: "Bottom of the equation system to the top of the footer/barcode block." },
  ],
  answerSpaceCategory: "FULL_PAGE",
  estimatedWritingLines: 18,
  promptWordCount: 12,
  promptSentenceCount: 1,
  algebraicallyExplicit: true,
});
