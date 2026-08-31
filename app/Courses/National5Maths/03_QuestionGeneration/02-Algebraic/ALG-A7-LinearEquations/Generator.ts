import {
  a7FamilyFrequency,
  chooseA7Paper,
  historicalA7FractionalOverlap,
  historicalReferenceForA7Context,
  historicalReferenceForA7Fractional,
  selectA7Family,
} from "./Calibration";
import {
  A7_GENERATOR_ABSTRACT_ENVELOPE,
  A7_GENERATOR_FAMILY_EVIDENCE,
  A7_GENERATOR_INVARIANTS,
} from "./Evidence";
import { buildA7ContextPrompt, buildA7FractionalPrompt } from "./PromptGrammar";
import type {
  A7AreaVisualSpec,
  A7ContextAreaState,
  A7ContextGeneratedQuestion,
  A7FractionalEquationState,
  A7FractionalGeneratedQuestion,
  A7GenerateOptions,
  A7GeneratedQuestion,
  A7GeneratorPaper,
  A7Rational,
} from "./Types";
import { validateA7GeneratedQuestion } from "./Validation";

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

  chance(probability: number) {
    return this.next() < probability;
  }
}

const mixSeed = (seed: number, salt: number) => {
  let value = (seed ^ salt) >>> 0;
  value = Math.imul(value ^ (value >>> 16), 0x7feb352d);
  value = Math.imul(value ^ (value >>> 15), 0x846ca68b);
  return (value ^ (value >>> 16)) >>> 0;
};

const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
const lcm = (a: number, b: number): number => Math.abs(a * b) / (gcd(a, b) || 1);
const lcmAll = (values: readonly number[]) => values.reduce((current, value) => lcm(current, value), 1);

const reduceRational = (numerator: number, denominator: number): A7Rational => {
  if (denominator === 0) throw new Error("A7 rational denominator cannot be zero.");
  if (numerator === 0) return { numerator: 0, denominator: 1 };
  const divisor = gcd(Math.abs(numerator), Math.abs(denominator)) || 1;
  const sign = denominator < 0 ? -1 : 1;
  return {
    numerator: (numerator / divisor) * sign,
    denominator: Math.abs(denominator / divisor),
  };
};

const clearedValue = (value: A7Rational, denominatorLcm: number) =>
  value.numerator * (denominatorLcm / value.denominator);

const nonZeroInt = (rng: SeededRandom, min: number, max: number) => {
  let value = 0;
  while (value === 0) value = rng.int(min, max);
  return value;
};

const divisorsFor = (targetLcm: 6 | 10) => targetLcm === 6
  ? [1, 2, 3, 6] as const
  : [1, 2, 5, 10] as const;

