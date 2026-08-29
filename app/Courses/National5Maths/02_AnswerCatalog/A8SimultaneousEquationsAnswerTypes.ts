import type { QuestionCatalogEntry } from "../01_QuestionCatalog/QuestionCatalogTypes";
import type { A8CorpusSurfaceFamily, A8HistoricalMarkProfile } from "./A8_SimultaneousEquations/A8CrossCorpusAnalysis";


export type A8RejectedMethod = "GUESS_AND_CHECK" | "REPEATED_SUBSTITUTION" | null;

export type A8AnswerConfig = {
  question: QuestionCatalogEntry;
  msPages: number[];
  printedPageLabels: string[];
  solution: [number, number];
  variableSymbols: [string, string];
  surfaceFamily: A8CorpusSurfaceFamily;
  markProfile: A8HistoricalMarkProfile;
  detailedAnswerOnly: "NO_CREDIT" | "NOT_STATED";
  rejectedMethod: A8RejectedMethod;
  roundedFollowThroughAtLeastDp?: number;
  reversedCoordinateFullCredit?: boolean;
  separateScalingEitherCorrect?: boolean;
  finalFractionConversionNotPenalised?: boolean;
  context?: {
    equationAnswers: [string, string];
    objectLabels: [string, string];
    unitDimension: string | null;
    unitSymbol: string | null;
    communicationRequired: boolean;
    communicationConditions: string[];
    negativeValuesBlockFinalMark: boolean;
    equationBadFormAccepted?: string[];
    earlierPartEvidenceCanAppearLater?: boolean;
    firstEquationRequiresSpecifiedVariables?: boolean;
    derivedAnswer?: number;
    derivedCoefficients?: [number, number];
    derivedUnit?: string | null;
    currencyNearestPennyForFinalCommunication?: boolean;
    invalidCommunicationForms?: string[];
  };

};
