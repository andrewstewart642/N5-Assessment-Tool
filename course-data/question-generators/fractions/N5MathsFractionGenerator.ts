import { N5_MATHS_SOURCE_QUESTION_CATALOG } from "@/course-data/source-question-catalog/N5MathsSourceQuestionCatalog";

type FractionFamilyId =
  | "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION"
  | "NUM_FRACTIONS_MIXED_NUMBER_WITH_MIXED_NUMBER"
  | "NUM_FRACTIONS_BRACKETED_SUM_WITH_FRACTION_MULTIPLIER";

type FractionOperationType =
  | "ADD"
  | "SUBTRACT"
  | "MULTIPLY"
  | "DIVIDE"
  | "BRACKETED_SUM_AND_MULTIPLY";

type Fraction = {
  numerator: number;
  denominator: number;
};

type MixedNumber = {
  whole: number;
  fraction: Fraction;
};

export type GeneratedFractionQuestion = {
  id: string;
  familyId: FractionFamilyId;
  operationType: FractionOperationType;

  questionText: string;
  answerText: string;
  workingSummary: string;

  sourceEvidenceSummary: string;

  checks: {
    label: string;
    passed: boolean;
    detail: string;
  }[];

  metrics: {
    maxDenominatorInQuestion: number;
    maxIntermediateNumerator: number;
    maxIntermediateDenominator: number;
    finalAnswerType: string;
    simplificationRequired: boolean;
    crossCancellationAvailable: boolean;
    nonCalculatorFriendly: boolean;
  };
};

const FAMILY_IDS: FractionFamilyId[] = [
  "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
  "NUM_FRACTIONS_MIXED_NUMBER_WITH_MIXED_NUMBER",
  "NUM_FRACTIONS_BRACKETED_SUM_WITH_FRACTION_MULTIPLIER",
];

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }

  return x || 1;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function makeFraction(numerator: number, denominator: number): Fraction {
  if (denominator === 0) {
    throw new Error("Denominator cannot be zero.");
  }

  const sign = denominator < 0 ? -1 : 1;
  const adjustedNumerator = numerator * sign;
  const adjustedDenominator = Math.abs(denominator);

  const divisor = gcd(adjustedNumerator, adjustedDenominator);

  return {
    numerator: adjustedNumerator / divisor,
    denominator: adjustedDenominator / divisor,
  };
}

function rawFraction(numerator: number, denominator: number): Fraction {
  return { numerator, denominator };
}

function addFractions(a: Fraction, b: Fraction): Fraction {
  return makeFraction(
    a.numerator * b.denominator + b.numerator * a.denominator,
    a.denominator * b.denominator
  );
}

function subtractFractions(a: Fraction, b: Fraction): Fraction {
  return makeFraction(
    a.numerator * b.denominator - b.numerator * a.denominator,
    a.denominator * b.denominator
  );
}

function multiplyFractions(a: Fraction, b: Fraction): Fraction {
  return makeFraction(a.numerator * b.numerator, a.denominator * b.denominator);
}

function divideFractions(a: Fraction, b: Fraction): Fraction {
  return makeFraction(a.numerator * b.denominator, a.denominator * b.numerator);
}

function compareFractions(a: Fraction, b: Fraction): number {
  return a.numerator * b.denominator - b.numerator * a.denominator;
}

function mixedToImproper(mixed: MixedNumber): Fraction {
  return makeFraction(
    mixed.whole * mixed.fraction.denominator + mixed.fraction.numerator,
    mixed.fraction.denominator
  );
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomProperFraction(maxDenominator = 12): Fraction {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const denominator = randomInt(2, maxDenominator);
    const numerator = randomInt(1, denominator - 1);
    const fraction = makeFraction(numerator, denominator);

    if (
      fraction.numerator > 0 &&
      fraction.numerator < fraction.denominator &&
      fraction.denominator <= maxDenominator
    ) {
      return fraction;
    }
  }

  return makeFraction(1, 2);
}

