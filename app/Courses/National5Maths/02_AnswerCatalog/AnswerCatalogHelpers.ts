import type { Paper } from "@/app/Assessments/AssessmentTypes";
import type {
  AnswerGenerationProfile,
  AnswerIntegrityProfile,
  AnswerOnlyTreatment,
  AnswerSourcePresentationProfile,
  ConsistencyFeatureObservation,
  CorrectAnswerWithoutWorkingProfile,
  CrossCorpusConsistencyAnalysis,
  MarkingComparisonKey,
  MarkNode,
  MarkType,
  MethodEquivalenceProfile,
  PresentationPolicy,
  VisualMarkingProfile,
  WorkingEvidencePolicy,
} from "./AnswerCatalogTypes";
import type {
  CatalogConfidence,
  CatalogEvidenceRef,
  CatalogProvenance,
  CatalogReviewProfile,
  CatalogValue,
} from "../CatalogCoreTypes";
import type { QuestionPartId, QuestionResponseType, QuestionUnitProfile } from "../01_QuestionCatalog/QuestionCatalogTypes";

const printedLabelByPdfPage: Record<number, string> = {
  2: "Page two",
  3: "Page three",
  4: "Page four",
  5: "Page five",
  6: "Page six",
  7: "Page seven",
  8: "Page eight",
  9: "Page nine",
  10: "Page ten",
  11: "Page eleven",
  12: "Page twelve",
  13: "Page thirteen",
  14: "Page fourteen",
  15: "Page fifteen",
  16: "Page sixteen",
  17: "Page seventeen",
  18: "Page eighteen",
  19: "Page nineteen",
  20: "Page twenty",
  21: "Page twenty-one",
  22: "Page twenty-two",
};

export const msEvidence = (
  questionNumber: string,
  pdfPage: number,
  evidenceType: "MARKING_SCHEME" | "GENERAL_MARKING_POLICY" = "MARKING_SCHEME",
  paper: Paper = "P1",
  year = 2014,
  printedPageLabel: string | null = null,
): CatalogEvidenceRef => ({
  documentId: `N5_MATH_${year}_MS`,
  pdfPages: [pdfPage],
  printedPageLabels: [printedPageLabel ?? (year === 2014 ? printedLabelByPdfPage[pdfPage] ?? `PDF page ${pdfPage}` : `PDF page ${pdfPage}`)],
  paper,
  questionLocator: evidenceType === "GENERAL_MARKING_POLICY" ? null : `Q${questionNumber}`,
  evidenceType,
  locatorNote: evidenceType === "GENERAL_MARKING_POLICY" ? `${year} National 5 Mathematics ${paper} general marking principles.` : null,
});

type GeneralPolicyLocator = { pdfPages: number[]; printedPageLabels: string[] };

const generalPolicyLocators: Record<number, Record<Paper, GeneralPolicyLocator>> = {
  2014: {
    P1: { pdfPages: [2], printedPageLabels: ["Page two"] },
    P2: { pdfPages: [12], printedPageLabels: ["Page twelve"] },
  },
  2024: {
    P1: { pdfPages: [2, 3, 4], printedPageLabels: ["page 02", "page 03", "page 04"] },
    P2: { pdfPages: [23, 24, 25], printedPageLabels: ["page 02", "page 03", "page 04"] },
  },
};

export const generalPolicyEvidence = (paper: Paper = "P1", year = 2014): CatalogEvidenceRef => {
  const locator = generalPolicyLocators[year]?.[paper];
  return {
    documentId: `N5_MATH_${year}_MS`,
    pdfPages: locator?.pdfPages ?? [],
    printedPageLabels: locator?.printedPageLabels ?? [],
    paper,
    questionLocator: null,
    evidenceType: "GENERAL_MARKING_POLICY",
    locatorNote: `${year} National 5 Mathematics ${paper} general marking principles.`,
  };
};

