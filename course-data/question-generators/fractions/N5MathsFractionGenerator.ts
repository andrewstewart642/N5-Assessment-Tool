import {
  N5_MATHS_SOURCE_QUESTION_CATALOG,
} from "@/course-data/source-question-catalog/N5MathsSourceQuestionCatalog";


export type FractionFamilyId =
  | "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION"
  | "NUM_FRACTIONS_MIXED_NUMBER_WITH_MIXED_NUMBER"
  | "NUM_FRACTIONS_BRACKETED_SUM_WITH_FRACTION_MULTIPLIER";


export type FractionOperationType =
  | "ADD"
  | "SUBTRACT"
  | "MULTIPLY"
  | "DIVIDE"
  | "BRACKETED_SUM_AND_MULTIPLY";


export type FractionDifficulty =
  | 1
  | 2
  | 3;


export type FractionGeneratorOptions = {
  difficulty?: FractionDifficulty;
  operationType?: FractionOperationType;
};


export type Fraction = {
  numerator: number;
  denominator: number;
};


export type MixedNumber = {
  whole: number;
  fraction: Fraction;
};


export type FractionNumericProfile =
  | {
      kind:
        "MIXED_PROPER_ADD";

      mixed:
        MixedNumber;

      proper:
        Fraction;

      mixedImproper:
        Fraction;

      commonDenominator:
        number;

      rawIntermediate:
        Fraction;

      answer:
        Fraction;
    }

  | {
      kind:
        "MIXED_MIXED_SUBTRACT";

      first:
        MixedNumber;

      second:
        MixedNumber;

      firstImproper:
        Fraction;

      secondImproper:
        Fraction;

      commonDenominator:
        number;

      rawIntermediate:
        Fraction;

      answer:
        Fraction;
    }

  | {
      kind:
        "MIXED_PROPER_MULTIPLY";

      mixed:
        MixedNumber;

      proper:
        Fraction;

      mixedImproper:
        Fraction;

      displayOrder:
        | "MIXED_THEN_PROPER"
        | "PROPER_THEN_MIXED";

      rawIntermediate:
        Fraction;

      answer:
        Fraction;
    }

  | {
      kind:
        "MIXED_PROPER_DIVIDE";

      mixed:
        MixedNumber;

      proper:
        Fraction;

      mixedImproper:
        Fraction;

      reciprocal:
        Fraction;

      rawIntermediate:
        Fraction;

      answer:
        Fraction;
    }

  | {
      kind:
        "BRACKETED_SUM_AND_MULTIPLY";

      multiplier:
        Fraction;

      first:
        Fraction;

      second:
        Fraction;

      bracketSum:
        Fraction;

      commonDenominator:
        number;

      rawIntermediate:
        Fraction;

      answer:
        Fraction;
    };


type FractionDifficultyProfile = {
  minDenominator: number;
  maxDenominator: number;

  minWholeNumber: number;
  maxWholeNumber: number;

  maxCommonDenominator: number;

  maxIntermediateNumerator: number;
  maxIntermediateDenominator: number;

  maxFinalNumerator: number;
  maxFinalDenominator: number;
};


