import {
  chooseN2Paper,
  getN2MechanismProfile,
  historicalN2FractionalOverlap,
  historicalReferenceForN2,
  n2FamilyFrequency,
  selectN2Family,
  selectN2Mechanism,
} from "./Calibration";
import { assessN2Difficulty } from "./Difficulty";
import {
  N2_GENERATOR_BRACKETED_SURFACE_GUARDRAILS,
  N2_GENERATOR_FAMILY_EVIDENCE,
  N2_GENERATOR_FRACTIONAL_SURFACE_GUARDRAILS,
  N2_GENERATOR_GENERAL_SURFACE_GUARDRAILS,
  N2_GENERATOR_INVARIANTS,
  N2_GENERATOR_MULTI_LAW_SURFACE_GUARDRAILS,
} from "./Evidence";
import {
  addN2Exponents,
  buildN2Prompt,
  reduceN2RationalExponent,
} from "./PromptGrammar";
import { n2SkillForMechanism } from "./SkillLabels";
import type {
  N2DistributiveIndexExpansionState,
  N2Exponent,
  N2FractionalEvaluationState,
  N2GenerateOptions,
  N2GeneratedMathState,
  N2GeneratedQuestion,
  N2GeneratorDifficulty,
  N2GeneratorMechanism,
  N2NegativeIndexQuotientState,
  N2PositivePowerProductQuotientState,
  N2PowerOfPowerNegativeIndexState,
  N2ProductOverRootState,
  N2ProductQuotientCoefficientState,
  N2ReciprocalRootState,
  N2SquaredFractionalMonomialState,
} from "./Types";
import { validateN2GeneratedQuestion } from "./Validation";

class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = (seed >>> 0) || 0x9e3779b9;
  }

  next() {
    let t = this.state += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  int(min: number, max: number) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(values: readonly T[]): T {
    return values[this.int(0, values.length - 1)];
  }
}

const mixSeed = (seed: number, salt: number) => {
  let value = (seed ^ salt) >>> 0;
  value = Math.imul(value ^ (value >>> 16), 0x7feb352d);
  value = Math.imul(value ^ (value >>> 15), 0x846ca68b);
  return (value ^ (value >>> 16)) >>> 0;
};

const VARIABLES = ["a", "b", "c", "m", "n", "p", "x", "y"] as const;

const fractionalEvaluationState = (
  seed: number,
  difficulty: N2GeneratorDifficulty,
): N2FractionalEvaluationState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020401 + difficulty));
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const rootIndex = rng.pick([2, 3] as const);
    const rootValue = difficulty === 1
      ? (rootIndex === 2 ? rng.pick([2, 3, 4, 5] as const) : rng.pick([2, 3, 4, 5] as const))
      : (rootIndex === 2 ? rng.pick([3, 4, 5, 6] as const) : rng.pick([3, 4, 5] as const));
    const exponentNumerator = difficulty === 1
      ? (rootIndex === 2 ? 3 : rng.pick([2, 4] as const))
      : (rootIndex === 2 ? rng.pick([3, 5] as const) : rng.pick([4, 5] as const));
    const state: N2FractionalEvaluationState = {
      family: "FRACTIONAL_INDEX_EVALUATION",
      mechanism: "FRACTIONAL_NUMERIC_EVALUATION",
      rootValue,
      rootIndex,
      exponentNumerator,
      base: rootValue ** rootIndex,
      exactResult: rootValue ** exponentNumerator,
    };
    if (difficulty === 1 && state.exactResult > 125) continue;
    if (difficulty === 2 && (state.exactResult < 126 || state.exactResult > 625)) continue;
    if (historicalN2FractionalOverlap(state)) continue;
    return state;
  }
  throw new Error("Unable to construct a non-historical exact N2 fractional-index evaluation for this seed and difficulty.");
};

