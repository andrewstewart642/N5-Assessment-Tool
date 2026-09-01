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
import {
  buildA7ContextPrompt,
  buildA7FractionalPrompt,
  linearDimensionLatex,
  linearDimensionText,
} from "./PromptGrammar";
import type {
  A7AreaVisualSpec,
  A7ContextAreaState,
  A7ContextGeneratedQuestion,
  A7DimensionAxis,
  A7FractionalEquationState,
  A7FractionalGeneratedQuestion,
  A7FractionalSurfaceVariant,
  A7GenerateOptions,
  A7GeneratedQuestion,
  A7GeneratorDifficulty,
  A7GeneratorPaper,
  A7LinearDimension,
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
    "BINOMIAL_BOTH_SIDES",
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

  for (let attempt = 0; attempt < 30000; attempt += 1) {
    const surfaceVariant = surfaceVariantForDifficulty(rng, targetDifficulty);
    const pair = rng.pick(eligiblePairs);
    const leftDenominator = pair.left;
    const rightDenominator = pair.right;

    let lhsX: A7Rational;
    let lhsConstant: A7Rational;
    let rhsX: A7Rational;
    let rhsConstant: A7Rational;

    if (surfaceVariant === "SPLIT_TERMS") {
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
    } else if (surfaceVariant === "BINOMIAL_LEFT_NUMERATOR") {
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
    } else {
      // Moderated extension: (ax+b)/d1 = (cx+d)/d2. It creates up to two
      // genuine bracket-expansion steps but remains a compact linear equation.
      const lhsXNumerator = rng.int(1, 6);
      const lhsConstantNumerator = rng.int(1, 8);
      const rhsXNumerator = rng.int(1, 6);
      const rhsConstantNumerator = rng.int(1, 8);
      if (!preservesDisplayedDenominator(lhsXNumerator, leftDenominator) ||
          !preservesDisplayedDenominator(lhsConstantNumerator, leftDenominator) ||
          !preservesDisplayedDenominator(rhsXNumerator, rightDenominator) ||
          !preservesDisplayedDenominator(rhsConstantNumerator, rightDenominator)) continue;

      lhsX = reduceRational(lhsXNumerator, leftDenominator);
      lhsConstant = reduceRational(lhsConstantNumerator, leftDenominator);
      rhsX = reduceRational(rhsXNumerator, rightDenominator);
      rhsConstant = reduceRational(rhsConstantNumerator, rightDenominator);
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

    const rawXCoefficient = clearedEquation.lhsX - clearedEquation.rhsX;
    const rawConstant = clearedEquation.rhsConstant - clearedEquation.lhsConstant;
    if (rawXCoefficient === 0 || rawConstant === 0) continue;
    const sign = rawXCoefficient < 0 ? -1 : 1;
    const rearrangedEquation = {
      xCoefficient: rawXCoefficient * sign,
      constant: rawConstant * sign,
    };
    const coefficientMagnitude = rearrangedEquation.xCoefficient;
    if (coefficientMagnitude < envelope.absoluteRearrangedCoefficient.min ||
        coefficientMagnitude > envelope.absoluteRearrangedCoefficient.max ||
        rearrangedEquation.constant === 0) continue;

    // Retain the source-like negative-solution character of the split-term
    // grammar while keeping the other surfaces clean and positive.
    if (surfaceVariant === "SPLIT_TERMS") {
      if (rearrangedEquation.constant >= 0) continue;
    } else if (rearrangedEquation.constant <= 0) {
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

const dimensionAt = (dimension: A7LinearDimension, x: number) =>
  dimension.xCoefficient * x + dimension.constant;

const expressionAxis = (rng: SeededRandom): A7DimensionAxis =>
  rng.next() < 0.5 ? "BASE" : "HEIGHT";

const contextState = (seed: number): A7ContextAreaState => {
  const rng = new SeededRandom(mixSeed(seed, 0xA70022));
  const triangleFixedDimensions = [3, 5, 7] as const;

  for (let attempt = 0; attempt < 18000; attempt += 1) {
    const triangleFixedDimension = rng.pick(triangleFixedDimensions);
    const rectangleFixedDimension = rng.int(4, 8);
    const solution = rng.int(2, 8);
    const triangleAlgebraicDimension = expressionAxis(rng);
    const rectangleAlgebraicDimension = expressionAxis(rng);

    const useNonUnitCoefficient = rng.next() < 0.28;
    const nonUnitOnTriangle = useNonUnitCoefficient && rng.next() < 0.5;
    const triangleCoefficient = (nonUnitOnTriangle
      ? rng.pick([2, -2] as const)
      : rng.pick([1, 1, 1, -1] as const)) as -2 | -1 | 1 | 2;
    const rectangleCoefficient = (useNonUnitCoefficient && !nonUnitOnTriangle
      ? rng.pick([2, -2] as const)
      : rng.pick([1, 1, -1, -1] as const)) as -2 | -1 | 1 | 2;

    const triangleDimensionAtSolution = rng.int(6, 20);
    const doubledTriangleArea = triangleFixedDimension * triangleDimensionAtSolution;
    if (doubledTriangleArea % 2 !== 0) continue;
    const triangleArea = doubledTriangleArea / 2;
    if (triangleArea % rectangleFixedDimension !== 0) continue;

    const rectangleDimensionAtSolution = triangleArea / rectangleFixedDimension;
    if (rectangleDimensionAtSolution < 2 || rectangleDimensionAtSolution > 20) continue;

    const triangleConstant = triangleDimensionAtSolution - triangleCoefficient * solution;
    const rectangleConstant = rectangleDimensionAtSolution - rectangleCoefficient * solution;
    if (triangleConstant < 1 || triangleConstant > 20 || rectangleConstant < 1 || rectangleConstant > 20) continue;

    const triangleLinearDimension: A7LinearDimension = {
      xCoefficient: triangleCoefficient,
      constant: triangleConstant,
    };
    const rectangleLinearDimension: A7LinearDimension = {
      xCoefficient: rectangleCoefficient,
      constant: rectangleConstant,
    };

    if (dimensionAt(triangleLinearDimension, solution) <= 0 ||
        dimensionAt(rectangleLinearDimension, solution) <= 0) continue;

    const leftXCoefficient = triangleFixedDimension * triangleCoefficient;
    const leftConstant = triangleFixedDimension * triangleConstant;
    const rightXCoefficient = 2 * rectangleFixedDimension * rectangleCoefficient;
    const rightConstant = 2 * rectangleFixedDimension * rectangleConstant;
    const rawXCoefficient = leftXCoefficient - rightXCoefficient;
    const rawConstant = rightConstant - leftConstant;
    if (rawXCoefficient === 0 || rawConstant === 0) continue;
    const sign = rawXCoefficient < 0 ? -1 : 1;
    const xCoefficient = rawXCoefficient * sign;
    const constant = rawConstant * sign;
    if (xCoefficient < 10 || xCoefficient > 30 || constant !== xCoefficient * solution) continue;

    // Exclude the exact historical state while retaining its family grammar.
    const historicalMatch =
      triangleAlgebraicDimension === "HEIGHT" &&
      triangleFixedDimension === 3 &&
      triangleCoefficient === 1 &&
      triangleConstant === 12 &&
      rectangleAlgebraicDimension === "BASE" &&
      rectangleFixedDimension === 6 &&
      rectangleCoefficient === -1 &&
      rectangleConstant === 8;
    if (historicalMatch) continue;

    return {
      family: "CONTEXT_AREA_EQUALITY",
      triangle: {
        algebraicDimension: triangleAlgebraicDimension,
        fixedDimension: triangleFixedDimension,
        linearDimension: triangleLinearDimension,
      },
      rectangle: {
        algebraicDimension: rectangleAlgebraicDimension,
        fixedDimension: rectangleFixedDimension,
        linearDimension: rectangleLinearDimension,
      },
      equalAreaEquation: {
        triangleMultiplierNumerator: triangleFixedDimension,
        triangleMultiplierDenominator: 2,
        rectangleMultiplier: rectangleFixedDimension,
      },
      clearedEquation: {
        leftXCoefficient,
        leftConstant,
        rightXCoefficient,
        rightConstant,
      },
      rearrangedEquation: {
        xCoefficient,
        constant,
      },
      solution,
    };
  }

  throw new Error("Unable to construct an SQA-like A7 equal-area question for this seed.");
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
        `genuine bracket expansions ${difficultyAssessment.metrics.bracketExpansionCount}`,
        "positive leading term on each side",
        `rearranged coefficient ${Math.abs(state.rearrangedEquation.xCoefficient)}`,
      ],
      difficultySignals: difficultyAssessment.signals,
    },
  };
};

const fixedDimensionLatex = (value: number) => `${value}\\,\\text{cm}`;
const algebraicDimensionLatex = (dimension: A7LinearDimension) =>
  `\\left(${linearDimensionLatex(dimension)}\\right)\\,\\text{cm}`;
const algebraicDimensionLabel = (dimension: A7LinearDimension) =>
  `(${linearDimensionText(dimension)}) cm`;

const contextVisual = (state: A7ContextAreaState): A7AreaVisualSpec => {
  const triangleBaseAlgebraic = state.triangle.algebraicDimension === "BASE";
  const rectangleWidthAlgebraic = state.rectangle.algebraicDimension === "BASE";

  return {
    kind: "A7_EQUAL_AREA_DIAGRAM",
    rendererFamilyId: "A7_AREA_EQUALITY_DIAGRAM",
    unit: "cm",
    triangle: {
      baseLabel: triangleBaseAlgebraic ? algebraicDimensionLabel(state.triangle.linearDimension) : `${state.triangle.fixedDimension} cm`,
      heightLabel: triangleBaseAlgebraic ? `${state.triangle.fixedDimension} cm` : algebraicDimensionLabel(state.triangle.linearDimension),
      baseLatex: triangleBaseAlgebraic ? algebraicDimensionLatex(state.triangle.linearDimension) : fixedDimensionLatex(state.triangle.fixedDimension),
      heightLatex: triangleBaseAlgebraic ? fixedDimensionLatex(state.triangle.fixedDimension) : algebraicDimensionLatex(state.triangle.linearDimension),
    },
    rectangle: {
      heightLabel: rectangleWidthAlgebraic ? `${state.rectangle.fixedDimension} cm` : algebraicDimensionLabel(state.rectangle.linearDimension),
      widthLabel: rectangleWidthAlgebraic ? algebraicDimensionLabel(state.rectangle.linearDimension) : `${state.rectangle.fixedDimension} cm`,
      heightLatex: rectangleWidthAlgebraic ? fixedDimensionLatex(state.rectangle.fixedDimension) : algebraicDimensionLatex(state.rectangle.linearDimension),
      widthLatex: rectangleWidthAlgebraic ? algebraicDimensionLatex(state.rectangle.linearDimension) : fixedDimensionLatex(state.rectangle.fixedDimension),
    },
    requirements: [
      "Use a symmetric narrow triangle and a separate upright rectangle in the reviewed source-like arrangement.",
      "Either the horizontal or vertical dimension may carry the linear expression; the visual label must follow the generated state.",
      "Render every algebraic dimension label as mathematics rather than plain text.",
      "Keep the remaining dimension on each shape fixed so the equal-area model stays linear.",
      "Do not imply that candidates may measure the drawing.",
      "Visual geometry must be procedurally original and agree with the generated mathematical state.",
    ],
  };
};

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
        `triangle expression on ${state.triangle.algebraicDimension.toLowerCase()}`,
        `rectangle expression on ${state.rectangle.algebraicDimension.toLowerCase()}`,
        `dimension coefficients ${state.triangle.linearDimension.xCoefficient} and ${state.rectangle.linearDimension.xCoefficient}`,
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
      throw new Error("The contextual A7 family is calibrated only to difficulty band 2.");
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
    : `C:${question.mathState.triangle.algebraicDimension}:${question.mathState.triangle.fixedDimension}:${question.mathState.triangle.linearDimension.xCoefficient}:${question.mathState.triangle.linearDimension.constant}:${question.mathState.rectangle.algebraicDimension}:${question.mathState.rectangle.fixedDimension}:${question.mathState.rectangle.linearDimension.xCoefficient}:${question.mathState.rectangle.linearDimension.constant}`;

const questionStructuralSignature = (question: A7GeneratedQuestion) => {
  if (question.family === "FRACTIONAL_COEFFICIENT") {
    const state = question.mathState;
    return [
      "F",
      question.difficulty,
      state.surfaceVariant,
      state.lhsX.denominator,
      state.rhsX.denominator,
      Math.abs(state.lhsX.numerator),
      Math.abs(state.rhsX.numerator),
    ].join(":");
  }
  return [
    "C",
    stateAxis(question.mathState.triangle.algebraicDimension),
    question.mathState.triangle.linearDimension.xCoefficient,
    stateAxis(question.mathState.rectangle.algebraicDimension),
    question.mathState.rectangle.linearDimension.xCoefficient,
  ].join(":");
};

const stateAxis = (axis: A7DimensionAxis) => axis === "BASE" ? "B" : "H";

export const generateA7QuestionBatch = (
  count: number,
  options: Omit<A7GenerateOptions, "seed"> & { seed: number },
): A7GeneratedQuestion[] => {
  if (!Number.isInteger(count) || count < 1) throw new Error("A7 batch count must be a positive integer.");

  const results: A7GeneratedQuestion[] = [];
  const seenExact = new Set<string>();
  const seenStructural = new Set<string>();

  for (let index = 0; index < count; index += 1) {
    let accepted: A7GeneratedQuestion | null = null;
    for (let retry = 0; retry < 220; retry += 1) {
      const candidateSeed = mixSeed(options.seed, (index + 1) * 131 + retry * 7919);
      const candidate = generateA7Question({ ...options, seed: candidateSeed });
      const exactSignature = questionSurfaceSignature(candidate);
      const structuralSignature = questionStructuralSignature(candidate);
      if (seenExact.has(exactSignature) || seenStructural.has(structuralSignature)) continue;
      seenExact.add(exactSignature);
      seenStructural.add(structuralSignature);
      accepted = candidate;
      break;
    }
    if (!accepted) {
      throw new Error(`Unable to create ${count} structurally distinct A7 questions inside the calibrated generation space.`);
    }
    results.push(accepted);
  }

  return results;
};
