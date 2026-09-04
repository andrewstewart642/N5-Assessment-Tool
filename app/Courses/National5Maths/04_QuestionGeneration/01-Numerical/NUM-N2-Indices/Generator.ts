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
  N2RationalExponent,
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

const positiveModulo = (value: number, modulus: number) => ((value % modulus) + modulus) % modulus;
const VARIABLES = ["a", "b", "c", "m", "n", "p", "x", "y"] as const;

const fractionalState = (
  rootValue: number,
  rootIndex: 2 | 3,
  exponentNumerator: number,
): N2FractionalEvaluationState => ({
  family: "FRACTIONAL_INDEX_EVALUATION",
  mechanism: "FRACTIONAL_NUMERIC_EVALUATION",
  rootValue,
  rootIndex,
  exponentNumerator,
  base: rootValue ** rootIndex,
  exactResult: rootValue ** exponentNumerator,
});

const fractionalEvaluationState = (
  seed: number,
  difficulty: N2GeneratorDifficulty,
): N2FractionalEvaluationState => {
  const candidates: N2FractionalEvaluationState[] = [];
  const rootValues = difficulty === 1 ? ([2, 3, 4, 5] as const) : ([2, 3, 4, 5, 6, 7] as const);

  for (const rootIndex of [2, 3] as const) {
    const numerators = difficulty === 1
      ? (rootIndex === 2 ? ([3] as const) : ([2, 4] as const))
      : (rootIndex === 2 ? ([3, 5] as const) : ([2, 4, 5] as const));

    for (const rootValue of rootValues) {
      for (const exponentNumerator of numerators) {
        const state = fractionalState(rootValue, rootIndex, exponentNumerator);
        if (state.base > (difficulty === 1 ? 125 : 343)) continue;
        if (state.exactResult > (difficulty === 1 ? 125 : 625)) continue;
        if (historicalN2FractionalOverlap(state)) continue;

        if (difficulty === 2) {
          const representationHarder = (rootIndex === 2 && exponentNumerator === 5)
            || (rootIndex === 3 && exponentNumerator >= 4);
          const recognitionHarder = rootIndex === 3 && exponentNumerator === 2 && state.base >= 216;
          const exactValueHarder = state.exactResult >= 126;
          if (!representationHarder && !recognitionHarder && !exactValueHarder) continue;
        }

        candidates.push(state);
      }
    }
  }

  if (!candidates.length) {
    throw new Error("Unable to construct a non-historical exact N2 fractional-index evaluation for this difficulty.");
  }

  if (difficulty === 1) {
    return candidates[positiveModulo(seed, candidates.length)];
  }

  const routine = candidates.filter((candidate) => candidate.exactResult <= 343);
  const stretch = candidates.filter((candidate) => candidate.exactResult > 343);
  const useStretch = stretch.length > 0 && positiveModulo(seed, 10) === 0;
  const pool = useStretch ? stretch : routine.length ? routine : candidates;
  return pool[positiveModulo(seed, pool.length)];
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
    if (combinedExponent >= -2 || finalDenominatorExponent > 13) continue;
    const historicalTuple = (innerExponent === 2 && outerExponent === 3 && secondExponent === -10)
      || (innerExponent === -2 && outerExponent === 4 && secondExponent === -5);
    if (historicalTuple) continue;
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
  const candidates: readonly (readonly [2 | 3, number])[] = difficulty === 1
    ? [[3, 2], [2, 3]]
    : [[2, 5], [3, 4], [3, 5]];
  const [rootIndex, radicandExponent] = candidates[positiveModulo(seed, candidates.length)];
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
const exponentValue = (value: N2Exponent) => typeof value === "number" ? value : value.numerator / value.denominator;
const rationalIsZero = (value: N2RationalExponent) => value.numerator === 0;

type N2DistributiveTemplate = readonly [N2Exponent, N2Exponent, N2Exponent];
type N2DistributiveTemplatePool = {
  nonZero: N2DistributiveTemplate[];
  zero: N2DistributiveTemplate[];
  seen: Set<string>;
};

const createDistributivePool = (): N2DistributiveTemplatePool => ({ nonZero: [], zero: [], seen: new Set<string>() });

const exponentKey = (value: N2Exponent) => typeof value === "number"
  ? `${value}`
  : `${value.numerator}/${value.denominator}`;

const addDistributiveTemplate = (
  pool: N2DistributiveTemplatePool,
  outsideExponent: N2Exponent,
  firstTermExponent: N2Exponent,
  secondTermExponent: N2Exponent,
) => {
  const firstResultExponent = addN2Exponents(outsideExponent, firstTermExponent);
  const secondResultExponent = addN2Exponents(outsideExponent, secondTermExponent);
  const firstValue = firstResultExponent.numerator / firstResultExponent.denominator;
  const secondValue = secondResultExponent.numerator / secondResultExponent.denominator;
  if (firstValue < 0 || secondValue < 0 || firstValue > 4 || secondValue > 4) return;
  if (
    firstResultExponent.numerator === secondResultExponent.numerator
    && firstResultExponent.denominator === secondResultExponent.denominator
  ) return;

  const key = [outsideExponent, firstTermExponent, secondTermExponent].map(exponentKey).join("|");
  if (pool.seen.has(key)) return;
  pool.seen.add(key);

  const template: N2DistributiveTemplate = [outsideExponent, firstTermExponent, secondTermExponent];
  if (rationalIsZero(firstResultExponent) || rationalIsZero(secondResultExponent)) pool.zero.push(template);
  else pool.nonZero.push(template);
};

const chooseDistributiveTemplate = (
  pool: N2DistributiveTemplatePool,
  seed: number,
  zeroFrequency: number,
): N2DistributiveTemplate => {
  const useZero = pool.zero.length > 0 && positiveModulo(seed, zeroFrequency) === 0;
  const candidates = useZero ? pool.zero : pool.nonZero.length ? pool.nonZero : pool.zero;
  if (!candidates.length) throw new Error("N2 distributive template pool is empty.");
  return candidates[positiveModulo(seed, candidates.length)];
};

const lowerDistributiveTemplate = (seed: number): N2DistributiveTemplate => {
  const pool = createDistributivePool();
  const fractionalTerms = [fraction(1, 2), fraction(1, 3), fraction(2, 3)] as const;
  for (const fractionalTerm of fractionalTerms) {
    for (const negativeInteger of [-1, -2] as const) {
      addDistributiveTemplate(pool, 2, fractionalTerm, negativeInteger);
      addDistributiveTemplate(pool, 2, negativeInteger, fractionalTerm);
    }
  }
  return chooseDistributiveTemplate(pool, seed, 4);
};

const upperDistributiveTemplate = (seed: number): N2DistributiveTemplate => {
  const negativeFractionSingle = createDistributivePool();
  const twoFractionInside = createDistributivePool();
  const fractionalOutside = createDistributivePool();
  const sourceNearImproper = createDistributivePool();

  const negativeFractions = [fraction(-1, 2), fraction(-3, 2), fraction(-1, 3), fraction(-2, 3), fraction(-4, 3)] as const;
  const positiveFractions = [fraction(1, 2), fraction(3, 2), fraction(1, 3), fraction(2, 3), fraction(4, 3)] as const;

  // Most upper-band items use one clear extra representation lever: a negative
  // fractional index paired with an ordinary signed integer term.
  for (const outside of [2, 3] as const) {
    for (const negativeFraction of negativeFractions) {
      for (const integerTerm of [-1, -2] as const) {
        addDistributiveTemplate(negativeFractionSingle, outside, negativeFraction, integerTerm);
        addDistributiveTemplate(negativeFractionSingle, outside, integerTerm, negativeFraction);
      }
    }
  }

  // A smaller share coordinates two fractional bracket terms while the outside
  // power stays integral, keeping the addition itself easy to read.
  for (const outside of [2, 3] as const) {
    for (const negativeFraction of negativeFractions) {
      for (const positiveFraction of positiveFractions) {
        addDistributiveTemplate(twoFractionInside, outside, negativeFraction, positiveFraction);
        addDistributiveTemplate(twoFractionInside, outside, positiveFraction, negativeFraction);
      }
    }
  }

  // The hardest structural variant distributes one fractional outside power
  // across two same-denominator fractional terms so no awkward fraction
  // arithmetic is introduced merely for show.
  const sameDenominatorGroups = [
    { denominator: 2 as const, outsideNumerators: [1, 3] as const, positiveNumerators: [1, 3, 5] as const, negativeNumerators: [-1, -3] as const },
    { denominator: 3 as const, outsideNumerators: [2, 4] as const, positiveNumerators: [1, 2, 4] as const, negativeNumerators: [-1, -2, -4] as const },
  ] as const;
  for (const group of sameDenominatorGroups) {
    for (const outsideNumerator of group.outsideNumerators) {
      const outside = fraction(outsideNumerator, group.denominator);
      for (const positiveNumerator of group.positiveNumerators) {
        const positive = fraction(positiveNumerator, group.denominator);
        for (const negativeNumerator of group.negativeNumerators) {
          const negative = fraction(negativeNumerator, group.denominator);
          addDistributiveTemplate(fractionalOutside, outside, positive, negative);
          addDistributiveTemplate(fractionalOutside, outside, negative, positive);
        }
      }
    }
  }

  // A source-near upper extension keeps the familiar integer outside power but
  // lets the positive fractional term finish as a modest improper fraction.
  for (const positive of [fraction(1, 2), fraction(1, 3), fraction(2, 3)] as const) {
    for (const negativeInteger of [-1, -2] as const) {
      addDistributiveTemplate(sourceNearImproper, 3, positive, negativeInteger);
      addDistributiveTemplate(sourceNearImproper, 3, negativeInteger, positive);
    }
  }

  const classSlot = positiveModulo(seed, 10);
  const selectedPool = classSlot < 4
    ? negativeFractionSingle
    : classSlot < 6
      ? twoFractionInside
      : classSlot < 8
        ? fractionalOutside
        : sourceNearImproper;
  return chooseDistributiveTemplate(selectedPool, seed, 8);
};

const distributiveIndexExpansionState = (
  seed: number,
  difficulty: N2GeneratorDifficulty,
): N2DistributiveIndexExpansionState => {
  const [outsideExponent, firstTermExponent, secondTermExponent] = difficulty === 1
    ? lowerDistributiveTemplate(seed)
    : upperDistributiveTemplate(seed);
  const firstResultExponent = addN2Exponents(outsideExponent, firstTermExponent);
  const secondResultExponent = addN2Exponents(outsideExponent, secondTermExponent);
  return {
    family: "BRACKETED_INDEX_LAWS",
    mechanism: "DISTRIBUTIVE_INDEX_EXPANSION",
    variable: VARIABLES[positiveModulo(seed * 5 + 3, VARIABLES.length)],
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
    if (firstExponent === 7 && innerExponent === 3 && outerExponent === 2 && denominatorExponent === 4) continue;
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