const productQuotientCoefficientState = (
  seed: number,
  difficulty: N2GeneratorDifficulty,
): N2ProductQuotientCoefficientState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020402 + difficulty));
  const coefficientPairs: readonly (readonly [number, number])[] = difficulty === 1
    ? [[6, 2], [12, 3], [15, 5]]
    : [[12, 3], [18, 6], [20, 4]];
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const [coefficientNumerator, coefficientDenominator] = rng.pick(coefficientPairs);
    const firstExponent = difficulty === 1 ? rng.int(2, 4) : rng.int(3, 5);
    const secondExponent = difficulty === 1 ? rng.int(1, 3) : rng.int(2, 4);
    const denominatorExponent = difficulty === 1 ? rng.int(1, 3) : rng.int(2, 5);
    const numeratorExponent = firstExponent + secondExponent;
    const finalExponent = numeratorExponent - denominatorExponent;
    if (numeratorExponent > 10 || finalExponent < 2 || finalExponent > 9) continue;
    return {
      family: "MULTI_LAW_SIMPLIFICATION",
      mechanism: "PRODUCT_QUOTIENT_WITH_COEFFICIENT",
      variable: rng.pick(VARIABLES),
      coefficientNumerator,
      coefficientDenominator,
      firstExponent,
      secondExponent,
      denominatorExponent,
      numeratorExponent,
      coefficientResult: coefficientNumerator / coefficientDenominator,
      finalExponent,
      reverseNumeratorFactors: difficulty === 2 && rng.next() < 0.5,
    };
  }
  throw new Error("Unable to construct an N2 coefficient/product/quotient state for this seed and difficulty.");
};

const powerOfPowerNegativeState = (
  seed: number,
  difficulty: N2GeneratorDifficulty,
): N2PowerOfPowerNegativeIndexState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020403 + difficulty));
  for (let attempt = 0; attempt < 600; attempt += 1) {
    let innerExponent: number;
    let outerExponent: number;
    let secondExponent: number;

    if (difficulty === 1) {
      innerExponent = rng.pick([-3, -2, -1] as const);
      outerExponent = rng.pick([2, 3] as const);
      secondExponent = rng.next() < 0.8 ? -rng.int(2, 6) : rng.int(1, 3);
    } else {
      const layout = rng.int(0, 2);
      if (layout === 0) {
        innerExponent = rng.pick([-2, -1] as const);
        outerExponent = -rng.pick([2, 3] as const);
        secondExponent = -rng.int(5, 10);
      } else if (layout === 1) {
        innerExponent = rng.pick([2, 3] as const);
        outerExponent = -rng.pick([2, 3] as const);
        secondExponent = rng.int(1, 4);
      } else {
        innerExponent = rng.pick([-3, -2] as const);
        outerExponent = rng.pick([3, 4] as const);
        secondExponent = rng.next() < 0.5 ? rng.int(1, 4) : -rng.int(2, 6);
      }
    }

    const poweredExponent = innerExponent * outerExponent;
    const combinedExponent = poweredExponent + secondExponent;
    const finalDenominatorExponent = Math.abs(combinedExponent);
    if (combinedExponent >= -2 || finalDenominatorExponent > 12) continue;
    return {
      family: "MULTI_LAW_SIMPLIFICATION",
      mechanism: "POWER_OF_POWER_WITH_NEGATIVE_INDEX",
      variable: rng.pick(VARIABLES),
      innerExponent,
      outerExponent,
      secondExponent,
      poweredExponent,
      combinedExponent,
      finalDenominatorExponent,
      powerFactorFirst: difficulty === 1 ? rng.next() < 0.8 : rng.next() < 0.5,
    };
  }
  throw new Error("Unable to construct an N2 negative-index power-of-a-power state for this seed and difficulty.");
};

const reciprocalRootState = (
  seed: number,
  difficulty: N2GeneratorDifficulty,
): N2ReciprocalRootState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020404 + difficulty));
  const rootIndex = difficulty === 1 ? 2 : rng.pick([2, 3] as const);
  const radicandExponent = difficulty === 1
    ? rng.pick([1, 3] as const)
    : (rootIndex === 2 ? rng.pick([3, 5] as const) : rng.pick([2, 4, 5] as const));
  return {
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX",
    variable: rng.pick(VARIABLES),
    rootIndex,
    radicandExponent,
    finalExponent: reduceN2RationalExponent(-radicandExponent, rootIndex),
  };
};

