import type {
  G1BestFitGeneratedQuestion,
  G1ContextualGeneratedQuestion,
  G1LineEquationGeneratedQuestion,
  G1SymbolicGeneratedQuestion,
} from "../../../04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Types";
import {
  g1AnswerRationalPlain,
  g1GradientCalculationPlain,
  g1PointSlopePlain,
  g1SlopeInterceptSubstitutionPlain,
  g1SymbolicFactorCancelLatex,
} from "./Formatting";
import type {
  G1GeneratedAnswerProfile,
  G1GeneratedMarkPoint,
} from "./Types";

const SKILL_ID = "geo-g01-gradient-two-points" as const;

type NumericQuestion =
  | G1LineEquationGeneratedQuestion
  | G1ContextualGeneratedQuestion
  | G1BestFitGeneratedQuestion;

const classifiedMark = (
  question: NumericQuestion | G1SymbolicGeneratedQuestion,
  profile: G1GeneratedAnswerProfile,
  input: Omit<G1GeneratedMarkPoint, "primarySkillId" | "standard" | "thinking" | "sourceAnchorIds">,
): G1GeneratedMarkPoint => ({
  ...input,
  primarySkillId: SKILL_ID,
  standard: question.standard,
  thinking: question.thinking,
  sourceAnchorIds: [...profile.sourceAnchorIds],
});

const primaryPartLabel = (question: NumericQuestion): "" | "a" =>
  question.family === "LINE_EQUATION_FROM_TWO_POINTS" ? "" : "a";

const gradientEvidencePoints = (question: NumericQuestion) => {
  if (question.family === "BEST_FIT_LINEAR_MODEL" && question.surfaceStyleId === "BEST_FIT_GRID_READ_POINTS") {
    const points = question.mathState.lineReadPoints;
    return [points[0], points[points.length - 1]] as const;
  }
  return question.mathState.points;
};

const gradientRequirement = (question: NumericQuestion) => {
  if (question.family === "LINE_EQUATION_FROM_TWO_POINTS" && question.surfaceStyleId === "COORDINATE_DIAGRAM_LINE_EQUATION") {
    return "Read the two generated point coordinates from the coordinate diagram and calculate the gradient using a consistent subtraction order.";
  }
  if (question.family === "BEST_FIT_LINEAR_MODEL" && question.surfaceStyleId === "BEST_FIT_GRID_READ_POINTS") {
    return "Select two distinct exact readable points from the supplied fitted line and calculate the gradient using a consistent subtraction order.";
  }
  if (question.family === "BEST_FIT_LINEAR_MODEL") {
    return "Use the two stated points on the supplied fitted line to calculate the gradient with a consistent subtraction order.";
  }
  return "Use the two supplied model-defining points to calculate the gradient with a consistent subtraction order.";
};