export const catalogValue = <T>(
  value: T,
  evidence: CatalogEvidenceRef[] = [],
  provenance: CatalogProvenance = "CATALOGUE_CLASSIFICATION",
  confidence: CatalogConfidence = "HIGH",
  notes: string | null = null,
): CatalogValue<T> => ({ state: "VALUE", value, confidence, provenance, evidence, notes });

export const notReviewed = <T>(notes: string | null = null): CatalogValue<T> => ({
  state: "NOT_REVIEWED",
  value: null,
  confidence: null,
  provenance: null,
  evidence: [],
  notes,
});

export const notApplicable = <T>(notes: string | null = null): CatalogValue<T> => ({
  state: "NOT_APPLICABLE",
  value: null,
  confidence: "HIGH",
  provenance: "CATALOGUE_CLASSIFICATION",
  evidence: [],
  notes,
});

export const answerIntegrity = (): AnswerIntegrityProfile => ({
  sourceFactsPreservedWithoutHarmonisation: true,
  unsupportedAssumptionsStoredAsFacts: false,
  crossCorpusAnalysisMayOverrideSourceFacts: false,
  historicalMarkingWordingStored: false,
  historicalSourceGeometryReusableByGenerator: false,
  builderRequirementsMayOverrideCatalogueTruth: false,
  generatorDecisionsDeferredFromSourceCatalogue: true,
});

export const answerReviewInProgress = (questionNumber: string, paper: Paper = "P1", year = 2014): CatalogReviewProfile => ({
  status: "IN_PROGRESS",
  sourceFactsComplete: true,
  classificationComplete: true,
  generationAnalysisComplete: false,
  counterpartCrossChecked: true,
  visualEvidenceCrossChecked: true,
  unresolvedIssues: [
    "Cross-corpus consistency analysis remains NOT_REVIEWED until a dedicated comparison pass is completed.",
    "Answer/marking-scheme generation analysis is deliberately deferred from the historical source catalogue.",
  ],
  validationNotes: [
    `${year} ${paper === "P2" ? "Paper 2" : "Paper 1"} Q${questionNumber} was catalogued from the matching Question and Finalised Marking Instructions as paired evidence.`,
  ],
  reviewedAt: null,
});

export const notReviewedConsistency = (
  comparisonKey: MarkingComparisonKey,
  factualFingerprint: ConsistencyFeatureObservation[],
): { factualFingerprint: ConsistencyFeatureObservation[]; crossCorpusAnalysis: CrossCorpusConsistencyAnalysis } => ({
  factualFingerprint,
  crossCorpusAnalysis: {
    classification: "NOT_REVIEWED",
    comparisonKey,
    comparedEntryIds: [],
    supportingEntryIds: [],
    contradictingEntryIds: [],
    sampleSize: 0,
    observedPattern: null,
    distinguishingConditions: [],
    unresolvedQuestions: ["Cross-corpus consistency analysis has not yet been completed for this comparison key."],
    analysisMayAlterSourceFacts: false,
    provenance: "GENERATION_ANALYSIS",
  },
});

export const generationNotReviewed = (): CatalogValue<AnswerGenerationProfile> =>
  notReviewed<AnswerGenerationProfile>("Historical marking evidence is being catalogued before answer-generation policy is designed.");

export const emptyMethodEquivalence = (): MethodEquivalenceProfile => ({
  equivalentMethodGroups: [],
  methodEligibilityRules: [],
});

export const emptyVisualMarking = (): VisualMarkingProfile => ({
  requirements: [],
  candidateVisualWorkCanEarnMarks: false,
  exactVisualAccuracyRequired: false,
  approximateVisualAccuracyAccepted: false,
  visualWorkMayProvideWorkingEvidence: false,
});

export const answerOnly = (
  treatment: AnswerOnlyTreatment,
  marksAwarded: number | null,
  markIdsAwarded: string[],
  evidence: CatalogEvidenceRef[],
  sourceDirectiveIds: string[] = [],
  conditions: string[] = [],
  notes: string | null = null,
): CorrectAnswerWithoutWorkingProfile => ({
  treatment,
  marksAwarded,
  markIdsAwarded,
  conditions,
  sourceDirectiveIds,
  sourceEvidence: evidence,
  notes,
});

