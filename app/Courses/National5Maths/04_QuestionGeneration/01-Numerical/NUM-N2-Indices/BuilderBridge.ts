import type {
  GeneratedQuestionData,
  GeneratorContext,
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";
import type {
  WorkedAnswerSet,
} from "@/app/Assessments/Questions/Generation/AnswerGenerationTypes";
import type {
  PaperPart,
} from "@/app/Assessments/Questions/Content/PaperParts";
import type {
  QuestionVariantSelectionMeta,
} from "@/app/Assessments/Questions/Selection/QuestionSelectionTypes";
import {
  isVariantEligibleForFilters,
} from "@/app/Assessments/Questions/Selection/QuestionSelectionTypes";

import {
  formatHistoricalQuestionReferenceLabel,
} from "../../../CatalogCoreTypes";
import {
  generateN2Answer,
} from "../../../05_AnswerGeneration/01-Numerical/NUM-N2-Indices/Generator";
import {
  getN2MechanismProfile,
  type N2MechanismProfile,
} from "./Calibration";
import {
  generateN2Question,
} from "./Generator";
import {
  N2_MECHANISMS_BY_SKILL,
} from "./SkillLabels";
import {
  n2CanonicalAnswerLatex,
  n2ExpressionLatex,
} from "./PromptGrammar";
import type {
  N2Exponent,
  N2GeneratedMathState,
  N2GeneratorDifficulty,
  N2GeneratorMechanism,
  N2GeneratorPaper,
  N2GeneratorSkillId,
  N2RationalExponent,
} from "./Types";

const N2_SKILL_ID = "num-n2-indices";
const randomSeed = () => Math.floor(Math.random() * 0x7fffffff) + 1;
const text = (value: string): PaperPart => ({ kind: "text", value });
const math = (latex: string): PaperPart => ({ kind: "math", latex, displayMode: false });

const markCounts = (standards: readonly ("C" | "A")[]) => ({
  totalMarks: standards.length,
  cMarks: standards.filter((standard) => standard === "C").length,
  aMarks: standards.filter((standard) => standard === "A").length,
  reasoningMarks: 0,
});

const paperSuitabilityForProfile = (profile: N2MechanismProfile): "BOTH" | N2GeneratorPaper =>
  profile.supportedPapers.length > 1
    ? "BOTH"
    : (profile.supportedPapers[0] ?? "P1");

const selectionCalculatorStatus = (profile: N2MechanismProfile) =>
  profile.supportedPapers.length === 1 && profile.supportedPapers[0] === "P1"
    ? "NonCalculatorOnly" as const
    : "CalculatorAllowed" as const;

export const n2VariantSelectionMeta = (
  mechanism: N2GeneratorMechanism,
  level: N2GeneratorDifficulty,
): QuestionVariantSelectionMeta => {
  const profile = getN2MechanismProfile(mechanism);
  return {
    level,
    templateId: `N2_INDICES_V1:${mechanism}:${level === 1 ? "LOWER_VALID" : "UPPER_VALID"}`,
    marks: markCounts(profile.standardMarks),
    standardProfile: profile.standardProfile,
    paperSuitability: paperSuitabilityForProfile(profile),
    calculatorStatus: selectionCalculatorStatus(profile),
  };
};

/**
 * Builder-facing fractional powers use the same accepted single-KaTeX
 * construction as the N2 developer quality gate. KaTeX owns superscript
 * positioning; genfrac only prevents the fraction itself collapsing to an
 * unreadably small script-script fraction.
 */
const rationalExponentBodyLatex = (value: N2RationalExponent): string => {
  if (value.denominator === 1) return `${value.numerator}`;
  const sign = value.numerator < 0 ? "-" : "";
  return `${sign}\\genfrac{}{}{0.055em}{1}{${Math.abs(value.numerator)}}{${value.denominator}}`;
};

const powerLatex = (base: string, exponent: N2Exponent): string => {
  if (typeof exponent === "number") {
    if (exponent === 0) return "1";
    if (exponent === 1) return base;
    return `${base}^{${exponent}}`;
  }
  if (exponent.numerator === 0) return "1";
  if (exponent.denominator === 1 && exponent.numerator === 1) return base;
  return `${base}^{${rationalExponentBodyLatex(exponent)}}`;
};

const builderExpressionLatex = (state: N2GeneratedMathState): string => {
  switch (state.mechanism) {
    case "FRACTIONAL_NUMERIC_EVALUATION":
      return powerLatex(`${state.base}`, {
        numerator: state.exponentNumerator,
        denominator: state.rootIndex,
      });
    case "DISTRIBUTIVE_INDEX_EXPANSION":
      return `${powerLatex(state.variable, state.outsideExponent)}\\left(${powerLatex(state.variable, state.firstTermExponent)}+${powerLatex(state.variable, state.secondTermExponent)}\\right)`;
    default:
      return n2ExpressionLatex(state);
  }
};

const builderAnswerLatex = (state: N2GeneratedMathState): string => {
  switch (state.mechanism) {
    case "FRACTIONAL_NUMERIC_EVALUATION":
      return `${state.exactResult}`;
    case "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX":
      return powerLatex(state.variable, state.finalExponent);
    case "PRODUCT_OVER_ROOT":
      return `${state.coefficient === 1 ? "" : state.coefficient}${powerLatex(state.variable, state.finalExponent)}`;
    case "DISTRIBUTIVE_INDEX_EXPANSION":
      return `${powerLatex(state.variable, state.firstResultExponent)}+${powerLatex(state.variable, state.secondResultExponent)}`;
    default:
      return n2CanonicalAnswerLatex(state);
  }
};

const builderPromptParts = (state: N2GeneratedMathState): PaperPart[] => {
  const expression = builderExpressionLatex(state);

  if (state.mechanism === "FRACTIONAL_NUMERIC_EVALUATION") {
    return [text("Evaluate "), math(expression), text(".")];
  }

  if (state.mechanism === "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX") {
    const targetExponentSymbol = state.variable === "n" ? "k" : "n";
    return [
      text("Express "),
      math(expression),
      text(" in the form "),
      math(`${state.variable}^{${targetExponentSymbol}}`),
      text("."),
    ];
  }

  if (state.mechanism === "SQUARED_FRACTIONAL_MONOMIAL") {
    return [text("Remove the brackets and simplify "), math(expression), text(".")];
  }

  if (state.mechanism === "DISTRIBUTIVE_INDEX_EXPANSION") {
    return [text("Expand and simplify fully "), math(expression), text(".")];
  }

  const positivePower = state.mechanism === "POWER_OF_POWER_WITH_NEGATIVE_INDEX"
    || state.mechanism === "NEGATIVE_INDEX_QUOTIENT";

  return positivePower
    ? [
        text("Simplify "),
        math(expression),
        text(".\nGive your answer with a "),
        math("\\textbf{positive}"),
        text(" power."),
      ]
    : [text("Simplify "), math(expression), text(".")];
};

const answerParts = (state: N2GeneratedMathState): PaperPart[] => [
  math(builderAnswerLatex(state)),
];

const workedAnswers = (
  marking: ReturnType<typeof generateN2Answer>,
): WorkedAnswerSet => ({
  defaultMethodFamilyId: marking.defaultMethodFamilyId,
  methods: marking.methods.map((method) => ({
    methodFamilyId: method.methodFamilyId,
    evidenceScore: 1,
    sourceEvidenceIds: [...method.sourceEvidenceIds],
    lines: method.lines.map((line) => ({
      id: line.id,
      parts: line.latex
        ? [math(line.latex)]
        : [text(line.text)],
      markNumbers: [...line.markNumbers],
    })),
  })),
});

const skillIdFromContext = (context: GeneratorContext): N2GeneratorSkillId => {
  const code = context.concept?.code ?? context.selectedConceptText;
  if (code === "N2.2") return "N2.2";
  if (code === "N2.3") return "N2.3";
  return "N2.1";
};

const chooseMechanism = (
  context: GeneratorContext,
  skillId: N2GeneratorSkillId,
  difficulty: N2GeneratorDifficulty,
  paper: N2GeneratorPaper,
  seed: number,
): N2GeneratorMechanism => {
  const candidates = N2_MECHANISMS_BY_SKILL[skillId]
    .map((mechanism) => getN2MechanismProfile(mechanism))
    .filter((profile) => profile.supportedPapers.includes(paper))
    .filter((profile) => !context.selectionFilters || isVariantEligibleForFilters(
      n2VariantSelectionMeta(profile.mechanism, difficulty),
      context.selectionFilters,
    ));

  if (candidates.length === 0) {
    throw new Error(
      `No N2 ${skillId} mechanism matches the active Builder filters on ${paper}.`,
    );
  }

  const weighted = candidates.flatMap((profile) =>
    Array.from({ length: Math.max(1, profile.evidenceCount) }, () => profile.mechanism)
  );
  return weighted[Math.abs(seed) % weighted.length];
};

export function buildN2BuilderGenerated(
  context: GeneratorContext,
): GeneratedQuestionData {
  if (context.skill.id !== N2_SKILL_ID) {
    throw new Error("N2 Builder bridge received a non-N2 skill.");
  }

  const difficulty: N2GeneratorDifficulty = context.difficulty <= 1 ? 1 : 2;
  const paper: N2GeneratorPaper = context.paper === "P2" ? "P2" : "P1";
  const seed = randomSeed();
  const selectedSkillId = skillIdFromContext(context);
  const mechanism = chooseMechanism(context, selectedSkillId, difficulty, paper, seed);
  const question = generateN2Question({
    seed,
    difficulty,
    mechanism,
    paper,
  });
  const marking = generateN2Answer(question);
  const profile = getN2MechanismProfile(question.mechanism);
  const marks = markCounts(question.standardMarks);
  const reference = question.sourceBasis.historicalReference;
  const referenceId = reference.primaryQuestionCatalogId;
  const formattedReference = referenceId
    ? formatHistoricalQuestionReferenceLabel(referenceId)
    : null;

  return {
    prompt: question.prompt,
    promptParts: builderPromptParts(question.mathState),
    answer: marking.finalAnswers.map((entry) => entry.normalisedAnswer).join("; "),
    answerParts: answerParts(question.mathState),
    workedAnswers: workedAnswers(marking),
    historicalReference: {
      label: formattedReference ? `See ${formattedReference}` : "Historical reference",
      questionCatalogId: referenceId,
      matchReasons: [...reference.matchReasons],
    },
    marks: question.marks,
    questionCode: question.instanceId,
    markBreakdown: marks,
    classification: {
      standard: question.standardProfile === "C+A" ? "Mixed" : question.standardProfile,
      calculatorStatus: profile.supportedPapers.length === 1 && profile.supportedPapers[0] === "P1"
        ? "NonCalculatorOnly"
        : "Either",
      structureType: "ExpressionSimplification",
      isReasoning: false,
      paperSuitability: paperSuitabilityForProfile(profile),
    },
    sourceSkillCode: "N2",
    sourceConceptCode: question.skillId,
    sourceConceptLabel: question.skillLabel,
    templateId: `${question.generatorId}:${question.mechanism}`,
    topicMarkBreakdown: {
      NUM: question.marks,
      ALG: 0,
      GEO: 0,
      TRIG: 0,
      STAT: 0,
    },
    selectionMeta: n2VariantSelectionMeta(question.mechanism, question.difficulty),
  };
}