const fractionalState = (seed: number): A7FractionalEquationState => {
  const rng = new SeededRandom(mixSeed(seed, 0xA70017));
  const wantBinomial = rng.chance(0.34);

  for (let attempt = 0; attempt < 12000; attempt += 1) {
    const targetLcm = rng.chance(0.62) ? 6 : 10;
    const divisors = divisorsFor(targetLcm);

    let lhsX: A7Rational;
    let lhsConstant: A7Rational;
    let rhsX: A7Rational;
    let rhsConstant: A7Rational;

    if (wantBinomial) {
      const commonDenominator = rng.pick(targetLcm === 6 ? [2, 3, 6] as const : [2, 5, 10] as const);
      lhsX = reduceRational(nonZeroInt(rng, -5, 5), commonDenominator);
      lhsConstant = reduceRational(nonZeroInt(rng, -6, 6), commonDenominator);
      rhsX = reduceRational(nonZeroInt(rng, -5, 5), rng.pick(divisors));
      rhsConstant = reduceRational(rng.int(-6, 6), rng.pick(divisors));
      if (lhsX.denominator !== lhsConstant.denominator || lhsX.denominator === 1) continue;
    } else {
      lhsX = reduceRational(nonZeroInt(rng, -5, 5), rng.pick(divisors));
      lhsConstant = reduceRational(rng.int(-6, 6), rng.pick(divisors));
      rhsX = reduceRational(nonZeroInt(rng, -5, 5), rng.pick(divisors));
      rhsConstant = reduceRational(rng.int(-6, 6), rng.pick(divisors));
    }

    const denominatorLcm = lcmAll([
      lhsX.denominator,
      lhsConstant.denominator,
      rhsX.denominator,
      rhsConstant.denominator,
    ]);
    if (denominatorLcm !== targetLcm) continue;

    const fractionalTermCount = [lhsX, lhsConstant, rhsX, rhsConstant]
      .filter((value) => value.numerator !== 0 && value.denominator > 1).length;
    if (fractionalTermCount < 2) continue;

    const clearedEquation = {
      lhsX: clearedValue(lhsX, denominatorLcm),
      lhsConstant: clearedValue(lhsConstant, denominatorLcm),
      rhsX: clearedValue(rhsX, denominatorLcm),
      rhsConstant: clearedValue(rhsConstant, denominatorLcm),
    };

    if (Math.abs(clearedEquation.lhsX) > A7_GENERATOR_ABSTRACT_ENVELOPE.absoluteClearedCoefficient.observedMax ||
        Math.abs(clearedEquation.rhsX) > A7_GENERATOR_ABSTRACT_ENVELOPE.absoluteClearedCoefficient.observedMax ||
        Math.abs(clearedEquation.lhsConstant) > A7_GENERATOR_ABSTRACT_ENVELOPE.absoluteClearedConstant.observedMax ||
        Math.abs(clearedEquation.rhsConstant) > A7_GENERATOR_ABSTRACT_ENVELOPE.absoluteClearedConstant.observedMax) continue;

    const rearrangedEquation = {
      xCoefficient: clearedEquation.lhsX - clearedEquation.rhsX,
      constant: clearedEquation.rhsConstant - clearedEquation.lhsConstant,
    };
    const coefficientMagnitude = Math.abs(rearrangedEquation.xCoefficient);
    if (coefficientMagnitude < A7_GENERATOR_ABSTRACT_ENVELOPE.absoluteRearrangedCoefficient.observedMin ||
        coefficientMagnitude > A7_GENERATOR_ABSTRACT_ENVELOPE.absoluteRearrangedCoefficient.observedMax) continue;
    if (rearrangedEquation.constant === 0) continue;

    const solution = reduceRational(rearrangedEquation.constant, rearrangedEquation.xCoefficient);
    if (solution.denominator === 1 || solution.denominator < 7 || solution.denominator > 8) continue;
    if (Math.abs(solution.numerator) < A7_GENERATOR_ABSTRACT_ENVELOPE.solutionNumeratorMagnitude.observedMin ||
        Math.abs(solution.numerator) > A7_GENERATOR_ABSTRACT_ENVELOPE.solutionNumeratorMagnitude.observedMax) continue;

    const state: A7FractionalEquationState = {
      family: "FRACTIONAL_COEFFICIENT",
      surfaceVariant: wantBinomial ? "BINOMIAL_LEFT_NUMERATOR" : "SPLIT_TERMS",
      lhsX,
      lhsConstant,
      rhsX,
      rhsConstant,
      denominatorLcm,
      clearedEquation,
      rearrangedEquation,
      solution,
    };

    if (historicalA7FractionalOverlap(state)) continue;
    return state;
  }

  throw new Error("Unable to construct an evidence-calibrated A7 fractional equation for this seed.");
};

