import { createA8QuestionCatalogEntry } from "../../A8SimultaneousEquationsCatalogFactory";

export const N5_MATHS_2015_P1_Q11 = createA8QuestionCatalogEntry({
  year: 2015,
  paper: "P1",
  questionNumber: "11",
  pdfPage: 10,
  printedPageLabel: "Page ten",
  mode: "ABSTRACT_SOLVE",
  equations: [{ a: 3, b: 2, c: 17 }, { a: 2, b: 5, c: 4 }],
  variableSymbols: ["x", "y"],
  solution: [7, -2],
  numberTypes: ["INTEGER", "NEGATIVE"],
  responseRegions: [
    { id: "Q11_SPACE_MAIN", partIds: ["Q11_MAIN"], topPt: 128.9, bottomPt: 774.8, boundaryConvention: "Bottom of the equation system to the top of the footer/barcode block." },
  ],
  answerSpaceCategory: "FULL_PAGE",
  estimatedWritingLines: 18,
  promptWordCount: 12,
  promptSentenceCount: 1,
  algebraicallyExplicit: true,
});
