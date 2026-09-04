import { n2CanonicalAnswerLatex, n2CanonicalAnswerPlain } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/PromptGrammar";
import type { N2GeneratedQuestion } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";
import { resolveN2GeneratedAnswerProfile } from "./Calibration";
import { buildN2MarkPoints } from "./MarkPoints";
import { buildN2AnswerMethod } from "./Methods";
import type { N2GeneratedAnswerProfile, N2GeneratedFinalAnswer, N2GeneratedMarkingScheme } from "./Types";
import { validateN2GeneratedAnswer } from "./Validation";

const finalAnswers = (question: N2GeneratedQuestion): N2GeneratedFinalAnswer[] => [{
  partLabel: "",
  normalisedAnswer: n2CanonicalAnswerPlain(question.mathState),
  latex: n2CanonicalAnswerLatex(question.mathState),
  numericValue: question.mathState.mechanism === "FRACTIONAL_NUMERIC_EVALUATION"
    ? question.mathState.exactResult
    : null,
}];

const presentationPolicy = (
  question: N2GeneratedQuestion,
  profile: N2GeneratedAnswerProfile,
): N2GeneratedMarkingScheme["presentationPolicy"] => ({
  positivePowerOutputRequired: profile.positivePowerOutputRequired,
  exactIntegerRequired: profile.exactIntegerRequired,
  exactFormRequired: question.mechanism === "FRACTIONAL_NUMERIC_EVALUATION"
    || question.mechanism === "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX"
    || question.mechanism === "SQUARED_FRACTIONAL_MONOMIAL"
    || question.mechanism === "PRODUCT_OVER_ROOT",
  singlePowerOfBaseRequired: question.mechanism === "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX",
  coefficientFractionReduced: question.mechanism === "SQUARED_FRACTIONAL_MONOMIAL",
  fullSimplificationRequired: true,
});

export const generateN2Answer = (question: N2GeneratedQuestion): N2GeneratedMarkingScheme => {
  const profile = resolveN2GeneratedAnswerProfile(question);
  if (profile.family !== question.family || profile.mechanism !== question.mechanism) {
    throw new Error(`N2 answer profile ${profile.id} does not support ${question.family}/${question.mechanism}.`);
  }

  const markPoints = buildN2MarkPoints(question, profile);
  const method = buildN2AnswerMethod(question, profile);
  const answer: N2GeneratedMarkingScheme = {
    generatorId: "N2_INDICES_ANSWER_V1",
    questionInstanceId: question.instanceId,
    family: question.family,
    mechanism: question.mechanism,
    profileId: profile.id,
    markProfile: profile.markProfile,
    profileSourceAnchorIds: [...profile.sourceAnchorIds],
    totalMarks: question.marks,
    standardProfile: question.standardProfile,
    standardMarks: [...question.standardMarks],
    thinking: question.thinking,
    finalAnswers: finalAnswers(question),
    markPoints,
    methods: [method],
    defaultMethodFamilyId: method.methodFamilyId,
    workingPolicy: {
      correctAnswerWithoutWorking: profile.correctAnswerWithoutWorking,
      workingRequired: profile.workingRequired,
      equivalentRoutesAccepted: profile.equivalentRoutesAccepted,
      permittedMethodFamilies: [method.methodFamilyId],
      followThroughPrinciple: "Later credit may follow through an earlier arithmetic or exponent error only where the subsequent index-law work is mathematically coherent and retains comparable demand; mechanism-specific output requirements remain binding.",
      generationPolicyRationale: `${profile.rationale} This is a generated marking policy calibrated from the reviewed N2 evidence and does not rewrite source-local historical rules.`,
    },
    presentationPolicy: presentationPolicy(question, profile),
    sourceBasis: question.sourceBasis,
    generationNotes: [
      `Question and answer generation share the same ${question.mechanism} mathematical state.`,
      `Mark standards are copied from the mechanism-calibrated question state: ${question.standardMarks.join("+")}.`,
      "All generated N2 marks remain Operational because the reviewed N2 corpus contains no Reasoning mark evidence.",
    ],
  };

  const validation = validateN2GeneratedAnswer(question, answer);
  if (!validation.valid) {
    throw new Error(`Invalid generated N2 answer for ${question.instanceId}: ${validation.issues.map((entry) => `${entry.code}: ${entry.message}`).join(" | ")}`);
  }
  return answer;
};

export const generateN2AnswerBatch = (
  questions: readonly N2GeneratedQuestion[],
): N2GeneratedMarkingScheme[] => questions.map(generateN2Answer);
