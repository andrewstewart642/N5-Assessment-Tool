import type {
  G1GeneratedQuestion,
  G1Rational,
} from "../../../04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Types";
import { resolveG1GeneratedAnswerProfile } from "./Calibration";
import {
  g1AnswerRationalLatex,
  g1AnswerRationalPlain,
  g1SymbolicFinalPlain,
} from "./Formatting";
import { buildG1NumericMarkPoints, buildG1SymbolicMarkPoints } from "./MarkPoints";
import { buildG1NumericMethods, buildG1SymbolicMethod } from "./Methods";
import type {
  G1GeneratedAnswerMethod,
  G1GeneratedFinalAnswer,
  G1GeneratedMarkingScheme,
} from "./Types";
import { validateG1GeneratedAnswer } from "./Validation";

const rationalNumber = (value: G1Rational) => value.numerator / value.denominator;

const finalAnswers = (question: G1GeneratedQuestion): G1GeneratedFinalAnswer[] => {
  if (question.family === "SYMBOLIC_GRADIENT_FROM_TWO_POINTS") {
    return [{
      partLabel: "",
      normalisedAnswer: g1SymbolicFinalPlain(question.mathState),
      latex: question.mathState.finalGradientLatex,
      numericValue: null,
      exactRational: null,
      unit: null,
    }];
  }

  const equationPart: "" | "a" = question.family === "LINE_EQUATION_FROM_TWO_POINTS" ? "" : "a";
  const answers: G1GeneratedFinalAnswer[] = [{
    partLabel: equationPart,
    normalisedAnswer: question.mathState.equationPlain,
    latex: question.mathState.equationLatex,
    numericValue: null,
    exactRational: null,
    unit: null,
  }];

  if (question.family === "CONTEXTUAL_LINEAR_MODEL") {
    answers.push({
      partLabel: "b",
      normalisedAnswer: g1AnswerRationalPlain(question.mathState.followUp.exactOutput),
      latex: g1AnswerRationalLatex(question.mathState.followUp.exactOutput),
      numericValue: rationalNumber(question.mathState.followUp.exactOutput),
      exactRational: question.mathState.followUp.exactOutput,
      unit: question.mathState.followUp.outputUnit,
    });
  }
  return answers;
};

const permittedMethods = (methods: G1GeneratedAnswerMethod[]) =>
  methods.map((method) => method.methodFamilyId);

export const generateG1Answer = (
  question: G1GeneratedQuestion,
): G1GeneratedMarkingScheme => {
  const profile = resolveG1GeneratedAnswerProfile(question);
  if (profile.family !== question.family) {
    throw new Error(`G1 answer profile ${profile.id} does not support ${question.family}.`);
  }

  const symbolic = question.family === "SYMBOLIC_GRADIENT_FROM_TWO_POINTS";
  const markPoints = symbolic
    ? buildG1SymbolicMarkPoints(question, profile)
    : buildG1NumericMarkPoints(question, profile);
  const methods = symbolic
    ? [buildG1SymbolicMethod(question, profile)]
    : buildG1NumericMethods(question, profile);
  const defaultMethodFamilyId = symbolic ? "SYMBOLIC_FACTOR_CANCEL" as const : "SLOPE_INTERCEPT" as const;
  const deferredComposite = question.family === "BEST_FIT_LINEAR_MODEL"
    ? {
      embeddedSkillId: "stat-s02-linear-model" as const,
      embeddedMarksDeferred: 1 as const,
      generatedG1Marks: 3 as const,
      reason: question.deferredComposite.reason,
    }
    : null;

  const answer: G1GeneratedMarkingScheme = {
    generatorId: "G1_GRADIENT_TWO_POINTS_ANSWER_V1",
    questionInstanceId: question.instanceId,
    family: question.family,
    surfaceStyleId: question.surfaceStyleId,
    profileId: profile.id,
    markProfile: profile.markProfile,
    profileSourceAnchorIds: [...profile.sourceAnchorIds],
    totalMarks: question.marks,
    standard: question.standard,
    thinking: question.thinking,
    finalAnswers: finalAnswers(question),
    markPoints,
    methods,
    defaultMethodFamilyId,
    workingPolicy: {
      correctAnswerWithoutWorking: profile.correctAnswerWithoutWorking,
      workingRequired: true,
      equivalentLineFormsAccepted: profile.equivalentLineFormsAccepted,
      coordinateSubtractionMustBeConsistent: true,
      permittedMethodFamilies: permittedMethods(methods),
      followThroughPrinciple: "Later line-construction credit may follow an earlier error only where the carried work is mathematically coherent and retains comparable difficulty. Coordinate subtraction order must remain consistent; a later step that has been materially trivialised is not eligible for follow-through.",
      generationPolicyRationale: `${profile.rationale} This is a generated marking policy synthesised from the reviewed G1 corpus; it does not overwrite source-local historical marking rules.`,
    },
    presentationPolicy: {
      simplestFormRequired: true,
      exactGradientRequired: true,
      decimalApproximationDoesNotReplaceExactFraction: true,
      contextVariablesRequiredForModel: profile.contextVariablesRequiredForModel,
      unitsRequiredForFollowUp: false,
      deferredCrossSkillMarksExcluded: profile.followUpOwner === "DEFERRED_S2",
    },
    deferredComposite,
    sourceBasis: question.sourceBasis,
    generationNotes: [
      "Answer generation consumes the exact G1 question mathState; no coordinate, gradient, intercept or follow-up value is regenerated independently.",
      "The three primary G1 marks remain gradient, line position and simplified final equation across direct, diagram, contextual and fitted-line surfaces.",
      question.family === "BEST_FIT_LINEAR_MODEL"
        ? "The adjacent statistical follow-up mark is deliberately absent from this generated marking scheme and remains explicitly deferred."
        : "Every generated mark in this scheme is owned by G1.",
      question.family === "SYMBOLIC_GRADIENT_FROM_TWO_POINTS"
        ? "The symbolic route remains coordinate-geometric in origin and requires quotient formation before factorisation/cancellation."
        : "Slope-intercept and point-slope methods are retained as equivalent full-credit line-construction routes.",
    ],
  };

  const validation = validateG1GeneratedAnswer(question, answer);
  if (!validation.valid) {
    const errors = validation.issues.filter((issue) => issue.severity === "ERROR");
    throw new Error(`Generated invalid G1 answer: ${errors.map((issue) => `${issue.code}: ${issue.message}`).join(" | ")}`);
  }
  return answer;
};

export const generateG1AnswerBatch = (
  questions: readonly G1GeneratedQuestion[],
): G1GeneratedMarkingScheme[] => questions.map(generateG1Answer);