const squaredFractionalMonomialState = (
  seed: number,
  difficulty: N2GeneratorDifficulty,
): N2SquaredFractionalMonomialState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020405 + difficulty));
  const coefficients: readonly (readonly [number, number])[] = difficulty === 1
    ? [[1, 2], [3, 4]]
    : [[2, 5], [3, 5], [3, 4]];
  const [coefficientNumerator, coefficientDenominator] = rng.pick(coefficients);
  const variableExponent = difficulty === 1 ? rng.pick([2, 3] as const) : rng.pick([3, 4, 5] as const);
  return {
    family: "BRACKETED_INDEX_LAWS",
    mechanism: "SQUARED_FRACTIONAL_MONOMIAL",
    variable: rng.pick(VARIABLES),
    coefficientNumerator,
    coefficientDenominator,
    variableExponent,
    outerPower: 2,
    resultCoefficientNumerator: coefficientNumerator ** 2,
    resultCoefficientDenominator: coefficientDenominator ** 2,
    resultExponent: variableExponent * 2,
  };
};

const productOverRootState = (
  seed: number,
  difficulty: N2GeneratorDifficulty,
): N2ProductOverRootState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020406 + difficulty));
  const coefficient = difficulty === 1 ? rng.pick([2, 4] as const) : rng.pick([4, 5, 6] as const);
  const firstExponent = difficulty === 1 ? rng.int(2, 3) : rng.int(3, 5);
  const secondExponent = difficulty === 1 ? 1 : rng.int(1, 2);
  const rootIndex = 2 as const;
  const numeratorExponent = firstExponent + secondExponent;
  return {
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "PRODUCT_OVER_ROOT",
    variable: rng.pick(VARIABLES),
    coefficient,
    firstExponent,
    secondExponent,
    rootIndex,
    numeratorExponent,
    finalExponent: reduceN2RationalExponent(numeratorExponent * rootIndex - 1, rootIndex),
  };
};

const negativeIndexQuotientState = (
  seed: number,
  difficulty: N2GeneratorDifficulty,
): N2NegativeIndexQuotientState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020407 + difficulty));
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const numeratorExponent = difficulty === 1
      ? rng.pick([-1, -2] as const)
      : rng.pick([-3, -4] as const);
    const firstDenominator = difficulty === 1 ? rng.int(1, 3) : rng.int(2, 4);
    const secondDenominator = difficulty === 1 ? rng.int(1, 3) : rng.int(3, 5);
    const denominatorExponent = firstDenominator + secondDenominator;
    const combinedExponent = numeratorExponent - denominatorExponent;
    const finalDenominatorExponent = Math.abs(combinedExponent);
    if (finalDenominatorExponent > (difficulty === 1 ? 8 : 10)) continue;
    return {
      family: "MULTI_LAW_SIMPLIFICATION",
      mechanism: "NEGATIVE_INDEX_QUOTIENT",
      variable: rng.pick(VARIABLES),
      coefficient: rng.pick(difficulty === 1 ? ([2, 3, 4] as const) : ([3, 4, 6, 7] as const)),
      numeratorExponent,
      denominatorExponents: [firstDenominator, secondDenominator],
      denominatorExponent,
      combinedExponent,
      finalDenominatorExponent,
    };
  }
  throw new Error("Unable to construct an N2 negative-index quotient state for this seed and difficulty.");
};

const fraction = (numerator: number, denominator: 2 | 3): N2Exponent => ({ numerator, denominator });

