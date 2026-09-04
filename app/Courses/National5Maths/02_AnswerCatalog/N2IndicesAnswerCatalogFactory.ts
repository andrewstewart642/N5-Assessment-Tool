import type {
  CatalogEvidenceRef,
  CatalogMarkStandard,
  CatalogProvenance,
} from "../CatalogCoreTypes";
import type { QuestionCatalogEntry } from "../01_QuestionCatalog/QuestionCatalogTypes";
import type {
  AnswerCatalogEntry,
  CommonResponseCategory,
  CommonResponsePattern,
  MarkNode,
  MethodEvidenceRole,
  MethodPathway,
  PresentationPolicy,
  SourceMarkingDirective,
} from "./AnswerCatalogTypes";
import { asHistoricalAnswerCatalogEntry } from "./AnswerCatalogHistoricalView";
import {
  GENERAL_2014_RULE_IDS,
  answerOnly,
  answerReviewInProgress,
  consistencyFeature,
  emptyMethodEquivalence,
  emptyVisualMarking,
  markNode,
  msEvidence,
  presentationPolicy,
  sourcePresentation,
  unitProfile,
  workingPolicy,
} from "./AnswerCatalogHelpers";
import {
  classifyMark,
  deriveMarkClassificationSummary,
  type ClassifiedMarkNode,
  validateClassifiedMarkNodes,
} from "./MarkClassification";

const SKILL_ID = "num-n2-indices";
const TOOLKIT_DOCUMENT_ID = "N5_MATH_CREATING_EVIDENCE_TOOLKIT";
const FOI_DOCUMENT_ID = "N5_MATH_FOI_STANDARD_2022_2025_USER_COPY";

export type N2AnswerProfile =
  | "PRODUCT_QUOTIENT_WITH_COEFFICIENT"
  | "FRACTIONAL_NUMERIC_EVALUATION"
  | "POWER_OF_POWER_WITH_NEGATIVE_INDEX"
  | "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX"
  | "SQUARED_FRACTIONAL_MONOMIAL"
  | "PRODUCT_OVER_ROOT"
  | "NEGATIVE_INDEX_QUOTIENT"
  | "DISTRIBUTIVE_INDEX_EXPANSION"
  | "POSITIVE_POWER_PRODUCT_QUOTIENT";

export type N2StandardEvidenceKind = "TOOLKIT_MODERATED" | "FOI_MIXED" | "FOI_UNIFORM";

export type N2AnswerConfig = {
  question: QuestionCatalogEntry;
  profile: N2AnswerProfile;
  msPage: number;
  printedPageLabel: string;
  canonicalAnswer: string;
  numericValue: number | null;
  standards: CatalogMarkStandard[];
  standardEvidenceKind: N2StandardEvidenceKind;
  sourceStandardDistribution?: { C: number; A: number };
};

type MarkTemplate = {
  requirement: string;
  purpose: string;
  illustrativeEvidence: string;
  resultingState: string;
  operation: string;
  subgoalNumber: number;
  primaryType?: MarkNode["primaryType"];
  secondaryTypes?: MarkNode["secondaryTypes"];
};

type MethodStepTemplate = {
  markNumber: number;
  subgoalNumber: number;
  step: string;
  operation: string;
  resultingState: string;
};

type MethodTemplate = {
  suffix: string;
  role: MethodEvidenceRole;
  supportsFullCredit: boolean;
  applicabilityConditions: string[];
  steps: MethodStepTemplate[];
};

type SourceSpecificProfile = {
  answerOnlyTreatment: "FULL_CREDIT" | "NO_CREDIT" | "NOT_STATED";
  answerOnlyMarks: number | null;
  directives: SourceMarkingDirective[];
  commonResponses: CommonResponsePattern[];
  acceptedEquivalentForms: AnswerCatalogEntry["expectedResponse"]["acceptedEquivalentForms"];
  presentation: Partial<PresentationPolicy>;
  sourceNoteCount: number;
  explicitlyListedCommonResponseCount: number;
};

const detailedEvidence = (config: N2AnswerConfig): CatalogEvidenceRef =>
  msEvidence(
    config.question.identity.questionNumber,
    config.msPage,
    "MARKING_SCHEME",
    config.question.identity.paper,
    config.question.identity.year,
    config.printedPageLabel,
  );

const toolkitEvidence = (
  config: N2AnswerConfig,
  pdfPages: number[],
  locatorNote: string,
): CatalogEvidenceRef => ({
  documentId: TOOLKIT_DOCUMENT_ID,
  pdfPages,
  printedPageLabels: pdfPages.map((page) => `page ${page}`),
  paper: config.question.identity.paper,
  questionLocator: `Q${config.question.identity.questionNumber}`,
  evidenceType: "CLASSIFICATION_GUIDANCE",
  locatorNote,
});

const foiEvidence = (config: N2AnswerConfig): CatalogEvidenceRef => ({
  documentId: FOI_DOCUMENT_ID,
  pdfPages: [],
  printedPageLabels: [],
  paper: config.question.identity.paper,
  questionLocator: `Q${config.question.identity.questionNumber}`,
  evidenceType: "FOI_CLASSIFICATION",
  locatorNote: config.sourceStandardDistribution
    ? `${config.question.identity.year} ${config.question.identity.paper} question-level C/A breakdown: ${config.sourceStandardDistribution.C} C mark(s), ${config.sourceStandardDistribution.A} A mark(s).`
    : `${config.question.identity.year} ${config.question.identity.paper} question-level C/A breakdown.`,
});

const standardClassificationEvidence = (
  config: N2AnswerConfig,
): { evidence: CatalogEvidenceRef[]; provenance: CatalogProvenance; notes: string } => {
  if (config.standardEvidenceKind === "FOI_UNIFORM") {
    return {
      evidence: [foiEvidence(config)],
      provenance: "SOURCE_FACT",
      notes: "The supplied question-level FOI distribution is uniform, so the standard of each one-mark node is directly determined by the source distribution.",
    };
  }

  if (config.standardEvidenceKind === "FOI_MIXED") {
    return {
      evidence: [
        foiEvidence(config),
        toolkitEvidence(config, [2, 8], "The classification guidance describes how Grade A demand can arise within indices questions and separates C/A demand from reasoning."),
      ],
      provenance: "CATALOGUE_CLASSIFICATION",
      notes: "The supplied FOI workbook fixes the question-level C/A totals. The allocation of those totals to individual mark nodes is the teacher-moderated catalogue classification agreed for the N2 sweep.",
    };
  }

  return {
    evidence: [
      toolkitEvidence(config, [2], "The Grade A skills table provides historical indices examples and describes more challenging use of the laws of indices."),
      toolkitEvidence(config, [8], "The common-question guidance identifies fractional, negative and multi-rule indices as potential A-standard demand without supplying a mark-by-mark historical split."),
    ],
    provenance: "CATALOGUE_CLASSIFICATION",
    notes: "No source document supplies a mark-by-mark C/A split for this historical question. The mark-node standards are the teacher-moderated catalogue classification agreed for the N2 sweep.",
  };
};

