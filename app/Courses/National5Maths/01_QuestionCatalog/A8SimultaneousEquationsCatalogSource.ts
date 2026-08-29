import type { CatalogEvidenceRef } from "../CatalogCoreTypes";
import type { QuestionPdfRenderMeasurement } from "./QuestionCatalogTypes";
import type { A8Equation, A8QuestionConfig, A8ResponseRegion } from "./A8SimultaneousEquationsCatalogTypes";

export const sourceEvidence = (
  config: A8QuestionConfig,
  evidenceType: "QUESTION" | "VISUAL",
): CatalogEvidenceRef => ({
  documentId: `N5_MATH_${config.year}_QP`,
  pdfPages: [config.pdfPage],
  printedPageLabels: [config.printedPageLabel],
  paper: config.paper,
  questionLocator: `Q${config.questionNumber}`,
  evidenceType,
  locatorNote: null,
});
const CONCEPT_ID = "alg-a8-1";
const PAGE_WIDTH_PT = 595.276;
const PAGE_HEIGHT_PT = 841.89;

export const nativeMeasurement = (
  config: A8QuestionConfig,
  region: A8ResponseRegion,
): QuestionPdfRenderMeasurement => {
  const heightPt = Math.max(0, region.bottomPt - region.topPt);
  return {
    id: region.id,
    regionType: "WRITTEN_WORKING",
    questionPartIds: region.partIds,
    pdfPageNumber: config.pdfPage,
    printedPageLabel: config.printedPageLabel,
    measurementMethod: "PDF_NATIVE",
    renderDpi: null,
    pageWidthPx: null,
    pageHeightPx: null,
    topPx: null,
    bottomPx: null,
    leftPx: null,
    rightPx: null,
    heightPx: null,
    widthPx: null,
    topPt: region.topPt,
    bottomPt: region.bottomPt,
    leftPt: null,
    rightPt: null,
    heightPt,
    widthPt: null,
    heightMm: Number((heightPt * 25.4 / 72).toFixed(2)),
    widthMm: null,
    boundaryConvention: region.boundaryConvention,
    notes: `PDF-native vertical measurement on a ${PAGE_WIDTH_PT.toFixed(3)} by ${PAGE_HEIGHT_PT.toFixed(2)} point source page.`,
  };
};

export const equationText = (equation: A8Equation, symbols: [string, string]) =>
  `${equation.a}${symbols[0]} + (${equation.b})${symbols[1]} = ${equation.c}`;