function randomMixedNumber(maxDenominator = 12): MixedNumber {
  return {
    whole: randomInt(1, 5),
    fraction: randomProperFraction(maxDenominator),
  };
}

function hasCrossCancellation(a: Fraction, b: Fraction): boolean {
  return gcd(a.numerator, b.denominator) > 1 || gcd(b.numerator, a.denominator) > 1;
}

function formatFraction(fraction: Fraction): string {
  if (fraction.denominator === 1) {
    return String(fraction.numerator);
  }

  return `${fraction.numerator}/${fraction.denominator}`;
}

function formatMixedNumber(mixed: MixedNumber): string {
  return `${mixed.whole} ${formatFraction(mixed.fraction)}`;
}

function formatAnswer(fraction: Fraction): string {
  if (fraction.denominator === 1) {
    return String(fraction.numerator);
  }

  if (Math.abs(fraction.numerator) > fraction.denominator) {
    const whole = Math.trunc(fraction.numerator / fraction.denominator);
    const remainder = Math.abs(fraction.numerator % fraction.denominator);

    if (remainder === 0) {
      return String(whole);
    }

    return `${whole} ${remainder}/${fraction.denominator}`;
  }

  return formatFraction(fraction);
}

function getFinalAnswerType(fraction: Fraction): string {
  if (fraction.denominator === 1) return "INTEGER";
  if (Math.abs(fraction.numerator) < fraction.denominator) return "PROPER_FRACTION";
  return "MIXED_NUMBER";
}

function countSourceQuestionsForFamily(familyId: FractionFamilyId): number {
  return N5_MATHS_SOURCE_QUESTION_CATALOG.filter(
    (question) => question.familyId === familyId
  ).length;
}

function countOperationForFamily(
  familyId: FractionFamilyId,
  operationType: FractionOperationType
): number {
  return N5_MATHS_SOURCE_QUESTION_CATALOG.filter(
    (question) =>
      question.familyId === familyId && question.operationType === operationType
  ).length;
}

function pickWeighted<T>(items: { value: T; weight: number }[]): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;

  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item.value;
  }

  return items[items.length - 1].value;
}

function pickFamilyId(): FractionFamilyId {
  return pickWeighted(
    FAMILY_IDS.map((familyId) => ({
      value: familyId,
      weight: Math.max(1, countSourceQuestionsForFamily(familyId)),
    }))
  );
}

function pickMixedProperOperation(): "ADD" | "MULTIPLY" | "DIVIDE" {
  return pickWeighted([
    {
      value: "ADD",
      weight: Math.max(
        1,
        countOperationForFamily(
          "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
          "ADD"
        )
      ),
    },
    {
      value: "MULTIPLY",
      weight: Math.max(
        1,
        countOperationForFamily(
          "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
          "MULTIPLY"
        )
      ),
    },
    {
      value: "DIVIDE",
      weight: Math.max(
        1,
        countOperationForFamily(
          "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
          "DIVIDE"
        )
      ),
    },
  ]);
}