const thinkingClassificationEvidence = (config: N2AnswerConfig) => ({
  evidence: [
    toolkitEvidence(config, [6], "The reasoning guidance defines reasoning through interpretation/strategy selection or explanation related to context."),
    toolkitEvidence(config, [8], "The indices rows in the common-question guidance are classified by mark type without being identified as reasoning questions."),
  ],
  provenance: "CATALOGUE_CLASSIFICATION" as const,
  notes: "This directly cued symbolic/numerical indices task was teacher-moderated as Operational; multi-stage index manipulation alone is not treated as Reasoning.",
});

const marksForProfile = (config: N2AnswerConfig): MarkTemplate[] => {
  switch (config.profile) {
    case "PRODUCT_QUOTIENT_WITH_COEFFICIENT":
      return [
        {
          requirement: "Simplify the same-base powers in the numerator product.",
          purpose: "Combine the numerator powers before division.",
          illustrativeEvidence: "Obtain 10n^6 in the numerator.",
          resultingState: "10n^6/(2n^2)",
          operation: "MULTIPLY_POWERS",
          subgoalNumber: 2,
        },
        {
          requirement: "Cancel the numerical constants correctly.",
          purpose: "Reduce the coefficient independently of the powers.",
          illustrativeEvidence: "Reduce the numerical factor 10/2 to 5.",
          resultingState: "5n^6/n^2",
          operation: "SIMPLIFY_COEFFICIENT",
          subgoalNumber: 1,
        },
        {
          requirement: "Eliminate the variable from the denominator using the quotient index law.",
          purpose: "Complete the same-base division to a single power.",
          illustrativeEvidence: "Subtract exponent 2 from exponent 6 to obtain 5n^4.",
          resultingState: "5n^4",
          operation: "DIVIDE_POWERS",
          subgoalNumber: 3,
          secondaryTypes: ["ACCURACY"],
        },
      ];

    case "FRACTIONAL_NUMERIC_EVALUATION":
      return [
        {
          requirement: "Interpret the fractional index using an equivalent root-and-power representation.",
          purpose: "Translate the fractional exponent into an exact evaluable form.",
          illustrativeEvidence: "Show an equivalent root/power representation of the supplied fractional power.",
          resultingState: "equivalent root-and-power form",
          operation: "INTERPRET_FRACTIONAL_INDEX",
          subgoalNumber: 1,
          primaryType: "INTERPRETATION",
        },
        {
          requirement: "Complete the exact numerical evaluation.",
          purpose: "Evaluate the fractional power exactly.",
          illustrativeEvidence: `Obtain ${config.canonicalAnswer}.`,
          resultingState: config.canonicalAnswer,
          operation: "EVALUATE_EXACT_POWER",
          subgoalNumber: 2,
          secondaryTypes: ["ACCURACY"],
        },
      ];

    case "POWER_OF_POWER_WITH_NEGATIVE_INDEX":
      return [
        {
          requirement: "Apply the power-of-a-power index law correctly.",
          purpose: "Simplify the bracketed power structure.",
          illustrativeEvidence: config.question.identity.year === 2016 ? "Obtain n^6." : "Obtain m^(-8).",
          resultingState: config.question.identity.year === 2016 ? "n^6" : "m^(-8)",
          operation: "POWER_OF_POWER",
          subgoalNumber: 1,
        },
        {
          requirement: "Apply a second valid index-law step consistently.",
          purpose: "Continue the simplification through the signed exponents.",
          illustrativeEvidence: config.question.identity.year === 2016 ? "Obtain n^(-4) or an equivalent reciprocal state." : "Obtain m^(-13) or an equivalent reciprocal state.",
          resultingState: config.question.identity.year === 2016 ? "n^(-4) or equivalent" : "m^(-13) or equivalent",
          operation: "COMBINE_OR_REPRESENT_NEGATIVE_POWERS",
          subgoalNumber: 2,
        },
        {
          requirement: "Express the final result using a positive power.",
          purpose: "Satisfy the required positive-power output form.",
          illustrativeEvidence: `Obtain ${config.canonicalAnswer}.`,
          resultingState: config.canonicalAnswer,
          operation: "NEGATIVE_POWER_TO_RECIPROCAL",
          subgoalNumber: 3,
          primaryType: "PRESENTATION",
          secondaryTypes: ["ACCURACY"],
        },
      ];

    case "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX":
      return [
        {
          requirement: "Express the root as an equivalent fractional power.",
          purpose: "Translate root notation into index notation.",
          illustrativeEvidence: "Use exponent 1/3 for the cube-root expression.",
          resultingState: "1/x^(1/3)",
          operation: "ROOT_TO_FRACTIONAL_INDEX",
          subgoalNumber: 1,
          primaryType: "REPRESENTATION",
        },
        {
          requirement: "Apply the reciprocal negative-index law.",
          purpose: "Write the reciprocal as a single negative fractional power.",
          illustrativeEvidence: "Obtain x^(-1/3).",
          resultingState: "x^(-1/3)",
          operation: "RECIPROCAL_TO_NEGATIVE_INDEX",
          subgoalNumber: 2,
          secondaryTypes: ["ACCURACY"],
        },
      ];

    case "SQUARED_FRACTIONAL_MONOMIAL":
      return [
        {
          requirement: "Start the squaring process correctly on either the coefficient or the indexed variable.",
          purpose: "Apply the outer square to one component of the monomial.",
          illustrativeEvidence: "Obtain 4/9 for the coefficient or p^8 for the variable power.",
          resultingState: "4/9 or p^8 established",
          operation: "POWER_OF_PRODUCT",
          subgoalNumber: 1,
        },
        {
          requirement: "Complete the squaring process for both components.",
          purpose: "Combine the correctly squared coefficient and variable power.",
          illustrativeEvidence: "Obtain (4/9)p^8.",
          resultingState: "(4/9)p^8",
          operation: "COMPLETE_POWER_OF_PRODUCT",
          subgoalNumber: 2,
          secondaryTypes: ["ACCURACY"],
        },
      ];

    case "PRODUCT_OVER_ROOT":
      return [
        {
          requirement: "Apply the product index law to the numerator.",
          purpose: "Combine the numerator powers and coefficient.",
          illustrativeEvidence: "Obtain 3a^5 from a^4 multiplied by 3a.",
          resultingState: "3a^5/sqrt(a)",
          operation: "MULTIPLY_POWERS",
          subgoalNumber: 1,
        },
        {
          requirement: "Express the square root using a fractional index.",
          purpose: "Move the denominator into index notation.",
          illustrativeEvidence: "Use a^(1/2) for sqrt(a).",
          resultingState: "3a^5/a^(1/2)",
          operation: "ROOT_TO_FRACTIONAL_INDEX",
          subgoalNumber: 2,
          primaryType: "REPRESENTATION",
        },
        {
          requirement: "Complete the quotient simplification.",
          purpose: "Subtract the denominator exponent from the numerator exponent.",
          illustrativeEvidence: "Obtain 3a^(9/2).",
          resultingState: "3a^(9/2)",
          operation: "DIVIDE_POWERS",
          subgoalNumber: 3,
          secondaryTypes: ["ACCURACY"],
        },
      ];

    case "NEGATIVE_INDEX_QUOTIENT":
      return [
        {
          requirement: "Start the simplification with one correct application of an index law.",
          purpose: "Establish a valid first simplification state.",
          illustrativeEvidence: "Show one valid same-base combination or positive-power conversion.",
          resultingState: "one correct intermediate index state",
          operation: "APPLY_ONE_INDEX_LAW",
          subgoalNumber: 1,
        },
        {
          requirement: "Complete the simplification to a single negative power.",
          purpose: "Combine the remaining same-base powers consistently.",
          illustrativeEvidence: "Obtain 5c^(-9).",
          resultingState: "5c^(-9)",
          operation: "COMPLETE_INDEX_SIMPLIFICATION",
          subgoalNumber: 2,
        },
        {
          requirement: "Express the result with a positive power.",
          purpose: "Convert the negative final exponent to reciprocal positive-power form.",
          illustrativeEvidence: "Obtain 5/c^9.",
          resultingState: "5/c^9",
          operation: "NEGATIVE_POWER_TO_RECIPROCAL",
          subgoalNumber: 3,
          primaryType: "PRESENTATION",
          secondaryTypes: ["ACCURACY"],
        },
      ];

    case "DISTRIBUTIVE_INDEX_EXPANSION":
      return [
        {
          requirement: "Apply the multiplication index law correctly to one term after distributing the outside factor.",
          purpose: "Establish one correct expanded term.",
          illustrativeEvidence: "Obtain x^(3/2), x^0 or 1 for one of the two products.",
          resultingState: "one expanded term correct",
          operation: "DISTRIBUTE_AND_MULTIPLY_POWERS",
          subgoalNumber: 1,
        },
        {
          requirement: "Apply the multiplication index law to both terms and simplify the result.",
          purpose: "Complete the distributive expansion and simplify x^0.",
          illustrativeEvidence: "Obtain x^(3/2)+1.",
          resultingState: "x^(3/2)+1",
          operation: "COMPLETE_DISTRIBUTIVE_INDEX_SIMPLIFICATION",
          subgoalNumber: 2,
          secondaryTypes: ["ACCURACY"],
        },
      ];

    case "POSITIVE_POWER_PRODUCT_QUOTIENT":
      return [
        {
          requirement: "Apply the power-of-a-power index law.",
          purpose: "Simplify the bracketed power before combining factors.",
          illustrativeEvidence: "Obtain n^6.",
          resultingState: "n^7*n^6/n^4",
          operation: "POWER_OF_POWER",
          subgoalNumber: 1,
        },
        {
          requirement: "Apply the product index law.",
          purpose: "Combine the numerator powers.",
          illustrativeEvidence: "Obtain n^13.",
          resultingState: "n^13/n^4",
          operation: "MULTIPLY_POWERS",
          subgoalNumber: 2,
        },
        {
          requirement: "Apply the quotient index law.",
          purpose: "Complete the simplification to a single power.",
          illustrativeEvidence: "Obtain n^9.",
          resultingState: "n^9",
          operation: "DIVIDE_POWERS",
          subgoalNumber: 3,
          secondaryTypes: ["ACCURACY"],
        },
      ];
  }
};

