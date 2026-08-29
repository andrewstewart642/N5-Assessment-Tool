import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P2_Q1 as question } from "../../../01_QuestionCatalog/2014/Paper2/N5_Maths_2014_P2_Q1";
import {
  GENERAL_2014_RULE_IDS,
  answerIntegrity,
  answerOnly,
  answerReviewInProgress,
  comparisonKey,
  consistencyFeature,
  emptyMethodEquivalence,
  emptyVisualMarking,
  generationNotReviewed,
  markNode,
  msEvidence,
  notReviewedConsistency,
  presentationPolicy,
  sourcePresentation,
  unitProfile,
  workingPolicy,
} from "../../AnswerCatalogHelpers";

const evidence = msEvidence("1", 13, "MARKING_SCHEME", "P2", 2014);
const M1 = "N5_MATH_2014_P2_Q1_M1";
const M2 = "N5_MATH_2014_P2_Q1_M2";
const M3 = "N5_MATH_2014_P2_Q1_M3";
const P1 = "N5_MATH_2014_P2_Q1_METHOD_COMPOUND_MULTIPLIER";
const D1 = "N5_MATH_2014_P2_Q1_D_590_ANSWER_ONLY";
const D2 = "N5_MATH_2014_P2_Q1_D_UNROUNDED_ANSWER_ONLY";
const D3 = "N5_MATH_2014_P2_Q1_D_WRONG_PERCENT_FT";
const D4 = "N5_MATH_2014_P2_Q1_D_LINEAR_REPEAT_MULTIPLY";
const D5 = "N5_MATH_2014_P2_Q1_D_LINEAR_SUBTRACT";
const D6 = "N5_MATH_2014_P2_Q1_D_PERCENT_ONLY";

