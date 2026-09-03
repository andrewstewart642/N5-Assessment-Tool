import type {
  A7ContextGeneratedQuestion,
  A7FractionalGeneratedQuestion,
  A7GeneratedQuestion,
  A7LinearDimension,
  A7Rational,
} from "../../../04_QuestionGeneration/02-Algebraic/ALG-A7-LinearEquations/Types";
import { resolveA7GeneratedAnswerProfile } from "./Calibration";
import type {
  A7GeneratedAnswerMethod,
  A7GeneratedAnswerProfile,
  A7GeneratedFinalAnswer,
  A7GeneratedMarkingScheme,
  A7GeneratedMarkPoint,
} from "./Types";
import { validateA7GeneratedAnswer } from "./Validation";

const SKILL_ID = "alg-a07-linear-equations" as const;

const rationalText = (value: A7Rational) => value.denominator === 1
  ? `${value.numerator}`
  : `${value.numerator}/${value.denominator}`;

const signedTerm = (coefficient: number, variable: string, first: boolean) => {
  if (coefficient === 0) return "";
  const magnitude = Math.abs(coefficient);
  const body = `${magnitude === 1 ? "" : magnitude}${variable}`;
  if (first) return coefficient < 0 ? `-${body}` : body;
  return coefficient < 0 ? ` - ${body}` : ` + ${body}`;
};

const linearSideText = (xCoefficient: number, constant: number) => {
  let result = signedTerm(xCoefficient, "x", true);
  if (constant !== 0) {
    if (!result) result = `${constant}`;
    else result += constant < 0 ? ` - ${Math.abs(constant)}` : ` + ${constant}`;
  }
  return result || "0";
};

const linearDimensionText = (dimension: A7LinearDimension) => {
  const magnitude = Math.abs(dimension.xCoefficient);
  const xTerm = magnitude === 1 ? "x" : `${magnitude}x`;
  return dimension.xCoefficient > 0
    ? `${xTerm} + ${dimension.constant}`
    : `${dimension.constant} - ${xTerm}`;
};

const fractionalClearedEquationText = (question: A7FractionalGeneratedQuestion) => {
  const state = question.mathState.clearedEquation;
  return `${linearSideText(state.lhsX, state.lhsConstant)} = ${linearSideText(state.rhsX, state.rhsConstant)}`;
};

const fractionalRearrangedText = (question: A7FractionalGeneratedQuestion) => {
  const state = question.mathState.rearrangedEquation;
  return `${state.xCoefficient}x = ${state.constant}`;
};

const triangleAreaExpression = (question: A7ContextGeneratedQuestion) => {
  const state = question.mathState;
  return `${state.triangle.fixedDimension}/2(${linearDimensionText(state.triangle.linearDimension)})`;
};

const rectangleAreaExpression = (question: A7ContextGeneratedQuestion) => {
  const state = question.mathState;
  return `${state.rectangle.fixedDimension}(${linearDimensionText(state.rectangle.linearDimension)})`;
};

const contextEqualAreaEquation = (question: A7ContextGeneratedQuestion) =>
  `${triangleAreaExpression(question)} = ${rectangleAreaExpression(question)}`;

const contextClearedEquation = (question: A7ContextGeneratedQuestion) => {
  const state = question.mathState;
  return `${state.triangle.fixedDimension}(${linearDimensionText(state.triangle.linearDimension)}) = ${2 * state.rectangle.fixedDimension}(${linearDimensionText(state.rectangle.linearDimension)})`;
};

const contextExpandedEquation = (question: A7ContextGeneratedQuestion) => {
  const state = question.mathState.clearedEquation;
  return `${linearSideText(state.leftXCoefficient, state.leftConstant)} = ${linearSideText(state.rightXCoefficient, state.rightConstant)}`;
};

const contextRearrangedEquation = (question: A7ContextGeneratedQuestion) => {
  const state = question.mathState.rearrangedEquation;
  return `${state.xCoefficient}x = ${state.constant}`;
};

const finalAnswers = (question: A7GeneratedQuestion): A7GeneratedFinalAnswer[] => {
  if (question.family === "FRACTIONAL_COEFFICIENT") {
    const solution = question.mathState.solution;
    return [{
      partLabel: "",
      normalisedAnswer: `x = ${rationalText(solution)}`,
      numericValue: solution.numerator / solution.denominator,
      exactRational: solution,
    }];
  }

  return [
    {
      partLabel: "a",
      normalisedAnswer: triangleAreaExpression(question),
      numericValue: null,
      exactRational: null,
    },
    {
      partLabel: "b",
      normalisedAnswer: `x = ${question.mathState.solution}`,
      numericValue: question.mathState.solution,
      exactRational: null,
    },
  ];
};