const methodsForProfile = (config: N2AnswerConfig, marks: MarkTemplate[]): MethodTemplate[] => {
  const primary = (suffix: string, steps: MethodStepTemplate[], role: MethodEvidenceRole = "PRIMARY_ILLUSTRATIVE"): MethodTemplate => ({
    suffix,
    role,
    supportsFullCredit: role !== "PARTIAL_METHOD_EVIDENCE",
    applicabilityConditions: [],
    steps,
  });

  const directSteps = marks.map((mark, index) => ({
    markNumber: index + 1,
    subgoalNumber: mark.subgoalNumber,
    step: mark.requirement,
    operation: mark.operation,
    resultingState: mark.resultingState,
  }));

  if (config.profile === "POWER_OF_POWER_WITH_NEGATIVE_INDEX" && config.question.identity.year === 2016) {
    return [
      primary("METHOD_NEGATIVE_EXPONENT_FIRST", directSteps),
      primary("METHOD_RECIPROCAL_BEFORE_MULTIPLYING", [
        directSteps[0],
        {
          markNumber: 2,
          subgoalNumber: 2,
          step: "Rewrite the negative power as a reciprocal positive power.",
          operation: "NEGATIVE_POWER_TO_RECIPROCAL",
          resultingState: "1/n^10",
        },
        {
          markNumber: 3,
          subgoalNumber: 3,
          step: "Combine n^6 with the reciprocal power to obtain the final positive-power fraction.",
          operation: "DIVIDE_POWERS",
          resultingState: "1/n^4",
        },
      ], "FULL_CREDIT_ALTERNATIVE"),
    ];
  }

  if (config.profile === "POWER_OF_POWER_WITH_NEGATIVE_INDEX" && config.question.identity.year === 2022) {
    return [
      primary("METHOD_SIGNED_EXPONENTS", directSteps),
      primary("METHOD_RECIPROCAL_AFTER_POWER", [
        directSteps[0],
        {
          markNumber: 2,
          subgoalNumber: 2,
          step: "Rewrite one or both negative powers as reciprocals with positive exponents.",
          operation: "NEGATIVE_POWER_TO_RECIPROCAL",
          resultingState: "1/m^8 with 1/m^5 or equivalent",
        },
        {
          markNumber: 3,
          subgoalNumber: 3,
          step: "Complete the reciprocal multiplication to obtain the final positive-power denominator.",
          operation: "MULTIPLY_RECIPROCALS",
          resultingState: "1/m^13",
        },
      ], "FULL_CREDIT_ALTERNATIVE"),
      primary("METHOD_RECIPROCAL_BEFORE_POWER", [
        {
          markNumber: 1,
          subgoalNumber: 1,
          step: "Rewrite the negative inner power as a reciprocal before applying the outer power.",
          operation: "NEGATIVE_POWER_TO_RECIPROCAL",
          resultingState: "(1/m^2)^4 or 1/m^5 established",
        },
        {
          markNumber: 2,
          subgoalNumber: 2,
          step: "Apply the outer power to the reciprocal expression.",
          operation: "POWER_OF_RECIPROCAL",
          resultingState: "1/m^8",
        },
        {
          markNumber: 3,
          subgoalNumber: 3,
          step: "Complete the simplification to 1/m^13.",
          operation: "MULTIPLY_RECIPROCALS",
          resultingState: "1/m^13",
        },
      ], "FULL_CREDIT_ALTERNATIVE"),
    ];
  }

  if (config.profile === "NEGATIVE_INDEX_QUOTIENT") {
    return [
      primary("METHOD_SIGNED_EXPONENTS", directSteps),
      primary("METHOD_POSITIVE_POWERS_FIRST", [
        {
          markNumber: 1,
          subgoalNumber: 1,
          step: "Rewrite negative powers using reciprocal positive-power form.",
          operation: "NEGATIVE_POWER_TO_RECIPROCAL",
          resultingState: "5/(c^3*c^4*c^2)",
        },
        {
          markNumber: 2,
          subgoalNumber: 2,
          step: "Combine at least two denominator powers correctly.",
          operation: "MULTIPLY_POWERS",
          resultingState: "5/(c^7*c^2) or equivalent",
        },
        {
          markNumber: 3,
          subgoalNumber: 3,
          step: "Complete the denominator power and state the positive-power result.",
          operation: "MULTIPLY_POWERS",
          resultingState: "5/c^9",
        },
      ], "FULL_CREDIT_ALTERNATIVE"),
    ];
  }

  if (config.profile === "PRODUCT_OVER_ROOT") {
    return [
      primary("METHOD_FRACTIONAL_DENOMINATOR", directSteps),
      primary("METHOD_RATIONALISE_START", [
        {
          markNumber: 1,
          subgoalNumber: 1,
          step: "Start by rationalising the denominator while preserving a valid numerator product state.",
          operation: "RATIONALISE_DENOMINATOR",
          resultingState: "a valid rationalised state supporting the first mark",
        },
      ], "PARTIAL_METHOD_EVIDENCE"),
    ];
  }

  return [primary("METHOD_PRIMARY", directSteps)];
};

