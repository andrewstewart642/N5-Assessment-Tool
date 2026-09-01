import {
  a7FamilyFrequency,
  chooseA7Paper,
  historicalA7FractionalOverlap,
  historicalReferenceForA7Context,
  historicalReferenceForA7Fractional,
  selectA7Family,
} from "./Calibration";
import {
  A7_GENERATOR_CONTEXT_VISUAL_GUARDRAILS,
  A7_GENERATOR_DIFFICULTY_RULES,
  A7_GENERATOR_FAMILY_EVIDENCE,
  A7_GENERATOR_FRACTIONAL_DENOMINATOR_PAIRS,
  A7_GENERATOR_FRACTIONAL_GENERATION_ENVELOPE,
  A7_GENERATOR_FRACTIONAL_SURFACE_GUARDRAILS,
  A7_GENERATOR_INVARIANTS,
} from "./Evidence";
import { assessA7ContextDifficulty, assessA7FractionalDifficulty } from "./Difficulty";
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
  A7GeneratorDifficulty,
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

const preservesDisplayedDenominator = (numerator: number, denominator: number) =>
  reduceRational(numerator, denominator).denominator === denominator;

const surfaceVariantForDifficulty = (
  rng: SeededRandom,
  difficulty: A7GeneratorDifficulty,
): A7FractionalSurfaceVariant => {
  const lower: readonly A7FractionalSurfaceVariant[] = [
    "SPLIT_TERMS",
    "SPLIT_TERMS",
    "BINOMIAL_RIGHT_NUMERATOR",
    "BINOMIAL_LEFT_NUMERATOR",
  ];
  const upper: readonly A7FractionalSurfaceVariant[] = [
    "BINOMIAL_RIGHT_NUMERATOR",
    "BINOMIAL_LEFT_NUMERATOR",
    "BINOMIAL_RIGHT_NUMERATOR",
    "BINOMIAL_LEFT_NUMERATOR",
    "SPLIT_TERMS",
  ];
  return rng.pick(difficulty === 1 ? lower : upper);
};

