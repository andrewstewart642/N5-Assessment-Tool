import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2024_P2_Q1 as question } from "../../../01_QuestionCatalog/2024/Paper2/N5_Maths_2024_P2_Q1";
import { GENERAL_2024_RULE_IDS } from "../N5_Maths_2024_GeneralMarkingPolicy";
import {
  answerIntegrity,
  answerOnly,
  answerReviewInProgress,
  comparisonKey,
  consistencyFeature,
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

const evidence = msEvidence("1", 26, "MARKING_SCHEME", "P2", 2024, "page 05");
const M1 = "N5_MATH_2024_P2_Q1_M1";
const M2 = "N5_MATH_2024_P2_Q1_M2";
const M3 = "N5_MATH_2024_P2_Q1_M3";
const P1 = "N5_MATH_2024_P2_Q1_METHOD_COMPOUND_POWER";
const P2 = "N5_MATH_2024_P2_Q1_METHOD_YEAR_BY_YEAR";
const D_ANSWER_ONLY = "N5_MATH_2024_P2_Q1_D_ANSWER_ONLY";
const D_ACCEPT_FINALS = "N5_MATH_2024_P2_Q1_D_ACCEPT_FINALS";
const D_YEAR_BY_YEAR = "N5_MATH_2024_P2_Q1_D_YEAR_BY_YEAR";
const D_WRONG_PERCENT = "N5_MATH_2024_P2_Q1_D_WRONG_PERCENT_FT";
const D_WRONG_POWER = "N5_MATH_2024_P2_Q1_D_WRONG_POWER_FT";
const D_LATER_INVALID = "N5_MATH_2024_P2_Q1_D_LATER_INVALID";
const D_DIVIDE_CORRECT_RATE = "N5_MATH_2024_P2_Q1_D_DIVIDE_CORRECT_RATE";
const D_DIVIDE_WRONG_RATE = "N5_MATH_2024_P2_Q1_D_DIVIDE_WRONG_RATE";
const D_ROUND_AFTER_CORRECT = "N5_MATH_2024_P2_Q1_D_ROUND_AFTER_CORRECT";

export const N5_MATHS_2024_P2_Q1_MS = {
  identity: {
    id: question.identity.answerCatalogId,
    schemaVersion: "N5_CATALOG_V2",
    sourceQuestionId: question.identity.id,
    courseId: question.identity.courseId,
    paperContextId: question.identity.paperContextId,
    year: 2024,
    paper: "P2",
    questionNumber: "1",
    questionFamilyId: question.family.familyId,
  },
  sourceContext: {
    sourceDocumentId: "N5_MATH_2024_MS",
    totalMarks: 3,
    sourcePages: [26],
    printedPageLabels: ["page 05"],
    sourceEvidence: [evidence],
    generalMarkingPolicyId: "N5_MATH_2024_GENERAL_MARKING_POLICY",
  },
  expectedResponse: {
    responseTypes: ["NUMBER"],
    canonicalAnswers: [{
      id: "N5_MATH_2024_P2_Q1_A1",
      normalisedAnswer: "186.40 pounds",
      numericValue: 186.4,
      answerForm: "NUMBER",
      mathematicallyEquivalentToVariantIds: [],
      conditionsForAcceptance: ["The source explicitly awards the final mark for 186.40 and also accepts 186."],
      sourceEvidence: [evidence],
      notes: "The exact calculator value is approximately 186.40304; the source applies question-specific final-answer treatment rather than a simple fixed decimal-place rule.",
    }],
    acceptedEquivalentForms: [
      { id: "N5_MATH_2024_P2_Q1_A2", normalisedAnswer: "186 pounds", numericValue: 186, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["Explicitly accepted for the final mark."], sourceEvidence: [evidence], notes: null },
      { id: "N5_MATH_2024_P2_Q1_A3", normalisedAnswer: "186.41 pounds", numericValue: 186.41, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["Explicitly accepted after the illustrated year-by-year calculation route."], sourceEvidence: [evidence], notes: null },
    ],
    precisionType: "NONE",
    precisionValue: null,
    acceptedRange: null,
    units: unitProfile("currency", "GBP"),
    requiredContextStatement: false,
    answerCountRequired: 1,
    invalidRelatedValues: ["186.4", "190", "273.60"],
    extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D_ANSWER_ONLY, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "AWARD", normalisedSummary: "The accepted correct final value without working receives all three marks.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M1, M2, M3], appliesToMethodIds: [P1, P2], marksAwarded: 3, maximumMarks: 3, sourceEvidence: [evidence] },
    { id: D_ACCEPT_FINALS, layer: "QUESTION_NOTE", scope: "MARK", effect: "ACCEPT", normalisedSummary: "For the final mark the source accepts the specified two-decimal monetary value or the rounded whole-pound value, while explicitly rejecting the one-decimal and nearest-ten forms listed in the note.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M3], appliesToMethodIds: [P1, P2], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
    { id: D_YEAR_BY_YEAR, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "ACCEPT", normalisedSummary: "Repeated year-by-year multiplication by the retention factor is an explicit full-credit alternative to using a power.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M1, M2, M3], appliesToMethodIds: [P2], marksAwarded: 3, maximumMarks: 3, sourceEvidence: [evidence] },
    { id: D_WRONG_PERCENT, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "FOLLOW_THROUGH", normalisedSummary: "When an incorrect percentage multiplier is chosen, subsequent comparable processing and evaluation can still make two marks available.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M2, M3], appliesToMethodIds: [P1, P2], marksAwarded: null, maximumMarks: 2, sourceEvidence: [evidence] },
    { id: D_WRONG_POWER, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "FOLLOW_THROUGH", normalisedSummary: "When the correct retention factor is used with an incorrect power of at least two, the first and consistent evaluation marks can remain available.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M1, M3], appliesToMethodIds: [P1], marksAwarded: null, maximumMarks: 2, sourceEvidence: [evidence] },
    { id: D_LATER_INVALID, layer: "QUESTION_NOTE", scope: "MARK", effect: "BLOCK", normalisedSummary: "Incorrect mathematical processing after reaching the correct depreciated value makes the final evaluation mark unavailable.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M3], appliesToMethodIds: [P1, P2], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
    { id: D_DIVIDE_CORRECT_RATE, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "LIMIT", normalisedSummary: "Dividing by the correct three-year retention factor removes the percentage-decrease interpretation mark but can retain the later two marks when processed consistently.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M1], appliesToMethodIds: [], marksAwarded: 2, maximumMarks: 2, sourceEvidence: [evidence] },
    { id: D_DIVIDE_WRONG_RATE, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "LIMIT", normalisedSummary: "Combining division with an incorrect percentage removes both the interpretation and intended three-year process marks; only consistent evaluation can remain.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M1, M2], appliesToMethodIds: [], marksAwarded: 1, maximumMarks: 1, sourceEvidence: [evidence] },
    { id: D_ROUND_AFTER_CORRECT, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "IGNORE_PENALTY", normalisedSummary: "Rounding written after an already accepted correct answer is disregarded rather than used to remove credit.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M3], appliesToMethodIds: [P1, P2], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
  ],
  markNodes: [
    markNode(M1, 1, "Q1_MAIN", "INTERPRETATION", "Use the correct annual retention factor for a 26 percent depreciation.", "Interpret percentage depreciation as retaining 74 percent each year.", ["num-n4-appreciation-depreciation"], ["num-n4-2-depreciation"], ["Q1_S1"], [evidence], {
      illustrativeEvidence: [{ id: "Q1_M1_E1", normalisedEvidence: "Use the multiplier 0.74.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }],
      methodPathwayIds: [P1, P2],
      sourceDirectiveIds: [D_ANSWER_ONLY, D_YEAR_BY_YEAR, D_WRONG_POWER, D_DIVIDE_CORRECT_RATE, D_DIVIDE_WRONG_RATE],
    }),
    markNode(M2, 2, "Q1_MAIN", "PROCESS", "Apply the annual retention factor over three years.", "Represent three periods of compound depreciation.", ["num-n4-appreciation-depreciation"], ["num-n4-2-depreciation"], ["Q1_S2"], [evidence], {
      illustrativeEvidence: [
        { id: "Q1_M2_E1", normalisedEvidence: "Apply 0.74 to the power 3 to the starting value.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] },
        { id: "Q1_M2_E2", normalisedEvidence: "Apply the same retention factor successively for each of the three years.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] },
      ],
      followThrough: { allowed: true, fromMarkIds: [M1], fromQuestionPartIds: ["Q1_MAIN"], requiresComparableDifficulty: true, blockedForRequiredResult: false, blockedByInvalidMathematicalState: true, blockedByTrivialisedLaterWork: true, sourceBasis: "QUESTION_SPECIFIC", sourceEvidence: [evidence], notes: "The source explicitly permits comparable processing after an incorrect percentage choice." },
      methodPathwayIds: [P1, P2],
      sourceDirectiveIds: [D_ANSWER_ONLY, D_YEAR_BY_YEAR, D_WRONG_PERCENT, D_DIVIDE_WRONG_RATE],
    }),
    markNode(M3, 3, "Q1_MAIN", "ACCURACY", "Evaluate the chosen three-year depreciation strategy to an explicitly accepted final value.", "Complete the numerical evaluation in an accepted final monetary form.", ["num-n4-appreciation-depreciation"], ["num-n4-2-depreciation"], ["Q1_S2"], [evidence], {
      illustrativeEvidence: [{ id: "Q1_M3_E1", normalisedEvidence: "State an explicitly accepted final value such as 186.40 or 186 after valid/eligible processing.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }],
      followThrough: { allowed: true, fromMarkIds: [M1, M2], fromQuestionPartIds: ["Q1_MAIN"], requiresComparableDifficulty: true, blockedForRequiredResult: false, blockedByInvalidMathematicalState: true, blockedByTrivialisedLaterWork: true, sourceBasis: "QUESTION_SPECIFIC", sourceEvidence: [evidence], notes: "The source explicitly awards consistent evaluation after specified percentage/power errors, subject to the listed limitations." },
      blockingConditions: ["Subsequent invalid processing after the correct depreciated value blocks this mark."],
      methodPathwayIds: [P1, P2],
      presentationConditions: ["The final numerical form must satisfy the question-specific accepted-value note."],
      sourceDirectiveIds: [D_ANSWER_ONLY, D_ACCEPT_FINALS, D_YEAR_BY_YEAR, D_WRONG_PERCENT, D_WRONG_POWER, D_LATER_INVALID, D_DIVIDE_CORRECT_RATE, D_DIVIDE_WRONG_RATE, D_ROUND_AFTER_CORRECT],
    }),
  ],
  methodPathways: [
    {
      id: P1,
      variantId: "COMPOUND_POWER_ROUTE",
      evidenceRole: "PRIMARY_ILLUSTRATIVE",
      supportsFullCredit: true,
      applicabilityConditions: [],
      steps: [
        { id: "Q1_P1_S1", order: 1, normalisedStep: "Convert 26 percent depreciation to a 0.74 retention multiplier.", linkedQuestionSubgoalIds: ["Q1_S1"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["INTERPRET"], resultingStateSummary: "annual multiplier 0.74", sourceEvidence: [evidence] },
        { id: "Q1_P1_S2", order: 2, normalisedStep: "Apply the multiplier for three periods using a third power and evaluate.", linkedQuestionSubgoalIds: ["Q1_S2"], linkedMarkIds: [M2, M3], dependsOnStepIds: ["Q1_P1_S1"], requiredOperations: ["MULTIPLY", "POWER", "EVALUATE"], resultingStateSummary: "accepted value around 186 pounds", sourceEvidence: [evidence] },
      ],
      markMappingComplete: true,
      sourceTotalAwardRules: [],
      mathematicallyEquivalentMethodIds: [P2],
      materiallyDistinctFromMethodIds: [P2],
      excludedMethodReasons: [],
      sourceEvidence: [evidence],
    },
    {
      id: P2,
      variantId: "YEAR_BY_YEAR_ROUTE",
      evidenceRole: "ILLUSTRATIVE_ALTERNATIVE",
      supportsFullCredit: true,
      applicabilityConditions: [],
      steps: [
        { id: "Q1_P2_S1", order: 1, normalisedStep: "Use the 0.74 retention multiplier.", linkedQuestionSubgoalIds: ["Q1_S1"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["INTERPRET"], resultingStateSummary: "annual multiplier 0.74", sourceEvidence: [evidence] },
        { id: "Q1_P2_S2", order: 2, normalisedStep: "Multiply the updated value by 0.74 once for each of three successive years and evaluate the final amount.", linkedQuestionSubgoalIds: ["Q1_S2"], linkedMarkIds: [M2, M3], dependsOnStepIds: ["Q1_P2_S1"], requiredOperations: ["MULTIPLY", "EVALUATE"], resultingStateSummary: "accepted value around 186 pounds", sourceEvidence: [evidence] },
      ],
      markMappingComplete: true,
      sourceTotalAwardRules: [],
      mathematicallyEquivalentMethodIds: [P1],
      materiallyDistinctFromMethodIds: [P1],
      excludedMethodReasons: [],
      sourceEvidence: [evidence],
    },
  ],
  methodEquivalence: {
    equivalentMethodGroups: [{ id: "Q1_EQUIV_COMPOUND", methodIds: [P1, P2], equivalenceReason: "The source explicitly accepts both a power form and repeated year-by-year multiplication as full-credit representations of the same compound depreciation.", sourceEvidence: [evidence] }],
    methodEligibilityRules: [],
  },
  workingPolicy: workingPolicy(answerOnly("FULL_CREDIT", 3, [M1, M2, M3], [evidence], [D_ANSWER_ONLY]), [], [M1, M2, M3], "P2", 2024),
  presentationPolicy: presentationPolicy([evidence], {
    units: "DO_NOT_PENALISE",
    contextualWording: "DO_NOT_PENALISE",
    otherConditions: [
      "The source explicitly accepts 186.40 and 186, and accepts 186.41 on the illustrated year-by-year route.",
      "The source explicitly does not award the final mark for 186.4 or 190.",
      "Rounding written after an already correct accepted answer is disregarded.",
    ],
  }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [
    { id: "Q1_CR_RAW_18640304", sourceStatus: "EXPLICITLY_LISTED", category: "PRESENTATION_ERROR", errorFamily: "UNACCEPTED_FINAL_PRECISION", normalisedResponse: "Leave the calculator value as 186.40304.", affectedMarkIds: [M3], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [D_ACCEPT_FINALS], sourceEvidence: [evidence] },
    { id: "Q1_CR_RAW_186403", sourceStatus: "EXPLICITLY_LISTED", category: "PRESENTATION_ERROR", errorFamily: "UNACCEPTED_FINAL_PRECISION", normalisedResponse: "Leave the calculator value as 186.403.", affectedMarkIds: [M3], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [D_ACCEPT_FINALS], sourceEvidence: [evidence] },
    { id: "Q1_CR_WRONG_PERCENT", sourceStatus: "DERIVED_FROM_EXPLICIT_NOTE", category: "COMMON_ERROR", errorFamily: "APPRECIATION_INSTEAD_OF_DEPRECIATION", normalisedResponse: "Use 1.26 as the annual multiplier and process it for three periods.", affectedMarkIds: [M1], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true, sourceDirectiveIds: [D_WRONG_PERCENT], sourceEvidence: [evidence] },
    { id: "Q1_CR_WRONG_POWER", sourceStatus: "DERIVED_FROM_EXPLICIT_NOTE", category: "COMMON_ERROR", errorFamily: "INCORRECT_PERIOD_COUNT", normalisedResponse: "Use the correct 0.74 multiplier with power 2 and evaluate consistently.", affectedMarkIds: [M2], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true, sourceDirectiveIds: [D_WRONG_POWER], sourceEvidence: [evidence] },
    { id: "Q1_CR_LATER_SUBTRACTION", sourceStatus: "DERIVED_FROM_EXPLICIT_NOTE", category: "COMMON_ERROR", errorFamily: "SUBSEQUENT_INVALID_WORK", normalisedResponse: "Reach the correct depreciated value and then incorrectly subtract it from the starting value.", affectedMarkIds: [M3], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [D_LATER_INVALID], sourceEvidence: [evidence] },
    { id: "Q1_CR_DIVIDE_RETENTION", sourceStatus: "DERIVED_FROM_EXPLICIT_NOTE", category: "COMMON_ERROR", errorFamily: "DIVIDE_INSTEAD_OF_MULTIPLY", normalisedResponse: "Divide the starting value by the correct three-year retention factor.", affectedMarkIds: [M1], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true, sourceDirectiveIds: [D_DIVIDE_CORRECT_RATE], sourceEvidence: [evidence] },
    { id: "Q1_CR_DIVIDE_WRONG_RATE", sourceStatus: "DERIVED_FROM_EXPLICIT_NOTE", category: "COMMON_ERROR", errorFamily: "DIVISION_WITH_WRONG_PERCENTAGE", normalisedResponse: "Divide by a three-year factor based on an incorrect percentage multiplier.", affectedMarkIds: [M1, M2], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: true, sourceDirectiveIds: [D_DIVIDE_WRONG_RATE], sourceEvidence: [evidence] },
    { id: "Q1_CR_SINGLE_YEAR", sourceStatus: "EXPLICITLY_LISTED", category: "PARTIAL_METHOD", errorFamily: "ONE_PERIOD_ONLY", normalisedResponse: "Apply the 0.74 multiplier for only one year.", affectedMarkIds: [M2, M3], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: false, sourceDirectiveIds: [], sourceEvidence: [evidence] },
    { id: "Q1_CR_MULTIPLY_BY_THREE", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "MULTIPLIER_TIMES_PERIODS", normalisedResponse: "Use the correct annual multiplier but multiply by the number of years rather than compound it.", affectedMarkIds: [M2, M3], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: false, sourceDirectiveIds: [], sourceEvidence: [evidence] },
    { id: "Q1_CR_FIXED_CASH_DECREASE", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "SIMPLE_DECREASE_REPEATED", normalisedResponse: "Calculate 26 percent of the original value once and subtract three copies of that cash amount.", affectedMarkIds: [M2, M3], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: false, sourceDirectiveIds: [], sourceEvidence: [evidence] },
    { id: "Q1_CR_PERCENT_OF_START_TIMES_THREE", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "DEPRECIATION_AMOUNT_NOT_RETAINED_VALUE", normalisedResponse: "Calculate 26 percent of the starting value and multiply that amount by three without subtracting from the asset value.", affectedMarkIds: [M1, M2, M3], marksAwarded: 0, maximumMarks: 0, followThroughAvailable: false, sourceDirectiveIds: [], sourceEvidence: [evidence] },
  ],
  generalPolicy: { policyId: "N5_MATH_2024_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2024_RULE_IDS], questionSpecificOverrides: [D_ANSWER_ONLY, D_ACCEPT_FINALS, D_YEAR_BY_YEAR, D_WRONG_PERCENT, D_WRONG_POWER, D_LATER_INVALID, D_DIVIDE_CORRECT_RATE, D_DIVIDE_WRONG_RATE, D_ROUND_AFTER_CORRECT] },
  relationship: {
    partMarkMap: [{ questionPartId: "Q1_MAIN", markIds: [M1, M2, M3] }],
    subgoalMarkMap: [{ questionSubgoalId: "Q1_S1", markIds: [M1] }, { questionSubgoalId: "Q1_S2", markIds: [M2, M3] }],
    promptInstructionConsequences: [],
    informationEvidenceMap: [
      { questionInformationId: "Q1_INFO_START", usedByMethodIds: [P1, P2], supportsMarkIds: [M2, M3] },
      { questionInformationId: "Q1_INFO_RATE", usedByMethodIds: [P1, P2], supportsMarkIds: [M1, M2, M3] },
      { questionInformationId: "Q1_INFO_YEARS", usedByMethodIds: [P1, P2], supportsMarkIds: [M2, M3] },
    ],
    representationEvidenceMap: [],
    crossPartDependencies: [],
    errorPropagationGraph: [
      { sourceMarkIds: [M1], sourceQuestionPartIds: ["Q1_MAIN"], affectedMarkIds: [M2, M3], survivingMarkIds: [M2, M3], conditionSummary: "An incorrect percentage choice can still support later comparable processing and evaluation under the explicit question note.", sourceEvidence: [evidence] },
      { sourceMarkIds: [M2], sourceQuestionPartIds: ["Q1_MAIN"], affectedMarkIds: [M3], survivingMarkIds: [M3], conditionSummary: "An incorrect power of at least two can still support a consistent evaluation mark under the explicit question note.", sourceEvidence: [evidence] },
    ],
  },
  sourcePresentation: sourcePresentation([26], "TABLE_ROW", 2, 8, 5),
  consistency: notReviewedConsistency(
    comparisonKey("Q1_MARKING_COMPARISON", question.family.familyId, ["num-n4-appreciation-depreciation"], 3, ["NUMBER"], ["answer-only credit", "compound percentage follow-through", "accepted final precision", "alternative repeated-period method"]),
    [
      consistencyFeature("answer_only_treatment", "FULL_CREDIT", "The source explicitly awards all three marks for an accepted correct final answer without working.", [evidence]),
      consistencyFeature("wrong_percentage_can_follow_through", true, "The source explicitly allows two later marks after an incorrect percentage choice when subsequent demand remains comparable.", [evidence]),
      consistencyFeature("wrong_power_can_retain_accuracy", true, "Using the correct multiplier with a wrong power of at least two can retain the interpretation and consistent evaluation marks.", [evidence]),
      consistencyFeature("final_form_is_question_specific", true, "The accepted and rejected final numerical forms do not reduce to a single ordinary decimal-place or significant-figure rule.", [evidence]),
    ],
  ),
  integrity: answerIntegrity(),
  generation: generationNotReviewed(),
  review: answerReviewInProgress("1", "P2", 2024),
} satisfies AnswerCatalogEntry;