const directive = (
  config: N2AnswerConfig,
  suffix: string,
  summary: string,
  effect: SourceMarkingDirective["effect"],
  markIds: string[],
  methodIds: string[],
  evidence: CatalogEvidenceRef[],
  marksAwarded: number | null = null,
  maximumMarks: number | null = null,
): SourceMarkingDirective => ({
  id: `${config.question.identity.id}_D_${suffix}`,
  layer: "QUESTION_NOTE",
  scope: "QUESTION",
  effect,
  normalisedSummary: summary,
  appliesToPartIds: [`Q${config.question.identity.questionNumber}_MAIN`],
  appliesToMarkIds: markIds,
  appliesToMethodIds: methodIds,
  marksAwarded,
  maximumMarks,
  sourceEvidence: evidence,
});

const commonResponse = (
  config: N2AnswerConfig,
  suffix: string,
  sourceStatus: CommonResponsePattern["sourceStatus"],
  category: CommonResponseCategory,
  errorFamily: string,
  response: string,
  affectedMarkIds: string[],
  marksAwarded: number | null,
  maximumMarks: number | null,
  followThroughAvailable: boolean,
  evidence: CatalogEvidenceRef[],
  sourceDirectiveIds: string[] = [],
): CommonResponsePattern => ({
  id: `Q${config.question.identity.questionNumber}_CR_${suffix}`,
  sourceStatus,
  category,
  errorFamily,
  normalisedResponse: response,
  affectedMarkIds,
  marksAwarded,
  maximumMarks,
  followThroughAvailable,
  sourceDirectiveIds,
  sourceEvidence: evidence,
});

