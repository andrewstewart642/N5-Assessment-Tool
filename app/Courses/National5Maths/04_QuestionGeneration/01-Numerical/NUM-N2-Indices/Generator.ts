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
  addRationalExponents,
  buildN2Prompt,
} from "./PromptGrammar";
import type {
  N2DistributiveIndexExpansionState,
  N2FractionalEvaluationState,
  N2GenerateOptions,
  N2GeneratedMathState,
  N2GeneratedQuestion,
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

const fractionalEvaluationState = (seed: number): N2FractionalEvaluationState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020401));
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const rootIndex = rng.pick([2, 3] as const);
    const rootValue = rootIndex === 2 ? rng.pick([2, 3, 4, 5, 6] as const) : rng.pick([2, 3, 4, 5] as const);
    const exponentNumerator = rootIndex === 2
      ? rng.pick([3, 5] as const)
      : rng.pick([2, 4, 5] as const);
    const state: N2FractionalEvaluationState = {
      family: "FRACTIONAL_INDEX_EVALUATION",
      mechanism: "FRACTIONAL_NUMERIC_EVALUATION",
      rootValue,
      rootIndex,
      exponentNumerator,
      base: rootValue ** rootIndex,
      exactResult: rootValue ** exponentNumerator,
    };
    if (state.exactResult > 1000) continue;
    if (historicalN2FractionalOverlap(state)) continue;
    return state;
  }
  throw new Error("Unable to construct a non-historical exact N2 fractional-index evaluation for this seed.");
};

const productQuotientCoefficientState = (seed: number): N2ProductQuotientCoefficientState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020402));
  const coefficientPairs = [
    [6, 2],
    [12, 3],
    [15, 5],
    [18, 6],
    [20, 4],
  ] as const;
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const [coefficientNumerator, coefficientDenominator] = rng.pick(coefficientPairs);
    const firstExponent = rng.int(2, 5);
    const secondExponent = rng.int(1, 4);
    const denominatorExponent = rng.int(1, 4);
    const numeratorExponent = firstExponent + secondExponent;
    const finalExponent = numeratorExponent - denominatorExponent;
    if (numeratorExponent > 10 || finalExponent < 2) continue;
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
    };
  }
  throw new Error("Unable to construct an N2 coefficient/product/quotient state for this seed.");
};

const powerOfPowerNegativeState = (seed: number): N2PowerOfPowerNegativeIndexState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020403));
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const innerExponent = rng.pick([-3, -1, 3, 4] as const);
    const outerExponent = rng.int(2, 4);
    const secondExponent = -rng.int(2, 10);
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
    };
  }
  throw new Error("Unable to construct an N2 negative-index power-of-a-power state for this seed.");
};

const reciprocalRootState = (seed: number): N2ReciprocalRootState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020404));
  return {
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX",
    variable: rng.pick(VARIABLES),
    rootIndex: 2,
    finalExponent: { numerator: -1, denominator: 2 },
  };
};

const squaredFractionalMonomialState = (seed: number): N2SquaredFractionalMonomialState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020405));
  const coefficients = [
    [1, 2],
    [3, 4],
    [2, 5],
    [3, 5],
  ] as const;
  const [coefficientNumerator, coefficientDenominator] = rng.pick(coefficients);
  const variableExponent = rng.pick([2, 3, 5] as const);
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

const productOverRootState = (seed: number): N2ProductOverRootState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020406));
  const coefficient = rng.pick([2, 4, 5, 6] as const);
  const firstExponent = rng.int(2, 5);
  const secondExponent = rng.int(1, 2);
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
    finalExponent: {
      numerator: numeratorExponent * rootIndex - 1,
      denominator: rootIndex,
    },
  };
};

