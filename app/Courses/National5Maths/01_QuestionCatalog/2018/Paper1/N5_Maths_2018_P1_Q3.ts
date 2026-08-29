import { createA8QuestionCatalogEntry } from "../../A8SimultaneousEquationsCatalogFactory";

export const N5_MATHS_2018_P1_Q3 = createA8QuestionCatalogEntry({
  year: 2018,
  paper: "P1",
  questionNumber: "3",
  pdfPage: 4,
  printedPageLabel: "page 04",
  mode: "ABSTRACT_SOLVE",
  equations: [{ a: 4, b: 5, c: -3 }, { a: 6, b: -2, c: 5 }],
  variableSymbols: ["x", "y"],
  solution: [0.5, -1],
  numberTypes: ["INTEGER", "DECIMAL", "NEGATIVE", "ALGEBRAIC"],
  responseRegions: [
    { id: "Q3_SPACE_MAIN", partIds: ["Q3_MAIN"], topPt: 129.5, bottomPt: 448.0, boundaryConvention: "Bottom of the equation system to the top of the next question block." },
  ],
  answerSpaceCategory: "LARGE",
  estimatedWritingLines: 9,
  promptWordCount: 12,
  promptSentenceCount: 1,
  algebraicallyExplicit: true,
});