export const workingPolicy = (
  correctAnswerWithoutWorking: CorrectAnswerWithoutWorkingProfile,
  workingMandatoryForMarkIds: string[] = [],
  workingMayBeImpliedForMarkIds: string[] = [],
  paper: Paper = "P1",
  year = 2014,
): WorkingEvidencePolicy => ({
  correctAnswerWithoutWorking,
  partSpecificAnswerOnly: [],
  workingMandatoryForMarkIds,
  workingMayBeImpliedForMarkIds,
  diagramWorkCanScore: false,
  graphWorkCanScore: false,
  tableWorkCanScore: false,
  laterPartCanSupplyEvidence: false,
  earlierPartCanSupplyEvidence: false,
  repeatedSubstitutionAccepted: notReviewed<boolean>(),
  unsupportedCalculatorAnswerAccepted:
    paper === "P1"
      ? notApplicable<boolean>(`${year} Paper 1 is non-calculator.`)
      : notReviewed<boolean>(`${year} Paper 2 permits calculators; retain question-specific evidence about unsupported calculator outputs rather than inferring a paper-wide rule.`),
});

export const presentationPolicy = (
  evidence: CatalogEvidenceRef[],
  overrides: Partial<PresentationPolicy> = {},
): PresentationPolicy => ({
  precision: {
    finalPrecisionType: "NONE",
    finalPrecisionValue: null,
    acceptedFinalRange: null,
    prematureRoundingTreatment: "NOT_RELEVANT",
    minimumIntermediatePrecision: null,
    sourceEvidence: evidence,
  },
  simplification: "NOT_STATED",
  exactValue: "NOT_STATED",
  units: "NOT_STATED",
  degreeSymbol: "NOT_RELEVANT",
  coordinateBrackets: "NOT_RELEVANT",
  vectorBrackets: "NOT_RELEVANT",
  vectorOrientation: "NOT_RELEVANT",
  positivePowers: "NOT_RELEVANT",
  rationalDenominator: "NOT_RELEVANT",
  contextualWording: "NOT_RELEVANT",
  answerLabelling: "NOT_RELEVANT",
  significantNotationRequirements: [],
  otherConditions: [],
  sourceEvidence: evidence,
  ...overrides,
});

export const sourcePresentation = (
  sourcePages: number[],
  layoutFamily: AnswerSourcePresentationProfile["layoutFamily"],
  methodBlockCount: number,
  noteCount: number,
  explicitlyListedCommonResponseCount: number,
  measuredBlocks: AnswerSourcePresentationProfile["measuredBlocks"] = [],
): AnswerSourcePresentationProfile => ({
  layoutFamily,
  expectedAnswerShown: true,
  genericMarkRequirementsShown: true,
  illustrativeEvidenceShown: true,
  methodBlockCount,
  noteCount,
  explicitlyListedCommonResponseCount,
  sourcePages,
  measuredBlocks,
});

export const consistencyFeature = (
  featureId: string,
  value: string | number | boolean | null,
  normalisedMeaning: string,
  evidence: CatalogEvidenceRef[],
): ConsistencyFeatureObservation => ({
  featureId,
  value,
  normalisedMeaning,
  provenance: "NORMALISED_SOURCE_FACT",
  sourceEvidence: evidence,
});

export const comparisonKey = (
  id: string,
  questionFamilyId: string,
  skillIds: string[],
  markCount: number,
  responseTypes: QuestionResponseType[],
  comparisonDimensions: string[],
): MarkingComparisonKey => ({ id, questionFamilyId, skillIds, markCount, responseTypes, comparisonDimensions });