const distributiveIndexExpansionState = (
  seed: number,
  difficulty: N2GeneratorDifficulty,
): N2DistributiveIndexExpansionState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020408 + difficulty));
  const lowerTemplates: readonly [N2Exponent, N2Exponent, N2Exponent][] = [
    [2, fraction(1, 2), -2],
    [2, -1, fraction(1, 2)],
    [3, fraction(1, 3), -2],
    [2, fraction(-1, 2), -1],
    [3, -2, fraction(2, 3)],
  ];
  const upperTemplates: readonly [N2Exponent, N2Exponent, N2Exponent][] = [
    [fraction(1, 2), fraction(3, 2), fraction(-1, 2)],
    [fraction(3, 2), fraction(1, 2), fraction(-1, 2)],
    [fraction(2, 3), fraction(4, 3), fraction(-2, 3)],
    [3, fraction(-1, 2), fraction(-4, 3)],
    [fraction(-1, 2), fraction(3, 2), fraction(5, 2)],
  ];
  const [outsideExponent, firstTermExponent, secondTermExponent] = rng.pick(
    difficulty === 1 ? lowerTemplates : upperTemplates,
  );
  const firstResultExponent = addN2Exponents(outsideExponent, firstTermExponent);
  const secondResultExponent = addN2Exponents(outsideExponent, secondTermExponent);
  if (
    firstResultExponent.numerator === secondResultExponent.numerator
    && firstResultExponent.denominator === secondResultExponent.denominator
  ) {
    throw new Error("Distributive N2 template produced duplicate like terms.");
  }
  return {
    family: "BRACKETED_INDEX_LAWS",
    mechanism: "DISTRIBUTIVE_INDEX_EXPANSION",
    variable: rng.pick(VARIABLES),
    outsideExponent,
    firstTermExponent,
    secondTermExponent,
    firstResultExponent,
    secondResultExponent,
  };
};

const positivePowerProductQuotientState = (
  seed: number,
  difficulty: N2GeneratorDifficulty,
): N2PositivePowerProductQuotientState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020409 + difficulty));
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const firstExponent = difficulty === 1 ? rng.int(2, 4) : rng.int(3, 6);
    const innerExponent = difficulty === 1 ? rng.int(2, 3) : rng.int(2, 4);
    const outerExponent = difficulty === 1 ? 2 : rng.int(2, 3);
    const denominatorExponent = difficulty === 1 ? rng.int(1, 4) : rng.int(2, 6);
    const poweredExponent = innerExponent * outerExponent;
    const numeratorExponent = firstExponent + poweredExponent;
    const finalExponent = numeratorExponent - denominatorExponent;
    if (numeratorExponent > 10 || finalExponent < 2 || finalExponent > 9) continue;
    return {
      family: "MULTI_LAW_SIMPLIFICATION",
      mechanism: "POSITIVE_POWER_PRODUCT_QUOTIENT",
      variable: rng.pick(VARIABLES),
      firstExponent,
      innerExponent,
      outerExponent,
      denominatorExponent,
      poweredExponent,
      numeratorExponent,
      finalExponent,
    };
  }
  throw new Error("Unable to construct an N2 all-positive three-law state for this seed and difficulty.");
};

const stateForMechanism = (
  seed: number,
  mechanism: N2GeneratorMechanism,
  difficulty: N2GeneratorDifficulty,
): N2GeneratedMathState => {
  switch (mechanism) {
    case "FRACTIONAL_NUMERIC_EVALUATION":
      return fractionalEvaluationState(seed, difficulty);
    case "PRODUCT_QUOTIENT_WITH_COEFFICIENT":
      return productQuotientCoefficientState(seed, difficulty);
    case "POWER_OF_POWER_WITH_NEGATIVE_INDEX":
      return powerOfPowerNegativeState(seed, difficulty);
    case "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX":
      return reciprocalRootState(seed, difficulty);
    case "SQUARED_FRACTIONAL_MONOMIAL":
      return squaredFractionalMonomialState(seed, difficulty);
    case "PRODUCT_OVER_ROOT":
      return productOverRootState(seed, difficulty);
    case "NEGATIVE_INDEX_QUOTIENT":
      return negativeIndexQuotientState(seed, difficulty);
    case "DISTRIBUTIVE_INDEX_EXPANSION":
      return distributiveIndexExpansionState(seed, difficulty);
    case "POSITIVE_POWER_PRODUCT_QUOTIENT":
      return positivePowerProductQuotientState(seed, difficulty);
  }
};

