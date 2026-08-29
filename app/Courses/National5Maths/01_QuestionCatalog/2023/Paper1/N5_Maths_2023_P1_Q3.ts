import { createA8QuestionCatalogEntry } from "../../A8SimultaneousEquationsCatalogFactory";

export const N5_MATHS_2023_P1_Q3 = createA8QuestionCatalogEntry({
  year: 2023,
  paper: "P1",
  questionNumber: "3",
  pdfPage: 4,
  printedPageLabel: "page 04",
  mode: "ABSTRACT_SOLVE",
  equations: [{ a: 2, b: 3, c: 8 }, { a: 5, b: 2, c: -2 }],
  variableSymbols: ["x", "y"],
  solution: [-2, 4],
  numberTypes: ["INTEGER", "NEGATIVE", "ALGEBRAIC"],
  responseRegions: [
    { id: "Q3_SPACE_MAIN", partIds: ["Q3_MAIN"], topPt: 133.3, bottomPt: 774.8, boundaryConvention: "Bottom of the equation system to the top of the footer/barcode block." },
  ],
  answerSpaceCategory: "FULL_PAGE",
  estimatedWritingLines: 18,
  promptWordCount: 12,
  promptSentenceCount: 1,
  algebraicallyExplicit: true,
});