export const defaultFollowThrough = (evidence: CatalogEvidenceRef[]): MarkNode["followThrough"] => {
  const paper: Paper = evidence[0]?.paper === "P2" ? "P2" : "P1";
  const sourceDocumentId = evidence[0]?.documentId ?? "N5_MATH_2014_MS";
  const year = Number(sourceDocumentId.match(/N5_MATH_(\d{4})_MS/)?.[1] ?? 2014);
  return {
    allowed: true,
    fromMarkIds: [],
    fromQuestionPartIds: [],
    requiresComparableDifficulty: true,
    blockedForRequiredResult: false,
    blockedByInvalidMathematicalState: true,
    blockedByTrivialisedLaterWork: true,
    sourceBasis: "GENERAL_POLICY",
    sourceEvidence: [generalPolicyEvidence(paper, year), ...evidence],
    notes: `General ${year} follow-through principle applies unless a question-specific directive overrides it.`,
  };
};

export const noFollowThrough = (evidence: CatalogEvidenceRef[], notes: string | null = null): MarkNode["followThrough"] => ({
  allowed: false,
  fromMarkIds: [],
  fromQuestionPartIds: [],
  requiresComparableDifficulty: false,
  blockedForRequiredResult: false,
  blockedByInvalidMathematicalState: true,
  blockedByTrivialisedLaterWork: false,
  sourceBasis: "QUESTION_SPECIFIC",
  sourceEvidence: evidence,
  notes,
});

export const markNode = (
  id: string,
  markNumber: number,
  questionPartId: QuestionPartId,
  primaryType: MarkType,
  officialRequirement: string,
  genericPurpose: string,
  skillIds: string[],
  conceptIds: string[],
  linkedSubgoalIds: string[],
  evidence: CatalogEvidenceRef[],
  options: Partial<Omit<MarkNode, "id" | "markNumber" | "markValue" | "questionPartId" | "primaryType" | "officialRequirement" | "genericPurpose" | "skillIds" | "conceptIds" | "linkedSubgoalIds" | "sourceEvidence" | "confidence">> = {},
): MarkNode => ({
  id,
  markNumber,
  markValue: 1,
  questionPartId,
  primaryType,
  secondaryTypes: [],
  officialRequirement,
  illustrativeEvidence: [],
  pathwaySpecificRequirements: [],
  genericPurpose,
  linkedSubgoalIds,
  skillIds,
  conceptIds,
  dependencies: [],
  followThrough: defaultFollowThrough(evidence),
  eligibilityConditions: [],
  blockingConditions: [],
  methodPathwayIds: [],
  presentationConditions: [],
  visualRequirementIds: [],
  sourceDirectiveIds: [],
  sourceEvidence: evidence,
  confidence: "HIGH",
  ...options,
});

export const unitProfile = (
  dimension: string | null,
  unitSymbol: string | null,
  unitsExplicitlyRequested = false,
): QuestionUnitProfile => ({
  dimension,
  unitSymbol,
  conversionRequired: false,
  unitsExplicitlyRequested,
});

export const GENERAL_2014_RULE_IDS = [
  "N5_MATH_2014_RULE_MARK_TO_INSTRUCTIONS",
  "N5_MATH_2014_RULE_POSITIVE_MARKING",
  "N5_MATH_2014_RULE_SPECIFIC_GUIDELINES_CONTROL",
  "N5_MATH_2014_RULE_ANY_VALID_METHOD",
  "N5_MATH_2014_RULE_FOLLOW_THROUGH_COMPARABLE_DIFFICULTY",
  "N5_MATH_2014_RULE_TRANSCRIPTION_PROCESSING",
  "N5_MATH_2014_RULE_SCORED_OUT_WORK",
  "N5_MATH_2014_RULE_MULTIPLE_ATTEMPTS_LOWEST",
  "N5_MATH_2014_RULE_LATER_WORK_AFTER_CORRECT",
  "N5_MATH_2014_RULE_CORRECT_WORK_WRONG_PART",
  "N5_MATH_2014_RULE_LEGITIMATE_VARIATION",
  "N5_MATH_2014_RULE_BAD_FORM",
  "N5_MATH_2014_RULE_REPEATED_ERROR_WITHIN_QUESTION",
] as const;