const sourceSpecificProfile = (
  config: N2AnswerConfig,
  markIds: string[],
  methodIds: string[],
  evidence: CatalogEvidenceRef[],
): SourceSpecificProfile => {
  const fullAnswerDirective = directive(
    config,
    "ANSWER_ONLY_FULL",
    "A correct final answer without supporting working receives full credit.",
    "AWARD",
    markIds,
    methodIds,
    evidence,
    markIds.length,
    markIds.length,
  );
  const zeroAnswerDirective = directive(
    config,
    "ANSWER_ONLY_ZERO",
    "A correct final answer without supporting working receives no credit.",
    "BLOCK",
    markIds,
    methodIds,
    evidence,
    0,
    0,
  );

  const base: SourceSpecificProfile = {
    answerOnlyTreatment: "FULL_CREDIT",
    answerOnlyMarks: markIds.length,
    directives: [fullAnswerDirective],
    commonResponses: [],
    acceptedEquivalentForms: [],
    presentation: {},
    sourceNoteCount: 1,
    explicitlyListedCommonResponseCount: 0,
  };

  switch (config.question.identity.year) {
    case 2014: {
      const overOne = directive(config, "OVER_ONE_LIMIT", "An otherwise correct result left over a denominator of one is limited to two marks.", "LIMIT", [markIds[1]], methodIds, evidence, 2, 2);
      const fiveN3NoWork = directive(config, "5N3_NO_WORK", "The source explicitly awards one mark to the incorrect final expression 5n^3 when no working is shown.", "AWARD", markIds, [], evidence, 1, 1);
      return {
        ...base,
        directives: [fullAnswerDirective, overOne, fiveN3NoWork],
        sourceNoteCount: 3,
        presentation: {
          simplification: "REQUIRED_FOR_FULL_CREDIT",
          otherConditions: ["The otherwise equivalent form 5n^4/1 is explicitly limited to two marks."],
        },
        commonResponses: [
          commonResponse(config, "OVER_ONE", "DERIVED_FROM_EXPLICIT_NOTE", "PRESENTATION_ERROR", "DENOMINATOR_ONE_RETAINED", "Give 5n^4/1 as the final answer.", [markIds[1]], 2, 2, false, evidence, [overOne.id]),
          commonResponse(config, "WRONG_NUMERATOR_POWER", "DERIVED_FROM_EXPLICIT_NOTE", "COMMON_ERROR", "NUMERATOR_INDEX_ERROR", "Use 10n^5 over 2n^2 and simplify to 5n^3.", [markIds[0]], 2, 2, true, evidence),
          commonResponse(config, "WRONG_FINAL_POWER", "DERIVED_FROM_EXPLICIT_NOTE", "COMMON_ERROR", "FINAL_INDEX_ERROR", "Correctly form 10n^6 over 2n^2 but finish at 5n^3.", [markIds[2]], 2, 2, false, evidence),
          commonResponse(config, "COMPENSATING_INDEX_ERRORS", "DERIVED_FROM_EXPLICIT_NOTE", "COMMON_ERROR", "COMPENSATING_INDEX_ERRORS", "Use reduced exponents that preserve only the coefficient step before finishing at 5n^3.", [markIds[1]], 1, 1, true, evidence),
          commonResponse(config, "5N3_NO_WORK", "DERIVED_FROM_EXPLICIT_NOTE", "ANSWER_ONLY", "INCORRECT_POWER_ANSWER_ONLY", "State 5n^3 without working.", markIds, 1, 1, false, evidence, [fiveN3NoWork.id]),
        ],
      };
    }

    case 2015:
      return {
        ...base,
        sourceNoteCount: 2,
        commonResponses: [
          commonResponse(config, "PARTIAL_FRACTIONAL_EVALUATION", "DERIVED_FROM_EXPLICIT_NOTE", "PARTIAL_METHOD", "INCOMPLETE_FRACTIONAL_POWER", "Evaluate only one component of the fractional-index interpretation without completing the full power.", [markIds[1]], 1, 1, false, evidence),
        ],
      };

    case 2016:
      return {
        ...base,
        sourceNoteCount: 1,
        presentation: { positivePowers: "REQUIRED_FOR_MARK" },
      };

    case 2017:
      return {
        ...base,
        sourceNoteCount: 3,
        explicitlyListedCommonResponseCount: 3,
        acceptedEquivalentForms: [
          {
            id: `${config.question.identity.id}_A_ALT_N_VALUE`,
            normalisedAnswer: "n=-1/3",
            numericValue: null,
            answerForm: "EXPRESSION",
            mathematicallyEquivalentToVariantIds: [`${config.question.identity.id}_A1`],
            conditionsForAcceptance: ["Accepted where the response identifies the required exponent directly."],
            sourceEvidence: evidence,
            notes: "The source explicitly awards full credit for stating the exponent value rather than rewriting the whole expression.",
          },
        ],
        commonResponses: [
          commonResponse(config, "STATE_N", "EXPLICITLY_LISTED", "VALID_ALTERNATIVE", "STATE_EXPONENT_ONLY", "State n=-1/3.", [], 2, 2, false, evidence),
          commonResponse(config, "NEGATIVE_COEFFICIENT", "EXPLICITLY_LISTED", "COMMON_ERROR", "NEGATIVE_SIGN_OUTSIDE_POWER", "Write a negative sign outside x^(1/3) instead of using a negative exponent.", [markIds[1]], 1, 1, false, evidence),
          commonResponse(config, "EXPONENT_MINUS_THREE", "EXPLICITLY_LISTED", "COMMON_ERROR", "RECIPROCAL_ROOT_EXPONENT_ERROR", "Write x^(-3).", [markIds[0]], 1, 1, false, evidence),
        ],
      };

    case 2018: {
      const subsequentIncorrect = directive(config, "SUBSEQUENT_INCORRECT_BLOCKS_M2", "After a correct first step, subsequent incorrect working prevents the second mark from being awarded.", "BLOCK", [markIds[1]], methodIds, evidence, null, 1);
      return {
        ...base,
        directives: [fullAnswerDirective, subsequentIncorrect],
        sourceNoteCount: 4,
        presentation: { simplification: "REQUIRED_FOR_FULL_CREDIT" },
        commonResponses: [
          commonResponse(config, "ADD_TERMS_INSTEAD_OF_SQUARE", "DERIVED_FROM_EXPLICIT_NOTE", "MISCONCEPTION", "POWER_OF_PRODUCT_TREATED_AS_ADDITION", "Treat the squared monomial as an addition of repeated terms rather than a product.", markIds, 0, 0, false, evidence),
          commonResponse(config, "INCORRECT_EXPANSION_WITH_ONE_VALID_COMPONENT", "DERIVED_FROM_EXPLICIT_NOTE", "PARTIAL_METHOD", "INCORRECT_EXPANSION_ONE_COMPONENT_VALID", "Use an incorrect expansion but still establish either the coefficient 4/9 or the power p^8.", [markIds[1]], 1, 1, false, evidence),
        ],
      };
    }

    case 2019:
      return {
        ...base,
        sourceNoteCount: 5,
        acceptedEquivalentForms: [
          {
            id: `${config.question.identity.id}_A_ALT_DECIMAL_EXPONENT`,
            normalisedAnswer: "3a^4.5",
            numericValue: null,
            answerForm: "EXPRESSION",
            mathematicallyEquivalentToVariantIds: [`${config.question.identity.id}_A1`],
            conditionsForAcceptance: ["Accepted as a mathematically equivalent but non-preferred exponent form."],
            sourceEvidence: evidence,
            notes: "The source explicitly accepts the decimal exponent representation as bad form.",
          },
        ],
        presentation: {
          significantNotationRequirements: ["Equivalent fractional or decimal exponent notation is accepted where mathematically equivalent."],
        },
      };

    case 2021:
      return {
        ...base,
        answerOnlyTreatment: "NOT_STATED",
        answerOnlyMarks: null,
        directives: [],
        sourceNoteCount: 0,
      };

    case 2022:
      return {
        ...base,
        sourceNoteCount: 1,
        explicitlyListedCommonResponseCount: 2,
        presentation: { positivePowers: "REQUIRED_FOR_MARK" },
        commonResponses: [
          commonResponse(config, "M2_TIMES_M_MINUS5", "EXPLICITLY_LISTED", "COMMON_ERROR", "POWER_OF_POWER_SIGN_ERROR", "Reach m^2*m^(-5), then simplify to 1/m^3.", [markIds[0]], 2, 2, true, evidence),
          commonResponse(config, "M8_TIMES_M_MINUS5", "EXPLICITLY_LISTED", "COMMON_ERROR", "POWER_OF_POWER_SIGN_ERROR", "Reach m^8*m^(-5), then simplify to m^3.", [markIds[0], markIds[2]], 1, 1, false, evidence),
        ],
      };

    case 2023:
      return {
        ...base,
        sourceNoteCount: 1,
        explicitlyListedCommonResponseCount: 4,
        presentation: { positivePowers: "REQUIRED_FOR_MARK", simplification: "REQUIRED_FOR_MARK" },
        commonResponses: [
          commonResponse(config, "RECIPROCAL_OF_5C9", "EXPLICITLY_LISTED", "PRESENTATION_ERROR", "RECIPROCAL_APPLIED_TO_COEFFICIENT", "Reach 5c^(-9) then write 1/(5c^9).", [markIds[2]], 2, 2, false, evidence),
          commonResponse(config, "STOP_AT_C_MINUS5_THEN_POSITIVE", "EXPLICITLY_LISTED", "COMMON_ERROR", "INCOMPLETE_DENOMINATOR_COMBINATION", "Reach 5c^(-5) and then convert that state to positive-power form.", [markIds[1]], 2, 2, true, evidence),
          commonResponse(config, "STOP_AT_C_MINUS5", "EXPLICITLY_LISTED", "PARTIAL_METHOD", "INCOMPLETE_DENOMINATOR_COMBINATION", "Reach an intermediate 5/c^5 state and stop.", [markIds[1], markIds[2]], 1, 1, false, evidence),
          commonResponse(config, "DENOMINATOR_EXPONENT_TWELVE", "EXPLICITLY_LISTED", "COMMON_ERROR", "DENOMINATOR_EXPONENT_ERROR", "Use an incorrect denominator exponent but then simplify consistently and convert to positive-power form.", [markIds[0]], 2, 2, true, evidence),
        ],
      };

    case 2024: {
      const subsequentIncorrect = directive(config, "SUBSEQUENT_INCORRECT_BLOCKS_M2", "After a valid first mark, subsequent incorrect algebra prevents the second mark from being awarded.", "BLOCK", [markIds[1]], methodIds, evidence, null, 1);
      return {
        ...base,
        directives: [fullAnswerDirective, subsequentIncorrect],
        sourceNoteCount: 5,
        explicitlyListedCommonResponseCount: 3,
        acceptedEquivalentForms: [
          {
            id: `${config.question.identity.id}_A_ALT_DECIMAL_EXPONENT`,
            normalisedAnswer: "x^1.5+1",
            numericValue: null,
            answerForm: "EXPRESSION",
            mathematicallyEquivalentToVariantIds: [`${config.question.identity.id}_A1`],
            conditionsForAcceptance: ["Accepted as an equivalent exponent representation."],
            sourceEvidence: evidence,
            notes: "The source explicitly accepts the decimal exponent representation as bad form.",
          },
        ],
        presentation: {
          simplification: "REQUIRED_FOR_FULL_CREDIT",
          significantNotationRequirements: ["Equivalent fractional or decimal exponent notation is accepted where mathematically equivalent."],
        },
        commonResponses: [
          commonResponse(config, "LEAVE_X_ZERO", "EXPLICITLY_LISTED", "PRESENTATION_ERROR", "ZERO_POWER_NOT_SIMPLIFIED", "Leave the second expanded term as x^0 rather than simplifying it to 1.", [markIds[1]], 1, 1, false, evidence),
          commonResponse(config, "SECOND_TERM_AS_X", "EXPLICITLY_LISTED", "COMMON_ERROR", "NEGATIVE_INDEX_PRODUCT_ERROR", "Expand the first term correctly but leave the second term as x.", [markIds[1]], 1, 1, false, evidence),
          commonResponse(config, "REDUCE_BRACKET_BEFORE_DISTRIBUTION", "EXPLICITLY_LISTED", "MISCONCEPTION", "BRACKET_REDUCED_TO_ONE_TERM", "Reduce the bracketed terms to one term before applying the outside multiplication law.", markIds, 0, 0, false, evidence),
        ],
      };
    }

    case 2025: {
      const subsequentIncorrect = directive(config, "SUBSEQUENT_INCORRECT_BLOCKS_M3", "After correct earlier work, subsequent incorrect working prevents the third mark from being awarded.", "BLOCK", [markIds[2]], methodIds, evidence, null, 2);
      return {
        ...base,
        answerOnlyTreatment: "NO_CREDIT",
        answerOnlyMarks: 0,
        directives: [zeroAnswerDirective, subsequentIncorrect],
        sourceNoteCount: 2,
        explicitlyListedCommonResponseCount: 3,
        presentation: { simplification: "REQUIRED_FOR_MARK" },
        commonResponses: [
          commonResponse(config, "POWER_OF_POWER_TO_N5", "EXPLICITLY_LISTED", "COMMON_ERROR", "POWER_OF_POWER_SUBTRACTION", "Use n^5 for the bracketed power, then apply the remaining product and quotient laws consistently.", [markIds[0]], 2, 2, true, evidence),
          commonResponse(config, "POWER_OF_POWER_TO_N9", "EXPLICITLY_LISTED", "COMMON_ERROR", "POWER_OF_POWER_MULTIPLICATION_ERROR", "Use n^9 for the bracketed power, then apply the remaining product and quotient laws consistently.", [markIds[0]], 2, 2, true, evidence),
          commonResponse(config, "POWER_OF_POWER_TO_N42", "EXPLICITLY_LISTED", "COMMON_ERROR", "POWER_OF_POWER_BASE_EXPONENT_MULTIPLICATION", "Use n^42 after multiplying exponents incorrectly, then continue with the quotient.", [markIds[1], markIds[2]], 1, 1, false, evidence),
        ],
      };
    }

    default:
      return base;
  }
};

