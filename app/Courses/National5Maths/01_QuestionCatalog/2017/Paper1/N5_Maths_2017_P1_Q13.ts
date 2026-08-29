import { createA8QuestionCatalogEntry } from "../../A8SimultaneousEquationsCatalogFactory";

export const N5_MATHS_2017_P1_Q13 = createA8QuestionCatalogEntry({
  year: 2017,
  paper: "P1",
  questionNumber: "13",
  pdfPage: 12,
  printedPageLabel: "Page 12",
  mode: "GRAPH_INTERSECTION_SOLVE",
  equations: [{ a: 3, b: -1, c: 2 }, { a: 1, b: 3, c: 19 }],
  variableSymbols: ["x", "y"],
  solution: [2.5, 5.5],
  numberTypes: ["INTEGER", "DECIMAL", "ALGEBRAIC"],
  responseRegions: [
    { id: "Q13_SPACE_MAIN", partIds: ["Q13_MAIN"], topPt: 345.2, bottomPt: 774.8, boundaryConvention: "Bottom of the algebraic-coordinate command to the top of the footer/barcode block." },
  ],
  answerSpaceCategory: "LARGE",
  estimatedWritingLines: 12,
  promptWordCount: 31,
  promptSentenceCount: 3,
  algebraicallyExplicit: true,
});
