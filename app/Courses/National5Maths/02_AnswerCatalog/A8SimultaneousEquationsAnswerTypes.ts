import type { QuestionCatalogEntry } from "../01_QuestionCatalog/QuestionCatalogTypes";
import type { A8QuestionMode } from "../01_QuestionCatalog/A8SimultaneousEquationsCatalogTypes";

// Historical A8 source classifications belong to the catalogue layers. 03_SkillCatalog
// may synthesise these classifications across the corpus, but 02_AnswerCatalog must
// never import its types backwards from that downstream layer.
export type A8CorpusSurfaceFamily = A8QuestionMode;

export type A8HistoricalMarkProfile =
  | "SCALE_STRATEGY_CORRECT"
  | "SCALE_VALUE_VALUE"
  | "FORM_FORM_SCALE_STRATEGY_CORRECT_COMMUNICATE"
  | "FORM_FORM_SCALE_VALUE_VALUE_COMMUNICATE"
  | "FORM_FORM_SCALE_VALUE_VALUE_DERIVED";

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