const buildMethods = (
  config: N2AnswerConfig,
  templates: MethodTemplate[],
  markIds: string[],
  evidence: CatalogEvidenceRef[],
  sourceTotalAwardRules: string[],
): MethodPathway[] => templates.map((method) => {
  const methodId = `${config.question.identity.id}_${method.suffix}`;
  const stepIds = method.steps.map((_, index) => `${methodId}_S${index + 1}`);
  return {
    id: methodId,
    variantId: null,
    evidenceRole: method.role,
    supportsFullCredit: method.supportsFullCredit,
    applicabilityConditions: method.applicabilityConditions,
    steps: method.steps.map((step, index) => ({
      id: stepIds[index],
      order: index + 1,
      normalisedStep: step.step,
      linkedQuestionSubgoalIds: [`Q${config.question.identity.questionNumber}_S${step.subgoalNumber}`],
      linkedMarkIds: [markIds[step.markNumber - 1]],
      dependsOnStepIds: index === 0 ? [] : [stepIds[index - 1]],
      requiredOperations: [step.operation],
      resultingStateSummary: step.resultingState,
      sourceEvidence: evidence,
    })),
    markMappingComplete: method.supportsFullCredit,
    sourceTotalAwardRules,
    mathematicallyEquivalentMethodIds: [],
    materiallyDistinctFromMethodIds: [],
    excludedMethodReasons: [],
    sourceEvidence: evidence,
  };
});