const negativeIndexQuotientState = (seed: number): N2NegativeIndexQuotientState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020407));
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const numeratorExponent = rng.pick([-1, -3, -4] as const);
    const firstDenominator = rng.int(1, 4);
    const secondDenominator = rng.int(2, 5);
    const denominatorExponent = firstDenominator + secondDenominator;
    const combinedExponent = numeratorExponent - denominatorExponent;
    const finalDenominatorExponent = Math.abs(combinedExponent);
    if (finalDenominatorExponent > 10) continue;
    return {
      family: "MULTI_LAW_SIMPLIFICATION",
      mechanism: "NEGATIVE_INDEX_QUOTIENT",
      variable: rng.pick(VARIABLES),
      coefficient: rng.pick([2, 3, 4, 6, 7] as const),
      numeratorExponent,
      denominatorExponents: [firstDenominator, secondDenominator],
      denominatorExponent,
      combinedExponent,
      finalDenominatorExponent,
    };
  }
  throw new Error("Unable to construct an N2 negative-index quotient state for this seed.");
};

const distributiveIndexExpansionState = (seed: number): N2DistributiveIndexExpansionState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020408));
  const outsideExponent = rng.pick([2, 3] as const);
  const firstTermExponent = rng.pick([
    { numerator: 1, denominator: 2 },
    { numerator: 3, denominator: 2 },
    { numerator: 1, denominator: 3 },
    { numerator: 2, denominator: 3 },
    { numerator: 4, denominator: 3 },
  ] as const);
  return {
    family: "BRACKETED_INDEX_LAWS",
    mechanism: "DISTRIBUTIVE_INDEX_EXPANSION",
    variable: rng.pick(VARIABLES),
    outsideExponent,
    firstTermExponent,
    secondTermExponent: -outsideExponent,
    firstResultExponent: addRationalExponents(outsideExponent, firstTermExponent),
    secondResultExponent: 0,
  };
};

const positivePowerProductQuotientState = (seed: number): N2PositivePowerProductQuotientState => {
  const rng = new SeededRandom(mixSeed(seed, 0x020409));
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const firstExponent = rng.int(3, 6);
    const innerExponent = rng.int(2, 4);
    const outerExponent = rng.int(2, 3);
    const denominatorExponent = rng.int(1, 6);
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
  throw new Error("Unable to construct an N2 all-positive three-law state for this seed.");
};

const stateForMechanism = (seed: number, mechanism: N2GeneratorMechanism): N2GeneratedMathState => {
  switch (mechanism) {
    case "FRACTIONAL_NUMERIC_EVALUATION":
      return fractionalEvaluationState(seed);
    case "PRODUCT_QUOTIENT_WITH_COEFFICIENT":
      return productQuotientCoefficientState(seed);
    case "POWER_OF_POWER_WITH_NEGATIVE_INDEX":
      return powerOfPowerNegativeState(seed);
    case "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX":
      return reciprocalRootState(seed);
    case "SQUARED_FRACTIONAL_MONOMIAL":
      return squaredFractionalMonomialState(seed);
    case "PRODUCT_OVER_ROOT":
      return productOverRootState(seed);
    case "NEGATIVE_INDEX_QUOTIENT":
      return negativeIndexQuotientState(seed);
    case "DISTRIBUTIVE_INDEX_EXPANSION":
      return distributiveIndexExpansionState(seed);
    case "POSITIVE_POWER_PRODUCT_QUOTIENT":
      return positivePowerProductQuotientState(seed);
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
  const familyEvidence = N2_GENERATOR_FAMILY_EVIDENCE[family];
  const mathState = stateForMechanism(seed, mechanism);
  const difficulty = assessN2Difficulty(mathState);
  const prompt = buildN2Prompt(mathState);
  const frequency = n2FamilyFrequency(family, paper);
  const historicalReference = historicalReferenceForN2(mathState);

  const question: N2GeneratedQuestion = {
    generatorId: "N2_INDICES_V1",
    instanceId: `N2_INDICES_V1_${paper}_${mechanism}_${seed}`,
    seed,
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