const contextState = (seed: number): A7ContextAreaState => {
  const rng = new SeededRandom(mixSeed(seed, 0xA70022));
  const triangleBases = [3, 5, 7] as const;

  for (let attempt = 0; attempt < 8000; attempt += 1) {
    const triangleBase = rng.pick(triangleBases);
    const rectangleHeight = rng.int(4, 8);
    const solution = rng.int(2, 8);
    const heightConstant = rng.int(6, 15);
    const triangleHeightAtSolution = solution + heightConstant;
    const doubledAreaNumerator = triangleBase * triangleHeightAtSolution;
    if (doubledAreaNumerator % 2 !== 0) continue;
    const triangleArea = doubledAreaNumerator / 2;
    if (triangleArea % rectangleHeight !== 0) continue;

    const rectangleWidthAtSolution = triangleArea / rectangleHeight;
    const widthConstant = solution + rectangleWidthAtSolution;
    if (rectangleWidthAtSolution <= 0 || widthConstant > 20) continue;

    const xCoefficient = triangleBase + 2 * rectangleHeight;
    if (xCoefficient < 10 || xCoefficient > 25) continue;
    const constant = xCoefficient * solution;

    // Do not reproduce the sole historical parameter set.
    if (triangleBase === 3 && heightConstant === 12 && rectangleHeight === 6 && widthConstant === 8) continue;

    return {
      family: "CONTEXT_AREA_EQUALITY",
      triangle: {
        base: triangleBase,
        heightXCoefficient: 1,
        heightConstant,
      },
      rectangle: {
        height: rectangleHeight,
        widthXCoefficient: -1,
        widthConstant,
      },
      equalAreaEquation: {
        triangleMultiplierNumerator: triangleBase,
        triangleMultiplierDenominator: 2,
        rectangleMultiplier: rectangleHeight,
      },
      clearedEquation: {
        leftXCoefficient: triangleBase,
        leftConstant: triangleBase * heightConstant,
        rightXCoefficient: -2 * rectangleHeight,
        rightConstant: 2 * rectangleHeight * widthConstant,
      },
      rearrangedEquation: {
        xCoefficient,
        constant,
      },
      solution,
    };
  }

  throw new Error("Unable to construct an evidence-calibrated A7 equal-area question for this seed.");
};

const sourceBasisForFractional = (state: A7FractionalEquationState) => {
  const evidence = A7_GENERATOR_FAMILY_EVIDENCE.FRACTIONAL_COEFFICIENT;
  return {
    questionCatalogIds: [...evidence.questionCatalogIds],
    answerCatalogIds: [...evidence.answerCatalogIds],
    comparisonFamily: "FRACTIONAL_COEFFICIENT" as const,
    historicalReference: historicalReferenceForA7Fractional(state),
  };
};

const sourceBasisForContext = () => {
  const evidence = A7_GENERATOR_FAMILY_EVIDENCE.CONTEXT_AREA_EQUALITY;
  return {
    questionCatalogIds: [...evidence.questionCatalogIds],
    answerCatalogIds: [...evidence.answerCatalogIds],
    comparisonFamily: "CONTEXT_AREA_EQUALITY" as const,
    historicalReference: historicalReferenceForA7Context(),
  };
};

const fractionalQuestion = (seed: number, paper: A7GeneratorPaper): A7FractionalGeneratedQuestion => {
  const state = fractionalState(seed);
  const prompt = buildA7FractionalPrompt(state);
  const frequency = a7FamilyFrequency("FRACTIONAL_COEFFICIENT", paper);
  const sourceBasis = sourceBasisForFractional(state);
  const primaryAnchor = sourceBasis.historicalReference.primaryQuestionCatalogId;

  return {
    generatorId: "A7_LINEAR_EQUATIONS_V1",
    instanceId: `A7-${paper}-FRACTIONAL-${seed >>> 0}`,
    seed,
    family: "FRACTIONAL_COEFFICIENT",
    familyReadiness: "CORE",
    paper,
    marks: 3,
    standard: "A",
    thinking: "OPERATIONAL",
    ...prompt,
    mathState: state,
    visual: null,
    sourceBasis,
    generationConstraints: [...A7_GENERATOR_INVARIANTS],
    quality: {
      historicalOverlapChecked: true,
      familyObservedCount: frequency.count,
      familyObservedTotal: frequency.total,
      familyObservedProportion: frequency.proportion,
      calibrationSourceAnchorIds: primaryAnchor ? [primaryAnchor] : [],
      paperArithmeticProfile: paper === "P1" ? "P1_WRITTEN" : "P2_CALCULATOR_AVAILABLE",
      structuralLevers: [
        `denominator LCM ${state.denominatorLcm}`,
        state.surfaceVariant === "BINOMIAL_LEFT_NUMERATOR" ? "binomial numerator" : "split fractional terms",
        "x on both sides",
        `rearranged coefficient ${Math.abs(state.rearrangedEquation.xCoefficient)}`,
      ],
      difficultySignals: [
        "Fractional algebra materially affects the first mark.",
        "A separate rearrangement stage remains necessary after denominators are cleared.",
        `The exact solution is a ${state.solution.numerator < 0 ? "negative" : "positive"} non-integer rational value.`,
      ],
    },
  };
};