const buildReview = (config: N2AnswerConfig) => {
  const review = answerReviewInProgress(
    config.question.identity.questionNumber,
    config.question.identity.paper,
    config.question.identity.year,
  );
  const { generationAnalysisComplete: _generationAnalysisComplete, ...historicalReview } = review;
  return {
    ...historicalReview,
    unresolvedIssues: [],
    validationNotes: [
      ...review.validationNotes,
      "N2 mark ownership and C/A plus Operational/Reasoning classifications were teacher-moderated before Answer Catalog implementation.",
      config.standardEvidenceKind === "FOI_MIXED"
        ? "The supplied FOI source fixes the question-level C/A totals; the mark-by-mark allocation remains an explicit catalogue classification rather than a claimed source fact."
        : config.standardEvidenceKind === "FOI_UNIFORM"
          ? "The supplied FOI source fixes a uniform question-level C/A distribution, which directly determines every one-mark node's standard."
          : "Pre-2022 mark-by-mark C/A assignments remain catalogue classifications pending any future source that supplies exact historical mark-level standard data.",
      "Cross-corpus synthesis and answer-generation policy remain outside the historical Answer Catalog.",
    ],
  };
};

export const createN2IndexAnswerCatalogEntry = (config: N2AnswerConfig): AnswerCatalogEntry => {
  const q = `Q${config.question.identity.questionNumber}`;
  const evidence = [detailedEvidence(config)];
  const markTemplates = marksForProfile(config);

  if (markTemplates.length !== config.question.structure.totalMarks || config.standards.length !== markTemplates.length) {
    throw new Error(`N2 ${config.question.identity.id}: mark template/classification count does not match the source tariff.`);
  }

  const markIds = markTemplates.map((_, index) => `${config.question.identity.id}_M${index + 1}`);
  const methodTemplates = methodsForProfile(config, markTemplates);
  const provisionalMethodIds = methodTemplates.map((method) => `${config.question.identity.id}_${method.suffix}`);
  const sourceSpecific = sourceSpecificProfile(config, markIds, provisionalMethodIds, evidence);

  const standardEvidence = standardClassificationEvidence(config);
  const thinkingEvidence = thinkingClassificationEvidence(config);

  const markNodes: ClassifiedMarkNode[] = markTemplates.map((template, index) => {
    const mark = markNode(
      markIds[index],
      index + 1,
      `${q}_MAIN`,
      template.primaryType ?? "PROCESS",
      template.requirement,
      template.purpose,
      [SKILL_ID],
      config.question.curriculum.conceptIds,
      [`${q}_S${template.subgoalNumber}`],
      evidence,
      {
        secondaryTypes: template.secondaryTypes ?? [],
        illustrativeEvidence: [{
          id: `${markIds[index]}_E1`,
          normalisedEvidence: template.illustrativeEvidence,
          acceptedLocations: ["WORKING", "FINAL_ANSWER"],
          mayBeImpliedByLaterWork: true,
          mayBeImpliedByCorrectFinalAnswer: sourceSpecific.answerOnlyTreatment === "FULL_CREDIT",
          visualElementIds: [],
          sourceEvidence: evidence,
        }],
        methodPathwayIds: methodTemplates
          .filter((method) => method.steps.some((step) => step.markNumber === index + 1))
          .map((method) => `${config.question.identity.id}_${method.suffix}`),
        presentationConditions: template.primaryType === "PRESENTATION" ? ["The required output form must be satisfied for this mark."] : [],
        sourceDirectiveIds: sourceSpecific.directives
          .filter((item) => item.appliesToMarkIds.includes(markIds[index]))
          .map((item) => item.id),
      },
    );

    return classifyMark(mark, {
      primarySkillId: SKILL_ID,
      standard: config.standards[index],
      thinking: "OPERATIONAL",
      standardEvidence: standardEvidence.evidence,
      thinkingEvidence: thinkingEvidence.evidence,
      standardProvenance: standardEvidence.provenance,
      thinkingProvenance: thinkingEvidence.provenance,
      standardNotes: standardEvidence.notes,
      thinkingNotes: thinkingEvidence.notes,
    });
  });

  const classificationIssues = validateClassifiedMarkNodes(markNodes);
  if (classificationIssues.length) {
    throw new Error(`Invalid N2 V3 mark classification: ${classificationIssues.join(" | ")}`);
  }

  const classificationSummary = deriveMarkClassificationSummary(markNodes);
  if (config.sourceStandardDistribution) {
    if (
      classificationSummary.standardMarkDistribution.C !== config.sourceStandardDistribution.C
      || classificationSummary.standardMarkDistribution.A !== config.sourceStandardDistribution.A
    ) {
      throw new Error(`N2 ${config.question.identity.id}: mark-node standard allocation does not reproduce the supplied question-level FOI distribution.`);
    }
  }
  if (classificationSummary.thinkingMarkDistribution.OPERATIONAL !== config.question.structure.totalMarks) {
    throw new Error(`N2 ${config.question.identity.id}: every historical N2 mark must remain Operational in the moderated sweep.`);
  }

  const sourceTotalAwardRules = sourceSpecific.directives
    .filter((item) => item.marksAwarded !== null)
    .map((item) => item.id);
  const methods = buildMethods(config, methodTemplates, markIds, evidence, sourceTotalAwardRules);
  const canonicalAnswerId = `${config.question.identity.id}_A1`;

  const fingerprint = [
    consistencyFeature("mark_count", config.question.structure.totalMarks, "Historical mark tariff for this N2 question.", evidence),
    consistencyFeature("canonical_answer", config.canonicalAnswer, "Normalised historical expected answer.", evidence),
    consistencyFeature("source_method_count", methodTemplates.length, "Number of method blocks/pathways represented from the source marking evidence.", evidence),
    ...(sourceSpecific.answerOnlyTreatment !== "NOT_STATED"
      ? [consistencyFeature("answer_only_treatment", sourceSpecific.answerOnlyTreatment, "Question-specific source treatment of a correct answer with no supporting working.", evidence)]
      : []),
    ...(config.sourceStandardDistribution
      ? [
          consistencyFeature("foi_c_marks", config.sourceStandardDistribution.C, "Question-level C-mark total in the supplied FOI workbook.", [foiEvidence(config)]),
          consistencyFeature("foi_a_marks", config.sourceStandardDistribution.A, "Question-level A-mark total in the supplied FOI workbook.", [foiEvidence(config)]),
        ]
      : []),
  ];

  return asHistoricalAnswerCatalogEntry({
    identity: {
      id: config.question.identity.answerCatalogId,
      schemaVersion: "N5_CATALOG_V3",
      sourceQuestionId: config.question.identity.id,
      courseId: config.question.identity.courseId,
      paperContextId: config.question.identity.paperContextId,
      year: config.question.identity.year,
      paper: config.question.identity.paper,
      questionNumber: config.question.identity.questionNumber,
      questionFamilyId: config.question.family.familyId,
    },
    sourceContext: {
      sourceDocumentId: `N5_MATH_${config.question.identity.year}_MS`,
      totalMarks: config.question.structure.totalMarks,
      sourcePages: [config.msPage],
      printedPageLabels: [config.printedPageLabel],
      sourceEvidence: evidence,
      generalMarkingPolicyId: `N5_MATH_${config.question.identity.year}_GENERAL_MARKING_POLICY`,
    },
    expectedResponse: {
      responseTypes: config.question.task.responseTypes,
      canonicalAnswers: [{
        id: canonicalAnswerId,
        normalisedAnswer: config.canonicalAnswer,
        numericValue: config.numericValue,
        answerForm: config.question.task.responseTypes.includes("NUMBER") ? "NUMBER" : "EXPRESSION",
        mathematicallyEquivalentToVariantIds: [],
        conditionsForAcceptance: [],
        sourceEvidence: evidence,
        notes: null,
      }],
      acceptedEquivalentForms: sourceSpecific.acceptedEquivalentForms,
      precisionType: "NONE",
      precisionValue: null,
      acceptedRange: null,
      units: unitProfile(null, null),
      requiredContextStatement: false,
      answerCountRequired: 1,
      invalidRelatedValues: [],
      extraAnswerTreatment: "NOT_RELEVANT",
    },
    sourceDirectives: sourceSpecific.directives,
    markNodes,
    methodPathways: methods,
    methodEquivalence: emptyMethodEquivalence(),
    workingPolicy: workingPolicy(
      answerOnly(
        sourceSpecific.answerOnlyTreatment,
        sourceSpecific.answerOnlyMarks,
        sourceSpecific.answerOnlyTreatment === "FULL_CREDIT" ? markIds : [],
        evidence,
        sourceSpecific.directives
          .filter((item) => item.id.endsWith("ANSWER_ONLY_FULL") || item.id.endsWith("ANSWER_ONLY_ZERO"))
          .map((item) => item.id),
      ),
      sourceSpecific.answerOnlyTreatment === "NO_CREDIT" ? markIds : [],
      sourceSpecific.answerOnlyTreatment === "FULL_CREDIT" ? markIds : [],
      config.question.identity.paper,
      config.question.identity.year,
    ),
    presentationPolicy: presentationPolicy(evidence, sourceSpecific.presentation),
    visualMarking: emptyVisualMarking(),
    commonResponses: sourceSpecific.commonResponses,
    generalPolicy: {
      policyId: `N5_MATH_${config.question.identity.year}_GENERAL_MARKING_POLICY`,
      relevantRuleIds: config.question.identity.year === 2014 ? [...GENERAL_2014_RULE_IDS] : [],
      questionSpecificOverrides: sourceSpecific.directives.map((item) => item.id),
    },
    relationship: {
      partMarkMap: [{ questionPartId: `${q}_MAIN`, markIds }],
      subgoalMarkMap: markTemplates.map((template, index) => ({
        questionSubgoalId: `${q}_S${template.subgoalNumber}`,
        markIds: [markIds[index]],
      })),
      promptInstructionConsequences: [
        ...(config.question.answerSpecification.positivePowersRequired
          ? [{
              instructionType: "POSITIVE_POWER_OUTPUT",
              markingConsequence: "The final presentation mark requires conversion from a negative exponent to reciprocal positive-power form.",
              affectedMarkIds: [markIds[markIds.length - 1]],
              sourceEvidence: evidence,
            }]
          : []),
        ...(sourceSpecific.presentation.simplification === "REQUIRED_FOR_MARK" || sourceSpecific.presentation.simplification === "REQUIRED_FOR_FULL_CREDIT"
          ? [{
              instructionType: "SIMPLIFY",
              markingConsequence: "The source marking evidence distinguishes a fully simplified final form from incomplete or bad-form presentations.",
              affectedMarkIds: [markIds[markIds.length - 1]],
              sourceEvidence: evidence,
            }]
          : []),
      ],
      informationEvidenceMap: [{
        questionInformationId: `${q}_INFO_EXPR`,
        usedByMethodIds: methods.map((item) => item.id),
        supportsMarkIds: markIds,
      }],
      representationEvidenceMap: [],
      crossPartDependencies: [],
      errorPropagationGraph: [],
    },
    sourcePresentation: sourcePresentation(
      [config.msPage],
      config.profile === "PRODUCT_OVER_ROOT" ? "TABLE_ROW" : methodTemplates.length > 1 ? "MULTI_METHOD_TABLE_ROW" : "TABLE_ROW",
      config.profile === "PRODUCT_OVER_ROOT" ? 1 : methodTemplates.length,
      sourceSpecific.sourceNoteCount,
      sourceSpecific.explicitlyListedCommonResponseCount,
    ),
    consistency: { factualFingerprint: fingerprint },
    review: buildReview(config),
  });
};
