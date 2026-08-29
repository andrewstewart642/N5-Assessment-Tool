import { createA8QuestionCatalogEntry } from "../../A8SimultaneousEquationsCatalogFactory";

export const N5_MATHS_2024_P1_Q7 = createA8QuestionCatalogEntry({
  year: 2024,
  paper: "P1",
  questionNumber: "7",
  pdfPage: 6,
  printedPageLabel: "page 06",
  mode: "ABSTRACT_SOLVE",
  equations: [{ a: 2, b: -7, c: 11 }, { a: 3, b: 2, c: 4 }],
  variableSymbols: ["p", "r"],
  solution: [2, -1],
  numberTypes: ["INTEGER", "NEGATIVE", "ALGEBRAIC"],
  responseRegions: [
    { id: "Q7_SPACE_MAIN", partIds: ["Q7_MAIN"], topPt: 359.8, bottomPt: 774.8, boundaryConvention: "Bottom of the equation system to the top of the footer/barcode block." },
  ],
  answerSpaceCategory: "LARGE",
  estimatedWritingLines: 12,
  promptWordCount: 12,
  promptSentenceCount: 1,
  algebraicallyExplicit: true,
});