export const buildG1NumericMarkPoints = (
  question: NumericQuestion,
  profile: G1GeneratedAnswerProfile,
): G1GeneratedMarkPoint[] => {
  const state = question.mathState;
  const partLabel = primaryPartLabel(question);
  const [first, second] = gradientEvidencePoints(question);
  const pointsForAnchor = question.family === "BEST_FIT_LINEAR_MODEL" && question.surfaceStyleId === "BEST_FIT_GRID_READ_POINTS"
    ? question.mathState.lineReadPoints
    : question.mathState.points;

  const marks: G1GeneratedMarkPoint[] = [
    classifiedMark(question, profile, {
      markNumber: 1,
      partLabel,
      type: "METHOD",
      role: "GRADIENT",
      requirement: gradientRequirement(question),
      evidenceExamples: [g1GradientCalculationPlain(first, second, state.gradient)],
      acceptanceNotes: [
        "Numerator and denominator coordinate differences may both be reversed; reversing only one difference is not accepted for the gradient mark.",
        question.family === "BEST_FIT_LINEAR_MODEL" && question.surfaceStyleId === "BEST_FIT_GRID_READ_POINTS"
          ? "Any two distinct points from the generated readable-line-point set are eligible when read exactly from the supplied line."
          : "The generated coordinate pair may be used in either order when the subtraction order remains consistent.",
      ],
      dependsOnMarkNumbers: [],
      followThroughFromMarkNumbers: [],
      comparableDifficultyRequired: false,
      blockingConditions: ["A guessed gradient without coordinate-difference evidence does not earn this method mark under the generated working-required policy."],
    }),
    classifiedMark(question, profile, {
      markNumber: 2,
      partLabel,
      type: "PROCESS",
      role: "LINE_POSITION",
      requirement: "Use the gradient with one eligible generated line point to establish the line position, either by finding the intercept or by forming a valid point-slope equation.",
      evidenceExamples: [
        g1SlopeInterceptSubstitutionPlain(state, pointsForAnchor[0]),
        g1PointSlopePlain(state, pointsForAnchor[0]),
      ],
      acceptanceNotes: [
        "Slope-intercept and point-slope routes are equally valid.",
        "A carried gradient error may be followed through when the substitution is internally consistent and the remaining line construction retains comparable difficulty.",
      ],
      dependsOnMarkNumbers: [1],
      followThroughFromMarkNumbers: [1],
      comparableDifficultyRequired: true,
      blockingConditions: ["The process mark is not awarded where an earlier error has trivialised the line-position step."],
    }),
    classifiedMark(question, profile, {
      markNumber: 3,
      partLabel,
      type: "ACCURACY",
      role: "FINAL_EQUATION",
      requirement: `State the requested line equation in simplest form${profile.contextVariablesRequiredForModel ? " using the generated contextual variables" : ""}.`,
      evidenceExamples: [state.equationPlain],
      acceptanceNotes: [
        "Any algebraically equivalent final line form is acceptable when it is genuinely simplified and preserves the generated variables.",
        "For an exact fractional gradient, a decimal approximation does not replace the exact coefficient required by the generated answer policy.",
      ],
      dependsOnMarkNumbers: [2],
      followThroughFromMarkNumbers: [1, 2],
      comparableDifficultyRequired: true,
      blockingConditions: [
        "A correct equation without supporting working receives no credit under the generated working-required regime.",
        ...(profile.contextVariablesRequiredForModel ? ["Replacing the generated contextual variables with generic x/y notation prevents full presentation credit."] : []),
      ],
    }),
  ];

  if (question.family === "CONTEXTUAL_LINEAR_MODEL") {
    marks.push(classifiedMark(question, profile, {
      markNumber: 4,
      partLabel: "b",
      type: "PROCESS",
      role: "MODEL_APPLICATION",
      requirement: "Substitute the supplied new input into the deterministic model and evaluate the requested contextual value.",
      evidenceExamples: [
        `${state.yVariable} = (${g1AnswerRationalPlain(state.gradient)})(${state.followUp.input}) + ${g1AnswerRationalPlain(state.intercept)} = ${g1AnswerRationalPlain(state.followUp.exactOutput)}`,
      ],
      acceptanceNotes: [
        `The contextual unit ${state.followUp.outputUnit} may be stated but is not required for this generated one-mark calculation.`,
        "Consistent follow-through from a carried part-(a) model is permitted only when the application still requires a non-trivial multiplication/division and an addition/subtraction.",
      ],
      dependsOnMarkNumbers: [3],
      followThroughFromMarkNumbers: [1, 2, 3],
      comparableDifficultyRequired: true,
      blockingConditions: ["A carried model that trivialises the follow-up calculation is not eligible for follow-through credit."],
    }));
  }

  return marks;
};

export const buildG1SymbolicMarkPoints = (
  question: G1SymbolicGeneratedQuestion,
  profile: G1GeneratedAnswerProfile,
): G1GeneratedMarkPoint[] => {
  const state = question.mathState;
  return [
    classifiedMark(question, profile, {
      markNumber: 1,
      partLabel: "",
      type: "METHOD",
      role: "SYMBOLIC_QUOTIENT",
      requirement: "Substitute the two generated coordinate points into the two-point gradient formula using the same point order in numerator and denominator.",
      evidenceExamples: [`m = ${state.gradientQuotientLatex}`],
      acceptanceNotes: ["The coordinate differences may both be reversed; mixed subtraction order is not accepted."],
      dependsOnMarkNumbers: [],
      followThroughFromMarkNumbers: [],
      comparableDifficultyRequired: false,
      blockingConditions: ["A final symbolic expression alone does not imply the coordinate-gradient method mark."],
    }),
    classifiedMark(question, profile, {
      markNumber: 2,
      partLabel: "",
      type: "PROCESS",
      role: "SYMBOLIC_FACTORISATION",
      requirement: "Factor the difference-of-squares numerator created by the generated gradient quotient.",
      evidenceExamples: [state.numeratorFactorisationLatex],
      acceptanceNotes: ["Equivalent ordering of the two linear factors is accepted."],
      dependsOnMarkNumbers: [1],
      followThroughFromMarkNumbers: [1],
      comparableDifficultyRequired: true,
      blockingConditions: ["Factorisation must remain consistent with a valid generated gradient quotient."],
    }),
    classifiedMark(question, profile, {
      markNumber: 3,
      partLabel: "",
      type: "ACCURACY",
      role: "SYMBOLIC_CANCEL_FINAL",
      requirement: "Factor the denominator, cancel the common non-zero factor and state the exact gradient expression in simplest form.",
      evidenceExamples: [g1SymbolicFactorCancelLatex(state)],
      acceptanceNotes: [
        "The two terms in the final linear gradient expression may be written in either order.",
        `Cancellation is valid only where the generated excluded parameter value ${g1AnswerRationalPlain(state.excludedParameterValue)} is excluded from the original coordinate pair.`,
      ],
      dependsOnMarkNumbers: [2],
      followThroughFromMarkNumbers: [1, 2],
      comparableDifficultyRequired: true,
      blockingConditions: ["A correct final expression without the required symbolic working receives no credit under the generated policy."],
    }),
  ];
};