const fractionalState = (
  seed: number,
  targetDifficulty: A7GeneratorDifficulty,
): A7FractionalEquationState => {
  const rng = new SeededRandom(mixSeed(seed, 0xA70017));
  const envelope = A7_GENERATOR_FRACTIONAL_GENERATION_ENVELOPE;
  const eligiblePairs = A7_GENERATOR_FRACTIONAL_DENOMINATOR_PAIRS.filter((pair) =>
    (pair.difficultyBands as readonly number[]).includes(targetDifficulty),
  );

  for (let attempt = 0; attempt < 24000; attempt += 1) {
    const surfaceVariant = surfaceVariantForDifficulty(rng, targetDifficulty);
    const pair = rng.pick(eligiblePairs);
    const leftDenominator = pair.left;
    const rightDenominator = pair.right;

    let lhsX: A7Rational;
    let lhsConstant: A7Rational;
    let rhsX: A7Rational;
    let rhsConstant: A7Rational;

    if (surfaceVariant === "SPLIT_TERMS") {
      // 2016-type surface: ax/d1 - b/d2 = cx
      const xNumerator = rng.int(1, targetDifficulty === 1 ? 5 : 7);
      const constantNumerator = rng.int(1, targetDifficulty === 1 ? 6 : 9);
      const wholeXCoefficient = rng.int(1, targetDifficulty === 1 ? 2 : 3);
      if (!preservesDisplayedDenominator(xNumerator, leftDenominator) ||
          !preservesDisplayedDenominator(constantNumerator, rightDenominator)) continue;

      lhsX = reduceRational(xNumerator, leftDenominator);
      lhsConstant = reduceRational(-constantNumerator, rightDenominator);
      rhsX = reduceRational(wholeXCoefficient, 1);
      rhsConstant = reduceRational(0, 1);
    } else if (surfaceVariant === "BINOMIAL_RIGHT_NUMERATOR") {
      // 2019-type surface: ax/d1 - n = (b - cx)/d2
      const lhsXNumerator = rng.int(1, targetDifficulty === 1 ? 4 : 6);
      const wholeConstant = rng.int(1, targetDifficulty === 1 ? 2 : 4);
      const rhsConstantNumerator = rng.int(1, targetDifficulty === 1 ? 6 : 9);
      const rhsXNumerator = rng.int(1, targetDifficulty === 1 ? 4 : 6);
      if (!preservesDisplayedDenominator(lhsXNumerator, leftDenominator) ||
          !preservesDisplayedDenominator(rhsConstantNumerator, rightDenominator) ||
          !preservesDisplayedDenominator(rhsXNumerator, rightDenominator)) continue;

      lhsX = reduceRational(lhsXNumerator, leftDenominator);
      lhsConstant = reduceRational(-wholeConstant, 1);
      rhsX = reduceRational(-rhsXNumerator, rightDenominator);
      rhsConstant = reduceRational(rhsConstantNumerator, rightDenominator);
    } else {
      // 2025-type surface: (ax + b)/d1 = cx/d2 + n
      const lhsXNumerator = rng.int(1, targetDifficulty === 1 ? 5 : 7);
      const lhsConstantNumerator = rng.int(1, targetDifficulty === 1 ? 6 : 9);
      const rhsXNumerator = rng.int(1, targetDifficulty === 1 ? 4 : 6);
      const wholeConstant = rng.int(1, targetDifficulty === 1 ? 2 : 4);
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
    if (denominatorLcm !== pair.lcm || denominatorLcm > envelope.denominatorLcmMax) continue;

    const clearedEquation = {
      lhsX: clearedValue(lhsX, denominatorLcm),
      lhsConstant: clearedValue(lhsConstant, denominatorLcm),
      rhsX: clearedValue(rhsX, denominatorLcm),
      rhsConstant: clearedValue(rhsConstant, denominatorLcm),
    };

    if (Math.abs(clearedEquation.lhsX) > envelope.absoluteClearedCoefficientMax ||
        Math.abs(clearedEquation.rhsX) > envelope.absoluteClearedCoefficientMax ||
        Math.abs(clearedEquation.lhsConstant) > envelope.absoluteClearedConstantMax ||
        Math.abs(clearedEquation.rhsConstant) > envelope.absoluteClearedConstantMax) continue;

    const rearrangedEquation = {
      xCoefficient: clearedEquation.lhsX - clearedEquation.rhsX,
      constant: clearedEquation.rhsConstant - clearedEquation.lhsConstant,
    };
    const coefficientMagnitude = Math.abs(rearrangedEquation.xCoefficient);
    if (coefficientMagnitude < envelope.absoluteRearrangedCoefficient.min ||
        coefficientMagnitude > envelope.absoluteRearrangedCoefficient.max ||
        rearrangedEquation.constant === 0) continue;

    // Preserve the clean sign architecture from the reviewed source surfaces.
    if (surfaceVariant === "SPLIT_TERMS") {
      if (rearrangedEquation.xCoefficient >= 0 || rearrangedEquation.constant <= 0) continue;
    } else if (rearrangedEquation.xCoefficient <= 0 || rearrangedEquation.constant <= 0) {
      continue;
    }

    const solution = reduceRational(rearrangedEquation.constant, rearrangedEquation.xCoefficient);
    const numeratorMagnitude = Math.abs(solution.numerator);
    if (solution.denominator === 1 ||
        solution.denominator < envelope.solutionDenominator.min ||
        solution.denominator > envelope.solutionDenominator.max ||
        numeratorMagnitude < envelope.solutionNumeratorMagnitude.min ||
        numeratorMagnitude > envelope.solutionNumeratorMagnitude.max) continue;

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
    if (assessA7FractionalDifficulty(state).difficulty !== targetDifficulty) continue;
    return state;
  }

  throw new Error(`Unable to construct an SQA-like A7 fractional equation at difficulty ${targetDifficulty} for this seed.`);
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

const fractionalQuestion = (
  seed: number,
  paper: A7GeneratorPaper,
  difficulty: A7GeneratorDifficulty,
): A7FractionalGeneratedQuestion => {
  const state = fractionalState(seed, difficulty);
  const difficultyAssessment = assessA7FractionalDifficulty(state);
  const prompt = buildA7FractionalPrompt(state);
  const frequency = a7FamilyFrequency("FRACTIONAL_COEFFICIENT", paper);
  const sourceBasis = sourceBasisForFractional(state);
  const primaryAnchor = sourceBasis.historicalReference.primaryQuestionCatalogId;

  return {
    generatorId: "A7_LINEAR_EQUATIONS_V1",
    instanceId: `A7-${paper}-D${difficulty}-FRACTIONAL-${seed >>> 0}`,
    seed,
    family: "FRACTIONAL_COEFFICIENT",
    familyReadiness: "CORE",
    paper,
    difficulty,
    marks: 3,
    standard: "A",
    thinking: "OPERATIONAL",
    ...prompt,
    mathState: state,
    visual: null,
    sourceBasis,
    generationConstraints: [
      ...A7_GENERATOR_INVARIANTS,
      ...A7_GENERATOR_FRACTIONAL_SURFACE_GUARDRAILS,
      ...A7_GENERATOR_DIFFICULTY_RULES,
    ],
    quality: {
      difficultyBandId: difficultyAssessment.bandId,
      difficultyScore: difficultyAssessment.score,
      difficultyMetrics: difficultyAssessment.metrics,
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
      difficultySignals: difficultyAssessment.signals,
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
  const difficultyAssessment = assessA7ContextDifficulty(state);
  const prompt = buildA7ContextPrompt(state);
  const frequency = a7FamilyFrequency("CONTEXT_AREA_EQUALITY", "P1");
  const sourceBasis = sourceBasisForContext();
  const primaryAnchor = sourceBasis.historicalReference.primaryQuestionCatalogId;

  return {
    generatorId: "A7_LINEAR_EQUATIONS_V1",
    instanceId: `A7-P1-D2-CONTEXT-AREA-${seed >>> 0}`,
    seed,
    family: "CONTEXT_AREA_EQUALITY",
    familyReadiness: "EXPERIMENTAL",
    paper: "P1",
    difficulty: 2,
    marks: 5,
    standard: "A",
    thinking: "REASONING",
    ...prompt,
    mathState: state,
    visual: contextVisual(state),
    sourceBasis,
    generationConstraints: [
      ...A7_GENERATOR_INVARIANTS,
      ...A7_GENERATOR_CONTEXT_VISUAL_GUARDRAILS,
      ...A7_GENERATOR_DIFFICULTY_RULES,
    ],
    quality: {
      difficultyBandId: difficultyAssessment.bandId,
      difficultyScore: difficultyAssessment.score,
      difficultyMetrics: difficultyAssessment.metrics,
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
      difficultySignals: difficultyAssessment.signals,
    },
  };
};

const defaultFractionalDifficulty = (seed: number): A7GeneratorDifficulty =>
  mixSeed(seed, 0xA7D1FF) % 100 < 55 ? 1 : 2;

export const generateA7Question = (options: A7GenerateOptions): A7GeneratedQuestion => {
  const includeExperimentalFamilies = options.includeExperimentalFamilies ?? true;
  const paper = chooseA7Paper(options.seed, options.family, options.paper);
  let family = selectA7Family(
    options.seed,
    paper,
    options.family,
    includeExperimentalFamilies,
  );

  if (options.difficulty === 1 && family === "CONTEXT_AREA_EQUALITY") {
    if (options.family === "CONTEXT_AREA_EQUALITY") {
      throw new Error("The current contextual A7 family is calibrated only to difficulty band 2.");
    }
    family = "FRACTIONAL_COEFFICIENT";
  }

  const question = family === "CONTEXT_AREA_EQUALITY"
    ? contextQuestion(options.seed)
    : fractionalQuestion(options.seed, paper, options.difficulty ?? defaultFractionalDifficulty(options.seed));

  const validation = validateA7GeneratedQuestion(question);
  if (!validation.valid) {
    const errors = validation.issues.filter((issue) => issue.severity === "ERROR");
    throw new Error(`Generated invalid A7 question: ${errors.map((issue) => `${issue.code}: ${issue.message}`).join(" | ")}`);
  }
  return question;
};

const questionSurfaceSignature = (question: A7GeneratedQuestion) =>
  question.family === "FRACTIONAL_COEFFICIENT"
    ? `F:${question.prompt}`
    : `C:${question.mathState.triangle.base}:${question.mathState.triangle.heightConstant}:${question.mathState.rectangle.height}:${question.mathState.rectangle.widthConstant}`;

export const generateA7QuestionBatch = (
  count: number,
  options: Omit<A7GenerateOptions, "seed"> & { seed: number },
): A7GeneratedQuestion[] => {
  if (!Number.isInteger(count) || count < 1) throw new Error("A7 batch count must be a positive integer.");

  const results: A7GeneratedQuestion[] = [];
  const seen = new Set<string>();

  for (let index = 0; index < count; index += 1) {
    let accepted: A7GeneratedQuestion | null = null;
    for (let retry = 0; retry < 80; retry += 1) {
      const candidateSeed = mixSeed(options.seed, (index + 1) * 131 + retry * 7919);
      const candidate = generateA7Question({ ...options, seed: candidateSeed });
      const signature = questionSurfaceSignature(candidate);
      if (seen.has(signature)) continue;
      seen.add(signature);
      accepted = candidate;
      break;
    }
    if (!accepted) {
      throw new Error(`Unable to create ${count} distinct A7 questions inside the calibrated generation space.`);
    }
    results.push(accepted);
  }

  return results;
};