function makeGeneratedQuestion(
  familyId: FractionFamilyId,
  operationType: FractionOperationType,
  questionText: string,
  answer: Fraction,
  rawIntermediate: Fraction,
  maxDenominatorInQuestion: number,
  crossCancellationAvailable: boolean,
  workingSummary: string,
  extraChecks: GeneratedFractionQuestion["checks"] = []
): GeneratedFractionQuestion {
  const simplifiedIntermediate = makeFraction(
    rawIntermediate.numerator,
    rawIntermediate.denominator
  );

  const simplificationRequired =
    simplifiedIntermediate.numerator !== rawIntermediate.numerator ||
    simplifiedIntermediate.denominator !== rawIntermediate.denominator;

  const maxIntermediateNumerator = Math.abs(rawIntermediate.numerator);
  const maxIntermediateDenominator = Math.abs(rawIntermediate.denominator);

  const nonCalculatorFriendly =
    maxDenominatorInQuestion <= 12 &&
    maxIntermediateNumerator <= 160 &&
    maxIntermediateDenominator <= 160 &&
    Math.abs(answer.numerator) <= 80 &&
    answer.denominator <= 80;

  const sourceCount = countSourceQuestionsForFamily(familyId);

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    familyId,
    operationType,

    questionText,
    answerText: formatAnswer(answer),
    workingSummary,

    sourceEvidenceSummary: `${sourceCount} historical source question${
      sourceCount === 1 ? "" : "s"
    } in this family.`,

    checks: [
      {
        label: "Small denominators",
        passed: maxDenominatorInQuestion <= 12,
        detail: `Largest denominator in question: ${maxDenominatorInQuestion}`,
      },
      {
        label: "Manageable intermediate values",
        passed: maxIntermediateNumerator <= 160 && maxIntermediateDenominator <= 160,
        detail: `Largest raw intermediate: ${maxIntermediateNumerator}/${maxIntermediateDenominator}`,
      },
      {
        label: "Tidy final answer",
        passed: Math.abs(answer.numerator) <= 80 && answer.denominator <= 80,
        detail: `Final answer type: ${getFinalAnswerType(answer)}`,
      },
      {
        label: "Non-calculator friendly",
        passed: nonCalculatorFriendly,
        detail: nonCalculatorFriendly
          ? "Arithmetic is suitable for early Paper 1."
          : "Arithmetic may be too heavy for early Paper 1.",
      },
      ...extraChecks,
    ],

    metrics: {
      maxDenominatorInQuestion,
      maxIntermediateNumerator,
      maxIntermediateDenominator,
      finalAnswerType: getFinalAnswerType(answer),
      simplificationRequired,
      crossCancellationAvailable,
      nonCalculatorFriendly,
    },
  };
}

function generateMixedProperMultiplication(): GeneratedFractionQuestion {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const mixed = randomMixedNumber();
    const proper = randomProperFraction();

    const mixedFraction = mixedToImproper(mixed);
    const rawIntermediate = rawFraction(
      mixedFraction.numerator * proper.numerator,
      mixedFraction.denominator * proper.denominator
    );

    const answer = multiplyFractions(mixedFraction, proper);
    const crossCancellationAvailable = hasCrossCancellation(mixedFraction, proper);

    if (!crossCancellationAvailable) continue;
    if (Math.abs(rawIntermediate.numerator) > 160) continue;
    if (rawIntermediate.denominator > 160) continue;
    if (Math.abs(answer.numerator) > 80 || answer.denominator > 80) continue;
    if (answer.denominator === 1) continue;

    const mixedFirst = Math.random() >= 0.5;

    const questionText = mixedFirst
      ? `Evaluate ${formatMixedNumber(mixed)} × ${formatFraction(
          proper
        )}. Give your answer in its simplest form.`
      : `Evaluate ${formatFraction(proper)} × ${formatMixedNumber(
          mixed
        )}. Give your answer in its simplest form.`;

    return makeGeneratedQuestion(
      "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
      "MULTIPLY",
      questionText,
      answer,
      rawIntermediate,
      Math.max(mixed.fraction.denominator, proper.denominator),
      crossCancellationAvailable,
      `Convert the mixed number to an improper fraction, multiply, then simplify.`,
      [
        {
          label: "Visible cancellation/simplification",
          passed: true,
          detail:
            "The values were accepted only because a cancellation or simplification route exists.",
        },
      ]
    );
  }

  throw new Error("Could not generate a suitable mixed-number multiplication question.");
}

