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
  A7FractionalSurfaceVariant,
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

/**
 * Distinct displayed denominator pairings whose LCD remains inside the
 * reviewed 6-10 envelope. The three exact historical pairings (3,6), (2,5)
 * and (2,3) are included, with only closely-related divisor pairings added.
 */
const DISPLAY_DENOMINATOR_PAIRS = [
  { left: 3, right: 6, lcm: 6 },
  { left: 2, right: 3, lcm: 6 },
  { left: 2, right: 6, lcm: 6 },
  { left: 3, right: 2, lcm: 6 },
  { left: 2, right: 5, lcm: 10 },
  { left: 5, right: 2, lcm: 10 },
  { left: 2, right: 10, lcm: 10 },
  { left: 5, right: 10, lcm: 10 },
] as const;

const SURFACE_VARIANTS: readonly A7FractionalSurfaceVariant[] = [
  "SPLIT_TERMS",
  "BINOMIAL_RIGHT_NUMERATOR",
  "BINOMIAL_LEFT_NUMERATOR",
];

const preservesDisplayedDenominator = (numerator: number, denominator: number) =>
  reduceRational(numerator, denominator).denominator === denominator;

const fractionalState = (seed: number): A7FractionalEquationState => {
  const rng = new SeededRandom(mixSeed(seed, 0xA70017));
  const surfaceVariant = rng.pick(SURFACE_VARIANTS);

  for (let attempt = 0; attempt < 16000; attempt += 1) {
    const pair = rng.pick(DISPLAY_DENOMINATOR_PAIRS);
    const leftDenominator = pair.left;
    const rightDenominator = pair.right;

    let lhsX: A7Rational;
    let lhsConstant: A7Rational;
    let rhsX: A7Rational;
    let rhsConstant: A7Rational;

    if (surfaceVariant === "SPLIT_TERMS") {
      // 2016-type surface: ax/d1 - b/d2 = cx
      const xNumerator = rng.int(1, 5);
      const constantNumerator = rng.int(1, 5);
      const wholeXCoefficient = rng.int(1, 2);
      if (!preservesDisplayedDenominator(xNumerator, leftDenominator) ||
          !preservesDisplayedDenominator(constantNumerator, rightDenominator)) continue;

      lhsX = reduceRational(xNumerator, leftDenominator);
      lhsConstant = reduceRational(-constantNumerator, rightDenominator);
      rhsX = reduceRational(wholeXCoefficient, 1);
      rhsConstant = reduceRational(0, 1);
    } else if (surfaceVariant === "BINOMIAL_RIGHT_NUMERATOR") {
      // 2019-type surface: ax/d1 - n = (b - cx)/d2
      const lhsXNumerator = rng.int(1, 4);
      const wholeConstant = rng.int(1, 3);
      const rhsConstantNumerator = rng.int(1, 6);
      const rhsXNumerator = rng.int(1, 4);
      if (!preservesDisplayedDenominator(lhsXNumerator, leftDenominator) ||
          !preservesDisplayedDenominator(rhsConstantNumerator, rightDenominator) ||
          !preservesDisplayedDenominator(rhsXNumerator, rightDenominator)) continue;

      lhsX = reduceRational(lhsXNumerator, leftDenominator);
      lhsConstant = reduceRational(-wholeConstant, 1);
      rhsX = reduceRational(-rhsXNumerator, rightDenominator);
      rhsConstant = reduceRational(rhsConstantNumerator, rightDenominator);
    } else {
      // 2025-type surface: (ax + b)/d1 = cx/d2 + n
      const lhsXNumerator = rng.int(1, 5);
      const lhsConstantNumerator = rng.int(1, 6);
      const rhsXNumerator = rng.int(1, 4);
      const wholeConstant = rng.int(1, 3);
      if (!preservesDisplayedDenominator(lhsXNumerator, leftDenominator) ||
          !preservesDisplayedDenominator(lhsConstantNumerator, leftDenominator) ||
          !preservesDisplayedDenominator(rhsXNumerator, rightDenominator)) continue;

      lhsX = reduceRational(lhsXNumerator, leftDenominator);
      lhsConstant = reduceRational(lhsConstantNumerator, leftDenominator);
      rhsX = reduceRational(rhsXNumerator, rightDenominator);
      rhsConstant = reduceRational(wholeConstant, 1);
    }

    const denominatorLcm = lcmAll([
      lhsX.denominator,
      lhsConstant.denominator,
      rhsX.denominator,
      rhsConstant.denominator,
    ]);
    if (denominatorLcm !== pair.lcm) continue;

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

    // Preserve the source-like sign architecture. The 2016 surface naturally
    // gives the reviewed negative-solution case; the 2019/2025 surfaces retain
    // positive leading terms and positive solutions.
    if (surfaceVariant === "SPLIT_TERMS") {
      if (rearrangedEquation.xCoefficient >= 0 || rearrangedEquation.constant <= 0) continue;
    } else if (rearrangedEquation.xCoefficient <= 0 || rearrangedEquation.constant <= 0) {
      continue;
    }

    const solution = reduceRational(rearrangedEquation.constant, rearrangedEquation.xCoefficient);
    if (solution.denominator === 1 || solution.denominator < 7 || solution.denominator > 8) continue;
    if (Math.abs(solution.numerator) < A7_GENERATOR_ABSTRACT_ENVELOPE.solutionNumeratorMagnitude.observedMin ||
        Math.abs(solution.numerator) > A7_GENERATOR_ABSTRACT_ENVELOPE.solutionNumeratorMagnitude.observedMax) continue;

    const state: A7FractionalEquationState = {
      family: "FRACTIONAL_COEFFICIENT",
      surfaceVariant,
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
        `surface grammar ${state.surfaceVariant}`,
        "three top-level displayed algebraic objects",
        "distinct displayed denominators",
        "positive leading term on each side",
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
    baseLatex: `${state.triangle.base}\\,\\text{cm}`,
    heightLatex: `\\left(x+${state.triangle.heightConstant}\\right)\\,\\text{cm}`,
  },
  rectangle: {
    heightLabel: `${state.rectangle.height} cm`,
    widthLabel: `(${state.rectangle.widthConstant} - x) cm`,
    heightLatex: `${state.rectangle.height}\\,\\text{cm}`,
    widthLatex: `\\left(${state.rectangle.widthConstant}-x\\right)\\,\\text{cm}`,
  },
  requirements: [
    "Show a symmetric narrow triangle and a separate upright rectangle in the same relative arrangement as the reviewed source family.",
    "Place the triangle-height dimension arrow immediately to the right of the triangle and the rectangle-height arrow immediately to the right of the rectangle.",
    "Render algebraic dimension labels as mathematics rather than plain text.",
    "Display both fixed base/width labels directly beneath their shapes.",
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