const classifiedMark = (
  question: A7GeneratedQuestion,
  profile: A7GeneratedAnswerProfile,
  input: Omit<A7GeneratedMarkPoint, "primarySkillId" | "standard" | "thinking" | "sourceAnchorIds">,
): A7GeneratedMarkPoint => ({
  ...input,
  primarySkillId: SKILL_ID,
  standard: "A",
  thinking: question.thinking,
  sourceAnchorIds: [...profile.sourceAnchorIds],
});

const fractionalMarkPoints = (
  question: A7FractionalGeneratedQuestion,
  profile: A7GeneratedAnswerProfile,
): A7GeneratedMarkPoint[] => [
  classifiedMark(question, profile, {
    markNumber: 1,
    partLabel: "",
    type: "PROCESS",
    role: "EQUIVALENT_EQUATION",
    requirement: "Eliminate the denominators or otherwise combine the fractional algebra into a valid equivalent linear equation.",
    evidenceExamples: [fractionalClearedEquationText(question)],
    acceptanceNotes: [
      `Multiplying throughout by ${question.mathState.denominatorLcm}, or by another valid common multiple, is acceptable when carried out consistently.`,
      "A mathematically equivalent algebraic route that combines/rearranges the fractional terms before clearing denominators is also acceptable.",
    ],
    dependsOnMarkNumbers: [],
    followThroughFromMarkNumbers: [],
    comparableDifficultyRequired: false,
    blockingConditions: ["A final answer alone does not imply this process mark."],
  }),
  classifiedMark(question, profile, {
    markNumber: 2,
    partLabel: "",
    type: "PROCESS",
    role: "REARRANGE",
    requirement: "Rearrange the equivalent linear equation to ax=b, or another genuine one-step form from which x can be obtained.",
    evidenceExamples: [fractionalRearrangedText(question)],
    acceptanceNotes: ["Equivalent sign-reversed or algebraically rearranged forms are acceptable."],
    dependsOnMarkNumbers: [1],
    followThroughFromMarkNumbers: [1],
    comparableDifficultyRequired: true,
    blockingConditions: ["The mark is unavailable where an earlier error has eased the remaining algebra below comparable difficulty."],
  }),
  classifiedMark(question, profile, {
    markNumber: 3,
    partLabel: "",
    type: "ACCURACY",
    role: "EXACT_SOLUTION",
    requirement: "Solve for x and state the reduced exact rational value.",
    evidenceExamples: [`x = ${rationalText(question.mathState.solution)}`],
    acceptanceNotes: [
      "The exact fraction must be stated in simplest form.",
      "A decimal approximation does not replace the required exact fraction.",
      "If the correct exact fraction is first stated, a later incorrect decimal conversion is not separately penalised.",
    ],
    dependsOnMarkNumbers: [2],
    followThroughFromMarkNumbers: [1, 2],
    comparableDifficultyRequired: true,
    blockingConditions: ["Repeated substitution is outside the generated algebraic marking pathway.", "A correct answer without supporting algebraic working receives no credit."],
  }),
];