const contextVisual = (state: A7ContextAreaState): A7AreaVisualSpec => ({
  kind: "A7_EQUAL_AREA_DIAGRAM",
  rendererFamilyId: "A7_AREA_EQUALITY_DIAGRAM",
  unit: "cm",
  triangle: {
    baseLabel: `${state.triangle.base} cm`,
    heightLabel: `(x + ${state.triangle.heightConstant}) cm`,
  },
  rectangle: {
    heightLabel: `${state.rectangle.height} cm`,
    widthLabel: `(${state.rectangle.widthConstant} - x) cm`,
  },
  requirements: [
    "Show one triangle and one rectangle as separate schematic shapes.",
    "Display all four generated dimension labels clearly.",
    "Do not imply that candidates may measure the drawing.",
    "Visual geometry must be procedurally original and must agree with the generated mathematical state.",
  ],
});

const contextQuestion = (seed: number): A7ContextGeneratedQuestion => {
  const state = contextState(seed);
  const prompt = buildA7ContextPrompt(state);
  const frequency = a7FamilyFrequency("CONTEXT_AREA_EQUALITY", "P1");
  const sourceBasis = sourceBasisForContext();
  const primaryAnchor = sourceBasis.historicalReference.primaryQuestionCatalogId;

  return {
    generatorId: "A7_LINEAR_EQUATIONS_V1",
    instanceId: `A7-P1-CONTEXT-AREA-${seed >>> 0}`,
    seed,
    family: "CONTEXT_AREA_EQUALITY",
    familyReadiness: "EXPERIMENTAL",
    paper: "P1",
    marks: 5,
    standard: "A",
    thinking: "REASONING",
    ...prompt,
    mathState: state,
    visual: contextVisual(state),
    sourceBasis,
    generationConstraints: [...A7_GENERATOR_INVARIANTS],
    quality: {
      historicalOverlapChecked: true,
      familyObservedCount: frequency.count,
      familyObservedTotal: frequency.total,
      familyObservedProportion: frequency.proportion,
      calibrationSourceAnchorIds: primaryAnchor ? [primaryAnchor] : [],
      paperArithmeticProfile: "P1_WRITTEN",
      structuralLevers: [
        "triangle one-half factor retained",
        "equal-area representation transition",
        `two-digit final x coefficient ${state.rearrangedEquation.xCoefficient}`,
        "positive integer physical solution",
      ],
      difficultySignals: [
        "The diagram must be translated into two area expressions.",
        "The equality of the areas must be represented as a linear equation.",
        "The triangle one-half factor remains mark-bearing during the start-to-solve step.",
        "The final division is not eased to a single-digit coefficient.",
      ],
    },
  };
};

export const generateA7Question = (options: A7GenerateOptions): A7GeneratedQuestion => {
  const includeExperimentalFamilies = options.includeExperimentalFamilies ?? true;
  const paper = chooseA7Paper(options.seed, options.family, options.paper);
  const family = selectA7Family(
    options.seed,
    paper,
    options.family,
    includeExperimentalFamilies,
  );

  const question = family === "CONTEXT_AREA_EQUALITY"
    ? contextQuestion(options.seed)
    : fractionalQuestion(options.seed, paper);
  const validation = validateA7GeneratedQuestion(question);
  if (!validation.valid) {
    const errors = validation.issues.filter((issue) => issue.severity === "ERROR");
    throw new Error(`Generated invalid A7 question: ${errors.map((issue) => `${issue.code}: ${issue.message}`).join(" | ")}`);
  }
  return question;
};

export const generateA7QuestionBatch = (
  count: number,
  options: Omit<A7GenerateOptions, "seed"> & { seed: number },
): A7GeneratedQuestion[] => {
  if (!Number.isInteger(count) || count < 1) throw new Error("A7 batch count must be a positive integer.");
  return Array.from({ length: count }, (_, index) => generateA7Question({
    ...options,
    seed: mixSeed(options.seed, index + 1),
  }));
};
