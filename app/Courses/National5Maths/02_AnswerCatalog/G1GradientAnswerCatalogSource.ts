import type { PresentationRequirement } from "./AnswerCatalogTypes";

export type G1AnswerMarkRef = "M1" | "M2" | "M3" | "M4";
export type G1AnswerPartRef = "MAIN" | "A" | "B";
export type G1AnswerMethodRef = "SLOPE_INTERCEPT" | "POINT_SLOPE" | "FOLLOW_UP" | "SYMBOLIC";

export type G1AnswerOnlyRule = {
  part: G1AnswerPartRef;
  treatment: "FULL_CREDIT" | "NO_CREDIT" | "NOT_STATED";
  marksAwarded: number | null;
  markRefs: G1AnswerMarkRef[];
  sourceKind: "QUESTION" | "GENERAL_POLICY";
  notes: string;
};

export type G1SourceDirectiveConfig = {
  idSuffix: string;
  part: G1AnswerPartRef;
  effect: "AWARD" | "LIMIT" | "BLOCK" | "ACCEPT" | "REQUIRE" | "FOLLOW_THROUGH" | "IGNORE_PENALTY";
  summary: string;
  markRefs: G1AnswerMarkRef[];
  methodRefs?: G1AnswerMethodRef[];
  marksAwarded?: number | null;
  maximumMarks?: number | null;
};

export type G1CommonResponseConfig = {
  idSuffix: string;
  category: "COMMON_ERROR" | "PARTIAL_METHOD" | "VALID_ALTERNATIVE" | "NOTATION_ERROR" | "PRESENTATION_ERROR";
  errorFamily: string | null;
  normalisedResponse: string;
  affectedMarkRefs: G1AnswerMarkRef[];
  marksAwarded: number | null;
  maximumMarks: number | null;
  followThroughAvailable: boolean;
};

export type G1FollowUpAnswerConfig = {
  normalisedAnswer: string;
  numericValue: number;
  unitDimension: string | null;
  unitSymbol: string | null;
  unitsExplicitlyRequested: boolean;
  calculationSummary: string;
  ownership: "G1" | "S2";
  followThroughGate: string | null;
};

export type G1AnswerConfig = {
  year: 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2021 | 2022 | 2023 | 2024 | 2025;
  paper: "P1" | "P2";
  questionNumber: string;
  msPages: number[];
  printedPageLabels: string[];
  canonicalPrimaryAnswer: string;
  primaryAnswerForm: "EQUATION" | "EXPRESSION";
  gradientSummary: string;
  substitutionSummary: string;
  completionSummary: string;
  gradientEligibilityConditions: string[];
  sourceMethodRefs: G1AnswerMethodRef[];
  answerOnlyRules: G1AnswerOnlyRule[];
  directives: G1SourceDirectiveConfig[];
  commonResponses: G1CommonResponseConfig[];
  followUp: G1FollowUpAnswerConfig | null;
  acceptedEquivalentPrimaryAnswers: string[];
  primarySimplification: PresentationRequirement;
  finalPrecisionType: "NONE" | "DECIMAL_PLACES";
  finalPrecisionValue: number | null;
  unitsPresentation: PresentationRequirement;
};