const contextMarkPoints = (
  question: A7ContextGeneratedQuestion,
  profile: A7GeneratedAnswerProfile,
): A7GeneratedMarkPoint[] => [
  classifiedMark(question, profile, {
    markNumber: 1,
    partLabel: "a",
    type: "REPRESENTATION",
    role: "TRIANGLE_AREA",
    requirement: "Construct a correct expression for the area of the triangle from the supplied dimensions.",
    evidenceExamples: [triangleAreaExpression(question)],
    acceptanceNotes: [
      "Any algebraically equivalent triangle-area expression is acceptable.",
      "If omitted from part (a), an equivalent expression shown later in the part (b) working may supply this mark.",
    ],
    dependsOnMarkNumbers: [],
    followThroughFromMarkNumbers: [],
    comparableDifficultyRequired: false,
    blockingConditions: [],
  }),
  classifiedMark(question, profile, {
    markNumber: 2,
    partLabel: "b",
    type: "REPRESENTATION",
    role: "EQUAL_AREA_EQUATION",
    requirement: "Construct the rectangle-area expression and equate it to the triangle-area expression.",
    evidenceExamples: [contextEqualAreaEquation(question)],
    acceptanceNotes: ["Equivalent expanded or scaled equations are acceptable when they correctly represent equality of the two generated areas."],
    dependsOnMarkNumbers: [],
    followThroughFromMarkNumbers: [1],
    comparableDifficultyRequired: true,
    blockingConditions: ["Guess-and-check does not earn the algebraic solution marks."],
  }),
  classifiedMark(question, profile, {
    markNumber: 3,
    partLabel: "b",
    type: "PROCESS",
    role: "START_SOLVE",
    requirement: "Begin a valid algebraic solution while preserving and correctly transforming the triangle one-half factor.",
    evidenceExamples: [contextClearedEquation(question), contextExpandedEquation(question)],
    acceptanceNotes: ["Any equivalent valid transformation of the one-half factor and subsequent bracket expansion is acceptable."],
    dependsOnMarkNumbers: [2],
    followThroughFromMarkNumbers: [1, 2],
    comparableDifficultyRequired: true,
    blockingConditions: ["This mark is unavailable if an erroneous triangle-area model has removed the one-half structure and thereby eased the solving step."],
  }),
  classifiedMark(question, profile, {
    markNumber: 4,
    partLabel: "b",
    type: "PROCESS",
    role: "REARRANGE",
    requirement: "Collect and rearrange terms to obtain an equivalent equation with a single x term.",
    evidenceExamples: [contextRearrangedEquation(question)],
    acceptanceNotes: ["Consistent follow-through from an earlier model error may be credited when the remaining linear algebra retains comparable difficulty."],
    dependsOnMarkNumbers: [3],
    followThroughFromMarkNumbers: [1, 2, 3],
    comparableDifficultyRequired: true,
    blockingConditions: [],
  }),
  classifiedMark(question, profile, {
    markNumber: 5,
    partLabel: "b",
    type: "ACCURACY",
    role: "CONTEXT_SOLUTION",
    requirement: "Divide to obtain the required exact value of x.",
    evidenceExamples: [`x = ${question.mathState.solution}`],
    acceptanceNotes: ["The intended generated route preserves a genuinely mark-bearing final division with a two-digit x coefficient."],
    dependsOnMarkNumbers: [4],
    followThroughFromMarkNumbers: [1, 2, 3, 4],
    comparableDifficultyRequired: true,
    blockingConditions: [
      "The final mark is unavailable where an earlier error eases the final step to a trivial single-digit coefficient dividing exactly to an integer.",
      "Guess-and-check receives no credit for the four-mark algebraic solution part.",
    ],
  }),
];

const fractionalMethod = (
  question: A7FractionalGeneratedQuestion,
  profile: A7GeneratedAnswerProfile,
): A7GeneratedAnswerMethod => ({
  methodFamilyId: "CLEAR_DENOMINATORS",
  sourceEvidenceIds: [...profile.sourceAnchorIds],
  lines: [
    {
      id: `${question.instanceId}-CLEAR-DENOMINATORS`,
      text: `Multiply throughout by ${question.mathState.denominatorLcm}: ${fractionalClearedEquationText(question)}.`,
      markNumbers: [1],
    },
    {
      id: `${question.instanceId}-REARRANGE`,
      text: `${fractionalRearrangedText(question)}.`,
      markNumbers: [2],
    },
    {
      id: `${question.instanceId}-SOLVE`,
      text: `x = ${rationalText(question.mathState.solution)}.`,
      markNumbers: [3],
    },
  ],
});

const contextMethod = (
  question: A7ContextGeneratedQuestion,
  profile: A7GeneratedAnswerProfile,
): A7GeneratedAnswerMethod => ({
  methodFamilyId: "AREA_EQUALITY_LINEAR_SOLVE",
  sourceEvidenceIds: [...profile.sourceAnchorIds],
  lines: [
    {
      id: `${question.instanceId}-TRIANGLE-AREA`,
      text: `Area of triangle = ${triangleAreaExpression(question)}.`,
      markNumbers: [1],
    },
    {
      id: `${question.instanceId}-EQUAL-AREAS`,
      text: `${contextEqualAreaEquation(question)}.`,
      markNumbers: [2],
    },
    {
      id: `${question.instanceId}-CLEAR-HALF`,
      text: `${contextClearedEquation(question)}; hence ${contextExpandedEquation(question)}.`,
      markNumbers: [3],
    },
    {
      id: `${question.instanceId}-REARRANGE`,
      text: `${contextRearrangedEquation(question)}.`,
      markNumbers: [4],
    },
    {
      id: `${question.instanceId}-SOLVE`,
      text: `x = ${question.mathState.solution}.`,
      markNumbers: [5],
    },
  ],
});