export type GeneratedFractionQuestion = {
  id: string;

  familyId: FractionFamilyId;
  operationType: FractionOperationType;
  difficulty: FractionDifficulty;

  questionText: string;
  answerText: string;
  workingSummary: string;

  numericProfile:
    FractionNumericProfile;

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


const FAMILY_IDS:
  FractionFamilyId[] = [
    "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
    "NUM_FRACTIONS_MIXED_NUMBER_WITH_MIXED_NUMBER",
    "NUM_FRACTIONS_BRACKETED_SUM_WITH_FRACTION_MULTIPLIER",
  ];


/**
 * Difficulty changes the arithmetic burden
 * without changing the mathematical family.
 *
 * Level 3 deliberately preserves the ceiling
 * used by the original generator.
 */
const FRACTION_DIFFICULTY_PROFILES:
  Record<
    FractionDifficulty,
    FractionDifficultyProfile
  > = {
    1: {
      minDenominator:
        2,

      maxDenominator:
        6,

      minWholeNumber:
        1,

      maxWholeNumber:
        3,

      maxCommonDenominator:
        12,

      maxIntermediateNumerator:
        60,

      maxIntermediateDenominator:
        72,

      maxFinalNumerator:
        36,

      maxFinalDenominator:
        24,
    },

    2: {
      minDenominator:
        3,

      maxDenominator:
        9,

      minWholeNumber:
        1,

      maxWholeNumber:
        4,

      maxCommonDenominator:
        24,

      maxIntermediateNumerator:
        100,

      maxIntermediateDenominator:
        120,

      maxFinalNumerator:
        60,

      maxFinalDenominator:
        48,
    },

    3: {
      minDenominator:
        4,

      maxDenominator:
        12,

      minWholeNumber:
        2,

      maxWholeNumber:
        5,

      maxCommonDenominator:
        36,

      maxIntermediateNumerator:
        160,

      maxIntermediateDenominator:
        160,

      maxFinalNumerator:
        80,

      maxFinalDenominator:
        80,
    },
  };


/**
 * Absolute National 5 generator ceiling.
 *
 * No difficulty level is allowed to exceed
 * these limits.
 */
const SQA_FRACTION_CEILING = {
  maxDenominator:
    12,

  maxIntermediateNumerator:
    160,

  maxIntermediateDenominator:
    160,

  maxFinalNumerator:
    80,

  maxFinalDenominator:
    80,
} as const;


function profileForDifficulty(
  difficulty:
    FractionDifficulty
): FractionDifficultyProfile {
  return (
    FRACTION_DIFFICULTY_PROFILES[
      difficulty
    ]
  );
}


function gcd(
  a: number,
  b: number
): number {
  let x =
    Math.abs(a);

  let y =
    Math.abs(b);

  while (
    y !== 0
  ) {
    const next =
      x % y;

    x = y;
    y = next;
  }

  return x || 1;
}


function lcm(
  a: number,
  b: number
): number {
  return (
    Math.abs(
      a * b
    ) /
    gcd(
      a,
      b
    )
  );
}


function makeFraction(
  numerator: number,
  denominator: number
): Fraction {
  if (
    denominator === 0
  ) {
    throw new Error(
      "Denominator cannot be zero."
    );
  }

  const sign =
    denominator < 0
      ? -1
      : 1;

  const adjustedNumerator =
    numerator *
    sign;

  const adjustedDenominator =
    Math.abs(
      denominator
    );

  const divisor =
    gcd(
      adjustedNumerator,
      adjustedDenominator
    );

  return {
    numerator:
      adjustedNumerator /
      divisor,

    denominator:
      adjustedDenominator /
      divisor,
  };
}


function rawFraction(
  numerator: number,
  denominator: number
): Fraction {
  return {
    numerator,
    denominator,
  };
}


function addFractions(
  a: Fraction,
  b: Fraction
): Fraction {
  return makeFraction(
    a.numerator *
      b.denominator +
      b.numerator *
        a.denominator,

    a.denominator *
      b.denominator
  );
}


function subtractFractions(
  a: Fraction,
  b: Fraction
): Fraction {
  return makeFraction(
    a.numerator *
      b.denominator -
      b.numerator *
        a.denominator,

    a.denominator *
      b.denominator
  );
}


function multiplyFractions(
  a: Fraction,
  b: Fraction
): Fraction {
  return makeFraction(
    a.numerator *
      b.numerator,

    a.denominator *
      b.denominator
  );
}


function divideFractions(
  a: Fraction,
  b: Fraction
): Fraction {
  return makeFraction(
    a.numerator *
      b.denominator,

    a.denominator *
      b.numerator
  );
}


function compareFractions(
  a: Fraction,
  b: Fraction
): number {
  return (
    a.numerator *
      b.denominator -
    b.numerator *
      a.denominator
  );
}


function mixedToImproper(
  mixed:
    MixedNumber
): Fraction {
  return makeFraction(
    mixed.whole *
      mixed.fraction.denominator +
      mixed.fraction.numerator,

    mixed.fraction.denominator
  );
}


function randomInt(
  min: number,
  max: number
): number {
  return (
    Math.floor(
      Math.random() *
        (
          max -
          min +
          1
        )
    ) +
    min
  );
}


function randomProperFraction(
  profile:
    FractionDifficultyProfile
): Fraction {
  for (
    let attempt = 0;
    attempt < 200;
    attempt += 1
  ) {
    const denominator =
      randomInt(
        profile.minDenominator,
        profile.maxDenominator
      );

    const numerator =
      randomInt(
        1,
        denominator - 1
      );

    const fraction =
      makeFraction(
        numerator,
        denominator
      );

    if (
      fraction.numerator <= 0 ||
      fraction.numerator >=
        fraction.denominator
    ) {
      continue;
    }

    /**
     * The reduced denominator is what
     * the pupil actually sees.
     */
    if (
      fraction.denominator <
        profile.minDenominator ||
      fraction.denominator >
        profile.maxDenominator
    ) {
      continue;
    }

    return fraction;
  }

  return makeFraction(
    1,
    profile.minDenominator
  );
}


function randomMixedNumber(
  profile:
    FractionDifficultyProfile
): MixedNumber {
  return {
    whole:
      randomInt(
        profile.minWholeNumber,
        profile.maxWholeNumber
      ),

    fraction:
      randomProperFraction(
        profile
      ),
  };
}


function hasCrossCancellation(
  a: Fraction,
  b: Fraction
): boolean {
  return (
    gcd(
      a.numerator,
      b.denominator
    ) > 1 ||
    gcd(
      b.numerator,
      a.denominator
    ) > 1
  );
}


function formatFraction(
  fraction:
    Fraction
): string {
  if (
    fraction.denominator ===
    1
  ) {
    return String(
      fraction.numerator
    );
  }

  return (
    `${fraction.numerator}/${fraction.denominator}`
  );
}


function formatMixedNumber(
  mixed:
    MixedNumber
): string {
  return (
    `${mixed.whole} ${formatFraction(
      mixed.fraction
    )}`
  );
}


function formatAnswer(
  fraction:
    Fraction
): string {
  if (
    fraction.denominator ===
    1
  ) {
    return String(
      fraction.numerator
    );
  }

  if (
    Math.abs(
      fraction.numerator
    ) >
    fraction.denominator
  ) {
    const whole =
      Math.trunc(
        fraction.numerator /
          fraction.denominator
      );

    const remainder =
      Math.abs(
        fraction.numerator %
          fraction.denominator
      );

    if (
      remainder === 0
    ) {
      return String(
        whole
      );
    }

    return (
      `${whole} ${remainder}/${fraction.denominator}`
    );
  }

  return formatFraction(
    fraction
  );
}


function getFinalAnswerType(
  fraction:
    Fraction
): string {
  if (
    fraction.denominator ===
    1
  ) {
    return "INTEGER";
  }

  if (
    Math.abs(
      fraction.numerator
    ) <
    fraction.denominator
  ) {
    return "PROPER_FRACTION";
  }

  return "MIXED_NUMBER";
}


function countSourceQuestionsForFamily(
  familyId:
    FractionFamilyId
): number {
  return (
    N5_MATHS_SOURCE_QUESTION_CATALOG
      .filter(
        (question) =>
          question.familyId ===
          familyId
      )
      .length
  );
}


function countOperationForFamily(
  familyId:
    FractionFamilyId,

  operationType:
    FractionOperationType
): number {
  return (
    N5_MATHS_SOURCE_QUESTION_CATALOG
      .filter(
        (question) =>
          question.familyId ===
            familyId &&
          question.operationType ===
            operationType
      )
      .length
  );
}


function pickWeighted<T>(
  items: {
    value: T;
    weight: number;
  }[]
): T {
  const total =
    items.reduce(
      (
        sum,
        item
      ) =>
        sum +
        item.weight,

      0
    );

  let roll =
    Math.random() *
    total;

  for (
    const item
    of items
  ) {
    roll -=
      item.weight;

    if (
      roll <= 0
    ) {
      return item.value;
    }
  }

  return (
    items[
      items.length - 1
    ].value
  );
}


function pickFamilyId():
  FractionFamilyId {
  return pickWeighted(
    FAMILY_IDS.map(
      (familyId) => ({
        value:
          familyId,

        weight:
          Math.max(
            1,
            countSourceQuestionsForFamily(
              familyId
            )
          ),
      })
    )
  );
}


function pickMixedProperOperation():
  | "ADD"
  | "MULTIPLY"
  | "DIVIDE" {
  return pickWeighted([
    {
      value:
        "ADD",

      weight:
        Math.max(
          1,
          countOperationForFamily(
            "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
            "ADD"
          )
        ),
    },

    {
      value:
        "MULTIPLY",

      weight:
        Math.max(
          1,
          countOperationForFamily(
            "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
            "MULTIPLY"
          )
        ),
    },

    {
      value:
        "DIVIDE",

      weight:
        Math.max(
          1,
          countOperationForFamily(
            "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
            "DIVIDE"
          )
        ),
    },
  ]);
}


function candidateFitsDifficulty(args: {
  profile:
    FractionDifficultyProfile;

  answer:
    Fraction;

  rawIntermediate:
    Fraction;

  maxDenominatorInQuestion:
    number;
}): boolean {
  const {
    profile,
    answer,
    rawIntermediate,
    maxDenominatorInQuestion,
  } = args;

  return (
    maxDenominatorInQuestion <=
      profile.maxDenominator &&

    Math.abs(
      rawIntermediate.numerator
    ) <=
      profile.maxIntermediateNumerator &&

    Math.abs(
      rawIntermediate.denominator
    ) <=
      profile.maxIntermediateDenominator &&

    Math.abs(
      answer.numerator
    ) <=
      profile.maxFinalNumerator &&

    answer.denominator <=
      profile.maxFinalDenominator
  );
}


function makeGeneratedQuestion(
  difficulty:
    FractionDifficulty,

  familyId:
    FractionFamilyId,

  operationType:
    FractionOperationType,

  questionText:
    string,

  answer:
    Fraction,

  rawIntermediate:
    Fraction,

  maxDenominatorInQuestion:
    number,

  crossCancellationAvailable:
    boolean,

  workingSummary:
    string,

  numericProfile:
    FractionNumericProfile,

  extraChecks:
    GeneratedFractionQuestion[
      "checks"
    ] = []
): GeneratedFractionQuestion {
  const profile =
    profileForDifficulty(
      difficulty
    );

  const simplifiedIntermediate =
    makeFraction(
      rawIntermediate.numerator,
      rawIntermediate.denominator
    );

  const simplificationRequired =
    simplifiedIntermediate.numerator !==
      rawIntermediate.numerator ||
    simplifiedIntermediate.denominator !==
      rawIntermediate.denominator;

  const maxIntermediateNumerator =
    Math.abs(
      rawIntermediate.numerator
    );

  const maxIntermediateDenominator =
    Math.abs(
      rawIntermediate.denominator
    );

  const nonCalculatorFriendly =
    maxDenominatorInQuestion <=
      SQA_FRACTION_CEILING
        .maxDenominator &&

    maxIntermediateNumerator <=
      SQA_FRACTION_CEILING
        .maxIntermediateNumerator &&

    maxIntermediateDenominator <=
      SQA_FRACTION_CEILING
        .maxIntermediateDenominator &&

    Math.abs(
      answer.numerator
    ) <=
      SQA_FRACTION_CEILING
        .maxFinalNumerator &&

    answer.denominator <=
      SQA_FRACTION_CEILING
        .maxFinalDenominator;

  const difficultyProfilePassed =
    candidateFitsDifficulty({
      profile,
      answer,
      rawIntermediate,
      maxDenominatorInQuestion,
    });

  const sourceCount =
    countSourceQuestionsForFamily(
      familyId
    );

  return {
    id:
      `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

    familyId,

    operationType,

    difficulty,

    questionText,

    answerText:
      formatAnswer(
        answer
      ),

    workingSummary,

    numericProfile,

    sourceEvidenceSummary:
      `${sourceCount} historical source question${
        sourceCount === 1
          ? ""
          : "s"
      } in this family.`,

    checks: [
      {
        label:
          `Difficulty ${difficulty} arithmetic profile`,

        passed:
          difficultyProfilePassed,

        detail:
          [
            `Visible denominators ≤ ${profile.maxDenominator}.`,
            `Raw intermediate ≤ ${profile.maxIntermediateNumerator}/${profile.maxIntermediateDenominator}.`,
            `Final numerator ≤ ${profile.maxFinalNumerator}.`,
            `Final denominator ≤ ${profile.maxFinalDenominator}.`,
          ].join(" "),
      },

      {
        label:
          "National 5 denominator ceiling",

        passed:
          maxDenominatorInQuestion <=
          SQA_FRACTION_CEILING
            .maxDenominator,

        detail:
          `Largest denominator in question: ${maxDenominatorInQuestion}`,
      },

      {
        label:
          "Manageable intermediate values",

        passed:
          maxIntermediateNumerator <=
            SQA_FRACTION_CEILING
              .maxIntermediateNumerator &&
          maxIntermediateDenominator <=
            SQA_FRACTION_CEILING
              .maxIntermediateDenominator,

        detail:
          `Largest raw intermediate: ${maxIntermediateNumerator}/${maxIntermediateDenominator}`,
      },

      {
        label:
          "Tidy final answer",

        passed:
          Math.abs(
            answer.numerator
          ) <=
            SQA_FRACTION_CEILING
              .maxFinalNumerator &&
          answer.denominator <=
            SQA_FRACTION_CEILING
              .maxFinalDenominator,

        detail:
          `Final answer type: ${getFinalAnswerType(
            answer
          )}`,
      },

      {
        label:
          "Non-calculator friendly",

        passed:
          nonCalculatorFriendly,

        detail:
          nonCalculatorFriendly
            ? "Arithmetic remains inside the intended National 5 Paper 1 envelope."
            : "Arithmetic is outside the configured National 5 Paper 1 envelope.",
      },

      ...extraChecks,
    ],

    metrics: {
      maxDenominatorInQuestion,

      maxIntermediateNumerator,

      maxIntermediateDenominator,

      finalAnswerType:
        getFinalAnswerType(
          answer
        ),

      simplificationRequired,

      crossCancellationAvailable,

      nonCalculatorFriendly,
    },
  };
}


function generateMixedProperMultiplication(
  difficulty:
    FractionDifficulty
): GeneratedFractionQuestion {
  const profile =
    profileForDifficulty(
      difficulty
    );

  for (
    let attempt = 0;
    attempt < 1000;
    attempt += 1
  ) {
    const mixed =
      randomMixedNumber(
        profile
      );

    const proper =
      randomProperFraction(
        profile
      );

    const mixedFraction =
      mixedToImproper(
        mixed
      );

    const rawIntermediate =
      rawFraction(
        mixedFraction.numerator *
          proper.numerator,

        mixedFraction.denominator *
          proper.denominator
      );

    const answer =
      multiplyFractions(
        mixedFraction,
        proper
      );

    const crossCancellationAvailable =
      hasCrossCancellation(
        mixedFraction,
        proper
      );

    const maxDenominatorInQuestion =
      Math.max(
        mixed.fraction.denominator,
        proper.denominator
      );

    if (
      !crossCancellationAvailable
    ) {
      continue;
    }

    if (
      !candidateFitsDifficulty({
        profile,
        answer,
        rawIntermediate,
        maxDenominatorInQuestion,
      })
    ) {
      continue;
    }

    if (
      answer.denominator ===
      1
    ) {
      continue;
    }

    const mixedFirst =
      Math.random() >=
      0.5;

    const questionText =
      mixedFirst
        ? `Evaluate ${formatMixedNumber(
            mixed
          )} × ${formatFraction(
            proper
          )}. Give your answer in its simplest form.`
        : `Evaluate ${formatFraction(
            proper
          )} × ${formatMixedNumber(
            mixed
          )}. Give your answer in its simplest form.`;

    return makeGeneratedQuestion(
      difficulty,

      "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",

      "MULTIPLY",

      questionText,

      answer,

      rawIntermediate,

      maxDenominatorInQuestion,

      crossCancellationAvailable,

      "Convert the mixed number to an improper fraction, multiply, then simplify.",

      {
        kind:
          "MIXED_PROPER_MULTIPLY",

        mixed,

        proper,

        mixedImproper:
          mixedFraction,

        displayOrder:
          mixedFirst
            ? "MIXED_THEN_PROPER"
            : "PROPER_THEN_MIXED",

        rawIntermediate,

        answer,
      },

      [
        {
          label:
            "Visible cancellation/simplification",

          passed:
            true,

          detail:
            "The values were accepted only because a cancellation or simplification route exists.",
        },
      ]
    );
  }

  throw new Error(
    `Could not generate a suitable difficulty-${difficulty} mixed-number multiplication question.`
  );
}


function generateMixedProperDivision(
  difficulty:
    FractionDifficulty
): GeneratedFractionQuestion {
  const profile =
    profileForDifficulty(
      difficulty
    );

  for (
    let attempt = 0;
    attempt < 1000;
    attempt += 1
  ) {
    const mixed =
      randomMixedNumber(
        profile
      );

    const proper =
      randomProperFraction(
        profile
      );

    const mixedFraction =
      mixedToImproper(
        mixed
      );

    const reciprocal =
      makeFraction(
        proper.denominator,
        proper.numerator
      );

    const rawIntermediate =
      rawFraction(
        mixedFraction.numerator *
          reciprocal.numerator,

        mixedFraction.denominator *
          reciprocal.denominator
      );

    const answer =
      divideFractions(
        mixedFraction,
        proper
      );

    const crossCancellationAvailable =
      hasCrossCancellation(
        mixedFraction,
        reciprocal
      );

    const maxDenominatorInQuestion =
      Math.max(
        mixed.fraction.denominator,
        proper.denominator
      );

    if (
      !crossCancellationAvailable
    ) {
      continue;
    }

    if (
      !candidateFitsDifficulty({
        profile,
        answer,
        rawIntermediate,
        maxDenominatorInQuestion,
      })
    ) {
      continue;
    }

    if (
      answer.denominator ===
      1
    ) {
      continue;
    }

    const questionText =
      `Evaluate ${formatMixedNumber(
        mixed
      )} ÷ ${formatFraction(
        proper
      )}. Give your answer in its simplest form.`;

    return makeGeneratedQuestion(
      difficulty,

      "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",

      "DIVIDE",

      questionText,

      answer,

      rawIntermediate,

      maxDenominatorInQuestion,

      crossCancellationAvailable,

      "Convert the mixed number to an improper fraction, multiply by the reciprocal, then simplify.",

      {
        kind:
          "MIXED_PROPER_DIVIDE",

        mixed,

        proper,

        mixedImproper:
          mixedFraction,

        reciprocal,

        rawIntermediate,

        answer,
      },

      [
        {
          label:
            "Reciprocal step remains tidy",

          passed:
            true,

          detail:
            "The reciprocal multiplication was accepted only if the resulting values stayed manageable.",
        },
      ]
    );
  }

  throw new Error(
    `Could not generate a suitable difficulty-${difficulty} mixed-number division question.`
  );
}


function generateMixedProperAddition(
  difficulty:
    FractionDifficulty
): GeneratedFractionQuestion {
  const profile =
    profileForDifficulty(
      difficulty
    );

  for (
    let attempt = 0;
    attempt < 1000;
    attempt += 1
  ) {
    const mixed =
      randomMixedNumber(
        profile
      );

    const proper =
      randomProperFraction(
        profile
      );

    const commonDenominator =
      lcm(
        mixed.fraction.denominator,
        proper.denominator
      );

    if (
      commonDenominator >
      profile.maxCommonDenominator
    ) {
      continue;
    }

    if (
      mixed.fraction.denominator ===
      proper.denominator
    ) {
      continue;
    }

    const mixedFraction =
      mixedToImproper(
        mixed
      );

    const rawIntermediate =
      rawFraction(
        mixedFraction.numerator *
          proper.denominator +
          proper.numerator *
            mixedFraction.denominator,

        mixedFraction.denominator *
          proper.denominator
      );

    const answer =
      addFractions(
        mixedFraction,
        proper
      );

    const maxDenominatorInQuestion =
      Math.max(
        mixed.fraction.denominator,
        proper.denominator
      );

    if (
      !candidateFitsDifficulty({
        profile,
        answer,
        rawIntermediate,
        maxDenominatorInQuestion,
      })
    ) {
      continue;
    }

    if (
      answer.denominator ===
      1
    ) {
      continue;
    }

    const questionText =
      `Evaluate ${formatMixedNumber(
        mixed
      )} + ${formatFraction(
        proper
      )}.`;

    return makeGeneratedQuestion(
      difficulty,

      "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",

      "ADD",

      questionText,

      answer,

      rawIntermediate,

      maxDenominatorInQuestion,

      false,

      "Use a common denominator, add the fractional parts, then write the answer tidily.",

      {
        kind:
          "MIXED_PROPER_ADD",

        mixed,

        proper,

        mixedImproper:
          mixedFraction,

        commonDenominator,

        rawIntermediate,

        answer,
      },

      [
        {
          label:
            "Manageable common denominator",

          passed:
            commonDenominator <=
            profile.maxCommonDenominator,

          detail:
            `Common denominator: ${commonDenominator}`,
        },
      ]
    );
  }

  throw new Error(
    `Could not generate a suitable difficulty-${difficulty} mixed-number addition question.`
  );
}


function generateMixedMixedSubtraction(
  difficulty:
    FractionDifficulty
): GeneratedFractionQuestion {
  const profile =
    profileForDifficulty(
      difficulty
    );

  for (
    let attempt = 0;
    attempt < 1000;
    attempt += 1
  ) {
    const first =
      randomMixedNumber(
        profile
      );

    const second =
      randomMixedNumber(
        profile
      );

    const firstFraction =
      mixedToImproper(
        first
      );

    const secondFraction =
      mixedToImproper(
        second
      );

    if (
      compareFractions(
        firstFraction,
        secondFraction
      ) <= 0
    ) {
      continue;
    }

    if (
      first.fraction.denominator ===
      second.fraction.denominator
    ) {
      continue;
    }

    const commonDenominator =
      lcm(
        first.fraction.denominator,
        second.fraction.denominator
      );

    if (
      commonDenominator >
      profile.maxCommonDenominator
    ) {
      continue;
    }

    const rawIntermediate =
      rawFraction(
        firstFraction.numerator *
          secondFraction.denominator -
          secondFraction.numerator *
            firstFraction.denominator,

        firstFraction.denominator *
          secondFraction.denominator
      );

    const answer =
      subtractFractions(
        firstFraction,
        secondFraction
      );

    const maxDenominatorInQuestion =
      Math.max(
        first.fraction.denominator,
        second.fraction.denominator
      );

    if (
      answer.numerator <=
      0
    ) {
      continue;
    }

    if (
      answer.denominator ===
      1
    ) {
      continue;
    }

    if (
      !candidateFitsDifficulty({
        profile,
        answer,
        rawIntermediate,
        maxDenominatorInQuestion,
      })
    ) {
      continue;
    }

    const questionText =
      `Evaluate ${formatMixedNumber(
        first
      )} − ${formatMixedNumber(
        second
      )}.`;

    return makeGeneratedQuestion(
      difficulty,

      "NUM_FRACTIONS_MIXED_NUMBER_WITH_MIXED_NUMBER",

      "SUBTRACT",

      questionText,

      answer,

      rawIntermediate,

      maxDenominatorInQuestion,

      false,

      "Convert or handle the mixed numbers, use a common denominator, subtract, then simplify.",

      {
        kind:
          "MIXED_MIXED_SUBTRACT",

        first,

        second,

        firstImproper:
          firstFraction,

        secondImproper:
          secondFraction,

        commonDenominator,

        rawIntermediate,

        answer,
      },

      [
        {
          label:
            "Positive result",

          passed:
            true,

          detail:
            "The first mixed number is larger than the second.",
        },

        {
          label:
            "Manageable common denominator",

          passed:
            commonDenominator <=
            profile.maxCommonDenominator,

          detail:
            `Common denominator: ${commonDenominator}`,
        },
      ]
    );
  }

  throw new Error(
    `Could not generate a suitable difficulty-${difficulty} mixed-number subtraction question.`
  );
}


function generateBracketedFractionExpression(
  difficulty:
    FractionDifficulty
): GeneratedFractionQuestion {
  const profile =
    profileForDifficulty(
      difficulty
    );

  for (
    let attempt = 0;
    attempt < 1000;
    attempt += 1
  ) {
    const multiplier =
      randomProperFraction(
        profile
      );

    const first =
      randomProperFraction(
        profile
      );

    const second =
      randomProperFraction(
        profile
      );

    if (
      first.denominator ===
      second.denominator
    ) {
      continue;
    }

    const commonDenominator =
      lcm(
        first.denominator,
        second.denominator
      );

    if (
      commonDenominator >
      profile.maxCommonDenominator
    ) {
      continue;
    }

    const bracketSum =
      addFractions(
        first,
        second
      );

    if (
      bracketSum.numerator >=
      bracketSum.denominator *
        2
    ) {
      continue;
    }

    const rawIntermediate =
      rawFraction(
        multiplier.numerator *
          bracketSum.numerator,

        multiplier.denominator *
          bracketSum.denominator
      );

    const answer =
      multiplyFractions(
        multiplier,
        bracketSum
      );

    const simplifiedRaw =
      makeFraction(
        rawIntermediate.numerator,
        rawIntermediate.denominator
      );

    const simplificationRequired =
      simplifiedRaw.denominator !==
        rawIntermediate.denominator ||
      simplifiedRaw.numerator !==
        rawIntermediate.numerator;

    const maxDenominatorInQuestion =
      Math.max(
        multiplier.denominator,
        first.denominator,
        second.denominator
      );

    if (
      !simplificationRequired
    ) {
      continue;
    }

    if (
      answer.numerator >=
      answer.denominator
    ) {
      continue;
    }

    if (
      !candidateFitsDifficulty({
        profile,
        answer,
        rawIntermediate,
        maxDenominatorInQuestion,
      })
    ) {
      continue;
    }

    const questionText =
      `Evaluate ${formatFraction(
        multiplier
      )} × (${formatFraction(
        first
      )} + ${formatFraction(
        second
      )}). Give your answer in its simplest form.`;

    return makeGeneratedQuestion(
      difficulty,

      "NUM_FRACTIONS_BRACKETED_SUM_WITH_FRACTION_MULTIPLIER",

      "BRACKETED_SUM_AND_MULTIPLY",

      questionText,

      answer,

      rawIntermediate,

      maxDenominatorInQuestion,

      hasCrossCancellation(
        multiplier,
        bracketSum
      ),

      "Evaluate the bracket first, multiply by the outside fraction, then simplify.",

      {
        kind:
          "BRACKETED_SUM_AND_MULTIPLY",

        multiplier,

        first,

        second,

        bracketSum,

        commonDenominator,

        rawIntermediate,

        answer,
      },

      [
        {
          label:
            "Manageable bracket denominator",

          passed:
            commonDenominator <=
            profile.maxCommonDenominator,

          detail:
            `Bracket common denominator: ${commonDenominator}`,
        },

        {
          label:
            "Final simplification required",

          passed:
            simplificationRequired,

          detail:
            "The final multiplication produces a simplifiable fraction.",
        },
      ]
    );
  }

  throw new Error(
    `Could not generate a suitable difficulty-${difficulty} bracketed fraction question.`
  );
}


function generateRequestedOperation(
  operationType:
    FractionOperationType,

  difficulty:
    FractionDifficulty
): GeneratedFractionQuestion {
  switch (
    operationType
  ) {
    case "ADD":
      return (
        generateMixedProperAddition(
          difficulty
        )
      );

    case "SUBTRACT":
      return (
        generateMixedMixedSubtraction(
          difficulty
        )
      );

    case "MULTIPLY":
      return (
        generateMixedProperMultiplication(
          difficulty
        )
      );

    case "DIVIDE":
      return (
        generateMixedProperDivision(
          difficulty
        )
      );

    case "BRACKETED_SUM_AND_MULTIPLY":
      return (
        generateBracketedFractionExpression(
          difficulty
        )
      );

    default: {
      const exhaustiveCheck:
        never =
          operationType;

      throw new Error(
        `Unsupported fraction operation: ${exhaustiveCheck}`
      );
    }
  }
}


export function generateN5MathsFractionQuestion(
  options:
    FractionGeneratorOptions = {}
): GeneratedFractionQuestion {
  const difficulty =
    options.difficulty ??
    2;

  /**
   * Explicit concept generation.
   *
   * When the teacher has selected a specific
   * operation, generate that operation directly.
   * No random retry/filter layer is required.
   */
  if (
    options.operationType
  ) {
    return (
      generateRequestedOperation(
        options.operationType,
        difficulty
      )
    );
  }

  /**
   * General "Fraction operations" generation.
   *
   * Historical source frequency still influences
   * which broad family/operation is selected.
   */
  const familyId =
    pickFamilyId();

  if (
    familyId ===
    "NUM_FRACTIONS_MIXED_NUMBER_WITH_MIXED_NUMBER"
  ) {
    return (
      generateMixedMixedSubtraction(
        difficulty
      )
    );
  }

  if (
    familyId ===
    "NUM_FRACTIONS_BRACKETED_SUM_WITH_FRACTION_MULTIPLIER"
  ) {
    return (
      generateBracketedFractionExpression(
        difficulty
      )
    );
  }

  const operation =
    pickMixedProperOperation();

  return (
    generateRequestedOperation(
      operation,
      difficulty
    )
  );
}


export function generateN5MathsFractionSamples(
  sampleCount = 20,

  options:
    FractionGeneratorOptions = {}
): GeneratedFractionQuestion[] {
  return Array.from(
    {
      length:
        sampleCount,
    },

    () =>
      generateN5MathsFractionQuestion(
        options
      )
  );
}