function generateMixedProperDivision(): GeneratedFractionQuestion {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const mixed = randomMixedNumber();
    const proper = randomProperFraction();

    const mixedFraction = mixedToImproper(mixed);
    const reciprocal = makeFraction(proper.denominator, proper.numerator);

    const rawIntermediate = rawFraction(
      mixedFraction.numerator * reciprocal.numerator,
      mixedFraction.denominator * reciprocal.denominator
    );

    const answer = divideFractions(mixedFraction, proper);
    const crossCancellationAvailable = hasCrossCancellation(
      mixedFraction,
      reciprocal
    );

    if (!crossCancellationAvailable) continue;
    if (Math.abs(rawIntermediate.numerator) > 160) continue;
    if (rawIntermediate.denominator > 160) continue;
    if (Math.abs(answer.numerator) > 80 || answer.denominator > 80) continue;
    if (answer.denominator === 1) continue;

    const questionText = `Evaluate ${formatMixedNumber(
      mixed
    )} ÷ ${formatFraction(
      proper
    )}. Give your answer in its simplest form.`;

    return makeGeneratedQuestion(
      "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
      "DIVIDE",
      questionText,
      answer,
      rawIntermediate,
      Math.max(mixed.fraction.denominator, proper.denominator),
      crossCancellationAvailable,
      `Convert the mixed number to an improper fraction, multiply by the reciprocal, then simplify.`,
      [
        {
          label: "Reciprocal step remains tidy",
          passed: true,
          detail:
            "The reciprocal multiplication was accepted only if the resulting values stayed manageable.",
        },
      ]
    );
  }

  throw new Error("Could not generate a suitable mixed-number division question.");
}

function generateMixedProperAddition(): GeneratedFractionQuestion {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const mixed = randomMixedNumber();
    const proper = randomProperFraction();

    const commonDenominator = lcm(mixed.fraction.denominator, proper.denominator);
    if (commonDenominator > 36) continue;
    if (mixed.fraction.denominator === proper.denominator) continue;

    const mixedFraction = mixedToImproper(mixed);
    const rawIntermediate = rawFraction(
      mixedFraction.numerator * proper.denominator +
        proper.numerator * mixedFraction.denominator,
      mixedFraction.denominator * proper.denominator
    );

    const answer = addFractions(mixedFraction, proper);

    if (Math.abs(rawIntermediate.numerator) > 160) continue;
    if (rawIntermediate.denominator > 160) continue;
    if (Math.abs(answer.numerator) > 80 || answer.denominator > 80) continue;
    if (answer.denominator === 1) continue;

    const questionText = `Evaluate ${formatMixedNumber(
      mixed
    )} + ${formatFraction(proper)}.`;

    return makeGeneratedQuestion(
      "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
      "ADD",
      questionText,
      answer,
      rawIntermediate,
      Math.max(mixed.fraction.denominator, proper.denominator),
      false,
      `Use a common denominator, add the fractional parts, then write the answer tidily.`,
      [
        {
          label: "Manageable common denominator",
          passed: commonDenominator <= 36,
          detail: `Common denominator: ${commonDenominator}`,
        },
      ]
    );
  }

  throw new Error("Could not generate a suitable mixed-number addition question.");
}

function generateMixedMixedSubtraction(): GeneratedFractionQuestion {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const first = randomMixedNumber();
    const second = randomMixedNumber();

    const firstFraction = mixedToImproper(first);
    const secondFraction = mixedToImproper(second);

    if (compareFractions(firstFraction, secondFraction) <= 0) continue;
    if (first.fraction.denominator === second.fraction.denominator) continue;

    const commonDenominator = lcm(
      first.fraction.denominator,
      second.fraction.denominator
    );

    if (commonDenominator > 36) continue;

    const rawIntermediate = rawFraction(
      firstFraction.numerator * secondFraction.denominator -
        secondFraction.numerator * firstFraction.denominator,
      firstFraction.denominator * secondFraction.denominator
    );

    const answer = subtractFractions(firstFraction, secondFraction);

    if (answer.numerator <= 0) continue;
    if (answer.denominator === 1) continue;
    if (Math.abs(rawIntermediate.numerator) > 160) continue;
    if (rawIntermediate.denominator > 160) continue;
    if (Math.abs(answer.numerator) > 80 || answer.denominator > 80) continue;

    const questionText = `Evaluate ${formatMixedNumber(
      first
    )} − ${formatMixedNumber(second)}.`;

    return makeGeneratedQuestion(
      "NUM_FRACTIONS_MIXED_NUMBER_WITH_MIXED_NUMBER",
      "SUBTRACT",
      questionText,
      answer,
      rawIntermediate,
      Math.max(first.fraction.denominator, second.fraction.denominator),
      false,
      `Convert or handle the mixed numbers, use a common denominator, subtract, then simplify.`,
      [
        {
          label: "Positive result",
          passed: true,
          detail: "The first mixed number is larger than the second.",
        },
        {
          label: "Manageable common denominator",
          passed: commonDenominator <= 36,
          detail: `Common denominator: ${commonDenominator}`,
        },
      ]
    );
  }

  throw new Error("Could not generate a suitable mixed-number subtraction question.");
}