export const generateA7Answer = (question: A7GeneratedQuestion): A7GeneratedMarkingScheme => {
  const profile = resolveA7GeneratedAnswerProfile(question);
  if (profile.family !== question.family) {
    throw new Error(`A7 answer profile ${profile.id} does not support ${question.family}.`);
  }

  const fractional = question.family === "FRACTIONAL_COEFFICIENT";
  const markPoints = fractional
    ? fractionalMarkPoints(question, profile)
    : contextMarkPoints(question, profile);
  const method = fractional
    ? fractionalMethod(question, profile)
    : contextMethod(question, profile);

  const answer: A7GeneratedMarkingScheme = {
    generatorId: "A7_LINEAR_EQUATIONS_ANSWER_V1",
    questionInstanceId: question.instanceId,
    family: question.family,
    profileId: profile.id,
    markProfile: profile.markProfile,
    profileSourceAnchorIds: [...profile.sourceAnchorIds],
    totalMarks: question.marks,
    standard: question.standard,
    thinking: question.thinking,
    intendedSolution: question.mathState.solution,
    finalAnswers: finalAnswers(question),
    markPoints,
    methods: [method],
    defaultMethodFamilyId: method.methodFamilyId,
    workingPolicy: {
      unsupportedCorrectAnswerTreatment: profile.correctAnswerWithoutWorking,
      algebraicWorkingRequired: true,
      equivalentAlgebraicRoutesAccepted: true,
      permittedMethodFamilies: [method.methodFamilyId],
      excludedPrototypeMethods: [...profile.explicitlyExcludedMethods],
      laterPartCanSupplyTriangleAreaEvidence: profile.laterPartCanSupplyTriangleAreaEvidence,
      followThroughPrinciple: "Later process or accuracy credit may survive an earlier error only where the subsequent algebra is mathematically coherent and retains comparable difficulty; family-specific easing restrictions remain binding.",
      generationPolicyRationale: `${profile.rationale} This is a generated marking policy calibrated from the reviewed A7 corpus and must not be read as rewriting source-local historical rules.`,
    },
    presentationPolicy: {
      exactFractionRequired: profile.exactFractionRequired,
      simplestFormRequired: fractional,
      decimalApproximationDoesNotReplaceExactFraction: profile.exactFractionRequired,
      unitsRequiredForFinalAnswer: false,
      equivalentAreaExpressionsAccepted: !fractional,
      triangleHalfFactorMustSurviveFirstSolveStep: profile.triangleHalfFactorMustSurviveFirstSolveStep,
      trivialIntegerFinalDivisionBlocked: profile.trivialIntegerFinalDivisionBlocked,
    },
    sourceBasis: question.sourceBasis,
    generationNotes: [
      "Question and answer generation consume the same deterministic A7 mathematical state.",
      `Generated marking profile: ${profile.id} (${profile.markProfile}).`,
      `Profile anchors: ${profile.sourceAnchorIds.join(", ")}.`,
      "Every generated mark is wholly owned by alg-a07-linear-equations and carries the question's teacher-moderated Standard/Thinking profile.",
      "Equivalent algebraic routes are acceptable even though one canonical worked route is rendered.",
      "Context dimension placement/orientation may vary, but one fixed and one linear dimension per shape keep the area model linear.",
      "Historical source wording and source layout are calibration evidence only and are not used as answer templates.",
    ],
  };

  const validation = validateA7GeneratedAnswer(question, answer);
  if (!validation.valid) {
    const errors = validation.issues.filter((issue) => issue.severity === "ERROR");
    throw new Error(`Generated A7 answer failed validation: ${errors.map((issue) => `${issue.code}: ${issue.message}`).join("; ")}`);
  }
  return answer;
};

export const generateA7AnswerBatch = (questions: readonly A7GeneratedQuestion[]): A7GeneratedMarkingScheme[] =>
  questions.map((question) => generateA7Answer(question));