export const G1_ANSWER_CONFIGS: readonly G1AnswerConfig[] = [
  {
    year: 2014, paper: "P1", questionNumber: "6",
    msPages: [5], printedPageLabels: ["Page five"],
    canonicalPrimaryAnswer: "C = 15F + 125", primaryAnswerForm: "EQUATION",
    gradientSummary: "Use the two stated line observations to obtain gradient 15.",
    substitutionSummary: "Use gradient 15 with either stated point in slope-intercept or point-slope form.",
    completionSummary: "Determine the non-zero intercept and state the contextual model C = 15F + 125.",
    gradientEligibilityConditions: [],
    sourceMethodRefs: ["SLOPE_INTERCEPT", "POINT_SLOPE", "FOLLOW_UP"],
    answerOnlyRules: [
      { part: "A", treatment: "FULL_CREDIT", marksAwarded: 3, markRefs: ["M1", "M2", "M3"], sourceKind: "QUESTION", notes: "The source awards all three part-(a) marks for the correct contextual model even when supporting working is absent." },
      { part: "B", treatment: "NO_CREDIT", marksAwarded: 0, markRefs: ["M4"], sourceKind: "QUESTION", notes: "The numerical follow-up must be supported by a calculation using the model." },
    ],
    directives: [
      { idSuffix: "GENERIC_VARIABLES_LIMIT", part: "A", effect: "LIMIT", summary: "A numerically correct line written with generic x/y symbols rather than the contextual variables is capped below full credit.", markRefs: ["M3"], methodRefs: ["SLOPE_INTERCEPT", "POINT_SLOPE"], maximumMarks: 2 },
      { idSuffix: "NO_INTERCEPT_LIMIT", part: "A", effect: "LIMIT", summary: "A line using the correct gradient but omitting the required non-zero intercept receives only the gradient credit.", markRefs: ["M2", "M3"], maximumMarks: 1 },
      { idSuffix: "PART_A_FOLLOW_THROUGH", part: "A", effect: "FOLLOW_THROUGH", summary: "An incorrect gradient or intercept does not automatically remove all later credit when subsequent line-equation work is valid and consistent.", markRefs: ["M2", "M3"], maximumMarks: 2 },
      { idSuffix: "PARTIAL_NO_WORK", part: "A", effect: "AWARD", summary: "An incorrect unsupported equation can still receive one mark when either its gradient or intercept is correct.", markRefs: ["M1", "M2", "M3"], marksAwarded: 1, maximumMarks: 1 },
      { idSuffix: "WRONG_BOTH_NO_WORK", part: "A", effect: "BLOCK", summary: "An incorrect unsupported equation with both gradient and intercept wrong receives no credit.", markRefs: ["M1", "M2", "M3"], marksAwarded: 0, maximumMarks: 0 },
      { idSuffix: "PART_B_FT_GATE", part: "B", effect: "FOLLOW_THROUGH", summary: "Follow-through in the estimate is available only when the carried model still requires both a multiplicative/divisive operation and an additive/subtractive operation.", markRefs: ["M4"], methodRefs: ["FOLLOW_UP"], maximumMarks: 1 },
    ],
    commonResponses: [],
    followUp: { normalisedAnswer: "725", numericValue: 725, unitDimension: null, unitSymbol: null, unitsExplicitlyRequested: false, calculationSummary: "Substitute F = 40 into the part-(a) model and evaluate.", ownership: "S2", followThroughGate: "The carried model must preserve both multiplicative/divisive and additive/subtractive demand." },
    acceptedEquivalentPrimaryAnswers: [],
    primarySimplification: "REQUIRED_FOR_FULL_CREDIT", finalPrecisionType: "NONE", finalPrecisionValue: null, unitsPresentation: "NOT_STATED",
  },
  {
    year: 2015, paper: "P1", questionNumber: "8",
    msPages: [7], printedPageLabels: ["Page seven"],
    canonicalPrimaryAnswer: "y = 2x + 9", primaryAnswerForm: "EQUATION",
    gradientSummary: "Use the two coordinates to obtain gradient 2.",
    substitutionSummary: "Use gradient 2 and either point in a valid straight-line equation form.",
    completionSummary: "Determine the intercept and state y = 2x + 9 in simplest form.",
    gradientEligibilityConditions: [],
    sourceMethodRefs: ["SLOPE_INTERCEPT", "POINT_SLOPE"],
    answerOnlyRules: [{ part: "MAIN", treatment: "FULL_CREDIT", marksAwarded: 3, markRefs: ["M1", "M2", "M3"], sourceKind: "QUESTION", notes: "The correct simplified equation can receive all three marks without displayed working." }],
    directives: [
      { idSuffix: "UNSIMPLIFIED_GRADIENT_COEFFICIENT", part: "MAIN", effect: "LIMIT", summary: "Leaving the gradient coefficient in an unsimplified over-one form prevents full-credit presentation.", markRefs: ["M3"], maximumMarks: 2 },
    ],
    commonResponses: [
      { idSuffix: "UNSIMPLIFIED_TWO_OVER_ONE", category: "PRESENTATION_ERROR", errorFamily: "UNSIMPLIFIED_COEFFICIENT", normalisedResponse: "A correct equation retaining the coefficient as 2/1 is awarded two of the three marks.", affectedMarkRefs: ["M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false },
    ],
    followUp: null, acceptedEquivalentPrimaryAnswers: [],
    primarySimplification: "REQUIRED_FOR_FULL_CREDIT", finalPrecisionType: "NONE", finalPrecisionValue: null, unitsPresentation: "NOT_RELEVANT",
  },
  {
    year: 2016, paper: "P1", questionNumber: "5",
    msPages: [9], printedPageLabels: ["Page 09"],
    canonicalPrimaryAnswer: "W = 20A + 40", primaryAnswerForm: "EQUATION",
    gradientSummary: "Use the two stated observations to obtain gradient 20.",
    substitutionSummary: "Use gradient 20 with a stated observation in slope-intercept or point-slope form.",
    completionSummary: "Determine the intercept and state W = 20A + 40 in the contextual variables.",
    gradientEligibilityConditions: [],
    sourceMethodRefs: ["SLOPE_INTERCEPT", "POINT_SLOPE", "FOLLOW_UP"],
    answerOnlyRules: [
      { part: "A", treatment: "FULL_CREDIT", marksAwarded: 3, markRefs: ["M1", "M2", "M3"], sourceKind: "QUESTION", notes: "The correct part-(a) model can receive all three marks without displayed working." },
      { part: "B", treatment: "NO_CREDIT", marksAwarded: 0, markRefs: ["M4"], sourceKind: "QUESTION", notes: "The follow-on numerical answer requires visible model use." },
    ],
    directives: [
      { idSuffix: "M3_SUBSEQUENT_INVALID_WORK", part: "A", effect: "BLOCK", summary: "The final equation mark is unavailable when a correct model is followed by invalid work that changes the answer.", markRefs: ["M3"] },
      { idSuffix: "GRADIENT_SIMPLIFICATION_FT", part: "A", effect: "FOLLOW_THROUGH", summary: "An arithmetic error while simplifying the gradient does not automatically remove the later substitution mark when subsequent work is valid and consistent.", markRefs: ["M2", "M3"], maximumMarks: 2 },
      { idSuffix: "PART_B_FT_GATE", part: "B", effect: "FOLLOW_THROUGH", summary: "Follow-through for the estimate requires the supplied input to be multiplied or divided by a sufficiently non-trivial carried coefficient and then adjusted by an addition or subtraction.", markRefs: ["M4"], methodRefs: ["FOLLOW_UP"], maximumMarks: 1 },
    ],
    commonResponses: [
      { idSuffix: "GENERIC_VARIABLES", category: "NOTATION_ERROR", errorFamily: "WRONG_CONTEXT_VARIABLES", normalisedResponse: "A correct numerical line written with generic x/y variables receives two of three marks.", affectedMarkRefs: ["M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false },
      { idSuffix: "NO_INTERCEPT", category: "PARTIAL_METHOD", errorFamily: "INTERCEPT_OMITTED", normalisedResponse: "A model containing the correct gradient but no intercept receives one mark.", affectedMarkRefs: ["M2", "M3"], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: false },
      { idSuffix: "UNSIMPLIFIED_COEFFICIENT", category: "PRESENTATION_ERROR", errorFamily: "UNSIMPLIFIED_COEFFICIENT", normalisedResponse: "A correct W/A model retaining the gradient as a fraction over one receives two marks.", affectedMarkRefs: ["M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false },
      { idSuffix: "WRONG_ANCHOR_INTERCEPT", category: "COMMON_ERROR", errorFamily: "POINT_SUBSTITUTION_ERROR", normalisedResponse: "A route with the correct gradient but an incorrect anchor/intercept producing W = 20A + 97 can retain two marks when the surrounding method evidence remains valid.", affectedMarkRefs: ["M2", "M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true },
    ],
    followUp: { normalisedAnswer: "280 kg", numericValue: 280, unitDimension: "mass", unitSymbol: "kg", unitsExplicitlyRequested: false, calculationSummary: "Substitute A = 12 into the model and evaluate the resulting weight.", ownership: "S2", followThroughGate: "The carried calculation must retain non-trivial multiplication/division and then addition/subtraction." },
    acceptedEquivalentPrimaryAnswers: [],
    primarySimplification: "REQUIRED_FOR_FULL_CREDIT", finalPrecisionType: "NONE", finalPrecisionValue: null, unitsPresentation: "NOT_STATED",
  },
  {
    year: 2017, paper: "P1", questionNumber: "6",
    msPages: [9], printedPageLabels: ["page 09"],
    canonicalPrimaryAnswer: "y = -2x + 4", primaryAnswerForm: "EQUATION",
    gradientSummary: "Read the two diagram coordinates and obtain gradient -2.",
    substitutionSummary: "Use gradient -2 and either point in a valid straight-line form.",
    completionSummary: "Determine the intercept and state y = -2x + 4 in simplest form.",
    gradientEligibilityConditions: ["Coordinate subtraction order must be consistent between numerator and denominator."],
    sourceMethodRefs: ["SLOPE_INTERCEPT", "POINT_SLOPE"],
    answerOnlyRules: [{ part: "MAIN", treatment: "FULL_CREDIT", marksAwarded: 3, markRefs: ["M1", "M2", "M3"], sourceKind: "QUESTION", notes: "The correct simplified line equation can receive full credit without displayed working." }],
    directives: [
      { idSuffix: "COORDINATE_ORDER", part: "MAIN", effect: "BLOCK", summary: "The gradient mark is not awarded when the candidate reverses point order in only one of the two coordinate differences.", markRefs: ["M1"] },
    ],
    commonResponses: [
      { idSuffix: "UNSIMPLIFIED_NEG_TWO", category: "PRESENTATION_ERROR", errorFamily: "UNSIMPLIFIED_COEFFICIENT", normalisedResponse: "A correct equation written as y = -(2/1)x + 4 receives two marks.", affectedMarkRefs: ["M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false },
      { idSuffix: "SIGN_ORDER_ROUTE_A", category: "COMMON_ERROR", errorFamily: "GRADIENT_SIGN_ERROR", normalisedResponse: "A source-listed sign/order error producing the consistent line y = 2x + 8 can still receive two marks.", affectedMarkRefs: ["M1", "M2", "M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true },
      { idSuffix: "SIGN_ORDER_ROUTE_B", category: "COMMON_ERROR", errorFamily: "GRADIENT_SIGN_ERROR", normalisedResponse: "A second source-listed sign/order route producing y = 2x - 8 can still receive two marks.", affectedMarkRefs: ["M1", "M2", "M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true },
      { idSuffix: "ONE_GRADIENT_ROUTE", category: "COMMON_ERROR", errorFamily: "COORDINATE_DIFFERENCE_ERROR", normalisedResponse: "A source-listed route producing m = 1 and then y = x + 7 receives two marks.", affectedMarkRefs: ["M1", "M2", "M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true },
    ],
    followUp: null, acceptedEquivalentPrimaryAnswers: [],
    primarySimplification: "REQUIRED_FOR_FULL_CREDIT", finalPrecisionType: "NONE", finalPrecisionValue: null, unitsPresentation: "NOT_RELEVANT",
  },
  {
    year: 2018, paper: "P1", questionNumber: "7",
    msPages: [10, 11, 12], printedPageLabels: ["page 10", "page 11", "page 12"],
    canonicalPrimaryAnswer: "P = (3/2)d + 2", primaryAnswerForm: "EQUATION",
    gradientSummary: "Use the two stated journey observations to obtain gradient 3/2.",
    substitutionSummary: "Use the exact gradient, not a decimal approximation, with a stated point in a valid line form.",
    completionSummary: "State the contextual model P = (3/2)d + 2 or a source-accepted equivalent exact form.",
    gradientEligibilityConditions: [],
    sourceMethodRefs: ["SLOPE_INTERCEPT", "POINT_SLOPE", "FOLLOW_UP"],
    answerOnlyRules: [
      { part: "A", treatment: "NO_CREDIT", marksAwarded: 0, markRefs: ["M1", "M2", "M3"], sourceKind: "QUESTION", notes: "The source requires supporting working for the three-mark model construction." },
      { part: "B", treatment: "FULL_CREDIT", marksAwarded: 1, markRefs: ["M4"], sourceKind: "QUESTION", notes: "The correctly presented follow-up value can receive its mark without working." },
    ],
    directives: [
      { idSuffix: "M2_GRADIENT_NOT_NEED_SIMPLIFY", part: "A", effect: "ACCEPT", summary: "The substitution mark can be earned with an unsimplified but correct gradient fraction.", markRefs: ["M2"] },
      { idSuffix: "GRADIENT_ARITHMETIC_FT", part: "A", effect: "FOLLOW_THROUGH", summary: "An incorrect simplification of the gradient can lose the error-point mark while still allowing valid later substitution credit.", markRefs: ["M2", "M3"], maximumMarks: 2 },
      { idSuffix: "M3_INTEGER_GRADIENT_BLOCK", part: "A", effect: "BLOCK", summary: "The final equation mark is unavailable when the candidate's calculated gradient is an integer.", markRefs: ["M3"] },
      { idSuffix: "M3_DECIMAL_GRADIENT_BLOCK", part: "A", effect: "BLOCK", summary: "The final equation mark is unavailable when the candidate converts the required fractional gradient to a decimal approximation.", markRefs: ["M3"] },
      { idSuffix: "M3_SUBSEQUENT_INVALID_WORK", part: "A", effect: "BLOCK", summary: "The final mark is unavailable after invalid subsequent working that changes an otherwise correct result.", markRefs: ["M3"] },
      { idSuffix: "POUND_SYMBOL_NOT_REQUIRED", part: "B", effect: "IGNORE_PENALTY", summary: "Omission of the currency symbol does not by itself remove the follow-up mark.", markRefs: ["M4"] },
      { idSuffix: "TWO_DECIMAL_PRESENTATION", part: "B", effect: "REQUIRE", summary: "The monetary follow-up must be presented with the required trailing zero; a one-decimal or exact-fraction display is not accepted for the mark.", markRefs: ["M4"] },
      { idSuffix: "PART_B_FT_GATE", part: "B", effect: "FOLLOW_THROUGH", summary: "Follow-through from an incorrect part-(a) model is available only when the new input is multiplied or divided by a non-unitary fractional coefficient (or decimal equivalent) before an addition/subtraction.", markRefs: ["M4"], methodRefs: ["FOLLOW_UP"], maximumMarks: 1 },
    ],
    commonResponses: [
      { idSuffix: "EQUIVALENT_REARRANGEMENT", category: "VALID_ALTERNATIVE", errorFamily: null, normalisedResponse: "The equivalent exact form 2P = 3d + 4 receives full credit.", affectedMarkRefs: ["M1", "M2", "M3"], marksAwarded: 3, maximumMarks: 3, followThroughAvailable: false },
      { idSuffix: "UNSIMPLIFIED_SIX_OVER_FOUR", category: "PRESENTATION_ERROR", errorFamily: "UNSIMPLIFIED_COEFFICIENT", normalisedResponse: "An otherwise correct route retaining P = (6/4)d + 2 and the equivalent rearrangement 4P = 6d + 8 receives two marks.", affectedMarkRefs: ["M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false },
      { idSuffix: "DECIMAL_GRADIENT_POINT_SIX_SEVEN", category: "COMMON_ERROR", errorFamily: "DECIMAL_APPROXIMATION", normalisedResponse: "A consistent model built from the approximate gradient m = 0.67 receives two marks.", affectedMarkRefs: ["M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true },
      { idSuffix: "INCORRECT_REDUCTION_THREE_OVER_FOUR", category: "COMMON_ERROR", errorFamily: "GRADIENT_SIMPLIFICATION_ERROR", normalisedResponse: "A route incorrectly reducing 6/4 to 3/4 and then using 0.75 can receive two marks when subsequent work is consistent.", affectedMarkRefs: ["M1", "M2", "M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true },
      { idSuffix: "RECIPROCAL_TWO_OVER_THREE", category: "COMMON_ERROR", errorFamily: "GRADIENT_RECIPROCAL_ERROR", normalisedResponse: "A route reversing the gradient fraction from 4/6 to 2/3 can receive two marks when the remaining line construction is consistent.", affectedMarkRefs: ["M1", "M2", "M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true },
      { idSuffix: "THREE_OVER_FOUR_DECIMAL", category: "COMMON_ERROR", errorFamily: "GRADIENT_ERROR", normalisedResponse: "A consistent line built from m = 3/4 = 0.75 receives two marks.", affectedMarkRefs: ["M1", "M2", "M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true },
    ],
    followUp: { normalisedAnswer: "9.50", numericValue: 9.5, unitDimension: "currency", unitSymbol: "£", unitsExplicitlyRequested: false, calculationSummary: "Substitute the new distance into the part-(a) pricing model and evaluate.", ownership: "G1", followThroughGate: "A carried model must retain a non-unitary fractional/decimal multiplier followed by an addition/subtraction." },
    acceptedEquivalentPrimaryAnswers: ["2P = 3d + 4"],
    primarySimplification: "REQUIRED_FOR_FULL_CREDIT", finalPrecisionType: "DECIMAL_PLACES", finalPrecisionValue: 2, unitsPresentation: "DO_NOT_PENALISE",
  },
  {
    year: 2019, paper: "P1", questionNumber: "6",
    msPages: [10], printedPageLabels: ["page 10"],
    canonicalPrimaryAnswer: "F = -3E + 18.5", primaryAnswerForm: "EQUATION",
    gradientSummary: "Read the source-authorised line points (1.5, 14) and (3.5, 8) and obtain gradient -3.",
    substitutionSummary: "Use the gradient and one authorised line point in point-slope or slope-intercept form.",
    completionSummary: "State F = -3E + 18.5 in the contextual variables and simplest form.",
    gradientEligibilityConditions: ["For the gradient mark, the source permits the two designated graph-read line points only."],
    sourceMethodRefs: ["SLOPE_INTERCEPT", "POINT_SLOPE", "FOLLOW_UP"],
    answerOnlyRules: [
      { part: "A", treatment: "NO_CREDIT", marksAwarded: 0, markRefs: ["M1", "M2", "M3"], sourceKind: "QUESTION", notes: "Supporting working is required for the three-mark best-fit model construction." },
      { part: "B", treatment: "FULL_CREDIT", marksAwarded: 1, markRefs: ["M4"], sourceKind: "QUESTION", notes: "A consistent numerical estimate can receive the mark without displayed working." },
    ],
    directives: [
      { idSuffix: "M1_AUTHORISED_POINTS_ONLY", part: "A", effect: "REQUIRE", summary: "The gradient mark requires use of the two source-authorised coordinates read from the best-fit line; other graph points do not earn that mark.", markRefs: ["M1"] },
      { idSuffix: "M2_UNSIMPLIFIED_GRADIENT_ACCEPT", part: "A", effect: "ACCEPT", summary: "The substitution mark does not require the gradient fraction to have been simplified first.", markRefs: ["M2"] },
      { idSuffix: "PART_B_NEGATIVE_BLOCK", part: "B", effect: "BLOCK", summary: "Follow-through is unavailable when the carried part-(a) model produces a negative contextual estimate.", markRefs: ["M4"] },
    ],
    commonResponses: [
      { idSuffix: "GENERIC_VARIABLES", category: "NOTATION_ERROR", errorFamily: "WRONG_CONTEXT_VARIABLES", normalisedResponse: "A numerically correct line written with generic x/y variables receives two marks.", affectedMarkRefs: ["M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false },
      { idSuffix: "NO_INTERCEPT", category: "PARTIAL_METHOD", errorFamily: "INTERCEPT_OMITTED", normalisedResponse: "A line using the correct gradient but omitting the intercept receives one mark.", affectedMarkRefs: ["M2", "M3"], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: false },
      { idSuffix: "NON_SIMPLEST_CONTEXT_MODEL", category: "PRESENTATION_ERROR", errorFamily: "NON_SIMPLEST_MODEL", normalisedResponse: "A source-listed correct contextual model that is not in the required simplest form receives two marks.", affectedMarkRefs: ["M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false },
      { idSuffix: "OTHER_GRAPH_POINTS", category: "COMMON_ERROR", errorFamily: "UNAUTHORISED_GRAPH_POINTS", normalisedResponse: "Using other graph points loses the dedicated gradient mark but can retain two marks for a consistent later line construction.", affectedMarkRefs: ["M1", "M2", "M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true },
    ],
    followUp: { normalisedAnswer: "15.2 km/l", numericValue: 15.2, unitDimension: "fuel consumption", unitSymbol: "km/l", unitsExplicitlyRequested: false, calculationSummary: "Substitute E = 1.1 into the eligible model and evaluate the fuel-consumption estimate.", ownership: "S2", followThroughGate: "The carried model must produce a non-negative contextual value." },
    acceptedEquivalentPrimaryAnswers: [],
    primarySimplification: "REQUIRED_FOR_FULL_CREDIT", finalPrecisionType: "NONE", finalPrecisionValue: null, unitsPresentation: "NOT_STATED",
  },
  {
    year: 2019, paper: "P2", questionNumber: "13",
    msPages: [41], printedPageLabels: ["page 21"],
    canonicalPrimaryAnswer: "2p + 3", primaryAnswerForm: "EXPRESSION",
    gradientSummary: "Substitute the numerical point and parameterised point into the two-point gradient quotient; either consistent subtraction direction is accepted.",
    substitutionSummary: "Factor the resulting difference-of-squares numerator into two linear factors.",
    completionSummary: "Factor the denominator consistently, cancel the common factor, and state the simplest gradient 2p + 3.",
    gradientEligibilityConditions: ["The two coordinate differences may both be reversed, but numerator and denominator subtraction order must remain consistent."],
    sourceMethodRefs: ["SYMBOLIC"],
    answerOnlyRules: [{ part: "MAIN", treatment: "NO_CREDIT", marksAwarded: 0, markRefs: ["M1", "M2", "M3"], sourceKind: "QUESTION", notes: "The final symbolic gradient without supporting algebra receives no marks." }],
    directives: [
      { idSuffix: "REVERSE_SUBTRACTION_ACCEPTED", part: "MAIN", effect: "ACCEPT", summary: "The gradient quotient may be formed using either common point order provided numerator and denominator use the same order.", markRefs: ["M1"], methodRefs: ["SYMBOLIC"] },
      { idSuffix: "M3_REORDERED_TERMS_ACCEPTED", part: "MAIN", effect: "ACCEPT", summary: "The final sum may be written with its two terms in either order.", markRefs: ["M3"] },
      { idSuffix: "M3_SUBSEQUENT_INVALID_WORK", part: "MAIN", effect: "BLOCK", summary: "The final mark is unavailable when a correct simplified result is subsequently changed by invalid algebra.", markRefs: ["M3"] },
    ],
    commonResponses: [],
    followUp: null,
    acceptedEquivalentPrimaryAnswers: ["3 + 2p"],
    primarySimplification: "REQUIRED_FOR_FULL_CREDIT", finalPrecisionType: "NONE", finalPrecisionValue: null, unitsPresentation: "NOT_RELEVANT",
  },
  {
    year: 2021, paper: "P1", questionNumber: "10",
    msPages: [6], printedPageLabels: ["page 06"],
    canonicalPrimaryAnswer: "W = (1/20)S + 150", primaryAnswerForm: "EQUATION",
    gradientSummary: "Use the two stated sales/wage observations to obtain gradient 1/20.",
    substitutionSummary: "Use the exact gradient and one observation in a valid straight-line form.",
    completionSummary: "Determine the intercept and state W = (1/20)S + 150 in simplest contextual form.",
    gradientEligibilityConditions: [],
    sourceMethodRefs: ["SLOPE_INTERCEPT", "POINT_SLOPE", "FOLLOW_UP"],
    answerOnlyRules: [
      { part: "A", treatment: "NO_CREDIT", marksAwarded: 0, markRefs: ["M1", "M2", "M3"], sourceKind: "GENERAL_POLICY", notes: "The general policy for this paper requires supporting working unless a question-specific instruction states otherwise." },
      { part: "B", treatment: "NO_CREDIT", marksAwarded: 0, markRefs: ["M4"], sourceKind: "GENERAL_POLICY", notes: "The same general working policy applies to the one-mark follow-on calculation." },
    ],
    directives: [],
    commonResponses: [],
    followUp: { normalisedAnswer: "200", numericValue: 200, unitDimension: "currency", unitSymbol: "£", unitsExplicitlyRequested: false, calculationSummary: "Substitute S = 1000 into the wage model and evaluate.", ownership: "G1", followThroughGate: null },
    acceptedEquivalentPrimaryAnswers: [],
    primarySimplification: "REQUIRED_FOR_FULL_CREDIT", finalPrecisionType: "NONE", finalPrecisionValue: null, unitsPresentation: "NOT_STATED",
  },
  {
    year: 2022, paper: "P1", questionNumber: "6",
    msPages: [9], printedPageLabels: ["page 09"],
    canonicalPrimaryAnswer: "y = -4x - 13", primaryAnswerForm: "EQUATION",
    gradientSummary: "Use the two supplied coordinates to obtain gradient -4.",
    substitutionSummary: "Use the gradient and either point in point-slope or slope-intercept form.",
    completionSummary: "Determine the intercept and state y = -4x - 13 in simplest form.",
    gradientEligibilityConditions: ["Coordinate subtraction order must be consistent between numerator and denominator."],
    sourceMethodRefs: ["SLOPE_INTERCEPT", "POINT_SLOPE"],
    answerOnlyRules: [{ part: "MAIN", treatment: "NO_CREDIT", marksAwarded: 0, markRefs: ["M1", "M2", "M3"], sourceKind: "QUESTION", notes: "The correct final equation without supporting working receives no marks." }],
    directives: [
      { idSuffix: "COORDINATE_ORDER", part: "MAIN", effect: "BLOCK", summary: "The gradient mark is unavailable when point order is reversed in only one coordinate difference.", markRefs: ["M1"] },
      { idSuffix: "GRADIENT_SIMPLIFICATION_FT", part: "MAIN", effect: "FOLLOW_THROUGH", summary: "An incorrect simplification of the gradient loses the error-point mark but does not automatically remove valid later line-equation credit.", markRefs: ["M2", "M3"], maximumMarks: 2 },
    ],
    commonResponses: [
      { idSuffix: "UNSIMPLIFIED_INTERCEPT_OVER_ONE", category: "PRESENTATION_ERROR", errorFamily: "NON_SIMPLEST_MODEL", normalisedResponse: "A correct equation written as y = -4x - 13/1 receives two marks.", affectedMarkRefs: ["M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false },
    ],
    followUp: null, acceptedEquivalentPrimaryAnswers: [],
    primarySimplification: "REQUIRED_FOR_FULL_CREDIT", finalPrecisionType: "NONE", finalPrecisionValue: null, unitsPresentation: "NOT_RELEVANT",
  },
  {
    year: 2023, paper: "P1", questionNumber: "7",
    msPages: [9, 10], printedPageLabels: ["page 09", "page 10"],
    canonicalPrimaryAnswer: "P = 1500T + 12500", primaryAnswerForm: "EQUATION",
    gradientSummary: "Select two coordinates from the source-authorised set of grid-readable best-fit-line points and obtain gradient 1500.",
    substitutionSummary: "Use gradient 1500 and one authorised point in a valid line form.",
    completionSummary: "Determine the intercept and state P = 1500T + 12500 in simplest contextual form.",
    gradientEligibilityConditions: ["The gradient mark requires two points chosen from the source-authorised set (5, 20000), (15, 35000), and (25, 50000)."],
    sourceMethodRefs: ["SLOPE_INTERCEPT", "POINT_SLOPE", "FOLLOW_UP"],
    answerOnlyRules: [
      { part: "A", treatment: "NO_CREDIT", marksAwarded: 0, markRefs: ["M1", "M2", "M3"], sourceKind: "QUESTION", notes: "The three-mark model construction requires working." },
      { part: "B", treatment: "FULL_CREDIT", marksAwarded: 1, markRefs: ["M4"], sourceKind: "QUESTION", notes: "A consistent follow-up estimate can receive its mark without displayed working." },
    ],
    directives: [
      { idSuffix: "M1_AUTHORISED_POINTS", part: "A", effect: "REQUIRE", summary: "The gradient mark is awarded only when the candidate uses two coordinates from the source-authorised best-fit-line point set.", markRefs: ["M1"] },
      { idSuffix: "GRADIENT_SIMPLIFICATION_FT", part: "A", effect: "FOLLOW_THROUGH", summary: "An arithmetic error in simplifying the gradient can lose the error-point mark while allowing valid subsequent model construction credit.", markRefs: ["M2", "M3"], maximumMarks: 2 },
      { idSuffix: "PART_B_FT_FORMAT_GATE", part: "B", effect: "BLOCK", summary: "Follow-through from an incorrect model is unavailable when the carried estimate is negative, left as a fraction, shown to one decimal place, or shown to more than two decimal places.", markRefs: ["M4"] },
    ],
    commonResponses: [
      { idSuffix: "INTERCEPT_OVER_ONE", category: "PRESENTATION_ERROR", errorFamily: "NON_SIMPLEST_MODEL", normalisedResponse: "A correct salary model written as P = 1500T + 12500/1 receives two marks.", affectedMarkRefs: ["M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false },
      { idSuffix: "SMALL_GRAPH_COORDINATES", category: "COMMON_ERROR", errorFamily: "UNAUTHORISED_GRAPH_POINTS", normalisedResponse: "Using non-authorised small graph coordinates loses the gradient mark but can retain two marks for a consistent model.", affectedMarkRefs: ["M1", "M2", "M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true },
      { idSuffix: "UNSCALED_SALARY_VALUES", category: "COMMON_ERROR", errorFamily: "GRAPH_SCALE_ERROR", normalisedResponse: "Using salary-axis values without the required scale loses the gradient mark but can retain two marks when the later model is consistent.", affectedMarkRefs: ["M1", "M2", "M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true },
      { idSuffix: "FOLLOW_UP_SOURCE_ERROR_A", category: "PARTIAL_METHOD", errorFamily: "FOLLOW_THROUGH_MODEL", normalisedResponse: "A source-listed incorrect part-(a) model leading to £7.25 can still earn the follow-up mark when its carried estimate satisfies the source gate.", affectedMarkRefs: ["M4"], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: true },
      { idSuffix: "FOLLOW_UP_SOURCE_ERROR_B", category: "PARTIAL_METHOD", errorFamily: "FOLLOW_THROUGH_MODEL", normalisedResponse: "A second source-listed incorrect model leading to £24.50 can still earn the follow-up mark when the estimate remains eligible.", affectedMarkRefs: ["M4"], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: true },
    ],
    followUp: { normalisedAnswer: "£24,500", numericValue: 24500, unitDimension: "currency", unitSymbol: "£", unitsExplicitlyRequested: false, calculationSummary: "Substitute T = 8 into the eligible salary model and evaluate.", ownership: "S2", followThroughGate: "The carried estimate must remain non-negative and be presented in a source-eligible numerical form." },
    acceptedEquivalentPrimaryAnswers: [],
    primarySimplification: "REQUIRED_FOR_FULL_CREDIT", finalPrecisionType: "NONE", finalPrecisionValue: null, unitsPresentation: "NOT_STATED",
  },
  {
    year: 2024, paper: "P1", questionNumber: "9",
    msPages: [14, 15], printedPageLabels: ["page 14", "page 15"],
    canonicalPrimaryAnswer: "D = -2T + 32", primaryAnswerForm: "EQUATION",
    gradientSummary: "Use the two stated best-fit-line points to obtain gradient -2.",
    substitutionSummary: "Use the gradient and either stated point in a valid line form.",
    completionSummary: "Determine the intercept and state D = -2T + 32 in simplest contextual form.",
    gradientEligibilityConditions: ["Coordinate subtraction order must be consistent between numerator and denominator."],
    sourceMethodRefs: ["SLOPE_INTERCEPT", "POINT_SLOPE", "FOLLOW_UP"],
    answerOnlyRules: [
      { part: "A", treatment: "NO_CREDIT", marksAwarded: 0, markRefs: ["M1", "M2", "M3"], sourceKind: "QUESTION", notes: "Supporting working is required for the three-mark best-fit model." },
      { part: "B", treatment: "FULL_CREDIT", marksAwarded: 1, markRefs: ["M4"], sourceKind: "QUESTION", notes: "A consistent numerical estimate can receive the follow-up mark without working." },
    ],
    directives: [
      { idSuffix: "COORDINATE_ORDER", part: "A", effect: "BLOCK", summary: "The gradient mark is not awarded if point order is reversed in only one of the coordinate differences.", markRefs: ["M1"] },
      { idSuffix: "GRADIENT_SIMPLIFICATION_FT", part: "A", effect: "FOLLOW_THROUGH", summary: "An arithmetic error in the gradient can lose the error-point mark while still allowing valid later model-construction credit.", markRefs: ["M2", "M3"], maximumMarks: 2 },
      { idSuffix: "PART_B_UNIT_GRADIENT_BLOCK", part: "B", effect: "BLOCK", summary: "The follow-up mark is unavailable when the candidate's part-(a) gradient is +1 or -1, because the carried task has been trivialised.", markRefs: ["M4"] },
    ],
    commonResponses: [
      { idSuffix: "GENERIC_VARIABLES", category: "NOTATION_ERROR", errorFamily: "WRONG_CONTEXT_VARIABLES", normalisedResponse: "A numerically correct line written with generic x/y variables receives two marks.", affectedMarkRefs: ["M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false },
      { idSuffix: "UNSIMPLIFIED_MINUS_TWO", category: "PRESENTATION_ERROR", errorFamily: "UNSIMPLIFIED_COEFFICIENT", normalisedResponse: "A correct contextual model retaining the gradient as -2/1 receives two marks.", affectedMarkRefs: ["M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false },
      { idSuffix: "NEGATIVE_HALF_ROUTE", category: "COMMON_ERROR", errorFamily: "GRADIENT_RECIPROCAL_ERROR", normalisedResponse: "A consistent model built from gradient -1/2 receives two marks.", affectedMarkRefs: ["M1", "M2", "M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true },
      { idSuffix: "POSITIVE_HALF_ROUTE", category: "COMMON_ERROR", errorFamily: "GRADIENT_SIGN_ERROR", normalisedResponse: "A consistent model built from gradient +1/2 receives two marks.", affectedMarkRefs: ["M1", "M2", "M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true },
      { idSuffix: "FOLLOW_UP_POSITIVE_SIX", category: "PARTIAL_METHOD", errorFamily: "FOLLOW_THROUGH_MODEL", normalisedResponse: "A source-listed incorrect model producing 6 km at the follow-up input can still receive the follow-up mark.", affectedMarkRefs: ["M4"], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: true },
      { idSuffix: "FOLLOW_UP_NEGATIVE_TWENTY_TWO", category: "PARTIAL_METHOD", errorFamily: "FOLLOW_THROUGH_MODEL", normalisedResponse: "A source-listed carried model producing -22 km can still receive the follow-up mark where the model itself remains eligible.", affectedMarkRefs: ["M4"], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: true },
      { idSuffix: "FOLLOW_UP_CORRECTED_SIGN", category: "PARTIAL_METHOD", errorFamily: "FOLLOW_THROUGH_MODEL", normalisedResponse: "An explicit correction from a negative carried result to its positive contextual magnitude is accepted in the source-listed case.", affectedMarkRefs: ["M4"], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: true },
      { idSuffix: "FOLLOW_UP_INVALID_ARITHMETIC_SIGN", category: "COMMON_ERROR", errorFamily: "ARITHMETIC_SIGN_ERROR", normalisedResponse: "Claiming the positive value directly from invalid signed arithmetic, without a valid correction, receives no follow-up mark.", affectedMarkRefs: ["M4"], marksAwarded: 0, maximumMarks: 0, followThroughAvailable: false },
    ],
    followUp: { normalisedAnswer: "18 km", numericValue: 18, unitDimension: "length", unitSymbol: "km", unitsExplicitlyRequested: false, calculationSummary: "Substitute T = 7 into the eligible distance model and evaluate.", ownership: "S2", followThroughGate: "The carried part-(a) model must not have unit gradient ±1." },
    acceptedEquivalentPrimaryAnswers: [],
    primarySimplification: "REQUIRED_FOR_FULL_CREDIT", finalPrecisionType: "NONE", finalPrecisionValue: null, unitsPresentation: "NOT_STATED",
  },
  {
    year: 2025, paper: "P1", questionNumber: "6",
    msPages: [11], printedPageLabels: ["page 11"],
    canonicalPrimaryAnswer: "y = -2x + 14", primaryAnswerForm: "EQUATION",
    gradientSummary: "Read the two diagram coordinates and obtain gradient -2.",
    substitutionSummary: "Use the gradient and either point in point-slope or slope-intercept form.",
    completionSummary: "Determine the intercept and state y = -2x + 14 in simplest form.",
    gradientEligibilityConditions: [],
    sourceMethodRefs: ["SLOPE_INTERCEPT", "POINT_SLOPE"],
    answerOnlyRules: [{ part: "MAIN", treatment: "NO_CREDIT", marksAwarded: 0, markRefs: ["M1", "M2", "M3"], sourceKind: "QUESTION", notes: "The correct line equation without supporting working receives no marks." }],
    directives: [
      { idSuffix: "GRADIENT_SIMPLIFICATION_FT", part: "MAIN", effect: "FOLLOW_THROUGH", summary: "An incorrect gradient simplification loses the mark at the error point while allowing later consistent line-equation credit.", markRefs: ["M2", "M3"], maximumMarks: 2 },
      { idSuffix: "M3_SUBSEQUENT_INVALID_WORK", part: "MAIN", effect: "BLOCK", summary: "The final mark is unavailable when correct work is subsequently changed by invalid algebra.", markRefs: ["M3"] },
    ],
    commonResponses: [
      { idSuffix: "RECIPROCAL_GRADIENT", category: "COMMON_ERROR", errorFamily: "GRADIENT_RECIPROCAL_ERROR", normalisedResponse: "A source-listed reciprocal-gradient route using m = -5/10 = -1/2 can receive two marks when the later line construction is internally consistent.", affectedMarkRefs: ["M1", "M2", "M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true },
      { idSuffix: "INTERCEPT_SIGN_ERROR", category: "COMMON_ERROR", errorFamily: "INTERCEPT_ERROR", normalisedResponse: "A route with the correct gradient but an intercept/sign error leading to y = -2x ± 10 can receive two marks.", affectedMarkRefs: ["M2", "M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true },
      { idSuffix: "POINT_SLOPE_SIGN_ERROR", category: "COMMON_ERROR", errorFamily: "POINT_SLOPE_SIGN_ERROR", normalisedResponse: "Using an incorrect point-slope sign convention and reaching y = -2x - 10 can still retain two marks when the gradient and subsequent manipulation provide the source-listed evidence.", affectedMarkRefs: ["M2", "M3"], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true },
    ],
    followUp: null, acceptedEquivalentPrimaryAnswers: [],
    primarySimplification: "REQUIRED_FOR_FULL_CREDIT", finalPrecisionType: "NONE", finalPrecisionValue: null, unitsPresentation: "NOT_RELEVANT",
  },
] as const;

export const getG1AnswerConfig = (
  year: G1AnswerConfig["year"],
  paper: G1AnswerConfig["paper"],
  questionNumber: string,
): G1AnswerConfig => {
  const config = G1_ANSWER_CONFIGS.find(
    (entry) => entry.year === year && entry.paper === paper && entry.questionNumber === questionNumber,
  );
  if (!config) throw new Error(`Missing G1 answer catalogue config for ${year} ${paper} Q${questionNumber}`);
  return config;
};