const surfaceConstraints = (family: N2GeneratedQuestion["family"]) => {
  if (family === "FRACTIONAL_INDEX_EVALUATION") return N2_GENERATOR_FRACTIONAL_SURFACE_GUARDRAILS;
  if (family === "BRACKETED_INDEX_LAWS") return N2_GENERATOR_BRACKETED_SURFACE_GUARDRAILS;
  return N2_GENERATOR_MULTI_LAW_SURFACE_GUARDRAILS;
};

export const generateN2Question = (options: N2GenerateOptions): N2GeneratedQuestion => {
  if (!Number.isFinite(options.seed)) throw new Error("N2 generation requires a finite numeric seed.");
  const seed = Math.trunc(options.seed);
  const paper = chooseN2Paper(seed, options.family, options.mechanism, options.paper, options.difficulty);
  const family = selectN2Family(seed, paper, options.family, options.mechanism, options.difficulty);
  const mechanism = selectN2Mechanism(seed, paper, family, options.mechanism, options.difficulty);
  const mechanismProfile = getN2MechanismProfile(mechanism);
  const targetDifficulty = options.difficulty ?? mechanismProfile.difficulty;
  const familyEvidence = N2_GENERATOR_FAMILY_EVIDENCE[family];
  const mathState = stateForMechanism(seed, mechanism, targetDifficulty);
  const difficulty = assessN2Difficulty(mathState, targetDifficulty);
  const prompt = buildN2Prompt(mathState);
  const frequency = n2FamilyFrequency(family, paper);
  const historicalReference = historicalReferenceForN2(mathState);
  const skill = n2SkillForMechanism(mechanism);

  const question: N2GeneratedQuestion = {
    generatorId: "N2_INDICES_V1",
    instanceId: `N2_INDICES_V1_${paper}_${mechanism}_L${targetDifficulty}_${seed}`,
    seed,
    skillId: skill.id,
    skillLabel: skill.label,
    family,
    mechanism,
    familyReadiness: familyEvidence.readiness,
    mechanismReadiness: mechanismProfile.readiness,
    paper,
    difficulty: difficulty.difficulty,
    marks: mechanismProfile.marks,
    standardProfile: mechanismProfile.standardProfile,
    standardMarks: [...mechanismProfile.standardMarks],
    thinking: "OPERATIONAL",
    prompt: prompt.prompt,
    promptParts: prompt.promptParts,
    promptSections: prompt.promptSections,
    mathState,
    sourceBasis: {
      questionCatalogIds: [...mechanismProfile.questionCatalogIds],
      answerCatalogIds: [...mechanismProfile.answerCatalogIds],
      comparisonFamily: family,
      comparisonMechanism: mechanism,
      historicalReference,
    },
    generationConstraints: [
      ...N2_GENERATOR_INVARIANTS,
      ...N2_GENERATOR_GENERAL_SURFACE_GUARDRAILS,
      ...surfaceConstraints(family),
    ],
    quality: {
      difficultyBandId: difficulty.bandId,
      difficultyMetrics: difficulty.metrics,
      historicalOverlapChecked: true,
      exactArithmeticChecked: true,
      familyObservedCount: frequency.count,
      familyObservedTotal: frequency.total,
      familyObservedProportion: frequency.proportion,
      mechanismObservedCount: mechanismProfile.evidenceCount,
      calibrationSourceAnchorIds: [...mechanismProfile.questionCatalogIds],
      paperArithmeticProfile: paper === "P1" ? "P1_WRITTEN" : "P2_CALCULATOR_AVAILABLE",
      structuralLevers: difficulty.structuralLevers,
      difficultySignals: difficulty.difficultySignals,
    },
  };

  const validation = validateN2GeneratedQuestion(question);
  const errors = validation.issues.filter((issue) => issue.severity === "ERROR");
  if (errors.length) {
    throw new Error(`Generated N2 question failed validation: ${errors.map((issue) => `${issue.code}: ${issue.message}`).join(" | ")}`);
  }

  return question;
};