export const N5_MATHS_2014_P2_Q1_MS = {
  identity: {
    id: question.identity.answerCatalogId,
    schemaVersion: "N5_CATALOG_V2",
    sourceQuestionId: question.identity.id,
    courseId: question.identity.courseId,
    paperContextId: question.identity.paperContextId,
    year: 2014,
    paper: "P2",
    questionNumber: "1",
    questionFamilyId: question.family.familyId,
  },
  sourceContext: {
    sourceDocumentId: "N5_MATH_2014_MS",
    totalMarks: 3,
    sourcePages: [13],
    printedPageLabels: ["Page thirteen"],
    sourceEvidence: [evidence],
    generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY",
  },
  expectedResponse: {
    responseTypes: ["NUMBER"],
    canonicalAnswers: [{
      id: "N5_MATH_2014_P2_Q1_A1",
      normalisedAnswer: "590",
      numericValue: 590,
      answerForm: "NUMBER",
      mathematicallyEquivalentToVariantIds: [],
      conditionsForAcceptance: ["Final expected roll is rounded to the nearest ten."],
      sourceEvidence: [evidence],
      notes: null,
    }],
    acceptedEquivalentForms: [{
      id: "N5_MATH_2014_P2_Q1_A2",
      normalisedAnswer: "592 or 592.0165 before final nearest-ten rounding",
      numericValue: 592,
      answerForm: "NUMBER",
      mathematicallyEquivalentToVariantIds: [],
      conditionsForAcceptance: ["Explicitly receives two marks without working; the final rounding mark is not earned."],
      sourceEvidence: [evidence],
      notes: "Historically credited intermediate/final value, not a fully correct response to the rounding instruction.",
    }],
    precisionType: "NEAREST_UNIT",
    precisionValue: 10,
    acceptedRange: null,
    units: unitProfile("count", "pupils"),
    requiredContextStatement: false,
    answerCountRequired: 1,
    invalidRelatedValues: ["2460", "530", "430"],
    extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D1, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "AWARD", normalisedSummary: "The correctly rounded value 590 receives all three marks even when no working is shown.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M1, M2, M3], appliesToMethodIds: [P1], marksAwarded: 3, maximumMarks: 3, sourceEvidence: [evidence] },
    { id: D2, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "AWARD", normalisedSummary: "An unrounded value of 592 or 592.0165 without working receives two marks and not the final rounding mark.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M1, M2], appliesToMethodIds: [P1], marksAwarded: 2, maximumMarks: 2, sourceEvidence: [evidence] },
    { id: D3, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "FOLLOW_THROUGH", normalisedSummary: "If the percentage used is wrong, later valid work can still make the second and third marks available.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M2, M3], appliesToMethodIds: [P1], marksAwarded: null, maximumMarks: 2, sourceEvidence: [evidence] },
    { id: D4, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "LIMIT", normalisedSummary: "Multiplying the annual retention result by three rather than compounding it receives only the first mark.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M2, M3], appliesToMethodIds: [P1], marksAwarded: 1, maximumMarks: 1, sourceEvidence: [evidence] },
    { id: D5, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "LIMIT", normalisedSummary: "Subtracting three times one year's decrease from the original roll receives only the first mark.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M2, M3], appliesToMethodIds: [P1], marksAwarded: 1, maximumMarks: 1, sourceEvidence: [evidence] },
    { id: D6, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "BLOCK", normalisedSummary: "Multiplying the original roll by the percentage decrease and by three receives no marks.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M1, M2, M3], appliesToMethodIds: [P1], marksAwarded: 0, maximumMarks: 0, sourceEvidence: [evidence] },
  ],
  markNodes: [
    markNode(M1, 1, "Q1_MAIN", "PROCESS", "Establish a valid 15% annual decrease.", "Convert the decrease rate into an annual retention operation.", ["num-n4-appreciation-depreciation"], ["num-n4-2-depreciation"], ["Q1_S1"], [evidence], {
      illustrativeEvidence: [{ id: "Q1_M1_E1", normalisedEvidence: "Use the annual retention multiplier 0.85.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }],
      methodPathwayIds: [P1], sourceDirectiveIds: [D1, D2, D4, D5, D6],
    }),
    markNode(M2, 2, "Q1_MAIN", "PROCESS", "Apply the annual decrease over all three years within a valid compound strategy.", "Calculate the three-year roll before final rounding.", ["num-n4-appreciation-depreciation"], ["num-n4-2-depreciation"], ["Q1_S2"], [evidence], {
      illustrativeEvidence: [{ id: "Q1_M2_E1", normalisedEvidence: "Evaluate 964 multiplied by 0.85 to the power 3, or an equivalent compound calculation.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }],
      followThrough: { allowed: true, fromMarkIds: [M1], fromQuestionPartIds: ["Q1_MAIN"], requiresComparableDifficulty: true, blockedForRequiredResult: false, blockedByInvalidMathematicalState: true, blockedByTrivialisedLaterWork: true, sourceBasis: "QUESTION_SPECIFIC", sourceEvidence: [evidence], notes: "The source explicitly allows later credit after an incorrect percentage." },
      methodPathwayIds: [P1], sourceDirectiveIds: [D1, D2, D3, D4, D5, D6],
    }),
    markNode(M3, 3, "Q1_MAIN", "ROUNDING", "Complete a valid strategy correctly and round the resulting roll to the nearest ten.", "Apply the stated final rounding instruction.", ["num-n4-appreciation-depreciation"], ["num-n4-2-depreciation"], ["Q1_S3"], [evidence], {
      secondaryTypes: ["ACCURACY"],
      illustrativeEvidence: [{ id: "Q1_M3_E1", normalisedEvidence: "State 590 after nearest-ten rounding.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }],
      followThrough: { allowed: true, fromMarkIds: [M1], fromQuestionPartIds: ["Q1_MAIN"], requiresComparableDifficulty: true, blockedForRequiredResult: false, blockedByInvalidMathematicalState: true, blockedByTrivialisedLaterWork: true, sourceBasis: "QUESTION_SPECIFIC", sourceEvidence: [evidence], notes: "The source explicitly allows the final mark to survive an incorrect percentage when subsequent work is valid." },
      presentationConditions: ["Nearest-ten rounding is mark-bearing."],
      methodPathwayIds: [P1], sourceDirectiveIds: [D1, D2, D3, D4, D5, D6],
    }),
  ],
  methodPathways: [{
    id: P1,
    variantId: "COMPOUND_MULTIPLIER",
    evidenceRole: "PRIMARY_ILLUSTRATIVE",
    supportsFullCredit: true,
    applicabilityConditions: [],
    steps: [
      { id: "Q1_P1_S1", order: 1, normalisedStep: "Use 0.85 as the multiplier for a 15% decrease.", linkedQuestionSubgoalIds: ["Q1_S1"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["PERCENTAGE_TO_MULTIPLIER"], resultingStateSummary: "annual multiplier 0.85", sourceEvidence: [evidence] },
      { id: "Q1_P1_S2", order: 2, normalisedStep: "Apply the multiplier for three annual periods.", linkedQuestionSubgoalIds: ["Q1_S2"], linkedMarkIds: [M2], dependsOnStepIds: ["Q1_P1_S1"], requiredOperations: ["MULTIPLY", "POWER"], resultingStateSummary: "approximately 592.0165", sourceEvidence: [evidence] },
      { id: "Q1_P1_S3", order: 3, normalisedStep: "Round the calculated roll to the nearest ten.", linkedQuestionSubgoalIds: ["Q1_S3"], linkedMarkIds: [M3], dependsOnStepIds: ["Q1_P1_S2"], requiredOperations: ["ROUND"], resultingStateSummary: "590", sourceEvidence: [evidence] },
    ],
    markMappingComplete: true,
    sourceTotalAwardRules: [D1, D2],
    mathematicallyEquivalentMethodIds: [],
    materiallyDistinctFromMethodIds: [],
    excludedMethodReasons: [],
    sourceEvidence: [evidence],
  }],
  methodEquivalence: emptyMethodEquivalence(),
  workingPolicy: workingPolicy(answerOnly("FULL_CREDIT", 3, [M1, M2, M3], [evidence], [D1]), [], [M1, M2], "P2", 2014),
  presentationPolicy: presentationPolicy([evidence], {
    precision: { finalPrecisionType: "NEAREST_UNIT", finalPrecisionValue: 10, acceptedFinalRange: null, prematureRoundingTreatment: "NOT_STATED", minimumIntermediatePrecision: null, sourceEvidence: [evidence] },
  }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [
    { id: "Q1_CR_UNROUNDED", sourceStatus: "EXPLICITLY_LISTED", category: "ROUNDING_ERROR", errorFamily: "FINAL_ROUNDING_OMITTED", normalisedResponse: "State 592 or 592.0165 without final nearest-ten rounding.", affectedMarkIds: [M3], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [D2], sourceEvidence: [evidence] },
    { id: "Q1_CR_MULTIPLY_BY_THREE", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "LINEAR_INSTEAD_OF_COMPOUND", normalisedResponse: "Use 964 × 0.85 × 3, producing 2460.", affectedMarkIds: [M2, M3], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: false, sourceDirectiveIds: [D4], sourceEvidence: [evidence] },
    { id: "Q1_CR_SUBTRACT_THREE_DECREASES", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "FIXED_DECREASE_INSTEAD_OF_COMPOUND", normalisedResponse: "Subtract three copies of 15% of the original value, producing 530.", affectedMarkIds: [M2, M3], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: false, sourceDirectiveIds: [D5], sourceEvidence: [evidence] },
    { id: "Q1_CR_PERCENT_TIMES_THREE", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "DECREASE_AMOUNT_TREATED_AS_FINAL", normalisedResponse: "Use 964 × 0.15 × 3, producing 430.", affectedMarkIds: [M1, M2, M3], marksAwarded: 0, maximumMarks: 0, followThroughAvailable: false, sourceDirectiveIds: [D6], sourceEvidence: [evidence] },
  ],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D1, D2, D3, D4, D5, D6] },
  relationship: {
    partMarkMap: [{ questionPartId: "Q1_MAIN", markIds: [M1, M2, M3] }],
    subgoalMarkMap: [{ questionSubgoalId: "Q1_S1", markIds: [M1] }, { questionSubgoalId: "Q1_S2", markIds: [M2] }, { questionSubgoalId: "Q1_S3", markIds: [M3] }],
    promptInstructionConsequences: [{ instructionType: "NEAREST_TEN", markingConsequence: "The final mark is tied to carrying out the requested nearest-ten rounding.", affectedMarkIds: [M3], sourceEvidence: [evidence] }],
    informationEvidenceMap: [
      { questionInformationId: "Q1_INFO_START", usedByMethodIds: [P1], supportsMarkIds: [M2, M3] },
      { questionInformationId: "Q1_INFO_RATE", usedByMethodIds: [P1], supportsMarkIds: [M1, M2, M3] },
      { questionInformationId: "Q1_INFO_YEARS", usedByMethodIds: [P1], supportsMarkIds: [M2, M3] },
      { questionInformationId: "Q1_INFO_ROUND", usedByMethodIds: [P1], supportsMarkIds: [M3] },
    ],
    representationEvidenceMap: [],
    crossPartDependencies: [],
    errorPropagationGraph: [{ sourceMarkIds: [M1], sourceQuestionPartIds: ["Q1_MAIN"], affectedMarkIds: [M2, M3], survivingMarkIds: [M2, M3], conditionSummary: "An incorrect percentage can be followed through through the later compound calculation and rounding stages.", sourceEvidence: [evidence] }],
  },
  sourcePresentation: sourcePresentation([13], "TABLE_ROW", 1, 6, 0),
  consistency: notReviewedConsistency(
    comparisonKey("P2_Q1_MARKING_COMPARISON", question.family.familyId, ["num-n4-appreciation-depreciation"], 3, ["NUMBER"], ["answer-only credit", "compound-vs-linear error", "final rounding", "follow-through after wrong percentage"]),
    [
      consistencyFeature("answer_only_treatment", "FULL_CREDIT", "The correctly rounded answer alone explicitly receives all three marks.", [evidence]),
      consistencyFeature("unrounded_answer_only_marks", 2, "The unrounded compound result alone explicitly receives two marks.", [evidence]),
      consistencyFeature("wrong_percentage_follow_through_available", true, "Later credit remains possible after an incorrect percentage.", [evidence]),
    ],
  ),
  integrity: answerIntegrity(),
  generation: generationNotReviewed(),
  review: answerReviewInProgress("1", "P2", 2014),
} satisfies AnswerCatalogEntry;