function generateBracketedFractionExpression(): GeneratedFractionQuestion {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const multiplier = randomProperFraction();
    const first = randomProperFraction();
    const second = randomProperFraction();

    if (first.denominator === second.denominator) continue;

    const commonDenominator = lcm(first.denominator, second.denominator);
    if (commonDenominator > 36) continue;

    const bracketSum = addFractions(first, second);
    if (bracketSum.numerator >= bracketSum.denominator * 2) continue;

    const rawIntermediate = rawFraction(
      multiplier.numerator * bracketSum.numerator,
      multiplier.denominator * bracketSum.denominator
    );

    const answer = multiplyFractions(multiplier, bracketSum);
    const simplificationRequired =
      makeFraction(rawIntermediate.numerator, rawIntermediate.denominator)
        .denominator !== rawIntermediate.denominator ||
      makeFraction(rawIntermediate.numerator, rawIntermediate.denominator)
        .numerator !== rawIntermediate.numerator;

    if (!simplificationRequired) continue;
    if (answer.numerator >= answer.denominator) continue;
    if (Math.abs(rawIntermediate.numerator) > 160) continue;
    if (rawIntermediate.denominator > 160) continue;
    if (answer.denominator > 80) continue;

    const questionText = `Evaluate ${formatFraction(
      multiplier
    )} × (${formatFraction(first)} + ${formatFraction(
      second
    )}). Give your answer in its simplest form.`;

    return makeGeneratedQuestion(
      "NUM_FRACTIONS_BRACKETED_SUM_WITH_FRACTION_MULTIPLIER",
      "BRACKETED_SUM_AND_MULTIPLY",
      questionText,
      answer,
      rawIntermediate,
      Math.max(multiplier.denominator, first.denominator, second.denominator),
      hasCrossCancellation(multiplier, bracketSum),
      `Evaluate the bracket first, multiply by the outside fraction, then simplify.`,
      [
        {
          label: "Manageable bracket denominator",
          passed: commonDenominator <= 36,
          detail: `Bracket common denominator: ${commonDenominator}`,
        },
        {
          label: "Final simplification required",
          passed: simplificationRequired,
          detail: "The final multiplication produces a simplifiable fraction.",
        },
      ]
    );
  }

  throw new Error("Could not generate a suitable bracketed fraction question.");
}

export function generateN5MathsFractionQuestion(): GeneratedFractionQuestion {
  const familyId = pickFamilyId();

  if (familyId === "NUM_FRACTIONS_MIXED_NUMBER_WITH_MIXED_NUMBER") {
    return generateMixedMixedSubtraction();
  }

  if (familyId === "NUM_FRACTIONS_BRACKETED_SUM_WITH_FRACTION_MULTIPLIER") {
    return generateBracketedFractionExpression();
  }

  const operation = pickMixedProperOperation();

  if (operation === "MULTIPLY") {
    return generateMixedProperMultiplication();
  }

  if (operation === "DIVIDE") {
    return generateMixedProperDivision();
  }

  return generateMixedProperAddition();
}

export function generateN5MathsFractionSamples(
  sampleCount = 20
): GeneratedFractionQuestion[] {
  return Array.from({ length: sampleCount }, () =>
    generateN5MathsFractionQuestion()
  );
}